"use client";

/**
 * @file RecommendationsCarousel.tsx
 * @description Infinitely scrolling marquee + read-more modal / bottom-sheet.
 *
 * Data source: GET /api/recommendations (Supabase, 60 s ISR).
 * Fallback:    HARDCODED_RECOMMENDATIONS — used when Supabase is empty / unreachable.
 *
 * Modal behaviour:
 *   Desktop  (≥768 px) — centred modal, scale+fade spring transition
 *   Mobile   (<768 px) — bottom sheet, slides up from below
 * "Read full" button only appears when quote > QUOTE_THRESHOLD chars.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, X, ExternalLink } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */

type Recommendation = {
  name: string;
  role: string;
  quote: string;
  linkedIn: string;
  image?: string;
};

/* ─── Constants ──────────────────────────────────────────────── */

/** Show "Read full" button when quote exceeds this many characters */
const QUOTE_THRESHOLD = 120;

/* ─── Fallback data ──────────────────────────────────────────── */

const HARDCODED_RECOMMENDATIONS: Recommendation[] = [
  {
    name: "Sara Mohammadi",
    role: "Engineering Manager, Nobitex",
    quote:
      "Behdad turns ambiguous product problems into shipping-ready flows with rare clarity. His behavioural-design lens consistently lifts our key metrics.",
    linkedIn: "https://linkedin.com/in/sara-mohammadi",
  },
  {
    name: "Arman Karimi",
    role: "Head of Product, Aban Tether",
    quote:
      "One of the few designers who can hold both strategy and pixel-craft in the same week. He raises the bar for everyone around him.",
    linkedIn: "https://linkedin.com/in/arman-karimi",
  },
  {
    name: "Niloofar R.",
    role: "Senior Researcher, Digikala",
    quote:
      "Pairing with Behdad on research means insights actually translate into product decisions — not just slides.",
    linkedIn: "https://linkedin.com/in/niloofar-r",
  },
  {
    name: "Pouya Tehrani",
    role: "Staff Engineer",
    quote:
      "Calm, opinionated, and deeply curious. The kind of design partner that makes engineers want to ship a little nicer.",
    linkedIn: "https://linkedin.com/in/pouya-tehrani",
  },
  {
    name: "Maryam K.",
    role: "Product Lead",
    quote:
      "Behdad designs with intent. Every interaction, copy choice, and edge case feels considered — not decorated.",
    linkedIn: "https://linkedin.com/in/maryam-k",
  },
  {
    name: "Ali Hashemi",
    role: "Founder, fintech startup",
    quote:
      "We hired Behdad to consult on onboarding — three weeks later our drop-off was down by a third. That speaks for itself.",
    linkedIn: "https://linkedin.com/in/ali-hashemi",
  },
];

/* ─── Avatar ─────────────────────────────────────────────────── */

function AvatarPlaceholder({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={[
        "rounded-full bg-cyan-900 border border-cyan-500/40 flex items-center justify-center font-intel font-bold text-white flex-shrink-0",
        size === "lg" ? "w-14 h-14 text-base" : "w-11 h-11 text-sm",
      ].join(" ")}
    >
      {initials}
    </span>
  );
}

/* ─── Modal / Bottom-sheet ───────────────────────────────────── */

function RecModal({ rec, onClose }: { rec: Recommendation; onClose: () => void }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  /* ── Shared inner card content ── */
  const CardContent = (
    <div className="flex flex-col gap-5">
      {/* Quote icon */}
      <Quote size={22} className="text-cyan-500" aria-hidden />

      {/* Full quote — no clamp */}
      <p className="font-roboto text-sm md:text-base text-text-primary/90 leading-relaxed">
        {rec.quote}
      </p>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Person row */}
      <div className="flex items-center gap-4">
        <a
          href={rec.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${rec.name}'s LinkedIn profile`}
          className="flex-shrink-0"
        >
          {rec.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={rec.image}
              alt={rec.name}
              className="w-14 h-14 rounded-full object-cover border border-border-card"
            />
          ) : (
            <AvatarPlaceholder name={rec.name} size="lg" />
          )}
        </a>
        <div className="min-w-0 flex-1">
          <a
            href={rec.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-intel text-base font-bold text-text-primary hover:text-cyan-500 transition-colors duration-200"
          >
            {rec.name}
            <ExternalLink size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <p className="font-roboto text-sm text-text-secondary mt-0.5">{rec.role}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Backdrop ── */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {isMobile ? (
        /* ── Mobile: bottom sheet slides up ── */
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Full recommendation from ${rec.name}`}
          className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border-card rounded-t-2xl p-6 pb-10 max-h-[85dvh] overflow-y-auto"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 340, damping: 36 }}
        >
          {/* Drag handle */}
          <div className="w-10 h-1 rounded-full bg-border-card mx-auto mb-6" />
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border-card text-text-secondary hover:text-text-primary hover:border-cyan-500/50 transition-colors"
          >
            <X size={15} />
          </button>
          {CardContent}
        </motion.div>
      ) : (
        /* ── Desktop: centred modal expands from centre ── */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Full recommendation from ${rec.name}`}
            className="pointer-events-auto relative w-full max-w-lg bg-surface border border-border-card rounded-2xl p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.88, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 28 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            {/* Top shimmer */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border-card text-text-secondary hover:text-text-primary hover:border-cyan-500/50 transition-colors"
            >
              <X size={15} />
            </button>

            {CardContent}
          </motion.div>
        </div>
      )}
    </>
  );
}

