# Deploy

## What went wrong last time

`index.html` loads `assets/scale.js` and `data/recipes.json`. The files were
sent to you flat, so those two 404'd. A missing `scale.js` threw an error partway
down the script, which meant every handler defined *after* that point — including
**Generate the week** and the PDF button — was never attached. "Calculate targets"
still worked because it is defined earlier. Hence: some buttons worked, one did
nothing, no visible error.

Three things now prevent that happening again:

- `scale.js` is **inlined into `index.html`**, so it cannot be missing.
- `recipes.json` is looked for at `data/recipes.json`, then `recipes.json`, then
  `/data/recipes.json`, so either layout works.
- Any script error now shows a red banner instead of leaving a dead button.

`jspdf_umd_min.js` was also misnamed — the page asks for `jspdf.umd.min.js`
(dots, not underscores), so the PDF download would have failed too. Fixed here.

## Upload this folder as-is

Drag the whole folder into Netlify. Do not flatten it. The structure matters:

```
index.html
sw.js
offline.html
manifest.webmanifest
netlify.toml
assets/
  styles.css
  scale.js
  jspdf.umd.min.js
  icon-180.png  icon-192.png  icon-512.png  icon-maskable-512.png
  fonts/*.woff2   (7 files)
data/
  recipes.json
```

Every reference in every file was checked against this tree: 0 broken paths, and
all URLs return 200 when served.

## Check it worked

Open the site and confirm, in order:

1. **Calculate targets** fills in the numbers.
2. **Generate the week** produces seven days of meals.
3. Tapping a meal name opens the recipe with scaled amounts.
4. **Download PDF (with recipes)** saves a file.
5. Open the browser console (F12). It should be clean. If a red banner appears at
   the top of the page, it names the file that failed.

If step 2 does nothing again, it is almost always a 404. Open the Network tab,
reload, and look for anything red.

## After you deploy

Bump `CACHE_VERSION` in `sw.js` on every future change, or installed users keep
the old cached copy. It is currently `th-nutrition-v3-oneserve`.
