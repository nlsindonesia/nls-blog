const fs = require('fs');
const bad = fs.readFileSync('belajar/index.html', 'utf8');
const badLines = bad.split('\n');
const results = new Set();
for (let i = 0; i < badLines.length; i++) {
    const line = badLines[i];
    // Find dY followed by anything up to a space or HTML bracket, or find double question marks
    const match = line.match(/(dY[^\s<"':]+|\?\?+)/g);
    if (match) {
        match.forEach(m => {
            if (m.length > 2 || m === '??') {
                results.add(m);
            }
        });
    }
}
console.log(Array.from(results).join('\n'));
