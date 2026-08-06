// Auto-translate EN -> AR directly in Supabase (runs in CI before build).
// Only translates articles that are new or whose English changed since last run
// (hash cache stored in site_content). Never overwrites hand-edited AR (ar_edited).
//
// Usage: node scripts/translate-supabase.mjs   (needs SUPABASE_SERVICE_ROLE)

import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envFile)) for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE;
if (!URL || !KEY) { console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE'); process.exit(1); }
const db = createClient(URL, KEY, { auth: { persistSession: false } });

const hasArabic = (s) => /[؀-ۿ]/.test(s);
const hasLatin = (s) => /[A-Za-z]/.test(s);
const decodeAmp = (s) => s.replace(/&amp;/g, '&');
const srcHash = (t) => createHash('sha1').update(JSON.stringify([t.title, t.excerpt, t.content, t.tags])).digest('hex');

async function gtx(text, sl = 'en', tl = 'ar') {
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx' +
    `&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
  for (let i = 0; i < 4; i++) {
    try {
      const res = await fetch(url); if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json(); return data[0].map((s) => s[0]).join('');
    } catch (e) { if (i === 3) throw e; await sleep(600 * (i + 1)); }
  }
}
async function translateText(text, sl = 'en', tl = 'ar') {
  const LIMIT = 4500; if (!text) return text; if (text.length <= LIMIT) return gtx(text, sl, tl);
  const parts = text.match(/[^.!?]+[.!?]*\s*/g) || [text]; let out = '', buf = '';
  for (const p of parts) { if ((buf + p).length > LIMIT) { out += await gtx(buf, sl, tl); buf = ''; await sleep(120); } buf += p; }
  if (buf) out += await gtx(buf, sl, tl); return out;
}
function tokenizeHtml(html) {
  const tokens = []; const re = /<[^>]+>/g; let last = 0, m;
  while ((m = re.exec(html))) { if (m.index > last) tokens.push({ t: 'text', v: html.slice(last, m.index) }); tokens.push({ t: 'tag', v: m[0] }); last = re.lastIndex; }
  if (last < html.length) tokens.push({ t: 'text', v: html.slice(last) }); return tokens;
}
async function translateHtml(html) {
  if (!html) return html; const tokens = tokenizeHtml(html);
  for (const tok of tokens) {
    if (tok.t !== 'text') continue; const trimmed = tok.v.trim();
    if (!trimmed || hasArabic(trimmed) || !hasLatin(trimmed)) continue;
    const lead = tok.v.match(/^\s*/)[0], trail = tok.v.match(/\s*$/)[0];
    tok.v = lead + await translateText(decodeAmp(trimmed)) + trail; await sleep(120);
  }
  return tokens.map((t) => t.v).join('');
}

async function run() {
  const { data: articles } = await db.from('articles').select('id');
  const { data: tx } = await db.from('article_translations').select('*');
  const byId = {}; for (const r of tx || []) (byId[r.article_id] ??= {})[r.lang] = r;
  const hashRow = (await db.from('site_content').select('data').eq('key', 'translation_hashes').eq('lang', 'en').maybeSingle()).data;
  const hashes = hashRow?.data || {};

  let done = 0;
  for (const a of articles || []) {
    const en = byId[a.id]?.en, ar = byId[a.id]?.ar; if (!en) continue;
    const h = srcHash(en);
    if (ar?.ar_edited) { hashes[a.id] = h; continue; }        // hand-polished, leave it
    if (ar && hashes[a.id] === h) continue;                    // up to date
    console.log(`Translating article #${a.id} ...`);
    const row = {
      article_id: a.id, lang: 'ar', ar_edited: false,
      title: await translateText(en.title),
      excerpt: await translateText(en.excerpt),
      content: await translateHtml(en.content),
      tags: en.tags ? await Promise.all(en.tags.map((t) => (hasArabic(t) ? t : gtx(t)))) : [],
    };
    const { error } = await db.from('article_translations').upsert(row, { onConflict: 'article_id,lang' });
    if (error) throw new Error(error.message);
    hashes[a.id] = h; done++;
  }
  await db.from('site_content').upsert({ key: 'translation_hashes', lang: 'en', data: hashes }, { onConflict: 'key,lang' });
  console.log(`Done. ${done} article(s) translated.`);
}
run().catch((e) => { console.error('Translate failed:', e.message); process.exit(1); });
