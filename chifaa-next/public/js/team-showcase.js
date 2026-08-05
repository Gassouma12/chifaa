// Team Showcase - Vanilla JS adaptation of React component

const TEAM_MEMBERS = [
  {
    id: '4',
    name: 'Maha Jouini',
    role: 'Co-Founder · Project Lead & AI Ethics and Governance Lead',
    image: '/assets/images/maha.png',
    eyebrow: 'Co-Founder · Project Lead & AI Ethics and Governance Lead',
    bio: '<p>Maha Jouini is a multilingual AI ethics researcher, policy consultant with over a decade of experience in inclusive technology governance across Africa and Europe. She holds an MSc in Applied Technology and Artificial Intelligence and serves as AI & Gender Fellow at the Global Center on AI Governance, as well as Regional Supervisor for the MENA and Africa regions at the Global Index on Responsible AI (GRAI). She is also a proud recipient of the She Shapes AI Award in Thought Leadership, a recognition that affirms her standing as one of the most influential voices in ethical and inclusive AI on the global stage.</p><p>As Project Lead, Maha provides the overall strategic vision and leadership for Chifaa, driving the initiative from concept through to implementation. She simultaneously leads the design of Chifaa\'s Responsible AI framework encompassing the survivor governance model, bias audit methodology, and community consent architecture ensuring that every layer of the platform is built with accountability, inclusivity, and cultural sensitivity at its core.</p><p>What makes Maha\'s contribution uniquely powerful is her profound technical expertise. She brings an irreplaceable perspective to the project\'s design philosophy, ensuring that Chifaa speaks authentically to the women it serves. Her ethical framework is grounded in UNESCO\'s Recommendation on the Ethics of AI and aligned with emerging responsible AI principles across the African and MENA regions.</p><p>Maha embodies what Chifaa stands for a belief that technology, when designed with and for those it serves, can be a genuine force for health equity and human dignity.</p>',
    social: { linkedin: 'https://www.linkedin.com/in/maha-jouini/' }
  },
  {
    id: '3',
    name: 'Dr. Yosr SBAIS, PhD',
    role: 'Project Manager & Community Engagement Lead',
    image: '/assets/images/team/Yossr.jpeg',
    eyebrow: 'Project Manager & Community Engagement Lead',
    bio: '<p>Dr. Yosr SBAIS is an Assistant Professor of Management at the Higher Institute of Sciences and Technology of the Environment (ISSTE) of Borj Cedria, University of Carthage, Tunisia. She is a PMP project manager, a certified Scrum Master, and an accredited expert in ISO 21001, Lean Six Sigma, and Agile methodologies.</p><p>Her research spans Corporate Social Responsibility (CSR), strategic management, the circular economy, and green entrepreneurship, with numerous publications in peer-reviewed international journals. She served as the Project Manager for the EU-funded RESMYLE project (ENI CBC MED, 2019-2023) and is currently actively engaged in the Tunisia-Quebec Collaboration Programme and the INTEGRMED: Green SMEs Ecosystems Transition project (2025-2028). Additionally, she serves as the Director of the 4C (Careers and Certification Centre of Competence) and acts as the official institutional referent for the Erasmus+ SALEEM student entrepreneurship programme.</p><p>Within CHIFAA, Dr. SBAIS oversees project implementation, timelines, and deliverables by applying agile and risk-based management approaches. She leads community engagement and co-design activities, coordinating participatory workshops with survivor co-designers across North Africa, and structurally supports the Survivor Governance Board. Her extensive experience with EU-funded consortia and sustainable innovation ensures that CHIFAA\'s governance model is robust, transferable, and strictly aligned with international standards for responsible, community-centred research.</p>',
    social: { linkedin: 'https://www.linkedin.com/in/yosr-sbais-11b0541b3/' }
  },
  {
    id: '1',
    name: 'Dr. Adnane FHIMA, M.D.',
    role: 'Advisor on Health and good practises',
    image: '/assets/images/team/DR-FHIMA-2A.png',
    eyebrow: 'Advisor on Health and good practises',
    bio: '<p>Dr. Adnane FHIMA is a highly experienced medical doctor with over 15 years of clinical practice across South Africa and Tunisia. Born in 1978, he earned his Doctorate in Medicine from the Facult- de M-decine de Sousse, Tunisia, graduating with a very honorable distinction for his doctoral research on HSP70 expression and physiological parameters during endurance exercise.</p><p>Since 2011, Dr. FHIMA has built the core of his career at Van Velden Hospital in Limpopo Province, South Africa, progressively advancing from Medical Officer Grade II to Grade III, and serving as Acting Senior Clinical Manager. In this journey, he has demonstrated exceptional clinical acumen, leadership, and an unwavering commitment to patient-centered care. His ability to manage complex medical conditions, supervise multidisciplinary teams, and implement best clinical practices earned him the prestigious Best Medical Officer and Best Employee in Clinical Services awards in 2019.</p><p>Dr. FHIMA brings dedicated experience in the follow-up and holistic accompaniment of patients living with cancer, providing compassionate support through diagnosis, treatment, and long-term management. He works closely with patients and their families to ensure they are fully informed, emotionally supported, and actively involved in their care journey recognizing that oncology care extends well beyond the clinical setting.</p><p>His qualifications extend into specialized fields, including a Post Graduate Program in Pediatric Nutrition from Boston University School of Medicine, certification as a Basic Life Support Instructor with the American Heart Association, and qualification as an Aviation Medical Examiner through SACAA.</p><p>A published author in the South African Medical Journal, Dr. FHIMA continues to pursue excellence through continuous learning, research, and collaboration always driven by his passion for improving the health and well-being of every patient in his care.</p>',
    social: { linkedin: 'https://www.linkedin.com/in/adnane-f-58b4b98a/' }
  },
  {
    id: '2',
    name: 'Chaker ESSID, PhD',
    role: 'Co-Founder · IT and Artificial Intelligence Researcher',
    image: '/assets/images/team/Chaker.jpeg',
    eyebrow: 'Co-Founder · IT and Artificial Intelligence Researcher',
    bio: '<p>Dr. Chaker ESSID is a Tunisian academic and researcher with a PhD in Telecommunications from the École Nationale d\'Ingénieurs de Tunis (ENIT), where he also completed his University Habilitation in Communication Systems in 2025. Currently serving as Assistant Professor at the Faculty of Sciences of Tunis, he brings over two decades of research and teaching experience at the intersection of telecommunications and artificial intelligence.</p><p>As AI Technical Lead for the Chifaa application, Dr. ESSID drives the design and development of the platform\'s intelligent core from conversational health guidance to AI-powered diagnostic support tools. His role bridges cutting-edge research and real-world application, ensuring that Chifaa\'s AI components are robust, accurate, and clinically meaningful.</p><p>His research portfolio spanning 9 peer-reviewed journal articles, 16 international conference papers, and a book chapter reflects a strong and growing engagement with AI applied to healthcare. Dr. ESSID has co-authored work on deep learning for brain tumor segmentation, AI-powered skin lesion diagnosis using lightweight CNN architectures, automated breast cancer detection from ultrasound imaging, and thoracic aortic aneurysm detection. This body of work demonstrates his ability to translate advanced machine learning into practical, life-saving solutions.</p><p>His expertise in 5G, MIMO systems, and IoT further strengthens Chifaa\'s vision of a connected, intelligent, and accessible health platform for all.</p>',
    social: { linkedin: 'https://www.linkedin.com/in/chaker-essid-35988757/' }
  },
  {
    id: '6',
    name: 'Dr. Faten Abbassi',
    role: 'Technical Advisor - AI Systems & Database Architecture, CHIFAA',
    image: '/assets/images/team/faten.jpg',
    eyebrow: 'Technical Advisor - AI Systems & Database Architecture, CHIFAA',
    bio: '<p>Dr. Faten Abbassi is a Tunisian computer science researcher and university lecturer with extensive expertise in software engineering, database systems, web technologies, and programming education. Within CHIFAA, she serves as Technical Advisor for AI Systems and Database Architecture, supporting the platform’s technological infrastructure, system design, and data management strategy.</p><p>With a Doctorate in Computer Science and more than fifteen years of academic and technical experience, Dr. Abbassi contributes to the development of secure, scalable, and user-centered digital systems. Her expertise includes database engineering, backend architecture, mobile and web development, and AI-related technologies, helping ensure that CHIFAA’s technological ecosystem is both robust and ethically grounded.</p><p>She also brings strong experience in teaching and mentoring in areas such as Java programming, database administration, web technologies, and software architecture, reinforcing CHIFAA’s commitment to inclusive digital innovation and knowledge transfer across Africa and the MENA region.</p>',
    social: { linkedin: '#' }
  },
  {
    id: '5',
    name: 'Aboulkacem Ben Arab',
    role: 'Fullstack Engineer and Communications Manager',
    image: '/assets/images/team/aboulkacem.png',
    eyebrow: 'Fullstack Engineer and Communications Manager',
    bio: '<p>Aboulkacem Ben Arab is a software engineer and communications professional with a degree in Software Engineering and a proven track record across technology, business development, and strategic communications.</p><p>At Chifaa, he serves as Fullstack Engineer and Communications Manager, overseeing both the technical development of the platform and the communication strategy that shapes its public presence.</p><p>His career includes key roles in the private sector and international development. At his current role in IECD Tunisia, he is contributing to the FBR@Work program as a Corporate Relations & Employment Specialist, whilst also supporting the M&E by building an internal CRM system and automated dashboards to track donor KPIs in real time. He previously led business development for T7D Gaming across Africa and the Middle East, and held senior positions at AIESEC Tunisia managing sales pipelines, partnerships, and team mentorship.</p><p>His ability to combine technical execution with strategic communication makes him a versatile asset in cross-functional environments.</p>',
    social: { linkedin: 'https://www.linkedin.com/in/aboulkacem-ben-arab-567974241/' }
  }
];

