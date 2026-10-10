import { test,expect } from '@playwright/test';
import {boot,startRound,preRound,endRound,shot} from './helpers';

test('camera and exit: recording survives early end, has dimensions, saves',async({page,context},info)=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await context.grantPermissions(['camera','microphone']);
  await boot(page,{record:true,voice:false});await page.setViewportSize({width:844,height:390});await preRound(page);
  await expect(page.locator('.pre-preview')).toBeVisible();await shot(page,info,'camera-preview');
  await page.locator('.pre-actions .btn-primary').tap();await expect(page.locator('.word')).toBeVisible();await expect(page.locator('.round-rec')).toBeVisible();
  await page.keyboard.press('ArrowDown');await page.waitForTimeout(1000);await endRound(page);
  await expect(page.locator('.clip-card video')).toBeVisible({timeout:10000});await shot(page,info,'recorded-results');
  const metadata=await page.locator('.clip-card video').evaluate(async(el:HTMLVideoElement)=>{
    if(el.readyState<2) await new Promise(resolve=>el.addEventListener('loadeddata',resolve,{once:true}));
    return {width:el.videoWidth,height:el.videoHeight,size:(await fetch(el.src).then(r=>r.blob())).size};
  });
  expect(metadata.width).toBe(1280);expect(metadata.height).toBe(720);expect(metadata.size).toBeGreaterThan(20000);
  await page.locator('.results-actions .btn-secondary').tap();await expect(page.locator('.clip-note.warn')).toBeVisible();
  const download=page.waitForEvent('download');await page.locator('.clip-actions .btn-primary').tap();expect((await download).suggestedFilename()).toContain('NOD IT');
  await expect(page.locator('.clip-actions .btn-primary')).toContainText('Saved');
  await page.locator('.results-actions .btn-secondary').tap();await expect(page.locator('.results')).toHaveCount(0);expect(errors).toEqual([]);
});

test('deep: voice matches only current card, restarts and releases',async({page})=>{
  await page.addInitScript(()=>{
    const w=window as any;w.__recognizers=[];
    class Fake {
      alive=false;onstart?:()=>void;onend?:()=>void;onresult?:(e:unknown)=>void;
      constructor(){w.__recognizers.push(this);}
      start(){this.alive=true;setTimeout(()=>{if(this.alive)this.onstart?.();},30);}
      abort(){if(!this.alive)return;this.alive=false;setTimeout(()=>this.onend?.(),20);}
      stop(){this.abort();}
      say(word:string){const result:any=[{transcript:word}];result.isFinal=true;this.onresult?.({resultIndex:0,results:[result]});}
      end(){this.alive=false;this.onend?.();}
    }
    w.SpeechRecognition=Fake;w.webkitSpeechRecognition=Fake;localStorage.setItem('nodit:micAsked','true');
  });
  await boot(page,{voice:true});await startRound(page);await page.waitForTimeout(850);
  const word=(await page.locator('.word').innerText()).replace(/\n/g,' ');
  await page.evaluate(word=>(window as any).__recognizers.at(-1).say(word),word);
  await expect(page.locator('.round-score b')).toHaveText('1');await page.waitForTimeout(850);
  await page.evaluate(()=>(window as any).__recognizers.at(-1).end());
  await expect(page.locator('.mic-pill')).toContainText('Listening');
  expect(await page.evaluate(()=>(window as any).__recognizers.filter((r:any)=>r.alive).length)).toBe(1);
  await endRound(page);await expect(page.locator('.results')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>(window as any).__recognizers.filter((r:any)=>r.alive).length)).toBe(0);
});

test('haptic: Android mark patterns are distinct with no double tap buzz',async({page})=>{
  await page.addInitScript(()=>{(window as any).__v=[];navigator.vibrate=(p)=>{(window as any).__v.push(p);return true;};});
  await boot(page);await startRound(page);await page.evaluate(()=>{(window as any).__v=[];});
  await page.keyboard.press('ArrowDown');await page.waitForTimeout(750);await page.locator('.tap-zone.left').tap();
  expect(await page.evaluate(()=>(window as any).__v)).toEqual([[14,55,14],[45]]);
});

