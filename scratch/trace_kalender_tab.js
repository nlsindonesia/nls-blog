const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const kalenderStart = content.indexOf('<div x-show="activeTab === \'kalender\'"');
const beritaStart = content.indexOf('<div x-show="activeTab === \'berita\'"');
const trashKalenderIdx = content.indexOf('Trash Kalender Event');

console.log('kalenderStart index:', kalenderStart);
console.log('trashKalender index:', trashKalenderIdx);
console.log('beritaStart index:', beritaStart);

// Let's see the text between trashKalender and beritaStart
const betweenSnippet = content.slice(trashKalenderIdx, beritaStart + 100);
console.log('\nSnippet around end of Trash Kalender and start of Berita:');
console.log(betweenSnippet.slice(-600));
