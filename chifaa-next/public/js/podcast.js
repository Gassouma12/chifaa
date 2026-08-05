function getYoutubeEmbedUrl(url) {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    let id = '';

    if (parsed.hostname.includes('youtu.be')) {
      id = parsed.pathname.slice(1);
    } else if (parsed.pathname.includes('/embed/')) {
      id = parsed.pathname.split('/embed/')[1];
    } else {
      id = parsed.searchParams.get('v') || '';
    }

    id = id.split(/[?&/]/)[0];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  } catch (error) {
    return url;
  }
}

function formatPodcastDate(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function renderPodcastEpisodes(episodes) {
  const grid = document.getElementById('podcastGrid');
  if (!grid) return;

  grid.innerHTML = episodes.map(episode => `
    <div class="podcast-card ${episode.featured ? 'featured' : ''}">
      <div class="podcast-video">
        <iframe src="${getYoutubeEmbedUrl(episode.youtubeUrl)}" title="${episode.title || 'Podcast episode'}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="podcast-content">
        <div class="podcast-meta">
          <span class="podcast-tag">${episode.tag || 'Podcast'}</span>
          <span class="podcast-date">${formatPodcastDate(episode.publishedDate)}</span>
        </div>
        <h3 class="podcast-title">${episode.title || ''}</h3>
        <p class="podcast-desc">${episode.description || ''}</p>
      </div>
    </div>
  `).join('');
}

async function loadPodcastEpisodes() {
  try {
    const lang = localStorage.getItem('chifaa_lang') || 'en';
    const jsonFile = lang === 'ar' ? '/data/podcast_ar.json' : '/data/podcast.json';
    const response = await fetch(`${jsonFile}?_=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Podcast data unavailable');
    const episodes = await response.json();
    if (Array.isArray(episodes)) renderPodcastEpisodes(episodes);
  } catch (error) {
    console.warn('Using hardcoded podcast fallback:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadPodcastEpisodes);
