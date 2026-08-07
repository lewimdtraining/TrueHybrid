# Recipes now adjust ingredient by ingredient

## What changed

Previously the tool scaled a whole recipe by one number. That changes the **size**
of a meal but never its **shape**: a dish that is 40% fat is still 40% fat at
1.4x. So calories landed perfectly while fats ran up to +47% and carbs −27%.

Now each recipe is solved ingredient by ingredient against the person's targets.
The rice goes up, the oil comes down, the chicken moves to suit.

```
Chicken & Rice Power Bowl        as written    582 kcal  P55 C62 F11
target for this slot                           600 kcal  P45 C85 F12
fitted                                         607 kcal  P44 C80 F10

  210g raw chicken breast    ->  155g raw chicken breast
  180g cooked rice           ->  230g cooked rice
  100g steamed green beans   ->  130g steamed green beans
  1 tsp olive oil            ->  1 1/4 tsp olive oil
  1 tbsp teriyaki or soy     ->  1 1/4 tbsp teriyaki or soy
```

## How it works

**Each ingredient's job is read from its own macros.** A line that is mostly
protein calories is a protein source, mostly carbs a carb source, and so on.
Lines under 8 kcal (herbs, spices, water) are held fixed, and lines carrying less
than 9% of the meal are held near size, because stretching them cannot move the
macros but does produce silly amounts of sauce.

**Each kind of ingredient may only move so far** from the meal's own portion
size: protein 0.65–1.55x, carbs 0.55–1.85x, fats 0.40–1.45x, minor items
0.85–1.25x, with a hard floor and ceiling of 0.30x and 3.50x. A pull term keeps
amounts near the honest portion, so the solver cannot buy a macro fit by mangling
the dish. Across 5,881 fitted ingredients in testing, none escaped those bounds.

**The day is solved, not just the meal.** Recipes are still chosen first for
macro shape, because no amount of adjusting turns a nut snack into a carb source.
Then each meal is fitted against what is *left* of the day, and the whole day is
re-solved up to three more times to mop up rounding.

**Amounts are still rounded to something weighable, and the macros are re-added
from the rounded amounts.** The numbers always describe the food actually
printed. Verified independently: displayed macros match a re-costing of the
printed ingredient lists to a median of 0.05%.

## Accuracy

Weekly averages, 1,080 plans: both sexes, 45–130 kg, every activity level and
goal, 3–5 meals a day, each dietary filter.

| | before | now |
|---|---|---|
| plans with any macro >10% off | 23% | **5%** |
| median calorie deviation | 0% | 1% |
| median protein deviation | 4% | 2% |
| median carb deviation | 2% | 1% |
| median fat deviation | 4% | 2% |
| worst fat deviation | 33% | 16% |

By filter, share of plans where every macro lands within 10%:

| filter | before | now |
|---|---|---|
| no filters | 88% | 99% |
| gluten-free | 88% | 100% |
| vegetarian | 91% | 98% |
| nut-free | 87% | 97% |
| vegan | 36% | 80% |

The vegan gap I flagged as unfixable by selection alone has largely closed: fat
now moves within the recipe rather than needing a leaner recipe to exist. Vegan
is still the weakest case, because the pool is 25 recipes and genuinely fatty.

## Unchanged and re-verified

Ingredient lists match displayed macros (0.05% median), bulk-prep week ÷ 7
matches the daily figure (0.05%), PDF exports in both modes, input validation and
the unit toggle behave, a week still runs 20 distinct recipes out of 28, and the
page still recovers if `recipes.json` is uploaded flat.

## One caveat

Fat-role ingredients can be cut to 0.40x of portion. For oil that is exactly
right and is what fixed the fat overshoot. For a jarred sauce it occasionally
means noticeably less sauce than the recipe intends. If that bothers you, raise
the fat lower bound in `REL` in `scale.js` from `0.40` to about `0.55`; expect
fat accuracy to loosen by a few percent in exchange.

`CACHE_VERSION` is bumped to `th-nutrition-v5-fitted`.
