import { describe, expect, it } from 'vitest';
import { validateDeck, parseDeckJSON, exportDeck, parseCardLines } from './deck';
import fixture from '../handoff/decks/animals.json';
describe('deck compatibility', () => {
  it('round-trips an existing export without changing its cards', () => {
    const parsed=validateDeck(fixture); expect(parsed.ok).toBe(true);
    if(parsed.ok) { expect(parsed.deck.cards).toEqual(fixture.cards); expect(parseDeckJSON(exportDeck(parsed.deck))).toEqual(parsed); }
  });
  it.each([
    [null, "That file isn't a deck. Expected a JSON object with a name and cards."],
    [{}, 'The deck needs a "name".'],
    [{name:'x'.repeat(41)},'Deck name is too long (40 characters max).'],
    [{name:'Test'},'The deck needs a "cards" list.'],
    [{name:'Test',cards:[]},'The deck has no cards.'],
    [{name:'Test',cards:Array(1001).fill('A')},'That deck is huge. Keep it under 1000 cards.'],
    [{name:'Test',cards:[0]},'Card 1 isn\'t valid. Use a string or { "text": "...", "aliases": [...] }.'],
    [{name:'Test',cards:[{text:'A',aliases:[3]}]},'Card 1 ("A"): "aliases" must be a list of strings.'],
  ])('preserves validator error %#', (input,error) => expect(validateDeck(input)).toEqual({ok:false,error}));
  it('reports invalid JSON',()=>expect(parseDeckJSON('{')).toEqual({ok:false,error:"Couldn't read that file. It isn't valid JSON."}));
  it('uses safe defaults and trims aliases',()=> {
    expect(validateDeck({name:'  Test Deck  ',color:'constructor',icon:'constructor',cards:[{text:' A ',aliases:[' B ','']}]})).toEqual({ok:true,deck:{id:'test-deck',name:'Test Deck',description:undefined,color:'slate',icon:'cards',cards:[{text:'A',aliases:['B']}]}});
  });
  it('strips custom flags on export',()=>expect(JSON.parse(exportDeck({...fixture,custom:true}))).not.toHaveProperty('custom'));
  it('parses the editor alias syntax',()=>expect(parseCardLines('A | B, C\n\n D')).toEqual([{text:'A',aliases:['B','C']},'D']));
});

it('strips locked metadata on export',()=>expect(JSON.parse(exportDeck({...fixture,lockedCount:54}))).not.toHaveProperty('lockedCount'));
