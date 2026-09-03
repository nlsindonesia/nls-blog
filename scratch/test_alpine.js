
        // 1. Immediate Cross-Origin SSO Handoff Interceptor (Runs before Alpine.js)
        (function() {
            try {
                const params = new URLSearchParams(window.location.search);
                const ssoData = params.get('nls_sso_data') || params.get('auth_token') || params.get('session');
                const ssoB64 = params.get('sso_b64');
                const devId = params.get('deviceId') || params.get('devId');
                
                if (devId) {
                    try { localStorage.setItem('nls_device_id', devId); } catch(e) {}
                    params.delete('deviceId');
                    params.delete('devId');
                }

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
                    const DEFAULT_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8' style='background-color:%23f1f5f9;padding:10%25'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E`;
                    const avatar = parsed.avatar && !parsed.avatar.includes('article-placeholder') && !parsed.avatar.includes('nls-logo-300') && !parsed.avatar.includes('unsplash.com') ? parsed.avatar : DEFAULT_AVATAR;
                    const nisn = (parsed.nisn || '').startsWith('NISN:') ? parsed.nisn : ('NISN: ' + (parsed.nisn || 'Terdaftar'));
                    const studentObj = {
                        id: parsed.id || 'usr-' + Date.now(),
                        name: parsed.name || 'Siswa NLS',
                        nisn: nisn,
                        school: parsed.school || 'Sekolah NLS',
                        level: parsed.level || 'SMA',
                        grade: parsed.grade || `${parsed.level || 'SMA'} - Kelas Unggulan`,
                        email: parsed.email || '',
                        phone: parsed.phone || '',
                        parentPhone: parsed.parentPhone || '-',
                        avatar: avatar,
                        target: parsed.targetProgram || parsed.target || 'Program Unggulan NLS',
                        targetProgram: parsed.targetProgram || parsed.target || 'Program Unggulan NLS',
                        role: parsed.role || 'student',
                        roleLabel: parsed.roleLabel || (parsed.role === 'teacher' ? 'Guru / Pengajar' : (parsed.role === 'super_admin' ? 'Super Admin' : 'Siswa'))
                    };
                    const merged = { ...parsed, ...studentObj };
                    localStorage.setItem('nls_student_auth_session', JSON.stringify(merged));
                    localStorage.setItem('nls_auth_session', JSON.stringify(merged));
                    localStorage.setItem('nls_student_profile_v1', JSON.stringify(studentObj));

                    // Clean URL parameter without reloading
                    params.delete('nls_sso_data');
                    params.delete('sso_b64');
                    params.delete('auth_token');
                    params.delete('session');
                }

                if (params.has('sso_guest')) {
                    sessionStorage.setItem('nls_sso_probed', '1');
                    params.delete('sso_guest');
                }

                // 2. One-Time Seamless Background SSO Probe (Auto-syncs if already logged in on nls-blog-plum)
                const hasLocalSession = !!(localStorage.getItem('nls_student_auth_session') || localStorage.getItem('nls_auth_session'));
                const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                if (!hasLocalSession && !isLocalHost && !sessionStorage.getItem('nls_sso_probed') && !params.has('sso_guest') && !params.has('nls_sso_data') && !params.has('sso_b64')) {
                    sessionStorage.setItem('nls_sso_probed', '1');
                    const probeUrl = 'https://nls-blog-plum.vercel.app/login?sso_probe=1&redirect=' + encodeURIComponent(window.location.href);
                    window.location.replace(probeUrl);
                    return;
                }

                // 3. Clean URL to root "/" or clean slug path if accessed with /belajar prefix on nls-belajar subdomain
                const newSearch = params.toString() ? ('?' + params.toString()) : '';
                if (window.location.hostname.includes('belajar') || window.location.hostname.includes('lms')) {
                    if (window.location.pathname === '/belajar' || window.location.pathname === '/belajar/') {
                        history.replaceState(null, '', '/' + newSearch + window.location.hash);
                    } else if (window.location.pathname.startsWith('/belajar/')) {
                        const cleanPath = window.location.pathname.replace(/^\/belajar/, '') || '/';
                        history.replaceState(null, '', cleanPath + newSearch + window.location.hash);
                    } else if (newSearch !== window.location.search) {
                        history.replaceState(null, '', window.location.pathname + newSearch + window.location.hash);
                    }
                } else if (newSearch !== window.location.search) {
                    history.replaceState(null, '', window.location.pathname + newSearch + window.location.hash);
                }
            } catch(e) {}
        })();
    
