document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('info-modal');
    if (!modal) return; // Don't run if modal isn't on the page

    const modalBody = modal.querySelector('.modal-body');
    const closeModalBtn = modal.querySelector('.modal-close-btn');

    // Function to open the modal and populate it with content
    function openModal(content) {
        modalBody.innerHTML = content;
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('visible'), 10); // Delay for transition
    }

    // Function to close the modal
    function closeModal() {
        modal.classList.remove('visible');
        setTimeout(() => {
            modal.style.display = 'none';
            modalBody.innerHTML = ''; // Clear content
        }, 300); // Wait for transition to finish
    }

    // Use event delegation - attach listener to document body instead of individual cards
    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.team-card, .service-card, .expert-card, .startup-tile, .founder-card, .project-card');
        if (!card) return;

        card.style.cursor = 'pointer'; // Add pointer cursor to indicate clickability

        const details = card.querySelector('.modal-details');
        const isFounderCard = card.classList.contains('founder-card');
        const isTeamCard = card.classList.contains('team-card');

        // For founder and team cards, add special class to modal
        if (isFounderCard || isTeamCard) {
            modal.classList.add('founder-modal');
        } else {
            modal.classList.remove('founder-modal');
        }

        const imageContainer = card.querySelector('.portrait-badge') || card.querySelector('img');

        let content = '';

        // Only clone image for cards that don't have image in modal-details (founders and team have it)
        if (imageContainer && !isFounderCard && !isTeamCard) {
            // Clone the image or its container to avoid moving it from the card
            const imageClone = imageContainer.cloneNode(true);
            // Add a class for styling within the modal
            imageClone.classList.add('modal-image');
            content += imageClone.outerHTML;
        }

        if (details) {
            content += details.innerHTML;
        }

        if (content) {
            openModal(content);
        }
    });

    // Close modal when the close button is clicked
    closeModalBtn.addEventListener('click', closeModal);

    // Close modal when clicking on the overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with the Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('visible')) {
            closeModal();
        }
    });
});
