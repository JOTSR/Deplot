import {
  ensureFile,
  join,
  lookup,
  serve,
  WebSocketClient,
  WebSocketServer,
} from "../deps.ts";
import { Config, Datas, DeplotOptions, Plot, PlotEngine } from "./types.ts";
import {
  copyObj,
  joinAndEscape,
  parseMessage,
  stringifyMessage,
} from "./helpers.ts";

const root = (() => {
  const base = import.meta.url.split("/").slice(0, -2).join("/");
  if (new URL(import.meta.url).protocol === 'https:') {
    return base
  }
  if (Deno.build.os === "windows") {
    return joinAndEscape(base.replace("file:///", ""));
  }
  return joinAndEscape(base.replace("file://", ""));
})();

async function bundleUI(request: Request): Promise<Response> {
  const file = (new URL(request.url)).pathname;
  if (file.endsWith(".ico")) return new Response(null);
  console.log(root, file)
  return new Response(await Deno.readTextFile(`${root}/public${file}`), {
    headers: {
      "content-type": `${
        lookup(`${root}/public${file}`) ?? "text/plain"
      }; charset=utf-8`,
    },
  });
}

export class Deplot {
  #plotEngine: PlotEngine;
  #options: DeplotOptions;
  #windows: Set<string> = new Set();
  #websockets: Map<string, WebSocketClient> = new Map();
  #wsBuffer: Map<string, { datas: Datas; config: Config }> = new Map();

  constructor(
    plotEngine: PlotEngine,
    options: DeplotOptions = {
      connectMaxTries: 3,
      port: 3123,
      closeCallback: () => undefined,
    },
  ) {
    this.#plotEngine = plotEngine;
    this.#options = { ...options };

    serve(bundleUI, { port: this.#options.port + 1 });

    const wss = new WebSocketServer(options.port);

    wss.on("connection", (ws: WebSocketClient) => {
      ws.on("message", (message: string) => {
        const { id, payload, result } = parseMessage(message);
        if ("event" in payload && payload.event === "success") {
          this.#websockets.set(id, ws);
          const payload = this.#wsBuffer.get(id)!;
          this.#wsBuffer.delete(id);
          const message = stringifyMessage({ id, payload });
          ws.send(message);
        }
        if ("event" in payload && payload.event === "error") {
          this.#wsBuffer.delete(id);
          throw new Error(`Error on connection from plot ${id}: ${result}`);
        }
      });
    });
  }

  plot(datas: Datas, config: Config) /*: Plot*/ {
    config = { title: config.title ?? "deplot", size: config.size };

    let tries = 0;
    const windowId = crypto.randomUUID();
    this.#windows.add(windowId);
    const port = this.#options.port;

    const spawn = async () => {
      const tempDir = joinAndEscape(Deno.cwd(), `temp-deplot-${windowId}`);

      await Deno.mkdir(tempDir);

      const denoRun = [
        joinAndEscape(Deno.execPath()),
        "run --unstable",
        "--allow-net=0.0.0.0,127.0.0.1,localhost",
        "--allow-read --allow-write",
        "--allow-env=PLUGIN_URL,DENO_DIR,LOCALAPPDATA",
        "--allow-ffi",
        "--no-check",
        `${root}/src/server.ts`,
        `${windowId} ${this.#plotEngine} ${String(port)}`,
        `${config.size.join(" ")}`,
      ].join(" ");

      let shell = "bash";
      let args = ["-c", `(cd ${tempDir} && ${denoRun})`];

      if (Deno.build.os === "windows") {
        shell = "cmd";
        args = ["/c", `(cd ${tempDir} && ${denoRun})`];
      }

      Deno.spawn(shell, { args }).then(({ status, stderr }) => {
        if (!status.success) {
          if (tries < this.#options.connectMaxTries) {
            tries++;
            spawn();
          }
          this.#wsBuffer.delete(windowId);
          this.#windows.delete(windowId);
          this.#options.closeCallback();
          Deno.remove(tempDir, { recursive: true });
          throw new Error(
            `Unable to start child process ${windowId} to handle plot UI on ${tries}${
              tries === 1 ? "st" : "th"
            } try => ${new TextDecoder().decode(stderr)}`,
          );
        }

        this.#wsBuffer.delete(windowId);
        this.#windows.delete(windowId);
        this.#options.closeCallback();
        Deno.remove(tempDir, { recursive: true });
      });
    };

    spawn();

    this.#wsBuffer.set(windowId, {
      datas: copyObj(datas),
      config: copyObj(config),
    });

    return { _id: windowId, datas: copyObj(datas), config: copyObj(config) };
  }

  update({ _id, datas, config }: Plot): Plot {
    const message = stringifyMessage({ id: _id, payload: { datas, config } });
    this.#websockets.get(_id)?.send(message);
    return { _id, datas, config };
  }

  close({ _id }: Pick<Plot, "_id">) {
    String(_id);
    throw new Error("Not implemented");
  }

  screenShot(
    { _id }: Pick<Plot, "_id">,
    fileName: string,
    callback: (path: string) => unknown,
  ) {
    const message = stringifyMessage({
      id: _id,
      payload: { action: "screenshot" },
    });
    this.#websockets.get(_id)?.send(message);
    this.#websockets.get(_id)?.on("message", (message: string) => {
      const { payload, result } = parseMessage(message);
      if (result === "error") {
        throw new Error(`Unable to take screenShot: ${payload}`);
      }
      const path = join(Deno.cwd(), fileName);
      ensureFile(path);
      //write file
      callback(path);
      throw new Error("Not implemented");
    });
  }
}
