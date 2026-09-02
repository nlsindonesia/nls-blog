import { sql } from '@vercel/postgres';
import 'dotenv/config';

(async () => {
    try {
        const res = await sql`DELETE FROM lms_courses WHERE id IN ('c-sch-1', 'c-sch-1b', 'c-oly-1', 'c-tka-1') RETURNING id`;
        console.log('Deleted dummy courses:', res.rows.map(r => r.id));
    } catch (e) {
        console.error('Failed to delete dummy courses:', e);
    }
})();
