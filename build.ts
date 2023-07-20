import { Base64, esbuild, httpFetch } from './deps.ts'

// Loading assets
console.log('Loading assets')
const html = await Deno.readTextFile('./public/index.html')
const icon = await Deno.readFile('./public/logo-min.png')
const plotly = await Deno.readTextFile('./vendor/Plotly/plotly-2_11_1.min.js')

// Building client.ts
console.log('Building client.ts')
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

// Bundling index.html
console.log('Bundling index.html')
const bundle = html
	.replace(
		'<!-- client -->',
		`<script type="module">${js}</script>`,
	)
	.replace(
		'__ICON__',
		`data:image/png;base64,${Base64.encode(icon)}`,
	)
await Deno.writeTextFile('./public/bundle.html', bundle)

const denoComments = `
  // deno-fmt-ignore-file
  // deno-lint-ignore-file`

// Cleaning temp files
console.log('Cleaning temp files')
await Deno.remove('./public/bundle.html')
await Deno.remove('./public/client.js')

// Writing bundle
console.log('Writing bundle')
await Deno.writeTextFile(
	'./public/bundle.ts',
	`${denoComments} \n export const { bundle } = ${
		JSON.stringify({ bundle })
	}`,
)

// Writing Plotly bundle
console.log('Writing Plotly bundle')
await Deno.writeTextFile(
	'./public/plotly.ts',
	`${denoComments} \n export const { plotly } = ${
		JSON.stringify({ plotly })
	}`,
)

// Force exit to stop esbuild promises
Deno.exit()
