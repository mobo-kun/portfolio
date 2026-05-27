# Behdad's Personal Portfolio Website — Product Requirements Document (PRD)

> **Version:** 1.1  
> **Role:** Senior Product Designer / Product Design Lead  
> **Aesthetic:** Minimalist · Futuristic · Abstract · High-Consistency  
> **Last Updated:** 2026

---

## 1. Project Overview

A personal portfolio website for Behdad, a Product Design Lead specialising in Fintech, Crypto, and behavioural design. The site serves as a primary professional surface — showcasing case studies, CV history, writing, and a contact gateway. It must reflect the same craft standards Behdad applies to product work: intentional, consistent, and detail-obsessed.

**Primary audience:** Hiring managers, design leaders, collaborators, and recruiters discovering Behdad via LinkedIn or direct referral.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router, React 18+) | Server components where possible |
| Styling | Tailwind CSS | Strict design tokens — no hardcoded hex values |
| Animations | Framer Motion | Page transitions, micro-interactions, layout animations |
| CMS | Notion API | Headless CMS for case studies (workspace already populated) |
| Database | Vercel KV (Redis) | Kudos system — like counting + IP-based rate limiting |
| Deployment | Vercel | Existing account. Subdomain: `behdad.vercel.app` (custom domain to be added later) |
| Fonts | Intel One Mono + Roboto Mono | See typography tokens below |
| Theme | Light + Dark, with manual toggle | Persisted via `localStorage` |
| Language | English only | No RTL/i18n required |
| SEO | Basic | `<title>`, `<meta description>`, Open Graph tags per page |
| Analytics | Deferred | Planned for a later phase |

---

## 3. Design System & Tokens

All values below must be defined in `tailwind.config.ts`. **No hardcoded hex values anywhere in components.**

### 3.1 Color Palette

**Primary (Dark Cyan)**

| Token | Hex | Usage |
|---|---|---|
| `cyan-500` | `#0097A7` | Base interactive color |
| `cyan-400` | `#00B8D4` | Hover states, neon accents |
| `cyan-900` | `#006B7F` | Subtle active states, tinted backgrounds |

**Light Theme**

| Token | Hex | Role |
|---|---|---|
| Background | `#F8F9FA` | Page background |
| Surface | `#FFFFFF` | Cards, modals |
| Border | `#E5E7EB` | All card/section borders |
| Text Primary | `#111827` | Headings, body |
| Text Secondary | `#6B7280` | Meta, captions |

**Dark Theme**

| Token | Hex | Role |
|---|---|---|
| Background | `#0A0A0A` | Page background |
| Surface | `#171717` | Cards, modals |
| Border | `#262626` | All card/section borders |
| Text Primary | `#F9FAFB` | Headings, body |
| Text Secondary | `#9CA3AF` | Meta, captions |

### 3.2 Typography

| Role | Font | Tailwind Class |
|---|---|---|
| Headings & Display | Intel One Mono | `font-intel` |
| Body, Buttons & UI | Roboto Mono | `font-roboto` |

### 3.3 Geometry & Structure

| Property | Value |
|---|---|
| Border radius — large cards | `rounded-xl` (12px) |
| Border radius — buttons/inputs | `rounded-lg` (8px) |
| Border radius — badges/pills | `rounded-full` |
| Border width | `border-[1px]` on all cards and sections |
| Shadows | `shadow-sm` standard; `shadow-cyan-glow` custom — for primary button hover only |

### 3.4 Theme Toggle

- Toggle button persistent in the global header
- Theme preference stored in `localStorage` key: `theme`
- Default: system preference (`prefers-color-scheme`), falls back to dark

---

## 4. Information Architecture

```
/                   → Home
/case-studies       → Case Studies listing
/case-studies/[slug] → Single case study
/cv                 → CV / Resume
/blog               → Blog (low priority)
/contact            → Contact
```

---

## 5. Global Components

### 5.1 Header (Fixed Top Navigation)

- Links: Home · Case Studies · CV · Blog · Contact
- Right side: **Theme toggle** (light/dark icon button)
- Desktop: smooth hover underline animation; active link highlighted in `cyan-500`
- Mobile (< 768px): hamburger icon → full-height side drawer (Framer Motion slide-in from right)
- Background: blurred backdrop (`backdrop-blur-md`) with subtle border bottom

### 5.2 Footer

- Single line: `Created by Behdad and Claude`
- Centered, `font-roboto`, `text-secondary`

---

## 6. Pages & Features

### 6.1 Home Page (`/`)

