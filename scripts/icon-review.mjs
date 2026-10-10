import { chromium } from '@playwright/test';
import { readFileSync,existsSync } from 'node:fs';
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined)});
const page=await browser.newPage({viewport:{width:844,height:630},deviceScaleFactor:1});
const icon=readFileSync('public/icons/apple-touch-icon.png').toString('base64');
await page.setContent(`<style>body{margin:0;padding:48px;background:#F4F5F7;color:#0F1B2D;font:17px system-ui}main{display:flex;gap:64px;align-items:start}img{border-radius:22%}h1{font-size:24px}figure{margin:0;display:grid;gap:12px;justify-items:center}figcaption{font-size:14px}</style><h1>Home-screen icon review</h1><main><figure><img width="60" height="60" src="data:image/png;base64,${icon}"><figcaption>NOD IT!</figcaption></figure><figure><img width="180" height="180" src="data:image/png;base64,${icon}"><figcaption>180 px source</figcaption></figure></main>`);
await page.screenshot({path:'design/screens/icon-review.png'});await browser.close();
