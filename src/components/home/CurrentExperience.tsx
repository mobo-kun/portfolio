"use client";

/**
 * @file CurrentExperience.tsx
 * @description Current role section — skill carousel + role details.
 *
 * Carousel v6:
 * - Taller cards (300 px) and bigger viewport (400 px)
 * - More visible peek cards: 50 px peek, 18 px fade mask → ~32 px clearly visible
 * - Drag/swipe to change card: mouse grab + touch, velocity-aware snap
 * - Circular queue with clone-snap
 * - Section-wide mouse-following glow
 */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  type PanInfo,
} from "framer-motion";
import resumeData from "../../../data/resume.json";

/* ─── Date helper ────────────────────────────────────────────── */

function formatDate(dateStr: string): string {
  if (dateStr === "Present") return "Present";
  const [year, month] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/* ─── Icons ──────────────────────────────────────────────────── */

function IconDesignSystems() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="28" y="2" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="2" y="28" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="28" y="28" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="24" y1="11" x2="28" y2="11" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="24" y1="37" x2="28" y2="37" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="11" y1="20" x2="11" y2="28" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="37" y1="20" x2="37" y2="28" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}
function IconInteractionDesign() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M8 5L8 30L16 24L19 35L23 33L20 22L30 22L8 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="36" cy="36" r="8" stroke="currentColor" strokeWidth="1.6" strokeDasharray="4 2.5"/>
      <circle cx="36" cy="36" r="2.5" fill="currentColor"/>
    </svg>
  );
}
function IconBehavioralResearch() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M24 8C18 8 13 13 13 19C13 22 14 24 12 27C9 30 9 35 13 37C13 40 16 43 19 43H29C32 43 35 40 35 37C39 35 39 30 36 27C34 24 35 22 35 19C35 13 30 8 24 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <line x1="24" y1="8" x2="24" y2="43" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4"/>
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.7"/>
      <line x1="17" y1="19" x2="21" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
      <line x1="31" y1="19" x2="27" y2="24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}
function IconProductStrategy() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 3"/>
      <circle cx="24" cy="24" r="3.5" fill="currentColor"/>
      <line x1="24" y1="4" x2="24" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="24" y1="38" x2="24" y2="44" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="4" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="38" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function IconUXResearch() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="21" cy="21" r="14" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="31" y1="31" x2="43" y2="43" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="13" y1="21" x2="29" y2="21" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2"/>
      <line x1="21" y1="13" x2="21" y2="29" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2"/>
      <circle cx="21" cy="21" r="5" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}
function IconDesignLeadership() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="24" cy="13" r="7" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M10 40C10 32 16 27 24 27C32 27 38 32 38 40" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="9" cy="18" r="5" stroke="currentColor" strokeWidth="1.4" opacity="0.65"/>
      <circle cx="39" cy="18" r="5" stroke="currentColor" strokeWidth="1.4" opacity="0.65"/>
      <path d="M2 40C2 35 5 32 9 32" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.65"/>
      <path d="M46 40C46 35 43 32 39 32" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.65"/>
    </svg>
  );
}
function IconFintechDeFi() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" aria-hidden>
      <line x1="8"  y1="8" x2="8"  y2="42" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.3"/>
      <line x1="20" y1="8" x2="20" y2="42" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.3"/>
      <line x1="32" y1="8" x2="32" y2="42" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.3"/>
      <line x1="44" y1="8" x2="44" y2="42" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.3"/>
      <rect x="4"  y="28" width="8" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="16" y="20" width="8" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="28" y="12" width="8" height="30" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <polyline points="6,26 18,18 30,10 42,5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
      <polyline points="36,5 42,5 42,11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
    </svg>
  );
}

/* ─── Geo patterns ───────────────────────────────────────────── */

function GeoGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="gg" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth="0.8"/></pattern></defs>
      <rect width="100%" height="100%" fill="url(#gg)"/>
    </svg>
  );
}
function GeoDiagonals() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="gd" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse"><line x1="0" y1="36" x2="36" y2="0" stroke="currentColor" strokeWidth="0.8"/></pattern></defs>
      <rect width="100%" height="100%" fill="url(#gd)"/>
    </svg>
  );
}
function GeoDots() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.09]" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="gdots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="currentColor"/></pattern></defs>
      <rect width="100%" height="100%" fill="url(#gdots)"/>
    </svg>
  );
}
function GeoHex() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="ghex" x="0" y="0" width="44" height="50" patternUnits="userSpaceOnUse"><polygon points="22,2 42,13 42,37 22,48 2,37 2,13" fill="none" stroke="currentColor" strokeWidth="0.8"/></pattern></defs>
      <rect width="100%" height="100%" fill="url(#ghex)"/>
    </svg>
  );
}
function GeoCircuits() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="gcirc" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse">
        <line x1="0" y1="26" x2="18" y2="26" stroke="currentColor" strokeWidth="0.8"/>
        <circle cx="18" cy="26" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="20.5" y1="26" x2="34" y2="26" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="34" y1="26" x2="34" y2="40" stroke="currentColor" strokeWidth="0.8"/>
        <circle cx="34" cy="40" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="26" y1="0" x2="26" y2="18" stroke="currentColor" strokeWidth="0.8"/>
        <circle cx="26" cy="18" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8"/>
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#gcirc)"/>
    </svg>
  );
}
function GeoRings() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="grings" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
        <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="5 4"/>
        <circle cx="28" cy="28" r="11" fill="none" stroke="currentColor" strokeWidth="0.8"/>
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#grings)"/>
    </svg>
  );
}
function GeoWave() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs><pattern id="gwave" x="0" y="0" width="64" height="32" patternUnits="userSpaceOnUse">
        <path d="M0 16 Q16 2 32 16 Q48 30 64 16" fill="none" stroke="currentColor" strokeWidth="0.8"/>
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#gwave)"/>
    </svg>
  );
}

/* ─── Skill data ─────────────────────────────────────────────── */

const SKILLS = [
  { name: "Design Systems",      sub: "Scalable component libraries",   Icon: IconDesignSystems,      Geo: GeoGrid      },
  { name: "Interaction Design",  sub: "Flows & micro-interactions",      Icon: IconInteractionDesign,  Geo: GeoDiagonals },
  { name: "Behavioral Research", sub: "HCI & cognitive psychology",      Icon: IconBehavioralResearch, Geo: GeoDots      },
  { name: "Product Strategy",    sub: "OKR alignment & roadmap vision",  Icon: IconProductStrategy,    Geo: GeoRings     },
  { name: "UX Research",         sub: "Usability testing & heuristics",  Icon: IconUXResearch,         Geo: GeoCircuits  },
  { name: "Design Leadership",   sub: "Cross-functional team lead",      Icon: IconDesignLeadership,   Geo: GeoHex       },
  { name: "Fintech & DeFi",      sub: "Domain expertise · 11M+ users",  Icon: IconFintechDeFi,        Geo: GeoWave      },
] as const;

/**
 * EXTENDED: 2 clones before + 7 real + 2 clones after = 11 cards.
 *
 *  pos 0  clone-06   ←── peek-above clone-07 matches real-06
 *  pos 1  clone-07   ←── animate here when going backward past 01
 *  pos 2  real-01    ←── starting position (FIRST_REAL)
 *  pos 3  real-02
 *  …
 *  pos 8  real-07    ←── last real card (LAST_REAL)
 *  pos 9  clone-01   ←── animate here when going forward past 07
 *  pos 10 clone-02   ←── peek-below clone-01 matches real-02
 *
 * Snap logic (triggered ~430 ms after spring settles):
 *   pos 1 (clone-07) → snap to pos 8 (real-07)  — peek neighbours are identical
 *   pos 9 (clone-01) → snap to pos 2 (real-01)  — peek neighbours are identical
 */
