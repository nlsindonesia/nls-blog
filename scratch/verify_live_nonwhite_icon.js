const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/pengajar', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasEmeraldIcon = data.includes('text-emerald-800');
      const hasEmeraldContainer = data.includes('bg-emerald-100');
      const hasNoWhiteIcon = !data.includes('svg class="w-7 h-7 text-white"');
      console.log('Live deployment verified for Non-White Icon:', { hasEmeraldIcon, hasEmeraldContainer, hasNoWhiteIcon });
    });
  });
}, 6000);
