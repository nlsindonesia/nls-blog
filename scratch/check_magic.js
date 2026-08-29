const fs = require('fs');
const buf = fs.readFileSync('images/home/logo.jpg');
console.log('Header magic bytes (hex):', buf.slice(0, 16).toString('hex'));
console.log('Header text:', buf.slice(0, 16).toString('ascii'));
