import PageShell from '@/components/PageShell';
import { readData } from '@/lib/data';

export const metadata = {
  title: 'Podcast',
  description:
    'The Chifaa Podcast: conversations, survivor stories, and expert insights on cancer care, AI ethics, and women’s health across the MENA region.',
  alternates: { canonical: '/podcast.html' },
};

const SCRIPTS = [
  '/js/i18n.js',
  '/js/script.js',
  '/js/header.js',
  '/js/splash-cursor.js',
  '/js/podcast.js',
  '/js/music-player.js',
];

// Mirrors getYoutubeEmbedUrl in podcast.js
function youtubeEmbedUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    let id = '';
    if (parsed.hostname.includes('youtu.be')) id = parsed.pathname.slice(1);
    else if (parsed.pathname.includes('/embed/')) id = parsed.pathname.split('/embed/')[1];
    else id = parsed.searchParams.get('v') || '';
    id = id.split(/[?&/]/)[0];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  } catch {
    return url;
  }
}

// Mirrors formatPodcastDate in podcast.js
function formatPodcastDate(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

export default function PodcastPage() {
  const episodes = readData('podcast');

  return (
    <PageShell
      faUrl="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      css={['/css/podcast.css']}
      scripts={SCRIPTS}
    >
      <main className="podcast-main">
        <section className="podcast-hero">
          <div className="podcast-container text-center">
            <span className="hero-badge text-accent" data-i18n="podcast.heroBadge">Listen &amp; Learn</span>
            <h1 className="podcast-hero-title" data-i18n="podcast.heroTitle">Chifaa Podcast</h1>
            <p className="podcast-hero-subtitle" data-i18n="podcast.heroSubtitle">
              Engaging conversations, inspiring stories, and expert insights on mental health, AI, and youth empowerment.
            </p>
          </div>
        </section>

        <section className="podcast-list-section">
          <div className="podcast-container">
            <div className="podcast-grid" id="podcastGrid">
              {episodes.map((episode) => (
                <div key={episode.id} className={`podcast-card ${episode.featured ? 'featured' : ''}`}>
                  <div className="podcast-video">
                    <iframe
                      src={youtubeEmbedUrl(episode.youtubeUrl)}
                      title={episode.title || 'Podcast episode'}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="podcast-content">
                    <div className="podcast-meta">
                      <span className="podcast-tag">{episode.tag || 'Podcast'}</span>
                      <span className="podcast-date">{formatPodcastDate(episode.publishedDate)}</span>
                    </div>
                    <h3 className="podcast-title">{episode.title || ''}</h3>
                    <p className="podcast-desc">{episode.description || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
