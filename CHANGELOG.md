# MDT Online Tools, Project Status & Changelog

_Last updated: 2026-06-04_

A running record of the build so the project knowledge stays current. Most recent work is at the top of the changelog.

---

## What this is

The Modern Day Templar (MDT) site: a static, men's training / nutrition / development site offering free tools now, with a planned ten-dollar-a-month subscription later. It deploys to Netlify via GitHub.

**Brand voice:** Peterson's "why" plus Huberman's "how" plus Lewi's "lived it." Plain, grounded, no preaching, no politics. Tagline energy: "Men Doing Things." Recurring frames from the No-Input Morning: commander vs passenger, servant vs tyrant, "most men lose the war before breakfast."

**Writing rules:** no em or en dashes (use commas); don't name-drop Peterson or Huberman in user-facing copy, use the framing instead; keep claims honest.

---

## Current state

**Stack / deploy:** static HTML/CSS/JS, GitHub to Netlify. Installable PWA.

**Palette (CSS vars in `assets/styles.css`):**

| Var | Hex | Role |
| --- | --- | --- |
| `--ink` | `#15181e` | near-black, text and dark bars |
| `--char` | `#353a42` | body text |
| `--smoke` | `#7a8794` | muted blue-grey |
| `--bone` | `#ffffff` | white, page wrap and cards |
| `--paper` | `#f7f2e8` | cream, main background |
| `--cream` | `#e7dcc8` | warm light, borders |
| `--brass` | `#7cc4e8` | baby blue accent (var name kept for compatibility) |
| `--brass-dim` | `#2f7ea6` | denim, text-on-light and hover |
| `--rust` | `#1f6385` | deep blue |
| `--warn` | `#d98236` | amber, warnings |

**Key files:**

- `index.html`, `assets/styles.css`, `assets/jspdf.umd.min.js`
- Logos: `assets/mdt-logo-white.png`, `assets/mdt-logo-charcoal.png` (flanking lines now baby blue)
- PWA: `manifest.webmanifest`, `sw.js`, `offline.html`, `assets/icon-{180,192,512}.png`, `assets/icon-maskable-512.png`
- `data/recipes.json` (200 recipes)
- `downloads/` (four Morning Audit practice cards, see below)
- Tools: `tools/{nutrition,running,strength,audit,stretching}/index.html`
- `vanguard/index.html` (now an unlinked "coming soon" page)
- `netlify.toml`, `README.md`

**Deliverables / packaging:** working copy at `/home/claude/work/`. Outputs go to `/mnt/user-data/outputs/` as `mdt-site.zip` (re-zipped after each change), plus loose `recipes.json` and `styles.css`. Build scripts (not shipped in the zip): `build_recipes.py`, `recipes_data.py`, `add_recipes.py`, `add_recipes2.py`, `build_cards.py`.

**Tool status:**

- **Nutrition** , complete. 200 recipes, re-engineered meal planner, swap-impact note added.
- **Audit** , rebuilt as "The Morning Audit" around the No-Input Morning.
- **Running / Strength / Stretching** , unchanged this phase.

---

## Changelog

### 2026-07 session (current)

**Weekly-note signup removed.** Dropped the `mdt-weekly` email opt-in section from the homepage (and its CSS). Removed "for now" at the owner's request; the Netlify form definition can be re-added later if the note returns. _Flag: the audit results screen may still reference/contain the `mdt-weekly` form, check `tools/audit/index.html` when that file is in the repo._

**Anti-marketing copy stripped.** Removed the "No ads / No tracking / No bullsh\*t" lines across the homepage (hero trust line, About section, footer tagline, footer bar) and the meta description, since a paid tier is planned and the site should read as being about the training, not the positioning. Softened "free" wording (hero CTA now "See the tools"). Privacy is still true (client-side, nothing stored) but no longer sold as a slogan. _Flag: swearing removed to match the True Hybrid brand voice; check other pages for the same lines._

**Vanguard teaser removed.** Deleted the homepage "The Vanguard, coming soon" section and its CSS. The `/vanguard/` page and its netlify redirect are untouched (still unlinked, reachable by direct URL only).

**Free framework doc added.** New "The complete framework" section (dark band, replacing the old weekly/vanguard slot) with a direct download of `downloads/true-hybrid-framework.pdf` (the updated True Hybrid framework, 64pp). No email gate, per the note-removal above.

**Open items surfaced this session (not yet actioned):**
- **Brand-guide alignment (True Hybrid 2026).** Palette + typography live in `assets/styles.css` and the logo PNGs, none of which are in the current project snapshot, so visual alignment (exact navy `#0E141F` / bone `#ECE6D8` / signal blue `#4A9FE0` / steel `#8B94A6`, and Anton/Oswald/Poppins) is pending those files. Also open: whether the site name becomes **True Hybrid** or stays **MDT / Modern Day Templar**.
- **"Works from a link" on mobile.** The site is already a standard responsive website; opening it from a link requires it to be live on a host (Netlify). Nothing in the code blocks browser access.

### 2026-06 session

