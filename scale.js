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
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.THScale = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var UNIT = '(?:kg|g|ml|l|tbsp|tsp|cups?)';
  var NUM = '(?:\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:\\.\\d+)?)';
  var BLOCK = new RegExp('(' + NUM + ')\\s*(' + UNIT + ')?\\b', 'gi');
  var NOSCALE = /^\s*(?:%|\+|cm\b|mm\b|min\b|mins\b|minute|degrees|C\b|F\b)/i;
  var ITEMS = '(?:egg|tortilla|fillet|bun|wrap|muffin|crumpet|slice|bagel|pita|' +
              'rice cake|crispbread|banana|apple|sausage|waffle|pancake)';
  var DISCRETE = new RegExp('^[^,()]{0,28}?\\b' + ITEMS + 's?\\b', 'i');

  var SINGULAR = {
    'whole eggs': 'whole egg', 'egg whites': 'egg white', 'eggs': 'egg',
    'tortillas': 'tortilla', 'fillets': 'fillet', 'buns': 'bun', 'wraps': 'wrap',
    'muffins': 'muffin', 'crumpets': 'crumpet', 'slices': 'slice', 'bagels': 'bagel',
    'rice cakes': 'rice cake', 'crispbreads': 'crispbread', 'bananas': 'banana',
    'apples': 'apple', 'sausages': 'sausage', 'waffles': 'waffle',
    'pancakes': 'pancake', 'crackers': 'cracker', 'potatoes': 'potato'
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

  function singularise(text) {
    var head = text.split(/[,(]/)[0];
    if (!/^\s*1\s+\D/.test(head)) return text;
    for (var plur in SINGULAR) {
      var re = new RegExp('\\b' + plur + '\\b', 'i');
      var m = head.match(re);
      if (m) {
        var at = text.toLowerCase().indexOf(m[0].toLowerCase());
        return text.slice(0, at) + SINGULAR[plur] + text.slice(at + m[0].length);
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

  function scaleDetailed(line, factor) {
    if (!factor || Math.abs(factor - 1) < 1e-9) return { text: line, ratio: 1 };
    var out = '', pos = 0, m, changed = false, ratios = [];
    var frozen = perUnitSpans(line);
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
    return { text: singularise(out), ratio: ratio };
  }

  function scaleIngredient(line, factor) {
    return scaleDetailed(line, factor).text;
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
    scaleRecipe: scaleRecipe,
    clampPortion: clampPortion,
    roundPortion: roundPortion,
    MIN_PORTION: MIN_PORTION,
    MAX_PORTION: MAX_PORTION
  };
});
