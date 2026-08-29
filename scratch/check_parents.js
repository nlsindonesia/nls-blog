const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const tQueueIdx = content.indexOf('Teacher Verification Queue');
console.log('Teacher Verification Queue parent snippet:');
console.log(content.slice(tQueueIdx - 400, tQueueIdx + 50));

const trashPengajarIdx = content.indexOf('Trash Data Pengajar');
console.log('\nTrash Data Pengajar parent snippet:');
console.log(content.slice(trashPengajarIdx - 400, trashPengajarIdx + 50));
