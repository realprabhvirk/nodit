import { readFileSync,readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const html=readFileSync('dist/index.html','utf8');
assert(/assets\/[^" ]+\.js/.test(html),'HTML must reference bundled JavaScript');
assert(!html.includes('main.tsx'),'Unbuilt source in output');
let code='';
function read(dir) { for(const f of readdirSync(dir,{withFileTypes:true})) {
  const p=`${dir}/${f.name}`; if(f.isDirectory()) read(p); else if(/\.(js|html|json)$/.test(p)) code+=readFileSync(p,'utf8');
}}
read('dist');
const reference=JSON.parse(readFileSync('handoff/decks/sporrenceson.json','utf8'));
const longest=reference.cards.map(c=>typeof c==='string'?c:c.text).sort((a,b)=>b.length-a.length).slice(0,10);
for(const text of longest) assert(!code.includes(text),'Protected card text found in production output');
const manifest=JSON.parse(readFileSync('dist/manifest.webmanifest','utf8'));
for(const k of ['id','start_url','scope']) assert.equal(manifest[k],'./');
assert.equal(manifest.name,'NOD IT!');
console.log('Production bundle, private-deck exclusion and relative manifest verified.');
