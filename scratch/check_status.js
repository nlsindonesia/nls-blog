const https = require('https');
https.get('https://nls-blog-plum.vercel.app/nlsadmin/vue-db.html', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
});
