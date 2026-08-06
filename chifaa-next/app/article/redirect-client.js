'use client';

import { useEffect } from 'react';

// Client half of the legacy-URL shim: reads ?id=N and forwards to the
// pre-rendered slug page. Unknown ids fall back to the voices listing,
// matching article.js's old behavior.
export default function ArticleRedirect({ idToSlug }) {
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    const slug = idToSlug[id];
    window.location.replace(slug ? `/articles/${slug}/` : '/voices/');
  }, [idToSlug]);

  return null;
}
