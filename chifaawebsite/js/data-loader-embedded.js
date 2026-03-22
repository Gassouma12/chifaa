// Data Loader Utility - EMBEDDED VERSION (No server required)
// This version has JSON data embedded directly

// Embedded JSON Data
const EMBEDDED_DATA = {
    experts: [
        {
            "id": 1,
            "name": "Chiheb E. Fatnassi",
            "role": "Chief Creative Officer",
            "organization": "Pixelup",
            "bio": "Chiheb is a design virtuoso, helping startups craft beautiful and user-friendly products. His creative vision transforms ideas into compelling brand experiences.",
            "imageUrl": "https://placehold.co/112x112",
            "cardColor": "card-lilac",
            "badgeColor": "#F4D97B"
        },
        {
            "id": 2,
            "name": "Slaheddine Dardouri",
            "role": "Startups Advisor",
            "organization": "Swisscontact",
            "bio": "With years of experience in the startup ecosystem, Slaheddine provides invaluable guidance on business strategy, growth, and scaling for our incubated companies.",
            "imageUrl": "https://placehold.co/112x112",
            "cardColor": "card-cyan",
            "badgeColor": "#FDDD3C"
        },
        {
            "id": 3,
            "name": "Jeff Ford",
            "role": "Global Account Executive",
            "organization": "ConferenceDirect",
            "bio": "Jeff is a master of sales and international business development. He coaches our startups on how to build strong client relationships and expand into global markets.",
            "imageUrl": "https://placehold.co/112x112",
            "cardColor": "card-yellow",
            "badgeColor": "#FDDD3C"
        },
        {
            "id": 4,
            "name": "Ali Ayari",
            "role": "Co-founder",
            "organization": "Wiseboard",
            "bio": "As a successful entrepreneur himself, Ali offers practical, hands-on advice on product development, team building, and navigating the challenges of the startup journey.",
            "imageUrl": "https://placehold.co/112x112",
            "cardColor": "card-sage",
            "badgeColor": "#CDADEB"
        }
    ],
    services: [
        {
            "id": 1,
            "title": "Coworking<br>Space",
            "description": "Our vibrant coworking space offers a flexible and collaborative environment for freelancers, startups, and remote workers. Enjoy high-speed internet, meeting rooms, and a community of innovators.",
            "backgroundColor": "#FDDD3C"
        },
        {
            "id": 2,
            "title": "Incubation<br>Programs",
            "description": "We provide structured programs to help early-stage startups grow. Our incubation services include mentorship, workshops, funding opportunities, and access to our extensive network.",
            "backgroundColor": "#D49FD3"
        },
        {
            "id": 3,
            "title": "Company<br>Registration",
            "description": "Navigate the legal complexities of starting a business with ease. We offer comprehensive support for company registration, ensuring you're set up for success from day one.",
            "backgroundColor": "#8DB0A1"
        },
        {
            "id": 4,
            "title": "Research<br>Department",
            "description": "Our dedicated research department provides valuable market insights, industry analysis, and data-driven strategies to help your business make informed decisions and stay ahead of the curve.",
            "backgroundColor": "#CBDF92"
        },
        {
            "id": 5,
            "title": "Consultancy<br>Department",
            "description": "Get expert advice on business strategy, marketing, finance, and more. Our experienced consultants are here to provide tailored guidance to help you overcome challenges and achieve your goals.",
            "backgroundColor": "#10A5EE"
        },
        {
            "id": 6,
            "title": "Networking<br>Events",
            "description": "Connect with fellow entrepreneurs, investors, and industry leaders at our regular networking events. Build valuable relationships and become part of a supportive and dynamic community.",
            "backgroundColor": "#E8DABE"
        }
    ],
    startups: [
        {
            "id": 1,
            "name": "BNIINN",
            "description": "BNIINN is a revolutionary platform connecting local artisans with a global market, preserving cultural heritage through modern e-commerce.",
            "logoUrl": "assets/startups/bniinn.svg",
            "fallbackText": "BNIINN",
            "tileClass": "tile-bniinn"
        },
        {
            "id": 2,
            "name": "abajim",
            "description": "Abajim is a fintech startup simplifying financial literacy for young adults through a gamified mobile application, making saving and investing intuitive and fun.",
            "logoUrl": "assets/startups/abajim.svg",
            "fallbackText": "abajim",
            "tileClass": "tile-abajim"
        },
        {
            "id": 3,
            "name": "Funnycation",
            "description": "Funnycation is an ed-tech company that creates engaging and humorous educational content for children, transforming learning into an adventure.",
            "logoUrl": "assets/startups/funnycation.svg",
            "fallbackText": "Funnycation",
            "tileClass": "tile-funnycation"
        },
        {
            "id": 4,
            "name": "ReadOnly",
            "description": "ReadOnly is a cybersecurity firm that provides cutting-edge solutions to protect businesses from digital threats, ensuring data integrity and privacy.",
            "logoUrl": "assets/startups/readonly.svg",
            "fallbackText": "ReadOnly",
            "tileClass": "tile-readonly"
        },
        {
            "id": 5,
            "name": "Auzy",
            "description": "Auzy is a health-tech startup developing AI-powered diagnostic tools to assist medical professionals in providing faster and more accurate patient care.",
            "logoUrl": "assets/startups/auzy.svg",
            "fallbackText": "Auzy",
            "tileClass": "tile-auzy"
        },
        {
            "id": 6,
            "name": "PARKITO",
            "description": "PARKITO is a smart-city solution that tackles urban parking challenges with a real-time, sensor-based app, making city navigation seamless.",
            "logoUrl": "assets/startups/parkito.svg",
            "fallbackText": "PARKITO",
            "tileClass": "tile-parkito"
        }
    ],
    team: [
        {
            "id": 1,
            "name": "Marouen Nouira",
            "role": "Community Manager",
            "organization": "Chifaa",
            "bio": "Marouen is the heart of our community, fostering a collaborative and energetic environment for all our members. He's the go-to person for connections and support.",
            "imageUrl": "https://placehold.co/112x112"
        },
        {
            "id": 2,
            "name": "Mondher Kebiri",
            "role": "Chief Operating Officer",
            "organization": "Chifaa",
            "bio": "Mondher ensures that Chifaa operates smoothly and efficiently. His expertise in logistics and management is key to our success and the success of our startups.",
            "imageUrl": "https://placehold.co/112x112"
        },
        {
            "id": 3,
            "name": "Ichraf Jarray",
            "role": "Chief Executive Officer",
            "organization": "Chifaa",
            "bio": "As the visionary leader of Chifaa, Ichraf drives the mission to empower entrepreneurs and build a thriving startup ecosystem in the Sahel region.",
            "imageUrl": "https://placehold.co/112x112"
        }
    ],
    founders: [
        {
            "id": 1,
            "name": "Mohamed B. Hammouda",
            "role": "Chief Executive Officer",
            "organization": "Funnycation",
            "bio": "Mohamed is the driving force behind Funnycation, combining his passion for education and entertainment to create unforgettable learning experiences for kids.",
            "imageUrl": "https://placehold.co/112x112",
            "cardColor": "card-lilac",
            "badgeColor": "badge-yellow"
        },
        {
            "id": 2,
            "name": "Chiheb E. Fatnassi",
            "role": "Chief Executive Officer",
            "organization": "BNIINN",
            "bio": "Chiheb's vision for BNIINN is to empower local artisans by giving them a powerful platform to showcase their craft and connect with a global audience.",
            "imageUrl": "https://placehold.co/112x112",
            "cardColor": "card-cyan",
            "badgeColor": "badge-teal"
        },
        {
            "id": 3,
            "name": "Mohamed<br>Lazreg",
            "role": "Chief Executive Officer",
            "organization": "Instacoif",
            "bio": "Mohamed is revolutionizing the beauty industry with Instacoif, a platform that connects clients with talented stylists for on-demand, personalized services.",
            "imageUrl": "https://placehold.co/112x112",
            "cardColor": "card-beige",
            "badgeColor": "badge-teal"
        }
    ],
    partners: [
        {
            "id": 1,
            "name": "Spark",
            "logoUrl": "assets/partners/spark.svg",
            "fallbackText": "spark",
            "tileClass": "tile-spark"
        },
        {
            "id": 2,
            "name": "Pixelup",
            "logoUrl": "assets/partners/pixelup.svg",
            "fallbackText": "Pixelup",
            "tileClass": "tile-pixelup"
        },
        {
            "id": 3,
            "name": "TEDx",
            "logoUrl": "assets/partners/tedx.svg",
            "fallbackText": "TEDx",
            "tileClass": "tile-tedx"
        },
        {
            "id": 4,
            "name": "AWS",
            "logoUrl": "assets/partners/aws.svg",
            "fallbackText": "AWS",
            "tileClass": "tile-aws"
        },
        {
            "id": 5,
            "name": "giz",
            "logoUrl": "assets/partners/giz.svg",
            "fallbackText": "giz",
            "tileClass": "tile-giz"
        },
        {
            "id": 6,
            "name": "Impact Partner",
            "logoUrl": "assets/partners/impact-partner.svg",
            "fallbackText": "Impact Partner",
            "tileClass": "tile-impact"
        }
    ]
};

