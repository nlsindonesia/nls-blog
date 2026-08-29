const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const bIdx = content.indexOf('<div x-show="activeTab === \'berita\'"');
console.log('Snippet before Tab Berita:');
console.log(content.slice(bIdx - 300, bIdx));
