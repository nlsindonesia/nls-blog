import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
    }

    try {
        const { username, password, isAdmin } = request.body;

        if (!username || !password) {
            return response.status(400).json({ success: false, error: 'Username and password are required.' });
        }

        // Query the database for the user
        // Using parameterized queries via sql template tag prevents SQL injection
        const { rows } = await sql`
            SELECT id, username, email, password_hash, role, name, phone, school, level, grade 
            FROM users 
            WHERE username = ${username}
        `;

        if (rows.length === 0) {
            return response.status(401).json({ success: false, error: 'Invalid username or password.' });
        }

        const user = rows[0];

        // IMPORTANT: In a real production app, use bcrypt to compare password_hash!
        // Example: const match = await bcrypt.compare(password, user.password_hash);
        // For Phase 1 (migration), if password_hash is plain text, we just compare it:
        if (password !== user.password_hash) {
            return response.status(401).json({ success: false, error: 'Invalid username or password.' });
        }

        // Check role if Admin login is required
        if (isAdmin && user.role === 'siswa') {
            return response.status(403).json({ success: false, error: 'Access Denied: Admin privileges required.' });
        }

        // Return user data (excluding password_hash)
        const { password_hash: _, ...safeUser } = user;

        return response.status(200).json({ 
            success: true, 
            message: 'Login successful.',
            user: safeUser
        });

    } catch (error) {
        console.error('Error during login:', error);
        return response.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}
