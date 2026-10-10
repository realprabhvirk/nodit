# Decisions

## 2026-10-10 — Source and build boundary
The authoritative handoff was retrieved from the owner’s existing repository at commit `8b8745eb68381e53e26f260c011d21b1720f74a0`. The handoff copies take precedence for tuned modules. Remaining UI modules come from the same checkout. The original brief is preserved under handoff/ so historical branding stays in the reference area. The initial implementation published dist/ through GitHub Actions; direct-root hosting support below supersedes that boundary.

## 2026-10-10 — Direct-root hosting
The owner reported a blank Cloudflare Pages site because the host publishes the checkout without running a build. Each build now validates dist/, replaces only the generated root outputs and copies the ready-to-serve site into the repository root for committing. Vite uses ./ URLs so one build supports root and sub-path hosting. Browser tests use a plain static server, including a blocked-bundle check for the four-second fallback. GitHub Actions stages the generated root files only; no host configuration requires dist/.

## 2026-10-10 — Compatibility
Deck data remains byte-identical to the handoff, including legacy colour keys and the locked deck id. New custom decks save the new palette names; older apps may display these as slate. Storage starts fresh under nodit:.

## 2026-10-10 — Labs scope
Parity is the first release. Labs has a master switch and individually disabled experiments; optional experiment implementations follow only after parity and real-device acceptance. Unimplemented experiments cannot be enabled.

## 2026-10-10 — Flash and deck separation
The suggested pine and success greens were too close. Derived nod #197A59 and pine #174537 give white flash text 5.29:1 contrast and a minimum deck/flash CIEDE2000 difference of 17.98. All deck pairs exceed 10. The fixed core palette stays unchanged. Automated checks lock these measurements.

## 2026-10-10 — Font selection
Archivo Black was selected after rendering the 20 longest public cards at 844×390 and 390×844 beside Bricolage Grotesque 800 and Unbounded 800. Archivo has the clearest heavy silhouette, fewer decorative cuts than Unbounded, and a latin woff2 of 18,604 bytes. Its minimum fitted size was 91 px in landscape and 39 px in portrait in the comparison boxes. Bricolage fits slightly larger but looks less decisive; Unbounded needs smaller sizes. The original fitting algorithm is unchanged apart from its font name. An independent browser check measures the 20 longest cards of each public deck.

## 2026-10-10 — Imported IDs and exported internal flags
Regression tests exposed two inherited mismatches with the supplied brief. Importing a built-in deck used a numeric suffix, so importing it again created another copy. It now uses the specified -custom suffix and updates the existing custom deck. Exports now remove lockedCount as well as custom. The deck-export unit test and repeated-import browser test failed before these corrections; validation messages and card data are unchanged.

## 2026-10-10 — Maintenance credentials
The deck maintenance CLI reads SPORRENCESON_CODE from its environment instead of positional arguments, avoiding command-history exposure. The shipped locked file stays byte-identical. Owner unlock tests are optional and no owner code was supplied.