#### Hero Section
- Animated display text: full name + role title (Framer Motion stagger fade-in)
- ProfileOrb: circular profile image (`/profile.webp`) with a rotating conic-gradient border that tracks mouse position on hover, surrounded by 6 floating tool-icon bubbles (Figma, Cursor, Claude, Grok, Gemini, Podcast) that orbit the image using absolute positioning and individual float animations
- Background: CSS grid lines (low contrast) + oversized blurred circles (`filter: blur(120px)`, low opacity, `cyan-900` tinted) — pure CSS, no WebGL
- CTA row:
  - `Download CV` button (neutral fill, `rounded-lg`)
  - Icon-only buttons: LinkedIn, Instagram, Substack, Telegram, WhatsApp
- Scroll indicator: animated mouse icon at bottom of hero ("Scroll for more")

#### Bento Grid — Featured Case Studies

**Status:** Layout and interactions complete. Images and titles are mock — will be replaced with real content after Phase 7 (Notion CMS integration).

**Config:** `data/bento-config.json` → `tiles[]` array. Each tile has:
- `id` — stable folder name (never changes, maps to `/public/case-studies/<id>/`)
- `title` — display name shown on overlay (update freely)
- `href` — destination link (update freely; deferred until `/case-studies/[slug]` pages exist)
- `alt` — image alt text for accessibility

**Layout — 3 responsive breakpoints:**
- **Desktop (≥1024px):** 5-tile asymmetric CSS grid fitting one viewport height
  - Grid areas: `"a a b" / "a a c" / "d e e"` — Tile A (2×2), B/C/D (1×1), E (2×1 wide)
- **Tablet (640–1023px):** 2-col grid, `"a a" / "b c" / "d e"` rows (2fr/1fr/1fr), one viewport height
- **Mobile (<640px):** Vertical flex list, all tiles 4:3 aspect ratio, natural scroll

**Images — 3 crops per tile:**
- `public/case-studies/<id>/desktop.jpg` — served at ≥1024px
- `public/case-studies/<id>/tablet.jpg` — served at 640–1023px
- `public/case-studies/<id>/mobile.jpg` — served at <640px
- Crop selected by JS on mount (`useEffect` + `window.innerWidth`)
- Missing image → branded gradient placeholder (auto fallback via `onError`)
- Size guide: `public/case-studies/TILE-GUIDE.md`

**Tile interactions:**
- **Desktop hover:** full dark scrim overlay fades in — large project title + "View Case Study" bordered pill CTA; title and CTA slide up 2px on appear
- **Mobile/tablet:** permanent bottom-fade gradient scrim with bold truncated title always visible
- All tiles: 3D tilt on `mousemove` (±5° max, perspective 900px), resets on `mouseleave`
- Border transitions to `cyan-500` on hover; `scale(1.03)` on image hover
- Framer Motion staggered `whileInView` entrance per tile (7ms delay between tiles)

**`See all case studies →` link:** deferred to Phase 7 — will be added once the `/case-studies` listing page exists.

#### Current Experience
- Reads the **first entry** (index 0) from `data/resume.json`
- Layout: **5-col / 7-col split** (`lg:grid-cols-12`) — skill carousel left, role details right
- Displays: position, company, dates, first 2 bullet points of description
- `View Full CV →` text link

**Skill Carousel (v6 — vertical cylinder drum-roll)**
- 7 skill cards (Design Systems, Interaction Design, Behavioral Research, Product Strategy, UX Research, Design Leadership, Fintech & DeFi), each with a unique SVG geo-pattern background and neon icon
- `EXTENDED` array: 2 clone-cards before + 7 real cards + 2 clone-cards after (11 total) — enables invisible circular wrapping in both directions
- Viewport height: 400 px (`CARD_H 300 + PEEK 50×2`); `10 %` peek of prev/next card visible through gradient fade masks at top and bottom
- **Circular queue**: always scrolls in one direction (like a cylinder). After card 07 the list springs to `clone-01`, spring settles, then teleports to `real-01` invisibly. Counter reads `01/07` throughout — no backward jump ever visible
- Auto-advance every 5 s; drag/swipe (mouse + touch, velocity-aware) also advances
- 3-D tilt on hover (±10° rotateX/Y, perspective 800 px); tilt disabled while dragging
- Section-wide mouse-following glow (cyan, `blur-[120px]`, covers both carousel and text columns)

#### Recommendations Carousel
- Infinitely auto-scrolling marquee (Framer Motion)
- Cards: person image, name, quote excerpt
- Clicking image or name opens LinkedIn URL in new tab
- Pause on hover

#### About Me
- Split layout: Behdad's photo left, bio paragraph right
- Buttons: `Contact Me` · `LinkedIn` · `WhatsApp`

---

### 6.2 Case Studies Page (`/case-studies`)

#### Listing View
- Client-side search bar: filters by title, short description, and Notion page content tags
- Horizontal cards per result: thumbnail + title + short description + `Read More →` button
- Empty state message if no results match

#### Single Case Study (`/case-studies/[slug]`)

