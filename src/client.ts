/// <reference lib="dom" />

import * as ChartJs from 'https://cdn.skypack.dev/chart.js?dts'
import type { webui } from 'https://raw.githubusercontent.com/webui-dev/webui/d169029523b57c4d14e478be8aea96c03a516aef/src/client/webui.ts'
import type * as PlotlyJs from '../vendor/Plotly/index.d.ts'
import type {
	ChartJsDatas,
	Datas,
	PlotEngine,
	PlotlyDatas,
	RequiredDeplotOptions,
} from './types.ts'

declare global {
	const Plotly: typeof PlotlyJs
	const webui: webui
	const DeplotClient: DeplotClient
}

export class DeplotClient {
	constructor() {
		throw new Error('not instanciable')
	}

	static engine: PlotEngine
	static #chartjsChart: ChartJs.Chart
	static #plotlyLayout: Partial<PlotlyJs.Layout>
	static get canvas() {
		return document.querySelector<HTMLCanvasElement>('#plot')!
	}

	static #ctx = this.canvas!.getContext('2d')!

	static set title(title: string) {
		document.title = title
	}

	static set theme(theme: RequiredDeplotOptions['theme']) {
		if (theme === 'auto') {
			if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches) {
				this.theme = 'dark'
			} else {
				this.theme = 'light'
			}
		}
		if (theme === 'light') {
			document.body.classList.remove('theme-dark')
			document.body.classList.add('theme-light')
			if (DeplotClient.engine === 'Plotly') {
				Plotly.relayout(
					DeplotClient.canvas.parentElement!,
					setTheme(theme, this.#plotlyLayout),
				)
				return
			}
		}
		if (theme === 'dark') {
			document.body.classList.remove('theme-light')
			document.body.classList.add('theme-dark')
			if (DeplotClient.engine === 'Plotly') {
				Plotly.relayout(
					DeplotClient.canvas.parentElement!,
					setTheme(theme, this.#plotlyLayout),
				)
				return
			}
		}
	}

	static get theme(): Exclude<RequiredDeplotOptions['theme'], 'auto'> {
		//@ts-ignore values is on classList
		return Array.from(document.body.classList.values())[0].slice(6)
	}

	static set size({ width, height }: { width?: number; height?: number }) {
		globalThis.resizeTo(
			width ?? globalThis.outerWidth,
			height ?? globalThis.outerHeight,
		)
		this.canvas.setAttribute('width', globalThis.innerWidth.toString())
		this.canvas.setAttribute('height', globalThis.innerHeight.toString())
	}

	static get size() {
		return { width: globalThis.outerWidth, height: globalThis.outerHeight }
	}

	static setPosition({ x, y }: { x: number; y: number }) {
		globalThis.moveTo(x, y)
	}

	static plot<T extends PlotEngine>(datas: Datas<T>) {
		if (this.engine === 'ChartJs') {
			this.canvas.style.display = 'block'
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
				//@ts-ignore type missmatch from version specifier
				{ type, data, options } as ChartJsDatas,
			)
			return
		}
		if (this.engine === 'Plotly') {
			this.canvas.style.display = 'none'
			const { data, layout, config } = datas as PlotlyDatas

			this.#plotlyLayout = setTheme(this.theme, layout)

			Plotly.newPlot(
				this.canvas.parentElement!,
				data,
				layout,
				config,
			)
			return
		}
	}

	static async capture() {
		if (this.engine === 'ChartJs') {
			// Force plot to render
			this.#chartjsChart.toBase64Image()
			// Wait for animation to finish
			await new Promise((resolve) => setTimeout(resolve, 1_000))
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

/**
 * Sets the theme of a Plotly chart to either 'dark' or 'light' and updates the
 * layout accordingly.
 * @param theme - Desired theme for the plot.
 * @param {Partial<PlotlyJs.Layout>|undefined} layout - Plotly layout.
 */
function setTheme(
	theme: typeof DeplotClient['theme'],
	layout?: Partial<PlotlyJs.Layout>,
) {
	const bgColor = globalThis.getComputedStyle(document.body).backgroundColor
	const ftColor = globalThis.getComputedStyle(document.body).color

	if (layout === undefined) layout = {}

	if (theme === 'dark') {
		if (!('plot_bgcolor' in layout)) {
			layout.plot_bgcolor = bgColor
		}
		if (!('paper_bgcolor' in layout)) {
			layout.paper_bgcolor = bgColor
		}
		if (!('font' in layout)) {
			layout.font = { ...{ color: ftColor }, ...layout.font }
		}
	}
	return layout
}
