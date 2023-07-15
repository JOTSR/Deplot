import { Deplot } from '../mod.ts'
import { Datas } from '../src/types.ts'

const deplot = new Deplot('Plotly')

function editablePlot() {
	const trace1: Plotly.Data = {
		x: [0, 1, 2, 3, 4],
		y: [1, 5, 3, 7, 5],
		mode: 'lines+markers',
		type: 'scatter',
	}

	const trace2: Plotly.Data = {
		x: [1, 2, 3, 4, 5],
		y: [4, 0, 4, 6, 8],
		mode: 'lines+markers',
		type: 'scatter',
	}

	const data = [trace1, trace2]
	const layout: Partial<Plotly.Layout> = {
		title: 'Click Here<br>to Edit Chart Title',
	}
	const datas: Datas = { data, layout, config: { editable: true } }

	deplot.plot(datas, { title: 'ChartJs line plot', size: [800, 800] })
}

function barPlot() {
	const trace1: Plotly.Data = {
		x: ['Zebras', 'Lions', 'Pelicans'],
		y: [90, 40, 60],
		type: 'bar',
		name: 'New York Zoo',
	}

	const trace2: Plotly.Data = {
		x: ['Zebras', 'Lions', 'Pelicans'],
		y: [10, 80, 45],
		type: 'bar',
		name: 'San Francisco Zoo',
	}

	const data = [trace1, trace2]
	const layout: Partial<Plotly.Layout> = {
		title: 'Hide the Modebar',
		showlegend: true,
	}
	const datas: Datas = { data, layout, config: { editable: true } }

	const myPlot = deplot.plot(datas, {
		title: 'ChartJs line plot',
		size: [800, 600],
	})

	setTimeout(() => {
		console.log(`closing: ${myPlot._id}`)
		deplot.close(myPlot)
	}, 5000)
}

editablePlot()
barPlot()
