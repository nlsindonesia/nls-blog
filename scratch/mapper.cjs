const fs = require('fs');
const badLines = fs.readFileSync('belajar/index.html', 'utf8').split('\n');
const goodLines = fs.readFileSync('scratch/belajar_good.html', 'utf8').split('\n');

for (let i = 0; i < Math.min(badLines.length, goodLines.length); i++) {
    const bad = badLines[i];
    const good = goodLines[i];
    
    // Find ?? or dY followed by anything up to < or space or " or '
    const match = bad.match(/(dY[^\s<"':]+|\?\?+)/g);
    if (match && bad !== good) {
        console.log('Line ' + (i+1));
        console.log('BAD:  ' + bad.trim());
        console.log('GOOD: ' + good.trim());
        console.log('---');
    }
}
