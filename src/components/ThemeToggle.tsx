"use client";

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
