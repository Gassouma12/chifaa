// Share-section wiring for pre-rendered article pages (/articles/<slug>.html).
// Same behavior as setupShareSection in article.js, but standalone: reads the
// article title from the DOM instead of fetched JSON.
document.addEventListener('DOMContentLoaded', function () {
    var shareSection = document.getElementById('article-share');
    if (!shareSection) return;

    var url = window.location.href;
    var titleEl = document.querySelector('.article-title');
    var title = titleEl ? titleEl.textContent.trim() : document.title;
    var enc = encodeURIComponent;
    var links = {
        facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url),
        linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(url),
        whatsapp: 'https://wa.me/?text=' + enc(title + '\n' + url)
    };

    shareSection.querySelectorAll('a.share-btn[data-network]').forEach(function (btn) {
        var network = btn.getAttribute('data-network');
        if (!links[network]) return;
        btn.href = links[network];
        if (network !== 'whatsapp') {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var w = 600, h = 540;
                var left = Math.round((screen.width - w) / 2);
                var top = Math.round((screen.height - h) / 2);
                window.open(links[network], 'chifaa-share',
                    'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top + ',noopener');
            });
        }
    });

    var igBtn = shareSection.querySelector('.share-instagram');
    if (igBtn) {
        igBtn.addEventListener('click', async function () {
            try {
                await navigator.clipboard.writeText(url);
            } catch (e) {
                var ta = document.createElement('textarea');
                ta.value = url;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            igBtn.classList.add('copied');
            var toast = document.getElementById('share-toast');
            if (toast) toast.classList.add('visible');
            clearTimeout(igBtn._copyTimer);
            igBtn._copyTimer = setTimeout(function () {
                igBtn.classList.remove('copied');
                if (toast) toast.classList.remove('visible');
            }, 2400);
        });
    }
});
