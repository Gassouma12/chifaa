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
    const lightLogoSrc = 'assets/images/logo.png';
    const darkLogoSrc = 'assets/images/logo-yellow.png';

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
    const toggleTheme = () => {
        const isDark = document.body.classList.contains('dark-mode');
        const nextTheme = isDark ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem('theme', nextTheme);
    };

    if (themeToggle) {
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

