import https from 'https';

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
        lastLoginAt: '2026-08-29T21:00:00.000Z',
        lastLogin: '2026-08-29 21:00',
        permissions: ['all']
    }
];

function createFreshBin() {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            items: superAdminOnly,
            lastUpdated: new Date().toISOString()
        });

        const options = {
            hostname: 'extendsclass.com',
            port: 443,
            path: '/api/json-storage/bin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('Status Code:', res.statusCode);
                console.log('Response:', data);
                resolve(JSON.parse(data));
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

createFreshBin();
