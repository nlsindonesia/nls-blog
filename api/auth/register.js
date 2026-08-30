import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
    }

    try {
        const { name, username, email, password, phone, school, level, grade, role } = request.body;

        if (!username || !email || !password) {
            return response.status(400).json({ success: false, error: 'Username, email, and password are required.' });
        }

        // Check if user already exists
        const checkUser = await sql`
            SELECT id FROM users WHERE username = ${username} OR email = ${email} LIMIT 1
        `;

        if (checkUser.rows.length > 0) {
            return response.status(409).json({ success: false, error: 'Username or email already exists.' });
        }

        // IMPORTANT: In a real production app, use bcrypt to hash the password before saving!
        // Example: const password_hash = await bcrypt.hash(password, 10);
        // For Phase 1 (migration), we are storing it directly to simplify the transition.
        const password_hash = password;
        const userRole = role || 'siswa';

        // Insert new user
        const result = await sql`
            INSERT INTO users (username, email, password_hash, role, name, phone, school, level, grade)
            VALUES (${username}, ${email}, ${password_hash}, ${userRole}, ${name || ''}, ${phone || ''}, ${school || ''}, ${level || ''}, ${grade || ''})
            RETURNING id, username, email, role, name;
        `;

        const newUser = result.rows[0];

        return response.status(201).json({ 
            success: true, 
            message: 'User registered successfully.',
            user: newUser
        });

    } catch (error) {
        console.error('Error during registration:', error);
        return response.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
