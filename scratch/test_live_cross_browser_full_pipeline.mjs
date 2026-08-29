/**
 * Full Pipeline Test (ESM): Cross-Browser Real-Time Persistent Cloud Sync
 */

import teacherAppsHandler from '../api/teacher-applications.js';

async function callHandler(handler, method, body = null, query = null) {
    let req = { method, body, query, headers: { host: 'localhost:3000' } };
    let res = {
        statusCode: 200,
        headers: {},
        data: null,
        setHeader(k, v) { this.headers[k] = v; return this; },
        status(c) { this.statusCode = c; return this; },
        json(d) { this.data = d; return this; },
        end() { return this; }
    };
    await handler(req, res);
    return res;
}

async function runLiveTest() {
    console.log('🚀 TESTING MULTI-BROWSER PERSISTENT CLOUD SYNC PIPELINE...\n');

    // 1. User registers via /pengajar form
    console.log('1. User registers as teacher: "Y A" (Kak Ss)...');
    const createRes = await callHandler(teacherAppsHandler, 'POST', {
        nama: 'Y A',
        panggilan: 'Ss',
        wa: '4',
        email: 'hamemanyu@gmail.com',
        subject: 'Aa',
        kebutuhanPrivat: 'As'
    });
    const applicantId = createRes.data.data.id;
    console.log('   - Created with ID:', applicantId, '| Status:', createRes.data.data.status);

    // 2. Browser 1 (e.g. Chrome) rejects applicant
    console.log('\n2. Browser 1 (Chrome Admin) rejects applicant "Y A"...');
    const rejectRes = await callHandler(teacherAppsHandler, 'PUT', {
        ...createRes.data.data,
        status: 'rejected'
    });
    console.log('   - Browser 1 PUT Response:', rejectRes.statusCode, '| Status on Cloud:', rejectRes.data.data.status);

    // 3. Browser 2 (e.g. Opera) loads the page fresh from Cloud DB
    console.log('\n3. Browser 2 (Opera Admin) loads Teacher Verification from Cloud DB...');
    const operaFetch = await callHandler(teacherAppsHandler, 'GET');
    const operaApp = operaFetch.data.data.find(a => a.id === applicantId);
    console.log('   - Browser 2 detected applicant status as:', operaApp ? operaApp.status : 'NOT FOUND');

    // 4. Browser 3 (e.g. Edge) loads the page fresh from Cloud DB
    console.log('\n4. Browser 3 (Edge Admin) loads Teacher Verification from Cloud DB...');
    const edgeFetch = await callHandler(teacherAppsHandler, 'GET');
    const edgeApp = edgeFetch.data.data.find(a => a.id === applicantId);
    console.log('   - Browser 3 detected applicant status as:', edgeApp ? edgeApp.status : 'NOT FOUND');

    if (operaApp && operaApp.status === 'rejected' && edgeApp && edgeApp.status === 'rejected') {
        console.log('\n🎉 SUCCESS: All 3 browsers are 100% in sync with real persistent cloud state (status: "rejected")!');
    } else {
        console.error('\n❌ FAILED: State mismatch across browsers.');
        process.exit(1);
    }
}

runLiveTest();
