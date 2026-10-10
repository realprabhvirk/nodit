import { readFileSync,readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect,it } from 'vitest';
import { open, type Sealed } from './vault-crypto';
import locked from './decks/sporrenceson.locked.json';
import { STRINGS } from './strings';
import { LAB_DEFAULTS, labEnabled } from './labs';
const manifest=readFileSync('handoff/decks/MANIFEST.md','utf8');
it.each(readdirSync('src/decks').filter(f=>f.endsWith('.json')))('keeps %s byte-identical',file=>{
  const hash=createHash('sha256').update(readFileSync(`src/decks/${file}`)).digest('hex');
  expect(manifest.split('\n').find(l=>l.startsWith(`| \`${file}\` |`))).toContain(hash);
});
it('keeps the locked metadata',()=>{expect(locked.count).toBe(54);expect(locked.id).toBe('the-crew');expect(locked.sealed.iter).toBe(600000);});
it.skipIf(!process.env.SPORRENCESON_CODE)('opens the original locked deck with the owner-supplied code',async()=>{
  const plain=await open(locked.sealed as Sealed,process.env.SPORRENCESON_CODE!);expect(plain).not.toBeNull();
  expect(createHash('sha256').update(JSON.stringify(JSON.parse(plain!))).digest('hex')).toBe('a4b33c01422616372d32104ba64c5621a09adc130e819496eb327d6cfee8c138');
});
it('keeps names and action labels consistent',()=>{expect(STRINGS.appName).toBe('NOD IT!');expect(STRINGS.correctPast).toBe("Nod'd");expect(Object.values(STRINGS)).not.toContain('Correct');});
it('keeps all experiments off',()=>{expect(LAB_DEFAULTS.enabled).toBe(false);expect(Object.values(LAB_DEFAULTS.experiments).every(v=>!v)).toBe(true);expect(labEnabled(false,true,true)).toBe(false);expect(labEnabled(true,true,false)).toBe(false);});
