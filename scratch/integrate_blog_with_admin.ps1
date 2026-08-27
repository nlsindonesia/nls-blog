$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$content = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

# 1. Add /blog/default-articles.js into <head>
if (-not $content.Contains('/blog/default-articles.js')) {
    $content = $content.Replace(
        '<script src="/theme.js"></script>',
        '<script src="/blog/default-articles.js"></script>' + "`n    " + '<script src="/theme.js"></script>'
    )
}

# 2. Add Typography and Reader Modal Styles in <style>
$blogExtraStyles = @'
        /* Dynamic Blog Article Prose & Typography */
        .blog-prose h1, .blog-prose h2, .blog-prose h3, .blog-prose h4 {
            font-weight: 800;
            color: #0f172a;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            line-height: 1.3;
        }
        .blog-prose h1 { font-size: 1.75rem; }
        .blog-prose h2 { font-size: 1.4rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.4rem; }
        .blog-prose h3 { font-size: 1.2rem; }
        .blog-prose p { margin-bottom: 1.1rem; line-height: 1.8; color: #334155; }
        .blog-prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.1rem; }
        .blog-prose ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.1rem; }
        .blog-prose li { margin-bottom: 0.4rem; color: #334155; }
        .blog-prose blockquote {
            border-left: 4px solid #0284c7;
            padding-left: 1.2rem;
            font-style: italic;
            color: #475569;
            background: #f8fafc;
            padding-top: 0.6rem;
            padding-bottom: 0.6rem;
            border-radius: 0 0.75rem 0.75rem 0;
            margin: 1.25rem 0;
        }
        .blog-prose table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
        }
        .blog-prose table th, .blog-prose table td {
            border: 1px solid #cbd5e1;
            padding: 0.75rem;
            text-align: left;
        }
        .blog-prose table th {
            background-color: #f1f5f9;
            font-weight: 700;
        }
        html.dark .blog-prose h1, html.dark .blog-prose h2, html.dark .blog-prose h3, html.dark .blog-prose h4 {
            color: #f8fafc;
            border-color: #334155;
        }
        html.dark .blog-prose p, html.dark .blog-prose li {
            color: #cbd5e1;
        }
        html.dark .blog-prose blockquote {
            background: #1e293b;
            color: #94a3b8;
            border-color: #38bdf8;
        }
        html.dark .blog-prose table th, html.dark .blog-prose table td {
            border-color: #334155;
        }
        html.dark .blog-prose table th {
            background-color: #1e293b;
            color: #f8fafc;
        }
'@

if (-not $content.Contains('Dynamic Blog Article Prose')) {
    $content = $content.Replace('</style>', $blogExtraStyles + "`n    </style>")
}

# 3. Replace static main section with dynamic reactive blogApp()
$oldMainPattern = '(?s)<main class="bg-surface min-h-screen">.*?<\/main>'

