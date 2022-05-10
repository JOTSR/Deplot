import * as ChartJs from 'https://cdn.skypack.dev/chart.js@3.7?dts';
import * as Plotly from '../vendor/Ploty/index.d.ts';

type PlotEngine = 'ChartJs' | 'Plotly' | 'GCharts';

type ChartJsDatas = ChartJs.ChartConfiguration
type PlotlyDatas = {data: Plotly.Data[], layout?: Partial<Plotly.Layout>, config?: Partial<Plotly.Config>}

type Datas = ChartJsDatas | PlotlyDatas
type Config = { title?: string; size: [number, number] };

type WebSocketMessage = {
  id: string;
  payload:
    | { datas: Datas; config: Config }
    | { action: 'close' | 'screenshot' }
    | { event: 'success' | 'error' };
  result: string;
};

function parseMessage(message: string) {
  return JSON.parse(message) as WebSocketMessage;
}

const id = new URLSearchParams(location.search).get('id')!;
const engine = new URLSearchParams(location.search).get('engine')! as PlotEngine;
const port = new URLSearchParams(location.search).get('port')!;

const canvas = document.querySelector<HTMLCanvasElement>('#plot')!;
const ctx = canvas!.getContext('2d')!;

const ws = new WebSocket(`ws://localhost:${port}`);

ws.onopen = () => {
  const response = {
    id,
    payload: { event: 'success' },
    result: `${id} opened`,
  };
  ws.send(JSON.stringify(response));
};

ws.onerror = (e) => {
  const response = { id, payload: { event: 'error' }, result: String(e) };
  ws.send(JSON.stringify(response));
};

ws.onmessage = ({ data }) => {
  const { id: _id, payload } = parseMessage(data);

  if (_id === id && 'config' in payload) {
    document.querySelector('title')!.innerText = payload.config.title ??
      'deplot';

    canvas.setAttribute('width', String(payload.config.size[0]));
    canvas.setAttribute('height', String(payload.config.size[1]));
    globalThis.resizeTo(...payload.config.size);

    if (engine === 'ChartJs') {
      const registerables = [];
      for (const _registerables of ChartJs.registerables) {
        for (const key in _registerables) {
          //@ts-ignore intern ChartJs type
          registerables.push(ChartJs[key]);
        }
      }
      ChartJs.Chart.register(...registerables);

      new ChartJs.Chart(ctx, payload.datas as ChartJsDatas);
      return;
    }
    if (engine === 'Plotly') {
      
      const { data, layout, config } =  payload.datas as PlotlyDatas
      Plotly.newPlot(canvas.parentElement!, data, layout, config)
      return;
    }
    if (engine === 'GCharts') {
      //const plot
      return;
    }
  }
};

addEventListener('resize', () => {
  if (engine === 'ChartJs') {
    for (const id in ChartJs.Chart.instances) {
      ChartJs.Chart.instances[id].resize();
    }
    return;
  }
  canvas.setAttribute('width', String(window.innerWidth));
  canvas.setAttribute('height', String(window.innerHeight));
});
