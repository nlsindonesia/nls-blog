const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

// Find all menu blocks in the nav
const menuRegex = /<!-- Menu \d+: ([^>]+) -->/g;
let match;
while ((match = menuRegex.exec(content)) !== null) {
    console.log('Menu:', match[1]);
}

// Find all data collections in localStorage / state
const collections = content.match(/localStorage\.getItem\(['"][^'"]+['"]\)/g) || [];
console.log('localStorage collections:', [...new Set(collections)]);