$newMainSection = @'
<main class="bg-surface min-h-screen" x-data="blogApp()">
        
        <!-- Hero Banner with Category Filters & Search -->
        <section class="relative bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#1E3A8A] text-white pt-20 pb-24 overflow-hidden">
            <!-- Decorative background glow -->
            <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>

            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
                <div class="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-sky-300 backdrop-blur-md shadow-xs">
                    <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                    <span>Pusat Informasi &amp; Panduan Belajar NLS</span>
                </div>

                <h1 class="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                    Berita, Edukasi &amp; Prestasi
                </h1>

                <p class="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Kumpulan artikel edukatif, bedah materi olimpiade sains, strategi lolos PTN impian, dan update resmi Next Level Study.
                </p>

                <!-- Search Input Bar -->
                <div class="max-w-xl mx-auto pt-2">
                    <div class="relative flex items-center">
                        <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        <input type="text" x-model="searchQuery" placeholder="Cari judul berita, tips belajar, atau kata kunci..."
                            class="w-full pl-11 pr-10 py-3 rounded-full bg-white/10 dark:bg-slate-900/60 border border-white/20 dark:border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 backdrop-blur-md transition-all shadow-lg">
                        <button type="button" x-show="searchQuery" @click="searchQuery = ''"
                            class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white cursor-pointer">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>

                <!-- Interactive Category Filter Pills -->
                <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button type="button" @click="selectedCategory = 'all'"
                        :class="selectedCategory === 'all' ? 'bg-[#FF8A00] text-white font-black shadow-lg shadow-orange-500/30 scale-105' : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/15'"
                        class="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer backdrop-blur-sm">
                        Semua Kategori
                    </button>
                    <template x-for="cat in categories" :key="cat">
                        <button type="button" @click="selectedCategory = cat"
                            :class="selectedCategory === cat ? 'bg-[#FF8A00] text-white font-black shadow-lg shadow-orange-500/30 scale-105' : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/15'"
                            class="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer backdrop-blur-sm"
                            x-text="cat">
                        </button>
                    </template>
                </div>
            </div>
        </section>

        <!-- Articles Grid Container -->
        <div class="container-max px-4 sm:px-6 lg:px-8 py-14">
            
            <!-- Result Count & Active Filter Indicator -->
            <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-slate-600 dark:text-slate-400">Menampilkan</span>
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                        x-text="filteredArticles().length + ' Artikel'"></span>
                    <span x-show="selectedCategory !== 'all'" class="text-xs text-slate-400 hidden sm:inline"
                        x-text="'Kategori: ' + selectedCategory"></span>
                </div>
            </div>

            <!-- Empty State -->
            <div x-show="filteredArticles().length === 0" x-cloak class="text-center py-20 bg-white dark:bg-slate-900/60 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-4">
                <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                </div>
                <h3 class="text-lg font-black text-slate-800 dark:text-slate-200">Belum Ada Artikel Ditemukan</h3>
                <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    Coba sesuaikan kata kunci pencarian Anda atau pilih kategori lain. Anda juga dapat membuat artikel baru melalui portal Super Admin.
                </p>
                <button type="button" @click="selectedCategory = 'all'; searchQuery = ''"
                    class="px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer">
                    Reset Filter Pencarian
                </button>
            </div>

            <!-- Dynamic Articles Grid Cards -->
            <div x-show="filteredArticles().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <template x-for="art in filteredArticles()" :key="art.id">
                    <article class="group bg-white dark:bg-[#131D38] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 flex flex-col hover:-translate-y-2 transition-all duration-300">
                        <!-- Card Banner Image -->
                        <div class="relative h-56 overflow-hidden block bg-slate-100 dark:bg-slate-900 cursor-pointer" @click="openArticle(art)">
                            <img :src="art.coverImage || '/nls-logo-300.png'"
                                :alt="art.title"
                                loading="lazy"
                                onerror="this.onerror=null;this.src='/nls-logo-300.png';"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            
                            <!-- Category Badge -->
                            <div class="absolute top-4 left-4 backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm border"
                                :class="getCategoryBadgeClass(art.category)"
                                x-text="art.category">
                            </div>
                        </div>

                        <!-- Card Content -->
                        <div class="p-6 sm:p-7 flex flex-col flex-grow justify-between space-y-4">
                            <div class="space-y-3">
                                <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                    <span class="flex items-center gap-1.5">
                                        <svg class="w-4 h-4 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <span x-text="formatDisplayDate(art.date)"></span>
                                    </span>
                                    <span>•</span>
                                    <span class="text-slate-700 dark:text-slate-300 truncate" x-text="art.author || 'Tim NLS'"></span>
                                </div>

                                <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 cursor-pointer"
                                    @click="openArticle(art)"
                                    x-text="art.title">
                                </h2>

                                <p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed"
                                    x-text="art.metaDescription || art.title">
                                </p>
                            </div>

                            <!-- Read Button -->
                            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <button type="button" @click="openArticle(art)"
                                    class="inline-flex items-center gap-1.5 font-black text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 group-hover:translate-x-1 transition-all cursor-pointer">
                                    <span>Baca Selengkapnya</span>
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </button>
                                
                                <span class="text-[10px] font-bold text-slate-400" x-text="calculateReadTime(art.content) + ' min baca'"></span>
                            </div>
                        </div>
                    </article>
                </template>
            </div>
        </div>

        <!-- Full Article Reader Modal (Pop-up View) -->
        <div x-show="isReaderOpen" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md"
            @keydown.escape.window="closeReader()">
            
            <div class="bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
                @click.outside="closeReader()">
                
                <!-- Modal Sticky Header Bar -->
                <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-white/95 dark:bg-[#131D38]/95 backdrop-blur-sm shrink-0">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border"
                            :class="activeArticle ? getCategoryBadgeClass(activeArticle.category) : ''"
                            x-text="activeArticle ? activeArticle.category : 'Berita'"></span>
                        <span class="text-xs text-slate-500 font-bold hidden sm:inline" x-text="activeArticle ? formatDisplayDate(activeArticle.date) : ''"></span>
                    </div>

                    <div class="flex items-center gap-2 shrink-0">
                        <button type="button" @click="shareArticleToWhatsapp(activeArticle)"
                            class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            title="Bagikan ke WhatsApp">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                            <span class="hidden sm:inline">Bagikan</span>
                        </button>
                        <button type="button" @click="closeReader()"
                            class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                            title="Tutup Modal">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>

                <!-- Modal Scrollable Content -->
                <div class="p-6 sm:p-10 overflow-y-auto admin-scrollbar space-y-6 flex-1">
                    <template x-if="activeArticle">
                        <div class="space-y-6 max-w-3xl mx-auto">
                            <!-- Article Cover Banner -->
                            <div class="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                                <img :src="activeArticle.coverImage || '/nls-logo-300.png'"
                                    :alt="activeArticle.title"
                                    class="w-full h-full object-cover">
                            </div>

                            <!-- Header Meta -->
                            <div class="space-y-3">
                                <div class="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 flex-wrap">
                                    <span class="text-sky-600 dark:text-sky-400" x-text="activeArticle.category"></span>
                                    <span>•</span>
                                    <span x-text="formatDisplayDate(activeArticle.date)"></span>
                                    <span>•</span>
                                    <span class="text-slate-700 dark:text-slate-300" x-text="'Penulis: ' + (activeArticle.author || 'Tim Akademik NLS')"></span>
                                </div>

                                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight"
                                    x-text="activeArticle.title"></h1>
                            </div>

                            <!-- Full Rich Text Article Content -->
                            <div class="blog-prose pt-4 border-t border-slate-100 dark:border-slate-800"
                                x-html="activeArticle.content"></div>
                        </div>
                    </template>
                </div>

                <!-- Modal Footer -->
                <div class="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0F172A] shrink-0">
                    <span class="text-xs text-slate-500 font-semibold">Next Level Study Indonesia</span>
                    <button type="button" @click="closeReader()"
                        class="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer">
                        Tutup Artikel
                    </button>
                </div>
            </div>
        </div>

    </main>
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldMainPattern, $newMainSection)

