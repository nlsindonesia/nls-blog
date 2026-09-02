import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    if (request.method !== 'POST' && request.method !== 'GET') {
        return response.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    try {
        const action = request.body?.action || request.query?.action;

        // --- 1. SETUP DATABASE SCHEMA ---
        if (action === 'setup') {
            const usersTable = await sql`
                CREATE TABLE IF NOT EXISTS users (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    role VARCHAR(20) DEFAULT 'siswa',
                    name VARCHAR(100),
                    phone VARCHAR(20),
                    school VARCHAR(150),
                    level VARCHAR(100),
                    grade VARCHAR(100),
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
                INSERT INTO users (username, email, password_hash, role, name, phone, school, level, grade)
                VALUES (${finalUsername}, ${email}, ${password_hash}, ${userRole}, ${name || ''}, ${phone || ''}, ${school || ''}, ${level || ''}, ${finalGrade || ''})
                RETURNING id, username, email, role, name;
            `;
            
            return response.status(201).json({ success: true, message: 'User registered successfully.', user: result.rows[0] });
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
            
            const searchParam = `%${query}%`;
            const result = await sql`
                SELECT * FROM lms_schools 
                WHERE name ILIKE ${searchParam} OR npsn ILIKE ${searchParam}
                ORDER BY name ASC LIMIT 20
            `;
            return response.status(200).json({ success: true, data: result.rows });
        }

        return response.status(400).json({ success: false, message: 'Invalid action specified.' });

    } catch (error) {
        console.error('Error in pg-auth:', error);
        return response.status(500).json({ success: false, message: error.message });
    }
}
