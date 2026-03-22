/**
 * Gallery Page - Album Modal Functionality
 */

let albums = [];
let currentAlbum = null;
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
    await loadGallery();
});

async function loadGallery() {
    try {
        const response = await fetch('data/gallery.json?_=' + Date.now(), {
            cache: 'no-store'
        });
        albums = await response.json();

        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;

        galleryGrid.innerHTML = '';

        albums.forEach((album, index) => {
            const tile = document.createElement('div');
            tile.className = 'gallery-tile';
            tile.setAttribute('data-album-id', album.id);
            tile.innerHTML = `
        <img src="${album.cover}" alt="${album.title}" onerror="this.src='assets/images/logo.png'">
        <div class="gallery-tile-overlay">
          <h3>${album.title}</h3>
          <span>${album.images.length} photos</span>
        </div>
      `;

            tile.addEventListener('click', () => openAlbum(album));
            galleryGrid.appendChild(tile);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function openAlbum(album) {
    currentAlbum = album;
    currentImageIndex = 0;

    const modal = document.getElementById('galleryModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    showImage(currentImageIndex);

    // Setup navigation
    const closeBtn = modal.querySelector('.modal-close');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');
    const overlay = modal.querySelector('.modal-overlay');

    closeBtn.onclick = closeModal;
    overlay.onclick = closeModal;
    prevBtn.onclick = () => navigateImage(-1);
    nextBtn.onclick = () => navigateImage(1);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
}

function closeModal() {
    const modal = document.getElementById('galleryModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyboard);
}

function navigateImage(direction) {
    if (!currentAlbum) return;

    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = currentAlbum.images.length - 1;
    } else if (currentImageIndex >= currentAlbum.images.length) {
        currentImageIndex = 0;
    }

    showImage(currentImageIndex);
}

function showImage(index) {
    if (!currentAlbum) return;

    const modalImage = document.querySelector('.modal-image');
    const counter = document.querySelector('.modal-counter');

    modalImage.src = currentAlbum.images[index];
    modalImage.alt = `${currentAlbum.title} - Photo ${index + 1}`;
    counter.textContent = `${index + 1} / ${currentAlbum.images.length}`;
}

function handleKeyboard(e) {
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        navigateImage(-1);
    } else if (e.key === 'ArrowRight') {
        navigateImage(1);
    }
}
