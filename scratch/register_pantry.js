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

async function registerPantry() {
    console.log('Registering Pantry for NLS...');
    try {
        const res = await httpsRequest('https://getpantry.cloud/apiv1/pantry', 'POST', {
            name: "Next Level Study Indonesia",
            email: "nls.study.cloud@gmail.com"
        });
        console.log('Pantry register status:', res.status, res.data);
    } catch(e) {
        console.log('Register failed:', e.message);
    }
}

registerPantry();
