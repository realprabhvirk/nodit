import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { boot,preRound,startRound,endRound,shot,feed } from './helpers';
const fixture=readFileSync('handoff/decks/animals.json');

test.beforeEach(async({page})=>{
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error') errors.push(message.text());});
  (page as any).__errors=errors;
});
test.afterEach(async({page})=>expect((page as any).__errors).toEqual([]));

test('freeze: quick tabs and sheet dismissal keep taps working',async({page},info)=>{
  await boot(page);await shot(page,info,'play');
  await page.locator('.tabbar button').nth(1).tap();
  await page.waitForTimeout(150);
  await page.locator('.tabbar button').nth(2).tap();
  await expect(page.locator('.tabbar [aria-selected=true]')).toHaveText('Settings');
  await shot(page,info,'settings');
  await page.locator('.tabbar button').nth(0).tap();
  await page.locator('.deck-tile').first().tap(); await shot(page,info,'deck-sheet');
  await page.locator('.sheet-root.open .sheet-scrim').tap({position:{x:8,y:8}});
  await page.waitForTimeout(150);
  await page.locator('.tabbar button').nth(1).tap();
  await expect(page.locator('.tabbar [aria-selected=true]')).toHaveText('Decks');
  await shot(page,info,'decks');
});

test('integ2 and exit: scores, flashes, pause, results and replay',async({page},info)=>{
  await boot(page);await page.setViewportSize({width:844,height:390});await preRound(page);await shot(page,info,'pre-round');
  await page.locator('.pre-actions .btn-primary').tap();await shot(page,info,'countdown');
  await expect(page.locator('.word')).toBeVisible({timeout:6000});await shot(page,info,'round');
  await page.keyboard.press('ArrowDown');await expect(page.locator('.round-score b')).toHaveText('1');await shot(page,info,'nod-flash');
  await page.waitForTimeout(750);await page.keyboard.press('ArrowUp');await shot(page,info,'pass-flash');await page.waitForTimeout(750);
  await page.getByRole('button',{name:'End round',exact:true}).first().tap();await shot(page,info,'end-confirm');
  const time=await page.locator('.round-timer').textContent();await page.keyboard.press('ArrowDown');await page.waitForTimeout(1100);
  await expect(page.locator('.round-timer')).toHaveText(time!);await expect(page.locator('.round-score b')).toHaveText('1');
  await page.getByRole('button',{name:'Keep playing'}).tap();
  await page.setViewportSize({width:390,height:844});await expect(page.getByText("Clock's paused until you do.")).toBeVisible();await shot(page,info,'portrait-overlay');
  await page.setViewportSize({width:844,height:390});await endRound(page);
  await expect(page.locator('.results')).toBeVisible();await expect(page.locator('.results-meta')).toContainText('ended early');await shot(page,info,'results');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nodit:best')||'{}'))).toEqual({});
  await page.getByRole('button',{name:'Play again'}).tap();await expect(page.locator('.pre-actions')).toBeVisible();
});

test('deck import, export and editing preserve content',async({page},info)=>{
  await boot(page);await page.locator('.tabbar button').nth(1).tap();
  await page.locator('input[type=file]').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{')});
  await expect(page.locator('.error-box')).toHaveText("Couldn't read that file. It isn't valid JSON.");await shot(page,info,'import-error');
  await page.getByRole('button',{name:'OK',exact:true}).tap();
  await page.locator('input[type=file]').setInputFiles({name:'animals.json',mimeType:'application/json',buffer:fixture});
  await expect(page.locator('.sheet-root.open .prose')).toContainText('90 cards');await shot(page,info,'import-result');
  await page.getByRole('button',{name:'OK',exact:true}).tap();
  const imported=await page.evaluate(()=>JSON.parse(localStorage.getItem('nodit:customDecks')||'[]')[0]);
  expect(imported.cards).toEqual(JSON.parse(fixture.toString()).cards);expect(imported.id).toBe('animals-custom');
  await page.locator('input[type=file]').setInputFiles({name:'animals.json',mimeType:'application/json',buffer:fixture});
  await expect(page.locator('.sheet-root.open')).toContainText('Deck updated');
  await page.getByRole('button',{name:'OK',exact:true}).tap();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('nodit:customDecks')||'[]').length)).toBe(1);
  await page.locator('.tab-view:not([hidden]) .row',{hasText:'Animals'}).first().tap();await shot(page,info,'editor');
  await expect(page.locator('textarea')).toBeVisible();await page.getByRole('button',{name:'Cancel',exact:true}).tap();
  await page.locator('.tab-view:not([hidden]) .row',{hasText:'Animals'}).last().tap();await shot(page,info,'preview');
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export',exact:true}).tap();expect((await download).suggestedFilename()).toBe('animals.json');
});

