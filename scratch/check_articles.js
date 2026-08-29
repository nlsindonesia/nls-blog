const fs = require('fs');
global.window = global;
const code = fs.readFileSync('blog/default-articles.js', 'utf8');
eval(code);
console.log('Total default articles:', window.NLS_DEFAULT_ARTICLES.length);
window.NLS_DEFAULT_ARTICLES.forEach((a, i) => {
  console.log(`[${i}] ${a.title} | Category: ${a.category} | Categories: ${JSON.stringify(a.categories || [])}`);
});
