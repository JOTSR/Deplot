/**
 * # Deplot
 *
 * > Simple and complete Plot gui module for [Deno](https://deno.land) local scripts
 * > to provide a helper for science computing.
 *
 * ## Dependencies
 *
 * Use [WebUI](https://deno.land/x/webui) for window managing and plots libraries for tracing.
 *
 * Supports [Plotly.js](https://plotly.com/javascript/) and [Chart.js](https://www.chartjs.org/) for plotting.
 *
 * ## Usage
 *
 * All the modules are exposed in `mod.ts`
 *
 * ```ts
 * import { Datas, Deplot, Plotly } from 'https://deno.land/x/deplot/mod.ts'
 *
 * const barPlot = new Deplot(
 * 	'Plotly',
 * 	{
 * 		title: 'My bar plot',
 * 		size: { width: 800, height: 600 },
 * 	},
 * )
 *
 * const trace: Plotly.Data = {
 * 	x: ['Zebras', 'Lions', 'Pelicans'],
 * 	y: [90, 40, 60],
 * 	type: 'bar',
 * 	name: 'New York Zoo',
 * }
 *
 * const layout: Partial<Plotly.Layout> = {
 * 	title: 'Hide the Modebar',
 * 	showlegend: true,
 * }
 *
 * const datas: Datas = { data: [trace], layout, config: { editable: true } }
 *
 * await barPlot.plot(datas)
 *
 * const trace2: Plotly.Data = {
 * 	x: [1, 2, 3, 4, 5],
 * 	y: [4, 0, 4, 6, 8],
 * 	mode: 'lines+markers',
 * 	type: 'scatter',
 * }
 *
 * const datas2 = { data: [trace2], layout }
 *
 * new Deplot('Plotly').plot(datas)
 * ```
 *
 * ## Examples
 *
 * [Plotly.js](https://plotly.com/javascript/)
 *
 * ```sh
 * deno run --allow-read --allow-write --allow-env --allow-ffi --unstable https://deno.land/x/deplot/examples/plotly.ts
 * ```
 *
 * [Chart.js](https://www.chartjs.org/docs/3.7.0/)
 *
 * ```sh
 * deno run --allow-read --allow-write --allow-env --allow-ffi --unstable https://deno.land/x/deplot/examples/chartjs.ts
 * ```
 *
 * _For flags see [Deno WebUI/Security flags](https://github.com/webui-dev/deno-webui/#security-flags)_
 *
 * @module
 * @license MIT
 */
import { Deplot } from './src/deplot.ts'
export default Deplot

export { Deplot } from './src/deplot.ts'

export type {
	ChartJs,
	Datas,
	DeplotOptions,
	PlotEngine,
	Plotly,
} from './src/types.ts'
