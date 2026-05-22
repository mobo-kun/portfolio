"use client";

/**
 * @file ThemeToggle.tsx
 * @description Light/dark mode toggle button for the global header.
 *
 * Key features:
 * - Uses next-themes resolvedTheme for reliable SSR/hydration safety
 * - useIsMounted prevents hydration mismatch by deferring rendering to client
 * - Renders a sun icon in dark mode and a moon icon in light mode
 * - Framer Motion whileHover/whileTap scale feedback
 */

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

/**
 * Returns `true` only after hydration on the client. Avoids the cascading-render
 * lint rule that fires when setting state inside `useEffect`, and prevents
 * hydration mismatch when reading `resolvedTheme` from `next-themes`.
 */
function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/**
 * Theme toggle button — cycles between dark and light mode.
 * Renders a placeholder div of the same size before hydration to avoid layout shift.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <motion.button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={
        resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-border-card text-text-secondary hover:text-cyan-500 hover:border-cyan-500 transition-colors duration-200"
    >
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </motion.button>
  );
}
