// ==============================================================================
// Next Level Study (NLS) - Universal Cross-Subdomain Single Sign-On (SSO) Client
// Integrates authentication state across:
// - https://nls-superadmin.vercel.app
// - https://nls-blog-plum.vercel.app
// - https://nls-belajar.vercel.app
// ==============================================================================

(function(window) {
    if (window.NlsSSO) return;

    const NlsSSO = {
        hubUrl: 'https://nls-blog-plum.vercel.app/sso-hub',
        iframe: null,
        ready: false,
        callbacks: [],

        init() {
            if (this._inited) return;
            this._inited = true;

            // Auto-Purge deprecated / mismatched local cache and sync authoritative Cloud data
            try {
                const CACHE_SCHEMA_VERSION = 'v3_cloud_sync_2026_08_30';
                const currentSchema = localStorage.getItem('nls_cache_schema_ver');
                if (currentSchema !== CACHE_SCHEMA_VERSION) {
                    localStorage.removeItem('nls_registered_users_v1');
                    localStorage.removeItem('nls_users_v1');
                    localStorage.removeItem('nls_users_trash_v1');
                    localStorage.removeItem('nls_temp_users');
                    localStorage.removeItem('nls_mock_users');
                    localStorage.removeItem('nls_berita_articles_trash_v1');
                    localStorage.removeItem('nls_kalender_events_trash_v1');
                    localStorage.removeItem('nls_pengajar_teachers_trash_v1');
                    localStorage.setItem('nls_cache_schema_ver', CACHE_SCHEMA_VERSION);
                }
            } catch(e) {}

            // 1. Consume token/session passed in URL parameter (?nls_sso_data=... or ?sso_b64=... or ?auth_token=...)
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const ssoData = urlParams.get('nls_sso_data') || urlParams.get('auth_token') || urlParams.get('session');
                const ssoB64 = urlParams.get('sso_b64');
                let parsed = null;

                if (ssoB64) {
                    try {
                        parsed = JSON.parse(decodeURIComponent(escape(atob(ssoB64))));
                    } catch(e) {
                        try { parsed = JSON.parse(atob(ssoB64)); } catch(e2) {}
                    }
                }

                if (!parsed && ssoData) {
                    try {
                        parsed = JSON.parse(ssoData);
                    } catch(e) {
                        try {
                            parsed = JSON.parse(decodeURIComponent(ssoData));
                        } catch(e2) {
                            try {
                                parsed = JSON.parse(atob(ssoData));
                            } catch(e3) {}
                        }
                    }
                }

                if (parsed && typeof parsed === 'object' && (parsed.id || parsed.name || parsed.email || parsed.username || parsed.role)) {
                    this.setLocalSession(parsed);
                    // Clean URL without reloading
                    urlParams.delete('nls_sso_data');
                    urlParams.delete('sso_b64');
                    urlParams.delete('auth_token');
                    urlParams.delete('session');
                    const newSearch = urlParams.toString() ? '?' + urlParams.toString() : '';
                    try {
                        history.replaceState(null, '', window.location.pathname + newSearch + window.location.hash);
                    } catch(e) {}
                }
            } catch(e) {}

            // 2. Setup SSO Hub iframe
            if (document.body) {
                this.setupIframe();
            } else {
                window.addEventListener('DOMContentLoaded', () => this.setupIframe());
            }

            // 3. Listen for postMessage from Hub
            window.addEventListener('message', (event) => {
                const data = event.data;
                if (!data || typeof data !== 'object') return;
                if (data.type === 'NLS_SSO_SESSION' || data.type === 'NLS_SSO_UPDATED') {
                    this.onRemoteSessionReceived(data.session);
                } else if (data.type === 'NLS_SSO_CLEARED') {
                    this.onRemoteSessionCleared();
                }
            });

            // 4. Same-device multi-tab synchronization on window focus
            window.addEventListener('focus', () => {
                this.syncFromHub();
            });
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    this.syncFromHub();
                }
            });

            // 5. Initial notification of local session
            const current = this.getLocalSession();
            if (current) {
                this.callbacks.forEach(cb => {
                    try { cb(current, true); } catch(e) {}
                });
            }
        },

        setupIframe() {
            if (this.iframe || !document.body) return;
            try {
                const iframe = document.createElement('iframe');
                iframe.id = 'nls_sso_hub_frame';
                iframe.style.display = 'none';
                iframe.style.position = 'absolute';
                iframe.style.top = '-9999px';
                iframe.style.left = '-9999px';
                iframe.style.width = '0px';
                iframe.style.height = '0px';
                iframe.style.visibility = 'hidden';
                iframe.src = this.hubUrl;
                iframe.onload = () => {
                    this.ready = true;
                    this.syncFromHub();
                };
                document.body.appendChild(iframe);
                this.iframe = iframe;
            } catch(e) {}
        },

        syncFromHub() {
            // Ping Hub iframe (isolated to this browser/device)
            if (this.iframe && this.iframe.contentWindow) {
                try {
                    this.iframe.contentWindow.postMessage({ type: 'NLS_SSO_GET' }, '*');
                } catch(e) {}
            }
        },

        async broadcastLogin(sessionData) {
            this.setLocalSession(sessionData);

            // Message Hub iframe on this device
            if (this.iframe && this.iframe.contentWindow) {
                try {
                    this.iframe.contentWindow.postMessage({ type: 'NLS_SSO_SET', session: sessionData }, '*');
                } catch(e) {}
            }

            // Trigger local callbacks
            this.callbacks.forEach(cb => {
                try { cb(sessionData, true); } catch(e) {}
            });
        },

        async broadcastLogout() {
            this.clearLocalSession();

            // Message Hub iframe on this device
            if (this.iframe && this.iframe.contentWindow) {
                try {
                    this.iframe.contentWindow.postMessage({ type: 'NLS_SSO_CLEAR' }, '*');
                } catch(e) {}
            }

            // Trigger local callbacks
            this.callbacks.forEach(cb => {
                try { cb(null, false); } catch(e) {}
            });
        },

        getLocalSession() {
            try {
                const raw = localStorage.getItem('nls_auth_session') || localStorage.getItem('nls_student_auth_session');
                return raw ? JSON.parse(raw) : null;
            } catch(e) {
                return null;
            }
        },

        setLocalSession(session) {
            if (!session) {
                this.clearLocalSession();
                return;
            }
            try {
                const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                const avatar = session.avatar && !session.avatar.includes('article-placeholder') && !session.avatar.includes('nls-logo-300') ? session.avatar : DEFAULT_AVATAR;
                const nisn = (session.nisn || '').startsWith('NISN:') ? session.nisn : ('NISN: ' + (session.nisn || 'Terdaftar'));
                const studentObj = {
                    id: session.id || '',
                    name: session.name || 'Siswa NLS',
                    nisn: nisn,
                    school: session.school || 'Sekolah NLS',
                    level: session.level || 'SMA',
                    grade: session.grade || `${session.level || 'SMA'} - Kelas Unggulan`,
                    email: session.email || '',
                    phone: session.phone || '',
                    parentPhone: session.parentPhone || '-',
                    avatar: avatar,
                    target: session.targetProgram || session.target || 'Program Unggulan NLS',
                    targetProgram: session.targetProgram || session.target || 'Program Unggulan NLS',
                    role: session.role || 'student',
                    roleLabel: session.roleLabel || (session.role === 'teacher' ? 'Guru / Pengajar' : (session.role === 'super_admin' ? 'Super Admin' : 'Siswa'))
                };

                const merged = { ...session, ...studentObj };
                localStorage.setItem('nls_auth_session', JSON.stringify(merged));
                localStorage.setItem('nls_student_auth_session', JSON.stringify(merged));
                localStorage.setItem('nls_student_profile_v1', JSON.stringify(studentObj));

                if (session.role === 'super_admin') {
                    localStorage.setItem('nls_admin_auth', 'true');
                    sessionStorage.setItem('nls_admin_auth', 'true');
                }
            } catch(e) {}
        },

        clearLocalSession() {
            try {
                localStorage.removeItem('nls_auth_session');
                localStorage.removeItem('nls_student_auth_session');
                localStorage.removeItem('nls_admin_auth');
                sessionStorage.removeItem('nls_admin_auth');
            } catch(e) {}
        },

        onSessionChange(callback) {
            if (typeof callback === 'function') {
                this.callbacks.push(callback);
                // Immediately notify of current local session if exists
                const current = this.getLocalSession();
                if (current) {
                    try { callback(current, true); } catch(e) {}
                }
            }
        },

        onRemoteSessionReceived(session) {
            if (session && typeof session === 'object' && (session.name || session.email || session.username || session.role || session.id)) {
                const current = this.getLocalSession();
                const isChanged = !current || current.id !== session.id || current.role !== session.role || current.name !== session.name;
                this.setLocalSession(session);
                if (isChanged) {
                    this.callbacks.forEach(cb => {
                        try { cb(session, true); } catch(e) {}
                    });
                }
            }
        },

        onRemoteSessionCleared() {
            this.clearLocalSession();
            this.callbacks.forEach(cb => {
                try { cb(null, false); } catch(e) {}
            });
        },

        createCrossDomainUrl(targetUrl, sessionOverride = null) {
            const session = sessionOverride || this.getLocalSession();
            if (!session) return targetUrl;
            try {
                const u = new URL(targetUrl, window.location.href);
                const sessionStr = JSON.stringify(session);
                u.searchParams.set('nls_sso_data', sessionStr);
                try {
                    u.searchParams.set('sso_b64', btoa(unescape(encodeURIComponent(sessionStr))));
                } catch(e) {}
                return u.toString();
            } catch(e) {
                return targetUrl;
            }
        }
    };

    // ==============================================================================
    // Next Level Study (NLS) - Universal Persistent Cloud Database Synchronization Engine
    // Automatically synchronizes Articles, Events, and Teachers live from Cloud API
    // ==============================================================================
    const NlsCloudSync = {
        inited: false,
        init() {
            if (this.inited) return;
            this.inited = true;

            // 1. Cross-tab real-time listener via BroadcastChannel
            try {
                const channel = new BroadcastChannel('nls_sync_channel');
                channel.onmessage = (ev) => {
                    if (!ev.data) return;
                    if (ev.data.type === 'ARTICLES_UPDATED' && Array.isArray(ev.data.data)) {
                        this.applyArticles(ev.data.data);
                    } else if (ev.data.type === 'EVENTS_UPDATED' && Array.isArray(ev.data.data)) {
                        this.applyEvents(ev.data.data);
                    } else if (ev.data.type === 'TEACHERS_UPDATED' && Array.isArray(ev.data.data)) {
                        this.applyTeachers(ev.data.data);
                    } else if (ev.data.type === 'SYNC_ALL') {
                        this.syncAllFromCloud();
                    }
                };
            } catch(e) {}

            // 2. Fetch authoritative live data from Cloud Serverless APIs
            this.syncAllFromCloud();

            // 3. Periodic liveness sync (every 60 seconds on public tabs)
            if (typeof setInterval !== 'undefined') {
                setInterval(() => {
                    if (document.visibilityState === 'visible') {
                        this.syncAllFromCloud();
                    }
                }, 60000);
            }
        },

        async syncAllFromCloud() {
            if (typeof fetch === 'undefined') return;
            try {
                const [artRes, evtRes, tchRes] = await Promise.allSettled([
                    fetch('/api/articles?_t=' + Date.now()),
                    fetch('/api/events?_t=' + Date.now()),
                    fetch('/api/teachers?_t=' + Date.now())
                ]);

                if (artRes.status === 'fulfilled' && artRes.value.ok) {
                    const json = await artRes.value.json();
                    if (json && Array.isArray(json.data)) {
                        const active = json.data.filter(a => a && a.status !== 'trashed');
                        this.applyArticles(active);
                    }
                }

                if (evtRes.status === 'fulfilled' && evtRes.value.ok) {
                    const json = await evtRes.value.json();
                    if (json && Array.isArray(json.data)) {
                        const active = json.data.filter(e => e && e.status !== 'trashed');
                        this.applyEvents(active);
                    }
                }

                if (tchRes.status === 'fulfilled' && tchRes.value.ok) {
                    const json = await tchRes.value.json();
                    if (json && Array.isArray(json.data)) {
                        const active = json.data.filter(t => t && t.status !== 'trashed');
                        this.applyTeachers(active);
                    }
                }
            } catch (err) {
                console.warn('[NLS Cloud Sync] Background sync notice:', err);
            }
        },

        applyArticles(articles) {
            try {
                localStorage.setItem('nls_berita_articles_v1', JSON.stringify(articles));
                if (typeof window !== 'undefined') {
                    window.NLS_DEFAULT_ARTICLES = articles;
                    window.dispatchEvent(new CustomEvent('nls-articles-updated', { detail: articles }));
                }
            } catch(e) {}
        },

        applyEvents(events) {
            try {
                localStorage.setItem('nls_kalender_events_v1', JSON.stringify(events));
                if (typeof window !== 'undefined') {
                    window.NLS_DEFAULT_EVENTS = events;
                    window.dispatchEvent(new CustomEvent('nls-events-updated', { detail: events }));
                }
            } catch(e) {}
        },

        applyTeachers(teachers) {
            try {
                localStorage.setItem('nls_pengajar_teachers_v1', JSON.stringify(teachers));
                if (typeof window !== 'undefined') {
                    window.NLS_DEFAULT_TEACHERS = teachers;
                    window.dispatchEvent(new CustomEvent('nls-teachers-updated', { detail: teachers }));
                }
            } catch(e) {}
        }
    };

    window.NlsSSO = NlsSSO;
    window.NlsCloudSync = NlsCloudSync;

    // Automatically initialize NlsSSO and NlsCloudSync on script load
    if (typeof document !== 'undefined') {
        NlsSSO.init();
        NlsCloudSync.init();
    }
})(typeof window !== 'undefined' ? window : this);
