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

async function testServices() {
    // 1. Test ExtendsClass JSON storage
    try {
        console.log('1. Testing ExtendsClass JSON storage (https://extendsclass.com/api/json-storage/bin)...');
        const res = await httpsRequest('https://extendsclass.com/api/json-storage/bin', 'POST', {
            service: 'NLS Cloud DB',
            teacherApplications: [{ id: 'app-1', nama: 'Test', status: 'rejected' }]
        });
        console.log('ExtendsClass status:', res.status, res.data);
        if (res.data && res.data.id) {
            const getRes = await httpsRequest(`https://extendsclass.com/api/json-storage/bin/${res.data.id}`, 'GET');
            console.log('ExtendsClass read back:', getRes.status, getRes.data);
            const patchRes = await httpsRequest(`https://extendsclass.com/api/json-storage/bin/${res.data.id}`, 'PUT', {
                service: 'NLS Cloud DB',
                teacherApplications: [{ id: 'app-1', nama: 'Test', status: 'accepted' }]
            });
            console.log('ExtendsClass PUT update:', patchRes.status, patchRes.data);
        }
    } catch(e) {
        console.log('ExtendsClass error:', e.message);
    }

    // 2. Test myjson.online
    try {
        console.log('\n2. Testing myjson.online...');
        const res2 = await httpsRequest('https://api.myjson.online/v1/records', 'POST', {
            jsonData: JSON.stringify({ test: 'nls' }),
            name: 'nls-database'
        });
        console.log('myjson status:', res2.status, res2.data);
    } catch(e) {
        console.log('myjson error:', e.message);
    }
}

testServices();
