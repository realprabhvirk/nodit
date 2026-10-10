import { test,expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { boot,preRound } from './helpers';
test('visual review: both orientations and themes, icon sizes and safe UI bounds',async({page},info)=>{
  test.setTimeout(90000);
  for(const theme of ['light','dark'] as const) {
    await page.emulateMedia({colorScheme:theme});
    await boot(page,{theme});
    const prefix=`design/screens/${info.project.name.startsWith('portrait')?'portrait':'landscape'}-${theme}`;
    await mkdir('design/screens',{recursive:true});
    const snap=async(name:string)=>{await page.waitForTimeout(450);await page.screenshot({path:`${prefix}-${name}.png`});};
    await snap('play');
    await page.locator('.deck-tile',{hasText:'SPORRENCESON'}).scrollIntoViewIfNeeded();await snap('play-bottom');
    const overflows=await page.locator('.deck-tile-name').evaluateAll(els=>els.filter(el=>el.scrollWidth>el.clientWidth+1).map(el=>el.textContent));expect(overflows).toEqual([]);
    await page.locator('.deck-tile',{hasText:'SPORRENCESON'}).tap();await snap('passcode');await page.locator('.sheet-root.open .sheet-scrim').tap({position:{x:8,y:8}});
    await page.locator('.deck-tile',{hasText:'Animals'}).tap();await snap('deck-sheet');await page.locator('.sheet-root.open .sheet-scrim').tap({position:{x:8,y:8}});
    await preRound(page);await snap('pre-round');await page.locator('.pre-actions .btn-primary').tap();await snap('countdown');
    if(info.project.name.startsWith('portrait')) {await snap('portrait-overlay');await page.setViewportSize({width:844,height:390});}
    await expect(page.locator('.word')).toBeVisible({timeout:6000});await snap('round');await page.keyboard.press('ArrowDown');await snap('nod-flash');await page.waitForTimeout(300);await page.keyboard.press('ArrowUp');await snap('pass-flash');await page.waitForTimeout(300);
    await page.getByRole('button',{name:'End round',exact:true}).first().tap();await snap('end-confirm');await page.locator('.quit-actions .btn-primary').tap();await expect(page.locator('.results')).toBeVisible();
    if(info.project.name.startsWith('portrait'))await page.setViewportSize({width:390,height:844});await snap('results');await page.locator('.results-actions .btn-secondary').tap();
    await page.locator('.tabbar button').nth(1).tap();await snap('decks');await page.getByRole('button',{name:'New deck',exact:true}).tap();await snap('new-editor');await page.getByRole('button',{name:'Cancel',exact:true}).tap();
    await page.locator('.tab-view:not([hidden]) .row',{hasText:'Animals'}).tap();await snap('preview');await page.locator('.sheet-root.open .sheet-scrim').tap({position:{x:8,y:8}});
    await page.locator('.tabbar button').nth(2).tap();await snap('settings');await page.getByRole('button',{name:'Test tilt',exact:true}).tap();await snap('tilt-test');await page.getByRole('button',{name:'Done',exact:true}).first().tap();
    await page.getByRole('button',{name:'Add to Home Screen',exact:true}).tap();await snap('install');await page.getByRole('button',{name:'Got it',exact:true}).tap();
    await page.getByRole('button',{name:/Diagnostics/}).tap();await snap('diagnostics');
  }
});
