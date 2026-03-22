/**
 * Reviews Carousel - Simplified version
 * Simple prev/next navigation without complex scroll pinning
 */

let currentIndex = 0;
let reviews = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Load reviews data
    try {
        const response = await fetch('data/reviews.json?_=' + Date.now(), {
            cache: 'no-store'
        });
        reviews = await response.json();

        const reviewsContainer = document.querySelector('.reviews-cards');
        if (!reviewsContainer) {
            console.log('Reviews container not found');
            return;
        }

        if (!reviews || reviews.length === 0) {
            console.log('No reviews found');
            return;
        }

        console.log('Loading', reviews.length, 'reviews');

        // Color palette for cards
        const colors = [
            { bg: '#FEB300', text: '#060507', border: '#FDDD3C' },
            { bg: '#060507', text: '#FFFFFF', border: '#FEB300' },
            { bg: '#FDDD3C', text: '#060507', border: '#FEB300' }
        ];

        // Create review cards HTML
        reviews.forEach((review, index) => {
            const colorScheme = colors[index % colors.length];
            const li = document.createElement('li');
            li.className = 'review-card';
            li.setAttribute('data-index', index);
            li.setAttribute('data-color-bg', colorScheme.bg);
            li.setAttribute('data-color-text', colorScheme.text);
            li.setAttribute('data-color-border', colorScheme.border);
            li.innerHTML = `
        <div class="review-card-inner" style="background: ${colorScheme.bg}; border-color: ${colorScheme.border}; color: ${colorScheme.text};">
          <img src="${review.image}" alt="${review.name}" class="review-image" onerror="this.src='assets/images/logo.png'" />
          <div class="review-content">
            <h3 class="review-name" style="color: ${colorScheme.text};">${review.name}</h3>
            <div class="review-stars">
              ${generateStars(review.rating, colorScheme.text)}
            </div>
            <p class="review-text" style="color: ${colorScheme.text};">${review.text}</p>
          </div>
        </div>
      `;
            reviewsContainer.appendChild(li);
        });

        // Show initial layout
        updateCarousel();

        // Setup navigation buttons
        const prevBtn = document.querySelector('.reviews-prev');
        const nextBtn = document.querySelector('.reviews-next');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
                updateCarousel();
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % reviews.length;
                updateCarousel();
            });
        }

    } catch (error) {
        console.error('Error loading reviews:', error);
    }
});

/**
 * Generate star rating HTML
 */
function generateStars(rating, textColor) {
    let starsHtml = '';
    // Use contrasting colors that work on all backgrounds
    const filledColor = textColor === '#FFFFFF' ? '#FDDD3C' : '#FFFFFF';
    const emptyColor = textColor === '#FFFFFF' ? 'rgba(253,221,60,0.3)' : 'rgba(255,255,255,0.3)';

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHtml += `<span class="star star-filled" style="color: ${filledColor};">★</span>`;
        } else {
            starsHtml += `<span class="star star-empty" style="color: ${emptyColor};">☆</span>`;
        }
    }
    return starsHtml;
}

/**
 * Update carousel with 3D perspective layout
 */
function updateCarousel() {
    const cards = document.querySelectorAll('.review-card');
    const totalCards = cards.length;

    cards.forEach((card, i) => {
        // Calculate position relative to current index
        let position = i - currentIndex;

        // Wrap around for circular effect
        if (position < -2) position += totalCards;
        if (position > 2) position -= totalCards;

        // Reset classes
        card.classList.remove('active', 'left-1', 'left-2', 'right-1', 'right-2');

        // Apply positioning with proper spacing to prevent collision
        if (position === 0) {
            // Center card (active)
            card.classList.add('active');
            card.style.transform = 'translate(-50%, -50%) translateX(0) translateZ(0) scale(1) rotateY(0deg)';
            card.style.opacity = '1';
            card.style.zIndex = '5';
        } else if (position === -1) {
            // Left card
            card.classList.add('left-1');
            card.style.transform = 'translate(-50%, -50%) translateX(-90%) translateZ(-100px) scale(0.8) rotateY(20deg)';
            card.style.opacity = '0.6';
            card.style.zIndex = '4';
        } else if (position === 1) {
            // Right card
            card.classList.add('right-1');
            card.style.transform = 'translate(-50%, -50%) translateX(90%) translateZ(-100px) scale(0.8) rotateY(-20deg)';
            card.style.opacity = '0.6';
            card.style.zIndex = '4';
        } else if (position === -2) {
            // Far left card
            card.classList.add('left-2');
            card.style.transform = 'translate(-50%, -50%) translateX(-180%) translateZ(-200px) scale(0.6) rotateY(30deg)';
            card.style.opacity = '0.3';
            card.style.zIndex = '3';
        } else if (position === 2) {
            // Far right card
            card.classList.add('right-2');
            card.style.transform = 'translate(-50%, -50%) translateX(180%) translateZ(-200px) scale(0.6) rotateY(-30deg)';
            card.style.opacity = '0.3';
            card.style.zIndex = '3';
        } else {
            // Hidden cards
            card.style.transform = 'translate(-50%, -50%) translateX(0) translateZ(-300px) scale(0.4)';
            card.style.opacity = '0';
            card.style.zIndex = '1';
        }
    });
}
