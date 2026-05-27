# Behdad's Portfolio — Phased TODO & Acceptance Criteria

> Work through phases in order. Do not start Phase 2 until all Phase 1 tasks are marked ✅.  
> Each task has a clear **Acceptance Criteria (AC)** — you are done when the AC is met, not before.

---

## Phase 0 — Project Foundation
> Goal: A running Next.js app on Vercel with design tokens wired up. Nothing visible to the public yet.

---

### [x] 0.1 — Initialise Next.js Project

**Steps:**
- Run `npx create-next-app@latest behdad-portfolio --typescript --tailwind --eslint --app`
- Choose: App Router ✅ · src/ directory ✅ · import alias `@/*` ✅

**AC:**
- `npm run dev` opens `localhost:3000` with no errors in terminal
- Project folder structure shows `app/`, `public/`, `tailwind.config.ts`

---

### [x] 0.2 — Configure Design Tokens in Tailwind

**Steps:**
- Define all color tokens (cyan-400/500/900, bg, surface, border, text-primary, text-secondary for both themes) in `globals.css` via `@theme inline`
- Add `fontFamily`: `intel` (Intel One Mono) and `roboto` (Roboto Mono)
- Add custom `boxShadow`: `cyan-glow`
- Load both fonts via `next/font/google` in `app/layout.tsx`

**AC:**
- A test `<div className="bg-cyan-500 font-intel">Test</div>` renders with correct cyan color and monospace font
- No hardcoded hex values exist anywhere in the codebase

---

### [x] 0.3 — Set Up Dark/Light Theme Toggle

**Steps:**
- Install `next-themes`
- Wrap `app/layout.tsx` with `<ThemeProvider attribute="class" defaultTheme="system" storageKey="theme">`
- Add `@custom-variant dark` to `globals.css`
- Create a `<ThemeToggle />` component with sun/moon icon

**AC:**
- Clicking the toggle switches between light and dark mode visually
- Preference survives a page refresh (`localStorage` key `theme`)
- Both themes use only design token classes

---

### [x] 0.4 — Create Data Files

**Steps:**
- Create `data/resume.json` with real CV experience entries
- Create `data/bento-config.json` with 3 featured project titles
- Create `data/media.json` as placeholder

**AC:**
- All three files exist at `data/` root
- `resume.json` validates as correct JSON
- `bento-config.json` `featuredProjects` array has exactly 3 string entries

---

### [x] 0.5 — Set Up Environment Variables

**Steps:**
- Create `.env.local` at project root
- Add: `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`
- Add `.env.local` to `.gitignore`
- Add the same keys (empty) to Vercel project settings

**AC:**
- `.env.local` is NOT committed to Git
- Keys are available in server components via `process.env`

---

### [x] 0.6 — Deploy Skeleton to Vercel

**Steps:**
- Push repo to GitHub
- Connect repo to Vercel account
- Add environment variables in Vercel dashboard
- Trigger first deploy

**AC:**
- Live URL on `*.vercel.app` loads with no build errors
- Vercel dashboard shows deployment as "Ready" (green)

---

## Phase 1 — Global Shell
> Goal: Fixed header and footer present on every page, fully functional before any home page content.

---

### [x] 1.1 — Global Header

**Steps:**
- Create `components/Header.tsx`
- Fixed top, `backdrop-blur-md`, `border-b border-border-card`
- Nav links: Home · Case Studies · CV · Blog · Contact
- Active link via `usePathname()` — highlighted in `cyan-500` with underline
- Theme toggle button on the right
- Mobile (< 768px): hamburger → Framer Motion slide-in drawer from right

**AC:**
- Active page link is visually distinct in both themes
- Drawer opens/closes with smooth spring animation at 375px width
- Header stays fixed on scroll with no layout shift
- Theme toggle visible and functional

---

### [x] 1.2 — Global Footer

**Steps:**
- Create `components/Footer.tsx`
- Single centered line: `Created by Behdad and Claude`
- `font-roboto`, `text-secondary`

**AC:**
- Footer appears on every page
- Text is centered, correct font, correct color in both themes

---

## Phase 2 — Home Page: Hero Section
> Goal: A full-viewport, animated hero that immediately communicates who Behdad is and invites interaction.

---

### [x] 2.1 — Profile Orb

