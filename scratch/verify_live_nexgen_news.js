const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/nexgen', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasSection = data.includes('Berita Terkini &amp; Wawasan Bimbel NexGen');
      const hasEngine = data.includes('nexgenNewsApp');
      const hasArticles = data.includes('/blog/default-articles.js');
      console.log('Live deployment verified on Nexgen page:', { hasSection, hasEngine, hasArticles });
    });
  });
}, 6000);