/**
 * Get data from embedded object (no fetch needed)
 * @param {string} dataType - Type of data to get
 * @returns {Array} - Data array
 */
function loadEmbeddedData(dataType) {
    return EMBEDDED_DATA[dataType] || [];
}

/**
 * Render experts to the DOM
 */
function renderExperts(experts, containerId = 'experts-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.experts-grid');
    if (!container) return;

    container.innerHTML = experts.map(expert => `
        <div class="expert-card ${expert.cardColor}">
            <div class="portrait-badge" style="background-color: ${expert.badgeColor};">
                <img src="${expert.imageUrl}" alt="Portrait of ${expert.name}">
            </div>
            <h2>${expert.name}</h2>
            <p class="expert-role">${expert.role}</p>
            <p class="expert-org">@ ${expert.organization}</p>
            <span class="plus-glyph">+</span>
            <div class="modal-details" style="display: none;">
                <h2>${expert.name}</h2>
                <p class="expert-role">${expert.role} @ ${expert.organization}</p>
                <p>${expert.bio}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Render services to the DOM
 */
function renderServices(services, containerId = 'services-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.services-grid');
    if (!container) return;

    container.innerHTML = services.map(service => `
        <div class="service-card" style="background-color: ${service.backgroundColor};">
            <h2>${service.title}</h2>
            <span class="plus-glyph">+</span>
            <div class="modal-details" style="display: none;">
                <h2>${service.title.replace(/<br>/g, ' ')}</h2>
                <p>${service.description}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Render startups to the DOM
 */
function renderStartups(startups, containerId = 'startups-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.startups-grid');
    if (!container) return;

    container.innerHTML = startups.map(startup => `
        <div class="startup-tile ${startup.tileClass}">
            <img src="${startup.logoUrl}" alt="${startup.name} logo"
                onerror="this.onerror=null;this.src='https://placehold.co/240x100/FF1576/FFFFFF?text=${encodeURIComponent(startup.fallbackText)}&font=inter';">
            <div class="modal-details" style="display: none;">
                <h2>${startup.name}</h2>
                <p>${startup.description}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Render team members to the DOM
 */
function renderTeam(team, containerId = 'team-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.team-grid');
    if (!container) return;

    container.innerHTML = team.map(member => `
        <div class="team-card">
            <div class="portrait-badge">
                <img src="${member.imageUrl}" alt="Portrait of ${member.name}">
            </div>
            <h2>${member.name}</h2>
            <p class="team-role">${member.role}</p>
            <p class="team-org">@ ${member.organization}</p>
            <span class="plus-glyph">+</span>
            <div class="modal-details" style="display: none;">
                <h2>${member.name}</h2>
                <p class="team-role">${member.role}</p>
                <p class="team-org">@ ${member.organization}</p>
                <p>${member.bio}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Render founders to the DOM
 */
function renderFounders(founders, containerId = 'founders-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.founders-grid');
    if (!container) return;

    container.innerHTML = founders.map(founder => `
        <div class="founder-card ${founder.cardColor}">
            <div class="portrait-badge ${founder.badgeColor}">
                <img src="${founder.imageUrl}" alt="Portrait of ${founder.name}">
            </div>
            <h2 class="founder-name">${founder.name}</h2>
            <p class="founder-role">${founder.role}</p>
            <p class="founder-org">@ ${founder.organization}</p>
            <span class="plus-glyph">+</span>
            <div class="modal-details" style="display: none;">
                <h2 class="founder-name">${founder.name.replace(/<br>/g, ' ')}</h2>
                <p class="founder-role">${founder.role} @ ${founder.organization}</p>
                <p>${founder.bio}</p>
            </div>
        </div>
    `).join('');
}

/**
 * Render partners to the DOM
 */
function renderPartners(partners, containerId = 'partners-grid') {
    const container = document.getElementById(containerId) || document.querySelector('.partners-grid');
    if (!container) return;

    container.innerHTML = partners.map(partner => `
        <div class="partner-tile ${partner.tileClass}">
            <img src="${partner.logoUrl}" alt="${partner.name} logo" 
                onerror="this.onerror=null;this.src='https://placehold.co/240x100/0D3EA3/FFFFFF?text=${encodeURIComponent(partner.fallbackText)}&font=inter';">
        </div>
    `).join('');
}

// Auto-initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Detect which page we're on and load appropriate data
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);

    console.log('Loading data for page:', page);

    switch (page) {
        case 'experts.html':
            renderExperts(loadEmbeddedData('experts'));
            break;

        case 'services.html':
            renderServices(loadEmbeddedData('services'));
            break;

        case 'startups.html':
            renderStartups(loadEmbeddedData('startups'));
            break;

        case 'meet-the-team.html':
            renderTeam(loadEmbeddedData('team'));
            break;

        case 'on-founders.html':
            renderFounders(loadEmbeddedData('founders'));
            break;

        case 'partners.html':
            renderPartners(loadEmbeddedData('partners'));
            break;
    }
});
