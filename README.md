# design-farm

A farm of design languages. You feed it reference images. It **measures** them, splits each one into
independent **facets** (palette, depth, shape, type, density), and keeps the components it finds as
**role-only React components** that work under any combination of facets. Each new reference adds options to
the axes, so the number of looks multiplies, including ones no reference ever had.

```bash
git submodule update --init   # vendor/screenshot-to-code
npm install
npm run dev                   # playground on :5178. Dashboard /, board #board, gallery #components, Mixer bottom-right
npm run build                 # type-check + build
```

```tsx
import { applyRecipe, recipes, Card, Button } from "./ui"; // ui/index.ts also pulls in tokens/index.css
applyRecipe(recipes["soft-cobalt"]);                         // or any { palette, depth, shape, type, density }
```

## How it grows

1. **Harvest** a reference with [`skills/harvest`](skills/harvest/SKILL.md). It measures colours with
   `tools/palette.py`, decomposes the reference into facets, reuses or extends components (variant before new),
   rebuilds the reference as a page, verifies it, and records provenance in `registry.json`.
2. **Remix** in the playground Mixer, or with URL params (`?palette=cobalt-signal&depth=lifted&shape=crisp`).
   Keep good finds as named recipes in `registry.json`.

[docs/method.md](docs/method.md) explains the model, the tools and the environment gotchas.
[CLAUDE.md](CLAUDE.md) lists the rules agents follow.

## Repo map

| Path | What |
|---|---|
| `tokens/` | `base.css` scales · `facets/{palette,depth,shape,type,density}` · `index.css` · `index.ts` (`applyRecipe`) |
| `ui/` | component library: primitives, navigation, widgets, illustrations |
| `playground/` | Vite app: pages rebuilt from refs, gallery, Mixer |
| `refs/NNN-name/` | reference image + `notes.md` (measured vs shipped, deviations). Internal study only |
| `registry.json` | refs, facets, recipes, components, provenance |
| `tools/` | `palette.py` (measure colours) · `curve.mjs` (Bézier geometry) · `shoot.mjs` (screenshot matrix) · `snippets/` |
| `skills/` | `harvest` · `screenshot-to-code` · `unslop` (CC BY 4.0) |
| `vendor/screenshot-to-code` | upstream app, git submodule (MIT) |

## Facets

| Axis | Options | Roles it sets |
|---|---|---|
| palette | `violet` (001) · `violet-night` (derived) · `cobalt-signal` (002) | every colour role, selection/highlight, `--ds-ink`, light physics `--ds-light` / `--ds-shade` |
| depth | `lifted` (001) · `neumorphic` (002) · `flat` (derived) | `--ds-shadow-0…3`, `-frame`, `-accent`, `-inset(-sm)`, `-control`, `-tile`, `-selected`, `--ds-track-size`, `--ds-rail-*` |
| shape | `rounded` (001) · `soft` (002) · `crisp` (derived) | `--ds-radius-xs…2xl` |
| type | `urbanist` (001) · `manrope` (002) · `system` (derived) | `--ds-font-sans`, `--ds-font-display` |
| density | `compact` ×0.8 · `comfortable` ×1 · `roomy` ×1.2 | `--ds-density`, which scales every `--ds-space-*` and control height |

3 × 3 × 3 × 3 × 3 = **243 looks** from two references. Named recipes: `planify-light`, `planify-dark`, `soft-cobalt`.

Base scales (all recipes): type 11 / 12 / 13 / 14 / 16 / 20 / 26 / 40 · spacing on a 4px grid × density ·
controls 28 / 36 / 40 × density.

## Component map

### Primitives: `ui/components/primitives/`

| Component | Key props | First seen as (ref 001) |
|---|---|---|
| `Icon` | `name`, `size`, `filled`, `label?` | every icon |
| `Button` | `variant: primary \| inverse \| soft \| ghost \| dashed`, `size`, `leadingIcon`, `trailing` | Accept invite · Add new board · Reschedule · Edit/Share/Clear · Export data + `xls` |
| `IconButton` | `icon`, `label` (required), `variant: ghost \| soft \| surface \| accent`, `dot` | bell, gear, `…`, calendar pager |
| `Badge` | `tone: accent \| success \| danger \| neutral`, `variant: solid \| soft`, `size: xs \| sm \| md` | High · Package design · Motion design · NEW · xls |
| `StatusDot` | `tone`, `ring` | green "live" dot, amber/green rail dots |
| `Avatar`, `AvatarGroup` | `name`, `src?` / `people`, `max`, `onAdd` | Rachel Lee, Today-tasks team + "+" |
| `SegmentedControl` | `options`, `value`, `onChange`, `variant: filled \| plain` | Light/Dark switch, list/grid/board view, Mixer axes |
| `SearchInput`, `TextField` | native input props | "Search or type command", quick-reply field |
| `MetaItem`, `DottedRule` | `icon` | "Sat, 10 May", "11 AM – 11:45 AM", calendar separators |
| `Card`, `CardHeader` | `elevation 0–3`, `padding`, `radius`, `tone: surface \| accent \| sunken`, `interactive` / `title`, `actions`, `adornment` | every panel |
| `ProgressBar`, `ProgressRing` | `value`, `tone` (incl. `highlight`), `label`, `valuePosition` | task progress, 90% / 65% rings, battery |

