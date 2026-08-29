/**
 * Test Persistent Cloud KV Storage
 */

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

async function testPantry() {
    console.log('Testing Pantry Cloud API...');
    const pantryId = '85fa0a79-22a0-43b5-bd84-c8c763a8a3ee'; // NLS Study Cloud Storage ID
    const basketUrl = `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/teacher_applications`;

    try {
        // Write data
        console.log('1. Writing test data to Pantry basket...');
        const writeRes = await httpsRequest(basketUrl, 'POST', {
            applications: [
                { id: 'app-test-1', nama: 'Test Guru Cloud', status: 'rejected' }
            ]
        });
        console.log('Write status:', writeRes.status);

        // Read data
        console.log('2. Reading data back from Pantry basket...');
        const readRes = await httpsRequest(basketUrl, 'GET');
        console.log('Read status:', readRes.status, '| Data:', readRes.data);
    } catch (e) {
        console.error('Error with Pantry:', e.message);
    }
}

testPantry();
