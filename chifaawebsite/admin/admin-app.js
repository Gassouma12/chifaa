// Chifaa Admin Panel JavaScript

// Authentication
const ADMIN_PASSWORD = "chichiChifaa";
const AUTH_KEY_SESSION = "Chifaa_admin_auth_session";
const AUTH_KEY_PERSISTENT = "Chifaa_admin_auth_persistent";

// Check authentication on page load
function checkAuthentication() {
    console.log('[AUTH] Checking authentication...');
    const sessionAuth = sessionStorage.getItem(AUTH_KEY_SESSION);
    const persistentAuth = localStorage.getItem(AUTH_KEY_PERSISTENT);
    console.log('[AUTH] Session:', sessionAuth, 'Persistent:', persistentAuth);

    if (sessionAuth === "true" || persistentAuth === "true") {
        console.log('[AUTH] User is authenticated');
        document.getElementById('admin-login-screen').classList.add('hidden');
        return true;
    }
    console.log('[AUTH] User is NOT authenticated');
    return false;
}

// Handle login - will be set up in main DOMContentLoaded
function setupLoginHandler() {
    console.log('[LOGIN] Setting up login handler...');
    const loginForm = document.getElementById('admin-login-form');
    const passwordInput = document.getElementById('admin-password');
    const stayConnected = document.getElementById('stay-connected');
    const errorMessage = document.getElementById('login-error-message');

    console.log('[LOGIN] Form elements:', {
        loginForm: !!loginForm,
        passwordInput: !!passwordInput,
        stayConnected: !!stayConnected,
        errorMessage: !!errorMessage
    });

    if (!loginForm) {
        console.error('[LOGIN] Login form not found!');
        return;
    }

    console.log('[LOGIN] Attaching submit event listener to form...');

    // Remove any existing listeners by cloning and replacing
    const newForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newForm, loginForm);

    newForm.addEventListener('submit', async (e) => {
        console.log('[LOGIN] Form submitted!');
        e.preventDefault();
        e.stopPropagation();

        const newPasswordInput = document.getElementById('admin-password');
        const newStayConnected = document.getElementById('stay-connected');
        const newErrorMessage = document.getElementById('login-error-message');

        const enteredPassword = newPasswordInput.value;
        console.log('[LOGIN] Password entered:', enteredPassword ? '***' : '(empty)');
        console.log('[LOGIN] Expected password:', ADMIN_PASSWORD);
        console.log('[LOGIN] Passwords match:', enteredPassword === ADMIN_PASSWORD);

        if (enteredPassword === ADMIN_PASSWORD) {
            console.log('[LOGIN] Password correct! Logging in...');

            // Store authentication
            if (newStayConnected.checked) {
                console.log('[LOGIN] Storing persistent auth in localStorage');
                localStorage.setItem(AUTH_KEY_PERSISTENT, "true");
            } else {
                console.log('[LOGIN] Storing session auth in sessionStorage');
                sessionStorage.setItem(AUTH_KEY_SESSION, "true");
            }

            // Hide login screen
            console.log('[LOGIN] Hiding login screen...');
            const loginScreen = document.getElementById('admin-login-screen');
            console.log('[LOGIN] Login screen element:', !!loginScreen);
            loginScreen.classList.add('hidden');
            console.log('[LOGIN] Login screen classes:', loginScreen.className);

            // Initialize admin panel
            console.log('[LOGIN] Initializing admin panel...');
            await initializeAdminPanel();
            console.log('[LOGIN] Admin panel initialized!');
        } else {
            console.log('[LOGIN] Password incorrect!');
            newErrorMessage.textContent = "Incorrect password. Please try again.";
            newErrorMessage.classList.add('show');
            newPasswordInput.value = "";
            newPasswordInput.focus();
        }

        return false;
    });
    console.log('[LOGIN] Login handler setup complete!');
}

// Data storage
let currentData = {
    home: null,
    about: null,
    aiCompanion: null,
    partners: null,
    authors: null,
    blog: null,
    founder: null,
    contact: null
};

let currentSection = null;
let currentUploadSection = null; // Dedicated section tracker for uploads
let hasChanges = false;
let quillEditor = null; // Store Quill instance
let cropperInstance = null; // Store Cropper instance
let selectedImageFile = null; // Store selected image file
let currentQuillRange = null; // Store Quill cursor position
let currentImageFieldKey = null; // Store current image field key
let currentArticleId = null; // Store current article ID
let currentImageType = null; // Store image type (cover or content)

// Initialize Admin Panel
async function initializeAdminPanel() {
    console.log('[PANEL] Initializing admin panel...');
    try {
        console.log('[PANEL] Loading all data...');
        await loadAllData();
        console.log('[PANEL] Data loaded successfully');

        console.log('[PANEL] Initializing navigation...');
        initializeNavigation();

        console.log('[PANEL] Initializing buttons...');
        initializeButtons();

        console.log('[PANEL] Updating stats...');
        updateStats();

        console.log('[PANEL] Admin panel initialization complete!');
    } catch (error) {
        console.error('[PANEL] Error initializing admin panel:', error);
    }
}

