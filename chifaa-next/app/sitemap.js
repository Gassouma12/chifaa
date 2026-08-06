import { getArticles } from '@/lib/data';

const BASE = 'https://chifaa.org';

export const dynamic = 'force-static';

export default function sitemap() {
  const pages = [
    { path: '/', priority: 1.0 },
    { path: '/about/', priority: 0.9 },
    { path: '/founder/', priority: 0.9 },
    { path: '/meet-the-team/', priority: 0.8 },
    { path: '/voices/', priority: 0.9 },
    { path: '/podcast/', priority: 0.7 },
    { path: '/ai-companion/', priority: 0.5 },
    { path: '/ai-game/', priority: 0.4 },
    { path: '/brandbook/', priority: 0.3 },
  ].map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority,
  }));

  const articles = getArticles()
    .filter((a) => a.slug)
    .map((a) => ({
      url: `${BASE}/articles/${a.slug}/`,
      lastModified: a.publishedDate ? new Date(a.publishedDate) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  return [...pages, ...articles];
}
