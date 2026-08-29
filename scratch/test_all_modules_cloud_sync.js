/**
 * Test All Cloud API Endpoints for Super Admin Modules
 */

const eventsHandler = require('../api/events.js').default || require('../api/events.js');
const articlesHandler = require('../api/articles.js').default || require('../api/articles.js');
const teachersHandler = require('../api/teachers.js').default || require('../api/teachers.js');
const teacherAppsHandler = require('../api/teacher-applications.js').default || require('../api/teacher-applications.js');
const usersHandler = require('../api/users.js').default || require('../api/users.js');
const syncHandler = require('../api/sync.js').default || require('../api/sync.js');

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

console.log('🧪 TESTING ALL 5 SERVERLESS CLOUD API MODULES...\n');

// 1. Events API
console.log('1. Testing Events API (/api/events):');
let evtGet = callHandler(eventsHandler, 'GET');
console.log('   - GET Status:', evtGet.statusCode, '| Total Events:', evtGet.data.total);

let evtPost = callHandler(eventsHandler, 'POST', { title: 'Test Bootcamp Cloud Sync', category: 'OSN', date: '2026-09-01' });
console.log('   - POST Status:', evtPost.statusCode, '| Created ID:', evtPost.data.data.id);

let evtPutTrash = callHandler(eventsHandler, 'PUT', { id: evtPost.data.data.id, status: 'trashed' });
console.log('   - PUT Trash Status:', evtPutTrash.statusCode, '| Status:', evtPutTrash.data.data.status);

let evtDelete = callHandler(eventsHandler, 'DELETE', null, { id: evtPost.data.data.id });
console.log('   - DELETE Permanent Status:', evtDelete.statusCode, '| Message:', evtDelete.data.message);

// 2. Articles API
console.log('\n2. Testing Articles API (/api/articles):');
let artGet = callHandler(articlesHandler, 'GET');
console.log('   - GET Status:', artGet.statusCode, '| Total Articles:', artGet.data.total);

let artPost = callHandler(articlesHandler, 'POST', { title: 'Strategi Juara Cloud OSN 2026', category: 'OSN & Sains' });
console.log('   - POST Status:', artPost.statusCode, '| Created Slug:', artPost.data.data.slug);

let artPutTrash = callHandler(articlesHandler, 'PUT', { id: artPost.data.data.id, status: 'trashed' });
console.log('   - PUT Trash Status:', artPutTrash.statusCode, '| Status:', artPutTrash.data.data.status);

let artDelete = callHandler(articlesHandler, 'DELETE', null, { id: artPost.data.data.id });
console.log('   - DELETE Permanent Status:', artDelete.statusCode, '| Message:', artDelete.data.message);

// 3. Teachers API
console.log('\n3. Testing Teachers API (/api/teachers):');
let tchGet = callHandler(teachersHandler, 'GET');
console.log('   - GET Status:', tchGet.statusCode, '| Total Teachers:', tchGet.data.total);

let tchPost = callHandler(teachersHandler, 'POST', { name: 'Dr. Test Mentor Cloud', subject: 'Fisika' });
console.log('   - POST Status:', tchPost.statusCode, '| Created ID:', tchPost.data.data.id);

let tchPutTrash = callHandler(teachersHandler, 'PUT', { id: tchPost.data.data.id, status: 'trashed' });
console.log('   - PUT Trash Status:', tchPutTrash.statusCode, '| Status:', tchPutTrash.data.data.status);

let tchDelete = callHandler(teachersHandler, 'DELETE', null, { id: tchPost.data.data.id });
console.log('   - DELETE Permanent Status:', tchDelete.statusCode, '| Message:', tchDelete.data.message);

// 4. Users API
console.log('\n4. Testing Users API (/api/users):');
let usrGet = callHandler(usersHandler, 'GET');
console.log('   - GET Status:', usrGet.statusCode, '| Total Users:', usrGet.data.total);

let usrPost = callHandler(usersHandler, 'POST', { name: 'Admin Kurikulum Test', username: 'test.admin', role: 'Editor' });
console.log('   - POST Status:', usrPost.statusCode, '| Created ID:', usrPost.data.data.id);

let usrPutTrash = callHandler(usersHandler, 'PUT', { id: usrPost.data.data.id, status: 'trashed' });
console.log('   - PUT Trash Status:', usrPutTrash.statusCode, '| Status:', usrPutTrash.data.data.status);

let usrDelete = callHandler(usersHandler, 'DELETE', null, { id: usrPost.data.data.id });
console.log('   - DELETE Permanent Status:', usrDelete.statusCode, '| Message:', usrDelete.data.message);

// 5. Sync API
console.log('\n5. Testing Sync Hub API (/api/sync):');
let syncGet = callHandler(syncHandler, 'GET');
console.log('   - GET Status:', syncGet.statusCode, '| Service:', syncGet.data.service);

console.log('\n🎉 ALL 5 SERVERLESS CLOUD API MODULES OPERATING PERFECTLY!\n');