**Steps:**
- Circular profile photo (`/public/profile.webp`) with `rounded-full overflow-hidden`
- Rotating conic-gradient border driven by a `requestAnimationFrame` loop (+0.2°/frame)
- On mouse hover: border angle tracks cursor position (Math.atan2)
- Spring physics on the angle value (`useSpring`) to smooth rapid movement
- Responsive sizing via `useViewportTier` hook:
  - Tier 0 (h < 680px): 120px image, 240px wrapper
  - Tier 1 (mobile): 170px image, 310px wrapper
  - Tier 2 (desktop): 220px image, 400px wrapper

**AC:**
- Border rotates automatically on idle
- Border chases the cursor on hover
- Correct size at each breakpoint
- No hydration mismatch (SSR-safe initial state)

---

### [x] 2.2 — Floating Tool Icons

**Steps:**
- 6 tool icons (Figma, Cursor, Claude, Grok, Gemini, Podcast) placed on an orbit circle
- Position each icon using polar-to-Cartesian: `center ± cos/sin(angle) * orbitRadius`
- SVGs loaded from `/public/tool-icons/<label>.svg` — fallback to 2-letter initials badge if missing
- Each icon floats independently (Framer Motion `y: [0, ±8, 0]` loop with staggered delay)
- Icon size: 40×40px white circle, `p-2`, `rounded-full`, `shadow-md`

**AC:**
- All 6 icons appear centered on their orbit points
- Icons float at different phases (not in sync)
- Missing SVG shows initials fallback
- Correct orbit radius per viewport tier

---

### [x] 2.3 — Animated Background Blobs

**Steps:**
- 3 blurred radial blobs using `filter: blur(100px)`:
  - `#006B7F` (top-left, 600px, opacity 0.55)
  - `#00B8D4` (bottom-right, 480px, opacity 0.38)
  - `#0097A7` (centre, 350px, opacity 0.28)
- Each blob animates through irregular x/y/scale keyframes on a looping Framer Motion transition
- CSS grid lines overlay at 0.3 opacity behind everything

**AC:**
- Blobs are visible but never overpower text
- Blobs move continuously and do not snap or stutter
- Grid lines visible at low opacity in light mode

---

### [x] 2.4 — Hero Text & Stagger Animation

**Steps:**
- Heading: `Hi, I'm Behdad` (`font-intel`, bold, responsive size)
- Role subtitle: `Senior Product Design Lead` (`font-intel`, `text-cyan-500`)
- Tagline paragraph: `font-roboto`, `text-text-secondary`
- Tagline hidden on Tier 0 (short phones) to keep content in one viewport
- Staggered Framer Motion entrance: each element fades in with `y: 16 → 0` offset

**AC:**
- Each text element enters sequentially, not all at once
- Tagline absent on 375×667 viewport
- All font tokens used — no hardcoded sizes

---

### [x] 2.5 — CTA Row (Download CV + Social Links)

**Steps:**
- `Download CV` primary button: `href="/cv.pdf"`, `download="Behdad_Morsalpoor_CV.pdf"`, `bg-cyan-500`
- 5 social icon buttons (LinkedIn, Instagram, Substack, Telegram, WhatsApp) — `w-10 h-10`, `rounded-lg`, `border-border-card`
- Mobile layout: CV button full-width on its own row, social icons centred below
- Desktop layout: CV button + icons in a single flex row
- All buttons: `whileHover={{ scale: 1.02 }}` + `whileTap={{ scale: 0.98 }}`

**AC:**
- CV button triggers file download
- All 5 social links open correct URLs in a new tab
- Mobile layout stacks correctly at 375px
- Hover/tap animations visible on all buttons

---

### [x] 2.6 — Scroll Indicator

**Steps:**
- Mouse icon with bouncing inner dot (Framer Motion `y: [0, 6, 0]` loop)
- `Scroll for more` label below
- Sits in its own flex row at the bottom of the section — never overlaps CTA content
- Fades in with a 1.4s delay after page load

**AC:**
- Indicator always visible at the bottom of the first viewport on all breakpoints
- No overlap with CTA buttons at any tested size (375×667 through 1440×900)
- Fade-in delay feels natural

---

### [x] 2.7 — Hero Responsive Layout

