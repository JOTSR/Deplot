/// <reference lib="dom" />

import * as ChartJs from 'https://cdn.skypack.dev/chart.js?dts'
import type { webui } from 'https://raw.githubusercontent.com/webui-dev/webui/d169029523b57c4d14e478be8aea96c03a516aef/src/client/webui.ts'
import type * as PlotlyJs from '../vendor/Plotly/index.d.ts'

declare global {
	const Plotly: typeof PlotlyJs
	const webui: webui
	const DeplotClient: {
		plot: (datas: Datas, config: Config) => void
		engine: PlotEngine
	}
}

type PlotEngine = 'ChartJs' | 'Plotly' | 'GCharts'

type ChartJsDatas = ChartJs.ChartConfiguration
type PlotlyDatas = {
	data: Plotly.Data[]
	layout?: Partial<Plotly.Layout>
	config?: Partial<Plotly.Config>
}

type Datas = ChartJsDatas | PlotlyDatas
type Config = { title?: string; size: [number, number] }

export class DeplotClient {
	constructor() {
		throw new Error('not instanciable')
	}

	static engine: PlotEngine
	static #chartjsChart: ChartJs.Chart
	static get canvas() {
		return document.querySelector<HTMLCanvasElement>('#plot')!
	}

	static #ctx = this.canvas!.getContext('2d')!

	static plot(datas: Datas, config: Config) {
		document.querySelector('title')!.innerText = config.title!
		globalThis.resizeTo(...config.size)
		this.canvas.setAttribute('width', String(config.size[0]))
		this.canvas.setAttribute('height', String(config.size[1]))

		if (this.engine === 'ChartJs') {
			const registerables = []
			for (const _registerables of ChartJs.registerables) {
				for (const key in _registerables) {
					//@ts-ignore intern ChartJs type
					registerables.push(ChartJs[key])
				}
			}
			ChartJs.Chart.register(...registerables)
			let { type, data, options } = datas as ChartJsDatas
			options ??= {}
			Object.assign(options, { responsive: true })

			this.#chartjsChart = new ChartJs.Chart(
				this.#ctx,
				{ type, data, options } as ChartJsDatas,
			)
			return
		}
		if (this.engine === 'Plotly') {
			const { data, layout, config } = datas as PlotlyDatas
			Plotly.newPlot(
				this.canvas.parentElement!,
				data,
				layout,
				config,
			)
			return
		}
		if (this.engine === 'GCharts') {
			//const plot
			return
		}
	}

	static capture() {
		if (this.engine === 'ChartJs') {
			return this.#chartjsChart.toBase64Image()
		}
		if (this.engine === 'Plotly') {
			return Plotly
				.toImage(
					DeplotClient.canvas.parentElement!,
					{
						width: window.innerWidth,
						height: window.innerHeight,
						format: 'png',
					},
				)
		}
	}
}

//@ts-ignore global for access from backend
globalThis['DeplotClient'] = DeplotClient

addEventListener('resize', () => {
	if (DeplotClient.engine === 'ChartJs') {
		for (const id in ChartJs.Chart.instances) {
			ChartJs.Chart.instances[id].resize()
		}
		return
	}
	if (DeplotClient.engine === 'Plotly') {
		Plotly.relayout(DeplotClient.canvas.parentElement!, {
			width: innerWidth,
			height: innerHeight,
		})
		return
	}
	DeplotClient.canvas.setAttribute('width', String(window.innerWidth))
	DeplotClient.canvas.setAttribute('height', String(window.innerHeight))
})
