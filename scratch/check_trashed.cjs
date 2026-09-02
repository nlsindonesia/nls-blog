require('dotenv').config({path: '.env.local'});
const { sql } = require('@vercel/postgres');

async function run() {
    try {
        const res = await sql`SELECT id, content_json->>'status' as status, content_json->>'title' as title FROM lms_courses WHERE content_json->>'status' = 'trashed' OR id LIKE '%osn%' OR content_json->>'category' = 'Olimpiade' LIMIT 10`;
        console.log(res.rows);
    } catch(e) {
        console.error(e);
    }
}
run();
