import { ChartJs, Datas, Deplot } from '../mod.ts'

async function pieChart() {
	const data: ChartJs.ChartData = {
		labels: ['Red', 'Blue', 'Yellow'],
		datasets: [
			{
				label: 'My First Dataset',
				data: [300, 50, 100],
				backgroundColor: [
					'rgb(255, 99, 132)',
					'rgb(54, 162, 235)',
					'rgb(255, 205, 86)',
				],
				hoverOffset: 4,
			},
		],
	}

	const datas: ChartJs.ChartConfiguration = {
		type: 'doughnut',
		data,
	}

	const pie = new Deplot('ChartJs', {
		title: 'ChartJs pie plot',
	})
	await pie.plot(datas)
	await pie.capture(
		'pie.png',
		(path) => console.log(`capture saved to "${path}"`),
	)
}

async function editablePlot() {
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

	const plot = new Deplot('Plotly', {
		title: 'Plotly editable plot',
		size: { width: 800, height: 800 },
	})
	await plot.plot(datas)
	await plot.capture('plotly.png')
}

pieChart()
editablePlot()

Deplot.wait()
