const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/nlsadmin/vue-db', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasDuplicateBerita = (data.match(/Menu 2/g) || []).length;
      const hasDuplicatePengajar = (data.match(/Menu 3/g) || []).length;
      const hasUsersTab = data.includes("v-show=\"activeTab === 'users'\"");
      console.log('Live /nlsadmin/vue-db verification:');
      console.log('- "Menu 2" occurrences (should be exactly 1):', hasDuplicateBerita);
      console.log('- "Menu 3" occurrences (should be exactly 1):', hasDuplicatePengajar);
      console.log('- Has Users Database Tab Explorer:', hasUsersTab);
    });
  });
}, 5000);
