---
name: harvest
description: Grow design-farm from a reference image. Extracts the image's design language into facet tokens (palette, depth, shape, type, density), maps it onto existing roles, adds only the genuinely new components or variants, rebuilds the reference as a playground page, verifies it in a browser, and records provenance. Use when the owner hands over a screenshot, Dribbble shot or mockup to "add to the farm", "harvest", "extract components from", or "reskin with this style". Also use before writing any front-end from scratch, to reuse what the farm already holds.
---

# Harvest — turn a reference into reusable facets and components

design-farm grows one reference at a time. Each harvest adds **options to independent axes**, so every new
image multiplies the combinations instead of adding one more copy. Work in this order; do not skip the
reuse checks.

Load the `screenshot-to-code` skill (fidelity rules and the generate → screenshot → refine loop) and the
`unslop` skill (taste rules) alongside this one. Both sit next to this file in `.claude/skills/`.

## 0. Before writing any front-end from scratch

Read `registry.json` and `README.md` first. Compose from existing components and pick a recipe (or remix one
in the playground Mixer) before inventing anything. New UI that doesn't reuse the farm is a smell.

## 1. Register the reference

- Copy the image to `refs/NNN-short-name/reference.<ext>` (next free number).
- Add it to `registry.json → refs` with title and origin. References are other people's work: `.gitignore`
  keeps `refs/*/` images out of git. Never commit, publish or ship them in a build; commit only `notes.md`.

## 2. Measure, don't eyeball

```bash
python -I tools/palette.py refs/NNN-name/reference.png --name <palette-id>
python -I tools/palette.py refs/NNN-name/reference.png --crop x,y,w,h   # a single widget
```

The **accent fills** table gives exact designer values (the most frequent exact colour per hue family). The
quantized table gives surface and background shades. Ink comes from the darkest frequent pixels. Check contrast in the output.

## 3. Decompose into facets

For each axis, decide **reuse an existing option** or **add a new one**:

| Axis | Lives in | Question to ask |
|---|---|---|
| palette | `tokens/facets/palette/` | New hues/ink/background? Fill every role listed in `violet.css`, including `--ds-light` / `--ds-shade` (the light physics depth facets use) and selection/highlight. |
| depth | `tokens/facets/depth/` | How do surfaces separate: drop shadow (lifted), extrude/press (neumorphic), hairline (flat), or something new (glass, hard offset, inner glow)? A depth facet must define every `--ds-shadow-*` role and the `--ds-rail-*` roles, using only `--ds-light` / `--ds-shade` / role colours so it works on any palette. |
| shape | `tokens/facets/shape/` | Corner radii xs…2xl. Measure card and button radius relative to card width. |
| type | `tokens/facets/type/` | Font family (add it to `playground/index.html`). |
| density | `tokens/facets/density/density.css` | Only if spacing rhythm is clearly tighter or looser than ×0.8 / ×1 / ×1.2. |

Add the facet file, `@import` it in `tokens/index.css` (palettes, then depth, shape, type, density; order
matters), add it to `registry.json → facets`, and add a named recipe for the reference's own look.

**Never** reference a raw colour, a facet name or `data-*` attribute inside component CSS. If a component needs
something the roles don't express, add a role token (with a value in every depth or palette facet) instead.

## 4. Inventory components: variant before new

List every component in the image. For each, check `registry.json → components`:

1. **Same thing exists** → reuse it. Fix fidelity gaps by improving the component, not by forking it.
2. **Same job, different form** (another toggle, another stat card) → add a **variant prop** to the existing one.
3. **Genuinely new job** → new component in `ui/components/<layer>/`, `ds-` BEM classes, reads roles only,
   accessible (labels, roles, keyboard), works in every recipe.

Register each new component or variant in `registry.json` with its `ref`.

## 5. Rebuild the reference as a page

Add `playground/pages/<Name>.tsx` composing **only** library components, plus a route in `playground/main.tsx`.
Fill all content; no lorem ipsum. Add new components to the Gallery.

## 6. Verify

- `npx tsc --noEmit` and `npm run build`.
- In a browser, compare the page with the reference at its recipe. Use `tools/snippets/frame-viewport.js`
  when the preview pane is narrower than the layout. Use `tools/snippets/measure.js` to check spacing and
  geometry numbers. Use `node tools/curve.mjs` for any curve-derived offsets.
- Open the Mixer and try the new facets against **other** palettes and depths; fix anything that only works in
  its own recipe.
- `node tools/shoot.mjs` (once Playwright is installed) for a full matrix.

## 7. Record

- `refs/NNN-name/notes.md`: measured values, what was reused, what was added, deliberate deviations.
- README tables if a new axis option or component layer appeared.
- One commit per harvest: `harvest(NNN-name): <what was added>`.
