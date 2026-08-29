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

async function debugPut() {
    const url = 'https://extendsclass.com/api/json-storage/bin/dddcced';
    console.log('Testing PUT to', url);
    const putRes = await httpsRequest(url, 'PUT', {
        app: 'NLS',
        teacherApplications: [{ id: 'app-1', nama: 'Y A', status: 'rejected' }]
    });
    console.log('PUT response status:', putRes.status, putRes.data);

    console.log('Testing GET back from', url);
    const getRes = await httpsRequest(url, 'GET');
    console.log('GET response:', getRes.status, getRes.data);
}

debugPut();
