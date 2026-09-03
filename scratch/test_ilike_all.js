import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
    try {
        const words = ['%sma%', '%kristen%', '%1%', '%penabur%'];
        const res = await sql`SELECT * FROM lms_schools WHERE name ILIKE ALL(${words}) LIMIT 5`;
        console.log("Success:", res.rows);
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
