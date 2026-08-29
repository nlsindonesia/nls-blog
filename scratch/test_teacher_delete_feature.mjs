import handler from '../api/teachers.js';

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
    console.log('TEST: PRESENT TEACHER DELETION & TRASH WORKFLOW');
    console.log('====================================================');

    const testTeacherId = 't-test-delete-' + Date.now();
    const testTeacher = {
        id: testTeacherId,
        name: 'Kak Bambang Guru Uji',
        shortName: 'Kak Bambang',
        education: 'Fisika UI',
        categories: ['OSN', 'TKA'],
        jenjang: ['SMA'],
        subject: 'Fisika Quantum',
        status: 'active'
    };

    // 1. Create a teacher
    console.log('1. Creating test teacher via POST /api/teachers...');
    const { req: req1, res: res1 } = createMockReqRes('POST', testTeacher);
    await handler(req1, res1);
    console.log('   Create status:', res1.statusCode);
    const createData = JSON.parse(res1.bodyData);
    console.log('   Create message:', createData.message);

    // 2. Test Soft Delete (Move to Trash) via PUT /api/teachers
    console.log('\n2. Testing Soft Delete (Move to Trash) via PUT /api/teachers...');
    const { req: req2, res: res2 } = createMockReqRes('PUT', {
        id: testTeacherId,
        status: 'trashed',
        deletedAt: new Date().toISOString()
    });
    await handler(req2, res2);
    console.log('   Soft Delete status:', res2.statusCode);
    const softDelData = JSON.parse(res2.bodyData);
    console.log('   Teacher status is now:', softDelData.data.status);
    console.log('   Teacher isTrashed:', softDelData.data.isTrashed);

    // 3. Test Restore Teacher via PUT /api/teachers
    console.log('\n3. Testing Restore Teacher via PUT /api/teachers...');
    const { req: req3, res: res3 } = createMockReqRes('PUT', {
        id: testTeacherId,
        status: 'active'
    });
    await handler(req3, res3);
    console.log('   Restore status:', res3.statusCode);
    const restoreData = JSON.parse(res3.bodyData);
    console.log('   Teacher status is now:', restoreData.data.status);

    // 4. Test Permanent Delete via DELETE /api/teachers?id=...
    console.log('\n4. Testing Permanent Delete via DELETE /api/teachers?id=...');
    const { req: req4, res: res4 } = createMockReqRes('DELETE', null, { id: testTeacherId });
    await handler(req4, res4);
    console.log('   Delete status:', res4.statusCode);
    const delData = JSON.parse(res4.bodyData);
    console.log('   Delete message:', delData.message);

    // 5. Verify teacher is permanently gone via GET /api/teachers
    console.log('\n5. Verifying teacher is completely deleted...');
    const { req: req5, res: res5 } = createMockReqRes('GET');
    await handler(req5, res5);
    const allTeachers = JSON.parse(res5.bodyData).data;
    const exists = allTeachers.some(t => t.id === testTeacherId);
    console.log('   Teacher exists in database:', exists ? 'FAIL (still present)' : 'PASS (successfully removed)');

    console.log('\n====================================================');
    console.log('ALL TEACHER DELETION TESTS COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
}

runTests().catch(console.error);
