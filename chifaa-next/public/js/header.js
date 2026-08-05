document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNavSheet = document.querySelector('.mobile-nav-sheet');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    const closeNavBtn = document.querySelector('.close-nav-btn');
    const logo = document.querySelector('.brand-mark');
    const ribbon = document.querySelector('.brand-ribbon');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeSwapImages = document.querySelectorAll('.theme-swap-image');

    if (!header || !logo) {
        return;
    }

    const logRibbonDebug = (phase) => {
        if (!ribbon) {
            console.warn('[RibbonDebug] Ribbon element not found on this page.', { phase });
            return;
        }
        const logoStyles = window.getComputedStyle(logo);
        const ribbonStyles = window.getComputedStyle(ribbon);
        const logoRect = logo.getBoundingClientRect();
        const ribbonRect = ribbon.getBoundingClientRect();
        console.log('[RibbonDebug]', {
            phase,
            logo: {
                overflow: logoStyles.overflow,
                position: logoStyles.position,
                zIndex: logoStyles.zIndex,
                rect: {
                    x: Math.round(logoRect.x),
                    y: Math.round(logoRect.y),
                    width: Math.round(logoRect.width),
                    height: Math.round(logoRect.height)
                }
            },
            ribbon: {
                src: ribbon.getAttribute('src'),
                display: ribbonStyles.display,
                visibility: ribbonStyles.visibility,
                opacity: ribbonStyles.opacity,
                position: ribbonStyles.position,
                zIndex: ribbonStyles.zIndex,
                rect: {
                    x: Math.round(ribbonRect.x),
                    y: Math.round(ribbonRect.y),
                    width: Math.round(ribbonRect.width),
                    height: Math.round(ribbonRect.height)
                }
            }
        });
    };

    const logoImg = logo.querySelector('.brand-logo') || logo.querySelector('img');
    const lightLogoSrc = '/assets/images/logo.png';
    const darkLogoSrc = '/assets/images/logo-yellow.png';

    logRibbonDebug('DOMContentLoaded');
    logo.addEventListener('mouseenter', () => logRibbonDebug('logo mouseenter'));
    logo.addEventListener('mouseleave', () => logRibbonDebug('logo mouseleave'));

    if (ribbon) {
        ribbon.addEventListener('load', () => {
            console.log('[RibbonDebug] Ribbon image loaded.', {
                src: ribbon.currentSrc || ribbon.src,
                naturalWidth: ribbon.naturalWidth,
                naturalHeight: ribbon.naturalHeight
            });
        });

        ribbon.addEventListener('error', () => {
            console.error('[RibbonDebug] Ribbon image failed to load.', {
                src: ribbon.getAttribute('src')
            });
        });

        if (ribbon.complete) {
            console.log('[RibbonDebug] Ribbon already complete on load.', {
                src: ribbon.currentSrc || ribbon.src,
                naturalWidth: ribbon.naturalWidth,
                naturalHeight: ribbon.naturalHeight
            });
        }
    }

    // --- THEME SWITCH LOGIC ---
    // 1. Function to apply theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            logoImg.src = darkLogoSrc;
            themeSwapImages.forEach((img) => {
                const darkSrc = img.getAttribute('data-theme-dark');
                if (darkSrc) {
                    img.src = darkSrc;
                }
            });
            if (themeToggle) {
                themeToggle.setAttribute('aria-pressed', 'true');
            }
        } else {
            document.body.classList.remove('dark-mode');
            logoImg.src = lightLogoSrc;
            themeSwapImages.forEach((img) => {
                const lightSrc = img.getAttribute('data-theme-light');
                if (lightSrc) {
                    img.src = lightSrc;
                }
            });
            if (themeToggle) {
                themeToggle.setAttribute('aria-pressed', 'false');
            }
        }
    };

    // 2. Check for saved theme in localStorage and apply it on load
    const currentTheme = localStorage.getItem('theme');
    applyTheme(currentTheme || 'light'); // Default to light

    // 3. Add event listeners for the toggle button
    let _acCtx = null;
    let _acBuf = null;
    function getAudioCtx() {
        if (!_acCtx) _acCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (_acCtx.state === 'suspended') _acCtx.resume();
        return _acCtx;
    }
    function getAudioBuf(ac) {
        if (_acBuf && _acBuf.sampleRate === ac.sampleRate) return _acBuf;
        const rate = ac.sampleRate;
        const len = Math.floor(rate * 0.006);
        const buf = ac.createBuffer(1, len, rate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
            const t = i / len;
            const sine = Math.sin(2 * Math.PI * 3400 * t);
            const noise = Math.random() * 2 - 1;
            ch[i] = (sine * 0.6 + noise * 0.4) * Math.pow(1 - t, 3);
        }
        _acBuf = buf;
        return buf;
    }
    let lastSndDate = 0;
    function playSwitchSound() {
        const now = performance.now();
        if (now - lastSndDate < 80) return;
        lastSndDate = now;
        try {
            const ac = getAudioCtx();
            const buf = getAudioBuf(ac);
            const src = ac.createBufferSource();
            const gain = ac.createGain();
            src.buffer = buf;
            gain.gain.value = 0.08;
            src.connect(gain);
            gain.connect(ac.destination);
            src.start();
        } catch (e) { }
    }

    const toggleTheme = () => {
        playSwitchSound();
        const isDark = document.body.classList.contains('dark-mode');
        const nextTheme = isDark ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
    };

    if (themeToggle) {
        themeToggle.innerHTML = `
        <svg class="att-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <mask id="att-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <circle class="att-mask-circle" cx="33" cy="0" r="9" fill="black" />
          </mask>
          <circle class="att-center-circle" cx="12" cy="12" r="5" fill="currentColor" stroke="none" mask="url(#att-mask)" />
          <g class="att-rays">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="5.64" y1="5.64" x2="4.22" y2="4.22" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            <line x1="5.64" y1="18.36" x2="4.22" y2="19.78" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          </g>
        </svg>`;

        themeToggle.addEventListener('click', toggleTheme);
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }


    // --- EXISTING HEADER LOGIC ---
    // 1. Sticky header shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 1) {
            header.classList.add('is-scrolling');
        } else {
            header.classList.remove('is-scrolling');
        }
    });

    // 2. Hamburger menu toggle
    const toggleMobileNav = () => {
        const isOpen = mobileNavSheet.classList.toggle('is-open');
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('no-scroll', isOpen);
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMobileNav);
    }
    if (closeNavBtn) {
        closeNavBtn.addEventListener('click', toggleMobileNav);
    }

    // 3. Close mobile nav on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavSheet.classList.contains('is-open')) {
                toggleMobileNav();
            }
        });
    });

    // 4. Close mobile nav with Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavSheet.classList.contains('is-open')) {
            toggleMobileNav();
        }
    });

});

// Always scroll to top on reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

