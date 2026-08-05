document.addEventListener("DOMContentLoaded", () => {
    const teamCards = document.querySelectorAll(".team-card");
    const modalOverlay = document.getElementById("teamModal");
    const closeBtn = document.querySelector(".team-modal-close");

    // Modal elements to populate
    const modalName = document.getElementById("modalName");
    const modalRole = document.getElementById("modalRole");
    const modalBio = document.getElementById("modalBio");
    const modalImage = document.getElementById("modalImage");

    teamCards.forEach(card => {
        card.addEventListener("click", () => {
            // Get data from clicked card
            const name = card.querySelector(".team-name").innerText;
            const role = card.querySelector(".founder-eyebrow").innerText;
            const bioHTML = card.querySelector(".founder-bio").innerHTML; // Use innerHTML to keep paragraphs
            
            // For the image, we can just grab the src of the img inside wavy-frame
            const imgSrc = card.querySelector(".wavy-frame img").src;

            // Populate Modal
            modalName.innerText = name;
            modalRole.innerText = role;
            modalBio.innerHTML = bioHTML;
            modalImage.src = imgSrc;

            // Check if there is an extra link directly inside the card (like Maha's link)
            const extraLinkElem = card.querySelector(".team-member-link");
            const modalExtraLinkContainer = document.getElementById("modalExtraLink");
            if (extraLinkElem) {
                modalExtraLinkContainer.innerHTML = extraLinkElem.innerHTML;
                modalExtraLinkContainer.style.display = "block";
            } else {
                modalExtraLinkContainer.style.display = "none";
                modalExtraLinkContainer.innerHTML = "";
            }

            // Show modal
            modalOverlay.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        });
    });

    const closeModal = () => {
        modalOverlay.classList.remove("active");
        document.body.style.overflow = "";
    };

    closeBtn.addEventListener("click", closeModal);

    // Close on click outside
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
            closeModal();
        }
    });
});
