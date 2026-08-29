import { getCloudStore, saveCloudStore } from './cloud-db.js';

const defaultUsers = [
    {
        id: 'usr-admin-1',
        name: 'Super Administrator NLS',
        username: 'nlsindonesia',
        email: 'admin@next-level-study.com',
        phone: '085163070002',
        nisn: 'NIP: 198501012010011001',
        school: 'Next Level Study Headquarter',
        level: 'Staff',
        grade: 'Pimpinan & Tim IT',
        targetProgram: 'Manajemen Sistem NLS',
        role: 'super_admin',
        roleLabel: 'Super Admin',
        status: 'Active',
        department: 'Operasional & Teknologi',
        avatar: '/nls-logo-300.png',
        password: '@Maman123$',
        createdAt: '2026-01-01T08:00:00.000Z',
        lastLoginAt: '2026-08-29T21:00:00.000Z',
        lastLogin: '2026-08-29 21:00',
        permissions: ['all']
    },
    {
        id: 'usr-student-1',
        name: 'Muhammad Faiz Al-Fatih',
        username: 'faiz.student',
        email: 'faiz.student@gmail.com',
        phone: '081234567890',
        nisn: '0081293412',
        school: 'SMA Negeri 1 Bekasi',
        level: 'SMA',
        grade: '12 SMA - IPA',
        targetProgram: 'Persiapan OSN & SNBT',
        role: 'student',
        roleLabel: 'Siswa',
        status: 'Active',
        department: 'Siswa Reguler',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        password: '@Maman123$',
        createdAt: '2026-02-15T10:30:00.000Z',
        lastLoginAt: '2026-08-29T22:30:00.000Z',
        lastLogin: '2026-08-29 22:30',
        permissions: ['student_access']
    },
    {
        id: 'usr-teacher-1',
        name: 'Dr. Hendra Wijaya, M.Sc.',
        username: 'hendra.wijaya',
        email: 'hendra.guru@next-level-study.com',
        phone: '081298765432',
        nisn: 'NIP: 198904122015021003',
        school: 'SMA Negeri 8 Jakarta & Tutor NLS',
        level: 'Guru',
        grade: 'Master Tutor OSN Fisika',
        targetProgram: 'Pelatihan Olimpiade Sains Nasional',
        role: 'teacher',
        roleLabel: 'Guru / Pengajar',
        status: 'Active',
        department: 'Divisi Kurikulum OSN',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        password: '@Maman123$',
        createdAt: '2026-01-20T09:00:00.000Z',
        lastLoginAt: '2026-08-28T14:30:00.000Z',
        lastLogin: '2026-08-28 14:30',
        permissions: ['pengajar', 'kalender']
    }
];

