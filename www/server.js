const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Setup middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const section = req.body.section || 'blog';
        const itemId = req.body.itemId || 'temp';
        
        let uploadDir = path.join(__dirname, 'assets', 'images', 'articles', String(itemId));
        
        const knownSections = ['authors', 'startups', 'partners', 'experts', 'founders', 'founder', 'projects', 'services', 'team', 'reviews', 'gallery', 'podcast'];
        
        if (knownSections.includes(section)) {
            const folder = section === 'founder' ? 'founders' : section;
            uploadDir = path.join(__dirname, 'assets', 'images', folder);
        }

        // Create directory if it doesn't exist
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

// API Endpoint to mimic api.php
app.all(/.*api\.php$/, upload.single('image'), (req, res) => {
    const action = req.query.action;
    const file = req.query.file;
    const dataDir = path.join(__dirname, 'data');
    
    if (action === 'read') {
        const filePath = path.join(dataDir, `${file}.json`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.sendFile(filePath);
    } 
    else if (action === 'write') {
        const filePath = path.join(dataDir, `${file}.json`);
        try {
            fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), 'utf8');
            res.json({ success: true, message: 'File saved successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to write file' });
        }
    } 
    else if (action === 'list') {
        fs.readdir(dataDir, (err, files) => {
            if (err) return res.status(500).json({ error: 'Unable to scan directory' });
            const jsonFiles = files.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
            res.json(jsonFiles);
        });
    }
    else if (action === 'upload-image') {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const section = req.body.section || 'blog';
        const itemId = req.body.itemId || 'temp';
        const filename = req.file.filename;
        let url = '';
        const knownSections = ['authors', 'startups', 'partners', 'experts', 'founders', 'founder', 'projects', 'services', 'team', 'reviews', 'gallery', 'podcast'];
        
        if (knownSections.includes(section)) {
            const folder = section === 'founder' ? 'founders' : section;
            url = `assets/images/${folder}/${filename}`;
        } else {
            url = `assets/images/articles/${itemId}/${filename}`;
        }
        res.json({ success: true, url: url });
    } 
    else {
        res.status(400).json({ error: 'Invalid action' });
    }
});

// Serve static files
app.use(express.static(__dirname));

// Start server
app.listen(PORT, () => {
    console.log('---------------------------------------------------------');
    console.log(`🚀 API enabled server is running at http://localhost:${PORT}`);
    console.log('---------------------------------------------------------');
});
