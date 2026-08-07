// Root layout: shared <html>/<body> shell + the four core stylesheets every
// legacy page loads (styles, header, dark-theme, rtl), served untouched from
// /public/css so rendering is pixel-identical to the original site.

import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://chifaa.org';

// Inlined at build so dark-mode colors are present on first paint (no flash of
// light-mode text/icons before dark-theme.css loads over the network).
const darkThemeCss = fs.readFileSync(path.join(process.cwd(), 'public', 'css', 'dark-theme.css'), 'utf8');

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

// Live-data shim: reroute every `data/<name>.json` fetch to the Supabase `data`
// Edge Function, so admin edits appear on the live site instantly (no rebuild).
// Falls back to the static /data snapshot if the function errors — so the site
// still works if Supabase is unreachable. Must run before the legacy scripts.
// The static build stays the SEO snapshot + first paint; this hydrates it live.
const liveDataShim = `(function(){try{
var FN='https://rgptwhksojbxwcnezokf.supabase.co/functions/v1/data/';
var orig=window.fetch.bind(window);
window.fetch=function(input,init){
  try{
    var url=typeof input==='string'?input:(input&&input.url||'');
    var q=url.indexOf('?'); var clean=q>=0?url.slice(0,q):url;
    var m=clean.match(/(?:^|\\/)data\\/([A-Za-z0-9_]+)\\.json$/);
    if(m){
      return orig(FN+m[1],init).then(function(r){return (r&&r.ok)?r:orig(input,init);}).catch(function(){return orig(input,init);});
    }
  }catch(e){}
  return orig(input,init);
};
}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <link rel="stylesheet" href="/css/styles.css" precedence="chifaa" />
        <link rel="stylesheet" href="/css/header.css" precedence="chifaa" />
        <link rel="stylesheet" href="/css/rtl.css" precedence="chifaa" />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script dangerouslySetInnerHTML={{ __html: liveDataShim }} />
        {/* dark-theme.css inlined (not a <link>) so dark-mode colors + logo
            whitening apply on the very first paint — no light-then-dark flash. */}
        <style dangerouslySetInnerHTML={{ __html: darkThemeCss }} />
        {children}
      </body>
    </html>
  );
}
