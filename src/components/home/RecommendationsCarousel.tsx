"use client";

/**
 * @file RecommendationsCarousel.tsx
 * @description Infinitely scrolling marquee + read-more modal / bottom-sheet.
 *
 * Data source: GET /api/recommendations (Supabase, 60 s ISR).
 * Fallback:    HARDCODED_RECOMMENDATIONS — used when Supabase returns empty.
 *
 * Fetch states:
 *   loading — skeleton cards shown while awaiting API response
 *   success — marquee running (Supabase data, or hardcoded fallback if empty)
 *   error   — Supabase timed-out / failed; funny message + retry button
 *
 * Fetch resilience:
 *   • 8 s AbortController timeout — prevents infinite "loading"
 *   • Cleanup on unmount — prevents state update on dead component
 *   • onError on <img> — falls back to AvatarPlaceholder if URL is broken
 *
 * Modal behaviour:
 *   Desktop  (≥768 px) — centred modal, 3-D flip spring transition
 *   Mobile   (<768 px) — bottom sheet, drag-to-dismiss
 * "Read full" button only appears when quote > QUOTE_THRESHOLD chars.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, X, ExternalLink, RefreshCw, ServerCrash } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";

/* ─── Types ─────────────────────────────────────────────────── */

type Recommendation = {
  name: string;
  role: string;
  quote: string;
  linkedIn: string;
  image?: string;
};

/** Lifecycle of the Supabase fetch */
type FetchStatus = "loading" | "success" | "error";

/* ─── Constants ──────────────────────────────────────────────── */

/** Show "Read full" button when quote exceeds this many characters */
const QUOTE_THRESHOLD = 120;

/** Milliseconds before the fetch is aborted and the error state is shown */
const FETCH_TIMEOUT_MS = 8_000;

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

/* ─── Skeleton loading ───────────────────────────────────────── */

/** Single shimmer card — mirrors RecommendationCard's dimensions exactly */
function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
      className="flex-shrink-0 w-[320px] sm:w-[380px] bg-surface border border-border-card rounded-xl p-6 flex flex-col gap-3"
    >
      {/* Quote icon */}
      <div className="skeleton-shimmer w-5 h-5 rounded" />
      {/* Text lines — varying widths mimic a real quote */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="skeleton-shimmer h-3 rounded w-full" />
        <div className="skeleton-shimmer h-3 rounded w-11/12" />
        <div className="skeleton-shimmer h-3 rounded w-4/5" />
        <div className="skeleton-shimmer h-3 rounded w-3/4" />
      </div>
      {/* Person row */}
      <div className="flex items-center gap-3 pt-2">
        <div className="skeleton-shimmer w-11 h-11 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="skeleton-shimmer h-3 rounded w-2/3" />
          <div className="skeleton-shimmer h-2.5 rounded w-1/2" />
        </div>
      </div>
    </motion.div>
  );
}

/** Four skeleton cards shown while the API call is in-flight */
function SkeletonTrack() {
  return (
    <div
      role="status"
      aria-label="Loading recommendations…"
      className="flex gap-5 px-6 overflow-hidden"
    >
      {([0, 0.08, 0.16, 0.24] as const).map((delay, i) => (
        <SkeletonCard key={i} delay={delay} />
      ))}
    </div>
  );
}

/* ─── Error state ────────────────────────────────────────────── */

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-14 px-6 gap-5 text-center"
      role="alert"
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-full border border-border-card flex items-center justify-center text-text-secondary">
        <ServerCrash size={26} />
      </div>

      {/* Copy */}
      <div className="max-w-xs">
        <p className="font-intel text-base font-bold text-text-primary mb-1">
          Supabase left us on read.
        </p>
        <p className="font-roboto text-sm text-text-secondary leading-relaxed">
          &ldquo;API response time: ∞ms. Even behavioural design
          can&apos;t fix server latency.&rdquo;
        </p>
      </div>

      {/* Retry */}
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 font-roboto text-sm text-cyan-500 hover:text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/60 rounded-lg px-4 py-2 transition-colors duration-200"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </motion.div>
  );
}

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

