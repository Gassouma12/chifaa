// About Page JavaScript - Load from JSON

// Turn a stored social URL into a working absolute href. A scheme-less value
// like "facebook.com/x" would otherwise resolve relative to /about.html and
// 404. Keep in sync with normalizeSocialUrl (admin) and socialHref (about page).
function normalizeSocialUrl(link) {
    var u = String((link && link.url) || '').trim();
    if (!u) return '#';
    var isEmail = (link && link.class === 'email') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u);
    if (isEmail) return u.indexOf('mailto:') === 0 ? u : 'mailto:' + u;
    if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
    if (u.indexOf('//') === 0) return 'https:' + u;
    return 'https://' + u.replace(/^\/+/, '');
}

// Load about content
async function loadAboutContent() {
    try {
        const lang = localStorage.getItem('chifaa_lang') || 'en';
        const jsonFile = lang === 'ar' ? '/data/about_ar.json' : '/data/about.json';
        const response = await fetch(jsonFile);
        const aboutData = await response.json();

        const bodyCopyBlock = document.querySelector('.body-copy-block');
        const socialButtonsRow = document.querySelector('.social-buttons-row');

        // Clear existing content
        if (bodyCopyBlock) {
            bodyCopyBlock.innerHTML = '';

            // Add paragraphs
            aboutData.paragraphs.forEach(paragraph => {
                const p = document.createElement('p');
                if (['The Gap We\'re Closing', 'The Reality in North Africa', 'How It Works'].includes(paragraph)) {
                    p.className = 'about-subheader';
                }
                p.textContent = paragraph;
                bodyCopyBlock.appendChild(p);
            });
        }

        // Add social links
        if (socialButtonsRow) {
            socialButtonsRow.innerHTML = '';

            (aboutData.socialLinks || []).forEach(link => {
                const a = document.createElement('a');
                a.href = normalizeSocialUrl(link);
                a.className = `social-pill ${link.class || ''}`;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.innerHTML = `<i class="${link.icon || ''}"></i> ${link.name || ''}`;
                socialButtonsRow.appendChild(a);
            });
        }
    } catch (error) {
        console.error('Error loading about content:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadAboutContent);


// Count-up animation for stats row
document.addEventListener("DOMContentLoaded", () => {
    const countUpElements = document.querySelectorAll('.count-up');
    
    // Easing function (easeOutExpo)
    const easeOutExpo = (t, b, c, d) => {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    };

    const animateCountUp = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;

        const updateCounter = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            
            if (elapsedTime < duration) {
                const currentVal = easeOutExpo(elapsedTime, startValue, target - startValue, duration);
                el.innerText = Math.round(currentVal).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                el.innerText = target.toLocaleString();
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCountUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        countUpElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers without Intersection Observer support
        // Animate immediately on page load
        countUpElements.forEach(el => animateCountUp(el));
    }
});
