---
name: screenshot-to-code
description: Reference-driven UI generation method from the open-source screenshot-to-code project (abi/screenshot-to-code). Use when turning visual references into pixel-faithful, production-quality front-end code (React + Tailwind or HTML/Tailwind), including the project's system prompts, design-system extraction and iterative refinement loop.
---

# screenshot-to-code (reference method)

The upstream project is vendored in this repo as a git submodule at `vendor/screenshot-to-code` (MIT, Abi Raja;
`npm install` fetches it; otherwise run `npm run setup` or `git submodule update --init`). It is an app, not an
agent skill; this skill distils its method so an agent can apply it directly without running the app. In
design-farm, use it through the `harvest` skill.

## Read these files first
- `backend/prompts/create/image.py` and `backend/prompts/create/text.py` — the system prompts that turn a screenshot or
  description into code. Note how they demand exact fidelity: match layout, spacing, colours, typography, every element,
  repeated elements fully written out, placeholder images with descriptive alt text, no "TODO" or lorem ipsum.
- `backend/prompts/design_system.py` — how a design system (tokens, components) is extracted from references and then
  reused consistently across screens.
- `backend/prompts/pipeline.py` and `backend/prompts/message_builder.py` — the generate → review-screenshot → refine loop.
- `design-docs/` — the project's own component and page conventions.
- `frontend/src/` — a real React + Tailwind codebase to borrow component structure, file layout and naming from.

## Method to apply
1. **Extract a design system from the references before writing screens**: palette tokens, type scale, radii,
   spacing, shadows, component inventory (nav rail, cards, chips, buttons, toggles, tabs, media panels, charts).
   Write it down as code (CSS variables / Tailwind theme) and reuse it everywhere.
2. **Generate each screen to the reference's fidelity**: full content, no placeholders, every list fully populated,
   consistent component reuse, real hierarchy. Images are generated placeholders with meaningful alt text.
3. **Review against the reference** (screenshot the result), list concrete deltas, fix, repeat until the deltas are gone.
4. **Keep it production-grade**: accessible controls, responsive breakpoints, dark/light themes from the same tokens,
   no inline event handlers, no external runtime dependencies that the host forbids.

Load the `unslop` skill alongside this one for the taste rules (what makes generated UI look generic, and how to avoid it).
