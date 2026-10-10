import { expect, type Page, type TestInfo } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
export async function boot(page: Page, extra: Record<string,unknown>={}) {
  await page.addInitScript(settings=> {
    localStorage.setItem('nodit:installDismissed','true');
    localStorage.setItem('nodit:settings',JSON.stringify({voice:false,roundLength:30,...settings}));
  },extra);
  await page.goto('./'); await expect(page.locator('.deck-tile')).toHaveCount(9);
  await page.evaluate(()=>document.fonts.ready);
}
export async function preRound(page: Page) {
  await page.locator('.deck-tile',{hasText:'Animals'}).tap();
  await page.locator('.sheet-root.open .btn-primary').tap();
  await expect(page.locator('.pre-actions')).toBeVisible();
}
export async function startRound(page:Page) {
  await page.setViewportSize({width:844,height:390});
  await preRound(page); await page.locator('.pre-actions .btn-primary').tap();
  await expect(page.locator('.word')).toBeVisible({timeout:6000});
}
export async function endRound(page:Page) {
  await page.getByRole('button',{name:'End round',exact:true}).first().tap();
  await page.locator('.quit-actions .btn-primary').tap();
}
export async function shot(page:Page,info:TestInfo,name:string) {
  await mkdir('design/screens',{recursive:true});
  await page.waitForTimeout(/flash|countdown|time-up/.test(name) ? 180 : 500);
  await page.screenshot({path:`design/screens/${info.project.name}-${name}.png`});
}
export async function feed(page:Page,beta:number,gamma:number,ms:number) {
  await page.evaluate(async ([beta,gamma,ms])=> {
    const until=performance.now()+ms;
    while(performance.now()<until) { window.dispatchEvent(new DeviceOrientationEvent('deviceorientation',{beta,gamma,alpha:0})); await new Promise(r=>setTimeout(r,16)); }
  },[beta,gamma,ms]);
}
