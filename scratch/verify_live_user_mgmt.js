const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/database/vue/users.db.js', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('users.db.js live status:', res.statusCode, 'contains createUsersDatabase:', data.includes('createUsersDatabase'));
    });
  });

  https.get('https://nls-blog-plum.vercel.app/nlsadmin', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('/nlsadmin live status:', res.statusCode, 'contains User Management:', data.includes('User Management'));
    });
  });
}, 5000);
