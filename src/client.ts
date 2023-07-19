/// <reference lib="dom" />

import * as ChartJs from 'https://cdn.skypack.dev/chart.js?dts'
import type { webui } from 'https://raw.githubusercontent.com/webui-dev/webui/d169029523b57c4d14e478be8aea96c03a516aef/src/client/webui.ts'
import * as Plotly from '../vendor/Plotly/index.d.ts'

declare global {
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

class DeplotClient {
	static engine: PlotEngine
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

			new ChartJs.Chart(
				this.#ctx,
				{ type, data, options } as ChartJsDatas,
			)
			return
		}
		if (this.engine === 'Plotly') {
			const Plotly = window['Plotly']
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
		const Plotly = window['Plotly']
		Plotly.relayout(DeplotClient.canvas.parentElement!, {
			width: innerWidth,
			height: innerHeight,
		})
		return
	}
	DeplotClient.canvas.setAttribute('width', String(window.innerWidth))
	DeplotClient.canvas.setAttribute('height', String(window.innerHeight))
})
