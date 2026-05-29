# Behdad Morsalpoor — Personal Portfolio

> **Live → [behdad.vercel.app](https://behdad.vercel.app)** · v0.9.0

A personal portfolio for **Behdad Morsalpoor**, Senior Product Design Lead specialising in Fintech, Crypto, and behavioural design. Built entirely with Claude.

---

## Sections

| Section | Status | Notes |
|---|---|---|
| **Hero** | ✅ Live | Profile orb, rotating border, floating tool icons, animated blobs |
| **Case Studies (Bento)** | ✅ Live | Asymmetric 5-tile grid, 3D tilt, responsive images |
| **Current Experience** | ✅ Live | Vertical skill carousel (cylinder drum-roll), role details |
| **Recommendations** | ✅ Live | Supabase-backed marquee, read-more modal / bottom sheet |
| **About Me** | ✅ Live | Cyberpunk net canvas, new photo, mobile button layout, gradient faders |
| **CV** | ⏳ Planned | Phase 8 |
| **Case Study Pages** | ⏳ Planned | Phase 7 (Notion CMS) |
| **Blog** | ⏳ Planned | Phase 11 |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Fonts | Intel One Mono + Roboto Mono |
| Theme | Light / Dark (`next-themes`) |
| Database | Supabase (recommendations) |
| Deployment | Vercel |

---

## Recommendations — how it works

Data is fetched from Supabase on every page load (60s ISR revalidation). Three UI states:

- **Loading** — shimmer skeleton cards (CSS `skeleton-shimmer` keyframe; `prefers-reduced-motion` safe)
- **Success** — infinite auto-scrolling marquee; tap/click `Read full →` opens a modal or bottom sheet
- **Error** — friendly message + `↻ Try again` button (8s `AbortController` timeout)

**Bottom sheet** (mobile) is drag-to-dismiss with iOS-safe body scroll locking (`useScrollLock`).  
**Modal** (desktop) uses a `perspective:1200px` / `rotateX` 3-D flip-up entry.

To add a recommendation: insert a row in the Supabase `recommendations` table with `is_active = true`.

---

## Run locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

Create `.env.local`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NOTION_API_KEY=
NOTION_DATABASE_ID=
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

## Build

```bash
npm run build
npm run start
```

---

## Project docs

| File | Purpose |
|---|---|
| `doc/PRD.md` | Full product requirements, design system, component specs |
| `doc/TODO.md` | Phased task list with acceptance criteria |
| `doc/VERSIONS.md` | Release history + revert instructions |

---

Created by Behdad and [Claude](https://claude.ai)
