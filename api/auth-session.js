// ==============================================================================
// Next Level Study (NLS) - Universal Cross-Subdomain Auth Session API
// Synchronizes login and logout states across all NLS domains and portals
// ==============================================================================

import { getCloudStore, saveCloudStore } from './cloud-db.js';

export default async function handler(req, res) {
    // Enable Cross-Origin Resource Sharing (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const store = await getCloudStore();

        // 1. GET Current Active Session
        if (req.method === 'GET') {
            const activeSession = store.activeSession || null;
            return res.status(200).json({
                success: true,
                isLoggedIn: !!activeSession,
                session: activeSession,
                timestamp: new Date().toISOString()
            });
        }

        // 2. POST Save / Update Session (Login)
        if (req.method === 'POST') {
            let payload = req.body;
            if (typeof payload === 'string') {
                try { payload = JSON.parse(payload); } catch(e) {}
            }

            if (!payload || payload.action === 'logout') {
                await saveCloudStore({ activeSession: null });
                return res.status(200).json({
                    success: true,
                    isLoggedIn: false,
                    session: null,
                    message: 'Sesi login berhasil dibersihkan di seluruh subdomain.'
                });
            }

            const sessionData = {
                id: payload.id || 'sess_' + Date.now(),
                role: payload.role || 'student', // 'superadmin' | 'student' | 'teacher'
                name: payload.name || 'Pengguna NLS',
                email: payload.email || '',
                username: payload.username || '',
                nisn: payload.nisn || '',
                school: payload.school || '',
                level: payload.level || 'SMA',
                targetProgram: payload.targetProgram || '',
                avatar: payload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                loggedInAt: payload.loggedInAt || new Date().toISOString(),
                origin: payload.origin || 'unknown',
                token: payload.token || 'nls_tok_' + Math.random().toString(36).substring(2)
            };

            await saveCloudStore({ activeSession: sessionData });

            return res.status(200).json({
                success: true,
                isLoggedIn: true,
                session: sessionData,
                message: 'Sesi login berhasil disinkronkan ke seluruh subdomain NLS!'
            });
        }

        // 3. DELETE Clear Session (Logout)
        if (req.method === 'DELETE') {
            await saveCloudStore({ activeSession: null });
            return res.status(200).json({
                success: true,
                isLoggedIn: false,
                session: null,
                message: 'Logout berhasil, sesi telah dihapus dari seluruh subdomain.'
            });
        }

        return res.status(405).json({ error: 'Method Not Allowed' });
    } catch (err) {
        console.error('[Auth Session API Error]:', err);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            details: err.message
        });
    }
}
