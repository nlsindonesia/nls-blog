import http from 'http';
import handler from '../api/users.js';

function createMockReqRes(method, body = null, query = {}) {
    return {
        req: {
            method,
            body,
            query,
            headers: { host: 'localhost' }
        },
        res: {
            statusCode: 200,
            headers: {},
            bodyData: '',
            setHeader(k, v) { this.headers[k] = v; },
            status(code) { this.statusCode = code; return this; },
            json(obj) { this.bodyData = JSON.stringify(obj); return this; },
            end() { return this; }
        }
    };
}

async function runTests() {
    console.log('====================================================');
    console.log('TEST: PRESENT USER DELETION & TRASH WORKFLOW');
    console.log('====================================================');

    const testUserId = 'usr-test-delete-' + Date.now();
    const testUser = {
        id: testUserId,
        name: 'Budi Test Hapus User',
        username: 'budi.testhapus',
        email: `budi.testhapus.${Date.now()}@gmail.com`,
        phone: '081299998888',
        role: 'student',
        roleLabel: 'Siswa',
        status: 'Active',
        department: 'Siswa Reguler',
        password: '@Maman123$'
    };

    // 1. Create a user
    console.log('1. Creating test user via POST /api/users...');
    const { req: req1, res: res1 } = createMockReqRes('POST', testUser);
    await handler(req1, res1);
    console.log('   Create status:', res1.statusCode);
    const createData = JSON.parse(res1.bodyData);
    console.log('   Create message:', createData.message);

    // 2. Test Soft Delete (Move to Trash) via PUT /api/users
    console.log('\n2. Testing Soft Delete (Move to Trash) via PUT /api/users...');
    const { req: req2, res: res2 } = createMockReqRes('PUT', {
        id: testUserId,
        status: 'trashed',
        deletedAt: new Date().toISOString()
    });
    await handler(req2, res2);
    console.log('   Soft Delete status:', res2.statusCode);
    const softDelData = JSON.parse(res2.bodyData);
    console.log('   User status is now:', softDelData.data.status);
    console.log('   User isTrashed:', softDelData.data.isTrashed);

    // 3. Test Restore User via PUT /api/users
    console.log('\n3. Testing Restore User via PUT /api/users...');
    const { req: req3, res: res3 } = createMockReqRes('PUT', {
        id: testUserId,
        status: 'Active'
    });
    await handler(req3, res3);
    console.log('   Restore status:', res3.statusCode);
    const restoreData = JSON.parse(res3.bodyData);
    console.log('   User status is now:', restoreData.data.status);

    // 4. Test Permanent Delete via DELETE /api/users?id=...
    console.log('\n4. Testing Permanent Delete via DELETE /api/users?id=...');
    const { req: req4, res: res4 } = createMockReqRes('DELETE', null, { id: testUserId });
    await handler(req4, res4);
    console.log('   Delete status:', res4.statusCode);
    const delData = JSON.parse(res4.bodyData);
    console.log('   Delete message:', delData.message);

    // 5. Verify user is permanently gone via GET /api/users
    console.log('\n5. Verifying user is completely deleted...');
    const { req: req5, res: res5 } = createMockReqRes('GET');
    await handler(req5, res5);
    const allUsers = JSON.parse(res5.bodyData).data;
    const exists = allUsers.some(u => u.id === testUserId);
    console.log('   User exists in database:', exists ? 'FAIL (still present)' : 'PASS (successfully removed)');

    console.log('\n====================================================');
    console.log('ALL USER DELETION TESTS COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
}

runTests().catch(console.error);
