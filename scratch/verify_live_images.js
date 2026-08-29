const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/images/blog/cover-tips-belajar.jpg', (res) => {
    console.log('Live cover-tips-belajar.jpg status:', res.statusCode, 'Content-Length:', res.headers['content-length']);
  });
  https.get('https://nls-blog-plum.vercel.app/images/blog/default.jpg', (res) => {
    console.log('Live default.jpg status:', res.statusCode, 'Content-Length:', res.headers['content-length']);
  });
}, 5000);
