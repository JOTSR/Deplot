export { serve } from 'https://deno.land/std@0.166.0/http/server.ts'
export { ensureFile } from 'https://deno.land/std@0.166.0/fs/ensure_file.ts'
export * as path from 'https://deno.land/std@0.166.0/path/mod.ts'
// TODO move to next WebUI release
export { WebUI } from 'https://raw.githubusercontent.com/webui-dev/deno-webui/2fa3b90752cb67c1bfa8377038db10f0ad413e19/mod.ts'
export * as ChartJs from 'https://cdn.skypack.dev/chart.js@3.7?dts'
import ensureVersion from 'https://deno.land/x/ensure_version@1.3.0/mod.ts'
export * as esbuild from 'https://deno.land/x/esbuild@v0.15.16/mod.js'

ensureVersion('>=1.20', false)
