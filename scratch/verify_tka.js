const https = require('https');
https.get('https://nls-blog-plum.vercel.app/tka', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const hasBlack = data.includes('text-black') && data.includes('Lihat Panduan');
    console.log('Verified text is black on live:', hasBlack);
  });
});
