const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/nlsadmin', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const kalenderIdx = data.indexOf("x-show=\"activeTab === 'kalender'\"");
      const trashKalenderIdx = data.indexOf("Trash Kalender Event");
      const beritaIdx = data.indexOf("x-show=\"activeTab === 'berita'\"");
      console.log('Live /nlsadmin verification:');
      console.log('- Kalender tab index:', kalenderIdx);
      console.log('- Trash Kalender index:', trashKalenderIdx);
      console.log('- Berita tab index:', beritaIdx);
      console.log('- Trash Kalender properly nested inside Kalender Tab before Berita Tab:', kalenderIdx < trashKalenderIdx && trashKalenderIdx < beritaIdx);
    });
  });
}, 5000);
