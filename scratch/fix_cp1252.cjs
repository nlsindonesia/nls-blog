const fs = require('fs');

const path = require('path');

// Map of CP1252 chars that are different from Latin-1
const cp1252RevMap = {
    '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85, '†': 0x86, '‡': 0x87, 'ˆ': 0x88, '‰': 0x89, 'Š': 0x8A, '‹': 0x8B, 'Œ': 0x8C, 'Ž': 0x8E,
    '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94, '•': 0x95, '–': 0x96, '—': 0x97, '˜': 0x98, '™': 0x99, 'š': 0x9A, '›': 0x9B, 'œ': 0x9C, 'ž': 0x9E, 'Ÿ': 0x9F
};

function charToByte(c) {
    if (cp1252RevMap[c] !== undefined) return cp1252RevMap[c];
    const code = c.charCodeAt(0);
    if (code > 255) return null; // Not cp1252
    return code;
}

function fixMojibake(str) {
    return str.replace(/(?:ðŸ|âš|Ã°Å|Ã¢Å|â€¢|âœ|ðŸ\x8F|ðŸ‡)[^\s<>'\"`]+/g, (match) => {
        let bytes = [];
        for (let i = 0; i < match.length; i++) {
            let b = charToByte(match[i]);
            if (b === null) return match; // If there's a char we can't map, abort for this match
            bytes.push(b);
        }
        return Buffer.from(bytes).toString('utf8');
    });
}

function processDir(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const f of files) {
        if (f.name === '.git' || f.name === 'node_modules' || f.name === 'scratch' || f.name === '.gemini') continue;
        const p = path.join(dir, f.name);
        if (f.isDirectory()) {
            processDir(p);
        } else if (p.endsWith('.html') || p.endsWith('.js') || p.endsWith('.css') || p.endsWith('.md')) {
            const c = fs.readFileSync(p, 'utf8');
            const fixed = fixMojibake(c);
            if (fixed !== c) {
                fs.writeFileSync(p, fixed, 'utf8');
                console.log(`Fixed: ${p}`);
            }
        }
    }
}

processDir(__dirname + '/../');
console.log("Done");

