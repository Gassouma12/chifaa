import { getArticles } from '@/lib/data';

const BASE = 'https://chifaa.org';

export const dynamic = 'force-static';

export default function sitemap() {
  const pages = [
    { path: '/index.html', priority: 1.0 },
    { path: '/about.html', priority: 0.9 },
    { path: '/founder.html', priority: 0.9 },
    { path: '/meet-the-team.html', priority: 0.8 },
    { path: '/voices.html', priority: 0.9 },
    { path: '/podcast.html', priority: 0.7 },
    { path: '/ai-companion.html', priority: 0.5 },
    { path: '/partners.html', priority: 0.5 },
    { path: '/brandbook.html', priority: 0.3 },
  ].map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority,
  }));

  const articles = getArticles()
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${BASE}/articles/${a.slug}.html`,
      lastModified: a.publishedDate ? new Date(a.publishedDate) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  return [...pages, ...articles];
}
