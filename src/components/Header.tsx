"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/cv", label: "CV" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-md bg-bg/80 border-b border-border-card flex items-center px-6 md:px-10">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          {/* Logo / name */}
          <Link
            href="/"
            className="font-intel text-text-primary font-bold tracking-tight hover:text-cyan-500 transition-colors duration-200"
          >
            Behdad
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative text-sm font-roboto transition-colors duration-200 group ${
                    active
                      ? "text-cyan-500"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-cyan-500 transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {/* Mobile hamburger */}
            <motion.button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-border-card text-text-secondary"
              onClick={() => setDrawerOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-72 z-50 bg-surface border-l border-border-card flex flex-col px-8 pt-8 pb-10 md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-intel font-bold text-text-primary">Menu</span>
                <motion.button
                  onClick={() => setDrawerOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close menu"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-border-card text-text-secondary"
                >
                  <X size={18} />
                </motion.button>
              </div>

              <nav className="flex flex-col gap-5">
                {NAV_LINKS.map(({ href, label }) => {
                  const active =
                    href === "/" ? pathname === "/" : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setDrawerOpen(false)}
                      className={`text-lg font-roboto transition-colors duration-200 ${
                        active
                          ? "text-cyan-500"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so page content starts below fixed header */}
      <div className="h-16" />
    </>
  );
}
