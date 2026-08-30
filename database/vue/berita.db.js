/**
 * ==============================================================================
 * DATABASE MODUL: BERITA & ARTIKEL EDUKASI CMS (VUE 3 REACTIVE DB)
 * File: /database/vue/berita.db.js
 * Sesuai Menu Admin: "2. Berita & Artikel CMS (Blog, SEO & Content Management)"
 * ==============================================================================
 */

(function (global) {
    'use strict';

    const STORAGE_KEY = 'nls_berita_articles_v1';
    const TRASH_STORAGE_KEY = 'nls_berita_articles_trash_v1';

    const DEFAULT_CATEGORIES = [
        'Bimbel NexGen',
        'OSN & Sains',
        'SNBT & UTBK',
        'TKA & Akademik',
        'Tips Belajar & Prestasi',
        'Berita Sekolah & Diknas'
    ];

    function getDefaultArticles() {
        if (typeof window !== 'undefined' && window.NLS_DEFAULT_ARTICLES && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
            return JSON.parse(JSON.stringify(window.NLS_DEFAULT_ARTICLES));
        }
        return [];
    }

    function makeReactive(target) {
        if (typeof Vue !== 'undefined' && Vue.reactive) {
            return Vue.reactive(target);
        }
        return target;
    }

    function createBeritaDatabase() {
        let initialArticles = [];
        let initialTrash = [];

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                initialArticles = JSON.parse(stored);
            } else {
                initialArticles = getDefaultArticles();
                if (initialArticles.length > 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialArticles));
                }
            }
        } catch (e) {
            console.warn('[BeritaDB] Gagal membaca storage, menggunakan default dataset:', e);
            initialArticles = getDefaultArticles();
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
            items: initialArticles,
            trash: initialTrash,
            categories: DEFAULT_CATEGORIES,
            loading: false,
            lastUpdated: new Date().toISOString()
        });

        function persist() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
                localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(state.trash));
                state.lastUpdated = new Date().toISOString();
            } catch (err) {
                console.error('[BeritaDB] Gagal menyimpan ke localStorage:', err);
            }
        }

        function generateSlug(text) {
            return (text || '')
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        function calculateReadingTime(htmlContent) {
            if (!htmlContent) return 3;
            const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            const wordCount = text.split(' ').filter(Boolean).length;
            return Math.max(1, Math.ceil(wordCount / 180));
        }

        return {
            get state() {
                return state;
            },
            get articles() {
                return state.items;
            },
            get trashArticles() {
                return state.trash;
            },
            get categories() {
                return state.categories;
            },

            getAll() {
                return [...state.items];
            },

            getById(id) {
                return state.items.find(item => item.id === id) || null;
            },

            getBySlug(slug) {
                return state.items.find(item => item.slug === slug) || null;
            },

            getByCategory(cat) {
                if (!cat || cat === 'all') return this.getAll();
                const catLower = cat.toLowerCase();
                return state.items.filter(item => {
                    const c = (item.category || '').toLowerCase();
                    return c.includes(catLower) || catLower.includes(c);
                });
            },

            search(keyword) {
                if (!keyword || !keyword.trim()) return this.getAll();
                const q = keyword.toLowerCase().trim();
                return state.items.filter(item =>
                    (item.title && item.title.toLowerCase().includes(q)) ||
                    (item.category && item.category.toLowerCase().includes(q)) ||
                    (item.author && item.author.toLowerCase().includes(q)) ||
                    (item.metaDescription && item.metaDescription.toLowerCase().includes(q)) ||
                    (item.content && item.content.toLowerCase().includes(q))
                );
            },

            create(artData) {
                const title = artData.title || 'Artikel Baru NLS';
                const slug = artData.slug ? generateSlug(artData.slug) : generateSlug(title);
                const newId = artData.id || `art-${Date.now()}`;

                const newArticle = {
                    id: newId,
                    title: title,
                    slug: slug,
                    category: artData.category || 'OSN & Sains',
                    categories: Array.isArray(artData.categories) ? artData.categories : [artData.category || 'OSN & Sains'],
                    date: artData.date || new Date().toISOString().split('T')[0],
                    end_date: artData.end_date || '',
                    author: artData.author || 'Tim Akademik NLS',
                    status: artData.status || 'published',
                    coverImage: artData.coverImage || artData.cover_image || '/images/blog/default.jpg',
                    focusKeyword: artData.focusKeyword || artData.focus_keyword || '',
                    metaTitle: artData.metaTitle || artData.meta_title || title,
                    metaDescription: artData.metaDescription || artData.meta_description || '',
                    canonicalUrl: artData.canonicalUrl || artData.canonical_url || `https://next-level-study.com/blog/${slug}`,
                    content: artData.content || '<p>Konten artikel...</p>',
                    readTime: calculateReadingTime(artData.content),
                    seoScore: typeof artData.seoScore === 'number' ? artData.seoScore : 85,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };

                state.items.unshift(newArticle);
                persist();
                return newArticle;
            },

            update(id, updatedFields) {
                const index = state.items.findIndex(item => item.id === id);
                if (index === -1) {
                    throw new Error(`[BeritaDB] Artikel dengan id "${id}" tidak ditemukan.`);
                }

                if (updatedFields.title && !updatedFields.slug) {
                    updatedFields.slug = generateSlug(updatedFields.title);
                }
                if (updatedFields.content) {
                    updatedFields.readTime = calculateReadingTime(updatedFields.content);
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
                state.items = getDefaultArticles();
                state.trash = [];
                persist();
                return state.items;
            },

            exportJSON() {
                return JSON.stringify({
                    module: 'nls_berita_database',
                    version: '1.0.0',
                    exported_at: new Date().toISOString(),
                    total_articles: state.items.length,
                    data: state.items
                }, null, 2);
            },

            async syncFromCloud() {
                if (typeof fetch === 'undefined') return state.items;
                try {
                    const res = await fetch('/api/articles?_t=' + Date.now());
                    if (res.ok) {
                        const json = await res.json();
                        if (json && Array.isArray(json.data)) {
                            state.items = json.data.filter(a => a && a.status !== 'trashed');
                            state.trash = json.data.filter(a => a && a.status === 'trashed');
                            persist();
                        }
                    }
                } catch(e) {}
                return state.items;
            },

            importJSON(jsonString) {
                const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
                const itemsToImport = Array.isArray(parsed) ? parsed : (parsed.data || []);
                if (Array.isArray(itemsToImport) && itemsToImport.length > 0) {
                    state.items = itemsToImport;
                    persist();
                    return state.items.length;
                }
                throw new Error('[BeritaDB] Format JSON tidak valid atau data kosong.');
            }
        };
    }

    global.BeritaDatabase = createBeritaDatabase();

})(typeof window !== 'undefined' ? window : globalThis);
