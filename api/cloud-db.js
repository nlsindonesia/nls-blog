// ==============================================================================
// Next Level Study (NLS) - Universal Persistent Cloud Database Connector
// Uses Cloud JSON Storage with In-Memory Cache Fallback
// ==============================================================================

import https from 'https';

const CLOUD_DB_URL = 'https://extendsclass.com/api/json-storage/bin/dddcced';

let localMemoryCache = {
    app: 'Next Level Study (NLS) Centralized Master DB',
    lastUpdated: new Date().toISOString(),
    teacherApplications: [],
    events: [],
    articles: [],
    teachers: [],
    users: []
};

function httpsRequest(url, method, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const options = {
            hostname: u.hostname,
            port: u.port || 443,
            path: u.pathname + u.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
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
        if (data) {
            req.write(typeof data === 'string' ? data : JSON.stringify(data));
        }
        req.end();
    });
}

export async function getCloudStore() {
    try {
        const res = await httpsRequest(CLOUD_DB_URL, 'GET');
        let remoteData = res.data;
        if (typeof remoteData === 'string') {
            try { remoteData = JSON.parse(remoteData); } catch(e) {}
        }
        if (res.status === 200 && remoteData && typeof remoteData === 'object') {
            const remoteTime = new Date(remoteData.lastUpdated || 0).getTime();
            const localTime = new Date(localMemoryCache.lastUpdated || 0).getTime();
            if (remoteTime >= localTime || !localMemoryCache.lastUpdated) {
                localMemoryCache = {
                    ...localMemoryCache,
                    ...remoteData,
                    teacherApplications: Array.isArray(remoteData.teacherApplications) ? remoteData.teacherApplications : (Array.isArray(localMemoryCache.teacherApplications) ? localMemoryCache.teacherApplications : []),
                    events: Array.isArray(remoteData.events) ? remoteData.events : (Array.isArray(localMemoryCache.events) ? localMemoryCache.events : []),
                    articles: Array.isArray(remoteData.articles) ? remoteData.articles : (Array.isArray(localMemoryCache.articles) ? localMemoryCache.articles : []),
                    teachers: Array.isArray(remoteData.teachers) ? remoteData.teachers : (Array.isArray(localMemoryCache.teachers) ? localMemoryCache.teachers : []),
                    users: Array.isArray(remoteData.users) ? remoteData.users : (Array.isArray(localMemoryCache.users) ? localMemoryCache.users : [])
                };
            }
            return localMemoryCache;
        }
    } catch (e) {
        console.warn('[NLS Cloud DB] Could not fetch remote store, using fallback:', e.message);
    }
    return localMemoryCache;
}

export async function saveCloudStore(updatedFields) {
    try {
        localMemoryCache = {
            ...localMemoryCache,
            ...updatedFields,
            lastUpdated: new Date().toISOString()
        };
        const res = await httpsRequest(CLOUD_DB_URL, 'PUT', localMemoryCache);
        return res.status === 200;
    } catch (e) {
        console.warn('[NLS Cloud DB] Could not save remote store:', e.message);
        return false;
    }
}
