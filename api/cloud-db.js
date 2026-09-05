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
    quizAttempts: [],
    schools: [],
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

let lastCacheFetchTime = 0;
const CACHE_TTL_MS = 25 * 1000; // 25 seconds in-memory cache TTL for warm serverless instances

export async function getCloudStore(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && (now - lastCacheFetchTime < CACHE_TTL_MS) && Array.isArray(localMemoryCache.users) && localMemoryCache.users.length > 0) {
        return localMemoryCache;
    }

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
                // Smart merge with pending local memory users so recently registered users aren't overwritten
                const remoteIds = new Set(items.map(u => String(u.id)));
                const pendingLocalUsers = (localMemoryCache.users || []).filter(u => u && !remoteIds.has(String(u.id)));
                localMemoryCache.users = [...pendingLocalUsers, ...items];
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
            if (parsedData && Array.isArray(parsedData.schools)) {
                localMemoryCache.schools = parsedData.schools;
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

        // 5. Courses & Quiz Submissions & Quiz Attempts
        if (results[4].status === 'fulfilled' && results[4].value.status === 200) {
            let d = results[4].value.data;
            if (typeof d === 'string') {
                try { d = JSON.parse(d); } catch(e) {}
            }
            if (d && typeof d.data === 'string') {
                try { const inner = JSON.parse(d.data); if (inner) d = inner; } catch(e) {}
            }
            if (d) {
                if (Array.isArray(d.courses)) {
                    const remoteCourseIds = new Set(d.courses.map(c => c.id));
                    const pendingCourses = (localMemoryCache.courses || []).filter(c => c && !remoteCourseIds.has(c.id));
                    localMemoryCache.courses = [...pendingCourses, ...d.courses];
                }
                if (Array.isArray(d.quizSubmissions)) {
                    const remoteSubIds = new Set(d.quizSubmissions.map(s => s.id));
                    const pendingSubs = (localMemoryCache.quizSubmissions || []).filter(s => s && !remoteSubIds.has(s.id));
                    localMemoryCache.quizSubmissions = [...pendingSubs, ...d.quizSubmissions];
                }
                const remoteAttempts = Array.isArray(d.quizAttempts) ? d.quizAttempts : [];
                const remoteAttemptKeys = new Set(remoteAttempts.map(a => `${a.user_id}_${a.course_id}_${a.module_id}`));
                const pendingAttempts = (localMemoryCache.quizAttempts || []).filter(a => a && !remoteAttemptKeys.has(`${a.user_id}_${a.course_id}_${a.module_id}`));
                localMemoryCache.quizAttempts = [...pendingAttempts, ...remoteAttempts];
            }
        }

        lastCacheFetchTime = Date.now();
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
        lastCacheFetchTime = Date.now();
        localMemoryCache = {
            ...localMemoryCache,
            ...updatedFields,
            lastUpdated: new Date().toISOString()
        };

        const syncPromises = [];

        // Sync Users & Device Sessions & Schools
        if (updatedFields.users || updatedFields.deviceSessions || updatedFields.schools) {
            syncPromises.push(httpsRequest(CLOUD_BINS.users, 'PUT', {
                items: updatedFields.users || localMemoryCache.users,
                deviceSessions: updatedFields.deviceSessions || localMemoryCache.deviceSessions || {},
                schools: updatedFields.schools || localMemoryCache.schools || [],
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

        // Sync Courses / Quiz Submissions / Quiz Attempts
        if (updatedFields.courses || updatedFields.quizSubmissions || updatedFields.quizAttempts) {
            const rawCourses = updatedFields.courses || localMemoryCache.courses || [];
            // Streamline each course: prevent payload bloat by removing duplicate content/modules fields
            const streamlinedCourses = rawCourses.map(c => {
                if (!c) return c;
                const clean = { ...c };
                delete clean.content;
                delete clean.modules;
                return clean;
            });
            const submissions = (updatedFields.quizSubmissions || localMemoryCache.quizSubmissions || []).slice(0, 30);
            const attempts = (updatedFields.quizAttempts || localMemoryCache.quizAttempts || []).slice(0, 30);

            syncPromises.push(httpsRequest(CLOUD_BINS.courses, 'PUT', {
                courses: streamlinedCourses,
                quizSubmissions: submissions,
                quizAttempts: attempts,
                lastUpdated: new Date().toISOString()
            }));
        }

        if (syncPromises.length > 0) {
            const results = await Promise.allSettled(syncPromises);
            for (const r of results) {
                if (r.status === 'rejected') {
                    console.warn('[NLS Cloud DB] Sync rejected:', r.reason);
                    return false;
                }
                if (r.value && (r.value.status < 200 || r.value.status >= 300)) {
                    console.warn('[NLS Cloud DB] Sync failed with status:', r.value.status, r.value.data);
                    return false;
                }
            }
        }

        return true;
    } catch (e) {
        console.warn('[NLS Cloud DB] Could not save remote store:', e.message);
        return false;
    }
}


