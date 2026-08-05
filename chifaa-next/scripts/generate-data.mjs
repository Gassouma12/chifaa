// Build step: Supabase -> public/data/*.json, in the EXACT shapes the site's
// pages (lib/data.js) and legacy client scripts already consume. This is what
// keeps the migration pixel-identical: nothing downstream changes, the data
// just comes from Supabase now. Runs before `next build`.
//
// Uses the PUBLIC anon key: RLS returns only published articles, so drafts are
// automatically excluded from the static build. No secret key needed here.

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'data');

function loadEnv() {
  const f = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(f)) for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!URL || !KEY) { console.error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY'); process.exit(1); }
const db = createClient(URL, KEY, { auth: { persistSession: false } });

const write = (name, data) => {
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(data, null, 2) + '\n', 'utf8');
  const n = Array.isArray(data) ? data.length : Object.keys(data).length;
  console.log(`  ${name}.json  (${n})`);
};
async function sel(table, cols = '*', order) {
  let q = db.from(table).select(cols);
  if (order) q = q.order(order.col, { ascending: order.asc ?? true });
  const { data, error } = await q;
  if (error) throw new Error(`${table}: ${error.message}`);
  return data || [];
}
const tByLang = (rows, idKey) => {
  const m = {};
  for (const r of rows) (m[r[idKey]] ??= {})[r.lang] = r;
  return m;
};

async function run() {
  console.log(`Generating public/data/*.json from ${URL}`);
  fs.mkdirSync(OUT, { recursive: true });

  // categories -> label maps + categories.json (drives site filter buttons)
  const cats = await sel('categories', '*', { col: 'sort' });
  const labEn = Object.fromEntries(cats.map((c) => [c.slug, c.label_en]));
  const labAr = Object.fromEntries(cats.map((c) => [c.slug, c.label_ar]));
  write('categories', { en: cats.map((c) => c.label_en), ar: cats.map((c) => c.label_ar) });

  // site singletons (fetched here so articles can reuse the bilingual author block)
  const site = await sel('site_content');
  const one = (key, lang) => site.find((s) => s.key === key && s.lang === lang)?.data;
  const authorEn = one('author', 'en') || {};
  const authorAr = { ...authorEn, ...(one('author', 'ar') || {}) };
  const authorFor = (lang) => (lang === 'ar' ? authorAr : authorEn);

  // articles (published only, via RLS) + translations
  const articles = await sel('articles', '*', { col: 'published_date', asc: false });
  const atr = tByLang(await sel('article_translations'), 'article_id');
  const mkArticle = (a, lang, labels) => {
    const t = atr[a.id]?.[lang] || atr[a.id]?.en; if (!t) return null;
    const au = authorFor(lang);
    return {
      id: a.id, title: t.title, slug: a.slug, author: au.name || a.author, authorRole: au.role || a.author_role,
      authorImage: au.image || a.author_image, coverImage: a.cover_image, excerpt: t.excerpt, content: t.content,
      category: (a.category_slugs || []).map((s) => labels[s] || s), tags: t.tags || [],
      date: a.published_date, readTime: a.read_time, featured: a.featured,
      publishedDate: a.published_date, views: a.views,
    };
  };
  write('blog', articles.map((a) => mkArticle(a, 'en', labEn)).filter(Boolean));
  write('blog_ar', articles.filter((a) => atr[a.id]?.ar).map((a) => mkArticle(a, 'ar', labAr)).filter(Boolean));

  // team (single language)
  const team = await sel('team_members', '*', { col: 'sort' });
  write('team', team.map((t) => ({
    id: t.id, name: t.name, role: t.role, bio: t.bio, image: t.image, email: t.email,
    linkedin: t.linkedin, twitter: t.twitter, instagram: t.instagram, behance: t.behance,
    eyebrow: t.eyebrow, founderLink: t.founder_link,
  })));

  // founders + translations -> array
  const founders = await sel('founders', '*', { col: 'sort' });
  const ftr = tByLang(await sel('founder_translations'), 'founder_id');
  const mkFounder = (f, lang) => {
    const t = ftr[f.id]?.[lang] || ftr[f.id]?.en; if (!t) return null;
    return { name: t.name, eyebrow: t.eyebrow, subtitle: t.subtitle, intro: t.intro, fullBio: t.full_bio, image: f.image, tags: t.tags || [] };
  };
  write('founder', founders.map((f) => mkFounder(f, 'en')).filter(Boolean));
  write('founder_ar', founders.map((f) => mkFounder(f, 'ar')).filter(Boolean));

  // podcast + translations
  const pods = await sel('podcast_episodes', '*', { col: 'sort' });
  const ptr = tByLang(await sel('podcast_translations'), 'episode_id');
  const mkPod = (p, lang) => {
    const t = ptr[p.id]?.[lang] || ptr[p.id]?.en; if (!t) return null;
    return { id: p.id, title: t.title, description: t.description, youtubeUrl: p.youtube_url, tag: t.tag, publishedDate: p.published_date, featured: p.featured };
  };
  write('podcast', pods.map((p) => mkPod(p, 'en')).filter(Boolean));
  write('podcast_ar', pods.map((p) => mkPod(p, 'ar')).filter(Boolean));

  // partners (single language)
  const partners = await sel('partners', '*', { col: 'sort' });
  write('partners', partners.map((p) => ({
    id: p.id, name: p.name, logoUrl: p.logo_url, fallbackText: p.fallback_text, tileClass: p.tile_class,
    description: p.description, logo: p.logo, website: p.website, backgroundColor: p.background_color,
  })));

  // mena + translations
  const mena = await sel('mena_health', '*', { col: 'sort' });
  const mtr = tByLang(await sel('mena_translations'), 'country_id');
  const mkMena = (c, lang) => ({
    id: c.country_id, country: (mtr[c.country_id]?.[lang] || mtr[c.country_id]?.en)?.country || '',
    iso2: c.iso2, flag: c.flag, womensHealth: c.womens_health, chronicDisease: c.chronic_disease, cervicalCancer: c.cervical_cancer,
  });
  write('menaHealthData', mena.map((c) => mkMena(c, 'en')));
  write('menaHealthData_ar', mena.map((c) => mkMena(c, 'ar')));

  // authors
  const authors = await sel('authors', '*', { col: 'id' });
  const mkAuthor = (a) => ({ id: a.id, name: a.name, role: a.role, image: a.image, bio: a.bio, socials: a.socials || {} });
  write('authors', authors.map(mkAuthor));
  write('authors_ar', authors.map(mkAuthor));

  // site singletons (site/one already fetched above)
  if (one('about', 'en')) write('about', one('about', 'en'));
  if (one('about', 'ar')) write('about_ar', one('about', 'ar'));
  if (one('home', 'en')) write('home', one('home', 'en'));
  if (one('contact', 'en')) write('contact', one('contact', 'en'));
  if (one('ai_companion', 'en')) write('aiCompanion', one('ai_companion', 'en'));

  console.log('Done.');
}
run().catch((e) => { console.error('GENERATE FAILED:', e.message); process.exit(1); });
