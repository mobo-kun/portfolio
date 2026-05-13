"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* LinkedIn & WhatsApp mini SVG icons */
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

function PhotoPlaceholder() {
  return (
    <div className="w-full aspect-square max-w-xs mx-auto rounded-xl border border-border-card bg-surface flex items-center justify-center overflow-hidden">
      {/* replace with <Image src="/profile.jpg" fill alt="Behdad"> when ready */}
      <div className="w-24 h-24 rounded-full bg-cyan-900/60 border border-cyan-500/40" />
    </div>
  );
}

export default function AboutSection() {
  return (
    <section className="px-6 md:px-10 py-20 border-t border-border-card">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <PhotoPlaceholder />
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="font-roboto text-xs text-cyan-500 uppercase tracking-widest mb-3">
            About Me
          </p>
          <h2 className="font-intel text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Design with intention.
          </h2>
          <p className="font-roboto text-sm text-text-secondary leading-relaxed mb-8">
            I&apos;m Behdad Morsalpoor — a Senior Product Design Lead with 12+ years
            scaling Fintech platforms used by 11M+ people. My work sits at the
            intersection of HCI, Cognitive Science, and product strategy: I turn
            complex financial flows into precise, high-fidelity experiences that
            move OKRs. I&apos;m currently based in Tehran and relocating to
            Barcelona in October 2026.
          </p>

          <div className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-white font-roboto text-sm font-medium hover:bg-cyan-400 transition-colors duration-200"
              >
                Contact Me
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <a
                href="https://linkedin.com/in/behdad-mor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-card bg-surface text-text-primary font-roboto text-sm hover:border-cyan-500 hover:text-cyan-500 transition-colors duration-200"
              >
                <LinkedInIcon />
                LinkedIn
              </a>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <a
                href="https://wa.me/989366090699"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-card bg-surface text-text-primary font-roboto text-sm hover:border-cyan-500 hover:text-cyan-500 transition-colors duration-200"
              >
                <WhatsAppIcon />
                WhatsApp
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
