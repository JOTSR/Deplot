export { ensureFile } from 'https://deno.land/std@0.195.0/fs/ensure_file.ts'
export { serve } from 'https://deno.land/std@0.195.0/http/server.ts'
export * as path from 'https://deno.land/std@0.195.0/path/mod.ts'
// TODO move to next WebUI release
export * as ChartJs from 'https://cdn.skypack.dev/chart.js@3.7?dts'
export * as esbuild from 'https://deno.land/x/esbuild@v0.15.16/mod.js'
export { default as httpFetch } from 'https://deno.land/x/esbuild_plugin_http_fetch@v1.0.3/index.js'
export { WebUI } from 'https://raw.githubusercontent.com/webui-dev/deno-webui/d2442ae3e3d79e87842d8bda8c874826e8eeed69/mod.ts'
import ensureVersion from 'https://deno.land/x/ensure_version@1.3.0/mod.ts'

ensureVersion('>=1.20', false)
