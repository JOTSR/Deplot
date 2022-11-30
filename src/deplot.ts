import {
  ensureFile,
  path,
  serve,
  SizeHint,
  WebSocketClient,
  WebSocketServer,
  Webview,
} from '../deps.ts';
import {
  Config,
  Datas,
  DeplotOptions,
  Plot,
  PlotEngine,
  UIWorker,
  WorkerThreadMessage,
} from './types.ts';
import { copyObj, parseMessage, stringifyMessage } from './helpers.ts';

import { bundle } from '../public/bundle.ts';
import { plotly } from '../public/plotly.ts';

function bundleUI(request: Request): Response {
  const fileName = (new URL(request.url)).pathname;
  if (fileName.endsWith('.ico')) return new Response(null);
  if (fileName.endsWith('plotly.js')) {
    return new Response(plotly, {
      headers: {
        'content-type': 'text/javascript; charset=utf-8',
      },
    });
  }
  return new Response(bundle, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  });
}

const workerOptions: WorkerOptions = {
  type: 'module',
  deno: {
    permissions: {
      net: [
        '0.0.0.0',
        '127.0.0.1',
        'localhost',
      ],
      read: true,
      write: true,
      env: [
        'PLUGIN_URL',
        'DENO_DIR',
        'LOCALAPPDATA',
      ],
      ffi: true,
    },
  },
};

export class Deplot {
  #plotEngine: PlotEngine;
  #options: DeplotOptions;
  #windows: Set<string> = new Set();
  #websockets: Map<string, WebSocketClient> = new Map();
  #wsBuffer: Map<string, { datas: Datas; config: Config }> = new Map();
  #workers: Map<string, UIWorker> = new Map();

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

  plot(datas: Datas, config: Config): Plot {
    config = { title: config.title ?? 'deplot', size: config.size };

    const windowId = crypto.randomUUID();
    this.#windows.add(windowId);
    const port = this.#options.port;

    const worker = new Worker(
      import.meta.resolve('./worker.ts'),
      workerOptions,
    ) as UIWorker;
    this.#workers.set(windowId, worker);

    worker.postMessage<ConstructorParameters<typeof Webview>>({
      type: 'execute',
      action: {
        name: '__constructor__',
        args: [
          false,
          {
            width: config.size[0],
            height: config.size[1],
            hint: SizeHint.MIN,
          },
        ],
      },
    });

    worker.postMessage<Parameters<Webview['navigate']>>({
      type: 'execute',
      action: {
        name: 'navigate',
        args: [
          `http://localhost:${
            port + 1
          }/index.html?id=${windowId}&engine=${this.#plotEngine}&port=${port}`,
        ],
      },
    });

    worker.postMessage<[Webview['title']]>({
      type: 'execute',
      action: {
        name: 'title',
        args: [config.title ?? `Deplot - ${windowId}`],
      },
    });

    worker.postMessage<Parameters<Webview['run']>>({
      type: 'execute',
      action: {
        name: 'run',
        args: [],
      },
    });

    worker.addEventListener(
      'message',
      ({ data }: MessageEvent<WorkerThreadMessage>) => {
        switch (data.type) {
          case 'terminate':
            this.#workers.delete(windowId);
            this.#wsBuffer.delete(windowId);
            this.#windows.delete(windowId);
            this.#options.closeCallback();
            break;
        }
      },
    );

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
    this.#workers.get(_id)?.terminate();
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
      const filePath = path.join(Deno.cwd(), fileName);
      ensureFile(filePath);
      //write file
      callback(filePath);
      throw new Error('Not implemented');
    });
  }
}
