"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

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

interface NetNode {
  x: number;
  y: number;
}

// Each light travels node-to-node so it roams the full network
interface NetLight {
  fromNode: number;
  toNode: number;
  t: number;    // 0→1 progress along current edge
  speed: number;
}

function CyberpunkNet({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;

    // TypeScript ≥ 4.4 doesn't propagate null-narrowing into nested function
    // declarations. Typed aliases guarantee non-null in setup() / draw() bodies.
    const cvs = canvas     as HTMLCanvasElement;
    const ctr = container  as HTMLElement;
    const ctx = ctxRaw     as CanvasRenderingContext2D;

    const SPACING = 68;
    const JITTER = 10;
    const GLOW_RADIUS = 160;
    const LIGHT_COUNT = 24;

    let W = 0;
    let H = 0;
    let nodes: NetNode[] = [];
    let edges: [number, number][] = [];
    // adjacency[nodeIdx] = array of neighbour nodeIdxs
    let adjacency: number[][] = [];
    let lights: NetLight[] = [];
    // targetMouse  — raw pointer / touch position (jumps instantly)
    // activeMouse  — lerped position (lags slightly behind finger)
    // glowAlpha    — 0..1 intensity; lerps IN fast, OUT slow (micro-release feel)
    let targetMouse = { x: -9999, y: -9999 };
    let activeMouse = { x: -9999, y: -9999 };
    let glowAlpha   = 0;
    let targetGlow  = 0;
    const LERP_POS  = 0.10;   // position tracking speed
    const LERP_IN   = 0.07;   // glow appear — slight delay
    const LERP_OUT  = 0.032;  // glow release — dreamy fade-out
    let raf = 0;
    let gridCols = 0;

    function setup() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = ctr.offsetWidth;
      H = ctr.offsetHeight;
      cvs.width = W * dpr;
      cvs.height = H * dpr;
      cvs.style.width = W + "px";
      cvs.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = [];
      edges = [];

      const numCols = Math.ceil(W / SPACING) + 1;
      const numRows = Math.ceil(H / SPACING) + 1;
      gridCols = numCols + 1;

      for (let r = 0; r <= numRows; r++) {
        for (let c = 0; c <= numCols; c++) {
          nodes.push({
            x: c * SPACING + (Math.random() - 0.5) * JITTER,
            y: r * SPACING + (Math.random() - 0.5) * JITTER,
          });
        }
      }

      adjacency = nodes.map(() => []);

      const addEdge = (a: number, b: number) => {
        if (a >= nodes.length || b >= nodes.length) return;
        edges.push([a, b]);
        adjacency[a].push(b);
        adjacency[b].push(a);
      };

      nodes.forEach((_, i) => {
        const c = i % gridCols;
        const r = Math.floor(i / gridCols);
        if (c < numCols) addEdge(i, i + 1);               // right
        if (r < numRows) addEdge(i, i + gridCols);        // down
        if (c < numCols && r < numRows)                   // diagonal ↘
          addEdge(i, i + gridCols + 1);
      });

      lights = Array.from({ length: LIGHT_COUNT }, () => spawnLight());
    }

    function spawnLight(): NetLight {
      const idx = Math.floor(Math.random() * Math.max(1, edges.length));
      const [a, b] = edges[idx] ?? [0, 0];
      return {
        fromNode: a,
        toNode: b,
        t: Math.random(),
        speed: 0.001 + Math.random() * 0.0022,
      };
    }

    function advanceLight(lt: NetLight) {
      lt.t += lt.speed;
      if (lt.t < 1) return;
      // Reached destination — pick a connected edge from toNode
      const neighbours = adjacency[lt.toNode];
      if (!neighbours || neighbours.length === 0) {
        Object.assign(lt, spawnLight());
        return;
      }
      const next = neighbours[Math.floor(Math.random() * neighbours.length)];
      lt.fromNode = lt.toNode;
      lt.toNode = next;
      lt.t = 0;
    }

    function draw() {
      // ── Lerp position & glow alpha each frame ────────────────────────
      if (targetMouse.x > -100) {
        // Snap activeMouse on first contact so glow doesn't fly in from off-screen
        if (activeMouse.x < -100) activeMouse = { ...targetMouse };
        else {
          activeMouse.x += (targetMouse.x - activeMouse.x) * LERP_POS;
          activeMouse.y += (targetMouse.y - activeMouse.y) * LERP_POS;
        }
      }
      // Glow fades in with a touch of delay, fades out slower (dreamy release)
      glowAlpha += (targetGlow - glowAlpha) *
        (targetGlow > glowAlpha ? LERP_IN : LERP_OUT);
      // ─────────────────────────────────────────────────────────────────

      ctx.clearRect(0, 0, W, H);

      const isDark = document.documentElement.classList.contains("dark");
      // Light-mode: use cyan-600 (8,145,178) — more visible on white
      const cr = isDark ? 0   : 8;
      const cg = isDark ? 220 : 145;
      const cb = isDark ? 255 : 178;

      // Edges — higher base alpha in light mode for visibility
      const edgeBase    = isDark ? 0.09 : 0.14;
      const edgeGlowMax = isDark ? 0.52 : 0.50;
      // Nodes
      const nodeBase    = isDark ? 0.16 : 0.20;
      const nodeGlowMax = isDark ? 0.80 : 0.72;
      // Moving dots — intentionally lower contrast than the net
      const dotGlow     = isDark ? 0.38 : 0.32;
      const dotCore     = isDark ? 0.55 : 0.50;

      // Draw edges
      edges.forEach(([a, b]) => {
        if (a >= nodes.length || b >= nodes.length) return;
        const na = nodes[a];
        const nb = nodes[b];
        const mx = (na.x + nb.x) / 2;
        const my = (na.y + nb.y) / 2;
        const d = Math.hypot(mx - activeMouse.x, my - activeMouse.y);
        const g = Math.max(0, (1 - d / GLOW_RADIUS) * glowAlpha);
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${edgeBase + g * (edgeGlowMax - edgeBase)})`;
        ctx.lineWidth = 0.4 + g * 0.9;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((n) => {
        const d = Math.hypot(n.x - activeMouse.x, n.y - activeMouse.y);
        const g = Math.max(0, (1 - d / GLOW_RADIUS) * glowAlpha);
        const alpha = nodeBase + g * (nodeGlowMax - nodeBase);
        const r = 1.2 + g * 2.4;

        if (g > 0.06) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${g * 0.1})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.fill();
      });

      // Draw moving lights (node-to-node traversal)
      lights.forEach((lt) => {
        if (
          lt.fromNode >= nodes.length ||
          lt.toNode >= nodes.length
        ) {
          Object.assign(lt, spawnLight());
          return;
        }
        const na = nodes[lt.fromNode];
        const nb = nodes[lt.toNode];
        const x = na.x + (nb.x - na.x) * lt.t;
        const y = na.y + (nb.y - na.y) * lt.t;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, 7);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${dotGlow})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${dotCore})`;
        ctx.fill();

        advanceLight(lt);
      });

      raf = requestAnimationFrame(draw);
    }

    // ── Pointer Events API ────────────────────────────────────────────
    // Single unified handler for both mouse hover and touch tap.
    // Avoids the mobile double-fire bug where touchend is followed by a
    // synthetic mousemove that re-enables the glow and freezes it.
    const getPos = (e: PointerEvent) => {
      const rect = cvs.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    // Mouse enters element — start glow tracking
    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      targetMouse = getPos(e);
      targetGlow  = 1;
    };

    // Pointer moves — update target (mouse: always; touch: only while pressed)
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" && e.pressure === 0) return;
      targetMouse = getPos(e);
      if (e.pointerType === "mouse") targetGlow = 1;
    };

    // Touch/pen makes contact — snap position so glow appears at finger tip
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return; // mouse uses enter/move/leave
      targetMouse = getPos(e);
      activeMouse = { ...targetMouse };      // no lerp on first contact
      targetGlow  = 1;
    };

    // Touch/pen lifts — trigger dreamy fade-out from last position
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      targetMouse = { x: -9999, y: -9999 };
      targetGlow  = 0;
    };

    // Mouse leaves element — fade glow
    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      targetMouse = { x: -9999, y: -9999 };
      targetGlow  = 0;
    };

    // ── Resize ─────────────────────────────────────────────────────────
    const onResize = () => {
      cancelAnimationFrame(raf);
      setup();
      draw();
    };

    setup();
    draw();

    ctr.addEventListener("pointerenter",  onPointerEnter);
    ctr.addEventListener("pointermove",   onPointerMove);
    ctr.addEventListener("pointerdown",   onPointerDown);
    ctr.addEventListener("pointerup",     onPointerUp);
    ctr.addEventListener("pointercancel", onPointerUp);  // treat cancel = lift
    ctr.addEventListener("pointerleave",  onPointerLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      ctr.removeEventListener("pointerenter",  onPointerEnter);
      ctr.removeEventListener("pointermove",   onPointerMove);
      ctr.removeEventListener("pointerdown",   onPointerDown);
      ctr.removeEventListener("pointerup",     onPointerUp);
      ctr.removeEventListener("pointercancel", onPointerUp);
      ctr.removeEventListener("pointerleave",  onPointerLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative px-6 md:px-10 py-20 overflow-hidden"
    >
      <CyberpunkNet containerRef={sectionRef} />

      {/* Top fade — blends net smoothly into the section above */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-32 pointer-events-none z-[2] bg-gradient-to-b from-bg to-transparent"
      />
      {/* Bottom fade — blends net smoothly into the section below */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-[2] bg-gradient-to-t from-bg to-transparent"
      />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full max-w-[320px] mx-auto rounded-3xl border border-border-card overflow-hidden aspect-square">
            <Image
              src="/about-behdad.jpg"
              alt="Behdad Morsalpoor"
              width={320}
              height={320}
              className="w-full h-full object-cover"
            />
          </div>
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
            I&apos;m Behdad Morsalpoor — a Senior Product Design Lead with 12+
            years scaling Fintech platforms used by 11M+ people. My work sits
            at the intersection of HCI, Cognitive Science, and product
            strategy: I turn complex financial flows into precise,
            high-fidelity experiences that move OKRs. I&apos;m currently based
            in Tehran and relocating to Barcelona in October 2026.
          </p>

          {/* Buttons: mobile → Contact Me full-width, then LinkedIn+WhatsApp as equal row */}
          {/* Desktop → all three inline */}
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/contact"
                className="flex w-full md:inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 text-white font-roboto text-sm font-medium hover:bg-cyan-400 transition-colors duration-200"
              >
                Contact Me
              </Link>
            </motion.div>

            <div className="flex gap-3 md:contents">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 md:flex-none"
              >
                <a
                  href="https://linkedin.com/in/behdad-mor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full md:inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border-card bg-surface text-text-primary font-roboto text-sm hover:border-cyan-500 hover:text-cyan-500 transition-colors duration-200"
                >
                  <LinkedInIcon />
                  LinkedIn
                </a>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 md:flex-none"
              >
                <a
                  href="https://wa.me/989366090699"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full md:inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border-card bg-surface text-text-primary font-roboto text-sm hover:border-cyan-500 hover:text-cyan-500 transition-colors duration-200"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
