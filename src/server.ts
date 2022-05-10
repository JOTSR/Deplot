import { Webview } from '../deps.ts';

const [id, engine, port, width, height] = Deno.args;

const webview = new Webview(Number(width), Number(height));

webview.navigate(
  `http://localhost:${
    Number(port) + 1
  }/index.html?id=${id}&engine=${engine}&port=${port}`,
);

webview.run();
