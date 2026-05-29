# Version History

> To restore any version, tell Claude: **"revert to version x.x.x"**
> Claude will run `git checkout tags/vX.X.X` and reapply only the changes you specify.

---

## Versioning rules

| Bump | When |
|------|------|
| `vX.0.0` | Major phase complete (new page or major feature) |
| `vX.Y.0` | New section / component added |
| `vX.Y.Z` | Bug fix, copy change, or style tweak |

---

## Release table

| Version | Commit | Date | What changed |
|---------|--------|------|--------------|
| **v0.8.0** | `c1d5af3` | 2026-05-29 | **Recommendations polish** — mobile responsive fixes (`overflow-x` on html/body, CurrentExperience glow contained), `useScrollLock` (iOS Safari body-scroll fix), bottom sheet drag-to-dismiss, fancy transitions (3-D flip modal, cyan shimmer sweep, content stagger), skeleton loading + CSS shimmer, error state + retry, AbortController 8s timeout, `Avatar` `onError` fallback, `data-slot` element naming, VERSIONS.md → `doc/` |
| **v0.7.0** | `c30d2b0` | 2026-05-28 | **Recommendations → Supabase** — API route + server-side client, 60s ISR cache, hardcoded fallback, `@supabase/supabase-js` installed |
| v0.6.0 | `0d6b861` | 2026-05-27 | **Skill carousel v6** — vertical cylinder drum-roll, invisible circular wrap via `animate().then()`, drag/swipe (mouse + touch), 3-D tilt, section-wide mouse glow, 5/7 desktop split |
| v0.5.0 | `6f11379` | 2026-05-22 | **Bento grid** — asymmetric 5-tile CSS grid, 3 responsive image crops, 3D tilt, desktop hover overlay, mobile always-visible scrim, staggered whileInView entrance |
| v0.4.1 | `206c118` | 2026-05-22 | Docs — rewrote README for personal portfolio |
| v0.4.0 | `c440b5d` | 2026-05-22 | **Hero complete** — ProfileOrb v2 (mouse-tracking border), responsive viewport tiers, scroll indicator, full CTA row |
| v0.3.0 | `a17e062` | 2026-05-22 | **Hero redesign** — ProfileOrb v1, white tool icons, animated blobs, stagger text |
| v0.2.1 | `8f5cd05` | 2026-05-22 | Fix social links, enable CV download, correct footer copy |
| v0.2.0 | `2696156` | 2026-05-22 | **Phase 0 + Phase 1** — design tokens, dark/light theme, header, footer, home skeleton, real CV data in `resume.json` |
| v0.1.0 | `0ac3d60` | 2026-05-22 | Initial Next.js scaffold from `create-next-app` |

---

## How to revert

When you say **"revert to version 0.5.0"**, Claude will:

1. `git checkout tags/v0.5.0` — inspect the exact state at that tag
2. Discuss with you which parts to restore
3. Apply only those changes back onto `main`
4. Commit as `revert(vX.Y.Z → vA.B.C): <what was restored>`
5. Tag the result as the next version (e.g. `v0.6.1`)

> Reverting never destroys history — it always creates a new commit forward.
