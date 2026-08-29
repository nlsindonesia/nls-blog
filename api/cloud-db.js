// ==============================================================================
// Next Level Study (NLS) - Universal Persistent Cloud Database Connector
// Multi-Collection High-Capacity Cloud JSON Storage Engine
// ==============================================================================

import https from 'https';

const CLOUD_BINS = {
    users: 'https://extendsclass.com/api/json-storage/bin/eaedfeb',
    events: 'https://extendsclass.com/api/json-storage/bin/dedebcc',
    articles: 'https://extendsclass.com/api/json-storage/bin/ebcaeab',
    teachers: 'https://extendsclass.com/api/json-storage/bin/dadcdeb',
    courses: 'https://extendsclass.com/api/json-storage/bin/ceeacca'
};

let localMemoryCache = {
    app: 'Next Level Study (NLS) Centralized Master DB',
    version: '2.0.0',
    lastUpdated: new Date().toISOString(),
    users: [],
    events: [],
    articles: [],
    teachers: [],
    teacherApplications: [],
    courses: [],
    quizSubmissions: [],
    activeSession: null
};

function httpsRequest(url, method, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const payload = data ? (typeof data === 'string' ? data : JSON.stringify(data)) : null;
        const options = {
            hostname: u.hostname,
            port: u.port || 443,
            path: u.pathname + u.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
                ...headers
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', err => reject(err));
        if (payload) {
            req.write(payload);
        }
        req.end();
    });
}

/**
 * Fetch all collections concurrently from dedicated Cloud DB Bins
 */
export async function getCloudStore() {
    try {
        const results = await Promise.allSettled([
            httpsRequest(CLOUD_BINS.users, 'GET'),
            httpsRequest(CLOUD_BINS.events, 'GET'),
            httpsRequest(CLOUD_BINS.articles, 'GET'),
            httpsRequest(CLOUD_BINS.teachers, 'GET'),
            httpsRequest(CLOUD_BINS.courses, 'GET')
        ]);

        // 1. Users (Bidirectional merge)
        if (results[0].status === 'fulfilled' && results[0].value.status === 200) {
            const d = results[0].value.data;
            if (d && Array.isArray(d.items)) {
                const map = new Map();
                d.items.forEach(u => u && u.id && map.set(u.id, u));
                (localMemoryCache.users || []).forEach(u => u && u.id && !map.has(u.id) && map.set(u.id, u));
                localMemoryCache.users = Array.from(map.values());
            }
        }

        // 2. Events (Bidirectional merge)
        if (results[1].status === 'fulfilled' && results[1].value.status === 200) {
            const d = results[1].value.data;
            if (d && Array.isArray(d.items)) {
                const map = new Map();
                d.items.forEach(e => e && e.id && map.set(e.id, e));
                (localMemoryCache.events || []).forEach(e => e && e.id && !map.has(e.id) && map.set(e.id, e));
                localMemoryCache.events = Array.from(map.values());
            }
        }

        // 3. Articles (Bidirectional merge)
        if (results[2].status === 'fulfilled' && results[2].value.status === 200) {
            const d = results[2].value.data;
            if (d && Array.isArray(d.items)) {
                const map = new Map();
                d.items.forEach(a => a && a.id && map.set(a.id, a));
                (localMemoryCache.articles || []).forEach(a => a && a.id && !map.has(a.id) && map.set(a.id, a));
                localMemoryCache.articles = Array.from(map.values());
            }
        }

        // 4. Teachers & Applications
        if (results[3].status === 'fulfilled' && results[3].value.status === 200) {
            const d = results[3].value.data;
            if (d) {
                if (Array.isArray(d.teachers)) {
                    const map = new Map();
                    d.teachers.forEach(t => t && t.id && map.set(t.id, t));
                    (localMemoryCache.teachers || []).forEach(t => t && t.id && !map.has(t.id) && map.set(t.id, t));
                    localMemoryCache.teachers = Array.from(map.values());
                }
                if (Array.isArray(d.teacherApplications)) {
                    const map = new Map();
                    d.teacherApplications.forEach(a => a && a.id && map.set(a.id, a));
                    (localMemoryCache.teacherApplications || []).forEach(a => a && a.id && !map.has(a.id) && map.set(a.id, a));
                    localMemoryCache.teacherApplications = Array.from(map.values());
                }
            }
        }

        // 5. Courses & Quiz Submissions
        if (results[4].status === 'fulfilled' && results[4].value.status === 200) {
            const d = results[4].value.data;
            if (d) {
                if (Array.isArray(d.courses)) {
                    const map = new Map();
                    d.courses.forEach(c => c && c.id && map.set(c.id, c));
                    (localMemoryCache.courses || []).forEach(c => c && c.id && !map.has(c.id) && map.set(c.id, c));
                    localMemoryCache.courses = Array.from(map.values());
                }
                if (Array.isArray(d.quizSubmissions)) {
                    const map = new Map();
                    d.quizSubmissions.forEach(q => q && q.id && map.set(q.id, q));
                    (localMemoryCache.quizSubmissions || []).forEach(q => q && q.id && !map.has(q.id) && map.set(q.id, q));
                    localMemoryCache.quizSubmissions = Array.from(map.values());
                }
            }
        }

        localMemoryCache.lastUpdated = new Date().toISOString();
        return localMemoryCache;
    } catch (e) {
        console.warn('[NLS Cloud DB] Error during parallel bin sync:', e.message);
        return localMemoryCache;
    }
}

/**
 * Save updated collections to their respective Cloud DB Bins
 */
export async function saveCloudStore(updatedFields) {
    try {
        localMemoryCache = {
            ...localMemoryCache,
            ...updatedFields,
            lastUpdated: new Date().toISOString()
        };

        const syncPromises = [];

        // Sync Users
        if (updatedFields.users) {
            syncPromises.push(httpsRequest(CLOUD_BINS.users, 'PUT', {
                items: updatedFields.users,
                lastUpdated: new Date().toISOString()
            }));
        }

        // Sync Events
        if (updatedFields.events) {
            syncPromises.push(httpsRequest(CLOUD_BINS.events, 'PUT', {
                items: updatedFields.events,
                lastUpdated: new Date().toISOString()
            }));
        }

        // Sync Articles
        if (updatedFields.articles) {
            syncPromises.push(httpsRequest(CLOUD_BINS.articles, 'PUT', {
                items: updatedFields.articles,
                lastUpdated: new Date().toISOString()
            }));
        }

        // Sync Teachers / Teacher Applications
        if (updatedFields.teachers || updatedFields.teacherApplications) {
            syncPromises.push(httpsRequest(CLOUD_BINS.teachers, 'PUT', {
                teachers: updatedFields.teachers || localMemoryCache.teachers,
                teacherApplications: updatedFields.teacherApplications || localMemoryCache.teacherApplications,
                lastUpdated: new Date().toISOString()
            }));
        }

        // Sync Courses / Quiz Submissions
        if (updatedFields.courses || updatedFields.quizSubmissions) {
            syncPromises.push(httpsRequest(CLOUD_BINS.courses, 'PUT', {
                courses: updatedFields.courses || localMemoryCache.courses,
                quizSubmissions: updatedFields.quizSubmissions || localMemoryCache.quizSubmissions,
                lastUpdated: new Date().toISOString()
            }));
        }

        if (syncPromises.length > 0) {
            await Promise.allSettled(syncPromises);
        }

        return true;
    } catch (e) {
        console.warn('[NLS Cloud DB] Could not save remote store:', e.message);
        return false;
    }
}
