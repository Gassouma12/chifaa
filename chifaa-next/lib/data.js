import fs from 'node:fs';
import path from 'node:path';

// Build-time readers over the same JSON files the legacy scripts fetch at
// runtime. Pages pre-render this content for SEO; the legacy scripts then
// re-render client-side from /data/*.json, so admin-panel edits still show
// without a rebuild (crawlers see the build-time snapshot).

const dataDir = path.join(process.cwd(), 'public', 'data');

export function readData(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, `${name}.json`), 'utf8'));
}

export function articleImage(article) {
  // coverImage is the single source of truth (kept in sync with the admin).
  const cover = article.coverImage || '';
  // Normalize relative asset paths so links work from /articles/<slug>.html
  if (!cover || cover.startsWith('/') || cover.startsWith('http')) return cover;
  return `/${cover}`;
}

export function formatDateLong(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatDateShort(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function formatViews(views) {
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K views';
  return views + ' views';
}

export function getArticles() {
  return readData('blog');
}

export function getArticleBySlug(slug) {
  return getArticles().find((a) => a.slug === slug);
}

export function getAuthors() {
  return readData('authors');
}