// Initialize (only if already authenticated)
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[INIT] DOMContentLoaded fired!');

    // Check if already authenticated
    const isAuthenticated = checkAuthentication();
    console.log('[INIT] Is authenticated:', isAuthenticated);

    if (isAuthenticated) {
        // Already logged in - initialize admin panel
        console.log('[INIT] User authenticated, initializing admin panel...');
        await initializeAdminPanel();
    } else {
        // Not authenticated - show login screen and set up handler
        console.log('[INIT] User not authenticated, showing login screen...');
        const loginScreen = document.getElementById('admin-login-screen');
        console.log('[INIT] Login screen element:', !!loginScreen);
        if (loginScreen) {
            loginScreen.classList.remove('hidden');
            console.log('[INIT] Login screen classes:', loginScreen.className);
        }
        setupLoginHandler();
    }
    console.log('[INIT] Initialization complete!');
});

// Initialize (only if already authenticated)
document.addEventListener('DOMContentLoaded', async () => {
    // Check if already authenticated
    if (checkAuthentication()) {
        // Already logged in - initialize admin panel
        await initializeAdminPanel();
    } else {
        // Not authenticated - show login screen and set up handler
        document.getElementById('admin-login-screen').classList.remove('hidden');
        setupLoginHandler();
    }
});

// Load all JSON data
async function loadAllData() {
    try {
        const files = ['home', 'about', 'aiCompanion', 'partners', 'authors', 'blog', 'founder', 'contact'];

        for (const file of files) {
            try {
                const response = await fetch(`api.php?action=read&file=${file}`);
                if (response.ok) {
                    currentData[file] = await response.json();
                }
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
                // Fallback to direct file load
                try {
                    const fallbackResponse = await fetch(`../data/${file}.json`);
                    if (fallbackResponse.ok) {
                        currentData[file] = await fallbackResponse.json();
                    }
                } catch (fallbackError) {
                    console.error(`Fallback failed for ${file}:`, fallbackError);
                }
            }
        }
    } catch (error) {
        showToast('Error loading data: ' + error.message, 'error');
    }
}// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            loadSection(section);

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Initialize buttons
function initializeButtons() {
    document.getElementById('save-all').addEventListener('click', saveAllChanges);
    document.getElementById('export-all').addEventListener('click', exportAllData);
    document.getElementById('back-to-site').addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('admin-sidebar');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                    if (sidebar.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        sidebar.classList.remove('active');
                    }
                }
            }
        });

        // Close sidebar when clicking a nav link on mobile
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove('active');
                    sidebar.classList.remove('active');
                }
            });
        });
    }
}

// Load section content
function loadSection(section) {
    currentSection = section;
    document.getElementById('section-title').textContent = section.charAt(0).toUpperCase() + section.slice(1);

    const content = document.getElementById('admin-content');

    switch (section) {
        case 'about':
            renderAboutSection(content);
            break;
        case 'ai-companion':
            renderAiCompanionSection(content);
            break;
        case 'partners':
            renderItemsSection(content, 'partners', getPartnersFields());
            break;
        case 'blog':
            renderItemsSection(content, 'blog', getBlogFields());
            break;
        case 'home':
            renderHomeSection(content);
            break;
        case 'founders':
        case 'founder':
            renderFounderSection(content);
            break;
        case 'contact':
            renderContactSection(content);
            break;
    }
}

