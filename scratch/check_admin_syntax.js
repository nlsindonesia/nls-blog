const fs = require('fs');

const html = fs.readFileSync('./nlsadmin/index.html', 'utf8');

// Extract all <script> contents and validate syntax
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;

while ((match = scriptRegex.exec(html)) !== null) {
    count++;
    const code = match[1].trim();
    if (code && !match[0].includes('src=')) {
        try {
            new Function(code);
            console.log(`Script block ${count}: Syntax VALID`);
        } catch (e) {
            console.error(`❌ Script block ${count} SYNTAX ERROR:`, e.message);
            console.error(code.slice(0, 300));
        }
    }
}
