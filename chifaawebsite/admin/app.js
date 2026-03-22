// STEP 1: PASTE YOUR FIREBASE CONFIGURATION HERE
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// --- SCHEMA DEFINITION ---
// This object defines the structure of our forms and data.
const schema = {
    team_members: {
        title: "Team Members",
        fields: {
            name: { label: "Name", type: "text" },
            role: { label: "Role", type: "text" },
            organization: { label: "Organization", type: "text" },
            bio: { label: "Bio", type: "textarea" },
            imageUrl: { label: "Image", type: "file" },
            order: { label: "Order", type: "number" }
        }
    },
    services: {
        title: "Services",
        fields: {
            title: { label: "Title", type: "text" },
            description: { label: "Description", type: "textarea" },
            backgroundColor: { label: "Background Color (Hex)", type: "text" },
            order: { label: "Order", type: "number" }
        }
    },
    experts: {
        title: "Experts",
        fields: {
            name: { label: "Name", type: "text" },
            role: { label: "Role", type: "text" },
            organization: { label: "Organization", type: "text" },
            bio: { label: "Bio", type: "textarea" },
            imageUrl: { label: "Image", type: "file" },
            cardColor: { label: "Card Color Class", type: "text" },
            order: { label: "Order", type: "number" }
        }
    },
    startups: {
        title: "Startups",
        fields: {
            name: { label: "Name", type: "text" },
            description: { label: "Description", type: "textarea" },
            logoUrl: { label: "Logo", type: "file" },
            order: { label: "Order", type: "number" }
        }
    },
    founders: {
        title: "Founders",
        fields: {
            name: { label: "Name", type: "text" },
            role: { label: "Role", type: "text" },
            organization: { label: "Organization", type: "text" },
            bio: { label: "Bio", type: "textarea" },
            imageUrl: { label: "Image", type: "file" },
            order: { label: "Order", type: "number" }
        }
    },
    gallery_images: {
        title: "Gallery Images",
        fields: {
            caption: { label: "Caption", type: "text" },
            imageUrl: { label: "Image", type: "file" },
            order: { label: "Order", type: "number" }
        }
    }
};

// --- DOM ELEMENTS ---
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const adminNav = document.getElementById('admin-nav');
const collectionTitle = document.getElementById('collection-title');
const managementArea = document.getElementById('management-area');
const addNewBtn = document.getElementById('add-new-btn');
const formContainer = document.getElementById('form-container');
const crudForm = document.getElementById('crud-form');
const formTitle = document.getElementById('form-title');
const formFields = document.getElementById('form-fields');
const cancelBtn = document.getElementById('cancel-btn');

let currentCollection = null;
let currentDocId = null;

// --- AUTHENTICATION ---
auth.onAuthStateChanged(user => {
    if (user) {
        loginView.style.display = 'none';
        dashboardView.style.display = 'flex';
    } else {
        loginView.style.display = 'flex';
        dashboardView.style.display = 'none';
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            loginError.textContent = error.message;
        });
});

logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// --- NAVIGATION ---
adminNav.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.tagName === 'A') {
        currentCollection = e.target.dataset.collection;
        
        // Update active link style
        document.querySelectorAll('#admin-nav a').forEach(a => a.classList.remove('active'));
        e.target.classList.add('active');

        loadCollectionData(currentCollection);
        formContainer.style.display = 'none';
        addNewBtn.style.display = 'block';
    }
});

