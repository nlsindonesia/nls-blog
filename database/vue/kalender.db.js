/**
 * ==============================================================================
 * DATABASE MODUL: KALENDER EVENT & AGENDA KEGIATAN (VUE 3 REACTIVE DB)
 * File: /database/vue/kalender.db.js
 * Sesuai Menu Admin: "1. Kalender Event (Try Out, Webinar, OSN, SNBT, TKA)"
 * ==============================================================================
 */

(function (global) {
    'use strict';

    const STORAGE_KEY = 'nls_kalender_events_v1';
    const TRASH_STORAGE_KEY = 'nls_kalender_events_trash_v1';

    // Default Fallback Data jika localStorage belum terisi
    function getDefaultEvents() {
        if (typeof window !== 'undefined' && window.NLS_DEFAULT_EVENTS && Array.isArray(window.NLS_DEFAULT_EVENTS)) {
            return JSON.parse(JSON.stringify(window.NLS_DEFAULT_EVENTS));
        }
        return [
            {
                id: 'evt-nov-snbt-grand',
                title: 'Grand Try Out Nasional: Simulasi IRT Terupdate 2026',
                category: 'SNBT',
                jenjang: 'SMA',
                jenjang_label: 'SMA / UTBK',
                date: '2026-11-20',
                end_date: '2026-11-22',
                time: '08:00 - 12:00 WIB',
                mode: 'Online (CBT NLS)',
                location: 'Portal CBT Next Level Study',
                badge_text: 'Pendaftaran Dibuka',
                description: 'Simulasi akbar UTBK-SNBT berskala nasional dengan sistem pembobotan IRT (Item Response Theory) resmi dan pembahasan video tuntas.',
                highlights: [
                    'Sistem Item Response Theory (IRT) Terstandar',
                    'Perangkingan Nasional & Analisis Peluang Lolos PTN',
                    'Pembahasan Video & Modul PDF Lengkap'
                ],
                whatsapp_message: 'Halo Admin NLS, saya ingin mendaftar Grand Try Out Nasional SNBT 2026'
            }
        ];
    }

    // Helper Reactive Creator (Vue 3 atau Fallback Vanilla Object)
    function makeReactive(target) {
        if (typeof Vue !== 'undefined' && Vue.reactive) {
            return Vue.reactive(target);
        }
        return target;
    }

    // Database Instance
    function createKalenderDatabase() {
        let initialEvents = [];
        let initialTrash = [];

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                initialEvents = JSON.parse(stored);
            } else {
                initialEvents = getDefaultEvents();
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEvents));
            }
        } catch (e) {
            console.warn('[KalenderDB] Gagal membaca storage, menggunakan default dataset:', e);
            initialEvents = getDefaultEvents();
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
            items: initialEvents,
            trash: initialTrash,
            loading: false,
            lastUpdated: new Date().toISOString()
        });

        function persist() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
                localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(state.trash));
                state.lastUpdated = new Date().toISOString();
            } catch (err) {
                console.error('[KalenderDB] Gagal menyimpan ke localStorage:', err);
            }
        }

        return {
            get state() {
                return state;
            },
            get events() {
                return state.items;
            },
            get trashEvents() {
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
                return state.items.filter(item => {
                    const c = (item.category || '').toLowerCase();
                    return c.includes(catLower) || catLower.includes(c);
                });
            },

            getByMonth(year, month) {
                const targetPrefix = `${year}-${String(month).padStart(2, '0')}`;
                return state.items.filter(item => (item.date || '').startsWith(targetPrefix));
            },

            search(keyword) {
                if (!keyword || !keyword.trim()) return this.getAll();
                const q = keyword.toLowerCase().trim();
                return state.items.filter(item =>
                    (item.title && item.title.toLowerCase().includes(q)) ||
                    (item.category && item.category.toLowerCase().includes(q)) ||
                    (item.location && item.location.toLowerCase().includes(q)) ||
                    (item.description && item.description.toLowerCase().includes(q))
                );
            },

            create(eventData) {
                const newId = eventData.id || `evt-${Date.now()}`;
                const newEvent = {
                    id: newId,
                    title: eventData.title || 'Event Baru NLS',
                    category: eventData.category || 'OSN',
                    jenjang: eventData.jenjang || 'SMA',
                    jenjang_label: eventData.jenjang_label || eventData.jenjang || 'Semua Jenjang',
                    date: eventData.date || new Date().toISOString().split('T')[0],
                    end_date: eventData.end_date || '',
                    time: eventData.time || '08:00 - 11:30 WIB',
                    mode: eventData.mode || 'Online (CBT NLS)',
                    location: eventData.location || 'Portal CBT Next Level Study',
                    badge_text: eventData.badge_text || 'Pendaftaran Dibuka',
                    description: eventData.description || '',
                    highlights: Array.isArray(eventData.highlights) ? eventData.highlights : [],
                    whatsapp_message: eventData.whatsapp_message || `Halo Admin NLS, saya tertarik dengan kegiatan ${eventData.title || ''}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                state.items.unshift(newEvent);
                persist();
                return newEvent;
            },

            update(id, updatedFields) {
                const index = state.items.findIndex(item => item.id === id);
                if (index === -1) {
                    throw new Error(`[KalenderDB] Event dengan id "${id}" tidak ditemukan.`);
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

            resetToDefault() {
                state.items = getDefaultEvents();
                state.trash = [];
                persist();
                return state.items;
            },

            exportJSON() {
                return JSON.stringify({
                    module: 'nls_kalender_database',
                    version: '1.0.0',
                    exported_at: new Date().toISOString(),
                    total_events: state.items.length,
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
                throw new Error('[KalenderDB] Format JSON tidak valid atau data kosong.');
            }
        };
    }

    global.KalenderDatabase = createKalenderDatabase();

})(typeof window !== 'undefined' ? window : globalThis);