### Navigation and layout: `ui/components/navigation/`

| Component | Notes |
|---|---|
| `AppShell` | Rounded frame on the canvas: rail column plus header and main content |
| `TopBar` | Three slots (`start`, `center`, `end`) |
| `NavTabs` | Icon + label links; the current link gets an underline and `aria-current="page"` |
| `SideRail` | Wave-silhouette rail. Fixed-ratio caps and a stretching body; inset from `tools/curve.mjs rail`. Items take a `badge` and a `dot`. Restyled per depth facet via `--ds-rail-*` |

### Widgets: `ui/components/widgets/`

| Component | Reference block |
|---|---|
| `Greeting` + `WorkspaceTokens` | "Hi, James! What are your plans for today?" |
| `CreateTile` (`square` / `row`) | dashed + tile, "Add new assignment" |
| `FeatureCard` | Stay organized / Sync your notes / Collaborate and share |
| `NotificationItem` + `SwipeActions` | Upcoming event (raised, tray revealed) and Message cards |
| `AssignmentCard` | packaging-concept assignment |
| `CalendarCard` = `WeekStrip` + `TimeSlot` + `AgendaItem` | May 2021 agenda |
| `TaskList` / `TaskRow` | Today tasks table with a highlighted (raised) row |
| `PromoCard` | Go premium! |
| `StatCard` | Marketing 90% / Typography 65% |
| `MeetingCard` | Board meeting invite |
| `CalendarIllustration`, `NotesIllustration`, `CollaborateIllustration`, `GiftIllustration` | line-art spots; fills read `--ds-illus-paper` / `--ds-illus-accent` |

#### Ambient widgets (ref 002)

`useNow` drives the live ones; pass `value` / `now` to freeze them.

| Component | File | Reference block | Notes |
|---|---|---|---|
| `DigitalClock` | `Clocks.tsx` | 09:44 · 09/24 Thu · 40% | live; optional `meter` |
| `AnalogClock` | `Clocks.tsx` | dial with cobalt ring, yellow knob | 200-unit SVG: ring r96, ticks r74→80 (majors from 70); raised face at 13% inset and hub at 35% |
| `DayChips` | `Readouts.tsx` | 21 22 23 **24** 25 | raised round chips; selected = `bg-selected` |
| `WeatherCard` | `Readouts.tsx` | fine · 00 °C · sun | raised plate + DayChips |
| `TimeChip`, `CountdownCard` | `Readouts.tsx` | Birthday left 098d 02h 15m | counts down to `target`; `role="timer"` |
| `AppTile`, `AppGrid` | `Controls.tsx` | launcher tiles, fan, photo frame | raised square that presses in on `:active`; `filled` for silhouette glyphs |
| `KnobSwitch`, `Smiley` | `Controls.tsx` | "luck…" toggle | `role="switch"`; inset track, 84px raised knob |
| `IntakeStepper` | `Controls.tsx` | Water intake − cup 0/8 + | cup fills via clip path |
| `Waveform`, `sampleWaveform` | `Media.tsx` | blue/yellow waveform | played bars use the accent, the rest the highlight |
| `TransportControls`, `MusicPlayer` | `Media.tsx` | ◀ ● ▶ pill | knob is inset when paused, raised while playing |
| `VerticalMeter`, `MeterGroup` | `Meters.tsx` | Count down: Today / Week / Month / Year | inset 12×128 well; `role="meter"` |

### Layouts: `playground/pages/`

**Dashboard** (ref 001) uses a 6-column grid with named areas. It drops to 4 columns below 1280px and to
1 column below 860px.

```
greeting greeting create f1     f2   f3
notif    notif    assign assign cal  cal
tasks    tasks    tasks  promo  side side     (side = 2 stat cards + meeting)
```

**Board** (ref 002) uses a 4-column phone grid, max 520px wide:

```
clock    clock    weather  weather
apps     apps     analog   analog
birthday birthday luck     luck
music    music    meters   meters
fan      frame    water    water
```
