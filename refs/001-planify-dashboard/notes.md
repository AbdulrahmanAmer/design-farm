# 001 · Planify task dashboard

Flat violet productivity dashboard: rounded frame on a lavender canvas, an accent side rail with a wave
silhouette, and a 6-column card grid.

## Measured (`tools/palette.py`)

| role | measured | shipped (`palette/violet.css`) |
|---|---|---|
| accent fill | `#7070f0` | `#7466ee` |
| app background | `#f9fbfb` | `#f7f7fb` |
| surface | `#ffffff` | `#ffffff` |
| ink | `#303040` | `#15153b` (deeper, for contrast on tinted greys) |

## Facets contributed

- palette `violet` (+ derived `violet-night`)
- depth `lifted`: soft drop shadows at 4 levels plus an accent glow
- shape `rounded`: md 10 · lg 16 · xl 24 · 2xl 32
- type `urbanist`

Recipes: `planify-light`, `planify-dark`.

## Components contributed

Primitives (Button, IconButton, Badge, StatusDot, Avatar/Group, SegmentedControl, inputs, Card, Progress),
navigation (AppShell, TopBar, NavTabs, SideRail) and widgets (Greeting, FeatureCard, CreateTile, NotificationItem,
SwipeActions, AssignmentCard, CalendarCard, TaskList, PromoCard, StatCard, MeetingCard), plus four line-art
illustrations.

## Geometry

The side rail is two wave caps in a 100×150 box (cap height = 1.5 × width) around a straight body that
stretches. The list inset comes from `node tools/curve.mjs rail`: it is 0.58 of the cap, which gives 6px of
clearance for a centred 44px item. The item gap was tightened from 16 to 12px at the owner's request.
`side-rail.jpg` is the verified render.

## Deviations

- The heading typo "planes" was corrected to "plans".
- Photo avatars were replaced by initials.
- Illustrations are original simplified line art, not traced.
