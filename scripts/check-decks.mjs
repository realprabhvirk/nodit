import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const manifest=readFileSync('handoff/decks/MANIFEST.md','utf8');
const files=readdirSync('src/decks').filter(f=>f.endsWith('.json'));
assert.equal(files.length,9);
for(const file of files) {
  assert.notEqual(file,'sporrenceson.json');
  const line=manifest.split('\n').find(l=>l.startsWith(`| \`${file}\` |`));
  assert(line,`Missing manifest record: ${file}`);
  const expected=line.match(/`([a-f0-9]{64})`/)[1];
  assert.equal(createHash('sha256').update(readFileSync(`src/decks/${file}`)).digest('hex'),expected,file);
}
console.log('All 9 shipped deck hashes match the handoff.');
