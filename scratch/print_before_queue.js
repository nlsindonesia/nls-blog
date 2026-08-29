const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const tQueueIdx = content.indexOf('Teacher Verification Queue');
console.log(content.slice(tQueueIdx - 800, tQueueIdx - 200));
