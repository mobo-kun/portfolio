"use client";

import { motion, type Variants } from "framer-motion";
import { Download } from "lucide-react";

/* ── Inline SVG decorations ─────────────────────────────── */

function AbstractEllipse() {
  return (
    <svg
      width="56"
      height="36"
      viewBox="0 0 56 36"
      fill="none"
      aria-hidden="true"
      className="inline-block align-middle mx-1"
    >
      <ellipse
        cx="28"
        cy="18"
        rx="27"
        ry="17"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-cyan-500"
        strokeDasharray="4 3"
      />
    </svg>
  );
}

function GeometricStar() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="inline-block align-middle mx-1"
    >
      <path
        d="M14 2 L15.8 11.2 L25 14 L15.8 16.8 L14 26 L12.2 16.8 L3 14 L12.2 11.2 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        className="text-cyan-400"
        fill="none"
      />
    </svg>
  );
}

function ProfilePlaceholder() {
  return (
    <span
      aria-label="Behdad profile photo"
      className="inline-block w-12 h-12 rounded-full bg-cyan-900 border border-cyan-500/50 align-middle mx-2 overflow-hidden"
    >
      {/* swap for <Image src="/profile.jpg" …> when ready */}
    </span>
  );
}

/* ── Social icon buttons ────────────────────────────────── */

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-card text-text-secondary hover:text-cyan-500 hover:border-cyan-500 transition-colors duration-200"
    >
      {children}
    </motion.a>
  );
}

/* Social SVG icons (self-contained, no extra dep) */
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const SubstackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
  </svg>
);
const TelegramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ── Stagger animation helpers ──────────────────────────── */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

/* ── Scroll indicator ───────────────────────────────────── */

function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 text-text-secondary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
        className="w-6 h-9 rounded-full border-2 border-current flex items-start justify-center p-1"
      >
        <div className="w-1 h-2 rounded-full bg-current" />
      </motion.div>
      <span className="text-xs font-roboto">Scroll for more</span>
    </motion.div>
  );
}

/* ── Component ──────────────────────────────────────────── */

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden px-6 py-20">
      {/* CSS background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(var(--page-border) 1px, transparent 1px), linear-gradient(90deg, var(--page-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.35,
        }}
      />

      {/* Blurred ambient circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-cyan-900 opacity-20 blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[5%] w-[400px] h-[400px] rounded-full bg-cyan-900 opacity-15 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-cyan-900 opacity-10 blur-[120px]" />
      </div>

      {/* Hero content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        {/* Name + role row */}
        <motion.h1
          variants={item}
          className="font-intel text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-tight mb-2"
        >
          Hi, I&apos;m{" "}
          <AbstractEllipse />
          <ProfilePlaceholder />
          <GeometricStar />
          {" "}Behdad
        </motion.h1>

        <motion.p
          variants={item}
          className="font-intel text-2xl sm:text-3xl md:text-4xl text-cyan-500 font-medium mb-6"
        >
          Product Design Lead
        </motion.p>

        <motion.p
          variants={item}
          className="font-roboto text-base sm:text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Crafting intentional digital products at the intersection of fintech,
          crypto, and behavioural design.
        </motion.p>

        {/* CTA row */}
        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3">
          {/* Download CV */}
          <CVButton />

          {/* Social icon buttons */}
          <SocialButton href="https://linkedin.com/in/behdad-mor" label="LinkedIn">
            <LinkedInIcon />
          </SocialButton>
          <SocialButton href="https://instagram.com/behdadxo" label="Instagram">
            <InstagramIcon />
          </SocialButton>
          <SocialButton href="https://substack.com/@behdad" label="Substack">
            <SubstackIcon />
          </SocialButton>
          <SocialButton href="https://t.me/behdad_m" label="Telegram">
            <TelegramIcon />
          </SocialButton>
          <SocialButton href="https://wa.me/989366090699" label="WhatsApp">
            <WhatsAppIcon />
          </SocialButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  );
}

/**
 * Toggle to `true` once `/public/cv.pdf` is dropped into the public folder.
 * When `false`, the button is rendered disabled with a "Coming soon" tooltip
 * per the asset fallback strategy in the PRD.
 */
const CV_PDF_AVAILABLE = true;

function CVButton() {
  if (!CV_PDF_AVAILABLE) {
    return (
      <motion.button
        type="button"
        disabled
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title="Coming soon"
        aria-label="Download CV — coming soon"
        className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-card bg-surface text-text-secondary font-roboto text-sm font-medium cursor-not-allowed opacity-80"
      >
        <Download size={15} />
        Download CV
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-1 rounded-md border border-border-card bg-surface text-[11px] font-roboto text-text-secondary whitespace-nowrap shadow-sm">
          Coming soon
        </span>
      </motion.button>
    );
  }

  return (
    <motion.a
      href="/cv.pdf"
      download="Behdad_Morsalpoor_CV.pdf"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-white font-roboto text-sm font-medium hover:bg-cyan-400 hover:shadow-cyan-glow transition-all duration-200"
    >
      <Download size={15} />
      Download CV
    </motion.a>
  );
}
