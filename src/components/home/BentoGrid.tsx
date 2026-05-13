"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import bentoConfig from "../../../data/bento-config.json";

type Card = {
  title: string;
  /** Optional preview image fetched from CMS (placeholder until Notion wired up). */
  image?: string;
};

function TiltCard({
  card,
  className = "",
  href,
}: {
  card: Card;
  className?: string;
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState<string>("");

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateY = ((x - cx) / cx) * 6;
    const rotateX = -((y - cy) / cy) * 6;
    setTransform(
      `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg)`
    );
  }

  function handleLeave() {
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg)");
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      style={{ transform, transition: "transform 300ms ease-out" }}
      className={`group relative block overflow-hidden rounded-xl border border-border-card bg-surface hover:border-cyan-500 transition-colors duration-300 will-change-transform ${className}`}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-bg">
        {card.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <PlaceholderArt title={card.title} />
        )}

        {/* Subtle cyan wash on hover */}
        <div className="pointer-events-none absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/[0.04] transition-colors duration-300" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="font-intel text-text-primary text-sm sm:text-base font-medium leading-snug pr-3">
          {card.title}
        </h3>
        <span className="text-text-secondary group-hover:text-cyan-500 transition-colors duration-200">
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

function PlaceholderArt({ title }: { title: string }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center relative"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--page-surface) 0%, var(--page-bg) 100%)",
      }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 30%, var(--color-cyan-900) 0%, transparent 55%), radial-gradient(circle at 75% 70%, var(--color-cyan-900) 0%, transparent 60%)",
          }}
        />
      </div>
      <span className="relative z-10 font-intel text-text-secondary text-xs sm:text-sm tracking-wide uppercase text-center px-6 max-w-[80%]">
        {title}
      </span>
    </div>
  );
}

export default function BentoGrid() {
  const titles = bentoConfig.featuredProjects ?? [];
  const cards: Card[] = titles.map((t: string) => ({ title: t }));

  return (
    <section className="relative px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 md:mb-12 flex items-end justify-between gap-4 flex-wrap"
        >
          <div>
            <p className="font-roboto text-xs tracking-[0.18em] uppercase text-cyan-500 mb-2">
              Featured Work
            </p>
            <h2 className="font-intel text-3xl md:text-4xl font-bold text-text-primary">
              Selected Case Studies
            </h2>
          </div>

          <Link
            href="/case-studies"
            className="font-roboto text-sm text-text-secondary hover:text-cyan-500 transition-colors duration-200 inline-flex items-center gap-1.5 group"
          >
            See all case studies
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>

        {/* Bento layout: first card spans 2 columns on md+, others one each */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-fr">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: "easeOut", delay: idx * 0.08 }}
              className={idx === 0 ? "md:col-span-2 md:row-span-1" : ""}
            >
              <TiltCard
                card={card}
                href={`/case-studies`}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
