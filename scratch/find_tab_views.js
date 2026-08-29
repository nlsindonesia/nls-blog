const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const matches = content.match(/<!-- ==========================================\s*TAB \d+:[\s\S]*?========================================== -->/gi) || [];
console.log('Tab comments count:', matches.length);
matches.forEach(m => console.log(m));

// Find all elements with x-show containing activeTab
const xShows = content.match(/x-show="[^"]*activeTab[^"]*"/g) || [];
console.log('x-show with activeTab count:', xShows.length);
console.log([...new Set(xShows)]);
