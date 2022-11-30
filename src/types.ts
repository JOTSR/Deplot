import { ChartJs } from '../deps.ts';
import * as Plotly from '../vendor/Plotly/index.d.ts';
import { Webview } from '../deps.ts';

export type { ChartJs, Plotly };

export type PlotEngine = 'ChartJs' | 'Plotly' | 'GCharts';

type ChartJsDatas = ChartJs.ChartConfiguration;
type PlotlyDatas = {
  data: Plotly.Data[];
  layout?: Partial<Plotly.Layout>;
  config?: Partial<Plotly.Config>;
};

export type Datas = ChartJsDatas | PlotlyDatas;

export type Config = { title?: string; size: [number, number] };
export type Plot = { _id: string; datas: Datas; config: Config };
export type DeplotOptions = {
  closeCallback: () => unknown;
  connectMaxTries: number;
  port: number;
};

export type WebSocketMessage = {
  id: string;
  payload:
    | { datas: Datas; config: Config }
    | { action: 'close' | 'screenshot' }
    | { event: 'success' | 'error' };
  result: string;
};

export interface UIWorker extends Worker {
  onmessage<T = unknown>(e: MessageEvent<WorkerThreadMessage<T>>): void;
  postMessage<T = unknown>(
    message: MainThreadMessage<T>,
    transferable: Transferable[],
  ): void;
  postMessage<T = unknown>(
    message: MainThreadMessage<T>,
    options?: StructuredSerializeOptions | undefined,
  ): void;
}

type Actions = keyof Webview | '__constructor__';

export type MainThreadMessage<T = unknown[]> = {
  type: 'terminate';
} | {
  type: 'execute';
  action: { name: Actions; args: T };
};

export type WorkerThreadMessage<T = unknown> = {
  type: 'result';
  return?: { name: Actions; value: T };
} | {
  type: 'terminate';
};
