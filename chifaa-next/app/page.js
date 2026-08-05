import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'Chifaa: Human-Centric AI for Cancer Patients & Survivors in North Africa',
  description:
    'Human-centric AI for cancer patients and survivors in North Africa. Chifaa stands alongside every woman navigating a cancer diagnosis, from discovery through survivorship.',
  alternates: { canonical: '/index.html' },
  openGraph: {
    title: 'Chifaa: Human-Centric AI for Cancer Patients & Survivors',
    description:
      'Human-centric AI for cancer patients and survivors in North Africa.',
    images: ['/assets/images/logo.png'],
  },
};

const SCRIPTS = [
  '/js/i18n.js',
  '/js/splash-cursor.js',
  '/js/script.js',
  '/js/header.js',
  '/js/video-modal.js',
  '/js/music-player.js',
  '/js/shape-recognizer.js',
  'https://d3js.org/d3.v7.min.js',
  '/js/MenaMap.js',
  '/js/home-init.js',
];

export default function HomePage() {
  return (
    <PageShell
      active=""
      bodyClass="home-page"
      faUrl="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      faIntegrity="sha512-pgOYS+r/qIn8MpA0D3Hu0FSr02/uLy3I5mpNB/AYpPXAlw+3qBSkzfrMXEEzLgFWtafKkK7KGXowQcOuSpUJ6A=="
      css={['/css/video-modal.css', '/css/mena-map.css']}
      scripts={SCRIPTS}
    >
      <div className="top-title-box">
        <div className="title-container">
          <h1 className="main-title" data-editable="mainTitle" data-i18n="index.mainTitle">
            Human Centric AI For cancer patients and Survivors in North Africa
          </h1>
          <p id="typewriter-text" className="typewriter-subtitle">&nbsp;</p>
        </div>
      </div>

      <div className="container">
        <div className="box4">
          <div className="box4text play-button-container">
            <img src="/assets/images/play.png" alt="Play button" className="theme-swap-image" data-theme-light="/assets/images/play.png" data-theme-dark="/assets/images/play-dark.png" />
          </div>
          <div className="box4mid">
            <img src="/assets/images/voice.png" alt="Voice visual" className="theme-swap-image" data-theme-light="/assets/images/voice.png" data-theme-dark="/assets/images/voice-dark.png" />
          </div>
          <a href="voices.html" className="box4b">
            <span className="box4b-copy" data-i18n="index.hearThemOut">Hear them out</span>{' '}
            <span className="box4b-arrow" aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div className="box3">
          <img src="" alt="" className="middlepic" />
        </div>

        <div className="box2" style={{ cursor: 'pointer' }} aria-label="Go to founder page">
          <div className="box2text play-button-container">
            <img src="/assets/images/found.png" alt="Founders" className="theme-swap-image" data-theme-light="/assets/images/found.png" data-theme-dark="/assets/images/found-dark.png" />
          </div>
          <div className="box2b">
            <img src="/assets/images/member2.png" alt="Team members" className="new-image" />
          </div>
        </div>

        <div className="box5">
          <div className="box5a"></div>
          <div className="box5b">
            <img src="/assets/images/Butterfly.gif" className="box5img" alt="Butterfly animation" id="butterfly-img" />
            <img src="/assets/images/plus.png" className="plus-image" alt="Plus decoration" />
          </div>
        </div>
      </div>

      <section id="mena-map-section">
        <h2 data-i18n="index.menaMapTitle">Mapping Cancer &amp; Chronic Disease in the MENA Region</h2>
        <p className="mena-map-subtitle" data-i18n="index.menaMapSubtitle">
          Chifaa stands alongside every woman navigating a cancer diagnosis, from the moment of discovery through survivorship
        </p>
        <div id="mena-map-container"></div>
      </section>

      {/* Video Modal */}
      <div id="video-modal-overlay" className="video-modal-overlay" style={{ display: 'none' }}>
        <div className="video-modal-content">
          <button className="video-modal-close" aria-label="Close video">&times;</button>
          <div className="video-container">
            <iframe id="video-iframe" src="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