// Render About Section
function renderAboutSection(container) {
    const data = currentData.about;
    if (!data) return;

    container.innerHTML = `
        <div class="section-content">
            <div class="section-header">
                <h2>About Page Content</h2>
            </div>
            
            <div class="form-group">
                <label class="form-label">Page Title</label>
                <input type="text" class="form-input" id="about-title" value="${data.title || ''}" 
                    onchange="updateAboutData('title', this.value)">
            </div>
            
            <div class="form-group">
                <label class="form-label">Paragraphs</label>
                <div class="about-paragraphs" id="about-paragraphs">
                    ${data.paragraphs.map((p, i) => `
                        <div class="paragraph-item">
                            <textarea class="form-textarea" 
                                onchange="updateAboutParagraph(${i}, this.value)">${p}</textarea>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Social Links</label>
                <div class="social-links-grid" id="social-links">
                    ${data.socialLinks.map((link, i) => `
                        <div class="social-link-item">
                            <input type="text" class="form-input" placeholder="Name" value="${link.name}"
                                onchange="updateSocialLink(${i}, 'name', this.value)">
                            <input type="text" class="form-input" placeholder="URL" value="${link.url}"
                                onchange="updateSocialLink(${i}, 'url', this.value)">
                            <input type="text" class="form-input" placeholder="Icon Class" value="${link.icon}"
                                onchange="updateSocialLink(${i}, 'icon', this.value)">
                            <input type="text" class="form-input" placeholder="CSS Class" value="${link.class}"
                                onchange="updateSocialLink(${i}, 'class', this.value)">
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Render Home Section
function renderHomeSection(container) {
    const data = currentData.home || { videoUrl: '' };

    container.innerHTML = `
        <div class="section-content">
            <div class="section-header">
                <h2>Home Page Settings</h2>
                <p>Configure the homepage video that appears when users click the play button.</p>
            </div>
            
            <div class="form-group">
                <label class="form-label">YouTube Video URL</label>
                <input type="text" class="form-input" id="home-videoUrl" 
                    value="${data.videoUrl || ''}" 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    onchange="updateHomeData('videoUrl', this.value)">
                <small class="form-help">Enter the full YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ)</small>
            </div>

            <div class="form-actions">
                <button class="btn-primary" onclick="saveHomeData()">💾 Save Changes</button>
            </div>
        </div>
    `;
}

// Render items section (generic for all array-based content)
function renderItemsSection(container, section, fields) {
    const data = currentData[section];
    if (!data) return;

    container.innerHTML = `
        <div class="section-content">
            <div class="section-header">
                <h2>${section.charAt(0).toUpperCase() + section.slice(1)} Management</h2>
                <button class="btn-primary" onclick="addNewItem('${section}')">+ Add New</button>
            </div>
            
            <div class="items-grid" id="items-container">
                ${data.map((item, index) => renderItemCard(item, index, section, fields)).join('')}
            </div>
        </div>
    `;
}

// Render individual item card
function renderItemCard(item, index, section, fields) {
    const titleField = fields.find(f => f.isTitle) || fields[0];
    const title = item[titleField.key] || 'Untitled';

    return `
        <div class="item-card" data-index="${index}">
            <div class="item-header">
                <div>
                    <div class="item-title">${escapeHtml(title)}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon" onclick="editItem('${section}', ${index})" title="Edit">✏️</button>
                    <button class="btn-icon" onclick="deleteItem('${section}', ${index})" title="Delete">🗑️</button>
                </div>
            </div>
        </div>
    `;
}

// Add new item
function addNewItem(section) {
    const fields = getFieldsForSection(section);
    const newItem = {};

    // Initialize with empty values
    fields.forEach(field => {
        // Handle nested fields (e.g., socials.facebook)
        if (field.key.includes('.')) {
            const keys = field.key.split('.');
            let obj = newItem;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!obj[keys[i]]) obj[keys[i]] = {};
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = '';
        } else if (field.type === 'array') {
            newItem[field.key] = [];
        } else if (field.type === 'number') {
            newItem[field.key] = 0;
        } else if (field.type === 'boolean') {
            newItem[field.key] = false;
        } else {
            newItem[field.key] = '';
        }
    });

    // Add ID
    const maxId = Math.max(...currentData[section].map(item => item.id || 0), 0);
    newItem.id = maxId + 1;

    currentData[section].push(newItem);
    editItem(section, currentData[section].length - 1);
}

// Edit item
function editItem(section, index) {
    console.log('=== EDIT ITEM DEBUG ===');
    console.log('Section:', section);
    console.log('Index:', index);
    const item = currentData[section][index];
    console.log('Item data:', item);

    // Set current section for image uploads
    currentSection = section;
    currentUploadSection = section; // Explicitly store for uploads

    // For authors section, require password authentication
    if (section === 'authors') {
        const enteredPassword = prompt('Enter author password to edit:');
        if (!enteredPassword) {
            showToast('Password required to edit author', 'error');
            return;
        }
        if (enteredPassword !== item.password) {
            showToast('Incorrect password', 'error');
            return;
        }
    }

    const fields = getFieldsForSection(section);

    const saveCallback = () => {
        // Save callback
        const form = document.getElementById('edit-form');
        fields.forEach(field => {
            // Get content from Quill editor if it's the content field
            if (field.key === 'content' && quillEditor) {
                currentData[section][index][field.key] = quillEditor.root.innerHTML;
            } else if (field.type === 'multiselect') {
                // Get all checked values for multiselect
                const checkboxes = form.querySelectorAll(`[name="${field.key}[]"]:checked`);
                currentData[section][index][field.key] = Array.from(checkboxes).map(cb => cb.value);
            } else if (field.type === 'multi-image-upload') {
                // Get multi-image data from hidden input
                const hiddenInput = form.querySelector(`.multi-images-data[name="${field.key}"]`);
                if (hiddenInput) {
                    try {
                        currentData[section][index][field.key] = JSON.parse(hiddenInput.value);
                    } catch (e) {
                        currentData[section][index][field.key] = [];
                    }
                }
            } else if (field.type === 'color') {
                // Get value from color picker input
                const colorInput = form.querySelector(`[name="${field.key}"]`);
                if (colorInput) {
                    currentData[section][index][field.key] = colorInput.value;
                }
            } else {
                const input = form.querySelector(`[name="${field.key}"]`);
                if (input) {
                    // Handle nested fields (e.g., socials.facebook)
                    if (field.key.includes('.')) {
                        const keys = field.key.split('.');
                        let obj = currentData[section][index];
                        for (let i = 0; i < keys.length - 1; i++) {
                            if (!obj[keys[i]]) obj[keys[i]] = {};
                            obj = obj[keys[i]];
                        }
                        obj[keys[keys.length - 1]] = input.value;
                    } else if (field.type === 'array') {
                        const value = input.value.trim();
                        currentData[section][index][field.key] = value ? value.split(',').map(v => v.trim()) : [];
                    } else if (field.type === 'number') {
                        currentData[section][index][field.key] = parseFloat(input.value) || 0;
                    } else if (field.type === 'boolean') {
                        currentData[section][index][field.key] = input.checked;
                    } else {
                        currentData[section][index][field.key] = input.value;
                    }
                }
            }
        });
        hasChanges = true;
        loadSection(section);
        showToast('Changes saved locally. Click "Save All Changes" to persist.', 'success');
    };

    const modal = createModal('Edit Item', () => {
        console.log('=== MODAL CONTENT GENERATION ===');
        console.log('Fields:', fields);

        // Group fields by section
        const sections = {};
        fields.forEach(field => {
            console.log('Processing field:', field);
            const sectionName = field.section || 'General';
            if (!sections[sectionName]) {
                sections[sectionName] = [];
            }
            sections[sectionName].push(field);
        });

        console.log('Grouped sections:', sections);

        // Render form with sections
        const sectionsHtml = Object.keys(sections).map(sectionName => {
            const sectionFields = sections[sectionName].map(field => {
                const fieldHtml = renderFormField(field, item);
                console.log(`Field ${field.key} rendered:`, fieldHtml ? 'YES' : 'NO');
                return fieldHtml;
            }).join('');

            return `
                <div class="form-section">
                    <h4 class="form-section-title">${sectionName}</h4>
                    <div class="form-section-content">
                        ${sectionFields}
                    </div>
                </div>
            `;
        }).join('');

        console.log('Generated HTML length:', sectionsHtml.length);

        return `
            <form id="edit-form" onsubmit="return false;">
                ${sectionsHtml}
            </form>
        `;
    }, saveCallback);

    document.body.appendChild(modal);
    modal.classList.add('active');

    // Initialize Quill editor if content field exists
    const quillContainer = document.getElementById('quill-editor');
    if (quillContainer) {
        quillEditor = new Quill('#quill-editor', {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline'],
                        ['link', 'image'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'align': [] }],
                        ['clean']
                    ],
                    handlers: {
                        image: imageHandler
                    }
                }
            },
            placeholder: 'Write your blog content here...'
        });

        // Set initial content
        if (item.content) {
            quillEditor.root.innerHTML = item.content;
        }
    }
}

// Custom image handler for Quill
function imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;

        // Validate file size (10MB max for original file)
        if (file.size > 10 * 1024 * 1024) {
            showToast('Image too large. Maximum size is 10MB.', 'error');
            return;
        }

        // Store file and cursor position
        selectedImageFile = file;
        currentQuillRange = quillEditor.getSelection(true);

        // Show crop modal with article ID context
        const articleId = getArticleIdFromForm();
        showCropModal(file, articleId, 'content');
    };

    input.click();
}

// Get article ID from current form
function getArticleIdFromForm() {
    const form = document.getElementById('edit-form');
    if (form) {
        const idInput = form.querySelector('[name="id"]');
        return idInput ? idInput.value : 'temp';
    }
    return 'temp';
}

// Upload cover image
function uploadCoverImage(fieldKey, section = null) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            showToast('Image too large. Maximum size is 10MB.', 'error');
            return;
        }

        const itemId = getArticleIdFromForm();
        selectedImageFile = file;
        currentImageFieldKey = fieldKey;

        // Show crop modal for cover image
        showCropModal(file, itemId, 'cover', section);
    };

    input.click();
}

// Remove uploaded image
function removeUploadedImage(fieldKey) {
    const form = document.getElementById('edit-form');
    const input = form.querySelector(`[name="${fieldKey}"]`);
    if (input) {
        input.value = '';
        // Reload the field by finding and updating the preview
        const container = input.closest('.image-upload-container');
        if (container) {
            const preview = container.querySelector('.image-preview');
            if (preview) preview.remove();
            const btn = container.querySelector('.upload-image-btn');
            if (btn) btn.textContent = 'Upload Image';
        }
    }
}

// Show crop modal with image preview
function showCropModal(file, itemId, imageType, section = null) {
    // Store context
    currentArticleId = itemId;
    currentImageType = imageType;
    currentSection = section;
    currentUploadSection = section || currentUploadSection; // Preserve upload section

    const reader = new FileReader();
    reader.onload = (e) => {
        const modal = document.getElementById('image-crop-modal');
        const image = document.getElementById('crop-preview-image');

        image.src = e.target.result;
        modal.style.display = 'flex';

        // Destroy previous cropper instance if exists
        if (cropperInstance) {
            cropperInstance.destroy();
        }

        // Initialize Cropper.js after image loads
        image.onload = () => {
            cropperInstance = new Cropper(image, {
                viewMode: 1,
                dragMode: 'move',
                aspectRatio: NaN,
                autoCropArea: 1,
                restore: false,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
            });

            // Update aspect ratio on change
            document.getElementById('aspect-ratio').addEventListener('change', function () {
                const value = this.value;
                if (value === 'free') {
                    cropperInstance.setAspectRatio(NaN);
                } else {
                    cropperInstance.setAspectRatio(eval(value));
                }
            });

            // Update quality display
            document.getElementById('image-quality').addEventListener('input', function () {
                document.getElementById('quality-value').textContent = Math.round(this.value * 100) + '%';
            });
        };
    };
    reader.readAsDataURL(file);
}

// Close crop modal
function closeCropModal() {
    const modal = document.getElementById('image-crop-modal');
    modal.style.display = 'none';

    if (cropperInstance) {
        cropperInstance.destroy();
        cropperInstance = null;
    }

    selectedImageFile = null;
    currentQuillRange = null;
}

// Upload cropped image
async function uploadCroppedImage() {
    if (!cropperInstance || !selectedImageFile) {
        showToast('No image selected', 'error');
        return;
    }

    // Store range and context before closing modal
    const savedRange = currentQuillRange;
    const savedFieldKey = currentImageFieldKey;
    const savedArticleId = currentArticleId || 'temp';
    const savedImageType = currentImageType || 'content';

    try {
        // Get cropped canvas
        const maxWidth = parseInt(document.getElementById('max-width').value) || 1200;
        const quality = parseFloat(document.getElementById('image-quality').value) || 0.9;

        const canvas = cropperInstance.getCroppedCanvas({
            maxWidth: maxWidth,
            maxHeight: maxWidth * 2, // Allow tall images
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });

        // Convert canvas to blob before closing modal
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg', quality);
        });

        // Get filename before closing modal
        const filename = selectedImageFile.name.replace(/\.[^/.]+$/, '.jpg');

        // Close modal now
        closeCropModal();

        // Handle cover image upload
        if (savedImageType === 'cover') {
            const form = document.getElementById('edit-form');
            const input = form.querySelector(`[name="${savedFieldKey}"]`);

            // Show loading state
            showToast('Uploading cover image...', 'warning');

            // Create FormData and upload with item ID and section
            const formData = new FormData();
            formData.append('image', blob, filename);
            formData.append('itemId', savedArticleId);
            formData.append('section', currentUploadSection || currentSection || 'blog');

            const response = await fetch('api.php?action=upload-image', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success && result.url) {
                // Update the hidden input value
                if (input) {
                    input.value = result.url;
                    // Update preview
                    const container = input.closest('.image-upload-container');
                    if (container) {
                        const existingPreview = container.querySelector('.image-preview');
                        if (existingPreview) existingPreview.remove();

                        const preview = document.createElement('div');
                        preview.className = 'image-preview';
                        preview.innerHTML = `<img src="${result.url}" alt="Preview"><button type="button" class="remove-image" onclick="removeUploadedImage('${savedFieldKey}')">×</button>`;

                        const btn = container.querySelector('.upload-image-btn');
                        container.insertBefore(preview, btn);
                        btn.textContent = 'Change Image';
                    }
                }
                showToast('Cover image uploaded successfully!', 'success');
            } else {
                showToast(result.error || 'Failed to upload image', 'error');
            }
        } else {
            // Handle content image upload (Quill editor)
            if (!quillEditor || !savedRange) {
                showToast('Editor not available', 'error');
                return;
            }

            // Show loading state in editor
            quillEditor.insertText(savedRange.index, 'Uploading image...');
            quillEditor.setSelection(savedRange.index + 18);

            // Create FormData and upload with item ID and section
            const formData = new FormData();
            formData.append('image', blob, filename);
            formData.append('itemId', savedArticleId);
            formData.append('section', currentUploadSection || currentSection || 'blog');

            const response = await fetch('api.php?action=upload-image', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            // Remove loading text
            quillEditor.deleteText(savedRange.index, 18);

            if (result.success && result.url) {
                // Insert image
                // Insert image
                quillEditor.insertEmbed(savedRange.index, 'image', result.url);
                quillEditor.setSelection(savedRange.index + 1);
                showToast('Image uploaded successfully!', 'success');
            } else {
                showToast(result.error || 'Failed to upload image', 'error');
            }
        }
    } catch (error) {
        // Remove loading text on error
        if (savedImageType === 'content' && quillEditor && savedRange) {
            try {
                quillEditor.deleteText(savedRange.index, 18);
            } catch (e) {
                // Ignore if deletion fails
            }
        }
        showToast('Error uploading image: ' + error.message, 'error');
        closeCropModal();
    }
}

// Delete item
function deleteItem(section, index) {
    if (confirm('Are you sure you want to delete this item?')) {
        currentData[section].splice(index, 1);
        hasChanges = true;
        loadSection(section);
        showToast('Item deleted. Click "Save All Changes" to persist.', 'success');
    }
}

// Render form field
function renderFormField(field, item) {
    // Handle nested fields (e.g., socials.facebook)
    let value = item;
    if (field.key.includes('.')) {
        const keys = field.key.split('.');
        for (const key of keys) {
            value = value && value[key] !== undefined ? value[key] : '';
        }
    } else {
        value = item[field.key];
    }

    const val = value !== undefined && value !== null ? value : '';
    const placeholder = field.placeholder ? `placeholder="${escapeHtml(field.placeholder)}"` : '';
    const helpText = field.help ? `<small class="form-help">${field.help}</small>` : '';
    const rows = field.rows || 4;

    // Use Quill editor for blog content field
    if (field.key === 'content' && field.type === 'textarea') {
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <div id="quill-editor" style="height: 300px;"></div>
                <input type="hidden" name="${field.key}" id="content-hidden">
                ${helpText}
            </div>
        `;
    } else if (field.type === 'article-select') {
        const articles = currentData.blog || [];
        const optionsHtml = articles.map(article =>
            `<option value="${escapeHtml(article.id || '')}" ${val === article.id ? 'selected' : ''}>${escapeHtml(article.title || 'Untitled')}</option>`
        ).join('');
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <select name="${field.key}" class="form-select">
                    <option value="">-- No Article --</option>
                    ${optionsHtml}
                </select>
                ${helpText}
            </div>
        `;
    } else if (field.type === 'image-upload') {
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <div class="image-upload-container">
                    <input type="hidden" name="${field.key}" value="${escapeHtml(val)}" class="image-url-field">
                    ${val ? `<div class="image-preview"><img src="${escapeHtml(val)}" alt="Preview"><button type="button" class="remove-image" onclick="removeUploadedImage('${field.key}')">×</button></div>` : ''}
                    <button type="button" class="btn-secondary upload-image-btn" onclick="uploadCoverImage('${field.key}', '${currentSection}')">
                        ${val ? 'Change Image' : 'Upload Image'}
                    </button>
                </div>
                ${helpText}
            </div>
        `;
    } else if (field.type === 'multiselect') {
        const options = field.options || [];
        const selectedValues = Array.isArray(val) ? val : (val ? [val] : []);
        const checkboxesHtml = options.map(opt => `
            <label class="form-label-checkbox">
                <input type="checkbox" class="form-checkbox" name="${field.key}[]" value="${escapeHtml(opt)}" ${selectedValues.includes(opt) ? 'checked' : ''}>
                <span>${opt}</span>
            </label>
        `).join('');
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <div class="checkbox-group">
                    ${checkboxesHtml}
                </div>
                ${helpText}
            </div>
        `;
    } else if (field.type === 'textarea') {
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <textarea class="form-textarea" name="${field.key}" rows="${rows}" ${placeholder}>${escapeHtml(val)}</textarea>
                ${helpText}
            </div>
        `;
    } else if (field.type === 'password') {
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <input type="password" class="form-input" name="${field.key}" value="${escapeHtml(val)}" ${placeholder}>
                ${helpText}
            </div>
        `;
    } else if (field.type === 'select') {
        const options = field.options || [];
        const optionsHtml = options.map(opt =>
            `<option value="${escapeHtml(opt)}" ${val === opt ? 'selected' : ''}>${opt}</option>`
        ).join('');
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <select class="form-select" name="${field.key}">
                    <option value="">Select ${field.label}</option>
                    ${optionsHtml}
                </select>
                ${helpText}
            </div>
        `;
    } else if (field.type === 'array') {
        const arrayVal = Array.isArray(val) ? val.join(', ') : val;
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <input type="text" class="form-input" name="${field.key}" value="${escapeHtml(arrayVal)}" ${placeholder}>
                ${helpText}
            </div>
        `;
    } else if (field.type === 'boolean') {
        return `
            <div class="form-group form-group-checkbox">
                <label class="form-label-checkbox">
                    <input type="checkbox" class="form-checkbox" name="${field.key}" ${val ? 'checked' : ''}> 
                    <span>${field.label}</span>
                </label>
                ${helpText}
            </div>
        `;
    } else if (field.type === 'number') {
        const min = field.min !== undefined ? `min="${field.min}"` : '';
        const max = field.max !== undefined ? `max="${field.max}"` : '';
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <input type="number" class="form-input" name="${field.key}" value="${val}" ${min} ${max} ${placeholder}>
                ${helpText}
            </div>
        `;
    } else if (field.type === 'date') {
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <input type="date" class="form-input" name="${field.key}" value="${escapeHtml(val)}">
                ${helpText}
            </div>
        `;
    } else if (field.type === 'url') {
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <input type="url" class="form-input" name="${field.key}" value="${escapeHtml(val)}" ${placeholder}>
                ${helpText}
            </div>
        `;
    } else if (field.type === 'color') {
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="color" class="form-color-picker" name="${field.key}" value="${val || '#000000'}" style="width: 60px; height: 40px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;" onchange="this.nextElementSibling.value = this.value">
                    <input type="text" class="form-input" value="${escapeHtml(val)}" ${placeholder} style="flex: 1;" oninput="this.previousElementSibling.value = this.value" readonly>
                </div>
                ${helpText}
            </div>
        `;
    } else if (field.type === 'multi-image-upload') {
        const imageArray = Array.isArray(val) ? val : (val ? val.split('\n').filter(url => url.trim()) : []);
        const imagesHtml = imageArray.map((url, index) => `
            <div class="multi-image-item" data-index="${index}">
                <img src="${url}" alt="Image ${index + 1}">
                <button type="button" class="remove-multi-image" onclick="removeMultiImage('${field.key}', ${index})">&times;</button>
            </div>
        `).join('');

        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <input type="hidden" class="multi-images-data" name="${field.key}" value='${JSON.stringify(imageArray)}'>
                <div class="multi-image-container" id="multi-${field.key}">
                    ${imagesHtml}
                </div>
                <label class="btn-upload-multi" for="multi-${field.key}-input">
                    📤 Upload Images (Multiple)
                </label>
                <input type="file" id="multi-${field.key}-input" class="file-input" accept="image/*" multiple style="display: none;" onchange="handleMultiImageUpload('${field.key}', this.files)">
                ${helpText}
            </div>
        `;
    } else {
        return `
            <div class="form-group">
                <label class="form-label">${field.label}</label>
                <input type="text" class="form-input" name="${field.key}" value="${escapeHtml(val)}" ${placeholder}>
                ${helpText}
            </div>
        `;
    }
}

