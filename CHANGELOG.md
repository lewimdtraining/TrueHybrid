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

### Restructured as a mobile web app (current)

Reworked the site from a scrolling website into an app-style PWA:

- **Bottom tab bar** with four logical destinations: Home, Framework, Tools, More. Fixed to the bottom with safe-area handling for notched phones, active-state highlighting, and identical absolute-path nav on every screen.
- **App headers** replace the old website topbar: compact dark headers with a title, a back chevron on sub-screens (tools, Vanguard), and contextual actions (e.g. Download on the framework screen).
- **New screens.** Home is now an app dashboard (hero, the three layers, quick-access cards, weekly-note prompt). Added a dedicated **Tools** hub (live vs coming-soon) and a **More** screen (framework download, the weekly note, about, Vanguard, help resources).
- **Retrofitted** the framework reader and all five tool pages plus Vanguard into the app shell; tool logic untouched.
- **App column** is centered and phone-width (max 600px) on desktop, full-width on mobile. Content scrolls between the fixed header and tab bar.
- **Plumbing:** service worker cache bumped to th-v2 and precaches the new screens; `/more` pretty-URL redirect added; year scripts made null-safe after the footers were removed. Pinch-zoom left enabled for accessibility.


### Full recipe audit (current)

Ran a complete audit of all 200 recipes for anything that could throw off a user's calories:

- **Compound ingredient lines now scale.** Sauces, marinades, dressings, and dips written as one line ("Sauce: 30g peanut butter, 15g honey, ...") previously did not scale at all, because the scaler only handled a leading quantity. Rewrote it to scale every quantity in a line (grams, ml, tbsp, tsp, cups, and leading counts) while leaving percentages like "0% yoghurt" / "2% milk" and seasoning lines alone. This was the one real accuracy bug found.
- **Internal calorie/macro consistency: clean.** All 200 recipes' stated calories match their macros (the single apparent outlier, L071, is correct once its 26g fibre is accounted for).
- **Serving counts: verified.** Cross-checked every recipe's protein macro against the protein in its ingredients; the only mismatches were the three batch recipes already corrected (meatballs, protein balls, egg muffins). The 36 two-serving recipes are correctly labelled.
- **Calorie values: well-calibrated.** An independent ingredient-level estimate lands at a median 1.07x of the stated calories across all 200 (tight), so the calorie numbers are trustworthy in aggregate. Absolute per-recipe calories can't be certified without a full nutrition database, but nothing looks systematically wrong.
- **Structural checks: clean.** No duplicate IDs or names, all meal types valid, no missing/zero/negative fields.


### Recipe quantity fix (current)

- **Fixed absurd bulk quantities** (e.g. a week of meatballs asking for ~5.8kg of chicken). Root cause: calories and macros in the data are per serving, while `servings` is the batch yield, but the tool was dividing per-serving calories by `servings` a second time. Harmless for the 164 single-serving recipes, wrong for batches.
- **Corrected the tool's serving math** so a portion is calculated straight from per-serving calories and ingredients are scaled by (portions eaten / recipe yield). This also fixes the 36 legitimate 2-serving recipes, which were previously having their ingredient lists doubled in the plan.
- **Fixed three mislabelled batch recipes** in `recipes.json` whose ingredient lists were written for the whole batch but tagged `servings: 1`: Mini Chicken Meatballs (now 4), No-Bake Protein Balls (now 6), Baked Egg Muffins (now 2). Verified by cross-checking each recipe's protein macro against the protein in its ingredients.
- **Stale yield notes** like "(makes ~16 meatballs)" are now stripped from ingredient lines once they've been rescaled, so they can't contradict the new amounts.


### Nutrition tool adjustments (current)

- **Food likes and dislikes.** Two inputs added: liked foods get favoured when meals are chosen; disliked foods exclude any recipe containing them (checked across name, tags, and ingredients). A guard warns if filters plus dislikes leave a meal type with nothing to pick.
- **PDF now includes the full recipes.** The plan download prints every meal with its scaled ingredient amounts and full method, not just names and macros. Variety mode scales each recipe to that meal's portion; bulk-prep scales to the whole week.
- **Bulk-prep multiplier removed.** The old "cook x11-12" wording (portion multiplier x7 days, which was correct but confusing) is gone. Bulk-prep now scales each recipe's ingredients to make the whole week in one cook and simply says to divide into 7 daily portions.
- **Per-meal numbers verified.** Confirmed the calorie/macro scaling is arithmetically correct (base per-serving x portion) and that the recipe data is internally consistent (199/200 within 50 kcal of their macro math). The raw portion multiplier is no longer shown anywhere; the recipe view shows exact scaled amounts instead.
- **Safer goals.** Deficit/surplus options capped at plus or minus 15% (was 20%), with a calorie floor and a note that steeper cuts under-fuel training and bigger surpluses are mostly fat.
- **IF explained.** The 2-meal option now spells out that IF means intermittent fasting, two meals in a shorter eating window.


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
