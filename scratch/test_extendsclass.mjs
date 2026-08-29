import https from 'https';

const url = 'https://extendsclass.com/api/json-storage/bin/eaedfeb';

function makeReq(method, payload = null, headers = {}) {
    return new Promise((resolve) => {
        const u = new URL(url);
        const options = {
            hostname: u.hostname,
            port: 443,
            path: u.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
                ...headers
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`[${method}] Status:`, res.statusCode);
                console.log(`[${method}] Response:`, data);
                resolve({ status: res.statusCode, body: data });
            });
        });
        if (payload) req.write(payload);
        req.end();
    });
}

async function test() {
    console.log('Testing PUT with full replace:');
    const fullJson = JSON.stringify({
        items: [
            {
                id: 'usr-admin-1',
                name: 'Super Administrator NLS',
                username: 'nlsindonesia',
                email: 'admin@next-level-study.com',
                phone: '085163070002',
                role: 'super_admin',
                roleLabel: 'Super Admin',
                role_id: 'super_admin',
                status: 'Active',
                password: '@Maman123$'
            }
        ]
    });
    await makeReq('PUT', fullJson);
    console.log('Testing GET:');
    await makeReq('GET');
}

test();
