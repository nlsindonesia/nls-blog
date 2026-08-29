const fs = require('fs');
const html = fs.readFileSync('snbt/index.html', 'utf8');
console.log('File length:', html.length);
console.log('Has default-articles.js:', html.includes('default-articles.js'));
console.log('Has snbtNewsApp:', html.includes('snbtNewsApp'));
console.log('Has Berita Terkini & Wawasan SNBT / UTBK:', html.includes('Berita Terkini &amp; Wawasan SNBT / UTBK'));
