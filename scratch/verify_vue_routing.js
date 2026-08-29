const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/database/vue/kalender.db.js', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('kalender.db.js status:', res.statusCode, 'contains createKalenderDatabase:', data.includes('createKalenderDatabase'));
    });
  });

  https.get('https://nls-blog-plum.vercel.app/nlsadmin/vue-db', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('/nlsadmin/vue-db status:', res.statusCode, 'contains Vue DB Hub:', data.includes('NLS Vue 3 Database Explorer'));
    });
  });
}, 5000);
