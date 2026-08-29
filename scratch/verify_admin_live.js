const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/nlsadmin', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasUserTab = data.includes("x-show=\"activeTab === 'users'\"");
      const hasAddUser = data.includes("userView === 'add'");
      const hasPresentUser = data.includes("userView === 'present'");
      const hasTrashUser = data.includes("userView === 'trash'");
      console.log('Live /nlsadmin verification:');
      console.log('- Has users tab inside main:', hasUserTab);
      console.log('- Has Add User form view:', hasAddUser);
      console.log('- Has Present User view:', hasPresentUser);
      console.log('- Has Trash User view:', hasTrashUser);
    });
  });
}, 5000);
