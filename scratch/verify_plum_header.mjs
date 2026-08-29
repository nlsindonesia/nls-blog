import https from 'https';

function getHtml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, html: data }));
        }).on('error', reject);
    });
}

async function run() {
    const homeHtml = await getHtml('https://nls-blog-plum.vercel.app/?_t=' + Date.now());
    console.log('Homepage status:', homeHtml.status);
    console.log('Homepage header contains Masuk button:', homeHtml.html.includes('>Masuk<') || homeHtml.html.includes('>Masuk Akun Siswa<'));
    console.log('Homepage header Yuk Belajar points to nls-belajar:', homeHtml.html.includes('href="https://nls-belajar.vercel.app"'));
}

run();
