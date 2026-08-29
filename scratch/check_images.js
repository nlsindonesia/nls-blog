const fs = require('fs');
const path = require('path');

const adminHtml = fs.readFileSync('nlsadmin/index.html', 'utf8');

// Find all src in adminHtml
const imgRegex = /src=["']([^"']+\.(?:png|jpg|jpeg|svg|webp|ico))["']/gi;
let match;
const foundSrcs = new Set();
while ((match = imgRegex.exec(adminHtml)) !== null) {
    foundSrcs.add(match[1]);
}

console.log('Images referenced directly in nlsadmin/index.html:');
foundSrcs.forEach(src => {
    const cleanPath = src.startsWith('/') ? src.slice(1) : src;
    const exists = fs.existsSync(cleanPath);
    console.log(`- ${src} -> Exists on disk? ${exists}`);
});

// Check default-teachers.js
const teachersJs = fs.readFileSync('pengajar/default-teachers.js', 'utf8');
const teacherImgRegex = /photo:\s*["']([^"']+)["']/g;
const teacherImgs = new Set();
while ((match = teacherImgRegex.exec(teachersJs)) !== null) {
    teacherImgs.add(match[1]);
}

console.log('\nPhotos in pengajar/default-teachers.js:');
teacherImgs.forEach(src => {
    const cleanPath = src.startsWith('/') ? src.slice(1) : src;
    const exists = fs.existsSync(cleanPath);
    console.log(`- ${src} -> Exists on disk? ${exists}`);
});

// Check default-articles.js
const articlesJs = fs.readFileSync('blog/default-articles.js', 'utf8');
const articleImgRegex = /coverImage:\s*["']([^"']+)["']/g;
const articleImgs = new Set();
while ((match = articleImgRegex.exec(articlesJs)) !== null) {
    articleImgs.add(match[1]);
}

console.log('\nCovers in blog/default-articles.js:');
articleImgs.forEach(src => {
    const cleanPath = src.startsWith('/') ? src.slice(1) : src;
    const exists = fs.existsSync(cleanPath);
    console.log(`- ${src} -> Exists on disk? ${exists}`);
});
