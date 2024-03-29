import { ChartJs } from '../deps.ts'
import * as Plotly from '../vendor/Plotly/index.d.ts'

export type { ChartJs, Plotly }
export type PlotEngine = 'ChartJs' | 'Plotly'

export type ChartJsDatas = ChartJs.ChartConfiguration
export type PlotlyDatas = {
	data: Plotly.Data[]
	layout?: Partial<Plotly.Layout>
	config?: Partial<Plotly.Config>
}

export type Datas<T extends PlotEngine> = T extends 'ChartJs' ? ChartJsDatas
	: PlotlyDatas

export type DeplotOptions = {
	[P in keyof RequiredDeplotOptions]?: Partial<RequiredDeplotOptions[P]>
}

export type RequiredDeplotOptions = {
	title: string
	size: { width: number; height: number }
	theme: 'auto' | 'light' | 'dark'
	// closeCallback?: () => unknown
}
