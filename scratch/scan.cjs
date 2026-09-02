const fs = require('fs');
const path = require('path');

function findMojibake(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const f of files) {
        if (f.name === '.git' || f.name === 'node_modules' || f.name === 'scratch' || f.name === '.gemini') continue;
        const p = path.join(dir, f.name);
        if (f.isDirectory()) {
            findMojibake(p);
        } else if (p.endsWith('.html') || p.endsWith('.js') || p.endsWith('.db.js')) {
            const c = fs.readFileSync(p, 'utf8');
            const matches = c.match(/(?:ðŸ|âš|Ã°Å|Ã¢Å)[^\s<>'\"`]+|â€¢|âœ[^\s<>'\"`]+/g);
            if (matches && matches.length > 0) {
                console.log(p, [...new Set(matches)]);
            }
        }
    }
}
findMojibake(__dirname + '/../');
