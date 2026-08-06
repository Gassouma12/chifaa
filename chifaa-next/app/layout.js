// Root layout: shared <html>/<body> shell + the four core stylesheets every
// legacy page loads (styles, header, dark-theme, rtl), served untouched from
// /public/css so rendering is pixel-identical to the original site.

const SITE_URL = 'https://chifaa.org';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Chifaa: Human-Centric AI for Cancer Patients & Survivors in North Africa',
    template: '%s | Chifaa',
  },
  description:
    'Chifaa is a human-centered AI initiative supporting cancer patients and survivors across North Africa with compassionate, culturally grounded technology.',
  openGraph: {
    siteName: 'Chifaa',
    type: 'website',
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
};

// Applies saved theme + language direction before first paint so dark-mode /
// RTL users don't get a light-LTR flash. The legacy scripts re-apply the same
// state later (idempotent).
const bootScript = `(function(){try{
var t=localStorage.getItem('theme');
if(t==='dark'){document.body.classList.add('dark-mode');}
var l=localStorage.getItem('chifaa_lang');
if(l==='ar'){var h=document.documentElement;h.setAttribute('lang','ar');h.setAttribute('dir','rtl');document.body.classList.add('rtl-mode');}
}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <link rel="stylesheet" href="/css/styles.css" precedence="chifaa" />
        <link rel="stylesheet" href="/css/header.css" precedence="chifaa" />
        <link rel="stylesheet" href="/css/dark-theme.css" precedence="chifaa" />
        <link rel="stylesheet" href="/css/rtl.css" precedence="chifaa" />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {/* Critical dark-mode logo whitening, inlined so it applies on first paint
            (before dark-theme.css finishes loading) — no dark-logo flash. */}
        <style dangerouslySetInnerHTML={{ __html: 'body.dark-mode .footer-logo-mena,body.dark-mode .mena-logo{filter:brightness(0) invert(1)!important;transition:none!important}' }} />
        {children}
      </body>
    </html>
  );
}