**Steps:**
- Section: `min-h-[calc(100dvh-4rem)]`, `flex-col`
- Main content: `flex-1 flex items-center justify-center` — takes all space above scroll indicator
- Scroll indicator: `pb-4 sm:pb-6` in its own row below
- `useViewportTier` hook drives orb size and tagline visibility
- Tier breakpoints: h < 680 → 0, w < 640 or h < 860 → 1, else → 2

**AC:**
- All content fits in one viewport at: 375×667, 375×812, 768×1024, 1280×800, 1440×900
- No vertical scroll needed to see the scroll indicator
- Smooth resize behaviour (no hard snaps except at tier boundaries)

---

## Phase 3 — Home Page: Bento Grid
> Goal: Viewport-filling asymmetric bento grid of case study covers with responsive images, overlays, and 3D tilt.
> Images and titles are **mock** until Phase 7 (Notion). Links are **deferred** until `/case-studies/[slug]` pages exist.

---

### [x] 3.1 — Asymmetric Bento Layout

**Steps:**
- Read `data/bento-config.json` → `tiles[]` (each tile: `id`, `title`, `href`, `alt`)
- **Desktop (≥1024px):** CSS grid `"a a b" / "a a c" / "d e e"`, 3 equal cols × 3 equal rows, height `calc(100dvh - 14rem)`
- **Tablet (640–1023px):** CSS grid `"a a" / "b c" / "d e"`, 2 cols, rows `2fr 1fr 1fr`, height `calc(100dvh - 14rem)`
- **Mobile (<640px):** flex column, all tiles `aspect-[4/3]`, natural scroll
- Section label: `Featured Work`, heading: `Selected Case Studies`
- Framer Motion staggered `whileInView` entrance (7ms stagger per tile)

**AC:**
- ✅ 5 tiles render from `bento-config.json`
- ✅ Desktop: grid fits one viewport height with `"a a b" / "a a c" / "d e e"` areas
- ✅ Tablet: grid fits one viewport height with `"a a" / "b c" / "d e"` areas (Tile A full-width banner)
- ✅ Mobile: all tiles 4:3 (327×245px at 375px), scrollable list
- ⏳ `See all case studies →` link: deferred to Phase 7

---

### [x] 3.2 — Tile Interactions (Tilt + Overlays)

**Steps:**
- 3D tilt on `mousemove`: `perspective(900px) rotateX/Y`, max ±5°, resets on `mouseleave`
- Border transitions to `cyan-500` on hover; `will-change-transform`
- **Desktop hover overlay:** `hidden lg:flex` — dark scrim `bg-black/55` + large title (`text-xl xl:text-2xl font-bold`) + "View Case Study" pill CTA; both elements translate up 2px on appear
- **Mobile/tablet static overlay:** `lg:hidden` — bottom-fade gradient scrim (`h-24`) + `text-base sm:text-lg font-bold truncate` title, always visible

**AC:**
- ✅ 3D tilt follows cursor, resets smoothly on leave
- ✅ Border animates to cyan on hover
- ✅ Desktop: hover shows full overlay with title + CTA (confirmed via DOM inspection)
- ✅ Mobile/tablet: bold title always visible with gradient scrim
- ✅ E2E confirmed across 375×812, 768×1024, 1280×900

---

### [x] 3.3 — Responsive Images & Placeholder

**Steps:**
- 3 image crops per tile in `public/case-studies/<id>/`: `desktop.jpg`, `tablet.jpg`, `mobile.jpg`
- JS `useEffect` selects correct crop on mount based on `window.innerWidth`
- `onError` → `imgFailed = true` → `PlaceholderArt` (gradient + dual radial cyan accents)
- `alt=""` on `<img>` (aria-label on `<Link>` covers accessibility)
- Image size guide: `public/case-studies/TILE-GUIDE.md`

**AC:**
- ✅ `desktop.jpg` loaded at ≥1024px, `tablet.jpg` at 640–1023px, `mobile.jpg` at <640px
- ✅ No broken image icons — gradient placeholder auto-shown when file is missing
- ✅ `scale(1.03)` on image hover
- ✅ All 5 tile folders exist: `tile-a` through `tile-e`
- ⚠️ Image extension hardcoded to `.jpg` — rename to `.jpg` when uploading `.webp`/`.png`

---

## Phase 4 — Home Page: Current Experience
> Goal: Dynamically show the most recent role from resume.json with a clean split layout.

---

