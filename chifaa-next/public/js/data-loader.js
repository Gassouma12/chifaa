// Data Loader Utility
// This file provides functions to load JSON data and render it to the DOM

/**
 * Fetch JSON data from a file
 * @param {string} url - Path to the JSON file
 * @returns {Promise<Array>} - Parsed JSON data
 */
async function loadJSON(url) {
    try {
        // Add cache-busting parameter to prevent caching
        const cacheBuster = `?_=${new Date().getTime()}`;
        const response = await fetch(url + cacheBuster, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading JSON from ${url}:`, error);
        return [];
    }
}

/**
 * Render projects to the DOM
 * @param {Array} projects - Array of project objects
 * @param {string} containerId - ID of the container element
 */
function renderProjects(projects, containerId = 'projects-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.projects-grid');
    if (!container) return;

    container.innerHTML = projects.map(project => `
        <div class="project-card" style="background-color: ${project.color || '#f3f4f6'};">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <h2>${project.title}</h2>
            <span class="plus-glyph">+</span>
            <div class="modal-details" style="display: none;">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                ${project.articleSlug ? `
                    <a href="article.html?id=${project.articleSlug}" class="modal-link-btn">
                        Read Related Article
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
                        </svg>
                    </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Render experts to the DOM
 * @param {Array} experts - Array of expert objects
 * @param {string} containerId - ID of the container element
 */
function renderExperts(experts, containerId = 'experts-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.experts-grid');
    if (!container) return;

    container.innerHTML = experts.map(expert => `
        <div class="expert-card" style="background-color: ${expert.color || expert.cardColor || '#f3f4f6'};">
            <div class="portrait-badge" style="background-color: ${expert.color || expert.badgeColor || '#ffffff'};">
                <img src="${expert.image || expert.imageUrl}" alt="Portrait of ${expert.name}">
            </div>
            <h2>${expert.name}</h2>
            <p class="expert-role">${expert.role}</p>
            <p class="expert-org">@ ${expert.organization}</p>
            <span class="plus-glyph">+</span>
            <div class="modal-details" style="display: none;">
                <h2>${expert.name}</h2>
                <p class="expert-role">${expert.role} @ ${expert.organization}</p>
                <p>${expert.bio}</p>
                ${expert.linkedin ? `
                    <a href="${expert.linkedin}" target="_blank" rel="noopener noreferrer" class="expert-linkedin-icon" title="LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Render services to the DOM
 * @param {Array} services - Array of service objects
 * @param {string} containerId - ID of the container element
 */
function renderServices(services, containerId = 'services-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.services-grid');
    if (!container) return;

    container.innerHTML = services.map(service => `
        <div class="service-card" style="background-color: ${service.backgroundColor};">
            ${service.image ? `<div class="service-image"><img src="${service.image}" alt="${service.title.replace(/<br>/g, ' ')}"></div>` : ''}
            <h2>${service.title}</h2>
            <span class="plus-glyph">+</span>
            <div class="modal-details" style="display: none;">
                ${service.image ? `<div class="service-image"><img src="${service.image}" alt="${service.title.replace(/<br>/g, ' ')}"></div>` : ''}
                <h2>${service.title.replace(/<br>/g, ' ')}</h2>
                <p>${service.description}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Render startups to the DOM
 * @param {Array} startups - Array of startup objects
 * @param {string} containerId - ID of the container element
 */
function renderStartups(startups, containerId = 'startups-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.startups-grid');
    if (!container) return;

    container.innerHTML = startups.map(startup => `
        <div class="startup-tile ${startup.tileClass}">
            <img src="${startup.logo || startup.logoUrl}" alt="${startup.name} logo"
                onerror="this.onerror=null;this.src='https://placehold.co/240x100/FF1576/FFFFFF?text=${encodeURIComponent(startup.fallbackText)}&font=inter';">
            <div class="modal-details" style="display: none;">
                <div class="startup-logo-modal">
                    <img src="${startup.logo || startup.logoUrl}" alt="${startup.name} logo"
                        onerror="this.onerror=null;this.src='https://placehold.co/240x100/FF1576/FFFFFF?text=${encodeURIComponent(startup.fallbackText)}&font=inter';">
                </div>
                <h2>${startup.name}</h2>
                <p>${startup.description}</p>
                ${startup.linkedin ? `
                    <a href="${startup.linkedin}" target="_blank" rel="noopener noreferrer" class="expert-linkedin-icon" title="LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Render team members to the DOM
 * @param {Array} team - Array of team member objects
 * @param {string} containerId - ID of the container element
 */
function renderTeam(team, containerId = 'team-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.team-grid');
    if (!container) return;

    container.innerHTML = team.map(member => `
        <div class="team-card" style="background-color: ${member.color || member.cardColor || '#f3f4f6'};">
            <div class="portrait-badge" style="background-color: ${member.color || member.badgeColor || '#ffffff'};">
                <img src="${member.imageUrl}" alt="Portrait of ${member.name}">
            </div>
            <h2>${member.name}</h2>
            <p class="team-role">${member.role}</p>
            <span class="plus-glyph">+</span>
            <div class="modal-details" style="display: none;">
                <div class="team-portrait-modal" style="background-color: ${member.color || member.badgeColor || '#ffffff'};">
                    <img src="${member.imageUrl}" alt="Portrait of ${member.name}">
                </div>
                <h2>${member.name}</h2>
                <p class="team-role">${member.role}</p>
                <p>${member.bio}</p>
                ${member.linkedin ? `
                    <a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" class="expert-linkedin-icon" title="LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Render founders to the DOM
 * @param {Array} founders - Array of founder objects
 * @param {string} containerId - ID of the container element
 */
function renderFounders(founders, containerId = 'founders-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.founders-grid');
    if (!container) return;

    container.innerHTML = founders.map(founder => `
        <div class="founder-card" style="background-color: ${founder.color || founder.cardColor || '#f3f4f6'};">
            <div class="portrait-badge" style="background-color: ${founder.color || founder.badgeColor || '#ffffff'};">
                <img src="${founder.image || founder.imageUrl}" alt="Portrait of ${founder.name}">
            </div>
            <h2 class="founder-name">${founder.name}</h2>
            <p class="founder-role">${founder.role}</p>
            <p class="founder-org">@ ${founder.organization}</p>
            <span class="plus-glyph">+</span>
            <div class="modal-details" style="display: none;">
                <div class="founder-portrait-modal" style="background-color: ${founder.color || founder.badgeColor || '#ffffff'};">
                    <img src="${founder.image || founder.imageUrl}" alt="Portrait of ${founder.name}">
                </div>
                <h2 class="founder-name">${founder.name.replace(/<br>/g, ' ')}</h2>
                <p class="founder-role">${founder.role} @ ${founder.organization}</p>
                <p>${founder.bio}</p>
                ${founder.linkedin ? `
                    <a href="${founder.linkedin}" target="_blank" rel="noopener noreferrer" class="expert-linkedin-icon" title="LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}

/**
 * Render partners to the DOM
 * @param {Array} partners - Array of partner objects
 * @param {string} containerId - ID of the container element
 */
function renderPartners(partners, containerId = 'partners-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.partners-grid');
    if (!container) return;

    container.innerHTML = partners.map(partner => `
        <div class="partner-tile ${partner.tileClass}">
            <img src="${partner.logo || partner.logoUrl}" alt="${partner.name} logo" 
                onerror="this.onerror=null;this.src='https://placehold.co/240x100/0D3EA3/FFFFFF?text=${encodeURIComponent(partner.fallbackText)}&font=inter';">
        </div>
    `).join('');
}

// Auto-initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    // Detect which page we're on and load appropriate data
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);

    switch (page) {
        case 'projects.html':
            const projects = await loadJSON('data/projects.json');
            renderProjects(projects);
            break;

        case 'experts.html':
            const experts = await loadJSON('data/experts.json');
            renderExperts(experts);
            break;

        case 'services.html':
            const services = await loadJSON('data/services.json');
            renderServices(services);
            break;

        case 'startups.html':
            const startups = await loadJSON('data/startups.json');
            renderStartups(startups);
            break;

        case 'meet-the-team.html':
            const team = await loadJSON('data/team.json');
            renderTeam(team);
            break;

        case 'on-founders.html':
            const founders = await loadJSON('data/founders.json');
            renderFounders(founders);
            break;

        case 'partners.html':
            const partners = await loadJSON('data/partners.json');
            renderPartners(partners);
            break;
    }
});

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadJSON,
        renderProjects,
        renderExperts,
        renderServices,
        renderStartups,
        renderTeam,
        renderFounders,
        renderPartners
    };
}
