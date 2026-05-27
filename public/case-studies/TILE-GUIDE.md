# Bento Grid — Tile Image Guide

Each tile has a stable folder name that never changes, even if the project/link changes.
Upload **3 images per tile** — one crop per breakpoint. All images use `object-fit: cover`.

---

## Folder Structure

```
public/case-studies/
├── tile-a/           ← A · Top-Left (large featured tile)
│   ├── desktop.jpg
│   ├── tablet.jpg
│   └── mobile.jpg
├── tile-b/           ← B · Top-Right
│   ├── desktop.jpg
│   ├── tablet.jpg
│   └── mobile.jpg
├── tile-c/           ← C · Mid-Right
│   ├── desktop.jpg
│   ├── tablet.jpg
│   └── mobile.jpg
├── tile-d/           ← D · Bottom-Left
│   ├── desktop.jpg
│   ├── tablet.jpg
│   └── mobile.jpg
└── tile-e/           ← E · Bottom-Right Wide
    ├── desktop.jpg
    ├── tablet.jpg
    └── mobile.jpg
```

Supported formats: `jpg` · `png` · `webp` · `avif`
(`webp` recommended for best quality-to-filesize ratio — just rename the file to `desktop.webp` etc.)

---

## Tile Map

### Desktop (≥ 1024 px)

```
┌──────────────┬───────┐
│              │   B   │
│      A       ├───────┤
│   (large)    │   C   │
├───────┬───────┴───────┤
│   D   │       E       │
└───────┴───────────────┘
```

### Tablet (640 – 1023 px)

```
┌───────────────────────┐
│           A           │  ← spans full width
├───────────┬───────────┤
│     B     │     C     │
├───────────┼───────────┤
│     D     │     E     │
└───────────┴───────────┘
```

### Mobile (< 640 px)

```
┌───────────────────────┐
│           A           │  4:3
├───────────────────────┤
│           B           │  4:3
├───────────────────────┤
│           C           │  4:3
├───────────────────────┤
│           D           │  4:3
├───────────────────────┤
│           E           │  4:3
└───────────────────────┘
```

All mobile tiles are the same height. Scrolling is expected and normal.

---

## Per-Tile Size Guide

> All ratios are approximate — the exact size varies with viewport.
> Upload at the recommended pixel size or larger; the browser scales down.
> **Always centre your subject** — images are cropped to fill the tile.

---

### Tile A — Top-Left (large featured)

| Breakpoint | Grid span       | Visible ratio | Recommended upload |
|------------|-----------------|---------------|--------------------|
| Desktop    | 2-col × 2-row   | **~ 3:2**     | **1400 × 940 px**  |
| Tablet     | full-width × 2fr| **~ 2:1**     | **1440 × 720 px**  |
| Mobile     | full-width      | **4:3**       | **800 × 600 px**   |

Tile A is the hero image of the grid — use your strongest visual here.
On desktop it occupies the top-left quadrant (2×2). On tablet it spans the full width as a banner.

---

### Tile B — Top-Right

| Breakpoint | Grid span       | Visible ratio | Recommended upload |
|------------|-----------------|---------------|--------------------|
| Desktop    | 1-col × 1-row   | **~ 5:3**     | **800 × 480 px**   |
| Tablet     | 1-col × 1fr     | **~ 2:1**     | **800 × 400 px**   |
| Mobile     | full-width      | **4:3**       | **800 × 600 px**   |

---

### Tile C — Mid-Right

| Breakpoint | Grid span       | Visible ratio | Recommended upload |
|------------|-----------------|---------------|--------------------|
| Desktop    | 1-col × 1-row   | **~ 5:3**     | **800 × 480 px**   |
| Tablet     | 1-col × 1fr     | **~ 2:1**     | **800 × 400 px**   |
| Mobile     | full-width      | **4:3**       | **800 × 600 px**   |

---

### Tile D — Bottom-Left

| Breakpoint | Grid span       | Visible ratio | Recommended upload |
|------------|-----------------|---------------|--------------------|
| Desktop    | 1-col × 1-row   | **~ 5:3**     | **800 × 480 px**   |
| Tablet     | 1-col × 1fr     | **~ 2:1**     | **800 × 400 px**   |
| Mobile     | full-width      | **4:3**       | **800 × 600 px**   |

---

### Tile E — Bottom-Right Wide

| Breakpoint | Grid span       | Visible ratio | Recommended upload |
|------------|-----------------|---------------|--------------------|
| Desktop    | 2-col × 1-row   | **~ 10:3**    | **1400 × 420 px**  |
| Tablet     | 1-col × 1fr     | **~ 2:1**     | **800 × 400 px**   |
| Mobile     | full-width      | **4:3**       | **800 × 600 px**   |

Tile E is the wide banner at the bottom-right on desktop. Use a horizontal/landscape composition.

---

## Quick Summary Table

| Tile | Desktop upload   | Tablet upload   | Mobile upload  |
|------|-----------------|-----------------|----------------|
| A    | 1400 × 940 px   | 1440 × 720 px   | 800 × 600 px   |
| B    | 800 × 480 px    | 800 × 400 px    | 800 × 600 px   |
| C    | 800 × 480 px    | 800 × 400 px    | 800 × 600 px   |
| D    | 800 × 480 px    | 800 × 400 px    | 800 × 600 px   |
| E    | 1400 × 420 px   | 800 × 400 px    | 800 × 600 px   |

---

## Changing a Tile's Project / Link

You **do not** need to rename image folders when the linked project changes.
Edit `data/bento-config.json` instead:

```json
{
  "tiles": [
    {
      "id": "tile-a",           ← folder name — never change this
      "position": "top-left",   ← documentation only, not rendered
      "href": "/case-studies/my-new-project",   ← change this
      "alt": "My New Project Cover"             ← change this
    },
    ...
  ]
}
```

The `id` is the only thing that ties the config to the image folder.
Change `href` and `alt` freely without touching the image files.

---

## Tips

- If a file is missing, a branded gradient placeholder is shown automatically.
- Use `webp` for the best size/quality balance (rename to `desktop.webp` etc.).
- For ultra-wide tile E on desktop, a flat illustration or a UI screenshot cropped
  to a wide strip works better than a portrait photo.
- The grid fits **one viewport height** on desktop and tablet — no scrolling needed.
  On mobile, all 5 tiles stack vertically at 4:3 and scroll naturally.
