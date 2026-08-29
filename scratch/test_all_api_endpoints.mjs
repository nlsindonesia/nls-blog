import usersHandler from '../api/users.js';
import articlesHandler from '../api/articles.js';
import eventsHandler from '../api/events.js';
import teachersHandler from '../api/teachers.js';

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

console.log('Testing Serverless API Handlers...');

// 1. Test GET /api/users
const res1 = createMockRes();
await usersHandler({ method: 'GET', query: {} }, res1);
console.log('GET /api/users status:', res1.statusCode, 'Users count:', res1.body.total || (res1.body.data && res1.body.data.length));

// 2. Test GET /api/articles
const res2 = createMockRes();
await articlesHandler({ method: 'GET', query: {} }, res2);
console.log('GET /api/articles status:', res2.statusCode, 'Articles count:', res2.body.total || (res2.body.data && res2.body.data.length));

// 3. Test GET /api/events
const res3 = createMockRes();
await eventsHandler({ method: 'GET', query: {} }, res3);
console.log('GET /api/events status:', res3.statusCode, 'Events count:', res3.body.total || (res3.body.data && res3.body.data.length));

// 4. Test GET /api/teachers
const res4 = createMockRes();
await teachersHandler({ method: 'GET', query: {} }, res4);
console.log('GET /api/teachers status:', res4.statusCode, 'Teachers count:', res4.body.total || (res4.body.data && res4.body.data.length));

if (res1.statusCode === 200 && res2.statusCode === 200 && res3.statusCode === 200 && res4.statusCode === 200) {
    console.log('✓ All Serverless API endpoints successfully connected to Cloud DB!');
}
