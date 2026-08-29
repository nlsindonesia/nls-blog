const fs = require('fs');
const lines = fs.readFileSync('nlsadmin/index.html', 'utf8').split('\n');

lines.forEach((line, idx) => {
    if (line.includes('activeTab === \'pengajar\'') || line.includes('activeTab === \'berita\'') || line.includes('activeTab === \'kalender\'')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
