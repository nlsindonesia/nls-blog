import usersHandler from '../api/users.js';
import { getCloudStore } from '../api/cloud-db.js';

function createMockRes() {
    return {
        headers: {},
        statusCode: 200,
        body: null,
        setHeader(k, v) { this.headers[k] = v; return this; },
        status(code) { this.statusCode = code; return this; },
        json(data) { this.body = data; return this; },
        end() { return this; }
    };
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

console.log('====================================================');
console.log('TEST: REGISTRATION TO CLOUD DATABASE /api/users');
console.log('====================================================');

const testStudentEmail = `test.student.${Date.now()}@gmail.com`;
const testStudentNisn = '0089' + Math.floor(100000 + Math.random() * 900000);

console.log('1. Submitting New Account Registration...');
const regReq = {
    method: 'POST',
    body: {
        action: 'register',
        name: 'Budi Pratama Siswa Baru',
        email: testStudentEmail,
        phone: '081299887766',
        school: 'SMA Negeri 5 Surabaya',
        nisn: testStudentNisn,
        level: 'SMA',
        grade: '11 SMA - MIPA',
        targetProgram: 'Persiapan OSN Matematika & SNBT 2027',
        password: '@PasswordBaru123$'
    }
};

const regRes = createMockRes();
await usersHandler(regReq, regRes);

console.log('   Registration Status:', regRes.statusCode);
console.log('   Registration Message:', regRes.body.message);
console.log('   Registered User ID:', regRes.body.user && regRes.body.user.id);

if (regRes.statusCode === 201 && regRes.body.success) {
    console.log('   ✓ Registration API call SUCCESS!');
} else {
    throw new Error('Registration failed: ' + JSON.stringify(regRes.body));
}

// Allow 500ms for cloud bin sync
await sleep(500);

console.log('\n2. Verifying user existence in Cloud Database...');
const cloudStore = await getCloudStore();
const foundInCloud = cloudStore.users.find(u => (u.email || '').toLowerCase() === testStudentEmail);

if (foundInCloud) {
    console.log('   ✓ User successfully verified in Cloud Database!');
    console.log('   Name:', foundInCloud.name);
    console.log('   Email:', foundInCloud.email);
    console.log('   Role:', foundInCloud.role, `(${foundInCloud.roleLabel})`);
    console.log('   Status:', foundInCloud.status);
} else {
    throw new Error('User not found in Cloud Database!');
}

console.log('\n3. Testing Login with newly registered credentials against /api/users...');
const loginReq = {
    method: 'POST',
    body: {
        action: 'login',
        identifier: testStudentEmail,
        password: '@PasswordBaru123$'
    }
};

const loginRes = createMockRes();
await usersHandler(loginReq, loginRes);

console.log('   Login Status:', loginRes.statusCode);
console.log('   Login Success:', loginRes.body.success);
console.log('   Logged In User:', loginRes.body.user && loginRes.body.user.name);

if (loginRes.statusCode === 200 && loginRes.body.success) {
    console.log('   ✓ Login with new registered account verified SUCCESS!');
} else {
    throw new Error('Login failed: ' + JSON.stringify(loginRes.body));
}

console.log('\n====================================================');
console.log('ALL REGISTRATION TO CLOUD DB TESTS PASSED!');
console.log('====================================================');
process.exit(0);
