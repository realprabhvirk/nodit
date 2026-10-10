import { TOKENS } from '../design/tokens/tokens';
export const PALETTE = {
  ...TOKENS.colors,
  ...Object.fromEntries(Object.entries(TOKENS.deckMap).map(([old, key]) => [old, TOKENS.colors[key]])),
};
export type PaletteName = keyof typeof TOKENS.colors;
export const PALETTE_NAMES = TOKENS.deckNames;
export const INK = TOKENS.colors.ink;
export const PAPER = TOKENS.colors.white;
export const NOD = TOKENS.colors.nod;
export const PASS = TOKENS.colors.coral;
export function resolveColor(c: string): string {
  return Object.prototype.hasOwnProperty.call(PALETTE, c) ? (PALETTE as Record<string,string>)[c] : /^#[0-9a-f]{6}$/i.test(c) ? c : TOKENS.colors.slate;
}
export function luminance(c: string): number {
  const hex = resolveColor(c).slice(1);
  const [r,g,b] = [0,2,4].map(i => parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4);
  return 0.2126*r+0.7152*g+0.0722*b;
}
export function onColor(c: string): string { return luminance(c)>0.33 ? INK : PAPER; }
