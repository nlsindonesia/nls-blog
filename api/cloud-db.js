// ==============================================================================
// Next Level Study (NLS) - Universal Persistent Cloud Database Connector
// Multi-Collection High-Capacity Cloud JSON Storage Engine
// ==============================================================================

import https from 'https';

const CLOUD_BINS = {
    users: 'https://extendsclass.com/api/json-storage/bin/ffffcfd',
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

        // 1. Users
        if (results[0].status === 'fulfilled' && results[0].value.status === 200) {
            const d = results[0].value.data;
            if (d && Array.isArray(d.items)) {
                localMemoryCache.users = d.items;
            }
        }

        // 2. Events
        if (results[1].status === 'fulfilled' && results[1].value.status === 200) {
            const d = results[1].value.data;
            if (d && Array.isArray(d.items)) {
                localMemoryCache.events = d.items;
            }
        }

        // 3. Articles
        if (results[2].status === 'fulfilled' && results[2].value.status === 200) {
            const d = results[2].value.data;
            if (d && Array.isArray(d.items)) {
                localMemoryCache.articles = d.items;
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
