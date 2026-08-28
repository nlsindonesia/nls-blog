/**
 * ==============================================================================
 * DATABASE MODUL: DAFTAR PENGAJAR & VERIFIKASI GURU (VUE 3 REACTIVE DB)
 * File: /database/vue/pengajar.db.js
 * Sesuai Menu Admin: "3. Daftar Pengajar & Verifikasi Guru (Teacher Directory)"
 * ==============================================================================
 */

(function (global) {
    'use strict';

    const STORAGE_KEY = 'nls_pengajar_teachers_v1';
    const APPLICATIONS_KEY = 'nls_teacher_applications_v1';
    const TRASH_STORAGE_KEY = 'nls_pengajar_teachers_trash_v1';

    function getDefaultTeachers() {
        if (typeof window !== 'undefined' && window.NLS_DEFAULT_TEACHERS && Array.isArray(window.NLS_DEFAULT_TEACHERS)) {
            return JSON.parse(JSON.stringify(window.NLS_DEFAULT_TEACHERS));
        }
        return [];
    }

    function makeReactive(target) {
        if (typeof Vue !== 'undefined' && Vue.reactive) {
            return Vue.reactive(target);
        }
        return target;
    }

    function createPengajarDatabase() {
        let initialTeachers = [];
        let initialApplications = [];
        let initialTrash = [];

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                initialTeachers = JSON.parse(stored);
            } else {
                initialTeachers = getDefaultTeachers();
                if (initialTeachers.length > 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTeachers));
                }
            }
        } catch (e) {
            console.warn('[PengajarDB] Gagal membaca storage pengajar, menggunakan default:', e);
            initialTeachers = getDefaultTeachers();
        }

        try {
            const appsStored = localStorage.getItem(APPLICATIONS_KEY);
            if (appsStored) {
                initialApplications = JSON.parse(appsStored);
            }
        } catch (e) {
            initialApplications = [];
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
            items: initialTeachers,
            applications: initialApplications,
            trash: initialTrash,
            loading: false,
            lastUpdated: new Date().toISOString()
        });

        function persist() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
                localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(state.applications));
                localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(state.trash));
                state.lastUpdated = new Date().toISOString();
            } catch (err) {
                console.error('[PengajarDB] Gagal menyimpan ke localStorage:', err);
            }
        }

        return {
            get state() {
                return state;
            },
            get teachers() {
                return state.items;
            },
            get applications() {
                return state.applications;
            },
            get trashTeachers() {
                return state.trash;
            },

            getAll() {
                return [...state.items];
            },

            getById(id) {
                return state.items.find(item => item.id === id) || null;
            },

            getByCategory(category) {
                if (!category || category === 'all') return this.getAll();
                const catLower = category.toLowerCase();
                return state.items.filter(t => (t.categories || []).some(c => c.toLowerCase() === catLower));
            },

            getByJenjang(jenjang) {
                if (!jenjang || jenjang === 'all') return this.getAll();
                const jLower = jenjang.toLowerCase();
                return state.items.filter(t => (t.jenjang || []).some(j => j.toLowerCase() === jLower));
            },

            search(keyword) {
                if (!keyword || !keyword.trim()) return this.getAll();
                const q = keyword.toLowerCase().trim();
                return state.items.filter(t =>
                    (t.name && t.name.toLowerCase().includes(q)) ||
                    (t.shortName && t.shortName.toLowerCase().includes(q)) ||
                    (t.education && t.education.toLowerCase().includes(q)) ||
                    (t.subject && t.subject.toLowerCase().includes(q)) ||
                    (t.kebutuhanPrivat && t.kebutuhanPrivat.toLowerCase().includes(q))
                );
            },

            create(teacherData) {
                const newId = teacherData.id || `t-${Date.now()}`;
                const newTeacher = {
                    id: newId,
                    name: teacherData.name || 'Nama Pengajar',
                    shortName: teacherData.shortName || teacherData.short_name || 'Tutor NLS',
                    photo: teacherData.photo || '/images/pengajar/mentor-1-math.jpg',
                    education: teacherData.education || '',
                    categories: Array.isArray(teacherData.categories) ? teacherData.categories : ['OSN'],
                    jenjang: Array.isArray(teacherData.jenjang) ? teacherData.jenjang : ['SMA'],
                    jenjangLabel: teacherData.jenjangLabel || teacherData.jenjang_label || 'SMA & Alumni',
                    subject: teacherData.subject || 'Matematika',
                    subjects: Array.isArray(teacherData.subjects) ? teacherData.subjects : [teacherData.subject || 'Matematika'],
                    kebutuhanPrivat: teacherData.kebutuhanPrivat || teacherData.kebutuhan_privat || 'Bimbel & Privat',
                    philosophy: teacherData.philosophy || '',
                    highlights: Array.isArray(teacherData.highlights) ? teacherData.highlights : [
                        'Membimbing 20+ peraih medali OSN Nasional',
                        'Tutor privat Cambridge A-Level & IB Diploma',
                        'Alumni bimbingan lolos ITB, UI, dan UGM'
                    ],
                    rating: typeof teacherData.rating === 'number' ? teacherData.rating : 4.9,
                    reviewCount: typeof teacherData.reviewCount === 'number' ? teacherData.reviewCount : 24,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                state.items.unshift(newTeacher);
                persist();
                return newTeacher;
            },

            update(id, updatedFields) {
                const index = state.items.findIndex(item => item.id === id);
                if (index === -1) {
                    throw new Error(`[PengajarDB] Pengajar dengan id "${id}" tidak ditemukan.`);
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
                const index = state.items.findIndex(item => item.id === id);
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
                const index = state.trash.findIndex(item => item.id === id);
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
                const trashIndex = state.trash.findIndex(item => item.id === id);
                if (trashIndex !== -1) {
                    state.trash.splice(trashIndex, 1);
                    persist();
                    return true;
                }
                const activeIndex = state.items.findIndex(item => item.id === id);
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

            // Teacher Applications & Verification Workflow
            getPendingApplications() {
                return state.applications.filter(app => app.status === 'pending');
            },

            submitApplication(applicationData) {
                const newApp = {
                    id: applicationData.id || `app-${Date.now()}`,
                    name: applicationData.name || '',
                    phone: applicationData.phone || applicationData.wa || '',
                    email: applicationData.email || '',
                    education: applicationData.education || '',
                    subject: applicationData.subject || '',
                    cv_link: applicationData.cv_link || applicationData.portfolio || '',
                    status: 'pending', // 'pending', 'approved', 'rejected'
                    applied_at: new Date().toISOString()
                };
                state.applications.unshift(newApp);
                persist();
                return newApp;
            },

            approveApplication(appId) {
                const appIndex = state.applications.findIndex(a => a.id === appId);
                if (appIndex === -1) throw new Error(`[PengajarDB] Aplikasi ${appId} tidak ditemukan.`);

                const app = state.applications[appIndex];
                app.status = 'approved';
                app.reviewed_at = new Date().toISOString();

                // Auto-create teacher profile
                const createdTeacher = this.create({
                    name: app.name,
                    shortName: app.name.split(' ')[0],
                    education: app.education,
                    subject: app.subject,
                    kebutuhanPrivat: 'Bimbel & Privat'
                });

                persist();
                return { application: app, teacher: createdTeacher };
            },

            rejectApplication(appId, reason) {
                const appIndex = state.applications.findIndex(a => a.id === appId);
                if (appIndex === -1) throw new Error(`[PengajarDB] Aplikasi ${appId} tidak ditemukan.`);

                state.applications[appIndex].status = 'rejected';
                state.applications[appIndex].rejection_reason = reason || 'Kriteria belum memenuhi standar saat ini.';
                state.applications[appIndex].reviewed_at = new Date().toISOString();
                persist();
                return state.applications[appIndex];
            },

            resetToDefault() {
                state.items = getDefaultTeachers();
                state.trash = [];
                persist();
                return state.items;
            },

            exportJSON() {
                return JSON.stringify({
                    module: 'nls_pengajar_database',
                    version: '1.0.0',
                    exported_at: new Date().toISOString(),
                    total_teachers: state.items.length,
                    total_applications: state.applications.length,
                    data: {
                        teachers: state.items,
                        applications: state.applications
                    }
                }, null, 2);
            },

            importJSON(jsonString) {
                const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
                if (parsed && parsed.data && Array.isArray(parsed.data.teachers)) {
                    state.items = parsed.data.teachers;
                    if (Array.isArray(parsed.data.applications)) {
                        state.applications = parsed.data.applications;
                    }
                    persist();
                    return state.items.length;
                } else if (Array.isArray(parsed)) {
                    state.items = parsed;
                    persist();
                    return state.items.length;
                }
                throw new Error('[PengajarDB] Format JSON tidak valid.');
            }
        };
    }

    global.PengajarDatabase = createPengajarDatabase();

})(typeof window !== 'undefined' ? window : globalThis);
