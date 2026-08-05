// On a pre-rendered article page, if the visitor is in Arabic mode, swap the
// static English content for the Arabic translation from /data/blog_ar.json
// (matched by slug). The English page stays the canonical/SEO version; this is
// a runtime enhancement for readers, mirroring what the legacy article.js does.
(function () {
  var lang = localStorage.getItem('chifaa_lang') || 'en';
  if (lang !== 'ar') return;

  var slug = location.pathname.replace(/^.*\/articles\//, '').replace(/\.html$/, '');
  if (!slug) return;

  fetch('/data/blog_ar.json?_=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (list) {
      var bySlug = {};
      list.forEach(function (x) { bySlug[x.slug] = x; });

      var a = bySlug[slug];
      if (a) {
        document.title = a.title + ' - Chifaa';
        var titleEl = document.querySelector('.article-title');
        if (titleEl) titleEl.textContent = a.title;

        var textEl = document.getElementById('article-text');
        if (textEl) textEl.innerHTML = a.content;

        var catEl = document.getElementById('article-category');
        if (catEl) {
          var cats = Array.isArray(a.category) ? a.category : [a.category];
          catEl.innerHTML = cats.map(function (c) {
            return '<span class="article-category-chip">' + c + '</span>';
          }).join('');
        }

        var tagsEl = document.getElementById('article-tags');
        if (tagsEl && a.tags) {
          tagsEl.innerHTML = a.tags.map(function (t) {
            return '<span class="article-tag">' + t + '</span>';
          }).join('');
        }

        var roleEl = document.getElementById('author-role');
        if (roleEl && a.authorRole) roleEl.textContent = a.authorRole;
      }

      // Also localize the "Related Articles" card titles/categories.
      document.querySelectorAll('.related-card').forEach(function (card) {
        var href = card.getAttribute('href') || '';
        var s = href.replace(/^.*\/articles\//, '').replace(/\.html$/, '');
        var ra = bySlug[s];
        if (!ra) return;
        var t = card.querySelector('.related-card-title');
        if (t) t.textContent = ra.title;
        var cats = Array.isArray(ra.category) ? ra.category : [ra.category];
        card.querySelectorAll('.related-card-category').forEach(function (chip, i) {
          if (cats[i]) chip.textContent = cats[i];
        });
      });
    })
    .catch(function () {});
})();
