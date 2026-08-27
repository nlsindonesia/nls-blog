const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'c:\\Users\\vc\\Documents\\nls-blog-hame\\nls-blog-hame';
const EXTS = ['.html', '.js', '.css', '.md'];

const MOJIBAKE_REPLACEMENTS = [
    { from: /•/g, to: '•' },
    { from: /✓/g, to: '✓' },
    { from: /✔/g, to: '✔' },
    { from: /â€“/g, to: '–' },
    { from: /â€”/g, to: '—' },
    { from: /â€˜/g, to: "'" },
    { from: /â€™/g, to: "'" },
    { from: /â€œ/g, to: '"' },
    { from: /â€\u009d/g, to: '"' },
    { from: /â€/g, to: '"' },
    { from: /â€¦/g, to: '...' },
    { from: /Ã—/g, to: '×' },
    { from: /â–¼/g, to: '▼' },
    { from: /â–²/g, to: '▲' },
    { from: /â†’/g, to: '→' }
];

let fixedCount = 0;

function walkDir(dir) {
    const list = fs.readdirSync(dir);
    for (const item of list) {
        const fullPath = path.join(dir, item);
        if (item === '.git' || item === 'node_modules') continue;
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (stat.isFile()) {
            const ext = path.extname(item);
            if (EXTS.includes(ext)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let orig = content;

                for (const rep of MOJIBAKE_REPLACEMENTS) {
                    content = content.replace(rep.from, rep.to);
                }

                if (content !== orig) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log('Fixed:', path.relative(ROOT_DIR, fullPath));
                    fixedCount++;
                }
            }
        }
    }
}

walkDir(ROOT_DIR);
console.log(`\nFinished. Total cleaned files: ${fixedCount}`);
