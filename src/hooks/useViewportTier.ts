"use client";

/**
 * Returns a responsive tier based on the current viewport dimensions.
 *
 * | Tier | Condition                              | Use case               |
 * |------|----------------------------------------|------------------------|
 * |  0   | viewport height < 680px                | Short phones (SE)      |
 * |  1   | width < 640px OR height < 860px        | Normal mobile/tablet   |
 * |  2   | width ≥ 640px AND height ≥ 860px       | Desktop / large tablet |
 *
 * Initialises to tier 1 on the server (safe fallback — avoids layout flash).
 */

import { useState, useEffect } from "react";

export type ViewportTier = 0 | 1 | 2;

/**
 * Returns the current viewport tier (0 | 1 | 2) reactively.
 * Re-evaluates on every window resize event.
 *
 * - Tier 0: very short viewport (e.g. iPhone SE landscape) — hides tagline
 * - Tier 1: standard mobile or short desktop — compact orb size
 * - Tier 2: wide + tall desktop — full-size orb and orbit radius
 */
export function useViewportTier(): ViewportTier {
  // Initialise with zeros so SSR always renders tier 1 (safe default)
  const [vp, setVp] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const check = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Height-only gate for very short viewports (e.g. iPhone SE landscape)
  if (vp.h > 0 && vp.h < 680) return 0;
  // Narrow or short screen → compact layout
  if (vp.w < 640 || vp.h < 860) return 1;
  // Wide + tall → full desktop layout
  return 2;
}