test('viewport nudge and rotation leave controls responsive',async({page})=>{
  await boot(page);const after=await page.evaluate(async()=>{
    const div=document.createElement('div');div.style.height='3000px';document.body.append(div);
    for(const el of [document.documentElement,document.body]) {el.style.overflow='visible';el.style.height='auto';}
    window.scrollTo(0,120);await new Promise(r=>setTimeout(r,350));const y=scrollY;
    div.remove();for(const el of [document.documentElement,document.body]){el.style.overflow='';el.style.height='';}return y;
  });expect(after).toBe(0);
  await page.setViewportSize({width:390,height:844});await page.setViewportSize({width:844,height:390});
  await page.locator('.tabbar button').nth(2).tap();await expect(page.locator('.tabbar [aria-selected=true]')).toHaveText('Settings');
});

test('full timed round reaches Time then results without stale navigation',async({page},info)=>{
  await boot(page);await startRound(page);await page.keyboard.press('ArrowDown');
  await expect(page.locator('.round-timer.hurry')).toBeVisible({timeout:25000});
  await expect(page.locator('.round-timer.hurry')).toHaveCSS('color','rgb(244, 211, 94)');
  await expect(page.locator('.time-up')).toBeVisible({timeout:35000});await shot(page,info,'time-up');
  await expect(page.locator('.results')).toBeVisible();await expect(page.locator('.results-meta')).not.toContainText('ended early');
  await page.locator('.results-actions .btn-secondary').tap();await page.waitForTimeout(1800);await expect(page.locator('.results')).toHaveCount(0);
});

test('orient: camera learns orientation and manual flip adds a half turn',async({page,context},info)=>{
  test.skip(info.project.name!=='portrait-light','Orientation state is independent of theme');
  await context.grantPermissions(['camera','microphone']);
  await page.addInitScript(()=>{(window as any).__angle=0;Object.defineProperty(screen.orientation,'angle',{get:()=>(window as any).__angle,configurable:true});});
  await boot(page,{record:true,flipVideo:false});await page.setViewportSize({width:390,height:844});await preRound(page);
  await expect(page.locator('.pre-preview')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('nodit:frameMode'))).toBe('"landscapeRaw"');
  await page.evaluate(()=>{(window as any).__angle=270;});await page.setViewportSize({width:844,height:390});
  await page.locator('.pre-actions .btn-primary').tap();await expect(page.locator('.word')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('nodit:log')||'')).toContain('rotation 180');
  await endRound(page);await expect(page.locator('.clip-card video')).toBeVisible();
  await page.locator('.results-actions .btn-secondary').tap();await page.locator('.results-actions .btn-secondary').tap();
  await page.locator('.tabbar button').nth(2).tap();await page.getByRole('switch',{name:'Flip recorded video',exact:true}).check();
  await page.locator('.tabbar button').nth(0).tap();await preRound(page);await page.locator('.pre-actions .btn-primary').tap();await expect(page.locator('.word')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('nodit:log')||'')).toContain('rotation 0');
});

test('iOS switch haptic path ticks once and releases focus',async({page})=>{
  await page.addInitScript(()=>{
    delete (Navigator.prototype as any).vibrate;
    Object.defineProperty(HTMLInputElement.prototype,'switch',{value:false,writable:true,configurable:true});
    (window as any).__ticks=0;document.addEventListener('change',e=>{if((e.target as Element)?.closest('[data-haptic-el]'))(window as any).__ticks++;},true);
  });
  await boot(page);await page.locator('.tabbar button').nth(1).tap();await page.locator('.tabbar button').nth(0).tap();
  expect(await page.evaluate(()=>(window as any).__ticks)).toBe(2);
  expect(await page.evaluate(()=>Boolean(document.activeElement?.closest('[data-haptic-el]')))).toBe(false);
});
