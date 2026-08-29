const fs = require('fs');
const html = fs.readFileSync('snbt/index.html', 'utf8');
console.log('File length:', html.length);
console.log('Has default-events.js:', html.includes('default-events.js'));
console.log('Has snbtCalendarApp:', html.includes('snbtCalendarApp'));
console.log('Has snbtNewsApp:', html.includes('snbtNewsApp'));
console.log('Has Kalender Kegiatan & Agenda Try Out SNBT:', html.includes('Kalender Kegiatan &amp; Agenda Try Out SNBT'));
console.log('Has Berita Terkini & Wawasan SNBT:', html.includes('Berita Terkini &amp; Wawasan SNBT / UTBK'));
