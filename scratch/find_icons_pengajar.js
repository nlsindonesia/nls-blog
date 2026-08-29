const fs = require('fs');
const html = fs.readFileSync('pengajar/index.html', 'utf8');

const regex = /class="[^"]*icon-\[[^"]*"/g;
const matches = html.match(regex);
console.log('Total icon-[ matches in pengajar/index.html:', matches ? matches.length : 0);
if (matches) {
    console.log([...new Set(matches)]);
}
