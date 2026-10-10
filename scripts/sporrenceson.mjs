// Lock / unlock The Crew deck.
//
//   node scripts/sporrenceson.mjs lock <plain-deck.json>   write src/decks/sporrenceson.locked.json
//   node scripts/sporrenceson.mjs unlock                   print the plain deck JSON (to edit and re-lock)
//
// Set SPORRENCESON_CODE securely in the process environment. The code is never stored in the repo. Anyone with the code can run `unlock`.
import { readFileSync, writeFileSync } from 'node:fs';
import { seal, open } from '../src/vault-crypto.ts';

const OUT = new URL('../src/decks/sporrenceson.locked.json', import.meta.url);
const [cmd, input] = process.argv.slice(2);
const code = process.env.SPORRENCESON_CODE;
const a = cmd === 'lock' ? input : code;
const b = code;

if (cmd === 'lock' && a && b) {
  const deck = JSON.parse(readFileSync(a, 'utf8'));
  if (!Array.isArray(deck.cards) || !deck.cards.length) throw new Error('deck.cards is empty');
  if (!/^\d{4,12}$/.test(b)) throw new Error('code must be 4-12 digits (the keypad is numbers only)');
  const sealed = await seal(JSON.stringify(deck.cards), b);
  // Prove it opens before writing anything.
  if ((await open(sealed, b)) !== JSON.stringify(deck.cards)) throw new Error('round trip failed');
  const { cards, ...meta } = deck;
  // codeLength tells the keypad how many digits to wait for. It reveals the
  // length only, never the code.
  writeFileSync(OUT, JSON.stringify({ ...meta, count: cards.length, codeLength: b.length, sealed }, null, 2) + '\n');
  console.log(`locked ${cards.length} cards -> src/decks/sporrenceson.locked.json`);
} else if (cmd === 'unlock' && a) {
  const locked = JSON.parse(readFileSync(OUT, 'utf8'));
  const json = await open(locked.sealed, a);
  if (json == null) throw new Error('wrong code');
  const { sealed, count, codeLength, ...meta } = locked;
  console.log(JSON.stringify({ ...meta, cards: JSON.parse(json) }, null, 2));
} else {
  console.error('usage: sporrenceson.mjs lock <plain.json> | sporrenceson.mjs unlock');
  process.exit(1);
}
