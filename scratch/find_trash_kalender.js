const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const trashKalenderIdx = content.indexOf('Trash Kalender Event');
console.log('Index of Trash Kalender Event:', trashKalenderIdx);
console.log('Context (500 chars before and 500 chars after):');
console.log(content.slice(trashKalenderIdx - 500, trashKalenderIdx + 500));
