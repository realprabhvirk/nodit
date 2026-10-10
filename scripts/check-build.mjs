import { readFileSync,readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const output=process.argv[2] || 'dist';
const html=readFileSync(`${output}/index.html`,'utf8');
assert(/assets\/[^" ]+\.js/.test(html),'HTML must reference bundled JavaScript');
assert(!/(?:src|href)=["'][^"']*\.(?:ts|tsx)(?:[?"'])/.test(html),'Unbuilt source in output');
for (const [, asset] of html.matchAll(/(?:src|href)="([^" ]*assets\/[^" ]+)"/g)) {
  assert(asset.startsWith('./assets/'),'Built assets must use relative URLs');
  readFileSync(`${output}/${asset}`);
}
let code='';
function read(dir) { for(const f of readdirSync(dir,{withFileTypes:true})) {
  const p=`${dir}/${f.name}`; if(f.isDirectory()) read(p); else if(/\.(js|html|json)$/.test(p)) code+=readFileSync(p,'utf8');
}}
read(`${output}/assets`);
code+=html;
const reference=JSON.parse(readFileSync('handoff/decks/sporrenceson.json','utf8'));
const longest=reference.cards.map(c=>typeof c==='string'?c:c.text).sort((a,b)=>b.length-a.length).slice(0,10);
for(const text of longest) assert(!code.includes(text),'Protected card text found in production output');
const manifest=JSON.parse(readFileSync(`${output}/manifest.webmanifest`,'utf8'));
for(const k of ['id','start_url','scope']) assert.equal(manifest[k],'./');
assert.equal(manifest.name,'NOD IT!');
console.log(`${output}: production bundle, private-deck exclusion and relative URLs verified.`);
