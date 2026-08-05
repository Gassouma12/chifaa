import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with the Chifaa team.',
  alternates: { canonical: '/contact.html' },
  robots: { index: false }, // under-construction page
};

const SCRIPTS = [
  '/js/i18n.js',
  '/js/script.js',
  '/js/splash-cursor.js',
  '/js/header.js',
  '/js/contact-reviews.js',
  '/js/music-player.js',
];

export default function ContactPage() {
  return (
    <PageShell css={['/css/contact.css']} scripts={SCRIPTS}>
      <main className="page-container under-construction">
        <div className="construction-content">
          <div className="construction-icon">??</div>
          <h1 className="construction-title" data-i18n="contact.title">Under Construction</h1>
          <p className="construction-message" data-i18n="contact.message">
            We&apos;re building something amazing here. Check back soon!
          </p>
          <div className="construction-animation">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
