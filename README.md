<p align="center">
	<img align="center" src="https://raw.githubusercontent.com/JOTSR/Deplot/main/public/logo.png"  />
	<br>
</p>

# Deplot

Simple and complete Plot gui module for [Deno](https://deno.land) local scripts
to provide a helper for science computing.

[![Tags](https://img.shields.io/github/v/release/JOTSR/Deplot)](https://github.com/JOTSR/Deplot/releases)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/deplot/mod.ts)

<!-- [![CI Status](https://img.shields.io/github/workflow/status/JOTSR/Deplot/check)](https://github.com/JOTSR/Deplot/actions) -->

## Dependencies

Use [Webview](https://deno.land/x/webview@0.7.0-pre.1) for window managing and
plots libraries for tracing.

## Usage

All the modules are exposed in `mod.ts`

```ts
import { Deplot } from 'https://deno.land/x/deplot';
```

[Documentation](https://doc.deno.land/https/https/deno.land/x/deplot/mod.ts)

## Examples

[Plotly.js](https://plotly.com/javascript/)

```sh
deno run --allow-read --allow-write --allow-net --allow-run --allow-env --allow-ffi --unstable --no-check https://deno.land/x/deplot/examples/plotly.ts
```

[Chart.js](https://www.chartjs.org/docs/3.7.0/)

```sh
deno run --allow-read --allow-write --allow-net --allow-run --allow-env --allow-ffi --unstable --no-check https://deno.land/x/deplot/examples/chartjs.ts
```

<!--
[Google Charts](https://developers.google.com/chart/interactive/docs)

```
deno run --allow-ffi --unstable https://deno.land/x/deplot/examples/gcharts.ts
``` -->
