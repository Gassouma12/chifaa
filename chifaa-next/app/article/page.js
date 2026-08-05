import { getArticles } from '@/lib/data';
import ArticleRedirect from './redirect-client';

// Exports as out/article.html so legacy links (article.html?id=N) keep
// working: the page forwards to the pre-rendered /articles/<slug>.html.
export const metadata = {
  title: 'Article',
  robots: { index: false }, // redirect shim: slug pages are the canonical ones
};

export default function LegacyArticlePage() {
  const idToSlug = Object.fromEntries(
    getArticles().filter((a) => a.slug).map((a) => [String(a.id), a.slug])
  );

  return (
    <main style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ArticleRedirect idToSlug={idToSlug} />
      <p>Redirecting&hellip;</p>
    </main>
  );
}
