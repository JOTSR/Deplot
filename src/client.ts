import { ChartJs } from '../deps.ts';
//import * as Plotly from '../deps.ts';
//import * as GCharts from 'cdn?'
import { parseMessage } from './helpers.ts';

const {id, engine, port} = document.querySelector<HTMLElement>('#deno_args')!.dataset as {id: string, engine: string, port: string}

const canvas = document.querySelector<HTMLCanvasElement>('#plot')!
const ctx = canvas!.getContext('2d')!;

const ws = new WebSocket(`ws://localhost:${port}`)

ws.onopen = () => {
    const response = {id, payload: {event: 'success'}, result: `${id} opened`}
    ws.send(JSON.stringify(response))
}

ws.onerror = (e) => {
    const response = {id, payload: {event: 'error'}, result: String(e)}
    ws.send(JSON.stringify(response))
}

ws.onmessage = ({data}) => {
    const {id: _id, payload} = parseMessage(data)
    
    if (_id === id && 'config' in payload) {
        document.querySelector('title')!.innerText = payload.config.title ?? 'deplot'

        canvas.setAttribute('width', String(payload.config.size[0]))
        canvas.setAttribute('height', String(payload.config.size[1]))
        globalThis.resizeTo(...payload.config.size)

        if (engine === 'ChartJs') {
            const registerables = []
            for (const _registerables of ChartJs.registerables) {
                for (const key in _registerables) {
                    //@ts-ignore intern ChartJs type
                    registerables.push(ChartJs[key])
                }
            }
            ChartJs.Chart.register(...registerables)

            new ChartJs.Chart(ctx, payload.datas)
            return
        }
        if (engine === 'Plotly') {
            // const { data, layout, options } =  payload.datas
            // Plotly.newPlot('plot', data, layout, options)
            // return
        }
        if (engine === 'GCharts') {
            //const plot
            return
        }
    }
}

addEventListener('resize', () => {
    if (engine === 'ChartJs') {
        for (const id in ChartJs.Chart.instances) {
            ChartJs.Chart.instances[id].resize()
        }
        return
    }
    canvas.setAttribute('width', String(window.innerWidth))
    canvas.setAttribute('height', String(window.innerHeight))
})