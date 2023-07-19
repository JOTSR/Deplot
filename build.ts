import { esbuild, httpFetch } from './deps.ts'

const html = await Deno.readTextFile('./public/index.html')

await esbuild.build({
	bundle: true,
	target: ['chrome90', 'firefox90', 'safari15'],
	treeShaking: false,
	format: 'esm',
	entryPoints: ['./src/client.ts'],
	outfile: './public/client.js',
	minify: true,
	plugins: [httpFetch],
})
const js = await Deno.readTextFile('./public/client.js')
// const plotly = await Deno.readTextFile('./vendor/Plotly/plotly-2_11_1.min.js')

const bundle = html.replace(
	'<!-- client -->',
	`<script type="module">${js}</script>`,
)
await Deno.writeTextFile('./public/bundle.html', bundle)

const denoComments = `
  // deno-fmt-ignore-file
  // deno-lint-ignore-file`

const json = JSON.stringify({ bundle })
await Deno.remove('./public/bundle.html')
await Deno.remove('./public/client.js')
await Deno.writeTextFile(
	'./public/bundle.ts',
	`${denoComments} \n export const { bundle } = ${json}`,
)
// await Deno.writeTextFile(
// 	'./public/plotly.ts',
// 	`${denoComments} \n export const { plotly } = ${JSON.stringify({ plotly })}`
// )

Deno.exit()
