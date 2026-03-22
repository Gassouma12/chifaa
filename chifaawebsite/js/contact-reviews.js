/**
 * Contact Page - Reviews Carousel
 * Displays reviews one at a time in the address tile
 */

let currentReviewIndex = 0;
let contactReviews = [];

document.addEventListener('DOMContentLoaded', async () => {
    const addressTile = document.querySelector('.tile-address');

    if (!addressTile) {
        return;
    }

    try {
        // Load reviews data
        const response = await fetch('data/reviews.json?_=' + Date.now(), {
            cache: 'no-store'
        });
        contactReviews = await response.json();

        if (!contactReviews || contactReviews.length === 0) {
            console.log('No reviews found');
            return;
        }

        // Create review elements
        contactReviews.forEach((review, index) => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review-content';
            reviewDiv.setAttribute('data-index', index);

            reviewDiv.innerHTML = `
        <img src="${review.image}" alt="${review.name}" class="review-image" onerror="this.src='assets/images/logo.png'" />
        <h3 class="review-name">${review.name}</h3>
        <div class="review-stars">
          ${generateStars(review.rating)}
        </div>
        <p class="review-text">${review.text}</p>
      `;

            // Insert before navigation buttons
            const prevBtn = addressTile.querySelector('.review-nav.prev');
            addressTile.insertBefore(reviewDiv, prevBtn);
        });

        // Show first review
        showReview(0);

        // Setup navigation
        const prevBtn = addressTile.querySelector('.review-nav.prev');
        const nextBtn = addressTile.querySelector('.review-nav.next');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentReviewIndex = (currentReviewIndex - 1 + contactReviews.length) % contactReviews.length;
                showReview(currentReviewIndex);
            });

            nextBtn.addEventListener('click', () => {
                currentReviewIndex = (currentReviewIndex + 1) % contactReviews.length;
                showReview(currentReviewIndex);
            });
        }

    } catch (error) {
        console.error('Error loading reviews:', error);
    }
});

/**
 * Generate star rating HTML
 */
function generateStars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHtml += '<span class="star">★</span>';
        } else {
            starsHtml += '<span class="star" style="opacity: 0.3;">☆</span>';
        }
    }
    return starsHtml;
}

/**
 * Show specific review
 */
function showReview(index) {
    const reviews = document.querySelectorAll('.tile-address .review-content');
    reviews.forEach((review, i) => {
        if (i === index) {
            review.classList.add('active');
        } else {
            review.classList.remove('active');
        }
    });
}
