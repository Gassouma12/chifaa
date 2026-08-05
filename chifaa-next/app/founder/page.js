import PageShell from '@/components/PageShell';
import { readData } from '@/lib/data';

export const metadata = {
  title: 'About the Founders',
  description:
    'Meet the founders of Chifaa: Maha Jouini, AI governance expert and cancer survivor, and Dr. Chaker Essid, AI specialist, building human-centered AI for cancer patients in North Africa.',
  alternates: { canonical: '/founder.html' },
};

const SCRIPTS = [
  '/js/i18n.js',
  '/js/header.js',
  '/js/splash-cursor.js',
  '/js/music-player.js',
  '/js/founder.js',
];

export default function FounderPage() {
  const data = readData('founder');
  const founders = Array.isArray(data) ? data : [data];

  return (
    <PageShell css={['/css/on-founders.css']} scripts={SCRIPTS}>
      <main className="founder-hero">
        {founders.map((f) => (
          <div className="founder-hero-container" key={f.name}>
            <div className="founder-image-col">
              <div className="wavy-frame">
                <img src={f.image?.startsWith('/') ? f.image : `/${f.image || ''}`} alt={f.name || 'Founder'} />
              </div>
            </div>
            <div className="founder-content-col">
              <div className="founder-eyebrow">{f.eyebrow || 'ABOUT THE FOUNDER'}</div>
              <h1 className="founder-title">{f.name || ''}</h1>
              <h2 className="founder-subtitle">{f.subtitle || ''}</h2>
              {f.intro ? <p className="founder-intro">{f.intro}</p> : null}
              <div className="founder-bio" dangerouslySetInnerHTML={{ __html: f.fullBio || '' }} />
              {Array.isArray(f.tags) && f.tags.length ? (
                <div className="founder-tags">
                  {f.tags.map((tag) => (
                    <span className="ftag" key={tag}>{tag}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </main>
    </PageShell>
  );
}
