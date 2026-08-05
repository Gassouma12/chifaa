document.addEventListener("DOMContentLoaded", () => {
    const countUpElements = document.querySelectorAll('.count-up');
    
    // Smooth easing function (easeOutExpo)
    const renderEaseOut = (t, b, c, d) => {
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
                // Calculate current value based on easing
                const currentVal = renderEaseOut(elapsedTime, startValue, target - startValue, duration);
                el.innerText = Math.round(currentVal).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure final value is exact
                el.innerText = target.toLocaleString();
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCountUp(entry.target);
                // Unobserve so it only happens once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    countUpElements.forEach(el => observer.observe(el));
});
