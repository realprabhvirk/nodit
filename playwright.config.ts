import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
const basePath = process.env.BASE_PATH || '/';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
export default defineConfig({
  testDir: './tests/e2e', timeout: 60000, expect: { timeout: 8000 },
  fullyParallel: true, workers: 2, retries: 0,
  reporter: [['list'],['html',{open:'never'}]],
  use: {
    ...devices['iPhone 13'], browserName:'chromium', baseURL:`http://127.0.0.1:4199${basePath}`,
    launchOptions: { executablePath, args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'] },
    trace:'retain-on-failure', screenshot:'only-on-failure',
  },
  projects: [
    {name:'portrait-light',use:{viewport:{width:390,height:844},colorScheme:'light'}},
    {name:'landscape-dark',use:{viewport:{width:844,height:390},colorScheme:'dark'}},
  ],
  webServer: {command:'npm run preview -- --host 127.0.0.1 --port 4199 --strictPort',url:`http://127.0.0.1:4199${basePath}`,reuseExistingServer:!process.env.CI},
});
