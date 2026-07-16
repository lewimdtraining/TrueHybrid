# True Hybrid, Nutrition Tool

A single-page static site: the free nutrition tool, and nothing else. Everything
runs in the browser — no accounts, no ads, no tracking, no server calls except
loading the recipe data.

## What it does
- Estimates daily calorie and macro targets from your own numbers (with manual override)
- Filters by foods you like / dislike and dietary preferences
- Builds a week of meals from a 200-recipe library (bulk-prep or daily variety)
- Exports a plan to PDF (via jsPDF, bundled locally)
- Works offline after the first visit (installable PWA)

## Structure
```
index.html                 the nutrition tool (site homepage)
offline.html               shown when a page isn't cached and you're offline
manifest.webmanifest       PWA manifest
sw.js                      service worker (offline shell + recipe caching)
netlify.toml               static hosting config + redirects + headers
assets/
  styles.css               shared styles
  jspdf.umd.min.js         PDF export library
  icon-*.png               app icons
data/
  recipes.json             200 recipes
```

## Deploy
Drag the folder into Netlify, or serve it with any static host. No build step.

Local preview:
```
python3 -m http.server 8080
# then open http://localhost:8080
```

## Branding
Aligned to the True Hybrid Brand Guide (2026):
- Palette: Deep Navy `#0E141F`, Bone Cream `#ECE6D8`, Signal Blue `#4A9FE0`,
  Steel Slate `#8B94A6` — four colours, no off-brand amber.
- Type: Anton (display), Oswald (labels/buttons/eyebrows), Poppins (body).
  Fonts are self-hosted in `assets/fonts/` (latin woff2) so nothing is loaded
  from a third party — keeping the "no tracking" promise. They're precached by
  the service worker for offline use.

## Scaling & recipe data
- Every recipe's `calories` is now internally consistent with its macros
  (calories = 4·protein + 4·carbs + 9·fats across all 200 recipes).
- Meal portions auto-scale to hit the daily calorie target. After the tool
  picks recipes for each slot, a normalization pass rescales every portion so
  the day's total lands on target (variety: each day; bulk: the daily total).
  Portions stay within a sane 0.4×–3.0× range. This also runs after a swap.
- Bulk-prep multiplies each daily portion by 7 automatically for the weekly cook.

## Notes
The previous site had a framework reader, a dopamine audit, additional training
tools, a members area and PDF downloads. Those have been removed — only the
nutrition tool remains reachable. Old URLs (`/framework`, `/tools/*`, `/vanguard`,
`/downloads`) redirect to the tool.
