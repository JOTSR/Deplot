import { Webview } from 'https://deno.land/x/webview@0.7.0-pre.1/mod.ts';
// import { WebSocketMessage } from './types.ts'

// const indexPath = `file://${Deno.cwd()}/public/index.html

const [id, engine, port, width, height] = Deno.args;

const webview = new Webview(Number(width), Number(height));

const html = /*html*/ `
    <!DOCTYPE html>
    <html>
        <head>
            <title>deplot</title>
        </head>
        <body>
            <div id="plot_container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%">
                <canvas id="plot"></canvas>
            </div>
        </body>
        <script type="module">
            import * as ChartJs from 'https://cdn.skypack.dev/chart.js@3.7'
            //import * as Plotly from 'https://cdn.skypack.dev/plotly.js@2.11'
            //import * as GCharts from 'cdn?'
            
            const canvas = document.getElementById('plot')
            const ctx = canvas.getContext('2d');
            
            const ws = new WebSocket('ws://localhost:${port}')
            
            ws.onopen = () => {
                const response = {id: '${id}', payload: {event: 'success'}, result: '${id} opened'}
                ws.send(JSON.stringify(response))
            }
            
            ws.onerror = (e) => {
                const response = {id: '${id}', payload: {event: 'error'}, result: String(e)}
                ws.send(JSON.stringify(response))
            }
            
            ws.onmessage = ({data}) => {
                const {id, payload} = JSON.parse(data)
                if (id === '${id}') {
                    document.querySelector('title').innerText = payload.config.title ?? 'deplot'

                    const canvas = document.getElementById('plot')
                    canvas.setAttribute('width', payload.config.size[0])
                    canvas.setAttribute('height', payload.config.size[1])
                    globalThis.resizeTo(...payload.config.size)

                    if ('${engine}' === 'ChartJs') {
                        const registerables = []
                        for (const e of ChartJs.registerables) {
                            for (const k in e) {
                                registerables.push(ChartJs[k])
                            }
                        }
                        ChartJs.Chart.register(...registerables)

                        const plot = new ChartJs.Chart(ctx, payload.datas)
                        return
                    }
                    if ('${engine}' === 'Plotly') {
                        const { data, layout, options } =  payload.datas
                        Plotly.newPlot('plot', data, layout, options)
                        return
                    }
                    if ('${engine}' === 'GCharts') {
                        //const plot
                        return
                    }
                }
            }

            addEventListener('resize', () => {
                if ('${engine}' === 'ChartJs') {
                    for (const id in ChartJs.Chart.instances) {
                        Chart.instances[id].resize()
                    }
                    return
                }
                canvas.setAttribute('width', window.innerWidth)
                canvas.setAttribute('height', window.innerHeight)
            })
        </script>
    </html>
`;

webview.navigate(`data:text/html,${encodeURIComponent(html)}`);

webview.run();
