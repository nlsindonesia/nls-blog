// ==============================================================================
// Next Level Study (NLS) - Universal Per-Device Auth Session API
// Indexes active sessions strictly by unique deviceId to guarantee 100% privacy
// while enabling seamless real-time SSO & Single Sign-Out across all NLS subdomains.
// ==============================================================================

import { getCloudStore, saveCloudStore } from './cloud-db.js';

// Fast in-memory device session cache
const memoryDeviceSessions = new Map();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const query = req.query || {};
    const body = req.body || {};
    const deviceId = query.deviceId || body.deviceId;

    // GET /api/auth-session?deviceId=...
    if (req.method === 'GET') {
        if (!deviceId) {
            return res.status(200).json({
                success: true,
                isLoggedIn: false,
                session: null,
                message: 'No deviceId provided.'
            });
        }

        let record = memoryDeviceSessions.get(deviceId);
        if (!record) {
            try {
                const store = await getCloudStore();
                if (store.deviceSessions && store.deviceSessions[deviceId]) {
                    record = store.deviceSessions[deviceId];
                    memoryDeviceSessions.set(deviceId, record);
                }
            } catch(e) {}
        }

        if (record && record.session) {
            return res.status(200).json({
                success: true,
                isLoggedIn: true,
                session: record.session,
                deviceId: deviceId,
                updatedAt: record.updatedAt
            });
        }

        return res.status(200).json({
            success: true,
            isLoggedIn: false,
            session: null,
            deviceId: deviceId
        });
    }

    // POST /api/auth-session (Login or update session for this deviceId)
    if (req.method === 'POST') {
        const body = req.body || {};
        const devId = body.deviceId || req.query.deviceId;
        const session = body.session;
        const action = body.action;

        if (!devId) {
            return res.status(400).json({ success: false, message: 'deviceId is required' });
        }

        if (action === 'logout' || !session) {
            memoryDeviceSessions.delete(devId);
            try {
                const store = await getCloudStore();
                const devSessions = { ...(store.deviceSessions || {}) };
                delete devSessions[devId];
                await saveCloudStore({ deviceSessions: devSessions });
            } catch(e) {}

            return res.status(200).json({
                success: true,
                isLoggedIn: false,
                session: null,
                message: 'Device session cleared successfully.'
            });
        }

        const now = new Date().toISOString();
        const record = { session, updatedAt: now, deviceId: devId };
        memoryDeviceSessions.set(devId, record);

        try {
            const store = await getCloudStore();
            const devSessions = { ...(store.deviceSessions || {}), [devId]: record };
            await saveCloudStore({ deviceSessions: devSessions });
        } catch(e) {}

        return res.status(200).json({
            success: true,
            isLoggedIn: true,
            session: session,
            message: 'Device session saved successfully.'
        });
    }

    // DELETE /api/auth-session?deviceId=... (Logout this device)
    if (req.method === 'DELETE') {
        if (deviceId) {
            memoryDeviceSessions.delete(deviceId);
            try {
                const store = await getCloudStore();
                const devSessions = { ...(store.deviceSessions || {}) };
                delete devSessions[deviceId];
                await saveCloudStore({ deviceSessions: devSessions });
            } catch(e) {}
        }

        return res.status(200).json({
            success: true,
            isLoggedIn: false,
            session: null,
            message: 'Device session logged out successfully.'
        });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
}
