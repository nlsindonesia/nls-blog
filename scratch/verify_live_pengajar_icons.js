const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/pengajar', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasShieldSvg = data.includes('M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944');
      const hasBrainSvg = data.includes('M9.663 17h4.673M12 3v1m6.364 1.636');
      const hasBriefcaseSvg = data.includes('M21 13.255A23.931 23.931 0 0112 15');
      const hasHeartSvg = data.includes('M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364');
      console.log('Live deployment verified for Pengajar Pillar Icons:', { hasShieldSvg, hasBrainSvg, hasBriefcaseSvg, hasHeartSvg });
    });
  });
}, 6000);
