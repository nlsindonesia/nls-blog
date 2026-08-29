const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/nlsadmin/vue-db.html', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const isSuccess = data.includes('NLS Vue 3 Database Explorer') && data.includes('kalender.db.js');
      console.log('Live deployment status for Vue DB Hub:', isSuccess ? 'ACTIVE & ONLINE (200 OK)' : 'Pending...');
    });
  });
}, 6000);
