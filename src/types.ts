import { ChartJs } from '../deps.ts'
import * as Plotly from '../vendor/Plotly/index.d.ts'

export type { ChartJs, Plotly }

export type PlotEngine = 'ChartJs' | 'Plotly' | 'GCharts'

type ChartJsDatas = ChartJs.ChartConfiguration
type PlotlyDatas = {
	data: Plotly.Data[]
	layout?: Partial<Plotly.Layout>
	config?: Partial<Plotly.Config>
}

export type Datas = ChartJsDatas | PlotlyDatas

export type Config = { title?: string; size: [number, number] }
export type Plot = { _id: string; datas: Datas; config: Config }
export type DeplotOptions = {
	closeCallback: () => unknown
}

export type WebSocketMessage = {
	id: string
	payload:
		| { datas: Datas; config: Config }
		| { action: 'close' | 'screenshot' }
		| { event: 'success' | 'error' }
	result: string
}
