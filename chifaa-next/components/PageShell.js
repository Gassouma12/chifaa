import Header from './Header';
import Footer from './Footer';
import LegacyScripts from './LegacyScripts';

// Wraps every page with the shared chrome and its page-specific stylesheets
// and legacy scripts. <link precedence> makes React hoist the stylesheets to
// <head> after the core CSS from the root layout (same precedence group keeps
// insertion order), matching the legacy pages' <link> order exactly.
export default function PageShell({
  active = '',
  bodyClass = '',
  faUrl = '',
  faIntegrity = '',
  css = [],
  scripts = [],
  children,
}) {
  return (
    <>
      {faUrl && (
        <link
          rel="stylesheet"
          href={faUrl}
          precedence="chifaa"
          {...(faIntegrity
            ? { integrity: faIntegrity, crossOrigin: 'anonymous', referrerPolicy: 'no-referrer' }
            : {})}
        />
      )}
      {css.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="chifaa" />
      ))}
      {bodyClass && (
        <script
          dangerouslySetInnerHTML={{
            __html: `document.body.classList.add(${JSON.stringify(bodyClass)});`,
          }}
        />
      )}
      <Header active={active} />
      {children}
      <Footer />
      <LegacyScripts scripts={scripts} />
    </>
  );
}
