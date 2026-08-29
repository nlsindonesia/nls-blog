const fs = require('fs');
const path = require('path');

function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!file.startsWith('.') && file !== 'node_modules' && file !== 'build' && file !== 'scratch') {
                results = results.concat(getFiles(fullPath));
            }
        } else if (file.endsWith('.html') || file.endsWith('.js')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = getFiles('.');
const imgRegex = /["'](\/(?:images|uploads)\/[^"']+\.(?:png|jpg|jpeg|svg|webp|ico))["']/gi;
const missing = [];

files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
        const imgPath = match[1];
        const clean = imgPath.slice(1);
        if (!fs.existsSync(clean)) {
            missing.push({ file: f, image: imgPath });
        }
    }
});

console.log('Total missing image references across entire codebase:', missing.length);
if (missing.length > 0) {
    console.log('Missing references:', missing);
}
