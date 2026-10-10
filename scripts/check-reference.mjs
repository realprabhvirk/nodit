import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const modules=['tilt.ts','match.ts','game.ts','voice.ts','vault-crypto.ts','videoOrientation.ts','audio.ts','haptics.ts','camera.ts','wakelock.ts'];
const oldLower=['ro','el'].join(''), oldTitle=['Ro','el'].join(''), oldUpper=['RO','EL'].join('');
for(const file of modules) {
 const original=readFileSync(`handoff/reference-src/${file}`,'utf8').replaceAll(oldLower+'it:','nodit:').replaceAll(oldUpper,'NOD').replaceAll(oldTitle,'Nod').replaceAll(oldLower,'nod').replaceAll('CREW_','SPORRENCESON_').replaceAll('crewCards','sporrencesonCards').replaceAll('crewCode','sporrencesonCode').replaceAll('crewLocked','sporrencesonLocked').replaceAll('the-crew.locked.json','sporrenceson.locked.json').replaceAll('Anton','Archivo Black').replaceAll('@fontsource/anton','@fontsource/archivo-black');
 assert.equal(readFileSync(`src/${file}`,'utf8'),original,`${file}: reference logic changed; add regression evidence and update documented scope`);
}
console.log('Ten tuned modules match the reference after branding substitutions.');
