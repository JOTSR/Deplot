import { ChartJs } from '../deps.ts'
import { plot } from '../mod.ts'

console.log('test')

async function lineChart() {
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
            'December'
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

	const config: ChartJs.ChartConfiguration = {
		type: 'line',
		data: data,
	}

	await plot(ChartJs, 'line chart', config)
}

// async function radarChart() {
// 	const data: ChartJs.ChartData = {
// 		labels: [
// 			'Eating',
// 			'Drinking',
// 			'Sleeping',
// 			'Designing',
// 			'Coding',
// 			'Cycling',
// 			'Running',
// 		],
// 		datasets: [
// 			{
// 				label: 'My First Dataset',
// 				data: [65, 59, 90, 81, 56, 55, 40],
// 				fill: true,
// 				backgroundColor: 'rgba(255, 99, 132, 0.2)',
// 				borderColor: 'rgb(255, 99, 132)',
// 				pointBackgroundColor: 'rgb(255, 99, 132)',
// 				pointBorderColor: '#fff',
// 				pointHoverBackgroundColor: '#fff',
// 				pointHoverBorderColor: 'rgb(255, 99, 132)',
// 			},
// 			{
// 				label: 'My Second Dataset',
// 				data: [28, 48, 40, 19, 96, 27, 100],
// 				fill: true,
// 				backgroundColor: 'rgba(54, 162, 235, 0.2)',
// 				borderColor: 'rgb(54, 162, 235)',
// 				pointBackgroundColor: 'rgb(54, 162, 235)',
// 				pointBorderColor: '#fff',
// 				pointHoverBackgroundColor: '#fff',
// 				pointHoverBorderColor: 'rgb(54, 162, 235)',
// 			},
// 		],
// 	}

// 	const config: ChartJs.ChartConfiguration = {
// 		type: 'radar',
// 		data: data,
// 		options: {
// 			elements: {
// 				line: {
// 					borderWidth: 3,
// 				},
// 			},
// 		},
// 	}

// 	await plot(ChartJs, 'radar chart', config)
// }

// async function pieChart() {
// 	const data: ChartJs.ChartData = {
// 		labels: ['Red', 'Blue', 'Yellow'],
// 		datasets: [
// 			{
// 				label: 'My First Dataset',
// 				data: [300, 50, 100],
// 				backgroundColor: [
// 					'rgb(255, 99, 132)',
// 					'rgb(54, 162, 235)',
// 					'rgb(255, 205, 86)',
// 				],
// 				hoverOffset: 4,
// 			},
// 		],
// 	}

// 	const config: ChartJs.ChartConfiguration = {
// 		type: 'doughnut',
// 		data: data,
// 	}

// 	await plot(ChartJs, 'pie chart', config)
// }

//  await lineChart()
// radarChart()
// pieChart()