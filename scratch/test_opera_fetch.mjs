import teacherAppsHandler from '../api/teacher-applications.js';

async function test() {
    let req = { method: 'GET', headers: { host: 'localhost:3000' } };
    let res = {
        statusCode: 200,
        headers: {},
        data: null,
        setHeader(k, v) { this.headers[k] = v; return this; },
        status(c) { this.statusCode = c; return this; },
        json(d) { this.data = d; return this; },
        end() { return this; }
    };
    await teacherAppsHandler(req, res);
    console.log('GET result:', JSON.stringify(res.data, null, 2));
}

test();
