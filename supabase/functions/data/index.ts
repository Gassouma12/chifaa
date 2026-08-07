// Supabase Edge Function: "data"
// Serves the site's content LIVE from the database, in the EXACT same JSON
// shapes as scripts/generate-data.mjs produces for the static build. The public
// site's fetch-shim points /data/<name>.json at this function, so any admin edit
// is visible on the live site immediately — no rebuild/redeploy needed.
//
// Reads use the anon key -> RLS returns published rows only (drafts stay hidden).
// Public (no auth): deploy with --no-verify-jwt.
//
// Deploy: supabase functions deploy data --no-verify-jwt --project-ref rgptwhksojbxwcnezokf

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPA_URL = Deno.env.get('SUPABASE_URL')!;
const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const db = createClient(SUPA_URL, ANON, { auth: { persistSession: false } });

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  // Small TTL: effectively real-time, but lets any CDN/browser coalesce bursts.
  'Cache-Control': 'public, max-age=15',
};

const STORAGE = `${SUPA_URL}/storage/v1/object/public/media/`;
const abs = (p: unknown) => {
  if (typeof p !== 'string' || !p) return p;
  if (/^(https?:|data:)/i.test(p) || p.startsWith('/')) return p;
  if (p.startsWith('assets/')) return '/' + p;
  return STORAGE + p.replace(/^\/+/, '');
};
const absHtml = (h: unknown) => typeof h === 'string'
  ? h.replace(/(src|href)=(["'])(?:\.{0,2}\/)?(assets\/[^"']+)\2/g, (_m, a, q, v) => `${a}=${q}/${v}${q}`)
     .replace(/(src|href)=(["'])(uploads\/[^"']+)\2/g, (_m, a, q, v) => `${a}=${q}${STORAGE}${v}${q}`)
  : h;

async function sel(table: string, cols = '*', order?: { col: string; asc?: boolean }) {
  let q = db.from(table).select(cols);
  if (order) q = q.order(order.col, { ascending: order.asc ?? true });
  const { data, error } = await q;
  if (error) throw new Error(`${table}: ${error.message}`);
  return (data || []) as any[];
}
const tByLang = (rows: any[], idKey: string) => {
  const m: Record<string, any> = {};
  for (const r of rows) (m[r[idKey]] ??= {})[r.lang] = r;
  return m;
};

async function siteMaps() {
  const site = await sel('site_content');
  const one = (key: string, lang: string) => site.find((s) => s.key === key && s.lang === lang)?.data;
  return { site, one };
}

// --- per-file builders (only queries what the requested file needs) ----------
const builders: Record<string, () => Promise<unknown>> = {
  categories: async () => {
    const cats = await sel('categories', '*', { col: 'sort' });
    return { en: cats.map((c) => c.label_en), ar: cats.map((c) => c.label_ar) };
  },
  blog: () => blog('en'),
  blog_ar: () => blog('ar'),
  team: async () => {
    const team = await sel('team_members', '*', { col: 'sort' });
    return team.map((t) => ({
      id: t.id, name: t.name, role: t.role, bio: t.bio, image: abs(t.image), email: t.email,
      linkedin: t.linkedin, twitter: t.twitter, instagram: t.instagram, behance: t.behance,
      eyebrow: t.eyebrow, founderLink: t.founder_link,
    }));
  },
  founder: () => founder('en'),
  founder_ar: () => founder('ar'),
  podcast: () => podcast('en'),
  podcast_ar: () => podcast('ar'),
  partners: async () => {
    const partners = await sel('partners', '*', { col: 'sort' });
    return partners.map((p) => ({
      id: p.id, name: p.name, logoUrl: p.logo_url, fallbackText: p.fallback_text, tileClass: p.tile_class,
      description: p.description, logo: p.logo, website: p.website, backgroundColor: p.background_color,
    }));
  },
  menaHealthData: () => mena('en'),
  menaHealthData_ar: () => mena('ar'),
  authors: () => authors(),
  authors_ar: () => authors(),
  about: async () => (await siteMaps()).one('about', 'en') ?? null,
  about_ar: async () => (await siteMaps()).one('about', 'ar') ?? null,
  home: async () => (await siteMaps()).one('home', 'en') ?? null,
  contact: async () => (await siteMaps()).one('contact', 'en') ?? null,
  aiCompanion: async () => (await siteMaps()).one('ai_companion', 'en') ?? null,
};

async function blog(lang: 'en' | 'ar') {
  const cats = await sel('categories', '*', { col: 'sort' });
  const labels = Object.fromEntries(cats.map((c) => [c.slug, lang === 'ar' ? c.label_ar : c.label_en]));
  const { one } = await siteMaps();
  const authorEn = one('author', 'en') || {};
  const au = lang === 'ar' ? { ...authorEn, ...(one('author', 'ar') || {}) } : authorEn;
  const articles = await sel('articles', '*', { col: 'published_date', asc: false });
  const atr = tByLang(await sel('article_translations'), 'article_id');
  const mk = (a: any) => {
    const t = atr[a.id]?.[lang] || atr[a.id]?.en; if (!t) return null;
    return {
      id: a.id, title: t.title, slug: a.slug, author: au.name || a.author, authorRole: au.role || a.author_role,
      authorImage: abs(au.image || a.author_image), coverImage: abs(a.cover_image), excerpt: t.excerpt, content: absHtml(t.content),
      category: (a.category_slugs || []).map((s: string) => labels[s] || s), tags: t.tags || [],
      date: a.published_date, readTime: a.read_time, featured: a.featured,
      publishedDate: a.published_date, views: a.views,
    };
  };
  const rows = lang === 'ar' ? articles.filter((a) => atr[a.id]?.ar) : articles;
  return rows.map(mk).filter(Boolean);
}

async function founder(lang: 'en' | 'ar') {
  const founders = await sel('founders', '*', { col: 'sort' });
  const ftr = tByLang(await sel('founder_translations'), 'founder_id');
  return founders.map((f) => {
    const t = ftr[f.id]?.[lang] || ftr[f.id]?.en; if (!t) return null;
    return { name: t.name, eyebrow: t.eyebrow, subtitle: t.subtitle, intro: t.intro, fullBio: absHtml(t.full_bio), image: abs(f.image), tags: t.tags || [] };
  }).filter(Boolean);
}

async function podcast(lang: 'en' | 'ar') {
  const pods = await sel('podcast_episodes', '*', { col: 'sort' });
  const ptr = tByLang(await sel('podcast_translations'), 'episode_id');
  return pods.map((p) => {
    const t = ptr[p.id]?.[lang] || ptr[p.id]?.en; if (!t) return null;
    return { id: p.id, title: t.title, description: t.description, youtubeUrl: p.youtube_url, tag: t.tag, publishedDate: p.published_date, featured: p.featured };
  }).filter(Boolean);
}

async function mena(lang: 'en' | 'ar') {
  const rows = await sel('mena_health', '*', { col: 'sort' });
  const mtr = tByLang(await sel('mena_translations'), 'country_id');
  return rows.map((c) => ({
    id: c.country_id, country: (mtr[c.country_id]?.[lang] || mtr[c.country_id]?.en)?.country || '',
    iso2: c.iso2, flag: c.flag, womensHealth: c.womens_health, chronicDisease: c.chronic_disease, cervicalCancer: c.cervical_cancer,
  }));
}

async function authors() {
  const rows = await sel('authors', '*', { col: 'id' });
  return rows.map((a) => ({ id: a.id, name: a.name, role: a.role, image: abs(a.image), bio: a.bio, socials: a.socials || {} }));
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const u = new URL(req.url);
    // file from last path segment (…/data/team) or ?file=team
    const seg = u.pathname.split('/').filter(Boolean).pop() || '';
    const file = (u.searchParams.get('file') || (seg === 'data' ? '' : seg)).replace(/\.json$/, '');
    const build = builders[file];
    if (!build) return json({ error: `unknown file: ${file}` }, 404);
    return json(await build());
  } catch (e) {
    return json({ error: String((e as Error)?.message || e) }, 500);
  }
});
