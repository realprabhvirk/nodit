import { expect,it } from 'vitest';
import { resolveColor, onColor, INK, PAPER, luminance } from './palette';
import { TOKENS } from '../design/tokens/tokens';
it.each(Object.entries(TOKENS.deckMap))('maps legacy colour %s', (old,key)=>expect(resolveColor(old)).toBe(TOKENS.colors[key]));
it('supports current colours, hex and safe fallbacks',()=> {
  expect(resolveColor('cobalt')).toBe(TOKENS.colors.cobalt);
  expect(resolveColor('#aBc123')).toBe('#aBc123');
  expect(resolveColor('constructor')).toBe(TOKENS.colors.slate);
  expect(resolveColor('unknown')).toBe(TOKENS.colors.slate);
});
it('uses the tuned luminance cutoff',()=> { for(const c of Object.values(TOKENS.colors)) expect(onColor(c)).toBe(luminance(c)>0.33?INK:PAPER); });
it('has accessible white text on the success flash',()=>expect(1.05/(luminance(TOKENS.colors.nod)+0.05)).toBeGreaterThanOrEqual(4.5));
