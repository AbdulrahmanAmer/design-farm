#!/usr/bin/env node
/**
 * setup.mjs — make a fresh clone ready, then report what works.
 *
 *   node tools/setup.mjs            fetch vendor/screenshot-to-code if empty, then check everything
 *   node tools/setup.mjs --check    check only; exit 1 if something required is missing
 *
 * `npm install` runs it (postinstall), so a plain `git clone` + `npm install` ends up complete.
 * Required: Node 18+, the upstream submodule, node_modules. Optional: Python 3 + Pillow (palette.py),
 * Playwright (shoot.mjs).
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");
const vendor = join(root, "vendor", "screenshot-to-code");
const isEmpty = (dir) => !existsSync(dir) || readdirSync(dir).length === 0;
const run = (cmd, args) => spawnSync(cmd, args, { cwd: root, encoding: "utf8" });

if (!checkOnly && isEmpty(vendor)) {
  if (existsSync(join(root, ".git"))) {
    console.log("design-farm: fetching vendor/screenshot-to-code (git submodule)…");
    try {
      execFileSync("git", ["submodule", "update", "--init", "--recursive"], { cwd: root, stdio: "inherit" });
    } catch {
      console.log("design-farm: submodule fetch failed; run `git submodule update --init` when online.");
    }
  } else {
    // Downloaded as a zip: no git metadata, so clone the upstream directly.
    try {
      execFileSync("git", ["clone", "--depth", "1", "https://github.com/abi/screenshot-to-code.git", vendor], { stdio: "inherit" });
    } catch {
      console.log("design-farm: could not fetch upstream; clone abi/screenshot-to-code into vendor/screenshot-to-code.");
    }
  }
}

// Same interpreter order as `npm run palette` (python), falling back for systems that only ship python3 / py.
const python = ["python", "python3", "py"].find((p) => run(p, ["--version"]).status === 0);
const checks = [
  ["Node 18+", Number(process.versions.node.split(".")[0]) >= 18, true, "install Node 18 or newer"],
  ["vendor/screenshot-to-code", existsSync(join(vendor, "backend", "prompts")), true, "git submodule update --init"],
  ["node_modules", existsSync(join(root, "node_modules", "vite")), true, "npm install"],
  ["skills (.claude/skills)", ["harvest", "screenshot-to-code", "unslop"].every((s) => existsSync(join(root, ".claude", "skills", s, "SKILL.md"))), true, "re-clone the repo"],
  [`Python 3 (palette.py${python ? `, using ${python}` : ""})`, Boolean(python), false, "install Python 3"],
  ["Pillow (palette.py)", Boolean(python) && run(python, ["-c", "import PIL"]).status === 0, false, "pip install -r requirements.txt"],
  ["Playwright (shoot.mjs)", existsSync(join(root, "node_modules", "playwright")), false, "npm i -D playwright && npx playwright install chromium"],
];

let missing = 0;
for (const [name, ok, required, fix] of checks) {
  if (!ok && required) missing++;
  console.log(`${ok ? "ok  " : required ? "MISS" : "opt "} ${name}${ok ? "" : `  →  ${fix}`}`);
}
if (missing) console.log(`design-farm: ${missing} required item(s) missing.`);
else console.log("design-farm: ready. `npm run dev` starts the playground on :5178.");
// Never fail `npm install` over an optional or offline step; only --check sets the exit code.
process.exit(checkOnly && missing ? 1 : 0);
