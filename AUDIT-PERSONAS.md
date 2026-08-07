# End-to-end audit across 16 people

Sixteen personas were run through the whole tool, seven days each, in both
variety and bulk-prep mode: petite woman cutting at 1,200 kcal through to a
110 kg man building at 4,731 kcal, plus vegan, vegetarian, gluten-free, nut-free,
intermittent fasting, and two over-60s.

## Result

| check | result |
|---|---|
| macros more than 10% off target, any persona | **0** |
| calories vs target | within 1% on every persona |
| printed ingredient amounts vs the macros shown | median 0.04%, worst 0.42% |
| amounts outside a sensible cooking range | 1.0% of 2,571 quantities |
| unbuyable pack fractions ("1 3/4 pouch") | 0 |
| daily fibre, highest persona | 55 g |
| recipes per 28-meal week | 20 distinct |

Across a wider sweep of 1,080 plans (both sexes, 45–130 kg, every activity level
and goal, 3–5 meals, each filter): median deviation 0% calories, 3% protein,
1% carbs, 1% fat.

## Four faults found and fixed

**1. Fibre was blowing out badly.** Nothing constrained it, so big-calorie plans
scaled up oats, beans and wholegrains and the fibre rode along: **135 g a day**
for the 4,731 kcal persona, 96 g for the 3,753 kcal one. That is roughly four
times any guideline and genuinely unpleasant to eat.

Fibre is now a ceiling rather than a target, set at 16 g per 1,000 kcal (floor
30 g, cap 55 g), applied in two places: the picker will not stack high-fibre
recipes once the day's budget is spent, and the ingredient solver pulls amounts
back if a meal sails past its share. Worst persona is now 55 g. Macro accuracy
was unaffected.

Vegan and vegetarian plans get a higher ceiling (×1.45 and ×1.15), because plant
based eating is inherently higher in fibre and holding it to the same limit just
pushed the macros off instead.

**2. "1 3/4 pouch microwave lentils".** Pack-sized items were being scaled like
loose weights. Tins, pouches, cans, jars and sachets now round to halves.

**3. Counts and weights could contradict each other.** "1 tin tuna (95 g
drained)" at 0.75x became "1 tin tuna (70 g drained)" — one tin, but 70 g. The
rounded count now governs the whole line, so the two always agree.

**4. "5 1/2 eggs whites".** The pluraliser matched `egg` inside `egg white`.
Wrong grammar, and ambiguous enough that a reader could take it as whole eggs.
Longest match now wins, and text that is already plural is left alone. This was
the single worst defect found: an independent re-cost of that meal came out 60%
above the macros displayed. It is now 0.42% worst case.

## What is still imperfect, and why

**Vegan is the weak filter.** 24% of vegan plans have a macro more than 10% off,
against 3–10% for everything else, and fat is the usual offender at up to 17%.
The pool is 25 recipes and structurally fatty: nuts, tofu, hummus, avocado,
peanut butter. Adjusting amounts inside a recipe has taken this as far as it
goes. It needs about six more lean, higher-carb vegan recipes — lentil and bean
bowls, rice dishes, fruit-and-oat breakfasts.

**About 1% of amounts run large.** A 610 g baking potato, 400 g of marinara,
125 g of light cream cheese. All are edible and all appear on 3,700–4,700 kcal
plans where the whole day is large. None are wrong, some just look odd on the
page.

**Fat-role ingredients can be cut to 0.40x of portion.** Right for oil, and what
fixed the original fat overshoot, but it occasionally means noticeably less
jarred sauce than a recipe intends. Raise the fat lower bound in `REL` in
`scale.js` from `0.40` to about `0.55` if you would rather protect the sauce and
give up a few percent of fat accuracy.

**Very high calorie targets are large volumes of food.** The 4,731 kcal persona
eats roughly 1,070 kcal at breakfast and 1,266 at dinner. That is correct, not a
fault, but it is worth setting expectations in your sales copy.

`CACHE_VERSION` is bumped to `th-nutrition-v6-audited`.
