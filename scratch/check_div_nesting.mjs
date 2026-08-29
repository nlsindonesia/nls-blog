import fs from 'fs';

const content = fs.readFileSync('nlsadmin/index.html', 'utf8');
const lines = content.split('\n');

let depth = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div(\s|>|$)/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    
    if (line.includes('activeTab === \'pengajar\'') || line.includes('activeTab === \'users\'') || line.includes('activeTab === \'kalender\'') || line.includes('activeTab === \'berita\'')) {
        console.log(`LINE ${i+1} [depth BEFORE: ${depth}]: ${line.trim()}`);
    }
    depth += opens - closes;
    if (line.includes('activeTab === \'pengajar\'') || line.includes('activeTab === \'users\'')) {
        console.log(`LINE ${i+1} [depth AFTER: ${depth}]`);
    }
}
console.log('Final div depth at EOF:', depth);
