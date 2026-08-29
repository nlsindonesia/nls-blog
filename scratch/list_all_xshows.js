const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const regex = /x-show="([^"]+)"/g;
let match;
const shows = new Set();
while ((match = regex.exec(content)) !== null) {
    shows.add(match[1]);
}
console.log('All x-show expressions in nlsadmin/index.html:');
shows.forEach(s => console.log('-', s));
