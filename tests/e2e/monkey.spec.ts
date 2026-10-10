import { test,expect } from '@playwright/test';
import { boot } from './helpers';
test('monkey: two minutes of seeded taps, rotation and health probes',async({page},info)=>{
  test.skip(info.project.name!=='portrait-light','One seeded endurance run covers both orientations');
  test.setTimeout(150000);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await boot(page);let seed=7;const random=()=>((seed=seed*16807%2147483647)/2147483647);
  const end=Date.now()+120000;let actions=0;
  const recover=async()=>{
    for(let i=0;i<8;i++){
      if(await page.locator('.quit-confirm').count()){await page.locator('.quit-actions .btn-primary').tap();await page.waitForTimeout(900);}
      else if(await page.locator('.results').count()){await page.locator('.results-actions .btn-secondary').tap();}
      else if(await page.locator('.round').count()){await page.keyboard.press('Escape');}
      else if(await page.locator('.fullscreen .close-btn').count()){await page.locator('.fullscreen .close-btn').first().tap();}
      else if(await page.locator('.tilt-test').count()){await page.getByRole('button',{name:'Done',exact:true}).first().tap();}
      else if(await page.locator('.sheet-root.open').count()) {
        const action=page.locator('.sheet-root.open .btn-plain').first();
        if(await action.count())await action.tap();else await page.locator('.sheet-root.open .sheet-scrim').tap({position:{x:8,y:8}});
      } else break;
      await page.waitForTimeout(200);
    }
    await expect(page.locator('.fullscreen')).toHaveCount(0);
    await expect(page.locator('.sheet-root.open')).toHaveCount(0);
    for(const i of [1,0]) {await page.locator('.tabbar button').nth(i).tap();await expect(page.locator('.tabbar button').nth(i)).toHaveAttribute('aria-selected','true');}
    await page.setViewportSize({width:390,height:844});
    expect(await page.locator('.tab-view:not([hidden])').evaluate(el=>{el.scrollTop=120;return el.scrollTop;})).toBeGreaterThan(20);
  };
  while(Date.now()<end) {
    if(random()<.08) await page.setViewportSize(random()<.5?{width:844,height:390}:{width:390,height:844});
    else {
      const targets=await page.evaluate(()=>{
        const top=document.querySelector('.sheet-root.open .sheet')||document.querySelector('.fullscreen')||document;
        return Array.from(top.querySelectorAll<HTMLElement>('button, [role=radio]')).filter(el=>{
          const r=el.getBoundingClientRect();const label=el.getAttribute('aria-label')||el.textContent||'';
          return r.width>0&&r.top>=0&&r.bottom<=innerHeight&&!/reset|wipe|record|microphone|share|export|import/i.test(label)&&!(el as HTMLButtonElement).disabled;
        }).map(el=>{const r=el.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});
      });
      if(targets.length){const target=targets[Math.floor(random()*targets.length)];await page.touchscreen.tap(target.x,target.y);}
    }
    await page.waitForTimeout(100+random()*220);actions++;
    if(actions%35===0)await recover();
  }
  await recover();expect(actions).toBeGreaterThan(100);expect(errors).toEqual([]);
});
