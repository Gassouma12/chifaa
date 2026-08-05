// Shared site footer: markup identical to the legacy pages.

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-socials" aria-label="Social links">
        <a href="#" className="footer-social-link" aria-label="Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.19 2.23.19v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22C18.34 21.25 22 17.08 22 12.06Z" /></svg>
        </a>
        <a href="#" className="footer-social-link" aria-label="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7.35A4.65 4.65 0 1 1 12 16.65 4.65 4.65 0 0 1 12 7.35Zm0 2A2.65 2.65 0 1 0 12 14.65 2.65 2.65 0 0 0 12 9.35ZM17.05 6.65a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" /></svg>
        </a>
        <a href="#" className="footer-social-link" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.35 8h4.3v14H.35V8Zm7.44 0h4.12v1.91h.06c.57-1.09 1.98-2.24 4.08-2.24 4.36 0 5.16 2.87 5.16 6.6V22h-4.29v-6.85c0-1.64-.03-3.74-2.28-3.74-2.28 0-2.63 1.78-2.63 3.62V22H7.79V8Z" transform="translate(1.4 .5) scale(.95)" /></svg>
        </a>
        <a href="#" className="footer-social-link" aria-label="YouTube">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3.01 3.01 0 0 0-2.12-2.13C19.5 3.56 12 3.56 12 3.56s-7.5 0-9.38.51A3.01 3.01 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3.01 3.01 0 0 0 2.12 2.13c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.01 3.01 0 0 0 2.12-2.13A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" /></svg>
        </a>
      </div>
      <a href="mailto:hello@chifaa.org" className="footer-email">hello@chifaa.org</a>
      <div className="footer-divider" aria-hidden="true"></div>
      <div className="footer-logos">
        <a href="https://www.itaun.org" target="_blank" rel="noopener noreferrer" aria-label="ITAUN">
          <img src="/assets/images/itaunlogo.png" alt="ITAUN" className="footer-logo footer-logo-itaun" />
        </a>
        <a href="https://menaobservatory.ai/en/home" target="_blank" rel="noopener noreferrer" aria-label="MENA Observatory on Responsible AI">
          <img src="/assets/images/mena.png" alt="MENA Observatory on Responsible AI" className="footer-logo footer-logo-mena" />
        </a>
      </div>
      <div className="footer-bottom">
        <span data-i18n="footer.rights">&copy; Chifaa ~ All rights reserved</span>
      </div>
    </footer>
  );
}
