export { ensureFile } from 'https://deno.land/std@0.195.0/fs/ensure_file.ts'
export * as path from 'https://deno.land/std@0.195.0/path/mod.ts'
export * as Base64 from 'https://deno.land/std@0.195.0/encoding/base64.ts'
// TODO move to next WebUI release
export * as ChartJs from 'https://cdn.skypack.dev/chart.js@3.7?dts'
export * as esbuild from 'https://deno.land/x/esbuild@v0.18.15/mod.js'
export { default as httpFetch } from 'https://deno.land/x/esbuild_plugin_http_fetch@v1.0.3/index.js'
export { WebUI } from 'https://raw.githubusercontent.com/webui-dev/deno-webui/3ba9bbc9ffd9de870a12b946a7515fa7ede7d38e/mod.ts'
import ensureVersion from 'https://deno.land/x/ensure_version@1.3.0/mod.ts'

ensureVersion('>=1.30', false)
