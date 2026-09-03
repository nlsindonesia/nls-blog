const https = require('https');
https.get('https://nls-belajar.vercel.app/api/pg-lms', (res) => {
    let data = [];
    res.on('data', chunk => data.push(chunk));
    res.on('end', () => {
        const str = Buffer.concat(data).toString('utf8');
        console.log('API Contains ðŸ‘¨â€ :', str.includes('ðŸ‘¨'));
        console.log('API Contains 👨‍🏫:', str.includes('👨‍🏫'));
        const hasCorruption = /(dY[^\s<"\'`]{1,5}|\?\?+)/g.test(str);
        console.log('API Has corruption?', hasCorruption);
    });
});
