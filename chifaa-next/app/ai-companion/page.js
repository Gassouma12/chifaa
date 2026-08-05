import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'AI Companion',
  description:
    'Chifaa’s AI companion for cancer patients and survivors is coming soon: culturally grounded, dialect-first conversational support for women in North Africa.',
  alternates: { canonical: '/ai-companion.html' },
};

const SCRIPTS = ['/js/i18n.js', '/js/script.js', '/js/header.js', '/js/music-player.js'];

export default function AiCompanionPage() {
  return (
    <PageShell
      faUrl="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.3/css/all.min.css"
      scripts={SCRIPTS}
    >
      <main className="page-container" style={{ paddingTop: 40, minHeight: '60vh', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '75%', margin: '0 auto' }}>
          <img src="/assets/images/notyet.png" alt="Coming Soon" style={{ width: '100%', maxWidth: 250, height: 'auto', marginBottom: 24, borderRadius: 20 }} />
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, padding: '0 16px' }} data-i18n="aiCompanion.comingSoonText">
            Our AI companion is currently reading through thousands of medical journals and drinking way too much virtual coffee. We&apos;re working hard to get it ready for you!
          </p>
          <p style={{ fontSize: '1.1rem', color: '#C4687E', fontWeight: 600, marginTop: 16 }} data-i18n="aiCompanion.checkBack">
            Check back soon.
          </p>
        </div>
      </main>
    </PageShell>
  );
}
