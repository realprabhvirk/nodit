// Serve the repository exactly as a static host would, without Vite or a build.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = process.cwd();
const base = process.env.BASE_PATH || '/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!path.startsWith(base)) throw new Error('Outside mount');
    let file = resolve(root, path.slice(base.length) || 'index.html');
    if (!file.startsWith(root + sep)) throw new Error('Outside root');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    await stat(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(4199, '127.0.0.1', () => console.log(`Serving repository root at ${base}`));