/* ─── Card ───────────────────────────────────────────────────── */

function RecommendationCard({
  rec,
  onReadMore,
}: {
  rec: Recommendation;
  onReadMore: () => void;
}) {
  const isLong = rec.quote.length > QUOTE_THRESHOLD;

  return (
    <article className="flex-shrink-0 w-[320px] sm:w-[380px] bg-surface border border-border-card rounded-xl p-6 hover:border-cyan-500 transition-colors duration-300 flex flex-col">
      <Quote size={18} className="text-cyan-500 mb-3 flex-shrink-0" aria-hidden="true" />

      {/* Quote — clamped to 4 lines; "Read full" shown when truncated */}
      <p className="font-roboto text-sm md:text-[15px] text-text-primary/90 leading-relaxed line-clamp-4 flex-1 mb-2">
        {rec.quote}
      </p>

      {/* "Read full" text button — only when quote is long */}
      {isLong && (
        <button
          onClick={onReadMore}
          className="self-start font-roboto text-xs text-cyan-500 hover:text-cyan-400 transition-colors duration-200 mb-4 underline underline-offset-2"
        >
          Read full →
        </button>
      )}

      {!isLong && <div className="mb-4" />}

      {/* Person row */}
      <div className="flex items-center gap-3">
        <a
          href={rec.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${rec.name}'s LinkedIn profile`}
          className="flex-shrink-0"
        >
          {rec.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={rec.image}
              alt={rec.name}
              className="w-11 h-11 rounded-full object-cover border border-border-card"
            />
          ) : (
            <AvatarPlaceholder name={rec.name} />
          )}
        </a>
        <div className="min-w-0">
          <a
            href={rec.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-intel text-sm font-bold text-text-primary hover:text-cyan-500 transition-colors duration-200 truncate"
          >
            {rec.name}
          </a>
          <p className="font-roboto text-xs text-text-secondary truncate">{rec.role}</p>
        </div>
      </div>
    </article>
  );
}

/* ─── Main section ───────────────────────────────────────────── */

export default function RecommendationsCarousel() {
  const [paused, setPaused] = useState(false);
  const [items, setItems] = useState<Recommendation[]>(HARDCODED_RECOMMENDATIONS);
  const [activeRec, setActiveRec] = useState<Recommendation | null>(null);

  // Fetch live data from Supabase via API route on mount
  useEffect(() => {
    fetch("/api/recommendations")
      .then((res) => res.json())
      .then(({ data }: { data: Recommendation[] }) => {
        if (Array.isArray(data) && data.length > 0) setItems(data);
      })
      .catch(() => { /* keep hardcoded fallback */ });
  }, []);

  // Pause marquee when modal is open
  const isModalOpen = activeRec !== null;

  // Duplicate array for seamless loop
  const loop = [...items, ...items];

  return (
    <>
      <section className="relative py-20 md:py-28 border-t border-border-card overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="font-roboto text-xs tracking-[0.18em] uppercase text-cyan-500 mb-2">
              Kind Words
            </p>
            <h2 className="font-intel text-3xl md:text-4xl font-bold text-text-primary">
              What people say
            </h2>
          </motion.div>
        </div>

        {/* Marquee track */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Edge fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 z-10 bg-gradient-to-r from-bg to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 z-10 bg-gradient-to-l from-bg to-transparent" />

          <div
            className="flex gap-5 w-max"
            style={{
              animation: "marquee 40s linear infinite",
              animationPlayState: paused || isModalOpen ? "paused" : "running",
            }}
          >
            {loop.map((rec, i) => (
              <RecommendationCard
                key={`${rec.name}-${i}`}
                rec={rec}
                onReadMore={() => setActiveRec(rec)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal / bottom-sheet — rendered outside section so it overlays everything */}
      <AnimatePresence>
        {activeRec && (
          <RecModal rec={activeRec} onClose={() => setActiveRec(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
