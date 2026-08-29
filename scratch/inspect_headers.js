const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const tQueueIdx = content.indexOf('Teacher Verification Queue');
console.log('Context of Teacher Verification Queue:');
console.log(content.slice(tQueueIdx - 250, tQueueIdx + 300));

const trashPengajarIdx = content.indexOf('Trash Data Pengajar');
console.log('\nContext of Trash Data Pengajar:');
console.log(content.slice(trashPengajarIdx - 250, trashPengajarIdx + 300));
