"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  type Variants,
} from "framer-motion";
import { Download } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Floating tool icon
   Loads from /tool-icons/<label>.svg — drop files there to replace.
   Falls back to a coloured initial badge if the file is missing.
───────────────────────────────────────────────────────────── */

function ToolIcon({ label, floatDelay, floatDir }: { label: string; floatDelay: number; floatDir: 1 | -1 }) {
  const [errored, setErrored] = useState(false);
  const src = `/tool-icons/${label.toLowerCase()}.svg`;

  return (
    <motion.div
      aria-label={label}
      title={label}
      className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md border border-white/60 p-5"
      animate={{ y: [0, floatDir * 8, 0] }}
      transition={{ duration: 3.2 + floatDelay * 0.5, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
    >
      {!errored ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={label}
          className="w-full h-full object-contain"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="font-intel font-bold text-xs text-gray-500 select-none">
          {label.slice(0, 2).toUpperCase()}
        </span>
      )}
    </motion.div>
  );
}

const TOOLS = [
  { label: "Figma",   angle: -90,  floatDelay: 0,   floatDir:  1 as const },
  { label: "Cursor",  angle: -30,  floatDelay: 0.5, floatDir: -1 as const },
  { label: "Claude",  angle:  30,  floatDelay: 1.0, floatDir:  1 as const },
  { label: "Grok",    angle:  90,  floatDelay: 1.5, floatDir: -1 as const },
  { label: "Gemini",  angle:  150, floatDelay: 2.0, floatDir:  1 as const },
  { label: "Podcast", angle:  210, floatDelay: 2.5, floatDir: -1 as const },
];

/* ─────────────────────────────────────────────────────────────
   Profile orb — responsive 220 / 180 px with shiny border
───────────────────────────────────────────────────────────── */

function ProfileOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoveredRef   = useRef(false);
  const frameRef     = useRef<number>(0);
  const currentAngle = useRef(0);

  /* responsive dimensions */
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const imgSize     = mobile ? 180  : 220;
  const wrapperSize = mobile ? 340  : 400;
  const orbitRadius = mobile ? 130  : 160;
  const center      = wrapperSize / 2;

  /* shiny rotating border */
  const rawAngle = useMotionValue(0);
  const angle    = useSpring(rawAngle, { stiffness: 40, damping: 16 });
  const gradient = useMotionTemplate`conic-gradient(from ${angle}deg, transparent 0%, #00B8D4 16%, rgba(255,255,255,0.65) 28%, transparent 46%, #0097A7 70%, transparent 100%)`;

  /* slow auto-rotation */
  useEffect(() => {
    const tick = () => {
      if (!hoveredRef.current) {
        currentAngle.current += 0.2;
        rawAngle.set(currentAngle.current);
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [rawAngle]);

  /* mouse-tracking on hover */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const a  = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90;
      currentAngle.current = a;
      rawAngle.set(a);
    },
    [rawAngle]
  );

  return (
    <div
      className="relative mx-auto"
      style={{ width: wrapperSize, height: wrapperSize }}
    >
      {/* floating tool icons */}
      {TOOLS.map(({ label, angle: a, floatDelay, floatDir }) => {
        const rad  = (a * Math.PI) / 180;
        const left = center + Math.cos(rad) * orbitRadius - 32; // 32 = half of 64px icon
        const top  = center + Math.sin(rad) * orbitRadius - 32;
        return (
          <div key={label} className="absolute" style={{ left, top }}>
            <ToolIcon label={label} floatDelay={floatDelay} floatDir={floatDir} />
          </div>
        );
      })}

      {/* profile image + border */}
      <div
        ref={containerRef}
        className="absolute cursor-crosshair"
        style={{
          width:  imgSize,
          height: imgSize,
          left:   center - imgSize / 2,
          top:    center - imgSize / 2,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => { hoveredRef.current = true;  }}
        onMouseLeave={() => { hoveredRef.current = false; }}
      >
        {/* low-contrast outer glow ring */}
        <div
          aria-hidden="true"
          className="absolute rounded-full border border-cyan-500/25 pointer-events-none"
          style={{ inset: -5 }}
        />

        {/* rotating conic-gradient border */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ background: gradient, padding: "2.5px" }}
        />

        {/* photo */}
        <div className="absolute rounded-full overflow-hidden bg-cyan-900" style={{ inset: 3 }}>
          <Image
            src="/profile.webp"
            alt="Behdad Morsalpoor"
            fill
            sizes={`${imgSize}px`}
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Social icon buttons
───────────────────────────────────────────────────────────── */

function SocialButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-card text-text-secondary hover:text-cyan-500 hover:border-cyan-500 transition-colors duration-200"
    >
      {children}
    </motion.a>
  );
}

const LinkedInIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;
const InstagramIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const SubstackIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>;
const TelegramIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/></svg>;
const WhatsAppIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;

/* ─────────────────────────────────────────────────────────────
   Animated background blob
───────────────────────────────────────────────────────────── */

function AnimatedBlob({
  color, size, x, y, duration, delay = 0, opacity,
}: {
  color: string; size: number; x: string; y: string;
  duration: number; delay?: number; opacity: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        left: x, top: y,
        backgroundColor: color,
        filter: "blur(100px)",
        opacity,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{ x: [0, 60, -45, 30, 0], y: [0, -50, 40, -25, 0], scale: [1, 1.12, 0.91, 1.08, 1] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Scroll indicator
───────────────────────────────────────────────────────────── */

function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 text-text-secondary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.6 }}
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

/* ─────────────────────────────────────────────────────────────
   Stagger variants
───────────────────────────────────────────────────────────── */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

/* ─────────────────────────────────────────────────────────────
   CV Button
───────────────────────────────────────────────────────────── */

function CVButton() {
  return (
    <motion.a
      href="/cv.pdf"
      download="Behdad_Morsalpoor_CV.pdf"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-white font-roboto text-sm font-medium hover:bg-cyan-400 hover:shadow-cyan-glow transition-all duration-200"
    >
      <Download size={15} />
      Download CV
    </motion.a>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hero Section
───────────────────────────────────────────────────────────── */

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden px-6 py-20">

      {/* CSS grid lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--page-border) 1px, transparent 1px), linear-gradient(90deg, var(--page-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.3,
        }}
      />

      {/* Animated background blobs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dark teal — top-left */}
        <AnimatedBlob color="#00333A" size={600} x="0%"  y="0%"   duration={14} opacity={0.55} />
        {/* Light cyan — bottom-right */}
        <AnimatedBlob color="#00B8D4" size={480} x="95%" y="90%"  duration={16} delay={3} opacity={0.38} />
        {/* Mid teal — centre */}
        <AnimatedBlob color="#0097A7" size={350} x="55%" y="50%"  duration={11} delay={6} opacity={0.28} />
      </div>

      {/* Main content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center"
      >
        {/* Profile orb */}
        <motion.div variants={item} className="mb-6">
          <ProfileOrb />
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="font-intel text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary leading-tight mb-2"
        >
          Hi, I&apos;m Behdad
        </motion.h1>

        {/* Role */}
        <motion.p
          variants={item}
          className="font-intel text-2xl sm:text-3xl md:text-4xl text-cyan-500 font-medium mb-5"
        >
          Senior Product Design Lead
        </motion.p>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="font-roboto text-base sm:text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Crafting intentional digital products at the intersection of fintech,
          crypto, and behavioural design.
        </motion.p>

        {/* CTA — mobile: CV full-width, icons below; desktop: one row */}
        <motion.div
          variants={item}
          className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <CVButton />
          <div className="flex items-center justify-center gap-3">
            <SocialButton href="https://linkedin.com/in/behdad-mor" label="LinkedIn">   <LinkedInIcon />  </SocialButton>
            <SocialButton href="https://instagram.com/behdadxo"     label="Instagram">  <InstagramIcon /> </SocialButton>
            <SocialButton href="https://substack.com/@behdad"       label="Substack">   <SubstackIcon />  </SocialButton>
            <SocialButton href="https://t.me/behdad_m"              label="Telegram">   <TelegramIcon />  </SocialButton>
            <SocialButton href="https://wa.me/989366090699"          label="WhatsApp">   <WhatsAppIcon />  </SocialButton>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  );
}
