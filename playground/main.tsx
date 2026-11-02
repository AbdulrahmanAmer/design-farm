import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { applyRecipe, facetAxes, facetOptions, recipes, type Recipe } from "../ui/index";
import { Mixer, recipeName } from "./Mixer";
import { Board } from "./pages/Board";
import { Dashboard } from "./pages/Dashboard";
import { Gallery } from "./pages/Gallery";
import { themeRecipe, type Theme } from "./pages/data";

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

const routes = [
  { hash: "", label: "Dashboard" },
  { hash: "#board", label: "Board" },
  { hash: "#components", label: "Components" },
];

function DemoNav({ route }: { route: string }) {
  return (
    <nav className="demo-nav" aria-label="Demo pages">
      {routes.map((r) => (
        <a key={r.label} href={r.hash || "#"} aria-current={route === r.hash ? "page" : undefined}>
          {r.label}
        </a>
      ))}
    </nav>
  );
}

/** ?recipe=<name> picks a preset; ?palette=…&depth=… override single facets (used by tools/shoot.mjs). */
function initialRecipe(): Recipe {
  const params = new URLSearchParams(window.location.search);
  const base = recipes[params.get("recipe") ?? ""] ?? recipes[window.location.hash === "#board" ? "soft-cobalt" : "planify-light"];
  const next = { ...base };
  for (const axis of facetAxes) {
    const v = params.get(axis);
    if (v && facetOptions[axis].includes(v)) next[axis] = v;
  }
  return next;
}

function App() {
  const route = useHashRoute();
  const [recipe, setRecipe] = useState<Recipe>(initialRecipe);

  useEffect(() => applyRecipe(recipe), [recipe]);

  const name = recipeName(recipe);
  const theme = ((Object.keys(themeRecipe) as Array<keyof typeof themeRecipe>).find((t) => themeRecipe[t] === name) ?? "custom") as Theme;
  const onThemeChange = (t: Theme) => {
    if (t !== "custom") setRecipe(recipes[themeRecipe[t]]);
  };

  const page =
    route === "#components" ? (
      <Gallery theme={theme} onThemeChange={onThemeChange} />
    ) : route === "#board" ? (
      <Board theme={theme} onThemeChange={onThemeChange} />
    ) : (
      <Dashboard theme={theme} onThemeChange={onThemeChange} />
    );

  return (
    <>
      {page}
      <DemoNav route={route === "#" ? "" : route} />
      <Mixer recipe={recipe} onChange={setRecipe} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
