import PageShell from '@/components/PageShell';
import { readData } from '@/lib/data';

export const metadata = {
  title: 'Meet the Team',
  description:
    'Meet Chifaa’s leadership team: co-founders, medical advisors, AI researchers, and engineers driving health equity and compassionate AI for cancer care in North Africa.',
  alternates: { canonical: '/meet-the-team.html' },
};

const SCRIPTS = [
  '/js/i18n.js',
  '/js/header.js',
  '/js/splash-cursor.js',
  '/js/music-player.js',
  '/js/team-showcase.js',
  '/js/meet-the-team.js',
];

function absImage(src) {
  if (!src) return '/assets/images/logo.png';
  return src.startsWith('/') || src.startsWith('http') ? src : `/${src}`;
}

function PhotoCard({ member }) {
  return (
    <div className="team-photo-card" data-id={String(member.id)} style={{ cursor: 'pointer' }}>
      <img src={absImage(member.image)} alt={member.name} className="team-photo-image" />
    </div>
  );
}

function MemberRow({ member }) {
  const linkedin = member.linkedin && member.linkedin !== '#' ? member.linkedin : '';
  return (
    <div className="team-member-row" data-id={String(member.id)}>
      <div className="team-member-header">
        <span className="team-member-indicator"></span>
        <span className="team-member-name">{member.name}</span>
        {linkedin ? (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="team-linkedin-icon" title="LinkedIn">in</a>
        ) : null}
      </div>
      <p className="team-member-role">{member.role}</p>
    </div>
  );
}

export default function MeetTheTeamPage() {
  const members = readData('team');
  const col1 = members.filter((_, i) => i % 3 === 0);
  const col2 = members.filter((_, i) => i % 3 === 1);
  const col3 = members.filter((_, i) => i % 3 === 2);

  return (
    <PageShell
      active="team"
      bodyClass="team-page"
      faUrl="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      faIntegrity="sha512-pgOYS+r/qIn8MpA0D3Hu0FSr02/uLy3I5mpNB/AYpPXAlw+3qBSkzfrMXEEzLgFWtafKkK7KGXowQcOuSpUJ6A=="
      css={['/css/on-founders.css', '/css/meet-the-team.css', '/css/team-showcase.css']}
      scripts={SCRIPTS}
    >
      <main className="team-container">
        <div className="team-header">
          <h1 data-i18n="team.pageTitle">Meet Our Leadership Team</h1>
          <p data-i18n="team.pageSubtitle">Dedicated experts driving health equity, AI innovation, and compassionate care.</p>
        </div>

        {/* Server-rendered snapshot of the showcase; team-showcase.js re-renders
            this container client-side from /data/team.json (identical markup)
            and attaches the hover/modal interactions. */}
        <div id="team-showcase-container">
          <div className="team-showcase-wrapper">
            <div className="team-photo-grid">
              <div className="team-column">{col1.map((m) => <PhotoCard key={m.id} member={m} />)}</div>
              <div className="team-column team-column-offset-1">{col2.map((m) => <PhotoCard key={m.id} member={m} />)}</div>
              <div className="team-column team-column-offset-2">{col3.map((m) => <PhotoCard key={m.id} member={m} />)}</div>
            </div>
            <div className="team-members-list">
              {members.map((m) => <MemberRow key={m.id} member={m} />)}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Component */}
      <div id="teamModal" className="team-modal-overlay">
        <div className="team-modal-content">
          <button className="team-modal-close" aria-label="Close modal">&times;</button>
          <div className="team-modal-body">
            <div className="team-modal-image">
              <img id="modalImage" src="" alt="Team Member" className="modal-image-glare" />
            </div>
            <div className="team-modal-info">
              <h2 id="modalName">Name</h2>
              <span id="modalRole" className="founder-eyebrow">Role</span>
              <div id="modalBio" className="bio-content"></div>
              <div id="modalExtraLink" className="team-modal-extra-link" style={{ display: 'none' }}></div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