**Logo lines recoloured.** The short lines flanking the "MDT" wordmark were still the old rust colour after the site recolour. Recoloured just those line pixels to baby blue (`124,196,232`) in both `mdt-logo-white.png` and `mdt-logo-charcoal.png`; lettering untouched.

**Subscription-copy removed.** Stripped "no subscriptions / no upsells / no accounts / no sign-up" promises across the homepage and audit, since a paid tier is planned later. Footer trust line changed to "No tracking, No ads, No bullsh\*t." Privacy and "free" wording kept. _Flag: revisit any remaining "free" labels when the paid tier launches._

**PWA / installable app.** Added `manifest.webmanifest`, a service worker (`sw.js`, network-first for navigations and `/data/*`, stale-while-revalidate for assets, offline fallback), `offline.html`, and app icons. Injected manifest link, apple-touch-icon, web-app metas, and SW registration into all pages. `netlify.toml` headers added for `sw.js` and the manifest. _Install / SW behaviour needs HTTPS (Netlify provides it) and kicks in on the second visit; won't work from `file://`._

**Vanguard + waitlist removed, now "coming soon."** Dropped the "Vanguard" nav link and the homepage waitlist CTA; homepage teaser is now a no-CTA "Coming soon" note. `vanguard/index.html` stripped of the eight-week sell and the Netlify waitlist form, reduced to a single "coming soon" block. The page is no longer linked from anywhere (reachable by direct URL only).

**Audit rebuilt as "The Morning Audit"** (`tools/audit/index.html`), reframed entirely around the No-Input Morning Challenge. Reused the existing quiz engine and visual structure; swapped the data, copy, results logic, and CTA.

- One question underneath it: are you the commander of your morning, or the passenger?
- Four dimensions, three questions each (12 total, scored 0 healthy to 3 drift, max 9 per dimension): **Input** (the phone / reactivity, Pillar 5), **Stillness** (the Morning Oath / silence), **Allegiance** (something bigger / ego, servant vs tyrant, Pillar 9), **Mission** (the Narrative / setting one aim).
- Verdicts run on a commander-to-passenger scale (Commander / Mostly in command / Slipping into the passenger seat / Passenger).
- Per-dimension prescriptions each point at the matching morning practice.
- Homepage references updated to match (button, tool card, copy).

**Four branded practice cards** replace the whole-challenge download. The audit now hands over **only the one card matching the person's weakest dimension**, not the full five-day challenge. Built with `build_cards.py` (reportlab) in the new palette and voice, each one page, print-ready: Why this is the fight / How it works / The practice, a five-morning Y-N tracker, an evening debrief, the servant-or-tyrant review, and the closing line "A man who is a master of himself is a master of the world." A soft "full twelve-pillar system is coming" note, no waitlist.

| Weakest dimension | Card (`downloads/...pdf`) |
| --- | --- |
| Input | `take-command-of-your-inputs.pdf` |
| Stillness | `the-morning-oath.pdf` |
| Allegiance | `something-bigger-than-you.pdf` |
| Mission | `set-one-mission.pdf` |

The results button label and link are set on render from the loudest dimension (`MOVES[axis].file` / `.piece`).

**Nutrition swap-impact note.** Added an explanation between the totals readout and the meal list: swapping a meal changes its macros and can push a macro into surplus or deficit without the user noticing, so check the totals after a swap (anything in orange is over the threshold). Tied the note's percentage to a single source-of-truth constant, `OFF_TARGET = 0.10`, that also drives the totals colour logic, so the wording and the behaviour can't drift apart.

### Earlier sessions (complete)

- **Recipe library rebuilt to 198 recipes** (59 breakfast / 43 lunch / 48 dinner / 48 snack). Validated: valid JSON, no duplicate IDs or names, tags within the controlled vocabulary, no em/en dashes.
- **Site recoloured** to the baby-blue / cream / white / black palette above (replaced the old rust/brass scheme).
- **Meal planner re-engineered:** portion scaling, calorie-floor guardrails, carb/fat steering, delivered-vs-target readout, manual override, gluten-free and vegan filters, lb/ft units, flexible meal count (5/4/3/2-meal IF), fibre totals.

---

## Open follow-ups / flags

- **Paid tier:** when the ten-dollar-a-month subscription launches, revisit "free" labels/titles. The audit's per-area prescriptions and the "full system coming" line are the natural funnel point. (Earlier research leaned PWA now, done; Stripe + Netlify or a low-code membership later. AU Stripe fees roughly 1.75% + A$0.30; app-store cut 15 to 30%.)
- **OFF_TARGET:** the nutrition swap note and the totals "off target" colour now share the `OFF_TARGET` constant. Change it once and both move together.
- **Vanguard page** is an unlinked coming-soon page; wire navigation back to it when the offer is ready.
- **PWA** install and offline behaviour require HTTPS and a second visit; verify on the live Netlify domain.
- **Parked future project, the AI Training Engine:** an AI tool that generates personalised training blocks from the coaching method. The method, principles, and v1 system prompt now live in a separate Claude project ("MDT Training Engine"); the draft is saved as `training-tool-system-prompt-v1.md`. Resume after the current site and tools are refined. Would sit behind the paid tier (login + Stripe + a backend function calling the Anthropic API, output rendered like the nutrition tool).