// --- DATA LOADING ---
async function loadCollectionData(collectionName) {
    collectionTitle.textContent = schema[collectionName].title;
    managementArea.innerHTML = 'Loading...';

    const collectionRef = db.collection(collectionName).orderBy('order');
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
        managementArea.innerHTML = '<p>No items found. Click "+ Add New" to create one.</p>';
        return;
    }

    const headers = Object.keys(schema[collectionName].fields);
    const tableRows = snapshot.docs.map(doc => {
        const data = doc.data();
        const cells = headers.map(header => {
            const value = data[header] || '';
            if (header.toLowerCase().includes('url') || header.toLowerCase().includes('logo')) {
                return `<td><img src="${value}" alt=""></td>`;
            }
            return `<td>${value}</td>`;
        }).join('');

        return `
            <tr data-id="${doc.id}">
                ${cells}
                <td class="actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </td>
            </tr>
        `;
    }).join('');

    managementArea.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    ${headers.map(h => `<th>${h}</th>`).join('')}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
    `;
}

// --- FORM HANDLING ---
function showForm(collectionName, docData = {}, docId = null) {
    currentDocId = docId;
    formTitle.textContent = docId ? `Edit ${schema[collectionName].title}` : `Add New ${schema[collectionName].title}`;
    formFields.innerHTML = '';

    for (const [key, field] of Object.entries(schema[collectionName].fields)) {
        const value = docData[key] || '';
        let inputHtml = '';
        if (field.type === 'textarea') {
            inputHtml = `<textarea id="field-${key}" required>${value}</textarea>`;
        } else if (field.type === 'file') {
            inputHtml = `<input type="file" id="field-${key}">`;
            if (value) {
                inputHtml += `<p>Current: <a href="${value}" target="_blank">View Image</a></p>`;
            }
        } else {
            inputHtml = `<input type="${field.type}" id="field-${key}" value="${value}" required>`;
        }

        formFields.innerHTML += `
            <div class="form-field">
                <label for="field-${key}">${field.label}</label>
                ${inputHtml}
                <div id="progress-bar-${key}" class="progress-bar" style="display:none;"></div>
            </div>
        `;
    }
    formContainer.style.display = 'block';
}

addNewBtn.addEventListener('click', () => {
    showForm(currentCollection);
});

cancelBtn.addEventListener('click', () => {
    formContainer.style.display = 'none';
    crudForm.reset();
});

// --- CRUD OPERATIONS ---
crudForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {};
    const fileUploads = [];

    for (const [key, field] of Object.entries(schema[currentCollection].fields)) {
        const input = document.getElementById(`field-${key}`);
        if (field.type === 'file') {
            if (input.files[0]) {
                fileUploads.push({ key, file: input.files[0] });
            }
        } else if (field.type === 'number') {
            data[key] = Number(input.value);
        } else {
            data[key] = input.value;
        }
    }

    // Handle file uploads first
    for (const upload of fileUploads) {
        const filePath = `${currentCollection}/${Date.now()}_${upload.file.name}`;
        const fileRef = storage.ref(filePath);
        const task = fileRef.put(upload.file);

        task.on('state_changed', 
            (snapshot) => { /* Progress update can be handled here */ },
            (error) => { console.error("Upload failed:", error); },
            async () => {
                const downloadURL = await task.snapshot.ref.getDownloadURL();
                data[upload.key] = downloadURL;
                
                // If all uploads are done, save the document
                if (Object.keys(data).length >= Object.keys(schema[currentCollection].fields).length - fileUploads.length + fileUploads.indexOf(upload) + 1) {
                    saveDocument(data);
                }
            }
        );
    }

    // If no files to upload, save directly
    if (fileUploads.length === 0) {
        saveDocument(data);
    }
});

async function saveDocument(data) {
    const collectionRef = db.collection(currentCollection);
    if (currentDocId) {
        await collectionRef.doc(currentDocId).update(data);
    } else {
        await collectionRef.add(data);
    }

    formContainer.style.display = 'none';
    crudForm.reset();
    loadCollectionData(currentCollection);
}

managementArea.addEventListener('click', async (e) => {
    const target = e.target;
    const row = target.closest('tr');
    if (!row) return;
    const docId = row.dataset.id;

    if (target.classList.contains('edit-btn')) {
        const doc = await db.collection(currentCollection).doc(docId).get();
        showForm(currentCollection, doc.data(), docId);
    }

    if (target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this item?')) {
            await db.collection(currentCollection).doc(docId).delete();
            loadCollectionData(currentCollection);
        }
    }
});
