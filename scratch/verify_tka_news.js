const fs = require('fs');
const html = fs.readFileSync('tka/index.html', 'utf8');
console.log('File length:', html.length);
console.log('Has default-articles.js:', html.includes('default-articles.js'));
console.log('Has tkaNewsApp:', html.includes('tkaNewsApp'));
console.log('Has Berita Terkini & Wawasan TKA:', html.includes('Berita Terkini &amp; Wawasan TKA'));
