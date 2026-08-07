/* True Hybrid, ingredient scaling.
 *
 * Every recipe in recipes.json is exactly one serving, so a portion multiplier
 * can be applied directly to the ingredient list. This module scales the
 * printed amounts using the same rounding the recipe book uses, so a 1.4x
 * portion shows amounts you can actually weigh.
 *
 *   scaleIngredient('200g lean topside (raw), sliced', 1.4)
 *     -> '280g lean topside (raw), sliced'
 *
 *   scaleRecipe(recipe, 1.4)
 *     -> { ...recipe, portion: 1.4, calories, protein, carbs, fats, fibre,
 *          ingredients: [...scaled] }
 *
 * Units are left alone where scaling them would be meaningless: percentages
 * (95% lean), dimensions (5cm pieces), oven temperatures and cooking times.
 */
(function (root, factory) {
  var api = factory();
  // Export both ways rather than either/or: some environments define `module`
  // even in a browser, which previously left window.THScale undefined.
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.THScale = api;
})(typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : this), function () {
  'use strict';

  var UNIT = '(?:kg|g|ml|l|tbsp|tsp|cups?)';
  var NUM = '(?:\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:\\.\\d+)?)';
  var BLOCK = new RegExp('(' + NUM + ')\\s*(' + UNIT + ')?\\b', 'gi');
  var NOSCALE = /^\s*(?:%|\+|cm\b|mm\b|min\b|mins\b|minute|degrees|C\b|F\b)/i;
  var ITEMS = '(?:egg|tortilla|fillet|bun|wrap|muffin|crumpet|slice|bagel|pita|' +
              'rice cake|crispbread|banana|apple|sausage|waffle|pancake|' +
              'pouch|tin|can|jar|sachet|packet)';
  var DISCRETE = new RegExp('^[^,()]{0,28}?\\b' + ITEMS + 's?\\b', 'i');

  var SINGULAR = {
    'whole eggs': 'whole egg', 'egg whites': 'egg white', 'eggs': 'egg',
    'tortillas': 'tortilla', 'fillets': 'fillet', 'buns': 'bun', 'wraps': 'wrap',
    'muffins': 'muffin', 'crumpets': 'crumpet', 'slices': 'slice', 'bagels': 'bagel',
    'rice cakes': 'rice cake', 'crispbreads': 'crispbread', 'bananas': 'banana',
    'apples': 'apple', 'sausages': 'sausage', 'waffles': 'waffle',
    'pancakes': 'pancake', 'crackers': 'cracker', 'potatoes': 'potato',
    'pouches': 'pouch', 'tins': 'tin', 'cans': 'can', 'sachets': 'sachet',
    'jars': 'jar', 'packets': 'packet'
  };

  var NICE = [[1, 4], [1, 3], [1, 2], [2, 3], [3, 4]];

  function value(s) {
    s = String(s).trim();
    if (s.indexOf(' ') > -1 && s.indexOf('/') > -1) {
      var bits = s.split(/\s+/);
      var fr = bits[1].split('/');
      return parseFloat(bits[0]) + parseFloat(fr[0]) / parseFloat(fr[1]);
    }
    if (s.indexOf('/') > -1) {
      var f = s.split('/');
      return parseFloat(f[0]) / parseFloat(f[1]);
    }
    return parseFloat(s);
  }

  function fmtWeight(x) {
    if (x >= 40) return String(Math.round(x / 5) * 5);
    if (x >= 10) return String(Math.round(x));
    if (x >= 1) return Math.abs(x - Math.round(x)) < 0.3
      ? String(Math.round(x)) : trimZero(x.toFixed(1));
    return trimZero(x.toFixed(1));
  }

  function trimZero(s) { return s.replace(/\.0$/, ''); }

  function fmtFrac(x) {
    if (x <= 0) return null;
    var whole = Math.floor(x), rem = x - whole, best = null, bestErr = 1;
    for (var i = 0; i < NICE.length; i++) {
      // round before comparing so an exact tie resolves identically to the
      // reference implementation (first candidate wins, the simpler fraction)
      var err = Math.round(Math.abs(NICE[i][0] / NICE[i][1] - rem) * 1e6) / 1e6;
      if (err < bestErr) { bestErr = err; best = NICE[i]; }
    }
    if (rem < 0.08) return whole ? String(whole) : null;
    if (bestErr > 0.13) return trimZero(x.toFixed(1));
    var f = best[0] + '/' + best[1];
    return whole ? whole + ' ' + f : f;
  }

  var PLURAL = {}, PLURAL_KEYS = [], SINGULAR_KEYS = [];
  (function(){
    for (var k in SINGULAR) PLURAL[SINGULAR[k]] = k;
    // Longest first, so "egg white" is matched before "egg" and we never
    // produce "eggs whites".
    PLURAL_KEYS = Object.keys(PLURAL).sort(function(a,b){ return b.length - a.length; });
    SINGULAR_KEYS = Object.keys(SINGULAR).sort(function(a,b){ return b.length - a.length; });
  })();

  // "2 pouch" reads wrong; if the count went above one, put the noun back in
  // the plural.
  function pluralise(text) {
    var head = text.split(/[,(]/)[0];
    var m = head.match(/^\s*(\d+(?:\s+\d\/\d)?|\d\/\d)\s+/);
    if (!m) return text;
    if (value(m[1]) <= 1) return text;
    // Already plural ("5 egg whites"): leave it alone, or "egg" inside
    // "egg whites" gets pluralised and yields "eggs whites".
    for (var qi = 0; qi < SINGULAR_KEYS.length; qi++) {
      if (new RegExp('\\b' + SINGULAR_KEYS[qi] + '\\b', 'i').test(head)) return text;
    }
    for (var pi = 0; pi < PLURAL_KEYS.length; pi++) {
      var sing = PLURAL_KEYS[pi];
      var re = new RegExp('\\b' + sing + '\\b(?!s)', 'i');
      var hit = head.match(re);
      if (hit) {
        var at = text.toLowerCase().indexOf(hit[0].toLowerCase());
        return text.slice(0, at) + PLURAL[sing] + text.slice(at + hit[0].length);
      }
    }
    return text;
  }

  function singularise(text) {
    var head = text.split(/[,(]/)[0];
    if (!/^\s*1\s+\D/.test(head)) return text;
    for (var si = 0; si < SINGULAR_KEYS.length; si++) {
      var plur = SINGULAR_KEYS[si], sing = SINGULAR[plur];
      var re = new RegExp('\\b' + plur + '\\b', 'i');
      var m = head.match(re);
      if (m) {
        var at = text.toLowerCase().indexOf(m[0].toLowerCase());
        return text.slice(0, at) + sing + text.slice(at + m[0].length);
      }
    }
    return text;
  }

  // Spans like "(~20g each)" state a weight PER ITEM. When the count in front
  // of them scales, that per-item weight must stay put, or the line scales twice.
  function perUnitSpans(line) {
    var spans = [], re = /\([^)]*\)/g, m;
    while ((m = re.exec(line)) !== null) {
      if (/\beach\b/i.test(m[0])) spans.push([m.index, m.index + m[0].length]);
    }
    return spans;
  }

  // A countable item can only move in halves, so "1 tin (95g drained)" at 0.75x
  // must not become "1 tin (70g drained)" - the count and the weight would
  // contradict each other. Work out the count's rounded ratio first, then apply
  // that same ratio to everything else on the line.
  function discreteRatio(line, factor) {
    BLOCK.lastIndex = 0;
    var m;
    while ((m = BLOCK.exec(line)) !== null) {
      var after = line.slice(m.index + m[0].length);
      var before = line.slice(0, m.index);
      if (m[2]) continue;                                  // has a unit, not a count
      if (NOSCALE.test(after)) continue;
      if (!DISCRETE.test(after.slice(0, 32))) continue;
      var tail = before.replace(/\s+$/, '');
      var ok = m.index === 0 || /(?:^|[,+(])\s*$/.test(before) || /\bof$/i.test(tail);
      if (!ok) continue;
      var base = value(m[1]);
      if (!(base > 0)) continue;
      var rounded = Math.max(0.5, Math.round(base * factor * 2) / 2);
      return rounded / base;
    }
    return null;
  }

  function scaleDetailed(line, factor) {
    if (!factor || Math.abs(factor - 1) < 1e-9) return { text: line, ratio: 1 };
    var out = '', pos = 0, m, changed = false, ratios = [];
    var frozen = perUnitSpans(line);
    var dr = discreteRatio(line, factor);
    if (dr != null) factor = dr;
    function inFrozen(i) {
      for (var k = 0; k < frozen.length; k++) if (i > frozen[k][0] && i < frozen[k][1]) return true;
      return false;
    }
    BLOCK.lastIndex = 0;
    while ((m = BLOCK.exec(line)) !== null) {
      var after = line.slice(m.index + m[0].length);
      var before = line.slice(0, m.index);
      var unit = m[2];
      if (NOSCALE.test(after)) continue;
      if (inFrozen(m.index)) continue;
      if (!unit) {
        var tail = before.replace(/\s+$/, '');
        var ok = m.index === 0 || /(?:^|[,+(])\s*$/.test(before) || /\bof$/i.test(tail);
        if (!ok) continue;
      }
      var nv = value(m[1]) * factor, txt;
      if (unit && /^(?:g|ml|kg|l)$/i.test(unit)) {
        txt = fmtWeight(nv);
      } else {
        if (!unit && DISCRETE.test(after.slice(0, 32))) {
          nv = Math.max(0.5, Math.round(nv * 2) / 2);
        }
        txt = fmtFrac(nv);
      }
      if (txt === null) continue;
      var base = value(m[1]);
      if (base > 0) ratios.push(value(txt) / base);
      var trailer = m[0].slice(String(m[1]).length);
      out += line.slice(pos, m.index) + txt + (trailer || ' ');
      pos = m.index + m[0].length;
      changed = true;
    }
    if (!changed) return { text: line, ratio: 1 };
    out += line.slice(pos);
    out = out.replace(/\s{2,}/g, ' ').replace(/\s+,/g, ',').trim();
    var ratio = ratios.length
      ? ratios.reduce(function (a, b) { return a + b; }, 0) / ratios.length
      : 1;
    return { text: pluralise(singularise(out)), ratio: ratio };
  }

  function scaleIngredient(line, factor) {
    return scaleDetailed(line, factor).text;
  }


  // ---------------------------------------------------------------- fitting
  // A single multiplier changes the SIZE of a meal but never its SHAPE: scale a
  // 40%-fat dish by 1.4x and it is still 40% fat. To meet a macro split the
  // amounts inside the recipe have to move relative to each other, which is what
  // this does: nudge the rice up, the oil down, the chicken to suit, within
  // bounds tight enough that the dish is still the dish.

  // What each line mainly contributes, worked out from its own macros.
  function roleOf(m, mealKcal) {
    var kcal = m[0] || 0;
    if (kcal < 8) return 'fixed';                       // seasoning, herbs, water
    // A line carrying only a few percent of the meal cannot move its macros, but
    // stretching it does produce silly amounts of sauce or veg. Hold it near size.
    if (mealKcal && kcal / mealKcal < 0.09) return 'minor';
    var p = (m[1] * 4) / kcal, c = (m[2] * 4) / kcal, f = (m[3] * 9) / kcal;
    if (p >= c && p >= f) return 'protein';
    if (c >= f) return 'carb';
    return 'fat';
  }

  // How far each kind of ingredient may move from the meal's own portion size.
  var REL = {
    protein: [0.65, 1.55],
    carb:    [0.55, 1.85],
    fat:     [0.40, 1.45],
    minor:   [0.85, 1.25],
    fixed:   [1.00, 1.00]
  };
  var ABS = [0.30, 3.50];

  function fitRecipe(recipe, want, opts) {
    opts = opts || {};
    var per = recipe.ingredientMacros;
    var n = recipe.ingredients.length;
    var base = recipe.calories > 0 ? (want.cal / recipe.calories) : 1;
    base = Math.min(ABS[1], Math.max(ABS[0], base));

    if (!per || per.length !== n) {                     // no per-line data: fall back
      return scaleRecipe(recipe, base);
    }

    var lo = [], hi = [], x = [];
    for (var i = 0; i < n; i++) {
      var r = REL[roleOf(per[i], recipe.calories)];
      lo.push(Math.max(ABS[0], base * r[0]));
      hi.push(Math.min(ABS[1], base * r[1]));
      x.push(base);
    }

    // Weights are in calorie-equivalents so the four targets are comparable.
    // Calories matter most; the pull term keeps amounts near the honest portion
    // so the solver cannot buy a macro fit by mangling the recipe.
    var W = { cal: 1.0, prot: 0.9, carb: 0.8, fat: 1.1 };
    // Fibre is not a target to hit, it is a ceiling not to sail past. Big
    // calorie plans scale up oats, beans and wholegrains, and fibre rides along
    // with them: left alone this reached 135 g a day, which nobody can stomach.
    var fibMax = want.fibMax != null ? want.fibMax : Infinity;
    var W_FIB = 2.2;
    var PULL = opts.pull == null ? 0.06 : opts.pull;
    var tgt = [want.cal, want.prot || 0, want.carb || 0, want.fat || 0];
    var SCALE = [1, 4, 4, 9];
    var WT = [W.cal, W.prot, W.carb, W.fat];

    function totals() {
      var t = [0, 0, 0, 0, 0];
      for (var i = 0; i < n; i++)
        for (var k = 0; k < 5; k++) t[k] += (per[i][k] || 0) * x[i];
      return t;
    }

    // Coordinate descent: for one ingredient at a time the error is a simple
    // quadratic, so the best value has a closed form. Clamp it and move on.
    var t = totals();
    for (var pass = 0; pass < 60; pass++) {
      var moved = false;
      for (var i = 0; i < n; i++) {
        if (hi[i] - lo[i] < 1e-9) continue;
        var A = 0, B = 0;
        // Only bites when the meal is over its fibre ceiling, so normal meals
        // are untouched.
        if (isFinite(fibMax) && t[4] > fibMax && per[i][4] > 0) {
          var af = per[i][4] * 4;
          var restF = (t[4] - per[i][4] * x[i]) * 4;
          A += W_FIB * af * af;
          B += W_FIB * af * (restF - fibMax * 4);
        }
        for (var k = 0; k < 4; k++) {
          var a = per[i][k] * SCALE[k];
          if (!a) continue;
          var rest = (t[k] - per[i][k] * x[i]) * SCALE[k];
          var w = WT[k];
          A += w * a * a;
          B += w * a * (rest - tgt[k] * SCALE[k]);
        }
        var refCal = Math.max(per[i][0], 1);
        A += PULL * refCal * refCal;
        B -= PULL * refCal * refCal * base;
        if (A <= 0) continue;
        var nx = Math.min(hi[i], Math.max(lo[i], -B / A));
        if (Math.abs(nx - x[i]) > 1e-6) {
          for (var k2 = 0; k2 < 5; k2++) t[k2] += (per[i][k2] || 0) * (nx - x[i]);
          x[i] = nx; moved = true;
        }
      }
      if (!moved) break;
    }

    // Round each amount to something weighable, then re-add the macros from what
    // was actually printed, so the numbers describe the food on the page.
    var out = Object.assign({}, recipe);
    var lines = recipe.ingredients.map(function (l, i) { return scaleDetailed(l, x[i]); });
    out.ingredients = lines.map(function (d) { return d.text; });
    out.factors = lines.map(function (d) { return d.ratio; });
    out.portion = base;
    var acc = [0, 0, 0, 0, 0];
    for (var i2 = 0; i2 < n; i2++)
      for (var k3 = 0; k3 < 5; k3++) acc[k3] += (per[i2][k3] || 0) * lines[i2].ratio;
    out.calories = Math.round(acc[0]); out.protein = Math.round(acc[1]);
    out.carbs = Math.round(acc[2]);    out.fats = Math.round(acc[3]);
    out.fibre = Math.round(acc[4]);    out.exact = true;
    out.tuned = true;
    return out;
  }

  // Re-apply a solved set of per-ingredient factors, optionally for a batch
  // (bulk prep cooks x7). Macros come back out of the rounded amounts.
  function applyFactors(recipe, factors, batch) {
    batch = batch || 1;
    var per = recipe.ingredientMacros;
    var lines = recipe.ingredients.map(function (l, i) {
      return scaleDetailed(l, (factors && factors[i] != null ? factors[i] : 1) * batch);
    });
    var acc = [0, 0, 0, 0, 0];
    if (per && per.length === lines.length) {
      for (var i = 0; i < lines.length; i++)
        for (var k = 0; k < 5; k++) acc[k] += (per[i][k] || 0) * lines[i].ratio;
    }
    return {
      ingredients: lines.map(function (d) { return d.text; }),
      calories: Math.round(acc[0] / batch), protein: Math.round(acc[1] / batch),
      carbs: Math.round(acc[2] / batch), fats: Math.round(acc[3] / batch),
      fibre: Math.round(acc[4] / batch)
    };
  }

  // Portions the tool should never produce: below this you cannot weigh it,
  // above it the recipe stops behaving the same way in the pan.
  var MIN_PORTION = 0.5, MAX_PORTION = 3.0;

  function clampPortion(factor) {
    return Math.min(MAX_PORTION, Math.max(MIN_PORTION, factor));
  }

  function roundPortion(factor) {
    return Math.round(clampPortion(factor) * 20) / 20;   // nearest 0.05
  }

  // Amounts get rounded so they can be weighed: 1.25 apples becomes 1 1/2.
  // The macros shown must describe the food actually listed, so when a recipe
  // carries per-ingredient nutrition we re-add it from the rounded amounts
  // instead of multiplying the recipe totals by the requested factor.
  // NOTE: no clamping here. Bulk-prep asks for 7x a portion, which is a
  // legitimate factor; the 0.5x-3.0x bounds apply to a single plated portion
  // and are the planner's job to enforce via clampPortion/roundPortion.
  function scaleRecipe(recipe, factor) {
    var f = factor;
    var out = Object.assign({}, recipe);
    out.portion = f;
    var lines = recipe.ingredients.map(function (l) { return scaleDetailed(l, f); });
    out.ingredients = lines.map(function (d) { return d.text; });

    var per = recipe.ingredientMacros;
    if (per && per.length === lines.length) {
      var t = [0, 0, 0, 0, 0];
      for (var i = 0; i < lines.length; i++) {
        for (var k = 0; k < 5; k++) t[k] += (per[i][k] || 0) * lines[i].ratio;
      }
      out.calories = Math.round(t[0]); out.protein = Math.round(t[1]);
      out.carbs = Math.round(t[2]); out.fats = Math.round(t[3]); out.fibre = Math.round(t[4]);
      out.exact = true;
    } else {
      out.calories = Math.round(recipe.calories * f); out.protein = Math.round(recipe.protein * f);
      out.carbs = Math.round(recipe.carbs * f); out.fats = Math.round(recipe.fats * f);
      out.fibre = Math.round(recipe.fibre * f); out.exact = false;
    }
    return out;
  }

  return {
    scaleIngredient: scaleIngredient,
    scaleDetailed: scaleDetailed,
    fitRecipe: fitRecipe,
    applyFactors: applyFactors,
    roleOf: roleOf,
    scaleRecipe: scaleRecipe,
    clampPortion: clampPortion,
    roundPortion: roundPortion,
    MIN_PORTION: MIN_PORTION,
    MAX_PORTION: MAX_PORTION
  };
});
