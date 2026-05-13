"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import resumeData from "../../../data/resume.json";

function formatDate(dateStr: string): string {
  if (dateStr === "Present") return "Present";
  const [year, month] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/* Abstract illustration placeholder (left column) */
function AbstractIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center min-h-[200px]">
      <svg
        width="180"
        height="160"
        viewBox="0 0 180 160"
        fill="none"
        aria-hidden="true"
        className="opacity-60"
      >
        {/* Outer ring */}
        <circle cx="90" cy="80" r="70" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" className="text-cyan-500" />
        {/* Inner ring */}
        <circle cx="90" cy="80" r="45" stroke="currentColor" strokeWidth="1" className="text-cyan-900" />
        {/* Centre dot */}
        <circle cx="90" cy="80" r="8" fill="currentColor" className="text-cyan-500" opacity="0.4" />
        {/* Cross lines */}
        <line x1="20" y1="80" x2="160" y2="80" stroke="currentColor" strokeWidth="0.8" className="text-border-card" />
        <line x1="90" y1="10" x2="90" y2="150" stroke="currentColor" strokeWidth="0.8" className="text-border-card" />
        {/* Orbiting dot */}
        <circle cx="90" cy="35" r="5" fill="currentColor" className="text-cyan-400" />
      </svg>
    </div>
  );
}

export default function ExperienceSection() {
  const current = resumeData.experience[0];
  const { position, company, companyDescription, startDate, endDate, description } = current;

  return (
    <section className="px-6 md:px-10 py-20 border-t border-border-card">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left — abstract illustration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-xl border border-border-card bg-surface p-8"
        >
          <AbstractIllustration />
        </motion.div>

        {/* Right — role details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
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
