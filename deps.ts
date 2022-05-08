export { ensureFile } from 'https://deno.land/std@0.137.0/fs/ensure_file.ts';
export { join } from 'https://deno.land/std@0.137.0/path/mod.ts';
export { Webview } from 'https://deno.land/x/webview@0.7.0-pre.1/mod.ts';
export { WebSocketServer } from 'https://deno.land/x/websocket@v0.1.4/mod.ts';
export type { WebSocketClient } from 'https://deno.land/x/websocket@v0.1.4/mod.ts';
// export * as Plotly from 'https://cdn.skypack.dev/plotly.js@2.11?dts'
// export * as Plotly from 'https://esm.sh/plotly.js@2.8?target=deno'
export * as ChartJs from 'https://cdn.skypack.dev/chart.js@3.7?dts';
import ensureVersion from 'https://deno.land/x/ensure_version@1.0.3/mod.ts';

ensureVersion('>=1.20');
