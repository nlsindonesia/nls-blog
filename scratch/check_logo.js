const fs = require('fs');

function getPngDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    if (buffer.toString('ascii', 1, 4) === 'PNG') {
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        return { width, height, type: 'PNG', size: buffer.length };
    }
    return { size: buffer.length };
}

console.log('nls-logo-300.png:', getPngDimensions('nls-logo-300.png'));
console.log('images/home/logo.jpg size:', fs.statSync('images/home/logo.jpg').size);
