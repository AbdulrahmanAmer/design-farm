# design-farm

A farm of design languages. References go in, and independent **facets** (palette, depth, shape, type, density)
plus **role-only components** come out. Any facet combines with any other, so the farm produces looks that no
single reference had.

This file is the agent instructions for every tool: OpenCode and Codex read `AGENTS.md`, and Claude Code reads
it through `CLAUDE.md`. The skills live in `.claude/skills/`, which both Claude Code and OpenCode load.

## First run

Run `npm run doctor`. If it reports `vendor/screenshot-to-code` missing, run `npm run setup` (or
`git submodule update --init`). The harvest method depends on that folder.

## Layout

- `tokens/`: `base.css` (scales; spacing × `--ds-density`), `facets/<axis>/*.css`, `index.css` (import order
  matters), `index.ts` (`applyRecipe`, facet options, recipes from `registry.json`).
- `ui/`: the component library (`components/primitives|navigation|widgets|illustrations`, `lib/`, `styles/base.css`).
  The entry point is `ui/index.ts`.
- `playground/`: Vite app (`npm run dev`, port 5178). Pages: dashboard `/`, `#board`, `#components`.
  The **Mixer** sits bottom-right. URL params `?recipe=<name>` or `?palette=…&depth=…&shape=…&type=…&density=…`.
- `refs/NNN-name/`: `notes.md` (committed) and the reference image (gitignored, local only). References are other
  people's work: never commit, publish or bundle the images.
- `registry.json`: source of truth for refs, facets, recipes, components and their provenance.
- `tools/`: `setup.mjs` (fetch the submodule, check the environment), `palette.py` (measure colours),
  `curve.mjs` (Bézier geometry), `shoot.mjs` (screenshot matrix), `export-css.mjs` (flatten tokens),
  `snippets/` (browser-console helpers).
- `.claude/skills/`: `harvest` (the process), `screenshot-to-code` (fidelity method), `unslop` (taste; CC BY 4.0,
  keep credit).
- `vendor/screenshot-to-code`: upstream app as a git submodule (MIT).
- `docs/method.md`: how the pieces fit together and the environment gotchas.

## Rules

- To add a reference, follow `.claude/skills/harvest/SKILL.md`.
- Component CSS reads only `--ds-*` roles. It never uses raw colours, facet names or `[data-*]` selectors.
- Variant before new component. Check `registry.json` first.
- Every facet must work with every other facet. Check new ones in the Mixer against other palettes and depths.
- Class names use `ds-` + BEM (`ds-card__title`, `ds-btn--primary`, state `is-active`). Icons go through the `Icon` registry.
- Accessibility is required: icon-only controls take `label`; switches, meters, timers and segmented controls use proper roles.
- Verify in a browser before committing: `npx tsc --noEmit`, `npm run build`, then a visual check.
- One commit per harvest: `harvest(NNN-name): …`. Do not push or publish without the owner's go-ahead.
