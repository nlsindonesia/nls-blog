const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const scriptIdx = content.indexOf('<script>\n        function superAdminApp()');
console.log('Script start idx:', scriptIdx);

const beforeScript = content.slice(scriptIdx - 1000, scriptIdx);
console.log('Snippet before script:');
console.log(beforeScript);
