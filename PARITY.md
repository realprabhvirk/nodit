# Parity and acceptance

The core app is ported from the supplied handoff; source identity and hashes are checked automatically. This checklist separates implemented behaviour from device-only acceptance. The original reference inventory and all 47 lessons remain in handoff/.

## Feature inventory

| Area | Implementation and evidence |
| --- | --- |
| Static platform | Vite 7, strict TypeScript, Preact 10/signals, local state, bundled fonts/icons; production build and offline browser test |
| Pages sub-path | Relative manifest id/start/scope; BASE_PATH build and browser checks; workflow publishes only dist |
| PWA updates | Original prompt registration, visible/30-minute update checks, reload toast; source review; actual redeploy acceptance remains manual |
| Shell | Three persistent tab views, 36 px sticky title, safe areas, 44 px short-landscape tab bar, keyed full-screen flows; browser/visual checks |
| Sheets | Body portals, header/grabber, drag/scrim dismissal, tall/modal variants, 420 ms transitions, closed roots noninteractive; preserved controls plus quick-tap regression |
| Startup safeguards | Error boundary, viewport snap-back, audio unlock, tap haptics and diagnostics; source and browser checks |
| Install help | Initial iPhone Safari prompt and Settings entry; screenshot checks; actual home-screen installation remains manual |
| Play | Tuned masonry heights, 2/4 columns, nine deck tiles, counts/locks/best scores, deck sheet, round length and permission prime; browser/visual checks |
| Passcode | Original encrypted bytes and crypto; pointerdown/live-ref keypad, timeout, wrong-input feedback, remembered code, relock clearing queue; unit/rapid-input tests; owner-code end-to-end test optional |
| Pre-round | Sequential motion/mic/ready stages, manual Start, camera preview/toggle, landscape copy and tuned auto-start; source, auto-start and camera tests; real iOS prompt timing manual |
| Round | Countdown/calibration, fitted word, score/progress/time, tap/tilt/voice/key inputs, flashes, sounds, hurry, wake lock, orientation/visibility pauses; original unit tests plus browser flows |
| Ending | Paused confirmation, no scoring while confirming, early-end result/clip, no early best, time-up delay, timer cleanup; early-exit and full timed-round browser tests |
| Recording | Original 1280×720 canvas pipeline, codec preferences, frame learning/rotation/manual flip, branded overlay, voice exclusion, end card and cleanup; orientation units and fake-camera browser checks |
| Results | Score, renamed summaries/lists, previous-best rule, playable clip, share/download, unsaved warning, replay/change deck; browser and visual checks |
| Custom decks | Create/edit/save, new palette and 32 bold icons, aliases/count, export, two-tap delete, validation/error copy; validator tests and browser import/export/editor checks |
| Import compatibility | Original cards and legacy colour keys accepted; built-in collisions use -custom and repeated imports update; unit and browser regression tests |
| Built-in previews | Live computed deck list, counts, cards, export/play/relock; preserved UI, browser preview and optional owner unlock tests |
| Settings | Game, tilt, voice/accent/test, theme, version/stamp, install, diagnostics and reset; original state defaults and browser/visual coverage |
| Tilt test | Live pitch/state, zones, slider, permission/calibrate/done, flash and sound; original detector tests and browser controls |
| Sound/haptics | Original synth and patterns; no audioSession changes; Android mark and iOS switch tests; physical haptic feel manual |
| Diagnostics | Rolling/persisted log, previous session, tap tracing, stall/errors/navigation/media events without passcodes; original source plus diagnostics browser test |
| Content | Eight 90-card public decks and original 54-card encrypted deck; manifest hashes and bundle plaintext exclusion |
| Design | Generated tokens, new palette/dark surfaces, Archivo Black, icon pipeline, colour/contrast checks and screenshots |
| Labs | Master off by default; eight inactive experiment controls. Optional experiment implementation follows parity/device acceptance |

## Do-not-regress rules

“Reference” below means the handoff implementation is retained; ten core modules are compared byte for byte after branding substitutions by check-reference.mjs. It is not a claim of real-device validation.

