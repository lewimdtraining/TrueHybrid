# Update: one-serving library, corrected multiplier

Drop these over the existing site. No build step.

```
index.html                                  patched
sw.js                                       patched
assets/scale.js                             new
assets/fonts/poppins-latin-500-normal.woff2 new (was referenced but missing)
data/recipes.json                           rebuilt
```

## The data

Rebuilt from the corrected recipe book. Every recipe is exactly one serving,
and every macro is calculated from the ingredient list on the same record.

36 recipes previously carried `servings: 2` while their macros were per-serving.
The tool divided calories by `servings`, so those meals were costed at *half a
serving* while the ingredient list showed *two*. A 1.4x portion of Chicken Chow
Mein put 2.8 servings of food in the pan and counted 0.7. That whole class of
error is gone.

Recipe `id`, `mealType` and `tags` are byte-for-byte unchanged, so saved plans
keep working. One field is added: `ingredientMacros`, the per-line
`[kcal, protein, carbs, fats, fibre]` at one serving.

## Why `ingredientMacros` exists

Scaled amounts get rounded so they can be weighed: 1.25 apples becomes 1 1/2,
280.4g becomes 280g. If the macros are the recipe totals multiplied by 1.25
while the list says 1 1/2, the plan and the food disagree. The tool now re-adds
the macros from the rounded amounts, so the number on screen always describes
the food in the list.

Measured over 240 generated meals, ingredient lists and displayed macros agree
to a median of 0.05%.

## Bugs fixed in `index.html`

1. **`scaleQty` only scaled the first number on a line**, because its regex was
   anchored with `^`. Any line starting with a label scaled *nothing*:
   `Sauce: 15g peanut butter, 10g soy sauce, 7.5g honey...` stayed at 1x while
   the protein and rice scaled up. 28 compound lines and 32 lines whose number
   is not first were affected. Replaced with `THScale.scaleIngredient`, which
   handles every quantity on the line.

2. **Bulk-prep could not express a 7x batch.** Portion bounds are 0.5x-3.0x, and
   the batch factor was being run through the same clamp. Bulk now derives the
   daily figure from a seventh of the week's amounts, which is what a user
   actually eats. Agreement improved from 7.7% worst-case to 0.9%.

3. **Per-item weights scaled twice.** `2 tortillas (~40g each)` at 2x became
   `4 tortillas (~80g each)` — quadruple. Spans containing "each" are now frozen.

4. **The gluten-free filter passed 57 recipes containing gluten.** It checked
   only the `bread` and `pasta` tags, so oats, granola, noodles, couscous, soy
   sauce and crackers all slipped through. Filters now read the ingredient text.
   Vegan likewise missed honey. Compound names are neutralised first so
   "peanut butter" is not read as butter and "soy milk" is not read as milk.
   Remaining pools: gluten-free 83, vegetarian 103, vegan 25, nut-free 172 —
   all with recipes in every meal slot.

5. **Portion floor raised from 0.4x to 0.5x.** Below half a serving the amounts
   stop being practical to weigh. Bounds now live in one place, `THScale`, so
   the picker, the normaliser and the ingredient scaler cannot drift apart.

6. **The normaliser kept its last pass rather than its best.** It now runs up to
   eight passes and keeps whichever landed closest, stopping early when every
   portion is pinned at a bound.

## Bug fixed in `sw.js`

`PRECACHE` listed `assets/fonts/poppins-latin-500-normal.woff2`, which was not
in the build. `cache.addAll()` rejects if a single entry 404s, so the install
event failed, the worker never activated, and **no visitor has ever had working
offline mode**. The font is included, and precaching now caches each entry
independently so one missing asset cannot take the install down.
`CACHE_VERSION` is bumped to `th-nutrition-v3-oneserve`.

## Accuracy after the changes

Across 200 generated plans spanning 1500-3200 kcal and 3-5 meals a day, in both
variety and bulk mode:

| check | result |
|---|---|
| day total vs calorie target | median 0.31% off, worst 3.7% |
| ingredient list vs displayed macros (variety) | median 0.05% |
| week's amounts / 7 vs daily figure (bulk) | median 0.04%, worst 0.9% |
| portions outside 0.5x-3.0x | none |
| ingredient lines the scaler cannot read | none |

Days cannot always land exactly on target, because portions round to amounts
you can weigh. The worst case is a small calorie target split across three
large meals, where the granularity of a real portion is coarse relative to the
day. That residual is honest: it reflects the food, not a calculation error.
