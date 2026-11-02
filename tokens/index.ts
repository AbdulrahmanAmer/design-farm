/**
 * JS side of the token system: facet/recipe types, `applyRecipe`, and theme-aware
 * values for places that need tokens in code (charts, canvas, inline SVG).
 */
import registry from "../registry.json";

export type FacetAxis = "palette" | "depth" | "shape" | "type" | "density";
export type Recipe = Record<FacetAxis, string>;

export const facetAxes: FacetAxis[] = ["palette", "depth", "shape", "type", "density"];

/** Every option available per axis, straight from registry.json. */
export const facetOptions: Record<FacetAxis, string[]> = Object.fromEntries(
  facetAxes.map((axis) => [axis, registry.facets[axis].map((f) => f.id)]),
) as Record<FacetAxis, string[]>;

/** Named recipes (curated combinations). */
export const recipes: Record<string, Recipe> = registry.recipes;

/** Sets one data-attribute per facet on `el` (default <html>); every component re-themes. */
export function applyRecipe(recipe: Recipe, el: HTMLElement = document.documentElement) {
  for (const axis of facetAxes) el.setAttribute(`data-${axis}`, recipe[axis]);
}

const v = (name: string) => `var(--ds-${name})`;

export const color = {
  bg: {
    canvas: v("bg-canvas"),
    app: v("bg-app"),
    surface: v("bg-surface"),
    sunken: v("bg-sunken"),
    inverse: v("bg-inverse"),
    accent: v("bg-accent"),
    accentSoft: v("bg-accent-soft"),
    selected: v("bg-selected"),
    highlight: v("bg-highlight"),
    success: v("bg-success"),
    successSoft: v("bg-success-soft"),
    dangerSoft: v("bg-danger-soft"),
  },
  text: {
    primary: v("text-primary"),
    secondary: v("text-secondary"),
    muted: v("text-muted"),
    inverse: v("text-inverse"),
    accent: v("text-accent"),
    success: v("text-success"),
    danger: v("text-danger"),
  },
  border: { subtle: v("border-subtle"), default: v("border-default"), dashed: v("border-dashed") },
  chartTrack: v("chart-track"),
} as const;

/** Base 4px-grid values at density 1. At runtime spacing is multiplied by --ds-density. */
export const space = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32, 10: 40, 12: 48, 16: 64 } as const;
/** Radius role names; values come from the active shape facet. */
export const radius = { xs: v("radius-xs"), sm: v("radius-sm"), md: v("radius-md"), lg: v("radius-lg"), xl: v("radius-xl"), "2xl": v("radius-2xl"), pill: v("radius-pill") } as const;
export const fontSize = { "2xs": 11, xs: 12, sm: 13, md: 14, lg: 16, xl: 20, "2xl": 26, display: 40 } as const;
export const elevation = { 0: v("shadow-0"), 1: v("shadow-1"), 2: v("shadow-2"), 3: v("shadow-3"), accent: v("shadow-accent") } as const;

/** Semantic tones shared by Badge, ProgressBar, ProgressRing, StatCard, etc. */
export type Tone = "accent" | "highlight" | "success" | "danger" | "neutral";
export const toneColor: Record<Tone, string> = {
  accent: v("bg-accent"),
  highlight: v("bg-highlight"),
  success: v("bg-success"),
  danger: v("text-danger"),
  neutral: v("text-muted"),
};
