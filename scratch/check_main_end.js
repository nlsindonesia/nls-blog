const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const mainCloseIdx = content.indexOf('</main>');
console.log('Snippet before </main>:');
console.log(content.slice(mainCloseIdx - 500, mainCloseIdx + 50));
