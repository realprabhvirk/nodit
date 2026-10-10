import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { differenceCiede2000, wcagContrast } from 'culori';
const t = JSON.parse(readFileSync(new URL('../design/tokens/tokens.json',import.meta.url),'utf8'));
const delta = differenceCiede2000();
const decks = Object.entries(t.deckMap);
let minimum = Infinity;
for (let i=0;i<decks.length;i++) {
  const [name,key] = decks[i];
  for (const flash of ['nod','coral']) {
    const d=delta(t.colors[key],t.colors[flash]); minimum=Math.min(minimum,d);
    assert(d>=12, `${name} / ${flash}: ΔE ${d.toFixed(2)} < 12`);
  }
  for (const [other,otherKey] of decks.slice(i+1)) {
    const d=delta(t.colors[key],t.colors[otherKey]);
    assert(d>=10, `${name} / ${other}: ΔE ${d.toFixed(2)} < 10`);
  }
}
assert(wcagContrast(t.colors.nod,'#FFFFFF')>=4.5,'White text on nod must reach 4.5:1');
console.log(`Deck colours are distinct; minimum flash ΔE ${minimum.toFixed(2)}, nod contrast ${wcagContrast(t.colors.nod,'#FFFFFF').toFixed(2)}:1.`);
