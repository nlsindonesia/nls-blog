const fs = require('fs');
const content = fs.readFileSync('blog/default-articles.js', 'utf8');

const regex = /"coverImage":\s*"([^"]+)"/g;
let match;
const invalidCovers = [];
const allCovers = [];
while ((match = regex.exec(content)) !== null) {
    const src = match[1];
    allCovers.push(src);
    const clean = src.startsWith('/') ? src.slice(1) : src;
    if (!fs.existsSync(clean)) {
        invalidCovers.push(src);
    }
}

console.log('Total articles with coverImage:', allCovers.length);
console.log('Invalid/Missing coverImage paths count:', invalidCovers.length);
console.log('Missing paths:', [...new Set(invalidCovers)]);
