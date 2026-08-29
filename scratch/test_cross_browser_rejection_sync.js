/**
 * Test Cross-Browser Rejection & Status Synchronization Simulation
 */

const teacherAppsHandler = require('../api/teacher-applications.js').default || require('../api/teacher-applications.js');

function callHandler(handler, method, body = null, query = null) {
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
    handler(req, res);
    return res;
}

console.log('🧪 TESTING CROSS-BROWSER REJECTION & STATUS SYNCHRONIZATION...\n');

// 1. Applicant "Y A" submits form
console.log('1. User submits application from /pengajar:');
let postRes = callHandler(teacherAppsHandler, 'POST', {
    nama: 'Y A',
    panggilan: 'Ss',
    wa: '4',
    email: 'hamemanyu@gmail.com',
    subject: 'Aa',
    kebutuhanPrivat: 'As'
});
console.log('   - Applicant created:', postRes.data.data.nama, '| ID:', postRes.data.data.id);
const applicantId = postRes.data.data.id;

// 2. Browser B boots and has the applicant as 'pending' in its local state
let browserBLocalState = [
    { ...postRes.data.data, status: 'pending' }
];
console.log('\n2. Browser B initially has applicant status in localStorage as:', browserBLocalState[0].status);

// 3. Browser A rejects the applicant ("Tolak")
console.log('\n3. Browser A executes rejectTeacherApplication (Tolak):');
let putRejectRes = callHandler(teacherAppsHandler, 'PUT', {
    ...postRes.data.data,
    id: applicantId,
    status: 'rejected'
});
console.log('   - Server response on reject:', putRejectRes.statusCode, '| Status on server:', putRejectRes.data.data.status);

// 4. Browser B syncs from server (refreshTeacherApplications merge logic)
console.log('\n4. Browser B syncs from server:');
let serverFetch = callHandler(teacherAppsHandler, 'GET');
let serverActive = serverFetch.data.data.filter(a => a.status !== 'trashed');

// Replicate Browser B merge logic:
const activeMap = new Map();
serverActive.forEach(app => {
    if (app && app.id) activeMap.set(app.id, app);
});
browserBLocalState.forEach(app => {
    if (app && app.id) {
        if (!activeMap.has(app.id)) {
            activeMap.set(app.id, app);
        } else {
            const serverApp = activeMap.get(app.id);
            activeMap.set(app.id, { ...app, ...serverApp });
        }
    }
});

const browserBMergedState = Array.from(activeMap.values());
const browserBApplicant = browserBMergedState.find(a => a.id === applicantId);
console.log('   - Browser B applicant status after sync:', browserBApplicant ? browserBApplicant.status : 'NOT FOUND');

if (browserBApplicant && browserBApplicant.status === 'rejected') {
    console.log('\n✅ SUCCESS: Rejection action in Browser A was 100% successfully synced and detected in Browser B!');
} else {
    console.error('\n❌ FAILED: Status was not updated in Browser B.');
    process.exit(1);
}
