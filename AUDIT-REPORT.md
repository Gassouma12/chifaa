# CHIFAA — QA Audit & Dead-Code Report

_Nothing here has been deleted. This is analysis for you to act on._

## Part 1 — QA audit (tested, with results)

| Area | Result |
|------|--------|
| Production build (`npm run build`) | ✅ Passes; all 21 routes export, 4 articles pre-rendered with full body baked in (SEO) |
| Nav + article links | ✅ Fixed via `trailingSlash`; work in `next dev` AND static host. The `[slug]` `generateStaticParams` error is gone |
| Data integrity (Supabase ↔ JSON) | ✅ Order-independent diff clean; only intended fixes (readTime, bilingual author) |
| Security (RLS) | ✅ Anon **cannot** write (UPDATE→0 rows, INSERT→blocked 42501); drafts hidden from anon; only published readable |
| Admin auth | ✅ Real Supabase login; wrong password → real error |
| Admin CRUD | ✅ Config-driven editor (articles/team/founders/podcast), MENA (22 countries), Pages (5), image upload to Storage, validation, unsaved-guard |
| Admin CSS | ✅ Inputs styled (was the unstyled-box bug), flags via flagcdn, side tabs light-pink, Zain for Arabic |
| Voices cards | ✅ Show date instead of "views" |
| Mobile nav | ✅ Slide-from-left, larger centered pills, pink close-hover, dark-mode |
| Dark-mode logo whitening | ✅ Inlined critical CSS — no first-load flash |
| Console errors | ✅ No real errors. Two **benign** dev-only warnings remain (see below) |

**Benign console warnings (safe to ignore):**
- _"Encountered a script tag while rendering React component"_ — from `LegacyScripts` and the article JSON-LD. These still render correctly into the static HTML (SEO works); the warning only fires on client-side nav and never in the production build.
- The earlier empty-`src` warnings are resolved — all pages now show 0 empty images.

**Still pending from the migration (known, not bugs):**
- Auto-translate **Edge Function** (EN→AR runs manually via `npm run translate` for now)
- **CI deploy pipeline** (the admin "Publish to site" button is a placeholder until this is wired)
- **Cutover** (push to GitHub + first live deploy to OVH)

## Part 2 — Dead code / junk (categorized)

### A. Dead JavaScript in `chifaa-next/public/js/` (0 references — safe to delete)
- `data-loader.js` — legacy multi-page data loader, unused
- `data-loader-embedded.js` — legacy embedded-data loader, unused
- `partners-count.js` — partners counter animation (partners removed)
- `script-translate.js` — old client translate helper, unused
- `article.js` — superseded by the server-rendered article page (only a code comment mentions it)

### B. Dead CSS
- `chifaa-next/public/css/partners.css` — the partners route is gone

### C. Legacy rollback copy — `www/` (33 MB) — **intentional, remove only after cutover is confirmed stable**
The entire old site, kept as the instant rollback (also preserved in the `pre-supabase` git tag + the 62 MB archive). Contains:
- `www/admin/api.php` + `admin/*.md` (5 internal docs) — the retired PHP admin
- `www/server.js`, `www/partners.html`, and all legacy `*.html` pages
- `www/data/*.json` — the import source (also the rollback data)

### D. Root `index.html` (project root) — stale, non-i18n duplicate of the homepage; superseded by the Next site. Not deployed.

### E. Superseded / conditional
- `chifaa-next/scripts/translate-articles.mjs` — keep until the auto-translate Edge Function replaces it
- `chifaa-next/app/article/` (the `?id=` redirect shim) — **keep**; preserves legacy `article.html?id=N` links
- `partners` table + `partners` in import/generate — data still imported and `partners.json` still generated, but **nothing renders it** anymore (partners UI removed). Candidate to drop from schema/import/generate.

### F. Unlinked but crawlable
- `/brandbook` — a real page, in the sitemap, but not in the nav. Decide: link it, keep hidden, or remove.

### G. Needs deeper analysis (not done here)
- `chifaa-next/public/assets/` (32 MB) — many legacy images may now be unreferenced (all 92 were copied to Supabase Storage). A reference-scan could reclaim space, but needs care (some are used by legacy CSS/JS).

## Part 3 — Suggested order (your call)

1. **Delete now** (zero risk, 0 references): the 5 JS files in **A** + `partners.css` in **B**.
2. **Decide**: brandbook (F), partners data (E), unused assets (G).
3. **After cutover is confirmed live & stable**: remove `www/` (C) and root `index.html` (D) — rollback still lives in the `pre-supabase` tag + archive.

Tell me which of these to action and I'll do them.
