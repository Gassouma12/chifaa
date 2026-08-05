// One-time (idempotent) import: www/data/*.json + www/assets images -> Supabase.
// Run:  node scripts/import-to-supabase.mjs        (from chifaa-next/)
// Needs env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE (from .env.local).
//
// Re-runnable: every write is an upsert, every image upload is upsert:true, so
// running it twice is safe. Uploads legacy images to bucket 'media' keeping their
// assets/... path as the object key (the frontend resolves assets/... -> media URL).

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');      // finalchifaa/
const DATA = path.join(ROOT, 'www', 'data');
const WWW = path.join(ROOT, 'www');

// ---- env ------------------------------------------------------------------
function loadEnv() {
  const f = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(f)) {
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE;
if (!URL || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE (put them in chifaa-next/.env.local).');
  process.exit(1);
}
const db = createClient(URL, KEY, { auth: { persistSession: false } });

// ---- helpers --------------------------------------------------------------
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
const tryJson = (f) => { try { return readJson(f); } catch { return null; } };
const arr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]);
const slugify = (s) => String(s).toLowerCase().trim()
  .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
const byId = (list) => Object.fromEntries((list || []).map((x) => [x.id, x]));

async function upsert(table, rows, onConflict) {
  if (!rows.length) return;
  const { error } = await db.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`  ${table}: ${rows.length} rows`);
}

// ---- images ---------------------------------------------------------------
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

async function uploadImages() {
  console.log('Uploading images to bucket "media"...');
  const files = [...walk(path.join(WWW, 'assets', 'images')), ...walk(path.join(WWW, 'assets', 'partners'))];
  let ok = 0;
  for (const abs of files) {
    const key = path.relative(WWW, abs).split(path.sep).join('/');   // e.g. assets/images/articles/6.png
    const ext = path.extname(abs).toLowerCase();
    const { error } = await db.storage.from('media').upload(key, fs.readFileSync(abs), {
      contentType: MIME[ext] || 'application/octet-stream', upsert: true,
    });
    if (error) { console.warn(`  ! ${key}: ${error.message}`); continue; }
    ok++;
  }
  console.log(`  uploaded ${ok}/${files.length} images`);
}

