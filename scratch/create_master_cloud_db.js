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

async function createMasterCloudDB() {
    console.log('Creating Master Cloud Database for Next Level Study...');
    const initialData = {
        app: 'Next Level Study (NLS) Centralized Master DB',
        lastUpdated: new Date().toISOString(),
        teacherApplications: [],
        events: [],
        articles: [],
        teachers: [],
        users: []
    };

    const res = await httpsRequest('https://extendsclass.com/api/json-storage/bin', 'POST', initialData);
    console.log('Master Cloud DB Created!');
    console.log('Bin ID:', res.data.id);
    console.log('Bin URI:', res.data.uri);

    const testRead = await httpsRequest(res.data.uri, 'GET');
    console.log('Test Read Status:', testRead.status);
    console.log('Test Read Content:', testRead.data);
}

createMasterCloudDB();
