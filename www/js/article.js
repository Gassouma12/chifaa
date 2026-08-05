// Article Page JavaScript

let blogData = [];
let authorsData = [];

// Load blog data from JSON
async function loadBlogData() {
    try {
        // Add cache-busting to prevent stale data
        const lang = localStorage.getItem('chifaa_lang') || 'en';
        const cacheBuster = `?_=${new Date().getTime()}`;
        const blogFile = lang === 'ar' ? 'data/blog_ar.json' : 'data/blog.json';
        const authorsFile = lang === 'ar' ? 'data/authors_ar.json' : 'data/authors.json';
        const [blogResponse, authorsResponse] = await Promise.all([
            fetch(`${blogFile}${cacheBuster}`, { cache: 'no-store' }),
            fetch(`${authorsFile}${cacheBuster}`, { cache: 'no-store' })
        ]);

        if (!blogResponse.ok) throw new Error('Failed to load blog data');
        if (!authorsResponse.ok) throw new Error('Failed to load authors data');

        blogData = await blogResponse.json();
        authorsData = await authorsResponse.json();
        loadArticle();
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('article-content').innerHTML = '<p>Error loading article. Please try again later.</p>';
    }
}

// Embedded blog data (same as blog.js) - REMOVED

// Get article ID from URL
function getArticleIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format views
function formatViews(views) {
    if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K views';
    }
    return views + ' views';
}

// Create related article card
function createRelatedCard(article) {
    const categories = Array.isArray(article.category) ? article.category : [article.category];
    const categoryHtml = categories.map(cat => `<span class="related-card-category">${cat}</span>`).join(' ');

    const articleImageSrc = article.coverImage;

    return `
        <div class="related-card" onclick="window.location.href='article.html?id=${article.id}'">
            <img src="${articleImageSrc}" alt="${article.title}" class="related-card-image" loading="lazy">
            <div class="related-card-content">
                ${categoryHtml}
                <h3 class="related-card-title">${article.title}</h3>
                <div class="related-card-meta">
                    <span>${formatDate(article.publishedDate)}</span>
                    <span>•</span>
                    <span>${article.readTime} min read</span>
                </div>
            </div>
        </div>
    `;
}

// Load and display article
function loadArticle() {
    const articleId = getArticleIdFromUrl();
    const article = blogData.find(a => a.id === articleId);

    if (!article) {
        window.location.href = 'voices.html';
        return;
    }

    // Find author details from authors data
    const author = authorsData.find(a => a.name === article.author);
    const authorImage = author?.image || article.authorImage || 'https://placehold.co/64x64';
    const authorRole = author?.role || article.authorRole || '';
    const authorSocials = author?.socials || {};

    // Update page title
    document.title = `${article.title} - Chifaa`;

    // Populate article content - handle categories as array
    const categories = Array.isArray(article.category) ? article.category : [article.category];
    const categoryContainer = document.getElementById('article-category');
    categoryContainer.innerHTML = categories.map(cat => `<span class="article-category-chip">${cat}</span>`).join('');
    document.getElementById('article-title').textContent = article.title;
    document.getElementById('author-image').src = authorImage;
    document.getElementById('author-image').alt = article.author;
    document.getElementById('author-name').textContent = article.author;
    document.getElementById('author-role').textContent = authorRole;
    document.getElementById('article-date').textContent = formatDate(article.publishedDate);
    document.getElementById('article-read-time').textContent = `${article.readTime} min read`;
    document.getElementById('article-views').textContent = formatViews(article.views);

    // Map the actual image extensions to display matching Voices banner
    const articleImageSrc = article.coverImage;

    document.getElementById('article-cover-image').src = articleImageSrc;
    document.getElementById('article-cover-image').alt = article.title;
    document.getElementById('article-text').innerHTML = article.content;

    // Add social media icons
    const socialsContainer = document.getElementById('author-socials');
    if (socialsContainer && author) {
        const socialIcons = [];

        if (authorSocials.facebook) {
            socialIcons.push(`
                <a href="${authorSocials.facebook}" target="_blank" rel="noopener noreferrer" class="social-icon" title="Facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                </a>
            `);
        }

        if (authorSocials.instagram) {
            socialIcons.push(`
                <a href="${authorSocials.instagram}" target="_blank" rel="noopener noreferrer" class="social-icon" title="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>
            `);
        }

        if (authorSocials.linkedin) {
            socialIcons.push(`
                <a href="${authorSocials.linkedin}" target="_blank" rel="noopener noreferrer" class="social-icon" title="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
            `);
        }

        socialsContainer.innerHTML = socialIcons.join('');
    }

    // Populate tags
    const tagsContainer = document.getElementById('article-tags');
    tagsContainer.innerHTML = article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('');

    // Wire share buttons
    setupShareSection(article);

    // Load related articles (same category, excluding current)
    const relatedArticles = blogData
        .filter(a => a.category === article.category && a.id !== article.id)
        .slice(0, 3);

    const relatedGrid = document.getElementById('related-grid');
    if (relatedArticles.length > 0) {
        relatedGrid.innerHTML = relatedArticles.map(a => createRelatedCard(a)).join('');
    } else {
        // If no articles in same category, show random articles
        const randomArticles = blogData
            .filter(a => a.id !== article.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        relatedGrid.innerHTML = randomArticles.map(a => createRelatedCard(a)).join('');
    }
}

// Share section: wire network links to the current article URL
function setupShareSection(article) {
    const shareSection = document.getElementById('article-share');
    if (!shareSection) return;

    const url = window.location.href;
    const enc = encodeURIComponent;
    const links = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
        whatsapp: `https://wa.me/?text=${enc(article.title + '\n' + url)}`
    };

    shareSection.querySelectorAll('a.share-btn[data-network]').forEach(btn => {
        const network = btn.dataset.network;
        if (!links[network]) return;
        btn.href = links[network];
        if (network !== 'whatsapp') {
            // Open FB/LinkedIn in a centered popup for a smoother flow
            btn.addEventListener('click', e => {
                e.preventDefault();
                const w = 600, h = 540;
                const left = Math.round((screen.width - w) / 2);
                const top = Math.round((screen.height - h) / 2);
                window.open(links[network], 'chifaa-share',
                    `width=${w},height=${h},left=${left},top=${top},noopener`);
            });
        }
    });

    // Instagram has no web share URL: copy the link and confirm with a toast
    const igBtn = shareSection.querySelector('.share-instagram');
    if (igBtn) {
        igBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(url);
            } catch (e) {
                // Clipboard API blocked (http/permissions): legacy fallback
                const ta = document.createElement('textarea');
                ta.value = url;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            igBtn.classList.add('copied');
            const toast = document.getElementById('share-toast');
            if (toast) toast.classList.add('visible');
            clearTimeout(igBtn._copyTimer);
            igBtn._copyTimer = setTimeout(() => {
                igBtn.classList.remove('copied');
                if (toast) toast.classList.remove('visible');
            }, 2400);
        });
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', loadBlogData);
