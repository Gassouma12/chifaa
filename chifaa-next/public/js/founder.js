async function loadFounderContent() {
  try {
    const lang = localStorage.getItem('chifaa_lang') || 'en';
    const jsonFile = lang === 'ar' ? '/data/founder_ar.json' : '/data/founder.json';
    const response = await fetch(`${jsonFile}?_=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Founder data unavailable');
    const data = await response.json();
    const founders = Array.isArray(data) ? data : [data]; // back-compat with single-object shape

    const hero = document.querySelector('.founder-hero');
    if (!hero) return;
    hero.innerHTML = founders.map(founderBlockHTML).join('');
  } catch (error) {
    console.warn('Using hardcoded founder fallback:', error);
  }
}

function founderBlockHTML(f) {
  const tags = (Array.isArray(f.tags) ? f.tags : [])
    .map(tag => `<span class="ftag">${tag}</span>`).join('');
  return `
    <div class="founder-hero-container">
      <div class="founder-image-col">
        <div class="wavy-frame">
          <img src="${f.image || ''}" alt="${f.name || 'Founder'}">
        </div>
      </div>
      <div class="founder-content-col">
        <div class="founder-eyebrow">${f.eyebrow || 'ABOUT THE FOUNDER'}</div>
        <h1 class="founder-title">${f.name || ''}</h1>
        <h2 class="founder-subtitle">${f.subtitle || ''}</h2>
        ${f.intro ? `<p class="founder-intro">${f.intro}</p>` : ''}
        <div class="founder-bio">${f.fullBio || ''}</div>
        ${tags ? `<div class="founder-tags">${tags}</div>` : ''}
      </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', loadFounderContent);
