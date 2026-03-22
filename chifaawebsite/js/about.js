// About Page JavaScript - Load from JSON

// Load about content
async function loadAboutContent() {
    try {
        const response = await fetch('data/about.json');
        const aboutData = await response.json();

        const bodyCopyBlock = document.querySelector('.body-copy-block');
        const socialButtonsRow = document.querySelector('.social-buttons-row');

        // Clear existing content
        if (bodyCopyBlock) {
            bodyCopyBlock.innerHTML = '';

            // Add paragraphs
            aboutData.paragraphs.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                bodyCopyBlock.appendChild(p);
            });
        }

        // Add social links
        if (socialButtonsRow) {
            socialButtonsRow.innerHTML = '';

            aboutData.socialLinks.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.className = `social-pill ${link.class}`;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.innerHTML = `<i class="${link.icon}"></i> ${link.name}`;
                socialButtonsRow.appendChild(a);
            });
        }
    } catch (error) {
        console.error('Error loading about content:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadAboutContent);
