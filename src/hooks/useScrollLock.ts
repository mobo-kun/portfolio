/**
 * @file useScrollLock.ts
 * @description Locks body scroll while a modal / bottom sheet is open.
 *
 * ─── Why not just `overflow: hidden` on body? ───────────────────────────────
 * iOS Safari scrolls the *viewport*, not the body. Setting `body { overflow:
 * hidden }` has no effect — the page still scrolls underneath the sheet.
 *
 * ─── The `position: fixed` technique ────────────────────────────────────────
 * Fixing the body in place prevents viewport scroll on all platforms. We save
 * the current `scrollY` first so we can restore the exact position on cleanup
 * — otherwise the user would jump back to the top when the sheet closes.
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 * Call this hook at the top level of any modal or bottom-sheet component:
 *
 *   function MyBottomSheet() {
 *     useScrollLock();
 *     return <div>…</div>;
 *   }
 *
 * The lock is applied on mount and automatically released on unmount.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect } from "react";

export function useScrollLock(): void {
  useEffect(() => {
    const scrollY = window.scrollY;
    const { style } = document.body;

    // Freeze the page at its current scroll position
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    // Keep the scrollbar gutter so content doesn't jump when it disappears
    style.overflowY = "scroll";

    return () => {
      // Restore all properties and jump back to where the user was
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.overflowY = "";
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, []);
}
