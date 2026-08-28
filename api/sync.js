// ==============================================================================
// VERCEL SERVERLESS API: MASTER CLOUD SYNC HUB NLS
// File: /api/sync.js
// ==============================================================================

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers['host'] || 'localhost:3000';
        const baseUrl = `${protocol}://${host}`;

        // Return status info
        return res.status(200).json({
            success: true,
            status: 'online',
            service: 'Next Level Study (NLS) Centralized Cloud Sync API',
            timestamp: new Date().toISOString(),
            endpoints: {
                events: `${baseUrl}/api/events`,
                articles: `${baseUrl}/api/articles`,
                teachers: `${baseUrl}/api/teachers`,
                teacherApplications: `${baseUrl}/api/teacher-applications`,
                users: `${baseUrl}/api/users`
            }
        });
    } catch(err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
