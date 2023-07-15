export { serve } from 'https://deno.land/std@0.166.0/http/server.ts'
export { ensureFile } from 'https://deno.land/std@0.166.0/fs/ensure_file.ts'
export * as path from 'https://deno.land/std@0.166.0/path/mod.ts'
// export { Webview, SizeHint } from 'https://deno.land/x/webview@0.7.5/mod.ts';
//TODO Reuse official webview when windows multiple instances is fixed
export {
	SizeHint,
	Webview,
} from 'https://raw.githubusercontent.com/JOTSR/webview_deno/main/mod.ts'
export { WebSocketServer } from 'https://deno.land/x/websocket@v0.1.4/mod.ts'
export type { WebSocketClient } from 'https://deno.land/x/websocket@v0.1.4/mod.ts'
export * as ChartJs from 'https://cdn.skypack.dev/chart.js@3.7?dts'
import ensureVersion from 'https://deno.land/x/ensure_version@1.3.0/mod.ts'
export * as esbuild from 'https://deno.land/x/esbuild@v0.15.16/mod.js'

ensureVersion('>=1.20', false)
