import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
const dir = new URL('../design/source/', import.meta.url);
const out = new URL('../public/icons/', import.meta.url);
const t = JSON.parse(readFileSync(new URL('../design/tokens/tokens.json', import.meta.url),'utf8'));
mkdirSync(out,{recursive:true});
const svg=readFileSync(new URL('icon.svg',dir),'utf8');
const raster = (s) => new Resvg(s).render().asPng();
const master=existsSync(new URL('app-icon-1024.png',dir)) ? readFileSync(new URL('app-icon-1024.png',dir)) : raster(svg);
for(const [name,size] of [['apple-touch-icon.png',180],['icon-192.png',192],['icon-512.png',512],['favicon-32.png',32]]) {
  await sharp(master).resize(size,size).flatten({background:t.colors.cobalt}).png().toFile(new URL(name,out).pathname);
}
const maskMaster=existsSync(new URL('maskable-1024.png',dir)) ? readFileSync(new URL('maskable-1024.png',dir)) : master;
const inner=await sharp(maskMaster).resize(400,400).flatten({background:t.colors.cobalt}).png().toBuffer();
await sharp({create:{width:512,height:512,channels:3,background:t.colors.cobalt}}).composite([{input:inner,left:56,top:56}]).png().toFile(new URL('icon-maskable-512.png',out).pathname);
writeFileSync(new URL('favicon.svg',out),svg);
console.log('Generated six bundled app icons.');
