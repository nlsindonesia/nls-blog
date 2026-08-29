const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

// Find all banner headers in nlsadmin/index.html
const banners = content.match(/<div class="[^"]*(?:bg-gradient|admin-hero)[^"]*"/g) || [];
console.log('Total gradient/hero banner elements:', banners.length);
banners.forEach(b => console.log('-', b));