| Lesson | Evidence/check |
| --- | --- |
| 1 Built HTML and fallback | check-build.mjs verifies assets JS and no raw TS; source HTML retains delayed failure message |
| 2 Relative sub-path URLs | PWA browser test against BASE_PATH build |
| 3 Prompted updates | main.tsx reference registration and visibility/interval update checks |
| 4 Main-only deployment | deploy.yml triggers push main and workflow_dispatch |
| 5 Fast taps | freeze browser test; no global touchend cancellation |
| 6 Closing-sheet hit testing | freeze browser test and closed-root CSS |
| 7 Body portal | controls.tsx createPortal preserved |
| 8 RAF and pointer capture | controls.tsx cancels both RAFs, guards pointer capture |
| 9 Viewport snap-back | viewport nudge browser test |
| 10 Touchmove cleanup | RoundScreen listener-first teardown retained; endurance health probes |
| 11 Keypad race/timeout | Passcode live ref, pointerdown, 10s race; rapid wrong-input browser test |
| 12 Error boundary/empty deck | main.tsx and RoundScreen guards retained; console/page-error assertions |
| 13 Diagnostics | debug.ts reference audit; diagnostics browser check |
| 14 Down-vector maths | tilt unit suite and both landscape browser poses |
| 15 Side detection | tilt unit suite and both landscape browser poses |
| 16 Motion sign/shake rejection | tilt unit suite; reference equality |
| 17 Arming/hold/lockout | tilt unit suite; held-down browser test |
| 18 Countdown calibration | reference equality; neutral-fed countdown browser test |
| 19 Sensor ref-counting | reference acquire/release and screen teardown review |
| 20 Deliberate auto-start | autostart browser test and unchanged PreRound grace/disarm/hold values |
| 21 Tilt slider touch action | simulator browser check and manipulation CSS |
| 22 Sequential permissions | primeForRound source audit; physical iOS prompt acceptance pending |
| 23 Motion denied guidance | original MotionHelpSheet retained; physical prompt acceptance pending |
| 24 Session-only blocked state | state/voice reference audit and voice unit suite |
| 25 Blocked versus paused | voice unit suite |
| 26 Backoff/standalone restart | voice unit suite, browser voice smoke; physical standalone acceptance pending |
| 27 One recognizer | voice unit suite and browser live-recognizer count |
| 28 Start watchdog | voice unit suite |
| 29 Own-property lookups | match/palette/deck tests; retained guarded voice callback |
| 30 Current-card debounce | voice reference equality and unit suite; browser match |
| 31 Safe AudioContext | audio.ts reference equality; browser no-error assertions |
| 32 Platform haptics | Android pattern and iOS switch browser tests; physical ticks manual |
| 33 End timer cleanup | full timed-round navigation browser test |
| 34 Early end | pause/no-score/results/no-best browser test |
| 35 Clip save/unsaved warning | recording download and warning browser test; actual iOS share sheet manual |
| 36 Microphone contention | original camera/voice sequencing; fake-camera and voice browser checks |
| 37 Video orientation | videoOrientation unit suite; camera rotation browser test |
| 38 Thumbnail seek | Results loadedmetadata handler retained; recorded-results screenshot |
| 39 Landscape save visibility | recorded-results screenshot at 844×390 |
| 40 Canvas DOM/first frame | fake-camera playable 1280×720 clip browser test |
| 41 Live unlocked lists | state computed allDecks retained; owner-code test optional |
| 42 Clear queue on relock | vault source review; owner-code test optional |
| 43 Encrypted public bundle | check-build.mjs and nine deck hashes; deploy uploads only dist |
| 44 Built-in collision | repeated built-in import browser regression |
| 45 Status/theme colours | index metadata and per-screen chrome source review; light/dark screenshots |
| 46 Word fit | 20 longest cards in every public deck at both sizes; original algorithm and fonts.ready retained |
| 47 Landscape tab bar | 844×390 screenshots and 44px CSS rule |

## Installability audit

Lighthouse 11.7.1 PWA category scored 100/100 on the local production preview using Chromium 151; the installable-manifest audit passed. This checks browser installability, not actual iOS home-screen installation. The summary is saved with the screenshots.

## Outstanding external acceptance

- Owner passcode was not supplied: real-deck successful unlock/relock tests skip. Synthetic crypto tests and wrong-input tests run.
- Real iPhone installation, hardware sensors, permissions, Dictation, haptics and Photos share sheet require the README device checklist.
- A local build and configured workflow do not prove GitHub Pages deployment. Check the main-branch Actions run and Pages settings after push.
- Optional Labs experiments remain unimplemented and disabled. No experiment changes normal gameplay.
