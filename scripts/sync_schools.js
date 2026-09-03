import 'dotenv/config';
import { sql } from '@vercel/postgres';

async function syncSchools() {
    console.log('Starting School Data Sync...');
    console.log('Fetching 500 items from api-sekolah-indonesia...');
    
    try {
        const response = await fetch('https://api-sekolah-indonesia.vercel.app/sekolah?page=1&perPage=500');
        const json = await response.json();
        
        const schools = json.dataSekolah;
        console.log(`Found ${schools.length} schools on page 1.`);

        let inserted = 0;
        let skipped = 0;

        for (const school of schools) {
            try {
                const check = await sql`SELECT 1 FROM lms_schools WHERE npsn = ${school.npsn} LIMIT 1`;
                if (check.rowCount > 0) {
                    skipped++;
                    continue;
                }

                await sql`
                    INSERT INTO lms_schools (npsn, name, level, city, province, country)
                    VALUES (${school.npsn}, ${school.sekolah}, ${school.bentuk}, ${school.kabupaten_kota}, ${school.propinsi}, 'Indonesia')
                `;
                inserted++;
            } catch (err) {
                console.error(`Error inserting ${school.sekolah}:`, err.message);
            }
        }
        
        console.log(`Sync complete! Inserted: ${inserted}, Skipped: ${skipped}`);
    } catch (error) {
        console.error('Failed to sync schools:', error);
    }
}
syncSchools();
