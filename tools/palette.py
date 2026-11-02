"""
palette.py — measure a reference image's palette instead of eyeballing it.

Quantizes the image, ranks colours by pixel share, and suggests which semantic
role each could fill (canvas, surface, ink, accent, highlight…). Output is a
markdown table plus a ready-to-paste CSS block for a new palette facet.

Usage:
  python -I tools/palette.py refs/002-soft-widgets/reference.png
  python -I tools/palette.py ref.png --colors 14 --crop 40,60,700,300   # x,y,w,h region
  python -I tools/palette.py ref.png --json > palette.json

Requires Pillow (pip install pillow).
"""

from __future__ import annotations

import argparse
import colorsys
import json
import sys
from collections import Counter

from PIL import Image


def hex_of(rgb: tuple[int, int, int]) -> str:
    return "#{:02x}{:02x}{:02x}".format(*rgb)


def luminance(rgb: tuple[int, int, int]) -> float:
    """WCAG relative luminance, 0 (black) to 1 (white)."""

    def chan(c: int) -> float:
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (chan(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def _quantize(pixels: list[tuple[int, int, int]], n: int, total: int) -> list[dict]:
    """Median-cut a pixel list into up to n colours, shares relative to the whole image."""
    if not pixels or n <= 0:
        return []
    side = max(1, int(len(pixels) ** 0.5))
    img = Image.new("RGB", (side, (len(pixels) + side - 1) // side))
    img.putdata(pixels + [pixels[-1]] * (img.width * img.height - len(pixels)))
    quant = img.quantize(colors=min(n, len(set(pixels))), method=Image.Quantize.MEDIANCUT)
    pal = quant.getpalette() or []
    out = []
    for count, idx in quant.getcolors() or []:
        rgb = tuple(pal[idx * 3 : idx * 3 + 3])
        h, _, s = colorsys.rgb_to_hls(*(c / 255 for c in rgb))
        out.append(
            {
                "hex": hex_of(rgb),
                "rgb": rgb,
                "share": round(count / total, 4),
                "hue": round(h * 360),
                "sat": round(s, 2),
                "lum": round(luminance(rgb), 3),
            }
        )
    return out


def extract(path: str, n: int, crop: tuple[int, int, int, int] | None) -> list[dict]:
    """Neutral and chromatic pixels are quantized separately so small accents survive."""
    img = Image.open(path).convert("RGB")
    if crop:
        x, y, w, h = crop
        img = img.crop((x, y, x + w, y + h))
    img.thumbnail((360, 360))
    getter = getattr(img, "get_flattened_data", img.getdata)
    pixels = list(getter())
    neutral, chromatic = [], []
    for p in pixels:
        _, l, s = colorsys.rgb_to_hls(*(c / 255 for c in p))
        # Saturation is unstable near black/white; treat those as neutral.
        (chromatic if s > 0.28 and 0.08 < l < 0.92 else neutral).append(p)
    total = len(pixels)
    n_chroma = max(2, n // 2) if chromatic else 0
    colors = _quantize(neutral, n - n_chroma, total) + _quantize(chromatic, n_chroma, total)
    # Drop specks: anti-aliasing produces many sub-0.2% colours.
    return sorted((c for c in colors if c["share"] >= 0.002), key=lambda c: -c["share"])


def fills(path: str, crop: tuple[int, int, int, int] | None) -> list[dict]:
    """
    Flat fills per hue family. UI accents are solid fills, so the most frequent
    exact colour in a hue bucket is the designer's value; averages are blurred
    by anti-aliasing. Returns one entry per 30° hue bucket, by pixel share.
    """
    img = Image.open(path).convert("RGB")
    if crop:
        x, y, w, h = crop
        img = img.crop((x, y, x + w, y + h))
    getter = getattr(img, "get_flattened_data", img.getdata)
    buckets: dict[int, Counter] = {}
    total = img.width * img.height
    for p in getter():
        hh, l, s = colorsys.rgb_to_hls(*(c / 255 for c in p))
        if s < 0.45 or not 0.08 < l < 0.9:
            continue
        key = int(hh * 12) % 12
        snapped = tuple(min(255, round(c / 4) * 4) for c in p)
        buckets.setdefault(key, Counter())[snapped] += 1
    out = []
    for key, counter in buckets.items():
        rgb, _ = counter.most_common(1)[0]
        h, _, s = colorsys.rgb_to_hls(*(c / 255 for c in rgb))
        out.append({"hex": hex_of(rgb), "rgb": rgb, "share": round(sum(counter.values()) / total, 4), "hue": round(h * 360), "sat": round(s, 2), "lum": round(luminance(rgb), 3)})
    return sorted((f for f in out if f["share"] >= 0.001), key=lambda f: -f["share"])


def find_ink(path: str, crop: tuple[int, int, int, int] | None) -> str | None:
    """Most frequent exact dark, low-saturation pixel: the text colour. Thin text is lost to averaging."""
    img = Image.open(path).convert("RGB")
    if crop:
        x, y, w, h = crop
        img = img.crop((x, y, x + w, y + h))
    getter = getattr(img, "get_flattened_data", img.getdata)
    dark: Counter = Counter()
    for p in getter():
        _, l, s = colorsys.rgb_to_hls(*(c / 255 for c in p))
        if l < 0.22 and s < 0.45:
            dark[tuple(min(255, round(c / 4) * 4) for c in p)] += 1
    return hex_of(dark.most_common(1)[0][0]) if dark else None


def suggest_roles(colors: list[dict], accents: list[dict], ink_hex: str | None = None) -> dict[str, str]:
    """Heuristic first pass. Always sanity-check against the image."""
    roles: dict[str, str] = {}
    by_share = sorted(colors, key=lambda c: -c["share"])
    neutrals = [c for c in by_share if c["sat"] < 0.18]

    if by_share:
        roles["bg-app"] = by_share[0]["hex"]
    light_neutrals = sorted([c for c in neutrals if c["lum"] > 0.5], key=lambda c: -c["lum"])
    if light_neutrals:
        roles["bg-surface"] = light_neutrals[0]["hex"]
    dark = sorted([c for c in colors if c["sat"] < 0.3] or colors, key=lambda c: c["lum"])
    if ink_hex:
        roles["text-primary"] = ink_hex
    elif dark:
        roles["text-primary"] = dark[0]["hex"]
    if accents:
        roles["bg-accent"] = accents[0]["hex"]
        acc_hue = accents[0]["hue"]
        far = [a for a in accents[1:] if min(abs(a["hue"] - acc_hue), 360 - abs(a["hue"] - acc_hue)) > 40]
        if far:
            roles["bg-highlight"] = far[0]["hex"]
    mids = [c for c in neutrals if 0.15 < c["lum"] < 0.5]
    if mids:
        roles["text-secondary"] = mids[0]["hex"]
    return roles


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("image")
    ap.add_argument("--colors", type=int, default=12)
    ap.add_argument("--crop", help="x,y,w,h region in source pixels")
    ap.add_argument("--json", action="store_true", help="emit JSON instead of markdown")
    ap.add_argument("--name", default="new-palette", help="facet id for the CSS stub")
    args = ap.parse_args()
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")  # Windows consoles default to cp1252

    crop = tuple(int(v) for v in args.crop.split(",")) if args.crop else None
    colors = extract(args.image, args.colors, crop)  # type: ignore[arg-type]
    accents = fills(args.image, crop)  # type: ignore[arg-type]
    roles = suggest_roles(colors, accents, find_ink(args.image, crop))  # type: ignore[arg-type]

    if args.json:
        json.dump({"colors": colors, "fills": accents, "roles": roles}, sys.stdout, indent=2)
        return

    print(f"## Palette · {args.image}\n")
    print("| hex | share | hue | sat | lum |")
    print("|---|---|---|---|---|")
    for c in colors:
        print(f"| `{c['hex']}` | {c['share']:.1%} | {c['hue']} | {c['sat']} | {c['lum']} |")

    print("\n## Accent fills (most frequent exact colour per hue family)\n")
    print("| hex | share | hue | sat |")
    print("|---|---|---|---|")
    for f in accents:
        print(f"| `{f['hex']}` | {f['share']:.2%} | {f['hue']} | {f['sat']} |")

    print("\n## Suggested roles (verify by eye)\n")
    for role, hx in roles.items():
        print(f"- `--ds-{role}`: `{hx}`")
    if "text-primary" in roles and "bg-app" in roles:
        def to_rgb(hx: str) -> tuple[int, int, int]:
            return (int(hx[1:3], 16), int(hx[3:5], 16), int(hx[5:7], 16))

        ratio = contrast(to_rgb(roles["text-primary"]), to_rgb(roles["bg-app"]))
        print(f"\nInk on app background contrast: **{ratio:.1f}:1** (body text needs ≥ 4.5)")

    print(f"\n## CSS stub — tokens/facets/palette/{args.name}.css\n")
    print("```css")
    print(f'[data-palette="{args.name}"] {{')
    for role, hx in roles.items():
        print(f"  --ds-{role}: {hx};")
    print("  /* fill the remaining roles: copy the list from palette/violet.css */")
    print("}")
    print("```")


if __name__ == "__main__":
    main()
