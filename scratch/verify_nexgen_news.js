const fs = require('fs');
const html = fs.readFileSync('nexgen/index.html', 'utf8');

console.log('Nexgen index length:', html.length);
console.log('Has default-articles.js:', html.includes('default-articles.js'));
console.log('Has nexgenNewsApp:', html.includes('nexgenNewsApp'));
console.log('Has Berita Terkini & Wawasan Bimbel NexGen:', html.includes('Berita Terkini &amp; Wawasan Bimbel NexGen'));
console.log('Has Reader Modal:', html.includes('isReaderOpen'));
