import { Datas, Deplot } from '../mod.ts'

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
	const datas: Datas<'Plotly'> = { data, layout, config: { editable: true } }

	new Deplot('Plotly', {
		title: 'ChartJs line plot',
		size: { width: 800, height: 800 },
	}).plot(datas)
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
	const datas: Datas<'Plotly'> = { data, layout, config: { editable: true } }

	const deplot = new Deplot('Plotly', {
		title: 'ChartJs line plot',
		size: { width: 700 },
		theme: 'auto',
	})
	deplot.plot(datas)

	setTimeout(() => {
		console.log(`closing plot`)
		deplot.close()
	}, 5000)
}

editablePlot()
barPlot()
Deplot.wait()
