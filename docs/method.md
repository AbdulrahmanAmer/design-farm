# Method

How design-farm turns a picture into reusable code, and the environment lessons behind the tools.

## The model

```
reference image ──► measure (tools/palette.py) ──► facets ──► recipe
                                                 │
                                                 └──► components (role-only) ──► page ──► verify ──► registry
```

- **Roles, not values.** Components ask for `--ds-bg-surface`, `--ds-shadow-control`, `--ds-bg-selected`, and so
  on. They never know which palette or depth model is active.
- **Facets are independent axes.** A palette supplies colours plus the light physics (`--ds-light`,
  `--ds-shade`). A depth facet turns that physics into shadows. Shape supplies radii, type supplies fonts, and
  density multiplies spacing.
- **A recipe is one choice per axis**, applied as `data-palette`, `data-depth`, `data-shape`, `data-type` and
  `data-density` attributes on `<html>` (see `applyRecipe`). Because facets only override roles, any combination
  is valid. That is where looks no reference had come from.
- **Depth may override surfaces.** Neumorphism requires surface = background, so `depth/neumorphic.css` sets
  `--ds-bg-surface: var(--ds-bg-app)`. This is why `tokens/index.css` imports depth after palette.

## Fidelity loop (from screenshot-to-code)

1. Extract the design system first: measure it, then write the facets.
2. Build the page to full fidelity, with every element and real content.
3. Screenshot it, list concrete differences from the reference, fix them, and repeat.
4. Keep it production-grade: accessible, responsive, and working in every recipe.

## Tools

| Tool | Use |
|---|---|
| `python -I tools/palette.py <img>` | Quantized surfaces, **exact accent fills** (most frequent exact colour per hue family, which survives anti-aliasing), ink detection, contrast, and a CSS stub. Neutral and chromatic pixels are quantized separately, so a 2% accent isn't drowned by greys. |
| `node tools/curve.mjs rail \| at-x \| at-y` | Solves cubic-Bézier geometry: where a silhouette reaches an x or y, and the content inset that clears a curve by N px. |
| `node tools/shoot.mjs [--recipe] [--page] [--width] [--remix N]` | Screenshot matrix of pages × recipes × viewports into `shots/`. Needs `npm i -D playwright && npx playwright install chromium`. |
| `node tools/export-css.mjs [--fonts] [--dark <palette>] [--strip] [--out f]` | Flattens every facet into one CSS file for consumers that can't import the farm (static HTML, other stacks). `--dark` adds no-JS dark mode from `prefers-color-scheme` / `[data-theme="dark"]`. First consumer: Nightshift's `docs/design/system-diagram.theme.css`. |
| `tools/snippets/frame-viewport.js` | Renders the page in a 1440px iframe scaled to the pane, for narrow preview panes. |
| `tools/snippets/measure.js` | `measure(".selector")` prints boxes, pitch and gaps, to check spacing against the math. |
| Playground **Mixer** | Remix facets live, try presets, shuffle, and copy the recipe JSON. |

## Environment gotchas (learned the hard way)

- **Windows Store build of the desktop app virtualizes `%AppData%`.** A dev server launched *by the app* reads a
  stale copy under `AppData\Local\Packages\…\LocalCache`. Run `npm run dev` from your own shell, or keep the repo
  outside AppData (it lives on `D:\`).
- **Preview panes crop emulated viewports instead of scaling them.** Use `frame-viewport.js` to judge desktop
  layouts.
- **Windows console encoding is cp1252.** Python tools call `sys.stdout.reconfigure(encoding="utf-8")`.
- **Git Bash heredocs** break on some quote mixes inside long payloads. Write files with an editor or tool, not
  giant heredocs.
- **Lucide `fill`** fills every closed path. Only silhouette icons survive `filled`.

## Licences

- `vendor/screenshot-to-code`: MIT © Abi Raja.
- `skills/unslop`: CC BY 4.0, Damir Sokolovsky. Keep the credit in any adaptation.
- `refs/`: third-party images for internal study. Do not redistribute.
