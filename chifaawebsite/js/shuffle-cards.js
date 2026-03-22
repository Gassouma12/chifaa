/**
 * Shuffle Cards - Drag-to-shuffle testimonial cards
 * Vanilla JS implementation
 */

let reviews = [];
let positions = ['front', 'middle', 'back'];
let isDragging = false;
let dragStartX = 0;
let currentDragX = 0;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/reviews.json?_=' + Date.now(), {
            cache: 'no-store'
        });
        reviews = await response.json();

        const container = document.querySelector('.shuffle-cards-stack');
        if (!container || !reviews || reviews.length === 0) {
            console.log('Container not found or no reviews');
            return;
        }

        // Limit to first 3 reviews for the stack
        reviews = reviews.slice(0, 3);

        // Create cards
        reviews.forEach((review, index) => {
            const card = createCard(review, positions[index], index);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading reviews:', error);
    }
});

function createCard(review, position, index) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.setAttribute('data-position', position);
    card.setAttribute('data-index', index);
    
    const isFront = position === 'front';
    
    // Build star rating
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    card.innerHTML = `
        <div class="testimonial-avatar">
            <img src="${review.image || 'assets/images/logo.png'}" 
                 alt="${review.name}" 
                 onerror="this.src='assets/images/logo.png'">
        </div>
        <div class="testimonial-text">"${review.text}"</div>
        <div class="testimonial-rating">${stars}</div>
        <div class="testimonial-author">${review.name}</div>
        ${isFront ? '<div class="drag-hint">← Drag to see next</div>' : ''}
    `;

    // Apply initial styling based on position
    updateCardPosition(card, position);

    // Add drag listeners only to front card
    if (isFront) {
        card.style.cursor = 'grab';
        
        card.addEventListener('mousedown', handleDragStart);
        card.addEventListener('touchstart', handleDragStart, { passive: false });
    }

    return card;
}

function handleDragStart(e) {
    const card = e.currentTarget;
    if (card.getAttribute('data-position') !== 'front') return;

    isDragging = true;
    card.style.cursor = 'grabbing';
    
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    dragStartX = clientX;
    currentDragX = 0;

    const handleDragMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        currentDragX = clientX - dragStartX;
        
        // Apply drag transform
        card.style.transform = `rotate(-6deg) translateX(${currentDragX}px)`;
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        
        isDragging = false;
        card.style.cursor = 'grab';
        
        // If dragged left more than 150px, shuffle
        if (currentDragX < -150) {
            handleShuffle();
        } else {
            // Reset position
            card.style.transform = 'rotate(-6deg) translateX(0)';
        }
        
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchend', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
}

function handleShuffle() {
    // Rotate positions array
    positions.unshift(positions.pop());
    
    // Update all cards
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach((card, index) => {
        const newPosition = positions[index];
        card.setAttribute('data-position', newPosition);
        updateCardPosition(card, newPosition);
        
        // Update drag listeners
        const isFront = newPosition === 'front';
        card.style.cursor = isFront ? 'grab' : 'default';
        
        // Remove old hint and add new one if needed
        const oldHint = card.querySelector('.drag-hint');
        if (oldHint) oldHint.remove();
        
        if (isFront) {
            const hint = document.createElement('div');
            hint.className = 'drag-hint';
            hint.textContent = '← Drag to see next';
            card.appendChild(hint);
            
            // Re-attach drag listeners
            card.addEventListener('mousedown', handleDragStart);
            card.addEventListener('touchstart', handleDragStart, { passive: false });
        } else {
            // Remove drag listeners from non-front cards
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
        }
    });
}

function updateCardPosition(card, position) {
    // Remove transition temporarily for immediate updates during drag
    if (!isDragging) {
        card.style.transition = 'all 0.35s ease';
    }
    
    const positions = {
        front: {
            zIndex: 2,
            transform: 'rotate(-6deg) translateX(0)',
            left: '0%'
        },
        middle: {
            zIndex: 1,
            transform: 'rotate(0deg) translateX(0)',
            left: '33%'
        },
        back: {
            zIndex: 0,
            transform: 'rotate(6deg) translateX(0)',
            left: '66%'
        }
    };

    const pos = positions[position];
    card.style.zIndex = pos.zIndex;
    card.style.transform = pos.transform;
    card.style.left = pos.left;
}
