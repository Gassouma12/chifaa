const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/abena/Desktop/chifaa/chifaa/chifaawebsite';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const svgPath = 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z';
const newFooter = `<footer class="site-footer">
    <p>&copy; Chifaa ~ All rights reserved</p>
    <p class="footer-credit">Made with 🩷 by Aboulkacem ben Arab <a href="https://www.linkedin.com/in/aboulkacem-ben-arab-567974241/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile of Aboulkacem ben Arab"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="${svgPath}" /></svg></a></p>
</footer>`;

let count = 0;
files.forEach(f => {
    const fullPath = path.join(dir, f);
    let content = fs.readFileSync(fullPath, 'utf8');
    const regex = /<footer[^>]*>[\s\S]*?<\/footer>/i;
    if (regex.test(content)) {
        content = content.replace(regex, newFooter);
        fs.writeFileSync(fullPath, content, 'utf8');
        count++;
    }
});
console.log('Updated ' + count + ' files.');
