// ==============================================================================
// Next Level Study (NLS) - Universal Persistent Cloud Database Connector
// Multi-Collection High-Capacity Cloud JSON Storage Engine
// ==============================================================================

import https from 'https';

const CLOUD_BINS = {
    users: 'https://extendsclass.com/api/json-storage/bin/adacace',
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
function extractItems(d) {
    if (!d) return null;
    if (typeof d === 'string') {
        try { d = JSON.parse(d); } catch(e) { return null; }
    }
    if (d && typeof d.data === 'string') {
        try {
            const inner = JSON.parse(d.data);
            if (inner && Array.isArray(inner.items)) return inner.items;
        } catch(e) {}
    }
    if (d && Array.isArray(d.items)) return d.items;
    if (Array.isArray(d)) return d;
    return null;
}

export async function getCloudStore() {
    try {
        const t = Date.now();
        const noCacheHeader = { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' };
        const results = await Promise.allSettled([
            httpsRequest(`${CLOUD_BINS.users}?_t=${t}`, 'GET', null, noCacheHeader),
            httpsRequest(`${CLOUD_BINS.events}?_t=${t}`, 'GET', null, noCacheHeader),
            httpsRequest(`${CLOUD_BINS.articles}?_t=${t}`, 'GET', null, noCacheHeader),
            httpsRequest(`${CLOUD_BINS.teachers}?_t=${t}`, 'GET', null, noCacheHeader),
            httpsRequest(`${CLOUD_BINS.courses}?_t=${t}`, 'GET', null, noCacheHeader)
        ]);

        // 1. Users & Device Sessions
        if (results[0].status === 'fulfilled' && results[0].value.status === 200) {
            const data = results[0].value.data;
            const items = extractItems(data);
            if (Array.isArray(items) && items.length > 0) {
                localMemoryCache.users = items;
            }
            let parsedData = data;
            if (typeof data === 'string') {
                try { parsedData = JSON.parse(data); } catch(e) {}
            }
            if (parsedData && parsedData.deviceSessions) {
                localMemoryCache.deviceSessions = parsedData.deviceSessions;
            } else if (parsedData && parsedData.data) {
                let inner = typeof parsedData.data === 'string' ? JSON.parse(parsedData.data) : parsedData.data;
                if (inner && inner.deviceSessions) {
                    localMemoryCache.deviceSessions = inner.deviceSessions;
                }
            }
        }

        // 2. Events
        if (results[1].status === 'fulfilled' && results[1].value.status === 200) {
            const items = extractItems(results[1].value.data);
            if (Array.isArray(items) && items.length > 0) {
                localMemoryCache.events = items;
            }
        }

        // 3. Articles
        if (results[2].status === 'fulfilled' && results[2].value.status === 200) {
            const items = extractItems(results[2].value.data);
            if (Array.isArray(items) && items.length > 0) {
                localMemoryCache.articles = items;
            }
        }

        // 4. Teachers & Applications
        if (results[3].status === 'fulfilled' && results[3].value.status === 200) {
            const d = results[3].value.data;
            if (d) {
                if (Array.isArray(d.teachers)) {
                    localMemoryCache.teachers = d.teachers;
                }
                if (Array.isArray(d.teacherApplications)) {
                    localMemoryCache.teacherApplications = d.teacherApplications;
                }
            }
        }

        // 5. Courses & Quiz Submissions
        if (results[4].status === 'fulfilled' && results[4].value.status === 200) {
            const d = results[4].value.data;
            if (d) {
                if (Array.isArray(d.courses)) {
                    localMemoryCache.courses = d.courses;
                }
                if (Array.isArray(d.quizSubmissions)) {
                    localMemoryCache.quizSubmissions = d.quizSubmissions;
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

        // Sync Users & Device Sessions
        if (updatedFields.users || updatedFields.deviceSessions) {
            syncPromises.push(httpsRequest(CLOUD_BINS.users, 'PUT', {
                items: updatedFields.users || localMemoryCache.users,
                deviceSessions: updatedFields.deviceSessions || localMemoryCache.deviceSessions || {},
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
