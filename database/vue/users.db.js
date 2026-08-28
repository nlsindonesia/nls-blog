/**
 * ==============================================================================
 * DATABASE MODUL: USER MANAGEMENT & ROLE CONTROL (VUE 3 REACTIVE DB)
 * File: /database/vue/users.db.js
 * Sesuai Menu Admin: "4. User Management (Add User, Present User, Trash)"
 * ==============================================================================
 */

(function (global) {
    'use strict';

    const STORAGE_KEY = 'nls_users_v1';
    const TRASH_STORAGE_KEY = 'nls_users_trash_v1';

    const ROLES = [
        { id: 'super_admin', label: 'Super Admin', color: 'rose', desc: 'Akses Penuh Seluruh Modul & Pengaturan Sistem' },
        { id: 'admin_akademik', label: 'Admin Akademik', color: 'sky', desc: 'Kelola Jadwal Kalender, Event CBT, dan Agenda Try Out' },
        { id: 'content_editor', label: 'Content Editor', color: 'emerald', desc: 'Kelola Berita, Artikel Blog, dan Optimasi SEO' },
        { id: 'koordinator_pengajar', label: 'Koordinator Pengajar', color: 'indigo', desc: 'Kelola Direktori Mentor & Verifikasi Pelamar Guru' },
        { id: 'customer_service', label: 'Customer Service', color: 'amber', desc: 'Kelola Konsultasi Pendaftaran & Chat WhatsApp' },
        { id: 'tutor_mentor', label: 'Tutor / Mentor Ahli', color: 'purple', desc: 'Akses Profil Pengajar & Catatan Pembinaan Siswa' }
    ];

    function getDefaultUsers() {
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
                created_at: '2026-01-01T00:00:00.000Z',
                updated_at: new Date().toISOString()
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
                created_at: '2026-02-15T00:00:00.000Z',
                updated_at: new Date().toISOString()
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
                created_at: '2026-03-10T00:00:00.000Z',
                updated_at: new Date().toISOString()
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
                created_at: '2026-04-01T00:00:00.000Z',
                updated_at: new Date().toISOString()
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
                created_at: '2026-05-01T00:00:00.000Z',
                updated_at: new Date().toISOString()
            }
        ];
    }

    function makeReactive(target) {
        if (typeof Vue !== 'undefined' && Vue.reactive) {
            return Vue.reactive(target);
        }
        return target;
    }

    function createUsersDatabase() {
        let initialUsers = [];
        let initialTrash = [];

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                initialUsers = JSON.parse(stored);
            } else {
                initialUsers = getDefaultUsers();
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
            }
        } catch (e) {
            console.warn('[UsersDB] Gagal membaca storage, menggunakan default dataset:', e);
            initialUsers = getDefaultUsers();
        }

        try {
            const trashStored = localStorage.getItem(TRASH_STORAGE_KEY);
            if (trashStored) {
                initialTrash = JSON.parse(trashStored);
            }
        } catch (e) {
            initialTrash = [];
        }

        const state = makeReactive({
            items: initialUsers,
            trash: initialTrash,
            roles: ROLES,
            loading: false,
            lastUpdated: new Date().toISOString()
        });

        function persist() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
                localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(state.trash));
                state.lastUpdated = new Date().toISOString();
            } catch (err) {
                console.error('[UsersDB] Gagal menyimpan ke localStorage:', err);
            }
        }

        return {
            get state() {
                return state;
            },
            get users() {
                return state.items;
            },
            get trashUsers() {
                return state.trash;
            },
            get roles() {
                return state.roles;
            },

            getAll() {
                return [...state.items];
            },

            getById(id) {
                return state.items.find(u => u.id === id) || null;
            },

            getByRole(role) {
                if (!role || role === 'all') return this.getAll();
                const rLower = role.toLowerCase();
                return state.items.filter(u =>
                    (u.role && u.role.toLowerCase() === rLower) ||
                    (u.role_id && u.role_id.toLowerCase() === rLower)
                );
            },

            search(keyword) {
                if (!keyword || !keyword.trim()) return this.getAll();
                const q = keyword.toLowerCase().trim();
                return state.items.filter(u =>
                    (u.name && u.name.toLowerCase().includes(q)) ||
                    (u.username && u.username.toLowerCase().includes(q)) ||
                    (u.email && u.email.toLowerCase().includes(q)) ||
                    (u.phone && u.phone.toLowerCase().includes(q)) ||
                    (u.role && u.role.toLowerCase().includes(q)) ||
                    (u.department && u.department.toLowerCase().includes(q))
                );
            },

            create(userData) {
                const newId = userData.id || `usr-${Date.now()}`;
                const newUser = {
                    id: newId,
                    name: userData.name || 'Pengguna Baru',
                    username: userData.username || `user_${Date.now().toString().slice(-4)}`,
                    email: userData.email || '',
                    phone: userData.phone || userData.wa || '',
                    role: userData.role || 'Admin Akademik',
                    role_id: userData.role_id || 'admin_akademik',
                    status: userData.status || 'Aktif',
                    department: userData.department || 'Operasional NLS',
                    avatar: userData.avatar || '/nls-logo-300.png',
                    notes: userData.notes || '',
                    last_login: 'Belum pernah login',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                state.items.unshift(newUser);
                persist();
                return newUser;
            },

            update(id, updatedFields) {
                const index = state.items.findIndex(u => u.id === id);
                if (index === -1) {
                    throw new Error(`[UsersDB] User dengan id "${id}" tidak ditemukan.`);
                }

                state.items[index] = {
                    ...state.items[index],
                    ...updatedFields,
                    updated_at: new Date().toISOString()
                };
                persist();
                return state.items[index];
            },

            moveToTrash(id) {
                const index = state.items.findIndex(u => u.id === id);
                if (index !== -1) {
                    const [deleted] = state.items.splice(index, 1);
                    deleted.deleted_at = new Date().toISOString();
                    state.trash.unshift(deleted);
                    persist();
                    return true;
                }
                return false;
            },

            restore(id) {
                const index = state.trash.findIndex(u => u.id === id);
                if (index !== -1) {
                    const [restored] = state.trash.splice(index, 1);
                    delete restored.deleted_at;
                    restored.updated_at = new Date().toISOString();
                    state.items.unshift(restored);
                    persist();
                    return true;
                }
                return false;
            },

            forceDelete(id) {
                const trashIndex = state.trash.findIndex(u => u.id === id);
                if (trashIndex !== -1) {
                    state.trash.splice(trashIndex, 1);
                    persist();
                    return true;
                }
                const activeIndex = state.items.findIndex(u => u.id === id);
                if (activeIndex !== -1) {
                    state.items.splice(activeIndex, 1);
                    persist();
                    return true;
                }
                return false;
            },

            emptyTrash() {
                state.trash.splice(0, state.trash.length);
                persist();
            },

            resetToDefault() {
                state.items = getDefaultUsers();
                state.trash = [];
                persist();
                return state.items;
            },

            exportJSON() {
                return JSON.stringify({
                    module: 'nls_users_database',
                    version: '1.0.0',
                    exported_at: new Date().toISOString(),
                    total_users: state.items.length,
                    data: state.items
                }, null, 2);
            },

            importJSON(jsonString) {
                const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
                const itemsToImport = Array.isArray(parsed) ? parsed : (parsed.data || []);
                if (Array.isArray(itemsToImport) && itemsToImport.length > 0) {
                    state.items = itemsToImport;
                    persist();
                    return state.items.length;
                }
                throw new Error('[UsersDB] Format JSON tidak valid atau data kosong.');
            }
        };
    }

    global.UsersDatabase = createUsersDatabase();

})(typeof window !== 'undefined' ? window : globalThis);