### [x] 4.1 — Experience Section

**Steps:**
- Import `data/resume.json`, read entry at index `[0]`
- Display: `position`, `company`, `companyDescription`, date range, first 2 `description` bullets
- `formatDate()` helper: `"2024-04"` → `"Apr 2024"`, `"Present"` passes through
- Abstract SVG illustration on the left column
- `View Full CV →` link to `/cv`

**AC:**
- Data reads dynamically from `resume.json` — changing JSON updates UI
- Date range formatted correctly
- Both columns visible side-by-side on desktop, stacked on mobile

---

## Phase 5 — Home Page: Recommendations Carousel
> Goal: An infinitely scrolling marquee of kind words that pauses on hover.

---

### [x] 5.1 — Marquee Carousel

**Steps:**
- Hardcoded array of 6 recommendation objects: `{ name, role, company, quote, linkedIn }`
- Duplicate the array so the track is 2× wide (seamless loop)
- CSS `@keyframes marquee` animation (`translateX(0)` → `translateX(-50%)`) in `globals.css`
- Apply via inline `style={{ animation: "marquee 40s linear infinite" }}`
- `animationPlayState: paused` on hover — no snap to start on resume

**AC:**
- Carousel scrolls continuously without pause or jump
- Hover pauses exactly where it is — resumes from same position
- No overflow or horizontal scrollbar on the page
- Duplicated cards create a seamless loop (no blank gap)

---

### [x] 5.2 — Recommendation Cards

**Steps:**
- `RecommendationCard` component: quote text, person name, role/company, avatar placeholder
- Avatar: initials badge (`rounded-full`, `bg-cyan-900`, white text) as fallback
- Name and avatar wrapped in `<a target="_blank">` linking to LinkedIn URL
- `article` semantic element per card

**AC:**
- Clicking name or avatar opens the correct LinkedIn profile in a new tab
- Cards have consistent height — no misalignment in the track
- Quote text does not overflow the card

---

## Phase 6 — Home Page: About Me
> Goal: A personal split-layout section with real photo and contact actions.

---

### [x] 6.1 — About Me Section

**Steps:**
- Split layout: `next/image` profile photo left (`/public/profile.webp`), bio right
- Stack to single column on mobile
- Bio text from PRD bio paragraph
- Three buttons: `Contact Me` → `/contact`, `LinkedIn` (new tab), `WhatsApp` (new tab)
- All buttons: `whileHover` + `whileTap`

**AC:**
- Real photo renders (not placeholder) using `next/image`
- 50/50 layout on desktop, stacked on mobile
- All 3 buttons link to correct destinations
- Buttons animate on hover and tap

---

## Phase 7 — Case Studies (Notion)
> Goal: Full case study listing and individual pages, powered by Notion API.

---

### [ ] 7.1 — Connect Notion API

**Steps:**
- Install `@notionhq/client`
- Create `lib/notion.ts` — initialise client with `NOTION_API_KEY`
- Write `getCaseStudies()`: returns `{ id, slug, title, description, coverImage, company, role, platform, date }`
- Write `getCaseStudyBySlug(slug)`: fetches full page blocks

**AC:**
- `getCaseStudies()` returns at least 1 result from a server component
- No API key exposed in client-side code

---

### [ ] 7.2 — Case Studies Listing Page (`/case-studies`)

**Steps:**
- Fetch all case studies server-side
- Render horizontal cards: thumbnail + title + description + `Read More →`
- Client-side search: `useState` filters by title and description in real time
- Empty state: `"No case studies match your search."`

**AC:**
- All Notion case studies appear on load
- Search filters in real time without page reload
- Empty state message shows for no matches
- `Read More →` routes to `/case-studies/[slug]`

---

### [ ] 7.3 — Single Case Study Page (`/case-studies/[slug]`)

**Steps:**
- Dynamic route `app/case-studies/[slug]/page.tsx`
- Render: breadcrumbs → hero image → info table → sticky ToC sidebar → Notion content
- Sticky sidebar: highlight active section via `IntersectionObserver`
- Render Notion block types: `heading_1–3`, `paragraph`, `image`, `divider`

**AC:**
- Correct case study loads per slug
- Breadcrumbs: `Home / Case Studies / [Project Name]`
- ToC active item updates on scroll
- Invalid slug shows 404

---

