const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/snbt', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasNews = data.includes('Berita Terkini &amp; Wawasan SNBT / UTBK');
      const hasEngine = data.includes('snbtNewsApp');
      console.log('Live deployment verified for SNBT: News section present =', hasNews, ', Engine present =', hasEngine);
    });
  });
}, 6000);
