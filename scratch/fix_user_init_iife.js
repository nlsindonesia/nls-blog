const fs = require('fs');

let html = fs.readFileSync('nlsadmin/index.html', 'utf8');

const targetOld = `                // USER MANAGEMENT STATE
                userView: 'present', // 'present', 'add', 'trash'
                isUserDropdownOpen: false,
                showUserPassword: false,
                users: [],
                trashUsers: [],
                userFilter: { search: '', role: 'all', status: 'all' },`;

const targetNew = `                // USER MANAGEMENT STATE
                userView: 'present', // 'present', 'add', 'trash'
                isUserDropdownOpen: true,
                showUserPassword: false,
                userFilter: { search: '', role: 'all', status: 'all' },

                users: (function() {
                    try {
                        const stored = localStorage.getItem("nls_users_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                        }
                    } catch (e) {}
                    if (typeof window.UsersDatabase !== "undefined" && window.UsersDatabase.getAll) {
                        try {
                            const list = window.UsersDatabase.getAll();
                            if (Array.isArray(list) && list.length > 0) return list;
                        } catch (e) {}
                    }
                    return [
                        {
                            id: 'usr-1',
                            name: 'Handaka Lumu',
                            username: 'handaka.superadmin',
                            email: 'handaka@next-level-study.com',
                            phone: '085163070002',
                            role: 'Super Admin',
                            role_id: 'super_admin',
                            status: 'Aktif',
                            department: 'Direksi & Eksekutif',
                            avatar: '/nls-logo-300.png',
                            notes: 'Penanggung Jawab Utama Sistem Next Level Study',
                            last_login: '2026-08-28 10:30 WIB',
                            created_at: '2026-01-01T00:00:00.000Z'
                        },
                        {
                            id: 'usr-2',
                            name: 'Kak Raditya Pratama, M.Sc.',
                            username: 'raditya.akademik',
                            email: 'raditya@next-level-study.com',
                            phone: '081286096600',
                            role: 'Admin Akademik',
                            role_id: 'admin_akademik',
                            status: 'Aktif',
                            department: 'Divisi Kurikulum & Olimpiade',
                            avatar: '/images/pengajar/mentor-1-math.jpg',
                            notes: 'Koordinator Kalender Pembinaan OSN dan Simulasi UTBK',
                            last_login: '2026-08-28 09:15 WIB',
                            created_at: '2026-02-15T00:00:00.000Z'
                        },
                        {
                            id: 'usr-3',
                            name: 'Kak Dimas (Koordinator Pengajar)',
                            username: 'dimas.tutor',
                            email: 'dimas@next-level-study.com',
                            phone: '08170100788',
                            role: 'Koordinator Pengajar',
                            role_id: 'koordinator_pengajar',
                            status: 'Aktif',
                            department: 'Divisi Pengajar & Mutu Pendidik',
                            avatar: '/images/pengajar/mentor-6-senior-math.jpg',
                            notes: 'Verifikator Seleksi Berkas dan Microteaching Guru',
                            last_login: '2026-08-27 16:45 WIB',
                            created_at: '2026-03-10T00:00:00.000Z'
                        },
                        {
                            id: 'usr-4',
                            name: 'Tim EduTech & Penulis CMS',
                            username: 'edutech.editor',
                            email: 'edutech@next-level-study.com',
                            phone: '085810464960',
                            role: 'Content Editor',
                            role_id: 'content_editor',
                            status: 'Aktif',
                            department: 'Divisi Media & Konten Edukasi',
                            avatar: '/images/stitch/pillar-study.jpg',
                            notes: 'Penyusun Artikel Berita, Silabus, dan Panduan Belajar',
                            last_login: '2026-08-28 08:20 WIB',
                            created_at: '2026-04-01T00:00:00.000Z'
                        },
                        {
                            id: 'usr-5',
                            name: 'Admin Pusat Layanan NLS',
                            username: 'cs.pusat',
                            email: 'cs@next-level-study.com',
                            phone: '085163070002',
                            role: 'Customer Service',
                            role_id: 'customer_service',
                            status: 'Aktif',
                            department: 'Layanan & Pendaftaran Siswa',
                            avatar: '/nls-logo-300.png',
                            notes: 'Pusat Informasi Hotline WhatsApp dan Konsultasi Bimbel',
                            last_login: '2026-08-28 10:10 WIB',
                            created_at: '2026-05-01T00:00:00.000Z'
                        }
                    ];
                })(),

                trashUsers: (function() {
                    try {
                        const stored = localStorage.getItem("nls_users_trash_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed)) return parsed;
                        }
                    } catch (e) {}
                    return [];
                })(),`;

html = html.replace(targetOld, targetNew);

// Also sync with init()
if (!html.includes('// Sync & initialize users')) {
    html = html.replace(
        'init() {',
        `init() {
                    // Sync & initialize users
                    if (!localStorage.getItem("nls_users_v1")) {
                        this.saveUsersToStorage();
                    }`
    );
}

fs.writeFileSync('nlsadmin/index.html', html, 'utf8');
console.log('✅ Replaced users initial state with robust IIFE initialization');
