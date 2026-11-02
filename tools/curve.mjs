#!/usr/bin/env node
/**
 * curve.mjs — solve SVG cubic-Bézier geometry instead of guessing offsets.
 *
 *   node tools/curve.mjs at-x "<path>" <x>      y where the path first reaches x
 *   node tools/curve.mjs at-y "<path>" <y>      x of the path at height y
 *   node tools/curve.mjs rail [--width 104] [--item 44] [--clearance 6] [--path "<cap path>"]
 *
 * Paths: absolute M / C / L commands (what we write by hand for silhouettes).
 * `rail` answers: how far down a wave cap must content start so a centred item
 * of width --item clears the curve by --clearance px? It prints the inset as a
 * fraction of the cap height (the value used as --ds-rail-inset) and in px.
 * The cap is assumed to be drawn in a 100-unit-wide box, rendered at --width px.
 */

const DEFAULT_CAP = "M0 0 C0 50 26 62 56 74 C88 88 100 108 100 150";

/** Parse M/L/C into cubic segments [[p0,p1,p2,p3], ...]. Lines become degenerate cubics. */
export function parse(d) {
  const tokens = d.match(/[MLC]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? [];
  const segs = [];
  let i = 0;
  let cur = [0, 0];
  let cmd = "M";
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[MLC]/i.test(tokens[i])) cmd = tokens[i++].toUpperCase();
    if (cmd === "M") {
      cur = [num(), num()];
      cmd = "L"; // implicit lineto after moveto
    } else if (cmd === "L") {
      const p = [num(), num()];
      segs.push([cur, cur, p, p]);
      cur = p;
    } else if (cmd === "C") {
      const p1 = [num(), num()];
      const p2 = [num(), num()];
      const p3 = [num(), num()];
      segs.push([cur, p1, p2, p3]);
      cur = p3;
    }
  }
  return segs;
}

const bez = (a, b, c, d, t) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};
export const point = ([p0, p1, p2, p3], t) => [bez(p0[0], p1[0], p2[0], p3[0], t), bez(p0[1], p1[1], p2[1], p3[1], t)];

/** Find t on a segment where coordinate `axis` (0=x, 1=y) equals `value`, by sampling + bisection. */
function solve(seg, axis, value) {
  const N = 200;
  let prevT = 0;
  let prev = point(seg, 0)[axis] - value;
  for (let k = 1; k <= N; k++) {
    const t = k / N;
    const cur = point(seg, t)[axis] - value;
    if (prev === 0) return prevT;
    if (Math.sign(cur) !== Math.sign(prev)) {
      let lo = prevT;
      let hi = t;
      for (let j = 0; j < 50; j++) {
        const mid = (lo + hi) / 2;
        const m = point(seg, mid)[axis] - value;
        if (Math.sign(m) === Math.sign(prev)) lo = mid;
        else hi = mid;
      }
      return (lo + hi) / 2;
    }
    prevT = t;
    prev = cur;
  }
  return null;
}

/** First point along the path where coordinate `axis` reaches `value`. */
export function firstAt(d, axis, value) {
  for (const seg of parse(d)) {
    const t = solve(seg, axis, value);
    if (t !== null) return point(seg, t);
  }
  return null;
}

export function railInset({ width = 104, item = 44, clearance = 6, path = DEFAULT_CAP, box = [100, 150] } = {}) {
  const scale = width / box[0];
  const needX = ((width + item) / 2 + clearance) / scale; // in path units
  const hit = firstAt(path, 0, needX);
  if (!hit) throw new Error(`curve never reaches x=${needX.toFixed(1)} units; the item is wider than the rail`);
  const fraction = hit[1] / box[1];
  return { needXUnits: needX, yUnits: hit[1], fraction, insetPx: fraction * box[1] * scale, capPx: box[1] * scale };
}

function flag(args, name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (isMain) {
  const [mode, ...rest] = process.argv.slice(2);
  const fmt = (n) => Number(n.toFixed(2));
  if (mode === "at-x" || mode === "at-y") {
    const [d, v] = rest;
    const hit = firstAt(d, mode === "at-x" ? 0 : 1, Number(v));
    console.log(hit ? { x: fmt(hit[0]), y: fmt(hit[1]) } : "path never reaches that value");
  } else if (mode === "rail") {
    const r = railInset({
      width: Number(flag(rest, "width", 104)),
      item: Number(flag(rest, "item", 44)),
      clearance: Number(flag(rest, "clearance", 6)),
      path: flag(rest, "path", DEFAULT_CAP),
    });
    console.log(
      `item edge + clearance at x=${fmt(r.needXUnits)} units → curve reaches it at y=${fmt(r.yUnits)}/150\n` +
        `inset = ${fmt(r.fraction * 100)}% of cap = ${fmt(r.insetPx)}px (cap ${fmt(r.capPx)}px)\n` +
        `css: --ds-rail-inset: calc(var(--ds-rail-cap) * ${Math.ceil(r.fraction * 100) / 100});`,
    );
  } else {
    console.log("usage: curve.mjs at-x <path> <x> | at-y <path> <y> | rail [--width] [--item] [--clearance] [--path]");
    process.exitCode = 1;
  }
}
