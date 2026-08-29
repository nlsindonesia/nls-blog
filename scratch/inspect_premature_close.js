const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const s = content.indexOf('VIEW 3: TRASH EVENT');
console.log('Snippet 300 chars before and 200 chars after:');
console.log(content.slice(s - 300, s + 200));
