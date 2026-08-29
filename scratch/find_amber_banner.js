const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const targetStr = 'p-6 sm:p-8 rounded-3xl border border-amber-400/30';
const idx = content.indexOf(targetStr);
console.log('Index:', idx);
console.log('Snippet before and after:');
console.log(content.slice(idx - 100, idx + 200));