# 4. Add Alpine blogApp() script before </body>
$blogAppScript = @'
    <!-- Dynamic Blog Application Engine Script -->
    <script>
        function blogApp() {
            return {
                selectedCategory: 'all',
                searchQuery: '',
                activeArticle: null,
                isReaderOpen: false,

                categories: [
                    'SNBT & UTBK',
                    'OSN & Sains',
                    'TKA & Akademik',
                    'Tips Belajar & Prestasi',
                    'Berita Sekolah & Diknas',
                    'Informasi NLS',
                    'Panduan Beasiswa'
                ],

                articles: (function() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_ARTICLES !== "undefined") ? window.NLS_DEFAULT_ARTICLES : [];
                })(),

                init() {
                    // Listen to real-time changes from /nlsadmin across tabs
                    window.addEventListener('storage', (e) => {
                        if (e.key === 'nls_berita_articles_v1' && e.newValue) {
                            try {
                                const parsed = JSON.parse(e.newValue);
                                if (Array.isArray(parsed)) this.articles = parsed;
                            } catch (err) {}
                        }
                    });
                },

                filteredArticles() {
                    return this.articles.filter(art => {
                        if (art.status && art.status !== 'published') return false;
                        
                        const matchCat = this.selectedCategory === 'all' || art.category === this.selectedCategory;
                        const q = this.searchQuery.toLowerCase().trim();
                        const matchSearch = !q ||
                            (art.title && art.title.toLowerCase().includes(q)) ||
                            (art.metaDescription && art.metaDescription.toLowerCase().includes(q)) ||
                            (art.category && art.category.toLowerCase().includes(q)) ||
                            (art.author && art.author.toLowerCase().includes(q));

                        return matchCat && matchSearch;
                    });
                },

                openArticle(art) {
                    this.activeArticle = art;
                    this.isReaderOpen = true;
                },

                closeReader() {
                    this.isReaderOpen = false;
                    this.activeArticle = null;
                },

                formatDisplayDate(dateStr) {
                    if (!dateStr) return 'Terbaru';
                    try {
                        const d = new Date(dateStr);
                        if (isNaN(d.getTime())) return dateStr;
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
                        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
                    } catch (e) {
                        return dateStr;
                    }
                },

                calculateReadTime(content) {
                    if (!content) return 3;
                    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
                    return Math.max(1, Math.ceil(words / 180));
                },

                getCategoryBadgeClass(cat) {
                    switch (cat) {
                        case 'OSN & Sains':
                            return 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300';
                        case 'SNBT & UTBK':
                            return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300';
                        case 'TKA & Akademik':
                            return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300';
                        case 'Tips Belajar & Prestasi':
                            return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300';
                        case 'Berita Sekolah & Diknas':
                            return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300';
                        default:
                            return 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300';
                    }
                },

                shareArticleToWhatsapp(art) {
                    if (!art) return;
                    const text = `Baca artikel menarik dari Next Level Study: "${art.title}" di https://next-level-study.com/blog`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                }
            };
        }
    </script>
'@

if (-not $content.Contains('function blogApp()')) {
    $content = $content.Replace('</body>', $blogAppScript + "`n</body>")
}

[System.IO.File]::WriteAllText($blogPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Fully connected /blog to /nlsadmin with dynamic live sync and interactive reader modal!"
