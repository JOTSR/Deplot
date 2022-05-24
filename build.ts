import { esbuild } from './deps.ts';

await Deno.spawn(Deno.execPath(), {
  args: ['bundle', '--no-check', './src/client.ts', './public/client.js'],
});

const html = await Deno.readTextFile('./public/index.html');

const js = await Deno.readTextFile('./public/client.js');
const mjs = (await esbuild.transform(js, { minify: true })).code;
const plotly = await Deno.readTextFile('./vendor/Plotly/plotly-2_11_1.min.js');

const bundle = html
  .replace('<!-- client -->', `<script defer>${mjs}</script>`);

const denoComments = `
  // deno-fmt-ignore-file
  // deno-lint-ignore-file`;

const json = JSON.stringify({ bundle });
await Deno.remove('./public/client.js');
await Deno.writeTextFile(
  './public/bundle.ts',
  `${denoComments} \n export const { bundle } = ${json}`,
);
await Deno.writeTextFile(
  './public/plotly.ts',
  `${denoComments} \n export const { plotly } = ${JSON.stringify({ plotly })}`,
);

Deno.exit();