class TeamShowcase {
  constructor(containerId, members = TEAM_MEMBERS) {
    this.container = document.getElementById(containerId);
    this.members = members;
    this.hoveredId = null;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const col1 = this.members.filter((_, i) => i % 3 === 0);
    const col2 = this.members.filter((_, i) => i % 3 === 1);
    const col3 = this.members.filter((_, i) => i % 3 === 2);

    this.container.innerHTML = `
      <div class="team-showcase-wrapper">
        <div class="team-photo-grid">
          <div class="team-column">${col1.map(m => this.photoCardHTML(m)).join('')}</div>
          <div class="team-column team-column-offset-1">${col2.map(m => this.photoCardHTML(m)).join('')}</div>
          <div class="team-column team-column-offset-2">${col3.map(m => this.photoCardHTML(m)).join('')}</div>
        </div>
        <div class="team-members-list">
          ${this.members.map(m => this.memberRowHTML(m)).join('')}
        </div>
      </div>
    `;
  }

  photoCardHTML(member) {
    return `
      <div class="team-photo-card" data-id="${member.id}" style="cursor: pointer;">
        <img src="${member.image}" alt="${member.name}" class="team-photo-image">
      </div>
    `;
  }

  memberRowHTML(member) {
    const hasSocial = member.social?.twitter || member.social?.linkedin || member.social?.instagram || member.social?.behance;
    return `
      <div class="team-member-row" data-id="${member.id}">
        <div class="team-member-header">
          <span class="team-member-indicator"></span>
          <span class="team-member-name">${member.name}</span>
          ${member.social?.linkedin && member.social.linkedin !== '#' ? `<a href="${member.social.linkedin}" target="_blank" rel="noopener noreferrer" class="team-linkedin-icon" title="LinkedIn">in</a>` : ''}
          ${hasSocial && (member.social?.twitter || member.social?.instagram || member.social?.behance) ? `
            <div class="team-member-social">
              ${member.social?.twitter ? `<a href="${member.social.twitter}" target="_blank" rel="noopener noreferrer" class="team-social-icon" title="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
              ${member.social?.instagram ? `<a href="${member.social.instagram}" target="_blank" rel="noopener noreferrer" class="team-social-icon" title="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
              ${member.social?.behance ? `<a href="${member.social.behance}" target="_blank" rel="noopener noreferrer" class="team-social-icon" title="Behance"><i class="fab fa-behance"></i></a>` : ''}
            </div>
          ` : ''}
        </div>
        <p class="team-member-role">${member.role}</p>
      </div>
    `;
  }

  attachEventListeners() {
    const photoCards = this.container.querySelectorAll('.team-photo-card');
    const memberRows = this.container.querySelectorAll('.team-member-row');

    photoCards.forEach(card => {
      card.addEventListener('mouseenter', () => this.setHovered(card.dataset.id));
      card.addEventListener('mouseleave', () => this.setHovered(null));
      card.addEventListener('click', () => this.openModal(card.dataset.id));
    });

    memberRows.forEach(row => {
      row.addEventListener('mouseenter', () => this.setHovered(row.dataset.id));
      row.addEventListener('mouseleave', () => this.setHovered(null));
      row.addEventListener('click', () => this.openModal(row.dataset.id));
    });

    // Setup modal close button
    const modal = document.getElementById('teamModal');
    if (modal) {
      const closeBtn = modal.querySelector('.team-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal());
      }
      
      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    }
  }

  openModal(memberId) {
    const member = this.members.find(m => String(m.id) === String(memberId));
    if (!member) return;

    const modal = document.getElementById('teamModal');
    if (!modal) return;

    document.getElementById('modalImage').src = member.image;
    document.getElementById('modalImage').alt = member.name;
    document.getElementById('modalName').textContent = member.name;
    document.getElementById('modalRole').textContent = member.eyebrow || member.role;
    document.getElementById('modalBio').innerHTML = member.bio;

    const extraLink = document.getElementById('modalExtraLink');
    if (String(member.id) === '4' || member.founderLink) {
      extraLink.innerHTML = '<a href="founder.html">Read Full Founder Bio &rarr;</a>';
      extraLink.style.display = 'block';
    } else {
      extraLink.style.display = 'none';
    }

    // Trigger reflow to ensure animation plays
    modal.style.display = 'flex';
    void modal.offsetWidth;
    modal.classList.add('active');
  }

  setHovered(id) {
    this.hoveredId = id;
    this.updateVisuals();
  }

  closeModal() {
    const modal = document.getElementById('teamModal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  }

  updateVisuals() {
    const photoCards = this.container.querySelectorAll('.team-photo-card');
    const memberRows = this.container.querySelectorAll('.team-member-row');

    photoCards.forEach(card => {
      const isActive = card.dataset.id === this.hoveredId;
      const isDimmed = this.hoveredId !== null && !isActive;
      
      card.classList.toggle('active', isActive);
      card.classList.toggle('dimmed', isDimmed);
    });

    memberRows.forEach(row => {
      const isActive = row.dataset.id === this.hoveredId;
      const isDimmed = this.hoveredId !== null && !isActive;
      
      row.classList.toggle('active', isActive);
      row.classList.toggle('dimmed', isDimmed);
    });
  }
}

function normalizeTeamMember(member) {
  return {
    id: String(member.id || `member-${Date.now()}-${Math.random()}`),
    name: member.name || 'Unnamed',
    role: member.role || '',
    image: member.image || member.imageUrl || '/assets/images/logo.png',
    eyebrow: member.eyebrow || member.role || '',
    bio: member.bio || '',
    social: member.social || {
      linkedin: member.linkedin || '',
      twitter: member.twitter || '',
      instagram: member.instagram || '',
      behance: member.behance || ''
    },
    founderLink: member.founderLink
  };
}

async function loadTeamMembers() {
  try {
    const response = await fetch(`data/team.json?_=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Team data unavailable');
    const data = await response.json();
    return Array.isArray(data) && data.length ? data.map(normalizeTeamMember) : TEAM_MEMBERS;
  } catch (error) {
    console.warn('Using embedded team fallback:', error);
    return TEAM_MEMBERS;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('team-showcase-container');
  if (container) {
    const members = await loadTeamMembers();
    new TeamShowcase('team-showcase-container', members);
  }
});
