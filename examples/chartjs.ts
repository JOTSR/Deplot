import { ChartJs } from '../deps.ts'
import { Deplot } from '../mod.ts'

const deplot = new Deplot('ChartJs')

function lineChart() {
	const data: ChartJs.ChartData = {
		labels: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		],
		datasets: [
			{
				label: 'My First Dataset',
				data: [65, 59, 80, 81, 56, 55, 40],
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1,
			},
		],
	}

	const datas: ChartJs.ChartConfiguration = {
		type: 'line',
		data: data,
	}

	deplot.plot(datas, { title: 'ChartJs line plot', size: [500, 800] })
}

function barChart() {
	const data: ChartJs.ChartData = {
		labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
		datasets: [{
			label: '# of Votes',
			data: [12, 19, 3, 5, 2, 3],
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
			borderWidth: 1,
		}],
	}

	const datas: ChartJs.ChartConfiguration = {
		type: 'bar',
		data,
		options: {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
	}

	deplot.plot(datas, { title: 'ChartJs bar plot', size: [300, 500] })
}

function radarChart() {
	const data: ChartJs.ChartData = {
		labels: [
			'Eating',
			'Drinking',
			'Sleeping',
			'Designing',
			'Coding',
			'Cycling',
			'Running',
		],
		datasets: [
			{
				label: 'My First Dataset',
				data: [65, 59, 90, 81, 56, 55, 40],
				fill: true,
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgb(255, 99, 132)',
				pointBackgroundColor: 'rgb(255, 99, 132)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgb(255, 99, 132)',
			},
			{
				label: 'My Second Dataset',
				data: [28, 48, 40, 19, 96, 27, 100],
				fill: true,
				backgroundColor: 'rgba(54, 162, 235, 0.2)',
				borderColor: 'rgb(54, 162, 235)',
				pointBackgroundColor: 'rgb(54, 162, 235)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgb(54, 162, 235)',
			},
		],
	}

	const datas: ChartJs.ChartConfiguration = {
		type: 'radar',
		data,
		options: {
			elements: {
				line: {
					borderWidth: 3,
				},
			},
		},
	}

	deplot.plot(datas, { title: 'ChartJs radar plot', size: [400, 400] })
}

function pieChart() {
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

	deplot.plot(datas, { title: 'ChartJs pie plot', size: [500, 500] })
}

lineChart()
barChart()
radarChart()
pieChart()
