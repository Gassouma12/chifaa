document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNavSheet = document.querySelector('.mobile-nav-sheet');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    const closeNavBtn = document.querySelector('.close-nav-btn');
    const logo = document.querySelector('.brand-mark');
    const themeToggle = document.getElementById('theme-toggle');

    const logoImg = logo.querySelector('img');
    const lightLogoSrc = 'assets/images/logo.png';
    const darkLogoSrc = 'assets/images/logo-yellow.png';

    // --- THEME SWITCH LOGIC ---
    // 1. Function to apply theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            logoImg.src = darkLogoSrc;
            themeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            logoImg.src = lightLogoSrc;
            themeToggle.checked = false;
        }
    };

    // 2. Check for saved theme in localStorage and apply it on load
    const currentTheme = localStorage.getItem('theme');
    applyTheme(currentTheme || 'light'); // Default to light

    // 3. Add event listener for the toggle
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        }
    });


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

    hamburgerBtn.addEventListener('click', toggleMobileNav);
    closeNavBtn.addEventListener('click', toggleMobileNav);

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
