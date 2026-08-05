// Auto-translate blog articles EN -> AR.
//
// Articles are authored in English (www/data/blog.json, edited via the admin).
// This script fills www/data/blog_ar.json (and the chifaa-next/public copy) with
// Arabic versions, translating ONLY articles that are new or whose English source
// changed since the last run. Existing hand-curated Arabic entries are preserved.
//
// Usage:  node scripts/translate-articles.mjs      (run from chifaa-next/)
//     or  npm run translate
//
// Translation uses the free Google translate endpoint (no API key). HTML tags are
// preserved; only text nodes are translated. Category names use a fixed map so the
// Arabic category filters on the Voices page keep matching.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

const EN_PATH = path.join(repoRoot, 'www', 'data', 'blog.json');
const AR_TARGETS = [
  path.join(repoRoot, 'www', 'data', 'blog_ar.json'),
  path.join(repoRoot, 'chifaa-next', 'public', 'data', 'blog_ar.json'),
];
const HASH_CACHE = path.join(__dirname, '.translation-hashes.json');

// EN category -> AR category. Keep these in sync with the filter list in blog.js
// so Arabic category buttons match article categories.
const CATEGORY_MAP = {
  'Maha Jouini Stories': 'قصص مها الجويني',
  'Women Testimonies': 'شهادات النساء',
  'Treatment Advice': 'نصائح العلاج',
  'AI Ethics & Health': 'أخلاقيات الذكاء الاصطناعي والصحة',
  'Mental Strength': 'القوة النفسية',
  'Advocacy': 'المناصرة',
  'Community Stories': 'قصص المجتمع',
  'Survivor Support': 'دعم الناجيات',
  'Research & Insights': 'أبحاث ورؤى',
  'Prevention & Screening': 'الوقاية والفحص',
};

const AR_AUTHOR = 'Maha Jouini';
const AR_AUTHOR_ROLE = 'المؤسِسة ومحامية الذكاء الاصطناعي';
const AR_AUTHOR_IMAGE = 'assets/images/maha.png';

const hasArabic = (s) => /[؀-ۿ]/.test(s);
const hasLatinLetters = (s) => /[A-Za-z]/.test(s);
const decodeAmp = (s) => s.replace(/&amp;/g, '&');

function srcHash(a) {
  return createHash('sha1')
    .update(JSON.stringify([a.title, a.excerpt, a.content, a.category, a.tags]))
    .digest('hex');
}

async function gtx(text, sl = 'en', tl = 'ar') {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx' +
    `&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      return data[0].map((seg) => seg[0]).join('');
    } catch (e) {
      if (attempt === 3) throw e;
      await sleep(600 * (attempt + 1)); // backoff on rate limit / transient errors
    }
  }
}

// Translate long text by splitting on sentence-ish boundaries under the endpoint's
// per-request size limit.
async function translateText(text, sl = 'en', tl = 'ar') {
  const LIMIT = 4500;
  if (text.length <= LIMIT) return gtx(text, sl, tl);
  const parts = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
  let out = '';
  let buf = '';
  for (const p of parts) {
    if ((buf + p).length > LIMIT) {
      out += await gtx(buf, sl, tl);
      buf = '';
      await sleep(120);
    }
    buf += p;
  }
  if (buf) out += await gtx(buf, sl, tl);
  return out;
}

function tokenizeHtml(html) {
  const tokens = [];
  const re = /<[^>]+>/g;
  let last = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m.index > last) tokens.push({ t: 'text', v: html.slice(last, m.index) });
    tokens.push({ t: 'tag', v: m[0] });
    last = re.lastIndex;
  }
  if (last < html.length) tokens.push({ t: 'text', v: html.slice(last) });
  return tokens;
}

async function translateHtml(html) {
  const tokens = tokenizeHtml(html);
  for (const tok of tokens) {
    if (tok.t !== 'text') continue;
    const raw = tok.v;
    const trimmed = raw.trim();
    if (!trimmed) continue; // whitespace only
    if (hasArabic(trimmed)) continue; // already Arabic (e.g. embedded proverb)
    if (!hasLatinLetters(trimmed)) continue; // numbers / punctuation only
    const lead = raw.match(/^\s*/)[0];
    const trail = raw.match(/\s*$/)[0];
    const translated = await translateText(decodeAmp(trimmed), 'en', 'ar');
    tok.v = lead + translated + trail;
    await sleep(120); // be polite to the free endpoint
  }
  return tokens.map((t) => t.v).join('');
}

async function translateCategory(c) {
  if (CATEGORY_MAP[c]) return CATEGORY_MAP[c];
  return gtx(c, 'en', 'ar');
}

async function main() {
  const en = JSON.parse(readFileSync(EN_PATH, 'utf8'));
  const existingAr = existsSync(AR_TARGETS[0])
    ? JSON.parse(readFileSync(AR_TARGETS[0], 'utf8'))
    : [];
  const arById = new Map(existingAr.map((a) => [a.id, a]));
  const hashes = existsSync(HASH_CACHE) ? JSON.parse(readFileSync(HASH_CACHE, 'utf8')) : {};

  const out = [];
  let translatedCount = 0;

  for (const a of en) {
    const hash = srcHash(a);
    const existing = arById.get(a.id);

    // Up to date, or a pre-existing hand-curated entry we don't want to overwrite:
    // keep it and just record the current hash so future EN edits trigger a refresh.
    if (existing && (hashes[a.id] === hash || hashes[a.id] === undefined)) {
      out.push(existing);
      hashes[a.id] = hash;
      continue;
    }

    console.log(`Translating #${a.id} (${a.slug}) ...`);
    const cats = Array.isArray(a.category) ? a.category : [a.category];
    const arArticle = {
      ...a,
      title: await translateText(a.title, 'en', 'ar'),
      excerpt: await translateText(a.excerpt, 'en', 'ar'),
      content: await translateHtml(a.content),
      category: await Promise.all(cats.map(translateCategory)),
      tags: a.tags
        ? await Promise.all(a.tags.map((t) => (hasArabic(t) ? t : gtx(t, 'en', 'ar'))))
        : [],
      author: AR_AUTHOR,
      authorRole: AR_AUTHOR_ROLE,
      authorImage: AR_AUTHOR_IMAGE,
    };
    out.push(arArticle);
    hashes[a.id] = hash;
    translatedCount++;
  }

  const json = JSON.stringify(out, null, 4);
  for (const target of AR_TARGETS) writeFileSync(target, json);
  writeFileSync(HASH_CACHE, JSON.stringify(hashes, null, 2));

  console.log(
    `\nDone. ${out.length} Arabic articles (${translatedCount} newly translated).`
  );
  console.log('Wrote:', AR_TARGETS.map((t) => path.relative(repoRoot, t)).join(', '));
}

main().catch((e) => {
  console.error('Translation failed:', e.message);
  process.exit(1);
});
