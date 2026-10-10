# NOD IT!

Heads Up-style party game, installable iOS PWA. Static, no backend, offline.

## Run
npm install · npm run dev · npm test · npm run test:e2e · npm run build · npm run icons · npm run tokens

## Rules
- Name is NOD IT! (caps + !). A correct guess is "NOD IT!", never "Correct". Strings live in src/strings.ts.
- Never use neon, glow, gradients, glassmorphism, emoji as icons, AI-generated icons/art, gradient text.
- Flat solid colours from design/tokens only. Phosphor bold icons only.
- iOS feel: large titles, inset lists, bottom sheets, 44pt targets, safe areas, spring easing cubic-bezier(0.2, 0.8, 0.2, 1).
- Copy: short, dry, Aussie. No marketing voice.
- Deck JSON is imported verbatim from handoff/decks. Never write or edit cards.
- The SPORRENCESON code is never committed, logged or put in tests (env SPORRENCESON_CODE only).
- handoff/LESSONS-LEARNED.md rules are binding. tuned-constants.json values are binding.
- The host serves the repository root without a build step. After every source change, run npm run build and commit the generated root index.html, assets/, icons/, manifest and service-worker files. Never edit generated files directly. Keep Vite base relative (./).
- Don't use the "Heads Up" name, branding, deck names or colours.

## Architecture
tilt.ts sensor mapping + TiltDetector (pure, tested) · match.ts speech matching (pure, tested) ·
game.ts Round + CardQueue (tested) · voice.ts Web Speech wrapper, never throws into a round ·
audio.ts synth sounds · haptics.ts · recorder.ts/camera.ts/videoOrientation.ts recording ·
vault*.ts locked deck · debug.ts on-device log · state.ts persisted signals · ui/* screens.
