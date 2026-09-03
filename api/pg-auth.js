import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    if (request.method !== 'POST' && request.method !== 'GET') {
        return response.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    try {
        const action = request.body?.action || request.query?.action;

        // --- 1. SETUP DATABASE SCHEMA ---
        if (action === 'setup') {
            
            try {
                await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS nisn VARCHAR(50);`;
                await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS school VARCHAR(150);`;
                await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100);`;
                await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);`;
                await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS level VARCHAR(100);`;
                await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS grade VARCHAR(255);`;
            } catch (e) { console.log('Alter table users failed:', e); }
            
            const usersTable = await sql`
                CREATE TABLE IF NOT EXISTS users (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    role VARCHAR(20) DEFAULT 'siswa',
                    name VARCHAR(100),
                    nisn VARCHAR(50),
                    phone VARCHAR(50),
                    school VARCHAR(150),
                    level VARCHAR(100),
                    grade VARCHAR(255),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `;
            
            const schoolsTable = await sql`
                CREATE TABLE IF NOT EXISTS lms_schools (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    npsn VARCHAR(50),
                    name VARCHAR(255) NOT NULL,
                    level VARCHAR(50),
                    city VARCHAR(150),
                    province VARCHAR(150),
                    country VARCHAR(150) DEFAULT 'Indonesia',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `;
            
            // Alter existing table just in case it was created with VARCHAR(20)
            await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS nisn VARCHAR(50);`;
            await sql`ALTER TABLE users ALTER COLUMN grade TYPE VARCHAR(255);`;
            await sql`ALTER TABLE users ALTER COLUMN level TYPE VARCHAR(100);`;
            await sql`ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(100);`;
            await sql`ALTER TABLE users ALTER COLUMN phone TYPE VARCHAR(50);`;
            
            return response.status(200).json({ 
                success: true, 
                message: "Database schema successfully created/verified."
            });
        }

        // --- 1.5 DEBUG SCHEMA ---
        if (action === 'debug_schema') {
            const res = await sql`SELECT column_name, character_maximum_length FROM information_schema.columns WHERE table_name = 'users';`;
            return response.status(200).json({ success: true, schema: res.rows });
        }

        // --- 2. LOGIN USER ---
        if (action === 'login') {
            const { identifier, username, password, isAdmin } = request.body;
            const loginId = identifier || username;
            
            if (!loginId || !password) return response.status(400).json({ success: false, message: 'Username/Email and password are required.' });

            // Allow login by email or username
            const { rows } = await sql`
                SELECT id, username, email, password_hash, role, name, phone, school, level, grade 
                FROM users WHERE username = ${loginId} OR email = ${loginId}
            `;
            if (rows.length === 0) return response.status(401).json({ success: false, message: 'Invalid username or password.' });
            
            const user = rows[0];
            if (password !== user.password_hash) return response.status(401).json({ success: false, message: 'Invalid username or password.' });
            if (isAdmin && user.role === 'siswa') return response.status(403).json({ success: false, message: 'Access Denied: Admin privileges required.' });

            const { password_hash: _, ...safeUser } = user;
            return response.status(200).json({ success: true, message: 'Login successful.', user: safeUser });
        }

        // --- 3. REGISTER USER ---
        if (action === 'register') {
            const { name, username, email, password, phone, school, level, targetProgram, grade, role, nisn } = request.body;
            // Frontend might not send username, so default to email prefix
            const finalUsername = username || email.split('@')[0];
            const finalGrade = grade || targetProgram; // Frontend sends targetProgram

            if (!email || !password) return response.status(400).json({ success: false, message: 'Email and password are required.' });

            const checkUser = await sql`SELECT id FROM users WHERE username = ${finalUsername} OR email = ${email} LIMIT 1`;
            if (checkUser.rows.length > 0) return response.status(409).json({ success: false, message: 'Email atau Username ini sudah terdaftar sebelumnya.' });

            const password_hash = password;
            const userRole = role || 'siswa';

            const result = await sql`
                INSERT INTO users (username, email, password_hash, role, name, nisn, phone, school, level, grade)
                VALUES (${finalUsername}, ${email}, ${password_hash}, ${userRole}, ${name || ''}, ${nisn || ''}, ${phone || ''}, ${school || ''}, ${level || ''}, ${finalGrade || ''})
                RETURNING id, username, email, role, name, nisn;
            `;
            
            return response.status(201).json({ success: true, message: 'User registered successfully.', user: result.rows[0] });
        }

        // --- 3.1 GOOGLE AUTH (LOGIN / AUTO-REGISTER) ---
        if (action === 'google_auth') {
            const { credential } = request.body;
            if (!credential) return response.status(400).json({ success: false, message: 'Google credential missing.' });

            try {
                // Verify token with Google's tokeninfo endpoint
                const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
                const googleData = await verifyRes.json();
                
                if (googleData.error || !googleData.email) {
                    return response.status(401).json({ success: false, message: 'Invalid Google credential.' });
                }

                const email = googleData.email;
                const name = googleData.name || email.split('@')[0];
                
                // Check if user exists
                const checkUser = await sql`SELECT id, username, email, role, name, phone, school, level, grade FROM users WHERE email = ${email} LIMIT 1`;
                
                if (checkUser.rows.length > 0) {
                    // Login existing user
                    return response.status(200).json({ success: true, message: 'Login via Google successful.', user: checkUser.rows[0] });
                } else {
                    // Auto-Register new user
                    const finalUsername = email.split('@')[0] + Math.floor(Math.random() * 10000);
                    const password_hash = 'GOOGLE_SSO_USER';
                    
                    const result = await sql`
                        INSERT INTO users (username, email, password_hash, role, name, phone, school, level, grade)
                        VALUES (${finalUsername}, ${email}, ${password_hash}, 'siswa', ${name}, '-', '-', '-', '-')
                        RETURNING id, username, email, role, name, phone, school, level, grade;
                    `;
                    return response.status(201).json({ success: true, message: 'Account automatically created via Google.', user: result.rows[0] });
                }
            } catch (err) {
                console.error("Google auth error:", err);
                return response.status(500).json({ success: false, message: 'Gagal terhubung dengan layanan Google.' });
            }
        }

        // --- 3.2 UPDATE PROFILE (FORCE COMPLETION) ---
        if (action === 'update_profile') {
            const { id, email, phone, school, level, targetProgram } = request.body;
            if (!id || !email) return response.status(400).json({ success: false, message: 'User ID and Email required.' });
            
            const result = await sql`
                UPDATE users 
                SET phone = ${phone}, school = ${school}, level = ${level}, grade = ${targetProgram}
                WHERE id = ${id} AND email = ${email}
                RETURNING id, username, email, role, name, phone, school, level, grade;
            `;
            
            if (result.rows.length === 0) return response.status(404).json({ success: false, message: 'User not found.' });
            
            return response.status(200).json({ success: true, message: 'Profile updated successfully.', user: result.rows[0] });
        }

        // --- 4. ADMIN: GET SCHOOLS ---
        if (action === 'admin_get_schools') {
            const result = await sql`
                SELECT s.*, (SELECT COUNT(*) FROM users u WHERE u.school = s.name OR u.school = s.id::text) as student_count
                FROM lms_schools s
                ORDER BY s.created_at DESC
            `;
            return response.status(200).json({ success: true, data: result.rows });
        }

        // --- 5. ADMIN: SAVE SCHOOL ---
        if (action === 'admin_save_school') {
            const { id, npsn, name, level, city, province, country } = request.body;
            let result;
            if (id) {
                result = await sql`
                    UPDATE lms_schools 
                    SET npsn = ${npsn}, name = ${name}, level = ${level}, city = ${city}, province = ${province}, country = ${country}
                    WHERE id = ${id} RETURNING *
                `;
            } else {
                result = await sql`
                    INSERT INTO lms_schools (npsn, name, level, city, province, country)
                    VALUES (${npsn}, ${name}, ${level}, ${city}, ${province}, ${country})
                    RETURNING *
                `;
            }
            return response.status(200).json({ success: true, data: result.rows[0] });
        }

        // --- 6. ADMIN: DELETE SCHOOL ---
        if (action === 'admin_delete_school') {
            const { id } = request.body;
            if (!id) return response.status(400).json({ success: false, message: 'ID required' });
            await sql`DELETE FROM lms_schools WHERE id = ${id}`;
            return response.status(200).json({ success: true, message: 'Deleted successfully' });
        }

        // --- 7. PUBLIC: SEARCH SCHOOLS ---
        if (action === 'search_schools') {
            const query = request.body?.query || request.query?.query || '';
            if (query.length < 2) return response.status(200).json({ success: true, data: [] });
            
            // Expand common abbreviations for Indonesian schools
            let processedQuery = query.toLowerCase()
                .replace(/\bsman\b/g, 'sma negeri')
                .replace(/\bsmpn\b/g, 'smp negeri')
                .replace(/\bsdn\b/g, 'sd negeri')
                .replace(/\bsmak\b/g, 'sma kristen')
                .replace(/\bsmpk\b/g, 'smp kristen')
                .replace(/\bsdk\b/g, 'sd kristen')
                .replace(/\bmtsn\b/g, 'mts negeri')
                .replace(/\bman\b/g, 'ma negeri')
                .replace(/\bmin\b/g, 'mi negeri')
                .replace(/\bsmas\b/g, 'sma swasta')
                .replace(/\bsmps\b/g, 'smp swasta')
                .replace(/\bsds\b/g, 'sd swasta')
                .replace(/\bsmk\b/g, 'smk')
                .replace(/\bsmkn\b/g, 'smk negeri')
                .replace(/\bsmks\b/g, 'smk swasta')
                .replace(/\bpkbm\b/g, 'pkbm');

            const words = processedQuery.trim().split(/\s+/).filter(w => w.length > 0).slice(0, 4); // Max 4 words for performance
            
            let result;
            if (words.length === 1) {
                const w1 = `%${words[0]}%`;
                result = await sql`SELECT * FROM lms_schools WHERE name ILIKE ${w1} OR npsn ILIKE ${w1} ORDER BY name ASC LIMIT 20`;
            } else if (words.length === 2) {
                const w1 = `%${words[0]}%`; const w2 = `%${words[1]}%`;
                result = await sql`SELECT * FROM lms_schools WHERE name ILIKE ${w1} AND name ILIKE ${w2} ORDER BY name ASC LIMIT 20`;
            } else if (words.length === 3) {
                const w1 = `%${words[0]}%`; const w2 = `%${words[1]}%`; const w3 = `%${words[2]}%`;
                result = await sql`SELECT * FROM lms_schools WHERE name ILIKE ${w1} AND name ILIKE ${w2} AND name ILIKE ${w3} ORDER BY name ASC LIMIT 20`;
            } else {
                const w1 = `%${words[0]}%`; const w2 = `%${words[1]}%`; const w3 = `%${words[2]}%`; const w4 = `%${words[3]}%`;
                result = await sql`SELECT * FROM lms_schools WHERE name ILIKE ${w1} AND name ILIKE ${w2} AND name ILIKE ${w3} AND name ILIKE ${w4} ORDER BY name ASC LIMIT 20`;
            }
            
            return response.status(200).json({ success: true, data: result.rows });
        }

        // --- 8. SYNC DAPODIK ---
        if (action === 'sync_dapodik') {
            const { isAdmin } = request.body;
            if (!isAdmin) return response.status(403).json({ success: false, message: 'Admin access required.' });
            
            const page = request.body.page || 1;
            
            const publicRes = await fetch(`https://api-sekolah-indonesia.vercel.app/sekolah?page=${page}&perPage=100`);
            const data = await publicRes.json();
            
            if (!data || !data.dataSekolah) {
                return response.status(500).json({ success: false, message: 'Failed to fetch from public API' });
            }
            
            let inserted = 0;
            for (const school of data.dataSekolah) {
                const check = await sql`SELECT id FROM lms_schools WHERE npsn = ${school.npsn} OR name = ${school.sekolah} LIMIT 1`;
                if (check.rowCount === 0) {
                    try {
                        await sql`
                            INSERT INTO lms_schools (npsn, name, level, city, province, country)
                            VALUES (${school.npsn || null}, ${school.sekolah}, ${school.bentuk || 'Lainnya'}, ${school.kabupaten_kota || ''}, ${school.propinsi || ''}, 'Indonesia')
                        `;
                        inserted++;
                    } catch(e) {
                        console.error('Error inserting school:', e);
                    }
                }
            }
            
            return response.status(200).json({ 
                success: true, 
                message: `Berhasil sinkronisasi ${inserted} sekolah baru dari Dapodik (Halaman ${page}).`,
                inserted,
                nextPage: page + 1
            });
        }

        return response.status(400).json({ success: false, message: 'Invalid action specified.' });

    } catch (error) {
        console.error('Error in pg-auth:', error);
        return response.status(500).json({ success: false, message: error.message });
    }
}
