"use client";

/**
 * @file BentoGrid.tsx
 * @description Featured case studies displayed as a viewport-filling bento grid.
 *
 * ── Tile map ──────────────────────────────────────────────────────────────────
 *
 *   Desktop (≥1024px)          Tablet (640–1023px)       Mobile (<640px)
 *   ┌──────────┬──────┐        ┌──────────────┐          ┌──────────────┐
 *   │          │  B   │        │      A       │          │      A       │  4:3
 *   │    A     ├──────┤        ├──────┬───────┤          ├──────────────┤
 *   │          │  C   │        │  B   │   C   │          │      B       │  4:3
 *   ├─────┬────┴──────┤        ├──────┼───────┤          ├──────────────┤
 *   │  D  │     E     │        │  D   │   E   │          │      C       │  4:3
 *   └─────┴───────────┘        └──────┴───────┘          ├──────────────┤
 *                                                         │      D       │  4:3
 *                                                         ├──────────────┤
 *                                                         │      E       │  4:3
 *                                                         └──────────────┘
 *
 * ── Responsive images ────────────────────────────────────────────────────────
 *  Each tile loads a different crop per breakpoint via <picture>:
 *    public/case-studies/tile-a/desktop.jpg  ← ≥1024px
 *    public/case-studies/tile-a/tablet.jpg   ← 640–1023px
 *    public/case-studies/tile-a/mobile.jpg   ← <640px
 *
 *  Drop images there to replace the gradient placeholders.
 *  Full size guide: public/case-studies/TILE-GUIDE.md
 *
 * ── Config ───────────────────────────────────────────────────────────────────
 *  Tile IDs, hrefs and alt texts live in data/bento-config.json.
 *  To swap a case study, update href/alt there — image folders stay the same.
 */

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import bentoConfig from "../../../data/bento-config.json";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Tile = {
  /** Stable folder name — never changes even if the project changes.
   *  Maps 1-to-1 with public/case-studies/<id>/  */
  id: string;
  /** Grid position label — for documentation only, not rendered */
  position: string;
  /** Display name shown on the overlay — update freely in bento-config.json */
  title: string;
  /** URL this tile links to — update freely in bento-config.json */
  href: string;
  /** Alt text for the cover image — describe the visual, not the project name */
  alt: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CSS grid-area letters assigned in order (tile-a → "a", tile-b → "b", …).
 * These map directly to the gridTemplateAreas strings in the layout divs below.
 */
const GRID_AREAS = ["a", "b", "c", "d", "e"] as const;

// ─────────────────────────────────────────────────────────────────────────────
// BentoTile
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A single image-only bento tile.
 *
 * Image strategy — three files per tile (art direction via <picture>):
 *   desktop.jpg  served at ≥1024px
 *   tablet.jpg   served at 640–1023px
 *   mobile.jpg   served at <640px
 *
 * If the image fails to load (file not uploaded yet), PlaceholderArt is shown.
 *
 * Interactions:
 *   - 3D tilt on mousemove  (±5° max)
 *   - scale-up on hover
 *   - staggered whileInView entrance
 *
 * @param tile    - Tile config from bento-config.json
 * @param area    - CSS grid-area letter ("a"–"e")
 * @param index   - Position index used for stagger delay and placeholder variant
 */
function BentoTile({
  tile,
  area,
  index,
}: {
  tile: Tile;
  area: string;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState<string>("");

  /**
   * JS-selected image source — picks the right crop for the current viewport.
   *
   * We use a plain <img> + JS selection instead of <picture>+<source> because:
   * when a <source> matches but its URL 404s, browsers do NOT fire onError on
   * the inner <img> — they show the broken-image icon silently. A plain <img>
   * with a JS-selected src fires onError reliably every time.
   *
   * null on SSR → PlaceholderArt renders until JS runs (no hydration mismatch).
   */
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    // Select the matching crop once mounted — runs with real viewport width
    const base = `/case-studies/${tile.id}`;
    const w = window.innerWidth;
    if (w >= 1024) setImgSrc(`${base}/desktop.jpg`);
    else if (w >= 640) setImgSrc(`${base}/tablet.jpg`);
    else setImgSrc(`${base}/mobile.jpg`);
  }, [tile.id]);

  // ── 3D tilt ────────────────────────────────────────────────────────────────

  /** Compute perspective rotateX/Y from cursor offset relative to tile centre */
  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    // Max ±5° tilt — subtle depth without dizziness
    const rotateY = ((x - cx) / cx) * 5;
    const rotateX = -((y - cy) / cy) * 5;
    setTransform(
      `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`
    );
  }

  /** Reset tilt when cursor leaves */
  function handleLeave() {
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg)");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.07 }}
      style={{ gridArea: area }}
      className="h-full min-h-0"
    >
      <Link
        ref={ref}
        href={tile.href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleLeave}
        style={{ transform, transition: "transform 300ms ease-out" }}
        className="group relative block w-full h-full overflow-hidden rounded-xl border border-border-card hover:border-cyan-500 transition-colors duration-300 will-change-transform"
        aria-label={tile.alt}
      >
        {/* ── Cover image ───────────────────────────────────────────────────
         *  imgSrc is null until JS runs → shows PlaceholderArt on SSR/before mount.
         *  imgFailed → true when the file doesn't exist → shows PlaceholderArt.
         *  alt="" because aria-label on the <Link> covers accessibility.
         * ─────────────────────────────────────────────────────────────── */}
        <div className="absolute inset-0">
          {imgSrc && !imgFailed ? (
            <img
              src={imgSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover
                         transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              onError={() => setImgFailed(true)}
            />
          ) : (
            /* Image missing or not yet uploaded — branded gradient placeholder */
            <PlaceholderArt index={index} />
          )}
        </div>

        {/* ── Mobile & tablet overlay (always visible) ──────────────────
         *  Bottom gradient scrim + small bold truncated project title.
         *  Hidden on desktop where the hover overlay takes over.
         * ─────────────────────────────────────────────────────────────── */}
        <div
          className="lg:hidden pointer-events-none absolute bottom-0 left-0 right-0 h-24 flex items-end px-5 pb-5"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)" }}
        >
          <p className="text-white font-intel text-base sm:text-lg font-bold truncate w-full leading-tight">
            {tile.title}
          </p>
        </div>

        {/* ── Desktop hover overlay ─────────────────────────────────────
         *  Appears on group-hover. Full dark scrim + large title + CTA pill.
         *  Title and CTA slide up slightly as the scrim fades in.
         *  Hidden on mobile/tablet (touch devices use the static overlay above).
         * ─────────────────────────────────────────────────────────────── */}
        <div
          className="hidden lg:flex absolute inset-0 flex-col items-center justify-center gap-4 px-6
                     opacity-0 group-hover:opacity-100
                     bg-black/0 group-hover:bg-black/55
                     transition-all duration-300 ease-out"
        >
          {/* Project title — large, centred, white */}
          <h3
            className="font-intel text-white text-xl xl:text-2xl font-bold text-center leading-snug
                       translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out"
          >
            {tile.title}
          </h3>

          {/* Bordered pill CTA — slides up slightly after the title */}
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full
                       border border-white/70 text-white text-sm font-roboto font-medium
                       translate-y-2 group-hover:translate-y-0
                       transition-transform duration-300 ease-out delay-75
                       group-hover:border-white group-hover:bg-white/10"
          >
            View Case Study
            <ArrowRight size={13} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PlaceholderArt
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gradient shown when no cover image exists for a tile.
 * Each tile gets a slightly different gradient angle for visual variety.
 *
 * @param index - Tile index (0–4) used to pick an angle variant
 */
