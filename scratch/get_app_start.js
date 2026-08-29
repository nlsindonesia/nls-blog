const fs = require('fs');

const content = fs.readFileSync('nlsadmin/index.html', 'utf8');
const fnIdx = content.indexOf('function superAdminApp()');
console.log('function superAdminApp() snippet:');
console.log(content.slice(fnIdx, fnIdx + 1200));
