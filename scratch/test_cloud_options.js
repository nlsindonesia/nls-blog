const https = require('https');

function httpsRequest(url, method, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const options = {
            hostname: u.hostname,
            port: u.port || 443,
            path: u.pathname + u.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', err => reject(err));
        if (data) {
            req.write(typeof data === 'string' ? data : JSON.stringify(data));
        }
        req.end();
    });
}

async function testOptions() {
    // 1. Test npoint.io
    try {
        console.log('1. Testing api.npoint.io...');
        const npRes = await httpsRequest('https://api.npoint.io/docs', 'GET');
        console.log('npoint status:', npRes.status);
    } catch(e) {
        console.log('npoint failed:', e.message);
    }

    // 2. Test jsonbin.io
    try {
        console.log('2. Testing jsonbin.io...');
        const jbRes = await httpsRequest('https://api.jsonbin.io/v3/b', 'POST', { test: 'nls', timestamp: Date.now() }, {
            'X-Master-Key': '$2a$10$7Z1g8yJ1f1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o', // public test key
            'X-Bin-Private': 'false'
        });
        console.log('jsonbin status:', jbRes.status, jbRes.data);
    } catch(e) {
        console.log('jsonbin failed:', e.message);
    }

    // 3. Test Firebase Realtime DB
    try {
        console.log('3. Testing Firebase REST...');
        const fbRes = await httpsRequest('https://next-level-study-default-rtdb.asia-southeast1.firebasedatabase.app/test.json', 'PUT', { nls: 'online', time: Date.now() });
        console.log('firebase status:', fbRes.status, fbRes.data);
    } catch(e) {
        console.log('firebase failed:', e.message);
    }
}

testOptions();
