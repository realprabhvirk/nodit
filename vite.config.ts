/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'node:url';
import { STRINGS } from './src/strings';
import { TOKENS } from './design/tokens/tokens';
import pkg from './package.json' with { type: 'json' };

// One committed build works at the domain root and under a repository sub-path.
const base = './';

// Publish copies the validated dist output to the repository root after Vite exits.
export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base,
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    // Build stamp shown in Settings, so you can tell which deploy a phone is running.
    __BUILD__: JSON.stringify(new Date().toISOString().slice(5, 16).replace('T', ' ')),
  },
  plugins: [
    { name: 'brand-html', transformIndexHtml: (html) => html.replaceAll('%APP_NAME%', STRINGS.appName) },
    preact(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/*.png', 'icons/*.svg'],
      manifest: {
        id: './',
        lang: 'en-AU',
        name: STRINGS.appName,
        short_name: STRINGS.appName,
        description: 'Phone on your forehead. Your mates describe it. Nod to score.',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: TOKENS.colors.cloud,
        theme_color: TOKENS.colors.cloud,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,webmanifest}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
      },
    }),
  ],
  test: {
    environment: 'node',
    // Execute only the ported application tests.
    include: ['src/**/*.test.ts'],
    root: fileURLToPath(new URL('.', import.meta.url)),
  },
});
