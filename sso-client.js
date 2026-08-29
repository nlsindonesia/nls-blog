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

            // 1. Consume token/session passed in URL parameter (?nls_sso_data=...)
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const ssoData = urlParams.get('nls_sso_data');
                if (ssoData) {
                    const parsed = JSON.parse(decodeURIComponent(ssoData));
                    if (parsed && typeof parsed === 'object') {
                        this.setLocalSession(parsed);
                        // Clean URL without reloading
                        urlParams.delete('nls_sso_data');
                        const newSearch = urlParams.toString() ? '?' + urlParams.toString() : '';
                        history.replaceState(null, '', window.location.pathname + newSearch + window.location.hash);
                    }
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

            // 4. Multi-device / tab synchronization on window focus
            window.addEventListener('focus', () => {
                this.syncFromHubOrApi();
            });
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    this.syncFromHubOrApi();
                }
            });

            // 5. Initial fetch from API
            this.syncFromHubOrApi();
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
                    this.syncFromHubOrApi();
                };
                document.body.appendChild(iframe);
                this.iframe = iframe;
            } catch(e) {}
        },

        syncFromHubOrApi() {
            // Ping Hub iframe
            if (this.iframe && this.iframe.contentWindow) {
                try {
                    this.iframe.contentWindow.postMessage({ type: 'NLS_SSO_GET' }, '*');
                } catch(e) {}
            }

            // Also check API directly (only apply if a valid session exists in API)
            this.fetchSessionFromApi().then(session => {
                if (session && typeof session === 'object' && (session.name || session.email || session.username || session.role || session.id)) {
                    this.onRemoteSessionReceived(session);
                }
            });
        },

        async fetchSessionFromApi() {
            try {
                const res = await fetch('/api/auth-session?_t=' + Date.now());
                if (res.ok) {
                    const data = await res.json();
                    return data && data.success && data.session ? data.session : null;
                }
            } catch(e) {}
            return null;
        },

        async broadcastLogin(sessionData) {
            this.setLocalSession(sessionData);

            // Message Hub iframe
            if (this.iframe && this.iframe.contentWindow) {
                try {
                    this.iframe.contentWindow.postMessage({ type: 'NLS_SSO_SET', session: sessionData }, '*');
                } catch(e) {}
            }

            // Sync to API
            try {
                await fetch('/api/auth-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sessionData)
                });
            } catch(e) {}
        },

        async broadcastLogout() {
            this.clearLocalSession();

            // Message Hub iframe
            if (this.iframe && this.iframe.contentWindow) {
                try {
                    this.iframe.contentWindow.postMessage({ type: 'NLS_SSO_CLEAR' }, '*');
                } catch(e) {}
            }

            // Call API
            try {
                await fetch('/api/auth-session', { method: 'DELETE' });
            } catch(e) {}

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
                localStorage.setItem('nls_auth_session', JSON.stringify(session));
                localStorage.setItem('nls_student_auth_session', JSON.stringify(session));
                if (session.role === 'super_admin') {
                    localStorage.setItem('nls_admin_auth', 'true');
                    sessionStorage.setItem('nls_admin_auth', 'true');
                }
                localStorage.setItem('nls_student_profile_v1', JSON.stringify({
                    name: session.name || 'Siswa NLS',
                    nisn: session.nisn || 'NISN: Terdaftar',
                    school: session.school || 'Sekolah NLS',
                    email: session.email || '',
                    phone: session.phone || '',
                    avatar: session.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                    target: session.targetProgram || 'Program Unggulan NLS',
                    role: session.role || 'student',
                    roleLabel: session.roleLabel || 'Siswa'
                }));
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
            // If remote session is null or empty from a passive check, DO NOT clear the local session!
            // Local session remains authoritative and persistent until an explicit LOGOUT event.
        },

        onRemoteSessionCleared() {
            this.clearLocalSession();
            this.callbacks.forEach(cb => {
                try { cb(null, false); } catch(e) {}
            });
        },

        createCrossDomainUrl(targetUrl) {
            const session = this.getLocalSession();
            if (!session) return targetUrl;
            try {
                const u = new URL(targetUrl, window.location.href);
                u.searchParams.set('nls_sso_data', encodeURIComponent(JSON.stringify(session)));
                return u.toString();
            } catch(e) {
                return targetUrl;
            }
        }
    };

    window.NlsSSO = NlsSSO;

    // Automatically initialize NlsSSO on script load
    if (typeof document !== 'undefined') {
        NlsSSO.init();
    }
})(typeof window !== 'undefined' ? window : this);
