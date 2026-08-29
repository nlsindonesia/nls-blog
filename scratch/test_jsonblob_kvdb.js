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
                    resolve({ status: res.statusCode, headers: res.headers, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, headers: res.headers, data: body });
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

async function testBlobAndKv() {
    // 1. Test JSONBlob
    try {
        console.log('1. Testing JSONBlob (https://jsonblob.com/api/jsonBlob)...');
        const blobRes = await httpsRequest('https://jsonblob.com/api/jsonBlob', 'POST', {
            service: 'Next Level Study (NLS) Cloud DB',
            teacherApplications: [
                { id: 'app-init-1', nama: 'Test Guru', status: 'pending' }
            ]
        }, {
            'Accept': 'application/json'
        });
        console.log('JSONBlob create status:', blobRes.status);
        console.log('JSONBlob Location:', blobRes.headers.location);

        if (blobRes.headers.location) {
            const getRes = await httpsRequest(blobRes.headers.location, 'GET');
            console.log('JSONBlob read back:', getRes.status, getRes.data);

            const putRes = await httpsRequest(blobRes.headers.location, 'PUT', {
                service: 'Next Level Study (NLS) Cloud DB',
                teacherApplications: [
                    { id: 'app-init-1', nama: 'Test Guru', status: 'rejected' }
                ]
            });
            console.log('JSONBlob PUT update status:', putRes.status);

            const getUpdated = await httpsRequest(blobRes.headers.location, 'GET');
            console.log('JSONBlob updated data:', getUpdated.data);
        }
    } catch(e) {
        console.log('JSONBlob error:', e.message);
    }

    // 2. Test KVdb.io
    try {
        console.log('\n2. Testing KVdb.io (https://kvdb.io)...');
        const bucketRes = await httpsRequest('https://kvdb.io', 'POST');
        console.log('KVdb bucket create status:', bucketRes.status, bucketRes.data);
    } catch(e) {
        console.log('KVdb error:', e.message);
    }
}

testBlobAndKv();
