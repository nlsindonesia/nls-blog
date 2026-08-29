const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/nlsadmin', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasHeroVerification = data.includes('.admin-hero-verification');
      const hasHeroTrash = data.includes('.admin-hero-trash');
      const hasBreadcrumbMethod = data.includes('getBreadcrumbTitle()');
      console.log('Live /nlsadmin verification:');
      console.log('- Hero verification CSS present:', hasHeroVerification);
      console.log('- Hero trash CSS present:', hasHeroTrash);
      console.log('- Dynamic breadcrumb method present:', hasBreadcrumbMethod);
    });
  });
}, 5000);
