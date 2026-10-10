import { cpSync, readdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);

// Validate before removing the previous build. Never remove source or handoff files.
execFileSync(process.execPath, ['scripts/check-build.mjs'], { stdio: 'inherit' });
const generated = new Set(['index.html', 'assets', 'icons', 'sw.js', 'manifest.webmanifest', 'registerSW.js']);
for (const name of readdirSync(root)) {
  if (generated.has(name) || /^workbox-.*\.js(?:\.map)?$/.test(name)) {
    rmSync(new URL(`../${name}`, import.meta.url), { recursive: true, force: true });
  }
}
for (const name of readdirSync('dist')) {
  cpSync(`dist/${name}`, name, { recursive: true });
}
execFileSync(process.execPath, ['scripts/check-build.mjs', '.'], { stdio: 'inherit' });
console.log('Published dist to the repository root. Commit the generated files with source changes.');
