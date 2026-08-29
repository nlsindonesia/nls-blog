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
        } else if (file.endsWith('.html')) {
            results.push(fullPath);
        }
    });
    return results;
}

const htmlFiles = getFiles('.');
const filesWithIcon = [];

htmlFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('icon-[')) {
        filesWithIcon.push({ file: f, hasIconifyScript: content.includes('iconify.min.js') });
    }
});

console.log('Files with icon-[ :', filesWithIcon);
