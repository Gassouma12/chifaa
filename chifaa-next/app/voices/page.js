import PageShell from '@/components/PageShell';
import { getArticles, getAuthors, articleImage, formatDateShort } from '@/lib/data';

export const metadata = {
  title: 'Voices of Healing',
  description:
    'Personal stories from Maha Jouini, women’s testimonies, treatment advice, AI ethics & health, and mental strength: voices of cancer patients and survivors in North Africa.',
  alternates: { canonical: '/voices.html' },
};

const SCRIPTS = [
  '/js/i18n.js',
  '/js/script.js',
  '/js/header.js',
  '/js/splash-cursor.js',
  '/js/blog.js',
  '/js/music-player.js',
];

// Server-side replica of createBlogCard in blog.js (SEO snapshot; blog.js
// re-renders the grids client-side with search/filter interactivity).
function BlogCard({ article, authors, isFeatured = false }) {
  const categories = Array.isArray(article.category) ? article.category : [article.category];
  const author = authors.find((a) => a.name === article.author);
  const rawImg = author?.image || article.authorImage || 'https://placehold.co/64x64';
  const authorImg = rawImg.startsWith('/') || rawImg.startsWith('http') ? rawImg : `/${rawImg}`;
  const authorRole = author?.role || article.authorRole || '';
  const href = article.slug ? `/articles/${article.slug}/` : `/article/?id=${article.id}`;

  return (
    <article className={`blog-card ${isFeatured ? 'featured' : ''}`} data-id={String(article.id)} data-slug={article.slug || ''}>
      <a href={href} style={{ display: 'contents', color: 'inherit', textDecoration: 'none' }}>
        <img src={articleImage(article)} alt={article.title} className="blog-card-image" loading="lazy" />
        <div className="blog-card-content">
          <div className="blog-card-meta">
            {categories.map((cat) => <span key={cat} className="blog-category">{cat}</span>)}
            <span className="blog-read-time">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {article.readTime} min read
            </span>
          </div>
          <h2 className="blog-card-title">{article.title}</h2>
          <p className="blog-card-excerpt">{article.excerpt}</p>
          <div className="blog-tags">
            {article.tags.slice(0, 3).map((tag) => <span key={tag} className="blog-tag">{tag}</span>)}
          </div>
          <div className="blog-card-footer">
            <div className="blog-author">
              <img src={authorImg} alt={article.author} className="blog-author-image" />
              <div className="blog-author-info">
                <div className="blog-author-name">{article.author}</div>
                <div className="blog-author-role">{authorRole}</div>
              </div>
            </div>
            <div className="blog-date">{formatDateShort(article.publishedDate)}</div>
          </div>
        </div>
      </a>
    </article>
  );
}

export default function VoicesPage() {
  const articles = getArticles();
  const authors = getAuthors();
  const featured = articles.filter((a) => a.featured).slice(0, 3);
  const featuredIds = featured.map((a) => a.id);
  const regular = articles.filter((a) => !featuredIds.includes(a.id));

  return (
    <PageShell
      faUrl="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      css={['/css/blog.css']}
      scripts={SCRIPTS}
    >
      <main className="page-container">
        <h1 data-i18n="voices.pageTitle">Voices of Healing</h1>
        <p className="page-subtitle" data-i18n="voices.pageSubtitle">
          Personal stories from Maha Jouini &middot; Women testimonies &middot; Advice during treatment &middot; AI ethics &amp; health &middot; Mental strength
        </p>

        <div className="blog-search">
          <input type="text" id="search-input" data-i18n-placeholder="voices.searchPlaceholder" placeholder="Search voices..." />
          <button id="search-btn" aria-label="Search">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="blog-filters">
          <button className="filter-btn active" data-category="all" data-i18n="voices.filterAll">All</button>
        </div>

        <div className="featured-section" id="featured-section">
          <span className="featured-label" data-i18n="voices.featuredLabel">&#10024; Featured</span>
          <div className="featured-grid" id="featured-grid">
            {featured.map((a) => <BlogCard key={a.id} article={a} authors={authors} isFeatured />)}
          </div>
        </div>

        <div className="blog-grid" id="blog-grid">
          {regular.map((a) => <BlogCard key={a.id} article={a} authors={authors} />)}
        </div>

        <div className="empty-state" id="empty-state" style={{ display: 'none' }}>
          <h3 data-i18n="voices.noArticles">No articles found</h3>
          <p data-i18n="voices.noArticlesDesc">Try adjusting your search or filters</p>
        </div>

        <button className="load-more" id="load-more" data-i18n="voices.loadMore">Load more articles</button>
      </main>
    </PageShell>
  );
}
