# True Hybrid, Project Status & Changelog

_Last updated: 2026-07-01_

A running record of the build so the project knowledge stays current. Most recent work is at the top.

---

## What this is

**True Hybrid**: a static training/nutrition/development site built around one master document, the True Hybrid framework (physical capacity, mental command, spiritual direction). Free tools now, a possible paid tier later. Deploys to Netlify via GitHub. Installable PWA.

**Brand voice:** grounded, plain, no preaching, no politics. Recurring line: "Build the base, earn the expression, aim it higher." Three layers: Physical/Capacity, Mental/Command, Spiritual/Direction.

**Writing rules:** no em or en dashes (use commas); keep claims honest; footer trust line "No tracking, No ads, No bullsh*t".

---

## Changelog

### 2026-07-01, full rebrand to True Hybrid (current)

Retired the MDT / Modern Day Templar identity. The site is now **True Hybrid** end to end.

- **New wordmark.** Replaced the MDT logo images with a text lockup (small blue "true" + bold "HYBRID"), built in CSS as `.th-brand` / `.th-brand--footer` in `assets/styles.css`. No logo image to maintain. Internal class names (`.mdt-topbar`, `.mdt-footer`, `.mdt-nav`) were deliberately kept to avoid touching selectors on every page; they're invisible to visitors, same pattern as the `--brass` variable name being baby blue.
- **New framework page.** `framework/index.html`, a full readable web version of the master document: dark cover echoing the PDF, contents, all eight parts plus the quick reference and glossary, with styled tables, callout boxes, and CSS diagrams (supply/expression spectrum, oxygen cascade, the Build/Endure/Express domain line, the contraction line). Pretty URL `/framework` added to `netlify.toml`.
- **Framework download.** The framework PDF ships at `downloads/true-hybrid-framework.pdf`, linked from the hero, the homepage feature band, and the framework page.
- **Homepage rewrite.** Dark cover-style hero ("Strong, composed, and aimed at something higher", CTAs to read/download the framework), a three-layers section (Capacity / Command / Direction), a framework feature band, then the tools grid rebranded, weekly note, and footer. Tool count label kept at "5 tools, 2 live".
- **New app icons.** Regenerated `icon-(180, 192, 512).png` and the maskable icon as a blue "H" mark on near-black with the framework's blue rule. Favicons updated to match.
- **PWA + config.** `manifest.webmanifest` renamed to True Hybrid; `sw.js` cache bumped to `th-v1`, precache now includes the framework page and drops the old logo PNGs; `offline.html` rebranded; `netlify.toml` header comment + `/framework` redirect.
- **Placeholder tools + Vanguard rebranded.** running / strength / stretching and the Vanguard page carry the new lockup, dark heroes, and framework-tied taglines (Critical Power zones, the Express end, position + breathing).
- **Weekly form renamed** `mdt-weekly` to `th-weekly` on the homepage.

**Audit + nutrition tools rebuilt.** The original `tools/audit/index.html` and `tools/nutrition/index.html` source was never available (not in the uploads, the project, or the project knowledge), and on a fresh deploy of the rebranded package those two links led nowhere. Both were rebuilt from scratch as working, self-contained True Hybrid pages:

- **Nutrition Tool** (`tools/nutrition/index.html`): macro calculator (Mifflin-St Jeor, metric/imperial, activity + goal, calorie floor), editable daily target, weekly planner in daily-variety or bulk-prep mode, 5/4/3/2 meal layouts, vegetarian/vegan/gluten-free/no-nuts filters, per-meal calorie scaling to hit the target, delivered-vs-target readout with the `OFF_TARGET = 0.10` colour rule and swap-impact note, per-recipe modal, meal swap, and a jsPDF plan export. Verified against the real 200-recipe `data/recipes.json`: calories land on target, fibre totals shown.
- **Dopamine Audit** (`tools/audit/index.html`): 12 questions across four grips (reflex, scroll, protection, baseline), scored 0-3 each, a verdict band on the total, a per-grip breakdown highlighting the tightest grip, and a handoff to the matching practice-card PDF already in `downloads/` (break-the-reflex / kill-the-scroll / protect-what-matters / reset-your-baseline). Runs entirely client-side, nothing stored.

_Note: these are faithful rebuilds to the documented spec, not the original files. If the originals turn up, they can be dropped back in, they only need the same brand pass (topbar/footer lockup, PWA title, `<title>`, footer copy, `mdt-weekly` to `th-weekly`)._

### Earlier sessions (pre-rebrand, still current)

- Dopamine Audit ("The Morning Audit") built around the No-Input Morning; four branded practice cards in `downloads/`.
- Nutrition tool: 200 recipes, re-engineered meal planner, swap-impact note, `OFF_TARGET` single-source constant, self-hosted jsPDF plan download.
- Site recoloured to the baby-blue / cream / white / near-black palette.

---

## Open follow-ups

- **Audit + nutrition** are working rebuilds; swap in the originals if you still have them (see note above).
- **Paid tier:** revisit any "free" labels when a subscription launches.
- **Vanguard** is an unlinked coming-soon page; wire navigation to it when the offer is ready.
- **PWA** install/offline needs HTTPS and a second visit; verify on the live domain.
