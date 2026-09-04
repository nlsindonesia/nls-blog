// ==============================================================================
// Automated Test: Full Decoupling from Postgres & Cloud DB Migration Verification
// ==============================================================================

import authHandler from '../api/pg-auth.js';
import lmsHandler from '../api/pg-lms.js';
import { getCloudStore } from '../api/cloud-db.js';
import { generateVpsSqlDump } from '../api/vps-exporter.js';

function mockReqRes(method, body = {}, query = {}) {
    let statusCode = 200;
    let responseData = null;
    let headers = {};

    const req = {
        method,
        body,
        query,
        url: '/test'
    };

    const res = {
        setHeader: (k, v) => { headers[k] = v; },
        status: (code) => {
            statusCode = code;
            return res;
        },
        json: (data) => {
            responseData = data;
            return res;
        },
        send: (data) => {
            responseData = data;
            return res;
        },
        end: () => res
    };

    return { req, res, getStatus: () => statusCode, getData: () => responseData };
}

async function runTests() {
    console.log('\n======================================================');
    console.log('🚀 TESTING FULL CLOUD DB PERSISTENCE & POSTGRES DECOUPLING');
    console.log('======================================================\n');

    let passed = 0;
    let failed = 0;

    function assert(condition, message) {
        if (condition) {
            console.log(`  ✅ PASS: ${message}`);
            passed++;
        } else {
            console.error(`  ❌ FAIL: ${message}`);
            failed++;
        }
    }

    // 1. TEST AUTH: Login existing user (maman)
    console.log('--- 1. Testing Login Existing User ---');
    {
        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'login',
            identifier: 'maman@gmail.com',
            password: '@Maman123$'
        });
        await authHandler(req, res);
        const data = getData();
        assert(getStatus() === 200, 'Login status 200');
        assert(data && data.success === true, 'Login response success is true');
        assert(data && data.user && data.user.email === 'maman@gmail.com', 'User email matches maman@gmail.com');
    }

    // 2. TEST AUTH: Register New Student
    console.log('\n--- 2. Testing Register New Student ---');
    const testEmail = `test_student_${Date.now()}@nls.edu`;
    const testUsername = `testuser_${Date.now()}`;
    let registeredUserId = null;
    {
        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'register',
            name: 'Budi Santoso Uji Coba',
            username: testUsername,
            email: testEmail,
            password: 'Password123!',
            phone: '081234567890',
            school: 'SMAN 1 Jakarta',
            level: 'SMA',
            targetProgram: 'SNBT & UTBK'
        });
        await authHandler(req, res);
        const data = getData();
        assert(getStatus() === 201, 'Registration status 201 Created');
        assert(data && data.success === true, 'Registration success is true');
        assert(data && data.user && data.user.email === testEmail, 'Registered user returned with correct email');
        registeredUserId = data.user.id;
    }

    // 3. TEST AUTH: Login with the Newly Registered User
    console.log('\n--- 3. Testing Login Newly Registered User ---');
    {
        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'login',
            identifier: testEmail,
            password: 'Password123!'
        });
        await authHandler(req, res);
        const data = getData();
        assert(getStatus() === 200, 'Login status 200');
        assert(data && data.user && data.user.name === 'Budi Santoso Uji Coba', 'Login returned correct name');
    }

    // 4. TEST AUTH: Update Profile
    console.log('\n--- 4. Testing Profile Update ---');
    {
        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'update_profile',
            id: registeredUserId,
            email: testEmail,
            phone: '089999888877',
            school: 'SMA Negeri 8 Jakarta',
            level: 'SMA',
            targetProgram: 'Kedokteran UI'
        });
        await authHandler(req, res);
        const data = getData();
        assert(getStatus() === 200, 'Update profile status 200');
        assert(data && data.user && data.user.school === 'SMA Negeri 8 Jakarta', 'Profile school updated');
    }

    // 5. TEST AUTH: Search Schools (Dapodik Integration)
    console.log('\n--- 5. Testing Search Schools ---');
    {
        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'search_schools',
            query: 'sman 1 jakarta'
        });
        await authHandler(req, res);
        const data = getData();
        assert(getStatus() === 200, 'Search schools status 200');
        assert(data && Array.isArray(data.data) && data.data.length > 0, 'Returned schools from national database');
        if (data && data.data && data.data[0]) {
            console.log(`     -> Sample result: ${data.data[0].name} (${data.data[0].city})`);
        }
    }

    // 6. TEST LMS: Get Courses Catalog
    console.log('\n--- 6. Testing LMS Get Courses ---');
    {
        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'get_courses'
        });
        await lmsHandler(req, res);
        const data = getData();
        assert(getStatus() === 200, 'Get courses status 200');
        assert(data && Array.isArray(data.data) && data.data.length > 0, `Returned ${data.data.length} active courses`);
    }

    // 7. TEST LMS: Admin Save Course
    console.log('\n--- 7. Testing Admin Save Course (LMS Builder) ---');
    const testCourseId = `c-test-${Date.now()}`;
    {
        const testCourse = {
            id: testCourseId,
            category: 'School',
            level: 'SMA',
            subject: 'Fisika Kuantum',
            grade: 'Kelas 12',
            title: 'Fisika Kuantum & Relativitas Khusus',
            description: 'Eksplorasi foton, efek fotolistrik, dan mekanika gelombang.',
            status: 'published',
            babs: [
                {
                    id: 'bab-1',
                    title: 'Bab 1: Efek Fotolistrik',
                    modules: [
                        {
                            id: 'mod-1',
                            title: 'Materi Teori Planck',
                            type: 'materi',
                            content: '<p>Konstanta Planck h = 6.626 x 10^-34 J.s</p>'
                        },
                        {
                            id: 'mod-2',
                            title: 'Kuis Evaluasi Foton',
                            type: 'kuis',
                            questions: [
                                {
                                    id: 'q-1',
                                    type: 'pilihan_ganda',
                                    question: 'Berapakah energi foton jika frekuensinya f?',
                                    options: ['E = h.f', 'E = h/f', 'E = m.c', 'E = 1/2 m.v^2'],
                                    correctAnswer: 'E = h.f'
                                }
                            ]
                        }
                    ]
                }
            ],
            updated_at: new Date().toISOString()
        };

        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'admin_save_course',
            course: testCourse
        });
        await lmsHandler(req, res);
        const data = getData();
        assert(getStatus() === 200, 'Admin save course status 200');
        assert(data && data.success === true, 'Admin save course success is true');
    }

    // 8. TEST LMS: Enroll Course
    console.log('\n--- 8. Testing Enroll Student ---');
    {
        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'enroll',
            userId: registeredUserId,
            courseId: testCourseId
        });
        await lmsHandler(req, res);
        const data = getData();
        assert(getStatus() === 200, 'Enroll status 200');
        assert(data && data.success === true, 'Enroll success is true');
    }

    // 9. TEST LMS: Save & Get Quiz Progress (Autosave / Resume)
    console.log('\n--- 9. Testing Quiz Autosave & Resume Progress ---');
    {
        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'save_quiz_progress',
            userId: registeredUserId,
            courseId: testCourseId,
            moduleId: 'mod-2',
            elapsedSeconds: 45,
            answers: { 'q-1': 'E = h.f' }
        });
        await lmsHandler(req, res);
        const data = getData();
        assert(getStatus() === 200, 'Save quiz progress status 200');
    }
    {
        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'get_quiz_progress',
            userId: registeredUserId,
            courseId: testCourseId,
            moduleId: 'mod-2'
        });
        await lmsHandler(req, res);
        const data = getData();
        assert(getStatus() === 200, 'Get quiz progress status 200');
        assert(data && data.attempt && data.attempt.elapsed_seconds === 45, 'Retrieved attempt with matching elapsedSeconds');
    }

    // 10. TEST LMS: Submit Quiz
    console.log('\n--- 10. Testing Submit Quiz ---');
    let testSubmissionId = null;
    {
        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'submit_quiz',
            userId: registeredUserId,
            courseId: testCourseId,
            moduleIndex: 'mod-2',
            moduleId: 'mod-2',
            score: 100,
            answers: { 'q-1': 'E = h.f' }
        });
        await lmsHandler(req, res);
        const data = getData();
        assert(getStatus() === 200, 'Submit quiz status 200');
        assert(data && data.id, 'Received submission id');
        testSubmissionId = data.id;
    }

    // 11. TEST LMS: Admin Get Quiz Results & Grade
    console.log('\n--- 11. Testing Admin Review & Grading ---');
    {
        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'admin_get_quiz_results'
        });
        await lmsHandler(req, res);
        const data = getData();
        assert(getStatus() === 200, 'Admin get quiz results status 200');
        assert(data && Array.isArray(data.data) && data.data.some(r => r.id === testSubmissionId), 'Found submitted quiz in admin results list');
    }
    {
        const { req, res, getStatus, getData } = mockReqRes('POST', {
            action: 'admin_update_quiz_result',
            resultId: testSubmissionId,
            newScore: 95
        });
        await lmsHandler(req, res);
        const data = getData();
        assert(getStatus() === 200, 'Admin update quiz result status 200');
        assert(data && data.success === true, 'Admin update success is true');
    }

    // 12. TEST EXPORT: VPS Migration SQL Generator
    console.log('\n--- 12. Testing VPS Migration SQL Dump ---');
    {
        const sql = await generateVpsSqlDump();
        assert(typeof sql === 'string' && sql.length > 5000, 'Generated comprehensive SQL dump');
        assert(sql.includes('CREATE TABLE IF NOT EXISTS users'), 'SQL dump contains users table');
        assert(sql.includes('CREATE TABLE IF NOT EXISTS lms_courses'), 'SQL dump contains lms_courses table');
        assert(sql.includes('CREATE TABLE IF NOT EXISTS lms_quiz_results'), 'SQL dump contains lms_quiz_results table');
        assert(sql.includes('CREATE TABLE IF NOT EXISTS articles'), 'SQL dump contains articles table');
        assert(sql.includes('CREATE TABLE IF NOT EXISTS events'), 'SQL dump contains events table');
        assert(sql.includes('CREATE TABLE IF NOT EXISTS teachers'), 'SQL dump contains teachers table');
        console.log(`     -> Total SQL dump length: ${(sql.length / 1024).toFixed(2)} KB`);
    }

    console.log('\n======================================================');
    console.log(`🏁 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');

    if (failed > 0) {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error('Test execution fatal error:', err);
    process.exit(1);
});
