/**
 * ==============================================================================
 * CENTRAL VUE 3 DATABASE REGISTRY & COMPOSABLES — NEXT LEVEL STUDY (NLS)
 * File: /database/vue/index.js
 * 
 * Mengintegrasikan seluruh database modul berdasarkan 3 Menu Utama Admin:
 * 1. KalenderDatabase  (Menu 1: Kalender Event & Try Out)
 * 2. BeritaDatabase    (Menu 2: Berita & Artikel CMS)
 * 3. PengajarDatabase  (Menu 3: Direktori Pengajar & Verifikasi Guru)
 * ==============================================================================
 */

(function (global) {
    'use strict';

    // Global Database Core Object
    const NlsDatabase = {
        version: '1.0.0',
        name: 'Next Level Study Reactive Database',

        // Modul-modul Menu Admin
        get kalender() {
            return global.KalenderDatabase;
        },
        get berita() {
            return global.BeritaDatabase;
        },
        get pengajar() {
            return global.PengajarDatabase;
        },

        // Ringkasan Statistik Database
        getSummary() {
            const kalenderCount = this.kalender ? this.kalender.events.length : 0;
            const beritaCount = this.berita ? this.berita.articles.length : 0;
            const pengajarCount = this.pengajar ? this.pengajar.teachers.length : 0;
            const pendingAppsCount = this.pengajar ? this.pengajar.getPendingApplications().length : 0;

            const trashTotal =
                (this.kalender ? this.kalender.trashEvents.length : 0) +
                (this.berita ? this.berita.trashArticles.length : 0) +
                (this.pengajar ? this.pengajar.trashTeachers.length : 0);

            return {
                total_events: kalenderCount,
                total_articles: beritaCount,
                total_teachers: pengajarCount,
                pending_teacher_applications: pendingAppsCount,
                total_in_trash: trashTotal,
                status: 'operational',
                last_checked: new Date().toISOString()
            };
        },

        // Master Backup Seluruh Database ke 1 Berkas JSON
        exportFullBackup() {
            const backupPayload = {
                app: 'Next Level Study (NLS)',
                version: this.version,
                created_at: new Date().toISOString(),
                summary: this.getSummary(),
                databases: {
                    kalender: {
                        events: this.kalender ? this.kalender.events : [],
                        trash: this.kalender ? this.kalender.trashEvents : []
                    },
                    berita: {
                        articles: this.berita ? this.berita.articles : [],
                        trash: this.berita ? this.berita.trashArticles : []
                    },
                    pengajar: {
                        teachers: this.pengajar ? this.pengajar.teachers : [],
                        applications: this.pengajar ? this.pengajar.applications : [],
                        trash: this.pengajar ? this.pengajar.trashTeachers : []
                    }
                }
            };
            return JSON.stringify(backupPayload, null, 2);
        },

        // Master Restore dari Berkas JSON
        importFullBackup(jsonInput) {
            const parsed = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;
            if (!parsed || !parsed.databases) {
                throw new Error('[NlsDatabase] File backup tidak valid atau rusak.');
            }

            let restoredModules = [];

            if (parsed.databases.kalender && this.kalender) {
                this.kalender.importJSON(parsed.databases.kalender.events || parsed.databases.kalender);
                restoredModules.push('Kalender Events');
            }

            if (parsed.databases.berita && this.berita) {
                this.berita.importJSON(parsed.databases.berita.articles || parsed.databases.berita);
                restoredModules.push('Berita & Artikel CMS');
            }

            if (parsed.databases.pengajar && this.pengajar) {
                this.pengajar.importJSON(parsed.databases.pengajar);
                restoredModules.push('Pengajar & Pelamar Guru');
            }

            return {
                success: true,
                restoredModules: restoredModules,
                timestamp: new Date().toISOString()
            };
        },

        // Vue 3 Plugin Installer
        install(app) {
            app.config.globalProperties.$db = this;
            app.provide('nlsDb', this);
            console.log('✅ [NLS Database] Berhasil diintegrasikan ke Vue 3 Application.');
        }
    };

    // Composition API Composables
    function useNlsDatabase() {
        return NlsDatabase;
    }
    function useKalenderDb() {
        return NlsDatabase.kalender;
    }
    function useBeritaDb() {
        return NlsDatabase.berita;
    }
    function usePengajarDb() {
        return NlsDatabase.pengajar;
    }

    // Expose ke Global Window
    global.NlsDatabase = NlsDatabase;
    global.useNlsDatabase = useNlsDatabase;
    global.useKalenderDb = useKalenderDb;
    global.useBeritaDb = useBeritaDb;
    global.usePengajarDb = usePengajarDb;

})(typeof window !== 'undefined' ? window : globalThis);