**Layout:**
- Minimal breadcrumbs: `Home / Case Studies / [Project Name]`
- Hero image (full width)
- Info table: Company · Role · Platform · Date · Description
- Sticky left sidebar: Table of Contents — highlights active section on scroll (Intersection Observer)
- Main content area: Notion blocks rendered (headings, paragraphs, images, dividers)

**Kudos System:**
- Bottom of page: heart icon + total count
- Click: pop/fill animation → heart turns `cyan-500`
- API route: `POST /api/kudos/[slug]` → writes to Vercel KV
- Rate limiting: 1 kudo per IP per case study per 24h
- Count displayed: reads from Vercel KV on page load

**Related Case Studies:**
- Footer of each case study: 2 recommended cards (manually configured or random from remaining studies)

---

### 6.3 CV Page (`/cv`)

- `Download CV (PDF)` button at top — links to `/public/cv.pdf`
- Timeline view from `data/resume.json`
- Each entry displays: position, company name, company logo (`/public/logos/[company].png`), date range, bulleted descriptions
- Placeholder logo shown if asset missing (initials avatar as fallback)
- Industries highlighted: Fintech · Crypto · UI/UX Leadership

---

### 6.4 Blog Page (`/blog`) — Low Priority

- Grid of cards: Substack article title · date · snippet
- Each card links externally to the Substack URL (`target="_blank"`)
- No internal routing needed — pure link-out

---

### 6.5 Contact Page (`/contact`)

- Profile image + short "About Me" paragraph
- Primary action buttons:
  - `Email Me` → `mailto:` link
  - `LinkedIn` → opens profile in new tab
  - `WhatsApp` → `wa.me/` link

---

## 7. Data Architecture

All local data files live in `data/` at the project root.

### `data/resume.json`
```json
{
  "experience": [
    {
      "id": "1",
      "company": "Nobitex",
      "logo": "/logos/nobitex.png",
      "position": "Product Design Lead",
      "startDate": "2023-01",
      "endDate": "Present",
      "description": [
        "Lead design team focusing on fintech and cryptocurrency features.",
        "Spearheaded user psychology initiatives using Behavioural Design."
      ],
      "industry": "Fintech / Crypto"
    }
  ]
}
```

### `data/bento-config.json`
```json
{
  "featuredProjects": [
    "Invi Micro-investment Ghalak",
    "Crypto Dashboard Overhaul",
    "Onboarding Gamification"
  ]
}
```

### `data/media.json` (Future-proofing)
```json
{
  "podcasts": [
    {
      "title": "Noon Panir Design",
      "type": "audio",
      "status": "planned_integration"
    }
  ]
}
```

---

## 8. Asset Handling

Since not all assets are ready at build time, the following fallback strategy applies:

| Asset | Fallback |
|---|---|
| Profile photo | Cyan-tinted placeholder rectangle |
| Company logos | Initials badge (`rounded-full`, `bg-cyan-900`, white text) |
| Case study thumbnails | Solid `bg-surface` card with project title centered |
| CV PDF | Button disabled with tooltip: "Coming soon" |

All final assets drop into `/public/` with no code changes needed.

---

## 9. Micro-Interactions & Animation Protocol

Every interactive element must use Framer Motion `motion.*` tags:

| Element | Animation |
|---|---|
| Buttons | `whileHover={{ scale: 1.02 }}` + `whileTap={{ scale: 0.98 }}` |
| Page load | `initial={{ opacity: 0, y: 10 }}` → `animate={{ opacity: 1, y: 0 }}` |
| Cards | Border color transitions to `cyan-500` on hover |
| Images inside cards | Parent `overflow-hidden` + child `hover:scale-105 duration-500 ease-out` |
| Page transitions | Framer Motion `AnimatePresence` wrapping route changes |
| Marquee/carousel | `framer-motion` infinite x-translate loop |
| Kudos heart | Scale pop + fill color swap on click |

---

## 10. SEO (Basic)

Each page must export a Next.js `metadata` object with:

- `title`: page-specific (e.g. `"Case Studies — Behdad"`)
- `description`: 1–2 sentence summary
- `openGraph.title`, `openGraph.description`, `openGraph.image` (use a static default OG image at `/public/og-default.png`)
- `twitter:card: summary_large_image`

No dynamic OG image generation required at this phase.

---

## 11. Environment Variables

```env
NOTION_API_KEY=
NOTION_DATABASE_ID=
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

All managed via Vercel project settings. Never committed to the repository.

---

## 12. Out of Scope (This Version)

- Custom domain setup (deferred — using `vercel.app` subdomain)
- Analytics / tracking (deferred to a later phase)
- RTL / Persian language support
- Audio/podcast integration (`media.json` is placeholder only)
- Authentication or admin panel
- Comment system

---
