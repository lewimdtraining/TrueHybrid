# Modern Day Templar, Website (setup & editing guide)

The MDT hub: your story + pillars, the tools (Audit + Nutrition Tool), and a free download of the complete framework doc. (The weekly-note signup and the Vanguard teaser have been removed from the homepage; the `/vanguard/` page still exists but is unlinked.) Everything you need to get it live and keep it edited is below.

**Quick start:** create a free GitHub account → upload the contents of this folder → connect Netlify → you're live in ~15 minutes. Step-by-step below.

Live site: _(add URL once deployed)_

---

## What's in this repo

```
mdt-site/
├── index.html              ← homepage / hub (story + pillars + tools + weekly signup)
├── vanguard/index.html     ← The Vanguard waitlist page (the offer, soft launch)
├── assets/
│   ├── styles.css          ← shared brand styles for every page
│   └── favicon.svg         ← favicon
├── data/
│   └── recipes.json        ← all 151 MDT Nutrition Tool recipes, edit here
└── tools/
    ├── audit/index.html        ← The Drift Audit (live), lead magnet
    ├── nutrition/index.html    ← MDT Nutrition Tool (live)
    ├── strength/index.html     ← Strength calc (placeholder)
    ├── running/index.html      ← Run calc (placeholder)
    └── stretching/index.html   ← Mobility protocols (placeholder)
```

Everything is plain HTML + CSS + JavaScript. No build step. No frameworks. No node_modules. You can open `index.html` in a browser (with one caveat, see "Local testing" below) and it just works.

---

## How to get this live on the internet

You only do this once. After that, every edit you make is automatic.

### Part 1, Get a GitHub account & put the code there (10 min)

1. **Sign up at https://github.com** (free)
2. Once logged in, click the `+` icon top-right → **New repository**
3. Name it `mdt-site` (or whatever you like)
4. Set it to **Public** (free; private repos work too but Public is simpler)
5. **Don't** tick "Add a README", we already have one
6. Click **Create repository**
7. On the next screen, click **uploading an existing file**
8. Drag the entire `mdt-site` folder contents (not the folder itself, open it first) into the upload area
9. Scroll down, click **Commit changes**

Your code is now on GitHub.

### Part 2, Connect Netlify so it auto-publishes (5 min)

1. **Sign up at https://netlify.com**, choose **Sign in with GitHub**
2. Click **Add new site** → **Import an existing project**
3. Pick **Deploy with GitHub** → authorise → choose your `mdt-site` repo
4. The build settings should be empty (this is a static site, no build needed). Just click **Deploy site**
5. Wait ~30 seconds. Netlify gives you a URL like `dazzling-bunny-12345.netlify.app`
6. Open that URL. **Your site is live.**

### Part 3, Add a custom domain (optional, ~$12/year)

