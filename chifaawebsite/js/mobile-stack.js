(function () {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const mq = window.matchMedia('(max-width: 767px)');
    const container = document.querySelector('.container'); // The main content container

    const selectorsInOrder = [
      '.box3',
      '.box2 .box2text',
      '.box5 .box5b',
      '.box4 .box4a',
      '.box4 .box4b',
      '.box1a',
      '.box1b',
      '.box2 .box2b',
      'footer.microcopy'
    ];

    const items = selectorsInOrder.map(sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const parent = (sel === '.box1a' || sel === '.box1b') ? document.querySelector('.box-link') : el.parentNode;
      return { el, parent: parent, next: el.nextSibling };
    }).filter(Boolean);

    function toMobile() {
      if (!mq.matches || !container) return;
      items.forEach(({ el }) => container.appendChild(el));
    }

    function toDesktop() {
      if (mq.matches) return;
      items.forEach(({ el, parent, next }) => {
        if (!parent) return;
        if (next) parent.insertBefore(el, next);
        else parent.appendChild(el);
      });
    }

    mq.addEventListener('change', e => (e.matches ? toMobile() : toDesktop()));

    if (mq.matches) {
      toMobile();
    }
  }
})();