function PlaceholderArt({ index }: { index: number }) {
  const angles = [135, 160, 115, 145, 125];
  const angle = angles[index % angles.length];
  return (
    <div
      className="w-full h-full relative"
      style={{
        background: `linear-gradient(${angle}deg, var(--page-surface) 0%, color-mix(in srgb, var(--color-cyan-900) 25%, var(--page-bg)) 100%)`,
      }}
    >
      {/* Dual radial cyan highlights to give a sense of depth */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 35%, var(--color-cyan-900) 0%, transparent 55%), " +
            "radial-gradient(circle at 72% 68%, var(--color-cyan-900) 0%, transparent 58%)",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BentoGrid (export)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Section container — renders up to 5 tiles from bento-config.json.
 *
 * Three fully separate responsive layouts rendered via CSS breakpoints:
 *   Desktop  (lg: ≥1024px) — asymmetric bento, fits one viewport
 *   Tablet   (sm–lg)       — 2-col bento, fits one viewport
 *   Mobile   (<sm)         — vertical list, 4:3 ratio per tile, scrollable
 *
 * To update a tile's destination or alt text:   edit data/bento-config.json
 * To update a tile's cover image:               replace files in public/case-studies/<id>/
 * Image size guide:                             public/case-studies/TILE-GUIDE.md
 */
export default function BentoGrid() {
  const tiles: Tile[] = (bentoConfig.tiles as Tile[]).slice(0, 5);

  return (
    <section className="relative px-6 py-16 md:py-20 border-t border-border-card">
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 md:mb-8"
        >
          <p className="font-roboto text-xs tracking-[0.18em] uppercase text-cyan-500 mb-1.5">
            Featured Work
          </p>
          <h2 className="font-intel text-3xl md:text-4xl font-bold text-text-primary">
            Selected Case Studies
          </h2>
        </motion.div>

        {/* ── Desktop bento (≥1024px) ───────────────────────────────────────
         *
         *  Grid areas:  "a a b"       Tile A: 2-col × 2-row (top-left, large)
         *               "a a c"       Tile B: 1-col × 1-row (top-right)
         *               "d e e"       Tile C: 1-col × 1-row (mid-right)
         *                             Tile D: 1-col × 1-row (bottom-left)
         *                             Tile E: 2-col × 1-row (bottom-right, wide)
         *
         *  Height fills one viewport minus the section padding + header (~14rem).
         *  Visible aspect ratios at 1440×900 viewport:
         *    A → ~3:2   B/C/D → ~5:3   E → ~10:3
         *  (All tiles use object-fit:cover, so any oversized image is cropped.)
         * ──────────────────────────────────────────────────────────────── */}
        <div
          className="hidden lg:grid gap-3"
          style={{
            gridTemplateAreas: `"a a b" "a a c" "d e e"`,
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr 1fr",
            height: "calc(100dvh - 14rem)",
          }}
        >
          {tiles.map((tile, i) => (
            <BentoTile
              key={tile.id}
              tile={tile}
              area={GRID_AREAS[i]}
              index={i}
            />
          ))}
        </div>

        {/* ── Tablet bento (640–1023px) ─────────────────────────────────────
         *
         *  Grid areas:  "a a"         Tile A: full-width banner (2-col × 2fr)
         *               "b c"         Tile B/C: equal halves (1-col × 1fr each)
         *               "d e"         Tile D/E: equal halves (1-col × 1fr each)
         *
         *  Visible aspect ratios at 768×1024 iPad:
         *    A → ~2:1 (panoramic banner)    B/C/D/E → ~2:1
         * ──────────────────────────────────────────────────────────────── */}
        <div
          className="hidden sm:grid lg:hidden gap-3"
          style={{
            gridTemplateAreas: `"a a" "b c" "d e"`,
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "2fr 1fr 1fr",
            height: "calc(100dvh - 14rem)",
          }}
        >
          {tiles.map((tile, i) => (
            <BentoTile
              key={tile.id}
              tile={tile}
              area={GRID_AREAS[i]}
              index={i}
            />
          ))}
        </div>

        {/* ── Mobile list (<640px) ──────────────────────────────────────────
         *
         *  Vertical flex column. Every tile is 4:3 (landscape rectangle).
         *  No fixed viewport height — scrolls naturally.
         *  At 390px mobile width each tile is approx 390 × 293 px.
         * ──────────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:hidden">
          {tiles.map((tile, i) => (
            /* w-full + aspect-[4/3] gives a 4:3 rectangle at any mobile width */
            <div key={tile.id} className="w-full aspect-[4/3]">
              <BentoTile
                tile={tile}
                area={GRID_AREAS[i]}
                index={i}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
