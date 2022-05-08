import { Webview, datauri } from '../deps.ts';

const [id, engine, port, width, height] = Deno.args;

await Deno.copyFile('../public/client.js', `../temp-${id}/client.js`)
await Deno.copyFile('../public/logo.png', `../temp-${id}/logo.png`)

const webview = new Webview(Number(width), Number(height));

const html = await Deno.readTextFile('../public/index.html');

const originalSpan = '<span id="deno_args" hidden></span>';
const span = `<span id="deno_args" data-id="${id}" data-engine="${engine}" data-port="${port}" hidden></span>`;

const originalScript = '<script type="module" defer></script>'
const script = `<script type="module" defer>${await Deno.readTextFile('../public/client.js')}</script>`

const originalLogo = '<link rel="icon" type="image/png">'
const logo = `<link rel="icon" type="image/png" src="${await datauri('../public/logo.png')}">`

const patchedHtml = html
    .replace(originalSpan, span)
    .replace(originalScript, script)
    .replace(originalLogo, logo)

await Deno.writeTextFile(`/${id}.html`, patchedHtml)

webview.navigate(`data:text/html,${encodeURIComponent(patchedHtml)}`);

webview.run();
