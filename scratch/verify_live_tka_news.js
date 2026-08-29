const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/tka', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasNews = data.includes('Berita Terkini &amp; Wawasan TKA');
      const hasEngine = data.includes('tkaNewsApp');
      console.log('Live deployment verified: News section present =', hasNews, ', Engine present =', hasEngine);
    });
  });
}, 6000);
