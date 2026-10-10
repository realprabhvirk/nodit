# Art direction

The mark is a forehead, a landscape card and a decisive downward check. It is hand-built SVG by default. Flat geometry must remain recognisable at 32, 60 and 180 px.

Use cobalt #2748E8, sky #7FB2F0, cloud #F4F5F7 and ink #0F1B2D from design/tokens. Use solid cobalt for app-icon backgrounds; cloud or ink for social layouts. iOS launch colour is cloud in light mode and #0A1220 in dark mode, with no splash image.

Keep the mark centred with at least 10% margin. Maskable artwork must fit inside the central 80% diameter circle; the background extends edge to edge. Keep the forehead and card broad and simple. Avoid small lettering.

Do: use one geometric head, one landscape card, one clear nod/check; preview at actual icon size. Do not: use gradients, shadows, texture, glow, glass, neon, decorative particles, emoji, photographic faces, or extra strokes. UI icons always use bundled Phosphor bold SVGs. Any generated brand artwork must pass these same rules; the SVG remains the fallback.

The apple-touch-icon is flattened with no transparency. Supply owner-created optional PNG masters in design/source; npm run icons selects them automatically.