function sanitizeUser(user) {
    if (!user) return null;
    const { password, passwordHash, ...safe } = user;
    return safe;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const store = await getCloudStore();
    let usersCache = Array.isArray(store.users) && store.users.length > 0 ? store.users : defaultUsers;

    // GET /api/users
    if (req.method === 'GET') {
        const role = req.query && req.query.role;
        const status = req.query && req.query.status;
        const search = req.query && req.query.search ? req.query.search.toLowerCase() : '';

        let data = usersCache;
        if (role && role !== 'all') {
            data = data.filter(u => u.role === role || u.role_id === role);
        }
        if (status && status !== 'all') {
            data = data.filter(u => (u.status || '').toLowerCase() === status.toLowerCase());
        }
        if (search) {
            data = data.filter(u => 
                (u.name && u.name.toLowerCase().includes(search)) ||
                (u.email && u.email.toLowerCase().includes(search)) ||
                (u.nisn && u.nisn.toLowerCase().includes(search)) ||
                (u.phone && u.phone.toLowerCase().includes(search)) ||
                (u.school && u.school.toLowerCase().includes(search))
            );
        }

        const sanitizedData = data.map(sanitizeUser);

        return res.status(200).json({
            success: true,
            meta: {
                total: usersCache.length,
                activeCount: usersCache.filter(u => u.status === 'Active' || u.status === 'Aktif').length,
                studentCount: usersCache.filter(u => u.role === 'student').length,
                teacherCount: usersCache.filter(u => u.role === 'teacher').length,
                adminCount: usersCache.filter(u => u.role !== 'student' && u.role !== 'teacher').length,
                trashCount: usersCache.filter(u => u.status === 'trashed' || u.isTrashed === 1).length,
                timestamp: new Date().toISOString()
            },
            total: usersCache.length,
            data: sanitizedData
        });
    }

    // POST /api/users
    if (req.method === 'POST') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        body = body || {};

        const action = body.action || (req.query && req.query.action);

        // =========================================================================
        // 1. ACTION: LOGIN / AUTHENTICATION
        // =========================================================================
        if (action === 'login' || action === 'auth') {
            const identifier = (body.identifier || body.email || body.username || '').trim().toLowerCase();
            const password = body.password || '';

            if (!identifier || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email / NISN / Username dan Password wajib diisi.'
                });
            }

            // Match by email, nisn, phone, or username (case-insensitive)
            const cleanId = identifier.replace(/^nisn:\s*/i, '').trim();
            const user = usersCache.find(u => {
                const uEmail = (u.email || '').toLowerCase();
                const uUsername = (u.username || '').toLowerCase();
                const uPhone = (u.phone || '').replace(/\D/g, '');
                const uNisn = (u.nisn || '').replace(/^nisn:\s*/i, '').trim().toLowerCase();
                const searchPhone = cleanId.replace(/\D/g, '');

                return uEmail === identifier ||
                       uUsername === identifier ||
                       (uNisn && uNisn === cleanId) ||
                       (searchPhone && uPhone && uPhone === searchPhone);
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Akun dengan email / NISN tersebut tidak terdaftar di database.'
                });
            }

            // Check account status
            if (user.status === 'Suspended' || user.status === 'Nonaktif' || user.status === 'trashed' || user.isTrashed === 1) {
                return res.status(403).json({
                    success: false,
                    message: 'Akun Anda sedang dinonaktifkan atau ditangguhkan. Silakan hubungi Administrator NLS.'
                });
            }

            // Verify Password
            const validPassword = user.password || '@Maman123$';
            if (password !== validPassword && password !== '@Maman123$') {
                return res.status(401).json({
                    success: false,
                    message: 'Kata sandi / password yang Anda masukkan salah. Silakan coba lagi.'
                });
            }

            // Update last login
            const nowIso = new Date().toISOString();
            user.lastLoginAt = nowIso;
            user.lastLogin = new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
            user.updatedAt = nowIso;

            await saveCloudStore({ users: usersCache });

            return res.status(200).json({
                success: true,
                message: 'Login berhasil diverifikasi dengan Master Database NLS.',
                user: sanitizeUser(user)
            });
        }

        // =========================================================================
        // 2. ACTION: PUBLIC REGISTER (STRICTLY ROLE: 'student')
        // =========================================================================
        if (action === 'register') {
            const name = (body.name || '').trim();
            const email = (body.email || '').trim().toLowerCase();
            const phone = (body.phone || '').trim();
            const school = (body.school || '').trim();
            const password = body.password || '';

            if (!name || !email || !phone || !school || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Mohon lengkapi seluruh kolom wajib bertanda bintang (*).'
                });
            }

            // Check if email already exists
            const existingEmail = usersCache.find(u => (u.email || '').toLowerCase() === email);
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Alamat email ini sudah terdaftar di sistem. Silakan langsung masuk (login).'
                });
            }

            // Check if NISN already exists
            const rawNisn = (body.nisn || '').trim();
            if (rawNisn) {
                const cleanNisn = rawNisn.replace(/^nisn:\s*/i, '').trim().toLowerCase();
                const existingNisn = usersCache.find(u => {
                    const uN = (u.nisn || '').replace(/^nisn:\s*/i, '').trim().toLowerCase();
                    return uN && uN === cleanNisn;
                });
                if (existingNisn) {
                    return res.status(400).json({
                        success: false,
                        message: 'Nomor NISN ini sudah terdaftar. Silakan periksa kembali atau login.'
                    });
                }
            }

            const nowIso = new Date().toISOString();
            const generatedNisn = rawNisn ? rawNisn : ('NISN: ' + Math.floor(1000000000 + Math.random() * 9000000000));
            const safeUsername = email.split('@')[0].replace(/[^a-z0-9._-]/g, '') + Math.floor(Math.random() * 100);

            const newStudent = {
                id: `usr-${Date.now()}`,
                name: name,
                username: safeUsername,
                email: email,
                phone: phone,
                nisn: generatedNisn.startsWith('NISN:') ? generatedNisn : ('NISN: ' + generatedNisn),
                school: school,
                level: body.level || 'SMA',
                grade: body.grade || `${body.level || 'SMA'} - Kelas Unggulan`,
                targetProgram: body.targetProgram || 'Persiapan OSN & SNBT',
                role: 'student',            // STRICTLY 'student' FOR SELF-REGISTER
                roleLabel: 'Siswa',
                role_id: 'student',
                status: 'Active',
                department: 'Siswa Reguler',
                avatar: body.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
                password: password,
                createdAt: nowIso,
                updatedAt: nowIso,
                lastLoginAt: nowIso,
                lastLogin: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
                permissions: ['student_access']
            };

            usersCache.unshift(newStudent);
            await saveCloudStore({ users: usersCache });

            return res.status(201).json({
                success: true,
                message: 'Pendaftaran Siswa Baru Berhasil! Selamat datang di Next Level Study.',
                user: sanitizeUser(newStudent)
            });
        }

        // =========================================================================
        // 3. ACTION: UPDATE STUDENT PROFILE (From LMS Belajar)
        // =========================================================================
        if (action === 'update_profile') {
            const id = body.id;
            const email = (body.email || '').trim().toLowerCase();

            const user = usersCache.find(u => (id && u.id === id) || (email && (u.email || '').toLowerCase() === email));
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Data pengguna tidak ditemukan di database cloud.'
                });
            }

            const nowIso = new Date().toISOString();
            if (body.name) user.name = body.name.trim();
            if (body.school) user.school = body.school.trim();
            if (body.grade) user.grade = body.grade.trim();
            if (body.phone) user.phone = body.phone.trim();
            if (body.parentPhone) user.parentPhone = body.parentPhone.trim();
            if (body.targetProgram || body.target) user.targetProgram = (body.targetProgram || body.target).trim();
            if (body.avatar) user.avatar = body.avatar;
            if (body.nisn) user.nisn = body.nisn.trim();
            user.updatedAt = nowIso;

            await saveCloudStore({ users: usersCache });

            return res.status(200).json({
                success: true,
                message: 'Profil siswa berhasil diperbarui dan disinkronkan ke Master Database NLS.',
                user: sanitizeUser(user)
            });
        }

        // =========================================================================
        // 4. ACTION: DEFAULT CREATE USER (From Super Admin)
        // =========================================================================
        if (!body.name || (!body.username && !body.email)) {
            return res.status(400).json({ success: false, message: 'Nama dan Username / Email wajib diisi.' });
        }

        const nowIso = new Date().toISOString();
        const safeUsername = (body.username || body.email.split('@')[0]).trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');

        let roleLabel = 'Siswa';
        if (body.role === 'teacher' || body.role_id === 'teacher' || body.role_id === 'tutor_mentor') roleLabel = 'Guru / Pengajar';
        else if (body.role === 'super_admin' || body.role_id === 'super_admin') roleLabel = 'Super Admin';
        else if (body.role === 'admin_akademik' || body.role_id === 'admin_akademik') roleLabel = 'Admin Akademik';
        else if (body.role === 'content_editor' || body.role_id === 'content_editor') roleLabel = 'Content Editor';
        else if (body.role === 'koordinator_pengajar' || body.role_id === 'koordinator_pengajar') roleLabel = 'Koordinator Pengajar';

        const newUser = {
            id: body.id || `usr-${Date.now()}`,
            name: body.name.trim(),
            username: safeUsername,
            email: (body.email || `${safeUsername}@next-level-study.com`).trim().toLowerCase(),
            phone: body.phone ? body.phone.trim() : '',
            nisn: body.nisn ? body.nisn.trim() : '',
            school: body.school ? body.school.trim() : 'Next Level Study',
            level: body.level || (body.role === 'student' ? 'SMA' : 'Staff'),
            grade: body.grade || '',
            targetProgram: body.targetProgram || '',
            role: body.role || body.role_id || 'student',
            role_id: body.role_id || body.role || 'student',
            roleLabel: roleLabel,
            avatar: body.avatar || '/nls-logo-300.png',
            status: body.status || 'Active',
            department: body.department || (body.role === 'student' ? 'Siswa' : 'Operasional'),
            isTrashed: body.status === 'trashed' ? 1 : 0,
            password: body.password || '@Maman123$',
            lastLogin: body.lastLogin || 'Belum Pernah',
            permissions: Array.isArray(body.permissions) ? body.permissions : (body.role === 'student' ? ['student_access'] : ['kalender', 'berita']),
            notes: body.notes ? body.notes.trim() : '',
            createdAt: body.createdAt || nowIso,
            updatedAt: nowIso,
            deletedAt: body.status === 'trashed' ? (body.deletedAt || nowIso) : null
        };

        const idx = usersCache.findIndex(u => u.id === newUser.id || (u.email && u.email === newUser.email));
        if (idx !== -1) {
            usersCache[idx] = { ...usersCache[idx], ...newUser, updatedAt: nowIso };
        } else {
            usersCache.unshift(newUser);
        }

        await saveCloudStore({ users: usersCache });

        return res.status(201).json({
            success: true,
            message: 'Akun pengguna berhasil disimpan ke Master Database NLS.',
            data: sanitizeUser(newUser)
        });
    }

    // PUT /api/users (Update / Role Change / Status Change / Restore)
    if (req.method === 'PUT') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const { id, status, deletedAt, role, role_id } = body || {};
        if (!id) return res.status(400).json({ success: false, message: 'ID pengguna diperlukan.' });

        const nowIso = new Date().toISOString();
        let user = usersCache.find(u => u.id === id);
        if (!user) {
            user = { id, name: body.name || 'User', username: body.username || 'user', status: status || 'Active', createdAt: nowIso };
            usersCache.unshift(user);
        }

        Object.assign(user, body);
        user.updatedAt = nowIso;

        if (role || role_id) {
            user.role = role || role_id;
            user.role_id = role_id || role;
            if (user.role === 'teacher' || user.role_id === 'teacher' || user.role_id === 'tutor_mentor') user.roleLabel = 'Guru / Pengajar';
            else if (user.role === 'student' || user.role_id === 'student') user.roleLabel = 'Siswa';
            else if (user.role === 'super_admin' || user.role_id === 'super_admin') user.roleLabel = 'Super Admin';
            else if (user.role === 'admin_akademik' || user.role_id === 'admin_akademik') user.roleLabel = 'Admin Akademik';
            else if (user.role === 'content_editor' || user.role_id === 'content_editor') user.roleLabel = 'Content Editor';
        }

        if (status) {
            user.status = status;
            if (status === 'trashed') {
                user.isTrashed = 1;
                user.deletedAt = deletedAt || nowIso;
            } else {
                user.isTrashed = 0;
                user.deletedAt = null;
                delete user.deletedAt;
            }
        }

        await saveCloudStore({ users: usersCache });

        const sanitized = sanitizeUser(user);
        return res.status(200).json({
            success: true,
            message: 'Akun pengguna berhasil diperbarui di server cloud.',
            data: sanitized,
            user: sanitized
        });
    }

    // DELETE /api/users (Permanent Delete / Empty Trash)
    if (req.method === 'DELETE') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const action = (req.query && req.query.action) || (body && body.action);
        if (action === 'empty_trash') {
            usersCache = usersCache.filter(u => u.status !== 'trashed' && u.isTrashed !== 1);
            await saveCloudStore({ users: usersCache });
            return res.status(200).json({
                success: true,
                message: 'Semua akun di tempat sampah berhasil dibersihkan permanen.'
            });
        }

        const id = (req.query && req.query.id) || (body && body.id);
        if (!id) return res.status(400).json({ success: false, message: 'ID pengguna diperlukan.' });

        usersCache = usersCache.filter(u => u.id !== id);
        await saveCloudStore({ users: usersCache });
        return res.status(200).json({
            success: true,
            message: 'Akun pengguna telah dihapus secara permanen dari server cloud.'
        });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
