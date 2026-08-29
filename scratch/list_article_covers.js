const fs = require('fs');

global.window = {};
eval(fs.readFileSync('blog/default-articles.js', 'utf8'));

const articles = global.window.NLS_DEFAULT_ARTICLES;

articles.forEach(a => {
    const clean = a.coverImage ? (a.coverImage.startsWith('/') ? a.coverImage.slice(1) : a.coverImage) : null;
    const exists = clean ? fs.existsSync(clean) : false;
    console.log(`${a.id} [${a.category}]: ${a.title.slice(0, 40)}... -> cover: ${a.coverImage} (exists: ${exists})`);
});
