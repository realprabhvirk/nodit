import { test, expect } from '@playwright/test';
import { boot } from './helpers';

test('static hosting: root HTML loads bundled JavaScript with relative URLs', async ({ page, request }) => {
  const response = await request.get('./');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).not.toMatch(/(?:src|href)=["'][^"']*\.(?:ts|tsx)["']/);
  expect(html).toMatch(/src="\.\/assets\/[^" ]+\.js"/);
  const sourceRequests: string[] = [];
  page.on('request', request => { if (/\.(ts|tsx)(?:\?|$)/.test(request.url())) sourceRequests.push(request.url()); });
  await boot(page);
  await expect(page.locator('.deck-tile')).toHaveCount(9);
  expect(sourceRequests).toEqual([]);
});

test('static hosting: blocked bundle shows the four-second fallback', async ({ page }) => {
  await page.route('**/assets/*.js', route => route.abort());
  await page.goto('./');
  await expect(page.locator('#app')).toHaveText("App didn't load. Check the build ran.", { timeout: 6000 });
});
