// Article Page JavaScript

let blogData = [];
let authorsData = [];

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
        loadArticle();
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('article-content').innerHTML = '<p>Error loading article. Please try again later.</p>';
    }
}

// Embedded blog data (same as blog.js) - REMOVED
const blogDataOld = [
    {
        "id": 1,
        "title": "Building a Thriving Startup Ecosystem in the Sahel Region",
        "slug": "startup-ecosystem-sahel",
        "author": "Ichraf Jarray",
        "authorRole": "CEO @ Chifaa",
        "authorImage": "https://placehold.co/64x64",
        "coverImage": "https://placehold.co/800x450/FDDD3C/060507?text=Startup+Ecosystem",
        "excerpt": "Discover how Chifaa is fostering innovation and entrepreneurship in Tunisia, creating opportunities for the next generation of founders.",
        "content": `<p>The Sahel region has immense potential for innovation and entrepreneurship. At Chifaa, we're committed to creating an environment where startups can thrive, innovate, and make a real impact on their communities.</p>

<h2>The Challenge</h2>
<p>Despite having talented entrepreneurs and innovative ideas, the Sahel region has historically faced challenges in building a robust startup ecosystem. Limited access to funding, mentorship, and infrastructure has held back many promising ventures.</p>

<h2>Our Approach</h2>
<p>At Chifaa, we're taking a holistic approach to ecosystem building:</p>
<ul>
    <li><strong>Infrastructure:</strong> Providing world-class coworking spaces and facilities</li>
    <li><strong>Mentorship:</strong> Connecting founders with experienced advisors and industry experts</li>
    <li><strong>Funding:</strong> Facilitating connections with investors and running pitch competitions</li>
    <li><strong>Community:</strong> Creating a vibrant community where entrepreneurs support each other</li>
</ul>

<h2>Early Success Stories</h2>
<p>We're already seeing the impact of these efforts. Startups like Funnycation, PARKITO, and others have grown significantly through our programs, creating jobs and solving real problems in the region.</p>

<blockquote>"Chifaa gave us not just a space to work, but a community to grow with. The connections and support we received were invaluable." - Startup Founder</blockquote>

<h2>Looking Forward</h2>
<p>This is just the beginning. We're expanding our programs, bringing in more mentors, and creating even more opportunities for the next generation of entrepreneurs. The future of innovation in the Sahel is bright, and we're excited to be part of it.</p>`,
        "category": "Entrepreneurship",
        "tags": ["Startups", "Innovation", "Sahel", "Entrepreneurship"],
        "readTime": 5,
        "publishedDate": "2025-12-15",
        "featured": true,
        "views": 1250
    },
    {
        "id": 2,
        "title": "From Idea to Launch: A Founder's Journey with Funnycation",
        "slug": "funnycation-founder-journey",
        "author": "Mohamed B. Hammouda",
        "authorRole": "CEO @ Funnycation",
        "authorImage": "https://placehold.co/64x64",
        "coverImage": "https://placehold.co/800x450/D49FD3/060507?text=Founder+Journey",
        "excerpt": "Mohamed shares his experience of building an ed-tech startup from the ground up, including challenges faced and lessons learned along the way.",
        "content": `<p>Starting Funnycation was both exhilarating and terrifying. Here's what I learned about turning an educational vision into reality.</p>

<h2>The Spark</h2>
<p>The idea for Funnycation came from a simple observation: students learn better when they're engaged and having fun. But most educational tools were boring, outdated, and didn't leverage modern technology effectively.</p>

<h2>Building the MVP</h2>
<p>We didn't wait for perfection. Within three months, we had a basic prototype that we could test with real students. The feedback was invaluable and shaped everything that came next.</p>

<h3>Key Lessons Learned:</h3>
<ol>
    <li><strong>Talk to users early and often:</strong> Don't wait until your product is "ready"</li>
    <li><strong>Iterate quickly:</strong> The faster you can test and learn, the better</li>
    <li><strong>Focus on one problem:</strong> Don't try to solve everything at once</li>
    <li><strong>Build a team you trust:</strong> Co-founders and early employees are critical</li>
</ol>

<h2>The Pivot</h2>
<p>Six months in, we realized our initial approach wasn't working. Instead of giving up, we pivoted based on what we learned. This decision saved the company.</p>

<h2>Finding Product-Market Fit</h2>
<p>When you have product-market fit, you know it. Students started telling their friends, schools reached out to us, and growth became organic. It took 18 months, but we got there.</p>

<blockquote>"The hardest part wasn't building the product—it was finding the right problem to solve and the right market to serve." - Mohamed B. Hammouda</blockquote>

<h2>What's Next</h2>
<p>We're now scaling across Tunisia and looking at regional expansion. The journey from idea to launch taught me more than any business school could have. My advice? Just start. The perfect time will never come.</p>`,
        "category": "Founder Stories",
        "tags": ["Founders", "Ed-Tech", "Startup Journey", "Lessons Learned"],
        "readTime": 8,
        "publishedDate": "2025-12-10",
        "featured": true,
        "views": 892
    },
    {
        "id": 3,
        "title": "The Power of Community: How Coworking Spaces Drive Innovation",
        "slug": "coworking-spaces-innovation",
        "author": "Marouen Nouira",
        "authorRole": "Community Manager @ Chifaa",
        "authorImage": "https://placehold.co/64x64",
        "coverImage": "https://placehold.co/800x450/81D8F8/060507?text=Coworking+Innovation",
        "excerpt": "Explore how collaborative workspaces create synergies between entrepreneurs, leading to unexpected partnerships and groundbreaking ideas.",
        "content": `<p>In today's connected world, the right environment can make all the difference. Here's why coworking spaces are more than just desks and WiFi.</p>

<h2>Beyond Physical Space</h2>
<p>Coworking spaces provide infrastructure, but their real value lies in the community they create. When you put talented, ambitious people in the same space, magic happens.</p>

<h2>Serendipitous Connections</h2>
<p>Some of the best business opportunities come from casual conversations by the coffee machine. We've seen:</p>
<ul>
    <li>Technical co-founders meeting their business partners</li>
    <li>Startups finding their first customers in the same building</li>
    <li>Cross-pollination of ideas leading to new products</li>
    <li>Informal mentorship from more experienced entrepreneurs</li>
</ul>

<h2>The Collaboration Effect</h2>
<p>Unlike traditional offices where everyone works for the same company, coworking spaces bring together diverse expertise. A designer might help a developer, a marketer might give feedback to a product person.</p>

<h2>Real-World Impact</h2>
<p>At Chifaa, we've seen multiple collaborations emerge organically. Two startups merged their technologies, another found their CTO, and countless informal partnerships have formed.</p>

<blockquote>"I came for the desk, I stayed for the community." - Chifaa Member</blockquote>

<h2>Building Your Network</h2>
<p>Your network is your net worth, especially in startups. Coworking spaces accelerate network building by putting you in daily contact with other entrepreneurs, investors, and potential partners.</p>`,
        "category": "Coworking",
        "tags": ["Coworking", "Community", "Collaboration", "Innovation"],
        "readTime": 6,
        "publishedDate": "2025-12-08",
        "featured": false,
        "views": 745
    },
    {
        "id": 4,
        "title": "5 Essential Digital Marketing Strategies for Tunisian Startups",
        "slug": "digital-marketing-strategies-tunisia",
        "author": "Chiheb E. Fatnassi",
        "authorRole": "CCO @ Pixelup",
        "authorImage": "https://placehold.co/64x64",
        "coverImage": "https://placehold.co/800x450/8DB0A1/060507?text=Digital+Marketing",
        "excerpt": "Learn the most effective digital marketing tactics that local startups can implement on a limited budget to reach their target audience.",
        "content": `<p>Digital marketing doesn't have to break the bank. Here are five proven strategies that work for Tunisian startups on a limited budget.</p>

<h2>1. Content Marketing</h2>
<p>Create valuable content that attracts your target audience. Blog posts, videos, and social media content establish you as an expert and drive organic traffic.</p>

<h2>2. Social Media Engagement</h2>
<p>Don't just post—engage. Respond to comments, participate in conversations, and build genuine relationships with your audience. Facebook and Instagram are particularly effective in Tunisia.</p>

<h2>3. Email Marketing</h2>
<p>Build an email list from day one. Email remains one of the highest ROI marketing channels, and tools like Mailchimp offer free tiers for startups.</p>

<h2>4. Influencer Partnerships</h2>
<p>Partner with micro-influencers in your niche. They're more affordable than major influencers and often have more engaged audiences.</p>

<h2>5. SEO Fundamentals</h2>
<p>Optimize your website for search engines. Start with keyword research, create quality content, and build backlinks. Local SEO is especially important for Tunisian businesses.</p>

<h2>Measuring Success</h2>
<p>Track your metrics obsessively. Use Google Analytics, social media insights, and conversion tracking to understand what's working and what's not.</p>

<blockquote>"The best marketing doesn't feel like marketing." - Chiheb E. Fatnassi</blockquote>`,
        "category": "Marketing",
        "tags": ["Marketing", "Digital Strategy", "Growth", "Social Media"],
        "readTime": 7,
        "publishedDate": "2025-12-05",
        "featured": false,
        "views": 1100
    },
    {
        "id": 5,
        "title": "Fundraising 101: Securing Your First Investment Round",
        "slug": "fundraising-first-investment",
        "author": "Slaheddine Dardouri",
        "authorRole": "Startups Advisor @ Swisscontact",
        "authorImage": "https://placehold.co/64x64",
        "coverImage": "https://placehold.co/800x450/CBDF92/060507?text=Fundraising+Guide",
        "excerpt": "A comprehensive guide to preparing your startup for investor meetings, crafting the perfect pitch, and closing your seed round.",
        "content": `<p>Fundraising can be daunting for first-time founders. Here's everything you need to know about securing your initial investment.</p>

<h2>Before You Start</h2>
<p>Don't fundraise too early. Investors want to see traction, a clear market opportunity, and a team that can execute. Build your MVP first and get some users.</p>

<h2>The Pitch Deck</h2>
<p>Your pitch deck should tell a compelling story:</p>
<ol>
    <li><strong>Problem:</strong> What pain point are you solving?</li>
    <li><strong>Solution:</strong> How does your product solve it?</li>
    <li><strong>Market:</strong> How big is the opportunity?</li>
    <li><strong>Traction:</strong> What have you achieved so far?</li>
    <li><strong>Team:</strong> Why are you the right people to build this?</li>
    <li><strong>Ask:</strong> How much are you raising and what will you do with it?</li>
</ol>

<h2>Finding the Right Investors</h2>
<p>Not all money is equal. Look for investors who:</p>
<ul>
    <li>Have experience in your industry</li>
    <li>Can provide valuable connections and advice</li>
    <li>Share your vision and values</li>
    <li>Have a track record of supporting founders</li>
</ul>

<h2>The Due Diligence Process</h2>
<p>Be prepared for investors to dig deep into your business. Have your financials, legal documents, and business metrics ready to go.</p>

<h2>Negotiating Terms</h2>
<p>Valuation matters, but so do the terms. Pay attention to:</p>
<ul>
    <li>Board composition</li>
    <li>Liquidation preferences</li>
    <li>Anti-dilution provisions</li>
    <li>Vesting schedules</li>
</ul>

<blockquote>"Fundraising is a means to an end, not the end itself. Focus on building a great business, and the money will follow." - Slaheddine Dardouri</blockquote>`,
        "category": "Funding",
        "tags": ["Fundraising", "Investment", "Pitch Deck", "Investors"],
        "readTime": 10,
        "publishedDate": "2025-12-01",
        "featured": false,
        "views": 1580
    },
    {
        "id": 6,
        "title": "Tech Trends 2026: What Sahel Startups Need to Watch",
        "slug": "tech-trends-2026-sahel",
        "author": "Ali Ayari",
        "authorRole": "Co-founder @ Wiseboard",
        "authorImage": "https://placehold.co/64x64",
        "coverImage": "https://placehold.co/800x450/E8DABE/060507?text=Tech+Trends+2026",
        "excerpt": "As we approach 2026, discover the emerging technologies and trends that will shape the future of business in North Africa.",
        "content": `<p>The tech landscape is evolving rapidly. Here are the trends that will define 2026 for startups in our region.</p>

<h2>1. AI for Everyone</h2>
<p>Artificial Intelligence is no longer just for tech giants. Open-source models and accessible APIs are democratizing AI, allowing startups to build sophisticated features without massive resources.</p>

<h2>2. Mobile-First Everything</h2>
<p>In North Africa, mobile is not just first—it's often the only device. Successful startups will design for mobile from day one, not as an afterthought.</p>

<h2>3. Fintech Innovation</h2>
<p>With growing smartphone penetration and evolving regulations, fintech represents massive opportunities. Digital payments, lending, and financial services are ripe for disruption.</p>

<h2>4. Climate Tech</h2>
<p>Climate change is hitting our region hard. Startups working on sustainable solutions, from agriculture to energy, will find both impact and business opportunities.</p>

<h2>5. Remote Work Infrastructure</h2>
<p>The shift to remote work is permanent. Tools, platforms, and services that support distributed teams will continue to grow.</p>

<h2>What This Means for Founders</h2>
<p>Stay curious, keep learning, and don't be afraid to adopt new technologies. The startups that embrace these trends early will have a significant advantage.</p>

<blockquote>"The best way to predict the future is to build it." - Ali Ayari</blockquote>`,
        "category": "Technology",
        "tags": ["Tech Trends", "AI", "Future", "Innovation"],
        "readTime": 9,
        "publishedDate": "2025-11-28",
        "featured": true,
        "views": 2100
    },
    {
        "id": 7,
        "title": "Building a Minimum Viable Product: Best Practices",
        "slug": "mvp-best-practices",
        "author": "Jeff Ford",
        "authorRole": "Global Account Executive @ ConferenceDirect",
        "authorImage": "https://placehold.co/64x64",
        "coverImage": "https://placehold.co/800x450/FF1576/060507?text=MVP+Best+Practices",
        "excerpt": "Learn how to build a lean MVP that validates your business idea without overinvesting in features your customers don't need.",
        "content": `<p>Your MVP doesn't need to be perfect. Here's how to build something that tests your core hypothesis effectively.</p>

<h2>What is an MVP?</h2>
<p>A Minimum Viable Product is the simplest version of your product that can test your core hypothesis. It's not about building a bad product—it's about building the right product.</p>

<h2>Define Your Core Value Proposition</h2>
<p>What's the one problem you're solving? Everything else is secondary. Your MVP should focus laser-like on this single value proposition.</p>

<h2>Cut Ruthlessly</h2>
<p>Features you might think you need:</p>
<ul>
    <li>Perfect design</li>
    <li>Multiple user types</li>
    <li>Advanced analytics</li>
    <li>Social features</li>
    <li>Mobile apps</li>
</ul>
<p>What you actually need: Something that solves the core problem for one user type.</p>

<h2>Build, Measure, Learn</h2>
<p>The goal of an MVP is to learn. Ship quickly, measure how users interact with your product, and learn from their behavior.</p>

<h2>When to Pivot</h2>
<p>If your MVP isn't gaining traction, be willing to pivot. The faster you can test and adjust, the better your chances of success.</p>

<blockquote>"An MVP is not about building less—it's about learning more." - Jeff Ford</blockquote>`,
        "category": "Product Development",
        "tags": ["MVP", "Product", "Lean Startup", "Development"],
        "readTime": 6,
        "publishedDate": "2025-11-25",
        "featured": false,
        "views": 980
    },
    {
        "id": 8,
        "title": "Chifaa Success Stories: How PARKITO Found Product-Market Fit",
        "slug": "parkito-success-story",
        "author": "Mondher Kebiri",
        "authorRole": "COO @ Chifaa",
        "authorImage": "https://placehold.co/64x64",
        "coverImage": "https://placehold.co/800x450/10A5EE/060507?text=Success+Story",
        "excerpt": "An inside look at how PARKITO pivoted their business model and found the perfect product-market fit in the smart parking industry.",
        "content": `<p>PARKITO's journey wasn't straightforward, but their persistence paid off. Here's their story of finding product-market fit.</p>

<h2>The Original Idea</h2>
<p>PARKITO started with a simple idea: make parking easier in crowded cities. But their first approach—a mobile app for finding parking spots—didn't gain traction.</p>

<h2>The Pivot</h2>
<p>After months of struggling, the team realized they were solving the wrong problem. Drivers didn't just need to find parking—they needed smart parking management for businesses.</p>

<h2>The New Approach</h2>
<p>PARKITO pivoted to B2B, offering smart parking solutions for:</p>
<ul>
    <li>Shopping malls</li>
    <li>Office buildings</li>
    <li>Residential complexes</li>
    <li>Event venues</li>
</ul>

<h2>Finding Product-Market Fit</h2>
<p>The change was dramatic. Within three months of pivoting:</p>
<ul>
    <li>Signed their first 5 enterprise customers</li>
    <li>Generated consistent revenue</li>
    <li>Built a repeatable sales process</li>
    <li>Raised their seed round</li>
</ul>

<h2>Lessons Learned</h2>
<p>The PARKITO team learned that:</p>
<ol>
    <li>Your first idea is rarely your best idea</li>
    <li>Listen to the market, not just your vision</li>
    <li>B2B can be more profitable than B2C</li>
    <li>Persistence and adaptability are key</li>
</ol>

<blockquote>"We didn't fail with our first idea—we learned what didn't work and adjusted. That's not failure, that's progress." - PARKITO Team</blockquote>

<h2>What's Next</h2>
<p>PARKITO is now expanding across Tunisia and planning regional growth. Their success shows that with the right support, mentorship, and willingness to adapt, Tunisian startups can compete globally.</p>`,
        "category": "Success Stories",
        "tags": ["Case Study", "Startups", "Product-Market Fit", "PARKITO"],
        "readTime": 12,
        "publishedDate": "2025-11-20",
        "featured": false,
        "views": 1450
    }
];

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
    return `
        <div class="related-card" onclick="window.location.href='article.html?id=${article.id}'">
            <img src="${article.coverImage}" alt="${article.title}" class="related-card-image" loading="lazy">
            <div class="related-card-content">
                <span class="related-card-category">${article.category}</span>
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
    document.title = `${article.title} - Hive 12`;

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
    document.getElementById('article-cover-image').src = article.coverImage;
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

// Initialize on load
document.addEventListener('DOMContentLoaded', loadBlogData);