// Create modal
function createModal(title, contentFn, saveFn) {
    console.log('=== CREATE MODAL DEBUG ===');
    console.log('Title:', title);

    const modal = document.createElement('div');
    modal.className = 'modal';

    const content = contentFn();
    console.log('Content generated, length:', content ? content.length : 0);
    console.log('Content preview:', content ? content.substring(0, 200) : 'NULL');

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close">×</button>
            </div>
            <div class="modal-body">
                ${contentFn()}
            </div>
            <div class="modal-footer">
                <button class="btn-secondary btn-cancel">Cancel</button>
                <button class="btn-primary btn-save">Save</button>
            </div>
        </div>
    `;

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const saveBtn = modal.querySelector('.btn-save');

    const closeModal = () => modal.remove();

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', () => {
        saveFn();
        closeModal();
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    return modal;
}

// Update about data
function updateAboutData(key, value) {
    currentData.about[key] = value;
    hasChanges = true;
}

// Update home data
function updateHomeData(key, value) {
    if (!currentData.home) {
        currentData.home = {};
    }
    currentData.home[key] = value;
    hasChanges = true;
}

// Save home data
async function saveHomeData() {
    try {
        const response = await fetch('api.php?action=write&file=home', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentData.home)
        });

        if (response.ok) {
            showToast('Home settings saved successfully!', 'success');
            hasChanges = false;
        } else {
            throw new Error('Failed to save home data');
        }
    } catch (error) {
        showToast('Error saving home data: ' + error.message, 'error');
    }
}

function updateAboutParagraph(index, value) {
    currentData.about.paragraphs[index] = value;
    hasChanges = true;
}

function updateSocialLink(index, key, value) {
    currentData.about.socialLinks[index][key] = value;
    hasChanges = true;
}

// Save all changes
async function saveAllChanges() {
    if (!hasChanges) {
        showToast('No changes to save', 'warning');
        return;
    }

    try {
        const files = Object.keys(currentData).filter(key => currentData[key]);
        let successCount = 0;
        let failCount = 0;

        for (const file of files) {
            try {
                const response = await fetch(`api.php?action=write&file=${file}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(currentData[file])
                });

                if (response.ok) {
                    successCount++;
                } else {
                    failCount++;
                    console.error(`Failed to save ${file}`);
                }
            } catch (error) {
                failCount++;
                console.error(`Error saving ${file}:`, error);
            }
        }

        if (failCount === 0) {
            showToast(`All ${successCount} files saved successfully!`, 'success');
            hasChanges = false;
        } else if (successCount > 0) {
            showToast(`${successCount} files saved, ${failCount} failed. Check console for details.`, 'warning');
        } else {
            showToast('Failed to save files. Make sure the server is running with PHP support.', 'error');
        }

        updateStats();
    } catch (error) {
        showToast('Error saving: ' + error.message, 'error');
    }
}// Export all data
function exportAllData() {
    const dataStr = JSON.stringify(currentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chifaa-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Full backup exported!', 'success');
}

// Update stats
function updateStats() {
    const statExperts = document.getElementById('stat-experts');
    const statServices = document.getElementById('stat-services');
    const statStartups = document.getElementById('stat-startups');
    const statBlog = document.getElementById('stat-blog');

    if (statExperts) statExperts.textContent = currentData.partners?.length || 0;
    if (statServices) statServices.textContent = currentData.aiCompanion ? 1 : 0;
    if (statStartups) statStartups.textContent = currentData.founder ? 1 : 0;
    if (statBlog) statBlog.textContent = currentData.blog?.length || 0;
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getFieldsForSection(section) {
    console.log('Getting fields for section:', section);
    switch (section) {
        case 'partners': return getPartnersFields();
        case 'authors': return getAuthorsFields();
        case 'blog': return getBlogFields();
        case 'home': return getHomeFields();
        default:
            console.warn('No fields found for section:', section);
            return [];
    }
}

// Field definitions

function getPartnersFields() {
    return [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'name', label: 'Name', type: 'text', isTitle: true },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'logo', label: 'Logo', type: 'image-upload', help: 'Upload partner logo' },
        { key: 'website', label: 'Website URL', type: 'text' },
        { key: 'backgroundColor', label: 'Background Color', type: 'color' }
    ];
}

