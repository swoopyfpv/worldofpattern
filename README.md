# worldofpattern

In early 2023 I generated a few hundred seamless AI pattern tiles for a print-on-demand shop called worldofpattern. The shop never opened. The tiles were lying around, so here they are, free to use.

**Viewer:** open `index.html` through any static web server (or GitHub Pages). It reads `tiles/manifest.json`.

- Space: shuffle · B: back · ← →: browse · + −: tile size · G: show seams · E: export PNG

## Contents

- `tiles/web/` – 594 tiles as 1024 px WebP (seamless, repeat them edge to edge)
- `tiles/thumb/` – 256 px previews
- `tiles/manifest.json` – id, category, title, seam score and original prompt for each tile

The seam score compares opposite edges of a tile: around 1 means it repeats cleanly, above 2 a seam may be visible. Tiles above 4 and near-duplicates are hidden in the viewer.

## Rechtliches

`impressum.html` und `datenschutz.html` stammen aus dem Consent-Kit (`swoopyfpv/consent-banner`, Module `legal/`). Der Ordner `consent/` ist das selbst gehostete Consent-Kit, konfiguriert nur mit der Kategorie „Essentiell“, da die Seite keine Drittanbieter lädt.
