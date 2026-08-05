import PageShell from '@/components/PageShell';
import { readData } from '@/lib/data';

export const metadata = {
  title: 'About',
  description:
    'CHIFAA (شفاء, healing) is a survivor-led, open-source conversational AI supporting women living with breast and cervical cancer in North Africa, a strategic project of ITAUN.',
  alternates: { canonical: '/about.html' },
};

const SCRIPTS = [
  '/js/i18n.js',
  '/js/script.js',
  '/js/header.js',
  '/js/splash-cursor.js',
  '/js/about.js',
  '/js/music-player.js',
];

// Mirrors the subheader detection in about.js
const SUBHEADERS = ["The Gap We're Closing", 'The Reality in North Africa', 'How It Works'];

export default function AboutPage() {
  const about = readData('about');

  return (
    <PageShell
      faUrl="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.3/css/all.min.css"
      css={['/css/about.css']}
      scripts={SCRIPTS}
    >
      <main className="page-container">
        <h1 data-i18n="about.pageTitle">About</h1>

        <div className="body-copy-block">
          {about.paragraphs.map((paragraph, i) => (
            <p key={i} className={SUBHEADERS.includes(paragraph) ? 'about-subheader' : undefined}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="social-buttons-row">
          {about.socialLinks.map((link) => (
            <a key={link.name} href={link.url} className={`social-pill ${link.class}`} target="_blank" rel="noopener noreferrer">
              <i className={link.icon}></i> {link.name}
            </a>
          ))}
        </div>

        <h2 className="partners-section-title" data-i18n="about.partnersTitle">About ITAUN</h2>

        <section className="main-partner-card">
          <div className="main-partner-header">
            <div className="logo-wrapper">
              <div className="glare-effect"></div>
              <img src="/assets/images/itaunlogo.png" alt="ITAUN Logo" className="main-partner-logo" />
            </div>
            <div className="main-partner-title-group">
              <h2 className="main-partner-title">ITAUN <span className="badge" data-i18n="about.itaunBadge">&bull; Strategic Partner</span></h2>
              <h3 className="main-partner-subtitle" data-i18n="about.itaunSubtitle">LA PLATEFORME AFRICAINE DE R&Eacute;SEAUTAGE ET D&apos;INNOVATION</h3>
              <a href="https://www.itaun.org" target="_blank" className="main-partner-link" rel="noopener noreferrer">www.itaun.org</a>
            </div>
          </div>

          <div className="main-partner-content">
            <p data-i18n="about.itaunDesc1">ITAUN (African Networking and Innovation Platform) is an initiative designed to strengthen cooperation between key actors in academia, research, and the private sector across Africa. It brings together international experts and senior African leaders to exchange on innovation, entrepreneurship, competitiveness, and digital transformation.</p>
            <p data-i18n="about.itaunDesc2">ITAUN unites universities, higher education institutions, research structures, and professional training centers to drive inclusive and sustainable innovation across the continent.</p>

            <div className="features-grid">
              <div className="feature-box">
                <h4 data-i18n="about.networking">Networking</h4>
                <p data-i18n="about.networkingDesc">Cross-sector cooperation between African universities, public institutions, and private enterprises.</p>
              </div>
              <div className="feature-box">
                <h4 data-i18n="about.expertise">Expertise</h4>
                <p data-i18n="about.expertiseDesc">Exchange platform for experts, higher education institutions, research bodies, and training centers.</p>
              </div>
              <div className="feature-box">
                <h4 data-i18n="about.training">Training</h4>
                <p data-i18n="about.trainingDesc">Workshops, colloquia, and programs on future-oriented professions in collaboration with strategic partners.</p>
              </div>
            </div>

            <div className="programs-section">
              <h3 data-i18n="about.keyPrograms">Key Programs &amp; Initiatives</h3>
              <ul className="programs-list">
                <li><strong>FAWR</strong> <span data-i18n="about.fawrDesc">(Forum of African Women Researchers), a flagship initiative aligning with CHIFAA&apos;s mission to amplify women&apos;s voices in science, technology, and innovation across the continent.</span></li>
                <li><strong>SIAAF</strong> <span data-i18n="about.siaafDesc">(Semaine de l&apos;IA en Afrique), annual AI week gathering researchers, innovators and policymakers. A natural home for CHIFAA&apos;s AI for health ethics conversations.</span></li>
                <li><strong>CAF 4.0</strong> <span data-i18n="about.cafDesc">(African Colloquium on Training 4.0), advancing digital education and future-skills development as a driver of African excellence.</span></li>
                <li><strong>BAMA</strong> <span data-i18n="about.bamaDesc">(Best African Mobile Application), pan-African student competition fostering tech innovation, with 14 countries and hundreds of participants per edition.</span></li>
              </ul>
            </div>

            <div className="why-section">
              <h3 data-i18n="about.whyTitle">Why ITAUN &amp; CHIFAA</h3>
              <p data-i18n="about.whyDesc">ITAUN&apos;s pan-African network and CHIFAA&apos;s mission converge on shared values: women&apos;s empowerment, inclusive technology, and African-centered innovation. Through this partnership, CHIFAA gains access to:</p>
              <ul className="benefits-list">
                <li><strong>&rarr;</strong> <span data-i18n="about.benefit1">A network of researchers, academics and health experts across 14+ African countries</span></li>
                <li><strong>&rarr;</strong> <span data-i18n="about.benefit2">Visibility through SIAAF, FAWR and ITAUN events as showcase platforms</span></li>
                <li><strong>&rarr;</strong> <span data-i18n="about.benefit3">Institutional credibility with universities, governments, and NGOs</span></li>
                <li><strong>&rarr;</strong> <span data-i18n="about.benefit4">A pipeline of young African innovators who can contribute to CHIFAA&apos;s technology development</span></li>
              </ul>
            </div>
          </div>

          <div className="stats-row" id="itaun-stats">
            <div className="stat-item">
              <span className="stat-number"><span className="count-up" data-target="14">0</span>+</span>
              <span className="stat-label" data-i18n-html="about.statCountries">African<br />countries</span>
            </div>
            <div className="stat-item">
              <span className="stat-number"><span className="count-up" data-target="284">0</span>+</span>
              <span className="stat-label" data-i18n-html="about.statParticipants">Event<br />participants</span>
            </div>
            <div className="stat-item">
              <span className="stat-number"><span className="count-up" data-target="25">0</span>+</span>
              <span className="stat-label" data-i18n-html="about.statPanelists">Expert<br />panelists</span>
            </div>
            <div className="stat-item">
              <span className="stat-number"><span className="count-up" data-target="8">0</span></span>
              <span className="stat-label" data-i18n-html="about.statLaureates">FAWR<br />laureates</span>
            </div>
          </div>
        </section>

        <section className="powered-by-section">
          <p className="powered-by-label" data-i18n="about.poweredBy">Powered by</p>
          <div className="powered-by-partner">
            <div>
              <a href="https://menaobservatory.ai/en/home" target="_blank" rel="noopener noreferrer" className="powered-by-logo-link">
                <img src="/assets/images/mena.png" alt="MENA Observatory on Responsible AI" className="powered-by-logo mena-logo" />
              </a>
            </div>
            <p className="powered-by-description" data-i18n="about.menaDesc">The MENA Observatory on Responsible AI is an interdisciplinary platform connecting policy-oriented researchers and innovators, aimed at fostering collaboration and building capacity for responsible data and AI practices. Join our diversified regional network to share knowledge, exchange ideas, and advocate for impactful policies that shape the future of AI and data in our region.</p>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
