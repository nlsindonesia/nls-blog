const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const trashKalenderIdx = content.indexOf('Trash Kalender Event');
console.log(content.slice(trashKalenderIdx - 1200, trashKalenderIdx));