function getAuthorsFields() {
    return [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'name', label: 'Author Name', type: 'text', isTitle: true, placeholder: 'John Doe' },
        { key: 'username', label: 'Username', type: 'text', placeholder: 'johndoe', help: 'Unique username for login' },
        { key: 'password', label: 'Password', type: 'password', placeholder: 'Enter password', help: 'Password for author login' },
        { key: 'role', label: 'Role', type: 'text', placeholder: 'CEO @ Company' },
        { key: 'image', label: 'Profile Picture', type: 'image-upload', help: 'Upload author profile picture' },
        { key: 'bio', label: 'Bio', type: 'textarea', rows: 4, placeholder: 'Author biography...', help: 'Brief bio about the author' },
        { key: 'socials.facebook', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/profile', help: 'Optional - Facebook profile URL' },
        { key: 'socials.instagram', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/profile', help: 'Optional - Instagram profile URL' },
        { key: 'socials.linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/profile', help: 'Optional - LinkedIn profile URL' }
    ];
}

function getBlogFields() {
    // Fetch author names for dropdown
    const authorOptions = currentData.authors ? currentData.authors.map(author => author.name) : [];

    return [
        { key: 'id', label: 'ID', type: 'number', section: 'Basic Info' },
        { key: 'title', label: 'Title', type: 'text', isTitle: true, section: 'Basic Info', placeholder: 'Enter article title' },
        { key: 'slug', label: 'URL Slug', type: 'text', section: 'Basic Info', placeholder: 'article-url-slug', help: 'URL-friendly version of the title' },

        { key: 'author', label: 'Author', type: 'select', section: 'Author', options: authorOptions, help: 'Select an author from the list' },

        { key: 'coverImage', label: 'Cover Image', type: 'image-upload', section: 'Images', help: 'Upload article cover image (Recommended: 800x450px)' },

        { key: 'excerpt', label: 'Excerpt', type: 'textarea', section: 'Content', rows: 3, placeholder: 'Brief summary of the article (150-200 characters)', help: 'This appears in article cards' },
        { key: 'content', label: 'Full Content (HTML)', type: 'textarea', section: 'Content', rows: 15, placeholder: '<p>Your article content here...</p>', help: 'Full article content with HTML formatting' },

        { key: 'category', label: 'Categories', type: 'multiselect', section: 'Classification', options: ['Community Hub', 'Sahel & African Innovation', 'Chifaa Space Experience', 'Events & Programs', 'Skills', 'Careers', 'Entrepreneurship', 'Startups', 'Chifaa Vision'], help: 'Select one or more categories' },
        { key: 'tags', label: 'Tags', type: 'array', section: 'Classification', placeholder: 'Startups, Innovation, Growth', help: 'Comma-separated tags' },

        { key: 'readTime', label: 'Read Time (minutes)', type: 'number', section: 'Metadata', min: 1, max: 60 },
        { key: 'publishedDate', label: 'Published Date', type: 'date', section: 'Metadata', help: 'Format: YYYY-MM-DD' },
        { key: 'featured', label: 'Featured Article', type: 'boolean', section: 'Metadata', help: 'Featured articles appear at the top' },
        { key: 'views', label: 'Views', type: 'number', section: 'Metadata', help: 'Article view count' }
    ];
}

// Home fields
function getHomeFields() {
    return [
        { key: 'videoUrl', label: 'YouTube Video URL', type: 'text', placeholder: 'https://www.youtube.com/watch?v=...', help: 'Enter the YouTube video URL for the homepage play button' }
    ];
}

// Multi-image upload handler
async function handleMultiImageUpload(fieldKey, files) {
    if (!files || files.length === 0) return;

    const container = document.getElementById(`multi-${fieldKey}`);
    const hiddenInput = container.previousElementSibling;
    const currentImages = JSON.parse(hiddenInput.value || '[]');

    for (let file of files) {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('section', currentSection);

            const response = await fetch('api.php?action=upload-image', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                currentImages.push(result.url);
            } else {
                showToast('Error uploading image: ' + (result.error || 'Unknown error'), 'error');
            }
        } catch (error) {
            showToast('Error uploading image: ' + error.message, 'error');
        }
    }

    // Update the hidden input and re-render
    hiddenInput.value = JSON.stringify(currentImages);
    renderMultiImages(fieldKey, currentImages);
    hasChanges = true;
}

// Remove image from multi-image field
function removeMultiImage(fieldKey, index) {
    const container = document.getElementById(`multi-${fieldKey}`);
    const hiddenInput = container.previousElementSibling;
    const currentImages = JSON.parse(hiddenInput.value || '[]');

    currentImages.splice(index, 1);
    hiddenInput.value = JSON.stringify(currentImages);
    renderMultiImages(fieldKey, currentImages);
    hasChanges = true;
}

// Render multi-images preview
function renderMultiImages(fieldKey, images) {
    const container = document.getElementById(`multi-${fieldKey}`);
    container.innerHTML = images.map((url, index) => `
        <div class="multi-image-item" data-index="${index}">
            <img src="${url}" alt="Image ${index + 1}">
            <button type="button" class="remove-multi-image" onclick="removeMultiImage('${fieldKey}', ${index})">&times;</button>
        </div>
    `).join('');
}

// Make functions globally available
window.handleMultiImageUpload = handleMultiImageUpload;
window.removeMultiImage = removeMultiImage;




