import https from 'https';

const CLOUD_DB_URL = 'https://extendsclass.com/api/json-storage/bin/dddcced';

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

async function inspectRemote() {
    const res = await httpsRequest(CLOUD_DB_URL, 'GET');
    console.log('Status:', res.status);
    console.log('Type of res.data:', typeof res.data);
    console.log('Keys of res.data:', Object.keys(res.data || {}));
    console.log('Full JSON:', JSON.stringify(res.data, null, 2));
}

inspectRemote();
