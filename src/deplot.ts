import {
  ensureFile,
  join,
  serve,
  staticFiles,
  WebSocketClient,
  WebSocketServer,
} from '../deps.ts';
import { Config, Datas, DeplotOptions, Plot, PlotEngine } from './types.ts';
import { copyObj, parseMessage, stringifyMessage } from './helpers.ts';

const serveFiles = (req: Request) =>
  staticFiles.default(`${Deno.cwd()}/public`)({
    request: req,
    respondWith: (r: Response) => r,
  });

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

    //@ts-ignore from example
    serve((req) => serveFiles(req), { addr: `:${options.port + 1}` });

    const wss = new WebSocketServer(options.port);

    wss.on('connection', (ws: WebSocketClient) => {
      ws.on('message', (message: string) => {
        const { id, payload, result } = parseMessage(message);
        if ('event' in payload && payload.event === 'success') {
          this.#websockets.set(id, ws);
          const payload = this.#wsBuffer.get(id)!;
          this.#wsBuffer.delete(id);
          const message = stringifyMessage({ id, payload });
          ws.send(message);
        }
        if ('event' in payload && payload.event === 'error') {
          this.#wsBuffer.delete(id);
          throw new Error(`Error on connection from plot ${id}: ${result}`);
        }
      });
    });
  }

  plot(datas: Datas, config: Config) /*: Plot*/ {
    config = { title: config.title ?? 'deplot', size: config.size };

    let tries = 0;
    const windowId = crypto.randomUUID();
    this.#windows.add(windowId);
    const port = this.#options.port;

    const spawn = async () => {
      await Deno.mkdir(`temp-${windowId}`);

      const denoRun = [
        Deno.execPath(),
        'run --unstable',
        '--allow-net=0.0.0.0,127.0.0.1,localhost',
        '--allow-read --allow-write',
        '--allow-env=PLUGIN_URL,DENO_DIR,LOCALAPPDATA',
        '--allow-ffi',
        `${join(Deno.cwd(), '/src/server.ts')}`,
        `${windowId} ${this.#plotEngine} ${String(port)}`,
        `${config.size.join(' ')}`,
      ].join(' ');

      let shell = 'bash';
      let args = ['-c', `cd temp-${windowId} && ${denoRun}`];

      if (Deno.build.os === 'windows') {
        shell = 'cmd';
        args = ['/c', `cd temp-${windowId} && ${denoRun}`];
      }

      Deno.spawn(shell, { args }).then(({ status, stderr }) => {
        if (!status.success) {
          if (tries < this.#options.connectMaxTries) {
            tries++;
            spawn();
          }
          this.#windows.delete(windowId);
          throw new Error(
            `Unable to start child process ${windowId} to handle plot UI on ${tries}${
              tries === 1 ? 'st' : 'th'
            } try => ${new TextDecoder().decode(stderr)}`,
          );
        }

        this.#wsBuffer.delete(windowId);
        this.#windows.delete(windowId);
        this.#options.closeCallback();
        Deno.remove(`temp-${windowId}`, { recursive: true });
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

  close({ _id }: Pick<Plot, '_id'>) {
    String(_id);
    throw new Error('Not implemented');
  }

  screenShot(
    { _id }: Pick<Plot, '_id'>,
    fileName: string,
    callback: (path: string) => unknown,
  ) {
    const message = stringifyMessage({
      id: _id,
      payload: { action: 'screenshot' },
    });
    this.#websockets.get(_id)?.send(message);
    this.#websockets.get(_id)?.on('message', (message: string) => {
      const { payload, result } = parseMessage(message);
      if (result === 'error') {
        throw new Error(`Unable to take screenShot: ${payload}`);
      }
      const path = join(Deno.cwd(), fileName);
      ensureFile(path);
      //write file
      callback(path);
      throw new Error('Not implemented');
    });
  }
}
