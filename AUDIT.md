# Pre-sale audit, True Hybrid Nutrition Tool

Everything below was tested by running the tool's own code headless against the
real recipe data, not by reading it. Where a number is quoted, it came from a
test run.

## Verdict

The engine is sound and the numbers are honest. Eight defects were found and
fixed. Four items remain that are **not bugs but limits you should decide about
before charging money** — they are listed at the end.

## Fixed in this pass

**1. No input validation at all.** Every field was read with `+value`, so a
blank box became zero. Blank weight produced a target of "0g protein". Blank age
produced 3023 kcal. Negative weight produced −164g protein. A customer who
tabbed past a field got a plan built on nonsense, silently. Inputs are now
bounded (weight 30–300 kg, height 120–230 cm, age 16–90) with a plain-English
message, and the plan cards stay hidden until the input is sane.

**2. The unit toggle converted twice.** Clicking "Imperial" when already on
Imperial re-ran the conversion: 82 kg became 181 lb, then 399 lb. Switching back
gave 181 kg. Conversion now only runs when the unit actually changes.

**3. Meal selection ignored protein entirely.** The picker scored on calories
alone, so protein landed wherever it happened to. Measured against a 150g
target: vegan plans came in as low as 85g (−43%), vegetarian 89g (−41%), and
even unfiltered plans hit 123g (−18%). Protein is now scored, weighted so a
shortfall costs more than an overshoot.

  | filter | worst before | worst after |
  |---|---|---|
  | none | −18% | +1% |
  | vegetarian | −41% | −9% |
  | vegan | −43% | −13% |
  | gluten-free | −16% | −1% |

**4. Fixing protein flattened variety, so that was fixed too.** Scoring protein
made one recipe the clear optimum every day: a 28-meal week collapsed to 4
distinct recipes. The picker now draws from a shortlist of good-enough options.
A week now runs 20 distinct recipes out of 28, and only 4 weeks in 40 repeat any
recipe four times or more.

**5. The readout only flagged overshoot.** A plan that missed protein by 20%
displayed in the same neutral colour as a plan that hit it. Shortfalls are now
flagged, and a plain-English line says which macro is off and by how much,
rather than leaving a colour to be decoded.

**6. The fibre target was unreachable.** The target card promised "30+" but the
library delivered a median of 24g, reaching 30g on 19 days in 60. It now reads
"25–30 guide", which is what the recipes actually support, and the readout says
so when a plan comes in under.

**7. Accessibility gaps.** 16 labels were not associated with their inputs, the
recipe modal had no dialog role, could not be closed with Escape, did not move
focus, and its close button was an unlabelled "×". All fixed. Results are now
announced to screen readers.

**8. No health disclaimer anywhere.** A tool that outputs a calorie target to a
member of the public, sold as a product, had nothing. There is now a disclaimer
above the calculate button and a short one in the footer, naming pregnancy,
under-18s, diabetes and kidney disease, medication interactions, and a history
of disordered eating as reasons to speak to a professional first.

Also fixed: `apple-touch-icon` pointed at `icon-180.png`, which is not in the
build.

## Verified working

| check | result |
|---|---|
| recipe data integrity (macros vs ingredients, all 200) | 0 failures |
| all recipes single-serving | yes |
| day total vs calorie target, 200 plans, 1400–3200 kcal, 2–5 meals | median 0.33% off, worst 2.7% |
| ingredient list vs displayed macros | median 0.05%, worst 1.2% |
| bulk-prep week ÷ 7 vs daily figure | median 0.04%, worst 0.4% |
| macro split always sums to the calorie target (43,500 combinations) | 0 failures |
| carbs never forced negative or to zero | confirmed |
| PDF export, both modes | generates cleanly, 8 pages variety / 1 page bulk |
| characters outside Latin-1 that would break the PDF | none |
| portions outside 0.5×–3.0× | none |
| ingredient lines the scaler cannot read | none |
| external network requests (the "no tracking" claim) | none, claim holds |

## Decide before you sell

**1. Four of the 16 filter combinations cannot produce a plan.** Anything
combining vegan with gluten-free has zero breakfasts available. The tool fails
gracefully with a clear message, but a paying customer who ticks those two boxes
gets nothing. Vegetarian + gluten-free technically works but has only 3 lunches
and 3 dinners, and misses protein in about half of plans. This is a library gap,
not a code fault: it needs roughly 6–10 more recipes, mostly gluten-free vegan
breakfasts and higher-protein plant lunches and dinners.

**2. Protein is set at 2.0 g per kg of total bodyweight.** For someone carrying
significant body fat this over-prescribes protein and squeezes carbs hard: a
130 kg sedentary user gets 260g of protein, over half their calories. Consider
scaling from an estimate of lean mass, or capping protein as a share of intake.

**3. The page still says "free".** The title is "True Hybrid, Free Nutrition
Tool", the footer says "A free nutrition tool", and the README describes it as
free with no accounts. If you are selling it, that copy contradicts the offer
and needs changing everywhere, along with terms of sale and a refund policy.

**4. Underlying food data carries about ±8% inherent error.** Brands, cuts of
meat and how heavily someone portions all move it. That is normal for any
nutrition product and is stated in the recipe book, but if you advertise
accuracy, describe it as a close estimate rather than a precise count.

## Nice to have, not blocking

- The PDF has no shopping list. For bulk-prep especially, a combined list is the
  obvious next feature.
- The PDF renders in Helvetica rather than the brand fonts used everywhere else.
- Nothing was tested in a real browser. The logic is verified headless; click
  through it on iOS and Android before launch, particularly the PWA install and
  offline path.
