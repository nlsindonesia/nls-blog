$indexPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html"
$content = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)

# 1. Add /blog/default-articles.js in <head>
if (-not $content.Contains('/blog/default-articles.js')) {
    $headInsert = @'
    <script src="/blog/default-articles.js"></script>
    <style>
        .card-accent-nexgen { border-top: 4px solid #06b6d4 !important; }
        .card-accent-osn { border-top: 4px solid #0284c7 !important; }
        .card-accent-snbt { border-top: 4px solid #059669 !important; }
        .card-accent-tka { border-top: 4px solid #d97706 !important; }
        .card-accent-tips { border-top: 4px solid #9333ea !important; }
        .card-accent-school { border-top: 4px solid #e11d48 !important; }
        .card-accent-info { border-top: 4px solid #4f46e5 !important; }
        .blog-prose h2, .blog-prose h3 { font-weight: 800; color: #0f172a; margin-top: 1.25rem; margin-bottom: 0.5rem; }
        .blog-prose p { color: #334155; line-height: 1.7; margin-bottom: 0.9rem; }
        .blog-prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #334155; }
        .blog-prose ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; color: #334155; }
        .blog-prose blockquote { border-left: 4px solid #0284c7; padding-left: 1rem; font-style: italic; color: #475569; background: #f8fafc; padding-top: 0.5rem; padding-bottom: 0.5rem; margin: 1rem 0; border-radius: 0 0.5rem 0.5rem 0; }
    </style>
'@
    $content = $content.Replace('    <link rel="stylesheet" href="/theme.css" />', $headInsert + "`n    <link rel=\"stylesheet\" href=\"/theme.css\" />")
}

# 2. Replace the outdated Berita Terkini section
$oldSectionPattern = '(?s)<section class="py-24 bg-surface-container-low">.*?<\/section>\s*<\/main>'

$newSectionMarkup = @'
<!-- BERITA TERKINI SECTION (INTEGRATED FULL-COLOR CMS & 5 COLUMNS) -->
<section class="py-16 bg-surface-container-low relative overflow-hidden" x-data="homeNewsApp()">
    <!-- Ambient Mesh Glows -->
    <div class="absolute top-10 left-10 w-96 h-96 rounded-full bg-sky-400/10 dark:bg-sky-500/5 blur-3xl pointer-events-none -z-10"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-400/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none -z-10"></div>

    <div class="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- FULL-COLOR INTUITIVE & STYLISH CONTROL BAR -->
        <div class="bg-white dark:bg-[#131D38] p-4 sm:p-5 rounded-3xl border-2 border-sky-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 mb-8 transition-all">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                <!-- Left: Section Title, Total Counter, & Active Filter Tags -->
                <div class="space-y-2">
                    <div class="flex items-center gap-3 flex-wrap">
                        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                                    Daftar Artikel &amp; Berita Edukasi
                                </h3>
                                <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                    <span x-text="filteredArticles().length"></span> Terbit
                                </span>
                            </div>
                            <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                                Pilih kategori di sebelah kanan untuk menyaring artikel sesuai kebutuhan belajar Anda.
                            </p>
                        </div>
                    </div>

                    <!-- Active Filter Tags (Appears when filtered) -->
                    <div class="flex items-center gap-2 flex-wrap pt-1" x-show="selectedCategory !== 'all'">
                        <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Filter Aktif:</span>
                        
                        <!-- Active Category Pill -->
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-xs border"
                            :class="getCategoryBadgeClass(selectedCategory)">
                            <span x-text="selectedCategory"></span>
                            <button type="button" @click="selectedCategory = 'all'" class="hover:opacity-75 cursor-pointer ml-1 font-bold">✕</button>
                        </span>

                        <!-- Reset All Button -->
                        <button type="button" @click="selectedCategory = 'all'"
                            class="text-xs font-black text-rose-600 hover:text-rose-700 dark:text-rose-400 underline cursor-pointer ml-2">
                            Reset Filter
                        </button>
                    </div>
                </div>

                <!-- Right: Proper Custom Interactive Category Dropdown + Link to /blog -->
                <div class="flex flex-col sm:flex-row sm:items-center gap-3 self-stretch lg:self-auto shrink-0">
                    <a href="/blog" class="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline mr-2 self-end sm:self-auto">
                        <span>Buka Blog Lengkap</span>
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </a>

                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <label class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            Saring Kategori:
                        </label>
                    </div>

                    <div class="relative min-w-[230px] sm:min-w-[260px]"
                        x-data="{ isCatMenuOpen: false }"
                        @click.outside="isCatMenuOpen = false">
                        <!-- Dropdown Trigger Button -->
                        <button type="button" @click="isCatMenuOpen = !isCatMenuOpen"
                            class="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-sky-400 dark:border-sky-600 shadow-sm hover:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-300/40 cursor-pointer transition-all">
                            
                            <div class="flex items-center gap-2.5 min-w-0">
                                <span class="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center shrink-0">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                                </span>
                                <span class="text-xs sm:text-sm font-black text-slate-800 dark:text-white truncate"
                                    x-text="selectedCategory === 'all' ? 'Semua Kategori Berita' : selectedCategory"></span>
                            </div>

                            <svg class="w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0"
                                :class="isCatMenuOpen ? 'rotate-180 text-sky-600' : ''"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                        </button>

                        <!-- Dropdown Menu List -->
                        <div x-show="isCatMenuOpen" x-cloak
                            x-transition:enter="transition ease-out duration-150"
                            x-transition:enter-start="opacity-0 translate-y-1 scale-95"
                            x-transition:enter-end="opacity-100 translate-y-0 scale-100"
                            x-transition:leave="transition ease-in duration-100"
                            x-transition:leave-start="opacity-100 translate-y-0 scale-100"
                            x-transition:leave-end="opacity-0 translate-y-1 scale-95"
                            class="absolute right-0 top-full mt-2 w-full min-w-[260px] rounded-2xl bg-white dark:bg-[#131D38] border-2 border-slate-200 dark:border-slate-700 shadow-2xl p-1.5 z-40 space-y-0.5 max-h-72 overflow-y-auto admin-scrollbar">
                            
                            <!-- Option: Semua Kategori -->
                            <button type="button" @click="selectedCategory = 'all'; isCatMenuOpen = false"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left"
                                :class="selectedCategory === 'all' ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-black' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'">
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                                    <span>Semua Kategori Berita</span>
                                </div>
                                <span x-show="selectedCategory === 'all'" class="text-sky-600 font-black">✓</span>
                            </button>

                            <!-- Category Options Dynamic Loop -->
                            <template x-for="cat in categories" :key="cat">
                                <button type="button" @click="selectedCategory = cat; isCatMenuOpen = false"
                                    class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left"
                                    :class="selectedCategory === cat ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-black' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'">
                                    <div class="flex items-center gap-2">
                                        <span class="w-2 h-2 rounded-full"
                                            :class="{
                                                'bg-sky-500': cat === 'OSN & Sains',
                                                'bg-emerald-500': cat === 'SNBT & UTBK',
                                                'bg-amber-500': cat === 'TKA & Akademik',
                                                'bg-purple-500': cat === 'Tips Belajar & Prestasi',
                                                'bg-rose-500': cat === 'Berita Sekolah & Diknas',
                                                'bg-indigo-500': cat === 'Informasi NLS',
                                                'bg-teal-500': cat === 'Panduan Beasiswa',
                                                'bg-cyan-500': cat === 'Bimbel NexGen'
                                            }"></span>
                                        <span x-text="cat"></span>
                                    </div>
                                    <span x-show="selectedCategory === cat" class="text-sky-600 font-black">✓</span>
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div x-show="filteredArticles().length === 0" x-cloak class="text-center py-16 bg-white dark:bg-slate-900/60 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-4 shadow-sm">
            <div class="w-16 h-16 rounded-full bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto text-3xl">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <h3 class="text-lg font-black text-slate-900 dark:text-white">Tidak Ada Artikel yang Cocok</h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Pilih kategori artikel lain pada dropdown di atas atau buka halaman blog lengkap kami.
            </p>
            <button type="button" @click="selectedCategory = 'all'"
                class="px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-black transition-all shadow-md cursor-pointer">
                Reset Filter Kategori
            </button>
        </div>

        <!-- Dynamic Themed Article Cards Grid: 1 Row 5 Cards (xl:grid-cols-5) -->
        <div x-show="filteredArticles().length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            <template x-for="art in filteredArticles()" :key="art.id">
                <article :class="getArticleAccentClass(art.category)"
                    class="group bg-white dark:bg-[#131D38] rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 flex flex-col hover:-translate-y-1.5 transition-all duration-300">
                    
                    <!-- Card Banner Image with Hover Zoom -->
                    <div class="relative h-40 sm:h-44 overflow-hidden block bg-slate-100 dark:bg-slate-900 cursor-pointer" @click="openArticle(art)">
                        <img :src="art.coverImage || '/nls-logo-300.png'"
                            :alt="art.title"
                            loading="lazy"
                            onerror="this.onerror=null;this.src='/nls-logo-300.png';"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        
                        <!-- Category Badge -->
                        <div class="absolute top-3 left-3 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border"
                            :class="getCategoryBadgeClass(art.category)"
                            x-text="art.category">
                        </div>
                    </div>

                    <!-- Card Body (High Contrast Typography) -->
                    <div class="p-4 sm:p-4.5 flex flex-col flex-grow justify-between space-y-3">
                        <div class="space-y-2">
                            <!-- Date & Author Row -->
                            <div class="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 flex-wrap">
                                <span class="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span x-text="formatDisplayDate(art.date)"></span>
                                </span>
                                <span class="text-slate-400">&bull;</span>
                                <span class="text-slate-700 dark:text-slate-300 font-extrabold truncate max-w-[110px]" x-text="art.author || 'Tim NLS'"></span>
                            </div>

                            <!-- Title -->
                            <h2 class="text-sm sm:text-[15px] font-black text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 cursor-pointer"
                                @click="openArticle(art)"
                                x-text="art.title">
                            </h2>

                            <!-- Description Excerpt -->
                            <p class="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed font-medium"
                                x-text="art.metaDescription || art.title">
                            </p>
                        </div>

                        <!-- Read Button -->
                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <button type="button" @click="openArticle(art)"
                                class="inline-flex items-center gap-1 font-black text-[11px] text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 group-hover:translate-x-1 transition-all cursor-pointer">
                                <span>Baca</span>
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </button>
                            
                            <span class="text-[10px] font-bold text-slate-400" x-text="calculateReadTime(art.content) + ' min'"></span>
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
            
            <!-- Modal Header Bar -->
            <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-white/95 dark:bg-[#131D38]/95 backdrop-blur-sm shrink-0">
                <div class="flex items-center gap-2 min-w-0">
                    <span class="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border"
                        :class="activeArticle ? getCategoryBadgeClass(activeArticle.category) : ''"
                        x-text="activeArticle ? activeArticle.category : 'Berita'"></span>
                    <span class="text-xs text-slate-600 dark:text-slate-400 font-bold hidden sm:inline" x-text="activeArticle ? formatDisplayDate(activeArticle.date) : ''"></span>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                    <button type="button" @click="shareArticleToWhatsapp(activeArticle)"
                        class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
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
                <h1 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight"
                    x-text="activeArticle ? activeArticle.title : ''"></h1>

                <div class="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap">
                    <span class="text-sky-600 dark:text-sky-400 font-extrabold" x-text="activeArticle ? (activeArticle.author || 'Tim NLS') : ''"></span>
                    <span>&bull;</span>
                    <span x-text="activeArticle ? formatDisplayDate(activeArticle.date) : ''"></span>
                    <span>&bull;</span>
                    <span x-text="activeArticle ? (calculateReadTime(activeArticle.content) + ' menit baca') : ''"></span>
                </div>

                <template x-if="activeArticle && activeArticle.coverImage">
                    <div class="rounded-2xl overflow-hidden max-h-96 w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <img :src="activeArticle.coverImage" :alt="activeArticle.title" class="w-full h-full object-cover">
                    </div>
                </template>

                <div class="blog-prose dark:text-slate-200" x-html="activeArticle ? activeArticle.content : ''"></div>
            </div>
        </div>
    </div>
</section>
</main>
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldSectionPattern, $newSectionMarkup)

# 3. Add homeNewsApp() JS engine at bottom of index.html
$appScript = @'
    <!-- Dynamic Home News Application Engine Script -->
    <script>
        function homeNewsApp() {
            return {
                selectedCategory: 'all',
                activeArticle: null,
                isReaderOpen: false,

                categories: [
                    'OSN & Sains',
                    'SNBT & UTBK',
                    'TKA & Akademik',
                    'Tips Belajar & Prestasi',
                    'Berita Sekolah & Diknas',
                    'Informasi NLS',
                    'Panduan Beasiswa',
                    'Bimbel NexGen'
                ],

                articles: [],

                init() {
                    this.loadArticles();
                    // Real-time storage event synchronization with /nlsadmin and /blog
                    window.addEventListener('storage', (e) => {
                        if (e.key === 'nls_berita_articles_v1' && e.newValue) {
                            try {
                                const parsed = JSON.parse(e.newValue);
                                if (Array.isArray(parsed) && parsed.length > 0) {
                                    this.articles = parsed;
                                }
                            } catch (err) {}
                        }
                    });
                },

                loadArticles() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                this.articles = parsed;
                                return;
                            }
                        }
                    } catch (e) {}
                    if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                        this.articles = window.NLS_DEFAULT_ARTICLES;
                    }
                },

                filteredArticles() {
                    return this.articles.filter(art => {
                        if (art.status && art.status !== 'published') return false;
                        return this.selectedCategory === 'all' || art.category === this.selectedCategory;
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

                getArticleAccentClass(cat) {
                    switch (cat) {
                        case 'Bimbel NexGen': return 'card-accent-nexgen';
                        case 'OSN & Sains': return 'card-accent-osn';
                        case 'SNBT & UTBK': return 'card-accent-snbt';
                        case 'TKA & Akademik': return 'card-accent-tka';
                        case 'Tips Belajar & Prestasi': return 'card-accent-tips';
                        case 'Berita Sekolah & Diknas': return 'card-accent-school';
                        default: return 'card-accent-info';
                    }
                },

                getCategoryBadgeClass(cat) {
                    switch (cat) {
                        case 'Bimbel NexGen':
                            return 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300';
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

if (-not $content.Contains('function homeNewsApp()')) {
    $content = $content.Replace('</body>', $appScript + "`n</body>")
}

[System.IO.File]::WriteAllText($indexPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Upgraded Homepage Berita Terkini section to match /blog 5-column layout & full integration!"
