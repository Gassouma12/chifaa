const fs = require('fs');
const path = require('path');

const directoryPath = 'c:/Users/abena/Desktop/chifaa/chifaa/chifaawebsite';

function traverseAndReplace(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'admin') {
        traverseAndReplace(fullPath);
      }
    } else if (file.endsWith('.html')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // This regex tries to find the two P tags in the footer and combine them. 
        // Example:
        // <p>&copy; Chifaa ~ All rights reserved</p>
        // <p class="footer-credit">Made with 🩷 by Aboulkacem ben Arab <a ...></p>
        const regex = /<p>\s*&copy;\s*Chifaa\s*~\s*All rights reserved\s*<\/p>\s*<p class="footer-credit">\s*Made with\s*([^<]*)\s*by\s*Aboulkacem ben Arab\s*<a([^>]*)>(.*?)<\/a>\s*<\/p>/gs;
        
        let newContent = content.replace(regex, (match, prefix, aAttrs, aContent) => {
            return `<p class="footer-credit">&copy; Chifaa ~ All rights reserved &mdash; Made with ${prefix.trim()} by Aboulkacem ben Arab <a${aAttrs}>${aContent}</a></p>`;
        });
        
        if (content !== newContent) {
           fs.writeFileSync(fullPath, newContent, 'utf8');
           console.log(`Updated: ${fullPath}`);
        }
    }
  });
}

traverseAndReplace(directoryPath);
console.log('Done!');