const REAL_COUNT = SKILLS.length; // 7
const EXTENDED = [
  SKILLS[REAL_COUNT - 2], // pos 0  — clone-06
  SKILLS[REAL_COUNT - 1], // pos 1  — clone-07
  ...SKILLS,              // pos 2–8 — real 01–07
  SKILLS[0],              // pos 9  — clone-01
  SKILLS[1],              // pos 10 — clone-02
] as typeof SKILLS[number][];

const FIRST_REAL = 2;                       // real-01 starts here
const LAST_REAL  = FIRST_REAL + REAL_COUNT - 1; // = 8, real-07

/* ─── Layout constants ───────────────────────────────────────── */

const CARD_H  = 300;  // px — card height (bigger than before)
const GAP     = 14;   // px — gap between cards
const PEEK    = 50;   // px — total peek region each side
const FADE_H  = 18;   // px — gradient fade; (PEEK − FADE_H = 32 px ≈ 10.7 %) visible
const CONT_H  = CARD_H + PEEK * 2; // 400 px

/* velocity threshold (px/s) and distance threshold (px) for a swipe */
const VEL_T  = 350;
const DIST_T = CARD_H * 0.22; // ≈ 66 px

/* ─── SkillCarousel ──────────────────────────────────────────── */

function SkillCarousel() {
  // Index starts at FIRST_REAL (1) — real card 01/07 centered
  const [index, setIndex]       = useState(FIRST_REAL);
  const [snap, setSnap]         = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [tilt, setTilt]         = useState({ rx: 0, ry: 0 });
  const [hovering, setHovering] = useState(false);

  const tiltRef    = useRef<HTMLDivElement>(null);
  const panStartY  = useRef(0);               // listYMV value at pan-start

  /** Single MotionValue — initialised at position 1 (real card 01) */
  const listYMV = useMotionValue(PEEK - FIRST_REAL * (CARD_H + GAP));

  /* ── Animate list + invisible circular wrap ─────────────────────────────
   *
   *  Cylinder model: cards always travel in ONE direction (forward = down).
   *  After real-07 (pos 8) the list springs to clone-01 (pos 9) — which looks
   *  identical to real-01 (pos 2). As soon as the spring SETTLES we teleport
   *  from pos 9 → pos 2 with a zero-duration set(). No frame is ever drawn
   *  mid-jump so the wrap is completely invisible.
   *
   *  Same logic in reverse: before real-01 (pos 2) sits clone-07 (pos 1).
   *  Spring settles there → teleport to real-07 (pos 8). ✓
   * ── */
  useEffect(() => {
    const target = PEEK - index * (CARD_H + GAP);

    // Instant teleport during the invisible wrap — no animation, just set.
    if (snap) {
      listYMV.set(target);
      return;
    }

    const forwardClone  = LAST_REAL + 1;   // pos 9 — clone-01
    const backwardClone = FIRST_REAL - 1;  // pos 1 — clone-07
    const needsWrap = index === forwardClone || index === backwardClone;

    // Spring to the clone position first (looks natural — cylinder keeps moving).
    const controls = animate(listYMV, target, {
      type: "spring",
      stiffness: 300,
      damping: 34,
    });

    if (needsWrap) {
      // After the spring fully settles, do the invisible teleport to the real card.
      let cancelled = false;
      void controls.then(() => {
        if (cancelled) return;
        const snapTo = index === forwardClone ? FIRST_REAL : LAST_REAL;
        setSnap(true);
        setIndex(snapTo);
        // One RAF pair: snap=true renders the set(), second RAF clears snap flag.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setSnap(false))
        );
      });
      return () => {
        cancelled = true;
        controls.stop();
      };
    }

    return () => controls.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, snap]);

  /* ── Auto-advance every 5 s (capped at clone-01 so snap can reset it) ── */
  useEffect(() => {
    const id = setInterval(() => setIndex(i => Math.min(i + 1, LAST_REAL + 1)), 5000);
    return () => clearInterval(id);
  }, []);

  /* ── Drag / swipe handlers (mouse + touch via Framer pan events) ── */
  const handlePanStart = (_e: PointerEvent, _info: PanInfo) => {
    setIsDragging(true);
    setTilt({ rx: 0, ry: 0 });
    panStartY.current = listYMV.get();
  };

  const handlePan = (_e: PointerEvent, info: PanInfo) => {
    const rawY = panStartY.current + info.offset.y;
    // Soft elastic resistance only beyond the clone cards (truly unreachable territory)
    const topCap    = PEEK - 0 * (CARD_H + GAP) + (CARD_H + GAP) * 0.6;
    const bottomCap = PEEK - (EXTENDED.length - 1) * (CARD_H + GAP) - (CARD_H + GAP) * 0.6;
    let y = rawY;
    if (rawY > topCap)    y = topCap    + (rawY - topCap)    * 0.15;
    if (rawY < bottomCap) y = bottomCap + (rawY - bottomCap) * 0.15;
    listYMV.set(y);
  };

  const handlePanEnd = (_e: PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const ofs = info.offset.y;
    const vel = info.velocity.y; // px/s

    // Dragged up (negative Y) → advance to next; dragged down → go to prev
    if (ofs < -DIST_T || vel < -VEL_T) {
      // Allow going as far as clone-01 at pos LAST_REAL+1 (=9); snap back to real-01 after
      setIndex(i => Math.min(i + 1, LAST_REAL + 1));
    } else if (ofs > DIST_T || vel > VEL_T) {
      // Allow going as far as clone-07 at pos FIRST_REAL-1 (=1); snap back to real-07 after
      setIndex(i => Math.max(i - 1, FIRST_REAL - 1));
    } else {
      // Not far/fast enough — snap back to current card
      const target = PEEK - index * (CARD_H + GAP);
      animate(listYMV, target, { type: "spring", stiffness: 400, damping: 40 });
    }
  };

  /* ── 3-D tilt on hover (disabled while dragging) ── */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = tiltRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width  - 0.5;
    const ny = (e.clientY - rect.top)  / rect.height - 0.5;
    setTilt({ rx: ny * -10, ry: nx * 10 });
  };

  // Map extended position → 0-based skill index (works for clones too)
  // pos 0 (clone-06) → 5, pos 1 (clone-07) → 6, pos 2 (real-01) → 0 … pos 8 (real-07) → 6
  // pos 9 (clone-01) → 0, pos 10 (clone-02) → 1
  const displayIdx = (index - FIRST_REAL + REAL_COUNT * 100) % REAL_COUNT;

  return (
    <div className="relative w-full select-none">
      <div style={{ perspective: "800px" }}>
        <motion.div
          ref={tiltRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => { setHovering(false); setTilt({ rx: 0, ry: 0 }); }}
          animate={{
            rotateX: (hovering && !isDragging) ? tilt.rx : 0,
            rotateY: (hovering && !isDragging) ? tilt.ry : 0,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative z-10 w-full"
        >
          {/* ── Viewport clip ── */}
          <motion.div
            className="relative overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing"
            style={{
              height: CONT_H,
              touchAction: "none",   // prevent browser scroll interfering with touch drag
            }}
            onPanStart={handlePanStart}
            onPan={handlePan}
            onPanEnd={handlePanEnd}
          >
            {/* Fade masks — outer FADE_H hidden; inner ~32 px clearly visible */}
            <div
              className="absolute top-0 left-0 right-0 z-20 pointer-events-none bg-gradient-to-b from-background to-transparent"
              style={{ height: FADE_H }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none bg-gradient-to-t from-background to-transparent"
              style={{ height: FADE_H }}
            />

            {/* ── Sliding list — driven by MotionValue, no animate prop ── */}
            <motion.div
              style={{ y: listYMV, gap: `${GAP}px` }}
              className="absolute left-0 right-0 flex flex-col"
            >
              {EXTENDED.map((skill, i) => {
                const active = i === index;
                const { Icon, Geo } = skill;
                return (
                  <div
                    key={`${skill.name}-${i}`}
                    style={{ height: CARD_H, flexShrink: 0 }}
                    className={[
                      "relative rounded-2xl border overflow-hidden transition-all duration-500",
                      active
                        ? "border-cyan-500/40 bg-gradient-to-br from-cyan-500/8 to-transparent"
                        : "border-cyan-500/20 opacity-65",
                    ].join(" ")}
                  >
                    {/* Geo background */}
                    <div className="absolute inset-0 text-cyan-500 pointer-events-none">
                      <Geo />
                    </div>
                    {/* Active corner glow */}
                    {active && (
                      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
                    )}
                    {/* Top shimmer */}
                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center gap-3 h-full text-center px-8">
                      <div className={[
                        "shrink-0 text-cyan-400 transition-all duration-500",
                        active
                          ? "w-12 h-12 lg:w-16 lg:h-16 drop-shadow-[0_0_18px_rgba(0,184,212,0.9)]"
                          : "w-8 h-8 opacity-20",
                      ].join(" ")}>
                        <Icon />
                      </div>

                      {active && (
                        <span className="font-roboto text-[10px] text-cyan-500/50 uppercase tracking-[0.22em]">
                          {String(displayIdx + 1).padStart(2, "0")} / {String(REAL_COUNT).padStart(2, "0")}
                        </span>
                      )}

                      <p className={[
                        "font-intel font-bold leading-tight transition-all duration-500",
                        active ? "text-xl lg:text-2xl text-text-primary" : "text-sm text-text-secondary/30",
                      ].join(" ")}>
                        {skill.name}
                      </p>

                      {active && (
                        <p className="font-roboto text-xs text-text-secondary/65 tracking-wide max-w-[190px]">
                          {skill.sub}
                        </p>
                      )}
                    </div>

                    {/* Bottom accent */}
                    {active && (
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    )}
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main section ───────────────────────────────────────────── */

export default function ExperienceSection() {
  const current = resumeData.experience[0];
  const { position, company, companyDescription, startDate, endDate, description } = current;

  /* Section-wide mouse glow */
  const sectionRef = useRef<HTMLElement>(null);
  const rawX  = useMotionValue(0.5);
  const rawY  = useMotionValue(0.5);
  const sX    = useSpring(rawX, { stiffness: 70, damping: 18 });
  const sY    = useSpring(rawY, { stiffness: 70, damping: 18 });

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width);
    rawY.set((e.clientY - rect.top)  / rect.height);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      className="px-6 md:px-10 py-20 border-t border-border-card overflow-visible relative"
    >
      {/* ── Section-spanning glow — follows cursor across carousel AND text ── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute rounded-full bg-cyan-400/[0.07] blur-[120px]"
        style={{
          width: 640,
          height: 420,
          x: useTransform(sX, [0, 1], [-320, 320]),
          y: useTransform(sY, [0, 1], [-210, 210]),
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

        {/* Left — carousel (5 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5"
        >
          <SkillCarousel />
        </motion.div>

        {/* Right — role details (7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <p className="font-roboto text-xs text-cyan-500 uppercase tracking-widest mb-3">
            Current Role
          </p>
          <h2 className="font-intel text-2xl md:text-3xl font-bold text-text-primary mb-1">
            {position}
          </h2>
          <p className="font-roboto text-lg text-text-secondary mb-0.5">{company}</p>
          {companyDescription && (
            <p className="font-roboto text-xs text-text-secondary/70 mb-1">{companyDescription}</p>
          )}
          <p className="font-roboto text-sm text-text-secondary mb-6">
            {formatDate(startDate)} – {formatDate(endDate)}
          </p>

          <ul className="space-y-3 mb-8">
            {description.slice(0, 2).map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                <span className="font-roboto text-sm text-text-secondary leading-relaxed">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/cv"
            className="font-roboto text-sm text-cyan-500 hover:text-cyan-400 transition-colors duration-200"
          >
            View Full CV →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
