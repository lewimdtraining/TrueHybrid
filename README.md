# True Hybrid, Website (setup & editing guide)

The True Hybrid site: the readable **framework** (the complete master document), the framework **PDF download**, the free **tools** (Dopamine Audit + Nutrition Tool), the weekly-note signup, and the Vanguard coming-soon page. Everything you need to get it live and keep it edited is below.

**Quick start:** create a free GitHub account, upload the contents of this folder, connect Netlify, you're live in ~15 minutes. Step-by-step below.

Live site: _(add URL once deployed)_

---

## What's in this repo

```
true-hybrid-site/
├── index.html                  ← homepage (three layers + framework + tools + weekly)
├── framework/index.html        ← the complete framework, readable web version
├── vanguard/index.html         ← The Vanguard, coming-soon page
├── offline.html                ← PWA offline fallback
├── manifest.webmanifest        ← PWA identity
├── sw.js                       ← service worker (offline + caching)
├── netlify.toml                ← redirects + headers
├── assets/
│   ├── styles.css              ← shared brand styles for every page
│   ├── jspdf.umd.min.js        ← self-hosted PDF library (nutrition tool)
│   └── icon-*.png              ← app / home-screen icons
├── data/
│   └── recipes.json            ← all 200 Nutrition Tool recipes, edit here
├── downloads/
│   ├── true-hybrid-framework.pdf   ← the framework PDF (the download)
│   └── *.pdf                    ← the four Dopamine Audit practice cards
└── tools/
    ├── audit/index.html         ← The Dopamine Audit (live)
    ├── nutrition/index.html     ← Nutrition Tool (live)
    ├── strength/index.html      ← Strength calc (placeholder)
    ├── running/index.html       ← Run calc (placeholder)
    └── stretching/index.html    ← Mobility protocols (placeholder)
```

Everything is plain HTML + CSS + JavaScript. No build step, no frameworks, no node_modules.

---

## The brand

**True Hybrid.** The wordmark is set in text, not an image: a small blue **true** next to a bold **HYBRID**, built from the `.th-brand` styles in `assets/styles.css`. To change how the wordmark looks everywhere at once, edit those styles. There's no logo image to swap.

The palette lives in the `:root` block at the top of `assets/styles.css`: `--ink` (near-black), `--paper`/`--bone` (cream/white), `--brass` (baby blue accent), `--brass-dim` (denim, for text-on-light and hover). Change a value there and it updates across every page. Body and titles use the device's own system font stack, so there are no web-font downloads.

_Note: internal CSS class names (`.mdt-topbar`, `.mdt-footer`, `.mdt-nav`) were kept as-is on purpose so the rebrand didn't have to touch selectors on every page. They're invisible to visitors. Same reasoning as the `--brass` variable name, which is baby blue despite the name._

---

## The framework (readable page + download)

- **Readable version:** `framework/index.html`, the complete master document laid out for the web, dark cover, contents, all eight parts plus the quick reference and glossary. Linked from the homepage and the top nav. Pretty URL: `/framework`.
- **Download:** `downloads/true-hybrid-framework.pdf`, linked from the hero, the framework feature band, and the framework page itself. To update it, replace that file with a new PDF of the same name.

To edit the readable framework copy, open `framework/index.html` and edit the prose directly, it's static HTML, no special syntax.

---

## How to get this live

You only do this once. After that, every edit auto-publishes.

1. **GitHub:** sign up at https://github.com, create a new repository (e.g. `true-hybrid-site`), set it Public, then use **uploading an existing file** and drag in the contents of this folder (open the folder first, upload the contents, not the folder). Commit.
2. **Netlify:** sign up at https://netlify.com with **Sign in with GitHub**, then **Add new site → Import an existing project → Deploy with GitHub**, pick your repo. No build command needed (static site). **Deploy site.** You get a URL like `dazzling-bunny-12345.netlify.app` in ~30 seconds.
3. **Custom domain (optional):** buy a domain (Cloudflare Registrar is cheapest), then Netlify → **Domain management → Add custom domain**, and add the DNS records it gives you.

## How to edit things

Every edit is 30 seconds via the GitHub web interface (pencil icon, edit, **Commit changes**). Netlify rebuilds within ~60 seconds.

- **Recipes:** `data/recipes.json`. Schema and rules unchanged, use `B###/L###/D###/S###` ids, keep `mealType` exact, validate at https://jsonlint.com before committing.
- **Colours / fonts / wordmark:** `assets/styles.css` (`:root` for palette, `.th-brand` for the wordmark).
- **Homepage copy:** `index.html`. **Framework copy:** `framework/index.html`. **Tool copy:** the relevant `tools/{name}/index.html`.

## Forms (Netlify Forms)

The weekly-note signup uses Netlify Forms (no backend). Its form name is **`th-weekly`** (it was `mdt-weekly` before the rebrand, renamed on the homepage). If you have any other page still posting to `mdt-weekly`, rename it to `th-weekly` so submissions pool into one list. Find submissions in Netlify dashboard → **Forms**.

## PWA / installable app

`manifest.webmanifest`, `sw.js`, `offline.html`, and the `assets/icon-*.png` set make the site installable and offline-capable. The service worker cache version is `th-v1`, bump it in `sw.js` when you want every installed app to drop old cached assets. Install/offline behaviour needs HTTPS (Netlify provides it) and kicks in on the second visit; it won't work from a `file://` preview.

## Local testing

Right-click `index.html` → Open With → your browser works for the homepage, framework page, and audit. The **nutrition tool won't load recipes from `file://`** (browsers block `fetch()` there); use VS Code + the **Live Server** extension to test it locally, or just rely on the deployed Netlify site.

---

## Tech notes

- No build step, no analytics, no outside calls. Fonts are the system stack; the only library is jsPDF, self-hosted in `assets/`.
- No accounts, nothing stored server-side. Every tool runs client-side and keeps state in browser memory only.
- Recipes are fetched at runtime from `data/recipes.json`; adding one is a single-file edit.
