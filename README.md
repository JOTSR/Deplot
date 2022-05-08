<p align="center">
	<img align="center" src="./public/logo.png"  />
	<br>
</p>

# Deplot

Plot window module for [Deno](https://deno.land) local scripts that provide a
helper for science computing.

[![Tags](https://img.shields.io/github/v/release/JOTSR/Deplot)](https://github.com/JOTSR/Deplot/releases)
[![CI Status](https://img.shields.io/github/workflow/status/JOTSR/Deplot/check)](https://github.com/JOTSR/Deplot/actions)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/deplot/mod.ts)

## Dependencies

Use [Astrodon](https://deno.land/x/astrodon) for window managing and plots
libraries for tracing.

## Usage

All the modules are exposed in `mod.ts`

[Documentation](https://doc.deno.land/https/https/deno.land/x/deplot/mod.ts)

## Examples

[Plotly.js](https://plotly.com/javascript/)

```
deno run --allow-ffi --unstable https://deno.land/x/deplot/examples/plotly.ts
```

[Chart.js](https://www.chartjs.org/docs/3.7.0/)

```
deno run --allow-ffi --unstable https://deno.land/x/deplot/examples/chartjs.ts
```

[Google Charts](https://developers.google.com/chart/interactive/docs)

```
deno run --allow-ffi --unstable https://deno.land/x/deplot/examples/gcharts.ts
```
