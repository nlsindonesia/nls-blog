const fs = require('fs');
const content = fs.readFileSync('nlsadmin/index.html', 'utf8');

const kalenderStart = content.indexOf('<div x-show="activeTab === \'kalender\'"');
const trashKalenderIdx = content.indexOf('TRASH EVENT (TEMPAT SAMPAH AGENDA TERHAPUS)');

const kalenderBlock = content.slice(kalenderStart, trashKalenderIdx);

// Count tags
let depth = 0;
const tagRegex = /<\/?div\b[^>]*>/gi;
let match;
while ((match = tagRegex.exec(kalenderBlock)) !== null) {
    const tag = match[0];
    if (tag.startsWith('</')) {
        depth--;
        console.log(`Close </div> at offset ${match.index}, depth becomes: ${depth}`);
    } else if (!tag.endsWith('/>')) {
        depth++;
        // console.log(`Open <div> at offset ${match.index}, depth becomes: ${depth}`);
    }
    if (depth === 0) {
        console.log(`⚠️ TAB KALENDER CLOSED PREMATURELY at offset ${match.index}!`);
        console.log('Context around premature close:');
        console.log(kalenderBlock.slice(match.index - 200, match.index + 200));
    }
}
console.log('Final depth before Trash Kalender:', depth);
