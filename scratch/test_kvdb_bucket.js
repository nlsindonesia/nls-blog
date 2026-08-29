const https = require('https');

function createKvdbBucket() {
    return new Promise((resolve, reject) => {
        const postData = 'email=nextlevelstudyindonesia%40gmail.com';
        const options = {
            hostname: 'kvdb.io',
            port: 443,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: body.trim() }));
        });

        req.on('error', err => reject(err));
        req.write(postData);
        req.end();
    });
}

function kvdbRequest(bucketId, key, method, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'kvdb.io',
            port: 443,
            path: `/${bucketId}/${key}`,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch(e) {
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

async function testKV() {
    console.log('1. Creating KVdb Bucket...');
    const bucket = await createKvdbBucket();
    console.log('Bucket ID:', bucket);

    if (bucket.status === 200 || bucket.status === 201) {
        const bucketId = bucket.data;
        console.log('\n2. Testing write to key "teacher_applications"...');
        const writeRes = await kvdbRequest(bucketId, 'teacher_applications', 'POST', [
            { id: 'app-test-1', nama: 'Test Calon Guru', status: 'rejected' }
        ]);
        console.log('Write status:', writeRes.status, writeRes.data);

        console.log('\n3. Testing read back from key "teacher_applications"...');
        const readRes = await kvdbRequest(bucketId, 'teacher_applications', 'GET');
        console.log('Read status:', readRes.status, readRes.data);
    }
}

testKV();
