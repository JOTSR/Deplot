import { ChartJs } from '../deps.ts';

export type PlotEngine = 'ChartJs' | 'Plotly' | 'GCharts';

export type Config = { title?: string; size: [number, number] };
export type Datas = ChartJs.ChartConfiguration;
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