1. Buy a domain at [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (cheapest) or [Namecheap](https://www.namecheap.com)
2. In Netlify: **Site settings** → **Domain management** → **Add custom domain**
3. Type your domain (e.g. `mdttools.com`)
4. Netlify gives you instructions on what DNS records to add at your domain provider
5. Add those records, wait 1-2 hours for propagation
6. Done. Your site is now at your domain.

---

## How to edit things

This is what makes the GitHub workflow worth it: every edit is 30 seconds via the GitHub web interface. No terminal, no code editor.

### Adding or editing a recipe

1. Go to your GitHub repo in your browser
2. Click into `data/` → click `recipes.json`
3. Click the pencil icon (top right)
4. Edit the JSON directly (see schema below)
5. Scroll down → click **Commit changes** → confirm
6. **Within 60 seconds, Netlify rebuilds and your site is updated**

Recipe schema:

```json
{
  "id": "L026",
  "name": "New Recipe Name",
  "mealType": "lunch",
  "calories": 520,
  "protein": 45,
  "carbs": 50,
  "fats": 14,
  "fibre": 5,
  "servings": 2,
  "prepTime": 10,
  "cookTime": 20,
  "tags": ["chicken", "rice"],
  "description": "Short description.",
  "ingredients": [
    "400g chicken breast",
    "100g rice"
  ],
  "instructions": [
    "Step 1.",
    "Step 2."
  ]
}
```

**Rules:**
- `id` must be unique. Use `B###` for breakfasts, `L###` for lunches, `D###` for dinners, `S###` for snacks
- `mealType` must be exactly: `breakfast`, `lunch`, `dinner`, or `snack`
- `tags` should come from: `chicken, beef, turkey, fish, eggs, dairy, vegetables, fruit, oats, rice, pasta, bread, nuts, legumes, avocado, cheese`
- Macros should roughly equal `(protein × 4) + (carbs × 4) + (fats × 9)`, within ±50 kcal is fine
- Don't forget the comma at the end of each line except the last one in any block
- Don't break the brackets

**Tip:** before committing, paste your edited JSON into https://jsonlint.com to verify it's valid. If JSON is broken, the site won't load recipes, but it won't crash. The error message in the app will tell you.

### Editing copy or styles

- **Site-wide colours, fonts, header/footer styling**: edit `assets/styles.css`. The whole palette is the `:root` block at the top: `--ink` (charcoal), `--bone` / `--paper` (whites), and `--brass` / `--brass-dim` (the logo orange). Change a value there and it updates everywhere at once. The body font is a clean system stack (SF Pro on Apple devices), titles are bold, and italics are off by default.
- **The logo** lives in `assets/` as `mdt-logo-white.png` (used on the dark header and footer) and `mdt-logo-charcoal.png` (for light backgrounds). To change the logo, replace those two files with same-named PNGs.
- **Homepage copy**: edit `index.html`
- **Nutrition tool copy or logic**: edit `tools/nutrition/index.html`
- **Placeholder page copy**: edit the relevant `tools/{name}/index.html`

Same workflow, pencil icon, edit, Commit changes.

### Adding a new tool

1. Make a new folder under `tools/`, for example `tools/calorie-cycling/`
2. Create `tools/calorie-cycling/index.html`
3. Start by copying one of the placeholder files (e.g. `tools/strength/index.html`) as a template, it already imports the shared CSS and includes the top bar / footer
4. Build the tool inside
5. On the homepage (`index.html`), find the `tools-grid` section and add a new `<a class="tool-card">` block linking to your new tool

---

## The Drift Audit (your lead magnet)

Lives at `tools/audit/index.html`. It's a 12-question self-audit that scores across four axes (Aim, Body, Mind, Meaning) and gives an honest reflection + a first move. No data is stored or sent, it runs entirely in the browser.

**To edit the questions:** open `tools/audit/index.html`, find the `QUESTIONS` array in the `<script>` near the bottom. Each entry is `{ axis, text }`. Keep 3 questions per axis (`aim`, `body`, `mind`, `meaning`) so the scoring stays balanced. You can also edit the `MOVES` (the per-axis advice) and `VERDICTS` (the overall bands) right below it.

**Point the "deeper work" button:** find `id="au-deeper"` and change its `href="#"` to your brand / Vanguard waitlist page once that exists.

## Email opt-in & forms (Netlify Forms)

The site has three forms, all using [Netlify Forms](https://docs.netlify.com/forms/setup/), no backend, no third-party tracking. They work automatically once deployed to Netlify (each has `data-netlify="true"` and a hidden `form-name`).

- **`mdt-weekly`**, the weekly-note email signup. Appears on the homepage *and* on the audit results screen; submissions to both pool into one list (Netlify dedups by form name).
- **`vanguard-waitlist`**, on the Vanguard page. Captures name, email, and an optional "where are you at" note.

Find submissions in Netlify dashboard → **Forms**. Set up a notification (Netlify → Forms → Settings) to email you on each new signup.

## The hub & the Vanguard page

The homepage is now the **hub**: your story angle + the three pillars + the free tools + the weekly signup + a soft teaser for the Vanguard. The `vanguard/index.html` page explains the offer and collects a **waitlist**, it's deliberately a soft "opening later to a founding group" page, not a hard sales page, so it fits the growth-first plan. When you're ready to sell, that's the page to harden up (add price, testimonials, an apply-and-call flow).

The audit's "deeper work" button points at `/vanguard/`. The footer help line (`id="mdt-help"`) points at `#`, set it to a real help/resources page for your region when you can.

## The bulk-prep change (nutrition tool)

In **Bulk-prep mode**, every recipe is now automatically multiplied to cover all 7 days. The tool works out how many whole batches you need (e.g. a 2-serve recipe eaten daily, cook x4), scales the shopping quantities accordingly, and states the multiplication in three places: the mode banner, the cook list, and the recipe pop-up (which shows scaled amounts with the single-serve amount in brackets). Logic lives in the `bulkBatch()` and `scaleIngredient()` helpers.

### Download as PDF

Once someone builds a plan, a **Download PDF of this plan** button appears under the meals. It produces a clean, branded PDF that works for both modes: the daily bulk plan (the five meals plus the multiplied cook list) and the 7 day variety plan (all seven days). The PDF library (`assets/jspdf.umd.min.js`) is self-hosted in the repo, so nothing loads from outside and it works offline. Logic lives in the `downloadPlanPDF()` function.

---

## Local testing

You can preview the site on your own computer before pushing changes.

**The simplest way:** Right-click `index.html` → Open With → Chrome/Firefox. This works for the homepage and the audit, but **the nutrition tool won't load recipes** because browsers block `fetch()` from `file://` URLs for security reasons. Everything will work once it's deployed to Netlify.

**To test the nutrition tool locally**, you need a tiny local server. The easiest:

1. Install [VS Code](https://code.visualstudio.com) (free)
2. Install the extension called **Live Server** (search extensions for it)
3. Open the `mdt-site` folder in VS Code
4. Right-click `index.html` → **Open with Live Server**
5. Your browser opens at `http://127.0.0.1:5500` and everything works

---

## Tech notes (for whoever inherits this)

- **No build step**, everything is straight HTML / CSS / JS. Edit, push, done.
- **Recipes live in `data/recipes.json`** and are fetched at runtime by the nutrition tool. Adding a recipe means editing one file, no code changes.
- **Shared CSS lives in `assets/styles.css`**, top bar, footer, base typography, buttons. Each tool's bespoke styles are scoped within its own `index.html`.
- **No tracking, no analytics, no outside calls** - fonts use the device's own system stack (SF Pro on Apple, the system default elsewhere), so there are no web-font downloads. The only library is jsPDF for the nutrition PDF, and it is self-hosted in `assets/`, not loaded from a CDN.
- **No accounts, no user data stored**, every tool calculates client-side and keeps state only in browser memory. Refresh the page, state resets.

---

## Future tools (placeholders ready)

- **Strength**, 1RM estimator, RPE calculator, warm-up builder, plate maths
- **Running**, pace & split calculator, race predictor, training zones, race-day fuel
- **Mobility**, pre-built protocols for hips, shoulders, post-run, desk reset, lower back

Add more by following the "Adding a new tool" steps above.
