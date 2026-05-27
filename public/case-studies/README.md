# Case Study Images

Drop images into the matching subfolder. The file must be named `cover.jpg` (or `cover.png` / `cover.webp`).  
Update the `image` path in `data/bento-config.json` to point to your file.

```
public/
└── case-studies/
    ├── invi/
    │   └── cover.jpg
    ├── crypto-dashboard/
    │   └── cover.jpg
    ├── onboarding-gamification/
    │   └── cover.jpg
    ├── design-system/
    │   └── cover.jpg
    └── fintech-mobile/
        └── cover.jpg
```

---

## Image Size Guide

The bento grid uses 5 tiles arranged in an asymmetric grid. Each tile position
has a different visible aspect ratio depending on the viewport.

### Tile Map (Desktop)

```
┌───────────┬─────────┐
│           │   [B]   │
│    [A]    ├─────────┤
│  (large)  │   [C]   │
├─────┬─────┴─────────┤
│ [D] │      [E]      │
└─────┴───────────────┘
```

| Tile | Grid position  | Visible ratio (desktop) | Recommended upload size |
|------|---------------|------------------------|------------------------|
| A    | 2 cols × 2 rows (top-left featured) | ~4:3  | **1600 × 1200 px** |
| B    | 1 col × 1 row  (top-right)          | ~1:1  | **800 × 800 px**   |
| C    | 1 col × 1 row  (mid-right)          | ~1:1  | **800 × 800 px**   |
| D    | 1 col × 1 row  (bottom-left)        | ~1:1  | **800 × 800 px**   |
| E    | 2 cols × 1 row (bottom-right wide)  | ~2:1  | **1600 × 800 px**  |

> All images use `object-fit: cover` so they are cropped to fill the tile.
> Uploading larger than these minimums is fine — the browser will scale down.
> Centre your subject in the image to avoid bad crops on smaller tiles.

### Tablet tile order

On tablet (640–1023 px) the grid becomes 2 columns:

```
┌─────────────┐
│     [A]     │  spans 2 cols — 16:9 crop
├──────┬──────┤
│  [B] │  [C] │  square crop each
├──────┼──────┤
│  [D] │  [E] │  square crop each
└──────┴──────┘
```

Tile A is the key hero image at this breakpoint — make sure the subject
is centred horizontally.

### Mobile

On mobile (< 640 px) tiles stack vertically. Only tile A gets extra height.
Cropping is `object-fit: cover` centred — no action required.

---

## Supported formats

`jpg` · `png` · `webp` · `avif`

`webp` is recommended for best quality-to-filesize ratio.
