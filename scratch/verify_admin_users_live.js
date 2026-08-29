const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/nlsadmin', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasIIFE = data.includes('users: (function()');
      const hasMethods = data.includes('toggleUserDropdown()');
      console.log('Live /nlsadmin verification for Users state:');
      console.log('- Users IIFE initialization present:', hasIIFE);
      console.log('- User methods bound properly:', hasMethods);
    });
  });
}, 5000);
