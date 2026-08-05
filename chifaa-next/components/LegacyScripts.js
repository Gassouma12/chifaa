'use client';

import { useEffect } from 'react';

// Loads the original vanilla-JS site scripts AFTER React hydration, in order.
// Rationale: the legacy scripts mutate the DOM (i18n text swaps, injected
// toggles, content re-renders). Running them before hydration completes would
// cause hydration mismatches and React would revert their changes. Post-
// hydration + a DOMContentLoaded shim preserves their exact semantics.

let shimsInstalled = false;
const loadedSrcs = new Set(); // guards double-mount

function installShims() {
  if (shimsInstalled) return;
  shimsInstalled = true;

  // Legacy scripts register DOMContentLoaded handlers. By the time we inject
  // them the event has already fired, so replay it for late registrations.
  const docAdd = document.addEventListener.bind(document);
  document.addEventListener = function (type, fn, opts) {
    if (type === 'DOMContentLoaded' && document.readyState !== 'loading') {
      queueMicrotask(() => fn.call(document, new Event('DOMContentLoaded')));
      return;
    }
    return docAdd(type, fn, opts);
  };

  const winAdd = window.addEventListener.bind(window);
  window.addEventListener = function (type, fn, opts) {
    if (type === 'load' && document.readyState === 'complete') {
      queueMicrotask(() => fn.call(window, new Event('load')));
      return;
    }
    return winAdd(type, fn, opts);
  };
}

export default function LegacyScripts({ scripts = [] }) {
  useEffect(() => {
    installShims();
    for (const src of scripts) {
      if (loadedSrcs.has(src)) continue;
      loadedSrcs.add(src);
      const s = document.createElement('script');
      s.src = src;
      s.async = false; // preserve execution order across the list
      document.body.appendChild(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
