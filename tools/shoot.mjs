#!/usr/bin/env node
/**
 * shoot.mjs — screenshot every page × recipe × viewport for review against refs.
 *
 *   npm run dev                       # in another terminal (port 5178)
 *   node tools/shoot.mjs              # all recipes, all pages, desktop + phone
 *   node tools/shoot.mjs --recipe soft-cobalt --page board --width 520
 *   node tools/shoot.mjs --remix 6    # also shoot 6 random facet combinations
 *
 * Writes shots/<recipe>/<page>-<width>.png (shots/ is gitignored).
 * Needs Playwright once:  npm i -D playwright && npx playwright install chromium
 */
import { mkdir } from "node:fs/promises";
import { readFile } from "node:fs/promises";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const base = flag("url", "http://localhost:5178");
const registry = JSON.parse(await readFile(new URL("../registry.json", import.meta.url), "utf8"));
const pages = { dashboard: "", board: "#board", components: "#components" };
const widths = flag("width", null) ? [Number(flag("width"))] : [1440, 390];

let recipes = flag("recipe", null)
  ? { [flag("recipe")]: registry.recipes[flag("recipe")] }
  : { ...registry.recipes };
const remix = Number(flag("remix", 0));
for (let i = 0; i < remix; i++) {
  const r = Object.fromEntries(
    Object.entries(registry.facets).map(([axis, opts]) => [axis, opts[Math.floor(Math.random() * opts.length)].id]),
  );
  recipes[`remix-${Object.values(r).join("-")}`] = r;
}
const pageNames = flag("page", null) ? [flag("page")] : Object.keys(pages);

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright is not installed. Run:\n  npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

const browser = await chromium.launch();
let count = 0;
for (const [name, recipe] of Object.entries(recipes)) {
  const query = new URLSearchParams(recipe).toString();
  await mkdir(new URL(`../shots/${name}/`, import.meta.url), { recursive: true });
  for (const page of pageNames) {
    for (const width of widths) {
      const tab = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      await tab.goto(`${base}/?${query}${pages[page]}`, { waitUntil: "networkidle" });
      await tab.evaluate(() => document.fonts.ready);
      const file = new URL(`../shots/${name}/${page}-${width}.png`, import.meta.url);
      await tab.screenshot({ path: decodeURIComponent(file.pathname.replace(/^\/([A-Za-z]:)/, "$1")), fullPage: true });
      await tab.close();
      count++;
    }
  }
}
await browser.close();
console.log(`${count} screenshots in shots/`);
