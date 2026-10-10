import { test, expect } from '@playwright/test';
import { boot } from './helpers';

// Keep the optional owner passcode and decrypted cards out of saved artifacts.
test.use({ trace: 'off', screenshot: 'off', video: 'off' });

test('locked deck opens, remembers and relocks with supplied code', async ({ page }) => {
  test.skip(!process.env.SPORRENCESON_CODE, 'Owner passcode not supplied');
  await boot(page);
  await page.locator('.deck-tile', { hasText: 'SPORRENCESON' }).tap();
  for (const digit of process.env.SPORRENCESON_CODE!) {
    await page.getByRole('button', { name: digit, exact: true }).tap();
  }
  await expect(page.locator('.sheet-root.open .deck-hero')).toBeVisible();
  await page.reload();
  await page.locator('.tabbar button').nth(1).tap();
  await page.locator('.row', { hasText: 'SPORRENCESON' }).tap();
  await expect(page.locator('.card-list')).toBeVisible();
  await page.getByRole('button', { name: 'Lock again' }).tap();
  expect(await page.evaluate(() => localStorage.getItem('nodit:queue:the-crew'))).toBeNull();
});
