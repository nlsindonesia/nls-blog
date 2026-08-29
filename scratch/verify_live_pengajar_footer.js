const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/pengajar', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasSeno = data.includes('08170100788 (Seno)');
      const hasFasya = data.includes('085810464960 (Fasya)');
      const hasOlla = data.includes('081286096600 (Olla)');
      const hasNlsSharePage = data.includes('function nlsSharePage()');
      const hasCopyright = data.includes('2026 Next Level Study : Era Baru Pendidikan');
      console.log('Live deployment verified for Pengajar Footer Alignment:', { hasSeno, hasFasya, hasOlla, hasNlsSharePage, hasCopyright });
    });
  });
}, 6000);
