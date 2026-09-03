const https = require('https');
https.get('https://nls-belajar.vercel.app/belajar/index.html', (res) => {
    let data = [];
    res.on('data', chunk => data.push(chunk));
    res.on('end', () => {
        const str = Buffer.concat(data).toString('utf8');
        console.log('Contains ðŸ‘¨â€ :', str.includes('ðŸ‘¨'));
        console.log('Contains 👨‍🏫:', str.includes('👨‍🏫'));
        console.log('Contains window.MathJax.typesetPromise():', str.includes('window.MathJax.typesetPromise()'));
        
        // Find where the mentor string is
        const mentorIndex = str.indexOf('Mentor:');
        if (mentorIndex !== -1) {
            console.log('Around Mentor:', str.substring(mentorIndex - 100, mentorIndex + 100));
        }
    });
});
