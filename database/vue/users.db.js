/**
 * ==============================================================================
 * DATABASE MODUL: USER MANAGEMENT & ROLE CONTROL (CLOUD-FIRST VUE 3 REACTIVE DB)
 * File: /database/vue/users.db.js
 * Master Cloud DB Sync (/api/users) - Local dummy user data fully purged.
 * ==============================================================================
 */

(function (global) {
    'use strict';

    // Purge any deprecated local user storage keys
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('nls_users_v1');
            localStorage.removeItem('nls_users_trash_v1');
            localStorage.removeItem('nls_registered_users_v1');
            localStorage.removeItem('nls_temp_users');
            localStorage.removeItem('nls_mock_users');
        }
    } catch (e) {}

    const ROLES = [
        { id: 'super_admin', label: 'Super Admin', color: 'rose', desc: 'Akses Penuh Seluruh Modul & Pengaturan Sistem' },
        { id: 'admin_akademik', label: 'Admin Akademik', color: 'sky', desc: 'Kelola Jadwal Kalender, Event CBT, dan Agenda Try Out' },
        { id: 'content_editor', label: 'Content Editor', color: 'emerald', desc: 'Kelola Berita, Artikel Blog, dan Optimasi SEO' },
        { id: 'koordinator_pengajar', label: 'Koordinator Pengajar', color: 'indigo', desc: 'Kelola Direktori Mentor & Verifikasi Pelamar Guru' },
        { id: 'customer_service', label: 'Customer Service', color: 'amber', desc: 'Kelola Konsultasi Pendaftaran & Chat WhatsApp' },
        { id: 'tutor_mentor', label: 'Tutor / Mentor Ahli', color: 'purple', desc: 'Akses Profil Pengajar & Catatan Pembinaan Siswa' },
        { id: 'student', label: 'Siswa / Peserta Belajar', color: 'blue', desc: 'Akses Kelas Belajar & Try Out' }
    ];

    function makeReactive(target) {
        if (typeof Vue !== 'undefined' && Vue.reactive) {
            return Vue.reactive(target);
        }
        return target;
    }

    function createUsersDatabase() {
        const state = makeReactive({
            items: [],
            trash: [],
            roles: ROLES,
            loading: false,
            lastUpdated: new Date().toISOString()
        });

        async function fetchFromCloud() {
            state.loading = true;
            try {
                const res = await fetch('/api/users');
                if (res.ok) {
                    const json = await res.json();
                    if (json && Array.isArray(json.data)) {
                        state.items = json.data.filter(u => u.status !== 'trashed' && u.isTrashed !== 1);
                        state.trash = json.data.filter(u => u.status === 'trashed' || u.isTrashed === 1);
                        state.lastUpdated = new Date().toISOString();
                    }
                }
            } catch (err) {
                console.warn('[UsersDB] Fetch /api/users cloud error:', err);
            } finally {
                state.loading = false;
            }
        }

        // Trigger immediate cloud fetch
        if (typeof window !== 'undefined') {
            fetchFromCloud();
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

            async fetchCloud() {
                await fetchFromCloud();
                return state.items;
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

            async create(userData) {
                state.loading = true;
                try {
                    const res = await fetch('/api/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userData)
                    });
                    const json = await res.json();
                    if (json.success && json.data) {
                        state.items.unshift(json.data);
                        return json.data;
                    }
                    throw new Error(json.message || 'Gagal menyimpan user ke Cloud DB');
                } finally {
                    state.loading = false;
                }
            },

            async update(id, updatedFields) {
                state.loading = true;
                try {
                    const res = await fetch('/api/users', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id, ...updatedFields })
                    });
                    const json = await res.json();
                    if (json.success && json.data) {
                        const idx = state.items.findIndex(u => u.id === id);
                        if (idx !== -1) state.items[idx] = json.data;
                        return json.data;
                    }
                    throw new Error(json.message || 'Gagal memperbarui user di Cloud DB');
                } finally {
                    state.loading = false;
                }
            },

            async moveToTrash(id) {
                state.loading = true;
                try {
                    const res = await fetch('/api/users', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id, permanent: false })
                    });
                    const json = await res.json();
                    if (json.success) {
                        const index = state.items.findIndex(u => u.id === id);
                        if (index !== -1) {
                            const [deleted] = state.items.splice(index, 1);
                            deleted.status = 'trashed';
                            deleted.isTrashed = 1;
                            state.trash.unshift(deleted);
                        }
                        return true;
                    }
                    return false;
                } finally {
                    state.loading = false;
                }
            },

            async restore(id) {
                state.loading = true;
                try {
                    const res = await fetch('/api/users', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id, action: 'restore' })
                    });
                    const json = await res.json();
                    if (json.success && json.data) {
                        const index = state.trash.findIndex(u => u.id === id);
                        if (index !== -1) {
                            state.trash.splice(index, 1);
                            state.items.unshift(json.data);
                        }
                        return true;
                    }
                    return false;
                } finally {
                    state.loading = false;
                }
            },

            async forceDelete(id) {
                state.loading = true;
                try {
                    const res = await fetch('/api/users', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id, permanent: true })
                    });
                    const json = await res.json();
                    if (json.success) {
                        const trashIndex = state.trash.findIndex(u => u.id === id);
                        if (trashIndex !== -1) state.trash.splice(trashIndex, 1);
                        const activeIndex = state.items.findIndex(u => u.id === id);
                        if (activeIndex !== -1) state.items.splice(activeIndex, 1);
                        return true;
                    }
                    return false;
                } finally {
                    state.loading = false;
                }
            },

            async emptyTrash() {
                state.loading = true;
                try {
                    for (const u of [...state.trash]) {
                        await this.forceDelete(u.id);
                    }
                    state.trash = [];
                } finally {
                    state.loading = false;
                }
            },

            exportJSON() {
                return JSON.stringify({
                    module: 'nls_users_cloud_database',
                    version: '2.0.0',
                    exported_at: new Date().toISOString(),
                    total_users: state.items.length,
                    data: state.items
                }, null, 2);
            }
        };
    }

    global.UsersDatabase = createUsersDatabase();

})(typeof window !== 'undefined' ? window : globalThis);
