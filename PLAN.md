# NOD IT! build plan

1. Import the authoritative handoff and source, preserving tuned logic and deck bytes.
2. Build the new design tokens, font comparison, brand assets and generation scripts.
3. Port shell, deck management, permission flows, rounds, results, recording and diagnostics.
4. Add Labs with experiments off by default; parity precedes optional experiments.
5. Validate unit tests, deck hashes, colours, strings, strict types and production output.
6. Port browser regression coverage, inspect portrait/landscape and light/dark screenshots, verify offline and sub-path deployment.
7. Document parity and real-device checks; commit and push validated work to main.

## Validation completed

- 103 unit tests pass; the owner-code test skips without the optional secret.
- Main browser run: 33 passed, 3 skipped. Follow-up camera orientation and iOS haptic checks passed (3 additional cases; one redundant orientation project skipped).
- Production /nodit/ run: 10 passed, covering offline PWA, gameplay, long words, timed completion and visual matrices.
- Types, deck hashes, token freshness, branding, colour contrast/separation, core reference equality and production privacy checks pass.
- Lighthouse 11.7.1 PWA installability score: 100/100.
- Remaining owner/device/deployment acceptance and optional Labs scope are recorded in PARITY.md.
