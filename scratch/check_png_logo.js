const fs = require('fs');
const buffer = fs.readFileSync('images/home/logo.jpg');
const width = buffer.readUInt32BE(16);
const height = buffer.readUInt32BE(20);
console.log('images/home/logo.jpg actual dimensions:', { width, height });
