import { readdirSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
// Construct the retired brand expression so this checker can scan itself.
const retired=new RegExp(['ro','el|ro',"e'?l'?d"].join(''),'i');
const exclude=new Set(['.git','handoff','node_modules','dist','test-results','playwright-report']);
const violations=[];
function scan(dir) { for(const item of readdirSync(dir,{withFileTypes:true})) {
  if(exclude.has(item.name)) continue;
  const path=`${dir}/${item.name}`;
  if(item.isDirectory()) scan(path);
  else if(/\.(ts|tsx|js|mjs|css|html|md|json|yml|svg)$/.test(item.name) && retired.test(readFileSync(path,'utf8'))) violations.push(path);
}}
scan('.'); assert.deepEqual(violations,[],'Retired branding outside the handoff');
console.log('Brand strings checked.');
