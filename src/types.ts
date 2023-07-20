import { ChartJs } from '../deps.ts'
import * as Plotly from '../vendor/Plotly/index.d.ts'

export type { ChartJs, Plotly }
export type PlotEngine = 'ChartJs' | 'Plotly'

type ChartJsDatas = ChartJs.ChartConfiguration
type PlotlyDatas = {
	data: Plotly.Data[]
	layout?: Partial<Plotly.Layout>
	config?: Partial<Plotly.Config>
}

export type Datas = ChartJsDatas | PlotlyDatas
export type Config = { title?: string; size: [number, number] }
export type DeplotOptions = {
	closeCallback: () => unknown
}
