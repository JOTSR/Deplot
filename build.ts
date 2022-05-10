import { esbuild } from './deps.ts';

await Deno.spawn(Deno.execPath(), {
  args: ['bundle', '--no-check', './src/client.ts', './public/client.js'],
});

const js = await Deno.readTextFile('./public/client.js');
const mjs = (await esbuild.transform(js, { minify: true })).code;

await Deno.writeTextFile('./public/client.min.js', mjs);

await Deno.remove('./public/client.js');

Deno.exit();
