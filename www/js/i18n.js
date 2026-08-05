/**
 * Chifaa i18n – lightweight client-side internationalisation
 * Supports English (LTR) and Arabic (RTL).
 *
 * Usage in HTML:
 *   <span data-i18n="nav.home">Home</span>
 *   <input data-i18n-placeholder="voices.searchPlaceholder" placeholder="Search…">
 */

(function () {
  'use strict';

  const SUPPORTED_LANGS = ['en', 'ar'];
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'chifaa_lang';

  /* ── cache ─────────────────────────────────────────────── */
  const translationCache = {};

  /* ── helpers ────────────────────────────────────────────── */

  /** Resolve a dotted key like "nav.home" against a nested object. */
  function resolve(obj, path) {
    return path.split('.').reduce(function (acc, part) {
      return acc && acc[part] !== undefined ? acc[part] : null;
    }, obj);
  }

  /** Get the base path (handles being loaded from different locations). */
  function getBasePath() {
    // Find the directory that contains js/ folder
    var scripts = document.querySelectorAll('script[src*="i18n.js"]');
    if (scripts.length) {
      var src = scripts[0].getAttribute('src');
      // src is like "js/i18n.js" – we want the dir above js/
      var idx = src.indexOf('js/i18n.js');
      return idx > 0 ? src.substring(0, idx) : '';
    }
    return '';
  }

  /* ── core ───────────────────────────────────────────────── */

  function fetchTranslations(lang, cb) {
    if (translationCache[lang]) {
      return cb(translationCache[lang]);
    }
    var basePath = getBasePath();
    var url = basePath + 'js/i18n/' + lang + '.json';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0 /* file:// */) {
          try {
            translationCache[lang] = JSON.parse(xhr.responseText);
          } catch (e) {
            console.error('[i18n] Failed to parse ' + url, e);
            translationCache[lang] = {};
          }
        } else {
          console.error('[i18n] Failed to load ' + url + ' (status ' + xhr.status + ')');
          translationCache[lang] = {};
        }
        cb(translationCache[lang]);
      }
    };
    xhr.send();
  }

  function applyTranslations(translations) {
    // textContent elements
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = resolve(translations, key);
      if (val !== null) {
        el.textContent = val;
      }
    });

    // innerHTML elements (for tags that need HTML entities)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var val = resolve(translations, key);
      if (val !== null) {
        el.innerHTML = val;
      }
    });

    // placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var val = resolve(translations, key);
      if (val !== null) {
        el.setAttribute('placeholder', val);
      }
    });

    // aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      var val = resolve(translations, key);
      if (val !== null) {
        el.setAttribute('aria-label', val);
      }
    });
  }

  function setDirection(lang) {
    var html = document.documentElement;
    if (lang === 'ar') {
      html.setAttribute('lang', 'ar');
      html.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl-mode');
    } else {
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl-mode');
    }
  }

  function switchLanguage(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) return;
    localStorage.setItem(STORAGE_KEY, lang);
    location.reload();
  }

  function getCurrentLang() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) return stored;
    return DEFAULT_LANG;
  }

  /* ── language toggle button ────────────────────────────── */

  function createLangToggle() {
    // Desktop toggle – insert into every .header-actions
    document.querySelectorAll('.header-actions').forEach(function (actions) {
      if (actions.querySelector('.lang-toggle')) return; // already exists
      var btn = document.createElement('button');
      btn.className = 'lang-toggle';
      btn.type = 'button';
      btn.setAttribute('data-i18n-html', 'langToggle.label');
      btn.setAttribute('data-i18n-aria', 'langToggle.ariaLabel');
      btn.innerHTML = getCurrentLang() === 'en' ? '<i class="fas fa-globe" style="margin-right: 4px;"></i> AR' : '<i class="fas fa-globe" style="margin-left: 4px;"></i> EN';
      btn.setAttribute('aria-label', getCurrentLang() === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية');
      btn.addEventListener('click', function () {
        var next = getCurrentLang() === 'en' ? 'ar' : 'en';
        switchLanguage(next);
      });
      // Insert before the theme toggle or at the beginning
      var themeToggle = actions.querySelector('.theme-toggle');
      if (themeToggle) {
        actions.insertBefore(btn, themeToggle);
      } else {
        actions.insertBefore(btn, actions.firstChild);
      }
    });

    // Mobile toggle – insert into mobile-nav-sheet
    document.querySelectorAll('.mobile-nav-sheet').forEach(function (sheet) {
      if (sheet.querySelector('.lang-toggle-mobile')) return;
      var btn = document.createElement('button');
      btn.className = 'lang-toggle-mobile';
      btn.type = 'button';
      btn.setAttribute('data-i18n-html', 'langToggle.label');
      btn.setAttribute('data-i18n-aria', 'langToggle.ariaLabel');
      btn.innerHTML = getCurrentLang() === 'en' ? '<i class="fas fa-globe" style="margin-right: 4px;"></i> AR' : '<i class="fas fa-globe" style="margin-left: 4px;"></i> EN';
      btn.setAttribute('aria-label', getCurrentLang() === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية');
      btn.addEventListener('click', function () {
        var next = getCurrentLang() === 'en' ? 'ar' : 'en';
        switchLanguage(next);
      });
      var nav = sheet.querySelector('.mobile-nav');
      if (nav) {
        sheet.insertBefore(btn, nav.nextSibling);
      } else {
        sheet.appendChild(btn);
      }
    });
  }

  /* ── init ───────────────────────────────────────────────── */

  function init() {
    var lang = getCurrentLang();
    setDirection(lang);
    createLangToggle();
    fetchTranslations(lang, applyTranslations);
  }

  // Run on DOMContentLoaded if not already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.ChifaaI18n = {
    switchLanguage: switchLanguage,
    getCurrentLang: getCurrentLang
  };

})();
