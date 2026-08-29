const fs = require('fs');

let html = fs.readFileSync('nlsadmin/index.html', 'utf8');

// 1. Close Tab Kalender properly before Tab Berita
const targetBeforeBerita = `                <!-- =========================================================================
                     TAB 2: MANAJEMEN BERITA & ARTIKEL CMS (RICH WYSIWYG + SEO TOOLS)`;

html = html.replace(targetBeforeBerita, '</div>\n\n                ' + targetBeforeBerita);

fs.writeFileSync('nlsadmin/index.html', html, 'utf8');
console.log('✅ Added closing </div> for Tab Kalender container');
