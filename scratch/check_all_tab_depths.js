const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

// Find all tab sections
const tabMarkers = [
    { name: 'kalender', startStr: '<div x-show="activeTab === \'kalender\'"' },
    { name: 'berita', startStr: '<div x-show="activeTab === \'berita\'"' },
    { name: 'pengajar', startStr: '<div x-show="activeTab === \'pengajar\'"' },
    { name: 'users', startStr: '<div x-show="activeTab === \'users\'"' },
    { name: 'endMain', startStr: '</main>' }
];

for (let i = 0; i < tabMarkers.length - 1; i++) {
    const cur = tabMarkers[i];
    const nxt = tabMarkers[i + 1];
    const sIdx = content.indexOf(cur.startStr);
    const eIdx = content.indexOf(nxt.startStr);
    console.log(`\n=== Checking Tab ${cur.name} (from offset ${sIdx} to ${eIdx}) ===`);
    
    const block = content.slice(sIdx, eIdx);
    let depth = 0;
    const tagRegex = /<\/?div\b[^>]*>/gi;
    let match;
    let prematureClose = null;
    while ((match = tagRegex.exec(block)) !== null) {
        const tag = match[0];
        if (tag.startsWith('</')) {
            depth--;
        } else if (!tag.endsWith('/>')) {
            depth++;
        }
        if (depth === 0 && match.index < block.length - 100) {
            console.log(`⚠️ Tab ${cur.name} closed prematurely at offset ${match.index}!`);
            console.log('Snippet:', block.slice(match.index - 100, match.index + 100));
            prematureClose = match.index;
        }
    }
    console.log(`Tab ${cur.name} final depth before next tab: ${depth}`);
}
