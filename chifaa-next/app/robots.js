export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/article.html'],
      },
    ],
    sitemap: 'https://chifaa.org/sitemap.xml',
  };
}
