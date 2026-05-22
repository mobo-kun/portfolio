"use client";

/**
 * @file RecommendationsCarousel.tsx
 * @description Infinitely scrolling marquee carousel of recommendation cards.
 *
 * Key features:
 * - Auto-scrolling CSS marquee animation (avoids Framer Motion snap-to-0 on resume)
 * - Hover pauses the animation via animationPlayState
 * - Duplicate array so the loop is visually seamless
 * - Clicking name or avatar opens the person's LinkedIn in a new tab
 * - AvatarPlaceholder renders initials when no image is provided
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

type Recommendation = {
  name: string;
  role: string;
  quote: string;
  linkedIn: string;
  /** Optional image path inside /public */
  image?: string;
};

/**
 * Hardcoded recommendations array.
 * Each entry includes a LinkedIn URL used for the clickable name/avatar link.
 */
const RECOMMENDATIONS: Recommendation[] = [
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

/**
 * Circular avatar showing the person's initials when no photo is available.
 * @param props.name - Full name; first letter of each word is used as initials
 */
function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="w-11 h-11 rounded-full bg-cyan-900 border border-cyan-500/40 flex items-center justify-center font-intel font-bold text-white text-sm flex-shrink-0"
    >
      {initials}
    </span>
  );
}

/**
 * A single recommendation card.
 * Both the avatar and the person's name are wrapped in an anchor that opens
 * their LinkedIn profile in a new tab.
 *
 * @param props.rec - Recommendation data object
 */
function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <article className="flex-shrink-0 w-[320px] sm:w-[380px] bg-surface border border-border-card rounded-xl p-6 hover:border-cyan-500 transition-colors duration-300">
      <Quote
        size={18}
        className="text-cyan-500 mb-3"
        aria-hidden="true"
      />
      <p className="font-roboto text-sm md:text-[15px] text-text-primary/90 leading-relaxed mb-5 line-clamp-5">
        {rec.quote}
      </p>
      <div className="flex items-center gap-3">
        {/* Avatar link — opens LinkedIn in a new tab */}
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
          {/* Name link — opens LinkedIn in a new tab */}
          <a
            href={rec.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-intel text-sm font-bold text-text-primary hover:text-cyan-500 transition-colors duration-200 truncate"
          >
            {rec.name}
          </a>
          <p className="font-roboto text-xs text-text-secondary truncate">
            {rec.role}
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * Infinitely auto-scrolling carousel section.
 *
 * Animation approach: a CSS `@keyframes marquee` animation (defined in globals.css)
 * translates the track from 0 to -50% (since the array is duplicated, -50% brings
 * us back to an identical visual state, creating a seamless loop). Using CSS instead
 * of Framer Motion `animate={{ x: [...] }}` avoids the snap-back-to-0 bug that
 * occurs when the animation is paused and then resumed.
 */
export default function RecommendationsCarousel() {
  const [paused, setPaused] = useState(false);

  // Duplicate the array so the marquee loop is seamless (track is 2× width)
  const loop = [...RECOMMENDATIONS, ...RECOMMENDATIONS];

  return (
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

      {/* Marquee track — pause on hover via animationPlayState */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Edge fade masks — hide the hard edges of the scrolling track */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 z-10 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 z-10 bg-gradient-to-l from-bg to-transparent" />

        {/* CSS animation instead of Framer Motion — avoids snap-to-0 on resume */}
        <div
          className="flex gap-5 w-max"
          style={{
            animation: "marquee 40s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {loop.map((rec, i) => (
            <RecommendationCard key={`${rec.name}-${i}`} rec={rec} />
          ))}
        </div>
      </div>
    </section>
  );
}
