/*
 * measure.js — check rendered geometry against the numbers you derived.
 *
 * Paste into the console with a selector. Prints each match's box relative to
 * the first match's parent, plus the gap between consecutive matches, so you
 * can confirm spacing math (e.g. tools/curve.mjs rail) instead of eyeballing.
 *
 *   measure(".ds-rail__item")       // rail items: top offset, pitch, edges
 *   measure(".ds-card", ".demo-grid")
 */
window.measure = (selector, withinSelector) => {
  const scope = withinSelector ? document.querySelector(withinSelector) : document;
  const els = [...scope.querySelectorAll(selector)];
  if (!els.length) return `no match for ${selector}`;
  const origin = (withinSelector ? scope : els[0].parentElement.closest("*:not(li)") ?? document.body).getBoundingClientRect();
  const rows = els.map((el, i) => {
    const b = el.getBoundingClientRect();
    const prev = i ? els[i - 1].getBoundingClientRect() : null;
    return {
      i,
      top: +(b.top - origin.top).toFixed(1),
      left: +(b.left - origin.left).toFixed(1),
      w: +b.width.toFixed(1),
      h: +b.height.toFixed(1),
      right: +(b.right - origin.left).toFixed(1),
      pitch: prev ? +(b.top - prev.top).toFixed(1) : null,
      gap: prev ? +(b.top - prev.bottom).toFixed(1) : null,
    };
  });
  console.table(rows);
  return rows;
};
