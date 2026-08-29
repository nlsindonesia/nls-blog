const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const tQueueIdx = content.indexOf('Teacher Verification Queue');
console.log('Teacher Verification Queue snippet:');
console.log(content.slice(tQueueIdx - 200, tQueueIdx + 500));

const trashPengajarIdx = content.indexOf('Trash Data Pengajar');
console.log('\nTrash Data Pengajar snippet:');
console.log(content.slice(trashPengajarIdx - 200, trashPengajarIdx + 500));
