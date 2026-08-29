const https = require('https');
setTimeout(() => {
  https.get('https://nls-blog-plum.vercel.app/snbt', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const hasCalendar = data.includes('Kalender Kegiatan &amp; Agenda Try Out SNBT');
      const hasCalendarEngine = data.includes('snbtCalendarApp');
      const hasNewsEngine = data.includes('snbtNewsApp');
      console.log('Live deployment verified for SNBT Calendar: Calendar section =', hasCalendar, ', Calendar Engine =', hasCalendarEngine, ', News Engine =', hasNewsEngine);
    });
  });
}, 6000);
