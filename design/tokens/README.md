# Design tokens

Edit tokens.json and run npm run tokens. Generated tokens.css supplies CSS custom properties; tokens.ts supplies typed code constants. npm run check fails if either is stale.

Colors define the fixed brand palette and derived deck/flash shades. Light and dark override page background, surfaces, labels, separators, fills, accent and primary controls independently. DeckMap accepts the nine legacy data keys; deckNames supplies the custom-deck picker. White is the on-fill light text, with ink used above luminance 0.33.

The nod flash uses #197A59 (white contrast 5.29:1). Pine is #174537, dark enough to separate an Animals deck from the success flash. The palette check measures CIEDE2000 differences for every deck pair and both flashes. Core colours stay fixed.

Radius, spacing, type, motion and zIndex document shared geometry. The display face is self-hosted Archivo Black, 400; the system UI font provides tabular timer digits. The tuned sheet spring and timings are retained. Dark ink tiles retain an inset hairline.
