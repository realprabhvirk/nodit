import { chromium } from '@playwright/test';
import { readFileSync, readdirSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
const candidates=[['archivo-black','Archivo Black',400],['bricolage-grotesque','Bricolage Grotesque',800],['unbounded','Unbounded',800]];
const cards=readdirSync('handoff/decks').filter(f=>f.endsWith('.json')&&!f.startsWith('sporrenceson')).flatMap(f=>JSON.parse(readFileSync(`handoff/decks/${f}`)).cards.map(c=>typeof c==='string'?c:c.text)).sort((a,b)=>b.length-a.length).slice(0,20);
const source=ts.transpile(readFileSync('src/ui/fit.ts','utf8'),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined)});
mkdirSync('design/screens/fonts',{recursive:true});
const report=[];
for(const [slug,family,weight] of candidates) {
 const font=readFileSync(`node_modules/@fontsource/${slug}/files/${slug}-latin-${weight}-normal.woff2`);
 assert(font.length<60000,`${family} exceeds font budget`);
 for(const viewport of [{width:844,height:390},{width:390,height:844}]) {
  const page=await browser.newPage({viewport});
  await page.setContent(`<style>@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${font.toString('base64')});font-weight:400}*{box-sizing:border-box}body{margin:0;background:#F4F5F7;color:#0F1B2D;font:14px system-ui}article{width:${viewport.width}px;height:${viewport.height}px;background:#2748E8;color:white;display:flex;align-items:center;justify-content:center;margin-bottom:8px;position:relative}p{position:absolute;left:16px;top:0}h1{margin:0;text-align:center;font-family:'${family}';font-weight:400;line-height:.95;white-space:pre}</style>`);
  await page.evaluate(f=>document.fonts.load(`100px "${f}"`),family);
  const sizes=await page.evaluate(async({source,cards,family,viewport})=>{
   const {fitText}=await import(`data:text/javascript;base64,${btoa(source)}`);
   return cards.map((text,index)=>{
    const fit=fitText(text,viewport.width-48,viewport.height-100,{family});
    const article=document.createElement('article');const label=document.createElement('p');label.textContent=`${family} · ${index+1} · ${fit.size}px`;
    const word=document.createElement('h1');word.textContent=fit.lines.join('\n');word.style.fontSize=`${fit.size}px`;
    article.append(label,word);document.body.append(article);return fit.size;
   });
  },{source,cards,family,viewport});
  // Each card is rendered at the exact target viewport size. Review sheet retains all twenty.
  await page.screenshot({path:`design/screens/fonts/${slug}-${viewport.width}.png`,fullPage:true});
  report.push({family,viewport,bytes:font.length,minimumFontPx:Math.min(...sizes),cards:cards.length});
  await page.close();
 }
}
writeFileSync('design/screens/fonts/measurements.json',JSON.stringify(report,null,2)+'\n');
console.log(report);
await browser.close();
