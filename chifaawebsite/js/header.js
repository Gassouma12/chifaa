document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNavSheet = document.querySelector('.mobile-nav-sheet');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    const closeNavBtn = document.querySelector('.close-nav-btn');
    const logo = document.querySelector('.brand-mark');
    const themeToggle = document.querySelector('.theme-toggle');
    const themeSwapImages = document.querySelectorAll('.theme-swap-image');

    if (!header || !logo) {
        return;
    }

    const logoImg = logo.querySelector('img');
    const lightLogoSrc = 'assets/images/logo.png';
    const darkLogoSrc = 'assets/images/logo-yellow.png';

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

    // 5. Accelerating logo shake on hover
    let animationFrameId = null;
    let startTime = null;
    const initialFrequency = 1; // Slower start speed
    const maxFrequency = 8; // Slower max speed
    const acceleration = 0.001; // Slower acceleration
    const amplitude = 2; // How far it shakes

    const shake = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;

        // Increase frequency over time, capped at maxFrequency
        const currentFrequency = Math.min(initialFrequency + elapsedTime * acceleration, maxFrequency);
        
        const x = amplitude * Math.sin(elapsedTime * currentFrequency * 0.01);
        logo.style.transform = `translateX(${x}px)`;

        animationFrameId = requestAnimationFrame(shake);
    };

    logo.addEventListener('mouseover', () => {
        if (!animationFrameId) {
            startTime = null; // Reset time on new hover
            animationFrameId = requestAnimationFrame(shake);
        }
    });

    logo.addEventListener('mouseout', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            logo.style.transform = 'translateX(0px)'; // Reset position
        }
    });
});
