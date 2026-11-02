# 002 · Soft-UI phone widget board

Neumorphic home-screen widgets: everything is the background grey, and depth comes only from paired
highlight and shade. Cobalt glyphs, signal-yellow selection.

## Measured (`tools/palette.py`) vs shipped

| role | measured | shipped (`palette/cobalt-signal.css`) |
|---|---|---|
| app background | `#cecece` | `#e5e6eb` |
| accent fill | `#001084` | `#0f2a9a` |
| highlight fill | `#e4b008` | `#f2c11d` |
| ink | `#000000` | `#16171c` |

The shipped values were eyeballed before `palette.py` existed. Each is a shade lighter and softer than the
image. The owner approved the shipped look, so it stays. To match the reference exactly, add a
`cobalt-signal-true` palette with the measured column instead of editing this one.

## Facets contributed

- palette `cobalt-signal`
- depth `neumorphic`: surfaces take the app colour; raised `-6 -6 12 light, 6 6 12 shade`, inset is the same
  pair inside; shade = 70% of the palette's `--ds-shade`
- shape `soft`: md 14 · lg 22 · xl 32 · 2xl 40
- type `manrope`

Recipe: `soft-cobalt`.

## Components contributed

DigitalClock, AnalogClock, DayChips, WeatherCard, TimeChip, CountdownCard, AppTile/AppGrid, KnobSwitch (with
Smiley), IntakeStepper, Waveform, TransportControls, MusicPlayer, VerticalMeter/MeterGroup. New tone
`highlight` on ProgressBar/Ring, and `valuePosition` on ProgressBar.

## Reused rather than re-built

The digital clock's battery bar is `ProgressBar`. The weather plate and cards are `Card`. The countdown chips
reuse accent and depth roles. The whole existing dashboard reskins under this recipe with no component changes.

## Deviations

- The decorative flower inside the analog clock was omitted.
- Lucide icons stand in for the custom glyphs. `filled` is used only on silhouette icons (camera, flashlight,
  fan); clock, globe and frame stay outlined, because filling them erases their inner detail.
