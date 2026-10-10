import { test,expect } from '@playwright/test';
import { readFileSync,readdirSync } from 'node:fs';
import ts from 'typescript';
import { boot } from './helpers';
const source=ts.transpile(readFileSync('src/ui/fit.ts','utf8'),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
const decks=readdirSync('handoff/decks').filter(f=>f.endsWith('.json')&&!f.startsWith('sporrenceson')).map(f=>JSON.parse(readFileSync(`handoff/decks/${f}`,'utf8')));
test('20 longest cards in every public deck fit without broken words',async({page})=>{
  await boot(page);
  const failures=await page.evaluate(async({source,decks})=>{
    const {fitText}=await import(`data:text/javascript;base64,${btoa(source)}`);
    await document.fonts.load('100px "Archivo Black"');
    const ctx=document.createElement('canvas').getContext('2d')!;const failures:string[]=[];
    for(const deck of decks) for(const text of deck.cards.map((c:any)=>typeof c==='string'?c:c.text).sort((a:string,b:string)=>b.length-a.length).slice(0,20)) {
      for(const [width,height] of [[796,270],[342,620]]) {
        const fit=fitText(text,width,height);ctx.font=`400 ${fit.size}px "Archivo Black"`;
        if(fit.lines.length>3||fit.lines.join(' ')!==text.toUpperCase().split(/\s+/).join(' ')||fit.lines.some((line:string)=>ctx.measureText(line).width>width*.93+1)||fit.size*.95*fit.lines.length>height) failures.push(`${deck.id}: ${width}: ${text}`);
      }
    }return failures;
  },{source,decks});expect(failures).toEqual([]);
});
