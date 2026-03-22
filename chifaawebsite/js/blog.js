// Blog Page JavaScript

let blogData = [];
let authorsData = [];
let currentFilter = 'all';
let currentSearch = '';
let displayedArticles = 6;

// Load blog data from JSON
async function loadBlogData() {
    try {
        // Add cache-busting to prevent stale data
        const cacheBuster = `?_=${new Date().getTime()}`;
        const [blogResponse, authorsResponse] = await Promise.all([
            fetch(`data/blog.json${cacheBuster}`, { cache: 'no-store' }),
            fetch(`data/authors.json${cacheBuster}`, { cache: 'no-store' })
        ]);

        if (!blogResponse.ok) throw new Error('Failed to load blog data');
        if (!authorsResponse.ok) throw new Error('Failed to load authors data');

        blogData = await blogResponse.json();
        authorsData = await authorsResponse.json();
        generateCategoryFilters();
        renderArticles();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Generate category filter buttons dynamically
function generateCategoryFilters() {
    // Use the same categories as in the admin panel
    const allCategories = [
        'Community Hub',
        'Sahel & African Innovation',
        'Chifaa Space Experience',
        'Events & Programs',
        'Skills',
        'Careers',
        'Entrepreneurship',
        'Startups',
        'Chifaa Vision'
    ];

    const filtersContainer = document.querySelector('.blog-filters');
    filtersContainer.innerHTML = `
        <button class="filter-btn active" data-category="all">All</button>
        ${allCategories.map(cat =>
        `<button class="filter-btn" data-category="${cat}">${cat}</button>`
    ).join('')}
    `;

    // Reattach event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-category');
            displayedArticles = 6;
            renderArticles();
        });
    });
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Create blog card HTML
function createBlogCard(article, isFeatured = false) {
    // Handle categories as array
    const categories = Array.isArray(article.category) ? article.category : [article.category];
    const categoriesHtml = categories.map(cat => `<span class="blog-category">${cat}</span>`).join('');

    // Find author details from authors data
    const author = authorsData.find(a => a.name === article.author);
    const authorImage = author?.image || article.authorImage || 'https://placehold.co/64x64';
    const authorRole = author?.role || article.authorRole || '';

    return `
        <article class="blog-card ${isFeatured ? 'featured' : ''}" data-id="${article.id}">
            <img src="${article.coverImage}" alt="${article.title}" class="blog-card-image" loading="lazy">
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    ${categoriesHtml}
                    <span class="blog-read-time">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        ${article.readTime} min read
                    </span>
                </div>
                <h2 class="blog-card-title">${article.title}</h2>
                <p class="blog-card-excerpt">${article.excerpt}</p>
                <div class="blog-tags">
                    ${article.tags.slice(0, 3).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
                <div class="blog-card-footer">
                    <div class="blog-author">
                        <img src="${authorImage}" alt="${article.author}" class="blog-author-image">
                        <div class="blog-author-info">
                            <div class="blog-author-name">${article.author}</div>
                            <div class="blog-author-role">${authorRole}</div>
                        </div>
                    </div>
                    <div class="blog-date">${formatDate(article.publishedDate)}</div>
                </div>
            </div>
        </article>
    `;
}

// Filter articles
function filterArticles() {
    let filtered = blogData;

    // Filter by category
    if (currentFilter !== 'all') {
        filtered = filtered.filter(article => {
            const categories = Array.isArray(article.category) ? article.category : [article.category];
            return categories.includes(currentFilter);
        });
    }

    // Filter by search
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filtered = filtered.filter(article =>
            article.title.toLowerCase().includes(searchLower) ||
            article.excerpt.toLowerCase().includes(searchLower) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
            article.author.toLowerCase().includes(searchLower)
        );
    }

    return filtered;
}

// Render articles
function renderArticles() {
    const featuredGrid = document.getElementById('featured-grid');
    const blogGrid = document.getElementById('blog-grid');
    const loadMoreBtn = document.getElementById('load-more');
    const emptyState = document.getElementById('empty-state');
    const featuredSection = document.querySelector('.featured-section');

    const filtered = filterArticles();

    // Render featured articles (only if no filter/search active)
    if (currentFilter === 'all' && currentSearch === '') {
        const featured = filtered.filter(article => article.featured);
        if (featured.length > 0) {
            featuredSection.style.display = 'block';
            featuredGrid.innerHTML = featured.slice(0, 3).map(article =>
                createBlogCard(article, true)
            ).join('');
        } else {
            featuredSection.style.display = 'none';
        }
    } else {
        featuredSection.style.display = 'none';
    }

    // Render regular articles
    const regularArticles = currentFilter === 'all' && currentSearch === ''
        ? filtered.filter(article => !article.featured)
        : filtered;

    const articlesToShow = regularArticles.slice(0, displayedArticles);

    if (articlesToShow.length > 0) {
        blogGrid.innerHTML = articlesToShow.map(article =>
            createBlogCard(article)
        ).join('');
    } else {
        blogGrid.innerHTML = '';
    }

    // Show/hide load more button
    if (regularArticles.length > displayedArticles) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }

    // Show/hide empty state
    if (filtered.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    // Add click listeners to cards
    document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', function () {
            const articleId = this.getAttribute('data-id');
            window.location.href = `article.html?id=${articleId}`;
        });
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadBlogData();

    // Real-time search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    function performSearch() {
        currentSearch = searchInput.value;
        displayedArticles = 6; // Reset displayed count
        renderArticles();
    }

    // Real-time search as user types
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Load more button
    document.getElementById('load-more').addEventListener('click', () => {
        displayedArticles += 6;
        renderArticles();
    });
});
