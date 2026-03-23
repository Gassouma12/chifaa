const fs = require('fs');
const file = 'c:/Users/abena/Desktop/chifaa/chifaa/chifaawebsite/css/styles.css';
let text = fs.readFileSync(file, 'utf8');
text = text.replace(/justify-content:\s*'([^']*)';/g, 'justify-content: center;');
text = text.replace(/content:\s*'([^']*)';/g, 'content: " \\u2014 ";');
fs.writeFileSync(file, text);
console.log('Fixed CSS.');