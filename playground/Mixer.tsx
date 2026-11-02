import { useState } from "react";
import { Button, IconButton, SegmentedControl, facetAxes, facetOptions, recipes, type Recipe } from "../ui/index";
import "./Mixer.css";

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

export function randomRecipe(): Recipe {
  return Object.fromEntries(facetAxes.map((axis) => [axis, pick(facetOptions[axis])])) as Recipe;
}

export function recipeName(recipe: Recipe): string | undefined {
  return Object.entries(recipes).find(([, r]) => facetAxes.every((a) => r[a] === recipe[a]))?.[0];
}

/** Floating remix panel: one segmented control per facet axis, presets, shuffle, copy. */
export function Mixer({ recipe, onChange }: { recipe: Recipe; onChange: (r: Recipe) => void }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const name = recipeName(recipe) ?? "custom remix";

  async function copy() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(recipe, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard can be blocked; the JSON is visible in the panel anyway */
    }
  }

  if (!open) {
    return (
      <button type="button" className="mixer-fab" onClick={() => setOpen(true)} aria-expanded={false}>
        Mix · <span>{name}</span>
      </button>
    );
  }

  return (
    <aside className="mixer" aria-label="Recipe mixer">
      <header className="mixer__head">
        <h2>Mixer</h2>
        <IconButton icon="chevronRight" label="Close mixer" size="sm" onClick={() => setOpen(false)} />
      </header>

      <div className="mixer__presets" role="group" aria-label="Presets">
        {Object.keys(recipes).map((id) => (
          <button key={id} type="button" className={id === recipeName(recipe) ? "is-active" : undefined} onClick={() => onChange(recipes[id])}>
            {id}
          </button>
        ))}
      </div>

      {facetAxes.map((axis) => (
        <div key={axis} className="mixer__row">
          <span className="mixer__axis">{axis}</span>
          <SegmentedControl
            label={axis}
            size="sm"
            value={recipe[axis]}
            onChange={(value) => onChange({ ...recipe, [axis]: value })}
            options={facetOptions[axis].map((id) => ({ value: id, label: id }))}
          />
        </div>
      ))}

      <pre className="mixer__json">{JSON.stringify(recipe)}</pre>
      <div className="mixer__actions">
        <Button variant="soft" size="sm" onClick={() => onChange(randomRecipe())}>
          Shuffle
        </Button>
        <Button size="sm" onClick={copy}>
          {copied ? "Copied" : "Copy recipe"}
        </Button>
      </div>
    </aside>
  );
}
