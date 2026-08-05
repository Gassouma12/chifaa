// Shared site header + mobile nav sheet: markup identical to the legacy
// pages so header.css / i18n.js / header.js keep working unchanged.
// `active` marks the current nav item exactly like the legacy pages did.

// Absolute paths so the same nav works from nested routes like /articles/<slug>.html
const NAV_ITEMS = [
  { key: 'home', href: '/index.html', i18n: 'nav.home', label: 'Home' },
  { key: 'about', href: '/about.html', i18n: 'nav.about', label: 'About' },
  { key: 'aiCompanion', href: '/ai-companion.html', i18n: 'nav.aiCompanion', label: 'AI Companion' },
  { key: 'aiGame', href: '/partners.html', i18n: 'nav.aiGame', label: 'AI Game' },
  { key: 'voices', href: '/voices.html', i18n: 'nav.voices', label: 'Voices' },
  { key: 'founder', href: '/founder.html', i18n: 'nav.founder', label: 'Founders' },
  { key: 'team', href: '/meet-the-team.html', i18n: 'nav.team', label: 'Team' },
];

function ThemeToggleIcon() {
  return (
    <div className="theme-toggle" title="Toggle theme" role="button" tabIndex={0} aria-label="Toggle theme" aria-pressed="false">
      <span className="theme-toggle-sr">Toggle theme</span>
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1em" height="1em" fill="currentColor" className="theme-toggle__expand" viewBox="0 0 32 32">
        <clipPath id="theme-toggle__expand__cutout">
          <path d="M0-11h25a1 1 0 0017 13v30H0Z" />
        </clipPath>
        <g clipPath="url(#theme-toggle__expand__cutout)">
          <circle cx="16" cy="16" r="8.4" />
          <path d="M18.3 3.2c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3S14.7.9 16 .9s2.3 1 2.3 2.3zm-4.6 25.6c0-1.3 1-2.3 2.3-2.3s2.3 1 2.3 2.3-1 2.3-2.3 2.3-2.3-1-2.3-2.3zm15.1-10.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zM3.2 13.7c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3S.9 17.3.9 16s1-2.3 2.3-2.3zm5.8-7C9 7.9 7.9 9 6.7 9S4.4 8 4.4 6.7s1-2.3 2.3-2.3S9 5.4 9 6.7zm16.3 21c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3zm2.4-21c0 1.3-1 2.3-2.3 2.3S23 7.9 23 6.7s1-2.3 2.3-2.3 2.4 1 2.4 2.3zM6.7 23C8 23 9 24 9 25.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3z" />
        </g>
      </svg>
    </div>
  );
}

export default function Header({ active = '' }) {
  return (
    <>
      <header className="site-header">
        <div className="header-container">
          <a href="/index.html" className="brand-mark" aria-label="Home">
            <img src="/assets/images/logo.png" alt="Chifaa Logo" className="brand-logo" />
            <img src="/assets/images/ribbon.gif" alt="Ribbon animation" className="brand-ribbon" />
          </a>
          <nav className="primary-nav" aria-label="Primary">
            <ul className="nav-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <a href={item.href} className={active === item.key ? 'active' : undefined} data-i18n={item.i18n}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="nav-contact-item">
                <a href="/podcast.html" className={`contact-pill${active === 'podcast' ? ' active' : ''}`} data-i18n="nav.podcast">Podcast</a>
              </li>
            </ul>
          </nav>
          <div className="header-actions">
            <ThemeToggleIcon />
            <button className="hamburger-btn" aria-label="Open menu" aria-expanded="false">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </header>

      <div className="mobile-nav-sheet" role="dialog" aria-modal="true">
        <button className="close-nav-btn" aria-label="Close menu">&times;</button>
        <nav className="mobile-nav">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <a href={item.href} data-i18n={item.i18n}>{item.label}</a>
              </li>
            ))}
            <li>
              <a href="podcast.html" className="mobile-contact-btn" data-i18n="nav.podcast">Podcast</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mobile-nav-overlay"></div>
    </>
  );
}
