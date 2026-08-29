const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/tentang', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasQuote = data.includes('Berada dalam kondisi kurang mampu secara ekonomi itu sakit, namun lebih menyakitkan ketika tidak diberikan kesempatan belajar berkualitas.');
      const hasAuthor = data.includes('- HANDAKA LUMU');
      console.log('Live deployment verified for Tentang Quote:', { hasQuote, hasAuthor });
    });
  });
}, 6000);