### [ ] 7.4 — Kudos System

**Steps:**
- Install `@vercel/kv`
- API route `app/api/kudos/[slug]/route.ts`: `GET` returns count, `POST` increments (IP rate-limit 1/24h)
- `<KudosButton />`: heart icon + count, Framer Motion scale pop on click

**AC:**
- Count loads on visit, increments on click, persists on refresh
- Second click within 24h is rejected
- Animation plays on click

---

### [ ] 7.5 — Related Case Studies

**Steps:**
- At bottom of each case study: 2 other cards (exclude current, random or Notion relation)

**AC:**
- 2 related cards always appear, never the current study

---

## Phase 8 — CV Page

---

### [ ] 8.1 — CV Timeline (`/cv`)

**Steps:**
- Read all `data/resume.json` entries
- Vertical timeline: company logo, position, date range, bullet descriptions
- Logo fallback: initials badge if `/public/logos/[company].png` missing
- `Download CV (PDF)` button at top → `/public/cv.pdf`

**AC:**
- All entries render in reverse-chronological order
- Dates in human-readable format
- Logo fallback works for any missing file
- Download button works

---

## Phase 9 — Contact Page

---

### [ ] 9.1 — Contact Page (`/contact`)

**Steps:**
- Profile image + short bio
- Three action buttons: `Email Me` (`mailto:`), `LinkedIn` (new tab), `WhatsApp` (`wa.me/`)
- Framer Motion hover/tap on all buttons

**AC:**
- `Email Me` opens mail client with address pre-filled
- Other links open in new tabs
- Responsive on mobile

---

## Phase 10 — SEO & Polish

---

### [ ] 10.1 — SEO Metadata

**Steps:**
- `metadata` export on every page: `title`, `description`, `openGraph`
- Static OG image at `/public/og-default.png` (1200×630px)
- `twitter:card: summary_large_image`

**AC:**
- Correct title/description/image on [opengraph.xyz](https://www.opengraph.xyz) for each page
- Every page has a unique `<title>`

---

### [ ] 10.2 — Accessibility Pass

**Steps:**
- All images have `alt` text
- All icon-only buttons have `aria-label`
- Keyboard navigation works on all interactive elements
- Colour contrast passes AA level

**AC:**
- Tab key cycles through all elements in logical order
- Screen reader announces labels correctly
- No contrast failures in either theme

---

### [ ] 10.3 — Performance Check

**Steps:**
- Run Lighthouse on Home page (production build)
- Fix any flagged "Opportunities"

**AC:**
- Lighthouse Performance ≥ 85 on desktop
- Lighthouse Accessibility ≥ 90
- No render-blocking resources

---

### [ ] 10.4 — Cross-Browser & Responsive QA

**Steps:**
- Test at: 375px, 768px, 1280px, 1440px
- Test in: Chrome, Safari, Firefox

**AC:**
- No layout overflow or broken elements at any breakpoint
- Theme toggle works in all browsers

---

## Phase 11 — Blog (Low Priority)
> Only start after Phases 0–10 are complete.

---

### [ ] 11.1 — Blog Listing Page (`/blog`)

**Steps:**
- Hardcoded array of Substack articles: `{ title, date, snippet, url }`
- Grid of cards, each linking to the Substack URL (`target="_blank"`)

**AC:**
- All cards render with title, date, snippet
- Links open correct Substack URLs in new tab
- 2-col desktop, 1-col mobile

---

## Deferred / Future

| Feature | Reason Deferred |
|---|---|
| Custom domain setup | Not purchased yet |
| Analytics | Low priority for launch |
| Audio/podcast integration | `media.json` placeholder only |
| Dynamic OG image generation | Basic SEO sufficient for now |
| Admin panel / CMS UI | Notion handles content |
| Comment system | Not in scope |

---

## Asset Checklist

| Asset | Path | Status |
|---|---|---|
| Profile photo | `/public/profile.webp` | ✅ Ready |
| CV PDF | `/public/cv.pdf` | ✅ Ready |
| Default OG image | `/public/og-default.png` | ⬜ Pending |
| Company logos | `/public/logos/[company].png` | ⬜ Pending |
| Case study thumbnails | `/public/case-studies/[slug].jpg` | ⬜ Pending |
| Tool icons | `/public/tool-icons/*.svg` | ✅ Ready |
