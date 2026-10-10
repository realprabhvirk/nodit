# NOD IT!

Phone on your forehead. Your mates describe the card. Nod down to score; tilt up to pass. A static, installable PWA with eight public decks, an encrypted passcode deck, custom decks, voice scoring and optional round recordings.

## Develop

Use Node 22 (22.12 or newer).

```sh
npm ci
npm run dev
npm test
npm run typecheck
npm run check
npm run build
npm run test:e2e
```

The browser suite starts the production preview itself. Install Chromium with `npx playwright install --with-deps chromium`. The cloud workspace can use its installed `/usr/bin/chromium`; elsewhere set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to an existing compatible executable or use Playwright’s downloaded browser. No credentials or server are needed for ordinary development.

Vite reads src/ and builds dist/. Never publish source or handoff/. BASE_PATH defaults to `/`; use `BASE_PATH=/nodit/ npm run build` for the repository sub-path. To test that output, run `BASE_PATH=/nodit/ npm run test:e2e -- --grep 'PWA:|integ2|longest cards'`.

## Deploy and install

In GitHub repository settings, choose **Pages → Source → GitHub Actions**. A push to main runs types, unit tests, content/design checks, browser regression tests, a sub-path build and sub-path browser tests before uploading only dist/ to Pages. No preview branches deploy.

On iPhone, open the deployed site in Safari, tap Share, then Add to Home Screen. Open the installed app once online to cache its shell, fonts, icons and deck bundle. Subsequent rounds work offline; browser speech recognition may still require an Internet connection. A waiting update shows “New version ready · Reload”.

## Playing and tuning

Choose a deck and round length, then Start. Motion and microphone permissions are requested one at a time. Desktop: Arrow Down scores, Arrow Up passes, Escape opens the end-round confirmation. Screen edges work as fallbacks. Portrait pauses the clock.

Settings → Test tilt shows live angle and a simulation slider. Lower sensitivity needs a bigger nod. Calibrate while holding the phone normally; flip tilt direction if tilting down passes. The countdown averages calibration automatically.

Custom decks accept one card per line; aliases follow a bar (`Text | alias, alias`). Existing deck JSON exports remain compatible. Imported colours accept legacy names, current palette names, or six-digit hex. New palette names may display as slate in older apps.

## Passcode deck

The bundled SPORRENCESON deck remains encrypted. Enter the owner’s existing code on its keypad. The device remembers it locally. Decks → SPORRENCESON → Lock again removes the remembered code and saved deal order. The optional unit and browser unlock tests run only when `SPORRENCESON_CODE` is supplied securely; they otherwise skip.

The maintenance tool is `node scripts/sporrenceson.mjs lock <plain.json>` or `node scripts/sporrenceson.mjs unlock`; it reads SPORRENCESON_CODE from the process environment. Unlock prints plaintext for the owner to redirect into a private local file. Do not commit a code, plaintext output, or change the shipped encrypted file unless intentionally re-locking it. The handoff’s reference files are never included in dist/.

## Design assets

Edit design/tokens/tokens.json, then `npm run tokens`. Edit design/source/icon.svg, then `npm run icons`. Optional owner-supplied app-icon-1024.png and maskable-1024.png masters take precedence; all Apple icons are flattened. ART-DIRECTION.md and ASSET_PROMPTS.md describe the brand pipeline. `npm run fonts:review` renders the longest cards in the font finalists. Screenshots live in design/screens/.

## iPhone limits and acceptance checks

Speech recognition in a home-screen app can pause or be refused by iOS. Tilt, taps and keyboard fallbacks remain available. The web cannot force orientation lock. iPhone haptics work only during real taps, not sensor or voice events. Save to Photos opens the share sheet; choose Save Video. It cannot save silently. Sounds follow the silent switch.

Check on a real iPhone before treating device parity as accepted:

- Install to the home screen; check safe areas and status text.
- Tilt both landscape directions and test sensitivity/flip.
- Compare voice in Safari and standalone, including denied permission and resume.
- Record a round, rotate both ways, flip the recording if needed, and Save Video.
- Check tap haptics, offline play and reload after a new deployment.

Labs is off by default. Experiment controls are reserved for the optional post-parity milestones and cannot yet be enabled individually.
