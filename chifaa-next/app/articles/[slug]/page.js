import PageShell from '@/components/PageShell';
import {
  getArticles, getArticleBySlug, getAuthors,
  articleImage, formatDateLong, formatDateShort, formatViews,
} from '@/lib/data';

// Pre-render every article from blog.json at build time. This is the main
// SEO upgrade over the legacy site, where article content only existed after
// client-side JS ran and was invisible to crawlers.
export function generateStaticParams() {
  return getArticles()
    .filter((a) => a.slug)
    .map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}.html` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedDate,
      authors: [article.author],
      images: [articleImage(article)],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  };
}

const SCRIPTS = [
  '/js/i18n.js',
  '/js/script.js',
  '/js/header.js',
  '/js/splash-cursor.js',
  '/js/music-player.js',
  '/js/article-i18n.js',
  '/js/article-share.js',
];

const SHARE_ICONS = {
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
};

function AuthorSocialIcon({ href, title, path }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="social-icon" title={title}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
    </a>
  );
}

function RelatedCard({ article }) {
  const categories = Array.isArray(article.category) ? article.category : [article.category];
  const href = article.slug ? `/articles/${article.slug}.html` : `/article.html?id=${article.id}`;
  return (
    <a className="related-card" href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <img src={articleImage(article)} alt={article.title} className="related-card-image" loading="lazy" />
      <div className="related-card-content">
        {categories.map((cat) => <span key={cat} className="related-card-category">{cat}</span>)}
        <h3 className="related-card-title">{article.title}</h3>
        <div className="related-card-meta">
          <span>{formatDateShort(article.publishedDate)}</span>
          <span>•</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </a>
  );
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const articles = getArticles();
  const authors = getAuthors();

  const author = authors.find((a) => a.name === article.author);
  const rawImg = author?.image || article.authorImage || 'https://placehold.co/64x64';
  const authorImg = rawImg.startsWith('/') || rawImg.startsWith('http') ? rawImg : `/${rawImg}`;
  const authorRole = author?.role || article.authorRole || '';
  const authorSocials = author?.socials || {};
  const categories = Array.isArray(article.category) ? article.category : [article.category];

  let related = articles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);
  if (related.length === 0) {
    related = articles.filter((a) => a.id !== article.id).slice(0, 3);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: articleImage(article),
    datePublished: article.publishedDate,
    author: { '@type': 'Person', name: article.author },
    publisher: { '@type': 'Organization', name: 'Chifaa' },
    mainEntityOfPage: `https://chifaa.org/articles/${article.slug}.html`,
  };

  return (
    <PageShell active="voices" css={['/css/article.css']} scripts={SCRIPTS}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="article-container">
        <div className="back-nav">
          <a href="/voices.html" className="back-btn">
            <i className="fas fa-arrow-left"></i> <span data-i18n="article.back">Back to Voices</span>
          </a>
        </div>

        <article id="article-content">
          <div className="article-header">
            <div className="article-category" id="article-category">
              {categories.map((cat) => <span key={cat} className="article-category-chip">{cat}</span>)}
            </div>
            <h1 className="article-title" id="article-title">{article.title}</h1>
            <div className="article-meta">
              <div className="article-author">
                <img id="author-image" src={authorImg} alt={article.author} className="article-author-image" />
                <div className="article-author-info">
                  <div className="article-author-name" id="author-name">{article.author}</div>
                  <div className="article-author-role" id="author-role">{authorRole}</div>
                </div>
                <div className="article-author-socials" id="author-socials" style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
                  {authorSocials.facebook && <AuthorSocialIcon href={authorSocials.facebook} title="Facebook" path={SHARE_ICONS.facebook} />}
                  {authorSocials.instagram && <AuthorSocialIcon href={authorSocials.instagram} title="Instagram" path={SHARE_ICONS.instagram} />}
                  {authorSocials.linkedin && <AuthorSocialIcon href={authorSocials.linkedin} title="LinkedIn" path={SHARE_ICONS.linkedin} />}
                </div>
              </div>
              <div className="article-meta-secondary">
                <span id="article-date">{formatDateLong(article.publishedDate)}</span>
                <span className="article-meta-divider">&bull;</span>
                <span id="article-read-time">{article.readTime} min read</span>
                <span className="article-meta-divider">&bull;</span>
                <span id="article-views">{formatViews(article.views)}</span>
              </div>
            </div>
          </div>

          <div className="article-cover">
            <img id="article-cover-image" src={articleImage(article)} alt={article.title} loading="lazy" />
          </div>

          <div className="article-body">
            <div id="article-text" dangerouslySetInnerHTML={{ __html: article.content }} />

            <div className="article-tags" id="article-tags">
              {article.tags.map((tag) => <span key={tag} className="article-tag">{tag}</span>)}
            </div>

            {/* Share Section */}
            <div className="article-share" id="article-share">
              <div className="article-share-label" data-i18n="article.shareTitle">Share this article</div>
              <div className="article-share-buttons">
                <a href="#" className="share-btn share-facebook" data-network="facebook" aria-label="Share on Facebook" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={SHARE_ICONS.facebook} /></svg>
                  <span>Facebook</span>
                </a>
                <a href="#" className="share-btn share-linkedin" data-network="linkedin" aria-label="Share on LinkedIn" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={SHARE_ICONS.linkedin} /></svg>
                  <span>LinkedIn</span>
                </a>
                <a href="#" className="share-btn share-whatsapp" data-network="whatsapp" target="_blank" aria-label="Share on WhatsApp" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={SHARE_ICONS.whatsapp} /></svg>
                  <span>WhatsApp</span>
                </a>
                <button type="button" className="share-btn share-instagram" data-network="instagram" aria-label="Copy link to share on Instagram">
                  <svg className="share-ig-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={SHARE_ICONS.instagram} /></svg>
                  <svg className="share-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>Instagram</span>
                </button>
              </div>
              <div className="share-toast" id="share-toast" role="status" aria-live="polite" data-i18n="article.copied">
                Link copied, paste it on Instagram
              </div>
            </div>
          </div>
        </article>

        <section className="related-articles">
          <h2>Related Articles</h2>
          <div className="related-grid" id="related-grid">
            {related.map((a) => <RelatedCard key={a.id} article={a} />)}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
