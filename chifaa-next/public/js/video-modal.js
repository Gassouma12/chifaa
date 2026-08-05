/**
 * Video Modal Handler
 * Manages YouTube video modal for homepage play button
 */

document.addEventListener('DOMContentLoaded', () => {
    const playButtons = document.querySelectorAll('.play-button-container');
    const videoModal = document.getElementById('video-modal-overlay');
    const closeBtn = document.querySelector('.video-modal-close');
    const videoIframe = document.getElementById('video-iframe');
    let videoUrl = 'https://youtu.be/MiCzdrLB3AQ';

    // Load home data to get video URL
    fetch('/data/home.json?_=' + Date.now(), {
        cache: 'no-store'
    })
        .then(res => res.json())
        .then(data => {
            if (data.videoUrl) videoUrl = data.videoUrl;
        })
        .catch(err => {
            console.error('Error loading home data, using fallback:', err);
        });

    /**
     * Extract YouTube video ID from various URL formats
     * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
     */
    function extractYouTubeId(url) {
        if (!url) return null;
        const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/) || url.match(/embed\/([^?&]+)/);
        return match ? match[1] : null;
    }

    /**
     * Open video modal with YouTube embed
     */
    function openVideoModal() {
        if (!videoUrl) {
            console.warn('No video URL configured');
            return;
        }

        // Convert YouTube URL to embed format
        const videoId = extractYouTubeId(videoUrl);

        if (videoId) {
            // Safe embed URL without origin matching (which breaks locally on file://)
            videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            videoModal.style.display = 'flex';
            setTimeout(() => videoModal.classList.add('visible'), 10);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            console.error('Invalid YouTube URL:', videoUrl);
        }
    }

    /**
     * Close video modal and stop playback
     */
    function closeVideoModal() {
        videoModal.classList.remove('visible');
        setTimeout(() => {
            videoModal.style.display = 'none';
            videoIframe.src = ''; // Stop video playback
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    }

    // Event Listeners
    if (playButtons.length > 0) {
        playButtons.forEach(btn => {
            btn.addEventListener('click', openVideoModal);
            btn.style.cursor = 'pointer'; // Make it clear it's clickable
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeVideoModal);
    }

    // Close on overlay click
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('visible')) {
            closeVideoModal();
        }
    });
});
