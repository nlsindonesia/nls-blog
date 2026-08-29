const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const tQueueIdx = content.indexOf('Teacher Verification Queue');
console.log('Banner container for Verification Queue:');
console.log(content.slice(tQueueIdx - 350, tQueueIdx - 50));

const trashPengajarIdx = content.indexOf('Trash Data Pengajar');
console.log('\nBanner container for Trash Data Pengajar:');
console.log(content.slice(trashPengajarIdx - 350, trashPengajarIdx - 50));