// ---- content -------------------------------------------------------------
async function run() {
  console.log(`Importing into ${URL}`);
  await uploadImages();

  // categories (single source; slugs derived from the English label actually used)
  const catEnAr = {
    'Treatment Advice': 'نصائح العلاج',
    'Advocacy': 'المناصرة',
    'Maha Jouini Stories': 'قصص مها الجويني',
    'Community Stories': 'قصص المجتمع',
    'Survivor Support': 'دعم الناجيات',
  };
  await upsert('categories', Object.entries(catEnAr).map(([en, ar], i) => ({
    slug: slugify(en), label_en: en, label_ar: ar, sort: i,
  })), 'slug');

  // articles + translations
  const blogEn = readJson('blog.json');
  const blogAr = byId(tryJson('blog_ar.json'));
  const articles = [], atr = [];
  for (const a of blogEn) {
    articles.push({
      id: a.id, slug: a.slug, status: 'published', cover_image: a.coverImage,
      author: a.author || 'Maha Jouini', author_role: a.authorRole, author_image: a.authorImage,
      category_slugs: arr(a.category).map(slugify), read_time: a.readTime || 1,
      featured: !!a.featured, published_date: a.publishedDate || a.date || null, views: a.views || 0,
    });
    atr.push({ article_id: a.id, lang: 'en', title: a.title, excerpt: a.excerpt, content: a.content, tags: arr(a.tags) });
    const ar = blogAr[a.id];
    if (ar) atr.push({ article_id: a.id, lang: 'ar', title: ar.title, excerpt: ar.excerpt, content: ar.content, tags: arr(ar.tags), ar_edited: true });
  }
  await upsert('articles', articles, 'id');
  await upsert('article_translations', atr, 'article_id,lang');

  // team (single language)
  const team = readJson('team.json').map((t, i) => ({
    id: t.id, name: t.name, role: t.role, eyebrow: t.eyebrow, bio: t.bio, image: t.image,
    email: t.email, linkedin: t.linkedin, twitter: t.twitter, instagram: t.instagram,
    behance: t.behance, founder_link: !!t.founderLink, sort: i,
  }));
  await upsert('team_members', team, 'id');

  // founders (no id in source -> index+1) + translations
  const fEn = readJson('founder.json'), fAr = tryJson('founder_ar.json') || [];
  const founders = [], ftr = [];
  fEn.forEach((f, i) => {
    const id = i + 1;
    founders.push({ id, image: f.image, sort: i });
    ftr.push({ founder_id: id, lang: 'en', name: f.name, eyebrow: f.eyebrow, subtitle: f.subtitle, intro: f.intro, full_bio: f.fullBio, tags: arr(f.tags) });
    const a = fAr[i];
    if (a) ftr.push({ founder_id: id, lang: 'ar', name: a.name, eyebrow: a.eyebrow, subtitle: a.subtitle, intro: a.intro, full_bio: a.fullBio, tags: arr(a.tags) });
  });
  await upsert('founders', founders, 'id');
  await upsert('founder_translations', ftr, 'founder_id,lang');

  // podcast + translations
  const pEn = readJson('podcast.json'), pAr = byId(tryJson('podcast_ar.json'));
  const pods = [], ptr = [];
  pEn.forEach((p, i) => {
    pods.push({ id: p.id, youtube_url: p.youtubeUrl, published_date: p.publishedDate || null, featured: !!p.featured, sort: i });
    ptr.push({ episode_id: p.id, lang: 'en', title: p.title, description: p.description, tag: p.tag });
    const a = pAr[p.id];
    if (a) ptr.push({ episode_id: p.id, lang: 'ar', title: a.title, description: a.description, tag: a.tag });
  });
  await upsert('podcast_episodes', pods, 'id');
  await upsert('podcast_translations', ptr, 'episode_id,lang');

  // partners (single language)
  const partners = readJson('partners.json').map((p, i) => ({
    id: p.id, name: p.name, description: p.description, logo: p.logo, logo_url: p.logoUrl,
    fallback_text: p.fallbackText, tile_class: p.tileClass, website: p.website,
    background_color: p.backgroundColor, sort: i,
  }));
  await upsert('partners', partners, 'id');

  // mena_health + translations
  const mEn = readJson('menaHealthData.json'), mAr = byId(tryJson('menaHealthData_ar.json'));
  const mena = [], mtr = [];
  mEn.forEach((c, i) => {
    mena.push({ country_id: c.id, iso2: c.iso2, flag: c.flag, womens_health: c.womensHealth, chronic_disease: c.chronicDisease, cervical_cancer: c.cervicalCancer, sort: i });
    mtr.push({ country_id: c.id, lang: 'en', country: c.country });
    const a = mAr[c.id];
    if (a) mtr.push({ country_id: c.id, lang: 'ar', country: a.country });
  });
  await upsert('mena_health', mena, 'country_id');
  await upsert('mena_translations', mtr, 'country_id,lang');

  // authors (optional)
  const authors = (tryJson('authors.json') || []).map((a) => ({
    id: a.id, name: a.name, role: a.role, image: a.image, bio: a.bio, socials: a.socials || {},
  }));
  await upsert('authors', authors, 'id');

  // site_content singletons
  const site = [];
  const about = tryJson('about.json'), aboutAr = tryJson('about_ar.json');
  if (about) site.push({ key: 'about', lang: 'en', data: about });
  if (aboutAr) site.push({ key: 'about', lang: 'ar', data: aboutAr });
  const home = tryJson('home.json'); if (home) site.push({ key: 'home', lang: 'en', data: home });
  const contact = tryJson('contact.json'); if (contact) site.push({ key: 'contact', lang: 'en', data: contact });
  const ai = tryJson('aiCompanion.json'); if (ai) site.push({ key: 'ai_companion', lang: 'en', data: ai });
  await upsert('site_content', site, 'key,lang');

  // fix identity sequences so new admin inserts don't collide with imported ids
  const { error: seqErr } = await db.rpc('reset_identity_sequences');
  if (seqErr) console.warn('  ! reset_identity_sequences:', seqErr.message);
  else console.log('  identity sequences reset');

  // ---- verify: read back counts ----
  console.log('\nVerification (Supabase row counts):');
  for (const t of ['categories', 'articles', 'article_translations', 'team_members',
    'founders', 'founder_translations', 'podcast_episodes', 'partners',
    'mena_health', 'mena_translations', 'authors', 'site_content']) {
    const { count } = await db.from(t).select('*', { count: 'exact', head: true });
    console.log(`  ${t}: ${count}`);
  }
  console.log('\nDone.');
}

run().catch((e) => { console.error('IMPORT FAILED:', e.message); process.exit(1); });
