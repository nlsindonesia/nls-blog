import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    try {
        // Create users table
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
                level VARCHAR(20),
                grade VARCHAR(20),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        return response.status(200).json({ 
            success: true, 
            message: "Database schema successfully created/verified."
        });
    } catch (error) {
        console.error('Error in db-setup:', error);
        return response.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}