/**
 * Renders the person's photo, falling back to AvatarPlaceholder if:
 *   - no image URL was provided, OR
 *   - the URL resolves to a 404 / broken image (onError fires)
 */
function Avatar({ name, image, size = "md" }: { name: string; image?: string; size?: "md" | "lg" }) {
  const [failed, setFailed] = useState(false);
  const sz = size === "lg" ? "w-14 h-14" : "w-11 h-11";

  if (image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        onError={() => setFailed(true)}
        className={`${sz} rounded-full object-cover border border-border-card`}
      />
    );
  }
  return <AvatarPlaceholder name={name} size={size} />;
}

/* ─── Modal / Bottom-sheet ───────────────────────────────────── */

function RecModal({ rec, onClose }: { rec: Recommendation; onClose: () => void }) {
  // Lazy initializer runs synchronously on first render — no useEffect round-trip,
  // so the correct variant (bottom sheet vs modal) is chosen immediately.
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lock body scroll while open (works on iOS Safari — see useScrollLock)
  useScrollLock();

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

      {/* Full quote — no clamp, break-words so long text never overflows */}
      <p className="font-roboto text-sm md:text-base text-text-primary/90 leading-relaxed break-words">
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
          <Avatar name={rec.name} image={rec.image} size="lg" />
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
      {/* ── Backdrop — deepens on open, clears on close ── */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {isMobile ? (
        /* ── Mobile: bottom sheet slides up ──
         * Outer div: fixed full-screen, overflow-hidden clips any bleed,
         * flex-col justify-end pushes sheet to bottom — no width issues.
         * Inner motion.div: animates y only, never wider than 100vw.
         * Scrollable content is a separate inner div so overflow-y-auto
         * doesn't fight the transform. ── */
        <div
          data-slot="bottom-sheet-overlay"
          className="fixed inset-0 z-50 flex flex-col justify-end overflow-hidden pointer-events-none"
        >
          <motion.div
            data-slot="bottom-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={`Full recommendation from ${rec.name}`}
            className="pointer-events-auto w-full bg-surface border-t border-border-card rounded-t-2xl overflow-hidden relative"
            /* ── Entry / exit — snappy spring, slight overshoot ────────────
             * stiffness:480 + damping:38 gives a decisive snap-in feel.
             * Exit uses a tighter spring so dismissal feels intentional.  ── */
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { type: "spring", stiffness: 560, damping: 46 } }}
            transition={{ type: "spring", stiffness: 480, damping: 38, mass: 0.85 }}
            /* ── Drag-to-dismiss ─────────────────────────────────────────── */
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 400) onClose();
            }}
          >
            {/* ── Cyan edge shimmer — sweeps in from left after sheet settles ── */}
            <motion.div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent origin-left pointer-events-none"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* ── Subtle top glow — brand tint on the sheet edge ── */}
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-cyan-500/[0.06] to-transparent pointer-events-none"
            />

            {/* ── Fixed header: drag handle + close — never scrolls away ── */}
            {/* 3-column flex: left spacer | centre pill | right close button   */}
            {/* The entire header row is the drag zone — cursor:grab signals it */}
            <div
              data-slot="bottom-sheet-header"
              className="flex items-center px-4 pt-4 pb-3 flex-shrink-0 cursor-grab active:cursor-grabbing relative z-10"
            >
              {/* Left spacer — mirrors close button width to keep pill centred */}
              <div className="w-8 h-8 flex-shrink-0" aria-hidden="true" />

              {/* Drag pill */}
              <div className="flex-1 flex justify-center py-2">
                <motion.div
                  data-slot="bottom-sheet-drag-handle"
                  className="w-10 h-1 rounded-full bg-border-card"
                  initial={{ scaleX: 0.4, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.18, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              {/* Close button — stop-propagation so a tap doesn't also start a drag */}
              <button
                data-slot="bottom-sheet-close"
                onClick={onClose}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label="Close bottom sheet"
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border-card text-text-secondary hover:text-text-primary hover:border-cyan-500/50 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* ── Scrollable content ──────────────────────────────────────
             * onPointerDown stop-propagation prevents accidental sheet
             * dismissal while the user is scrolling the quote text.
             * touch-action:pan-y overrides the parent sheet's pan-x so
             * vertical scroll inside the body still works natively.       ── */}
            <div
              data-slot="bottom-sheet-body"
              onPointerDown={(e) => e.stopPropagation()}
              style={{ touchAction: "pan-y" }}
              className="max-h-[78dvh] overflow-y-auto overflow-x-hidden px-6 pt-3 pb-12"
            >
              {/* Content fades up after the sheet finishes arriving */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              >
                {CardContent}
              </motion.div>
            </div>
          </motion.div>
        </div>
      ) : (
        /* ── Desktop: modal rises with a subtle 3D flip ──────────────────
         * perspective on the container is required for rotateX to render
         * in 3D space. Entry: card tilts slightly back (rotateX:5) then
         * snaps forward to face the viewer. Exit is a clean shrink-fade —
         * no rotateX so the dismiss feels crisp rather than theatrical.   ── */
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            data-slot="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Full recommendation from ${rec.name}`}
            className="pointer-events-auto relative w-full max-w-lg bg-surface border border-border-card rounded-2xl p-8 shadow-2xl"
            style={{ transformOrigin: "50% 60%" }}
            initial={{ opacity: 0, scale: 0.9, y: 28, rotateX: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16,
                    transition: { type: "spring", stiffness: 500, damping: 42 } }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            {/* Top shimmer — sweeps in from left after modal settles */}
            <motion.div
              aria-hidden="true"
              className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-400/55 to-transparent origin-left"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Close button */}
            <button
              data-slot="modal-close"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-border-card text-text-secondary hover:text-text-primary hover:border-cyan-500/50 transition-colors"
            >
              <X size={15} />
            </button>

            {/* Content fades up after modal finishes arriving */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {CardContent}
            </motion.div>
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
          <Avatar name={rec.name} image={rec.image} />
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
  const [paused,    setPaused]    = useState(false);
  const [status,    setStatus]    = useState<FetchStatus>("loading");
  const [items,     setItems]     = useState<Recommendation[]>([]);
  const [retryKey,  setRetryKey]  = useState(0);
  const [activeRec, setActiveRec] = useState<Recommendation | null>(null);

  /* ── Fetch with timeout + cleanup on unmount ── */
  useEffect(() => {
    setStatus("loading");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    fetch("/api/recommendations", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(({ data }: { data: Recommendation[] }) => {
        clearTimeout(timer);
        // Supabase returned data → use it; empty array → fall back to hardcoded
        setItems(Array.isArray(data) && data.length > 0 ? data : HARDCODED_RECOMMENDATIONS);
        setStatus("success");
      })
      .catch((err: Error) => {
        clearTimeout(timer);
        // Ignore the abort we fire on unmount — that's not an error
        if (err.name === "AbortError" && !controller.signal.aborted) return;
        setStatus("error");
      });

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [retryKey]);

  const handleRetry = useCallback(() => {
    setRetryKey((k) => k + 1);
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

        {/* ── Content area — switches between skeleton / error / marquee ── */}
        <AnimatePresence mode="wait">

          {/* ── Loading: skeleton cards ── */}
          {status === "loading" && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SkeletonTrack />
            </motion.div>
          )}

          {/* ── Error: Supabase timed out or threw ── */}
          {status === "error" && (
            <ErrorState key="error" onRetry={handleRetry} />
          )}

          {/* ── Success: live marquee ── */}
          {status === "success" && (
            <motion.div
              key="marquee"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Hover wrapper — pauses marquee */}
              <div
                className="relative"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                {/* Edge fade masks */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 z-10 bg-gradient-to-r from-bg to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 z-10 bg-gradient-to-l from-bg to-transparent" />

                <div
                  data-slot="marquee-track"
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
                      onReadMore={() => {
                        setPaused(false);
                        setActiveRec(rec);
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Bottom fader — feathers the section edge into About Me below */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-20 bg-gradient-to-b from-transparent to-bg"
        />
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
