export { App } from 'https://raw.githubusercontent.com/astrodon/astrodon/main/mod.ts'
// export * as Plotly from 'https://cdn.skypack.dev/plotly.js@2.8?dts'
// export * as Plotly from 'https://esm.sh/plotly.js@2.8?target=deno'
export * as ChartJs from 'https://cdn.skypack.dev/chart.js@3.7?dts'

import ensureVersion from 'https://deno.land/x/ensure_version@1.0.3/mod.ts'

ensureVersion(">=1.20")