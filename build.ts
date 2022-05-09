import { datauri, esbuild } from './deps.ts';

await Deno.spawn(Deno.execPath(), {
  args: ['bundle', '--no-check', './src/client.ts', './public/client.js'],
});

const js = await Deno.readTextFile('./public/client.js');
const mjs = (await esbuild.transform(js, { minify: true })).code;

const html = /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" src="${await datauri(
  './public/logo-min.png',
)}">
    <title>Deplot</title>
</head>
<body>
    <span id="deno_args" hidden></span>
    <div id="plot_container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%">
        <canvas id="plot"></canvas>
    </div>
    <script type="module" defer>${mjs}</script>
</body>
</html>`;

await Deno.writeTextFile('./public/bundle.html', html);
Deno.exit();