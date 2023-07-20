<p align="center">
	<img align="center" src="https://raw.githubusercontent.com/JOTSR/Deplot/main/public/logo.png"  />
	<br>
</p>

# Deplot

Simple and complete Plot gui module for [Deno](https://deno.land) local scripts
to provide a helper for science computing.

[![deno module](https://shield.deno.dev/x/deplot)](https://deno.land/x/deplot)
![deno compatibility](https://shield.deno.dev/deno/^1.20)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/deplot/mod.ts)

## Dependencies

Use [Webview](https://deno.land/x/webview@0.7.0-pre.1) for window managing and
plots libraries for tracing.

**WARNING**: Still under active development, GChart is not supported,
deplot.screenshot and deplot.update neither.

## Usage

All the modules are exposed in `mod.ts`

```ts
import { Datas, Deplot, Plotly } from 'https://deno.land/x/deplot/mod.ts'

const deplot = new Deplot('Plotly')

const trace: Plotly.Data = {
	x: ['Zebras', 'Lions', 'Pelicans'],
	y: [90, 40, 60],
	type: 'bar',
	name: 'New York Zoo',
}

const layout: Partial<Plotly.Layout> = {
	title: 'Hide the Modebar',
	showlegend: true,
}

const datas: Datas = { data: [trace], layout, config: { editable: true } }

deplot.plot(datas, { title: 'My plot', size: [800, 600] })

const trace2: Plotly.Data = {
	x: [1, 2, 3, 4, 5],
	y: [4, 0, 4, 6, 8],
	mode: 'lines+markers',
	type: 'scatter',
}

const datas2 = { data: [trace2], layout }

deplot.plot(datas, { title: 'My second plot', size: [450, 450] })
```

[Documentation](https://doc.deno.land/https://deno.land/x/deplot/mod.ts)

## Examples

[Plotly.js](https://plotly.com/javascript/)

```sh
deno run --allow-read --allow-write --allow-net --allow-run --allow-env --allow-ffi --unstable --no-check https://deno.land/x/deplot/examples/plotly.ts
```

[Chart.js](https://www.chartjs.org/docs/3.7.0/)

```sh
deno run --allow-read --allow-write --allow-net --allow-run --allow-env --allow-ffi --unstable --no-check https://deno.land/x/deplot/examples/chartjs.ts
```
