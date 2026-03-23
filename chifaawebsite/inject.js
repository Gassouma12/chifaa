const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/abena/Desktop/chifaa/chifaa/chifaawebsite';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let count = 0;
files.forEach(f => {
    const fullPath = path.join(dir, f);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if it already has the script to avoid duplicates
    if (!content.includes('js/music-player.js')) {
        // Find closing body tag
        if (content.includes('</body>')) {
            content = content.replace('</body>', '    <script src="js/music-player.js"></script>\n</body>');
            fs.writeFileSync(fullPath, content, 'utf8');
            count++;
        }
    }
});
console.log('Injected music-player.js into ' + count + ' files.');