test('lock and fastpin: rapid wrong input resets; owner code is optional',async({page},info)=>{
  await boot(page);await page.locator('.deck-tile',{hasText:'SPORRENCESON'}).tap();await shot(page,info,'passcode');
  const count=await page.locator('.pin-dots span').count();
  for(let i=0;i<count;i++) await page.getByRole('button',{name:'0',exact:true}).dispatchEvent('pointerdown',{pointerId:1});
  await expect(page.locator('.pin-dots span.on')).toHaveCount(0,{timeout:5000});
  await expect(page.locator('.keypad')).toBeVisible();
});

test('autostart: waits for grace and a deliberate lift',async({page})=>{
  await boot(page);await page.setViewportSize({width:844,height:390});await preRound(page);
  await feed(page,0,-90,3500);await expect(page.locator('.pre-actions')).toBeVisible();
  await feed(page,0,-40,600);await feed(page,0,-90,500);await expect(page.locator('.hold-bar')).toBeVisible();
  await feed(page,0,-90,1100);await expect(page.locator('.round')).toBeVisible();
});

for(const [name,neutral,down,up] of [ ['left',[0,-90],[180,45],[0,-45]], ['right',[180,-90],[180,-45],[0,45]] ] as const) {
 test(`tilt: ${name} landscape calibration, nod, pass and no double-fire`,async({page})=>{
  await boot(page);await page.setViewportSize({width:844,height:390});await preRound(page);
  await feed(page,neutral[0],neutral[1],300);await page.locator('.pre-actions .btn-primary').tap();await feed(page,neutral[0],neutral[1],3400);
  await feed(page,down[0],down[1],1300);await expect(page.locator('.round-score b')).toHaveText('1');
  await feed(page,neutral[0],neutral[1],900);await feed(page,up[0],up[1],400);await feed(page,neutral[0],neutral[1],900);
  await expect(page.locator('.round-score b')).toHaveText('1');await feed(page,down[0],down[1],400);await expect(page.locator('.round-score b')).toHaveText('2');
 });
}

test('PWA: manifest, bundled assets, offline reload and playable round',async({page,context})=>{
  const external:string[]=[];page.on('request',req=>{if(/^https?:/.test(req.url())&&!req.url().startsWith('http://127.0.0.1:4199'))external.push(req.url());});
  await boot(page);await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();
  await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBe(true);
  const manifest=await page.evaluate(async()=>fetch(document.querySelector<HTMLLinkElement>('link[rel=manifest]')!.href).then(r=>r.json()));
  expect(manifest).toMatchObject({name:'NOD IT!',id:'./',start_url:'./',scope:'./'});
  await context.setOffline(true);await page.reload();await expect(page.locator('.deck-tile')).toHaveCount(9);
  await startRound(page);await page.keyboard.press('ArrowDown');await expect(page.locator('.round-score b')).toHaveText('1');expect(external).toEqual([]);
});

test('settings, Labs defaults, tilt simulator, install and diagnostics',async({page},info)=>{
  await boot(page);await page.locator('.tabbar button').nth(2).tap();
  await expect(page.getByRole('switch',{name:'Enable Labs'})).not.toBeChecked();
  await page.getByRole('switch',{name:'Enable Labs'}).check();await expect(page.getByRole('switch',{name:'Team mode'})).toBeDisabled();await shot(page,info,'labs');
  await page.getByRole('button',{name:'Test tilt',exact:true}).tap();await expect(page.locator('input[type=range]')).toBeVisible();await shot(page,info,'tilt-test');
  await page.getByRole('button',{name:'Done',exact:true}).first().tap();
  await page.getByRole('button',{name:'Add to Home Screen',exact:true}).tap();await shot(page,info,'install');await page.getByRole('button',{name:'Got it',exact:true}).tap();
  await page.getByRole('button',{name:/Diagnostics/}).tap();await expect(page.locator('.log-view')).toContainText('start v');await shot(page,info,'diagnostics');
});
