import https from 'https';

const url = 'https://extendsclass.com/api/json-storage/bin/eaedfeb';

const superAdminOnly = [
    {
        id: 'usr-admin-1',
        name: 'Super Administrator NLS',
        username: 'nlsindonesia',
        email: 'admin@next-level-study.com',
        phone: '085163070002',
        nisn: 'NIP: 198501012010011001',
        school: 'Next Level Study Headquarter',
        level: 'Staff',
        grade: 'Pimpinan & Tim IT',
        targetProgram: 'Manajemen Sistem NLS',
        role: 'super_admin',
        roleLabel: 'Super Admin',
        role_id: 'super_admin',
        status: 'Active',
        department: 'Operasional & Teknologi',
        avatar: '/nls-logo-300.png',
        password: '@Maman123$',
        createdAt: '2026-01-01T08:00:00.000Z',
        lastLoginAt: new Date().toISOString(),
        lastLogin: '2026-08-30 01:00',
        permissions: ['all']
    }
];

function saveBin(items) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            items: items,
            lastUpdated: new Date().toISOString()
        });

        const u = new URL(url);
        const options = {
            hostname: u.hostname,
            port: 443,
            path: u.pathname,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('PUT Status Code:', res.statusCode);
                console.log('PUT Response:', data);
                resolve(data);
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

function verifyBin() {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const parsed = JSON.parse(data);
                console.log('\nVerification GET Status Code:', res.statusCode);
                console.log(`Total users remaining: ${parsed.items.length}`);
                parsed.items.forEach(u => console.log(`- [${u.id}] ${u.name} (@${u.username}) | ${u.roleLabel || u.role}`));
                resolve(parsed);
            });
        });
    });
}

async function run() {
    console.log('1. Overwriting Cloud Bin with Super Admin only...');
    await saveBin(superAdminOnly);
    console.log('\n2. Verifying Cloud Bin contents...');
    await verifyBin();
}

run().catch(console.error);
