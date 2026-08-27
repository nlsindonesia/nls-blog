$homePath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html"
$content = [System.IO.File]::ReadAllText($homePath, [System.Text.Encoding]::UTF8)

# 1. Update Section tag with id="berita"
$oldSectionTag = '<section class="py-16 bg-surface-container-low relative overflow-hidden" x-data="homeNewsApp()">'
$newSectionTag = '<section id="berita" class="py-16 bg-surface-container-low relative overflow-hidden scroll-mt-20" x-data="homeNewsApp()">'
$content = $content.Replace($oldSectionTag, $newSectionTag)

# 2. Update Grid and Bottom Action to single row grid with numeric pagination
$oldGridBlock = @'
        <!-- Dynamic Themed Article Cards Grid: 1 Row 5 Cards (xl:grid-cols-5) -->
        <div x-show="filteredArticles().length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            <template x-for="art in filteredArticles()" :key="art.id">
                <article :class="getArticleAccentClass(art.category)"
                    class="group bg-white dark:bg-[#131D38] rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 flex flex-col hover:-translate-y-1.5 transition-all duration-300">
                    
                    <!-- Card Banner Image with Hover Zoom -->
                    <div class="relative h-40 sm:h-44 overflow-hidden block bg-slate-100 dark:bg-slate-900 cursor-pointer" @click="openArticle(art)">
                        <img :src="art.coverImage || '/images/blog/cover-snbt-2027.jpg'"
                            :alt="art.title"
                            loading="lazy"
                            onerror="this.onerror=null;this.src='/images/blog/cover-snbt-2027.jpg';"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        
                        <!-- Multi-Category Badges -->
                        <div class="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[88%]">
                            <template x-for="(cat, cIdx) in (art.categories || [art.category || 'Informasi NLS'])" :key="cIdx">
                                <span class="backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border"
                                    :class="getCategoryBadgeClass(cat)"
                                    x-text="cat"></span>
                            </template>
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

        <!-- Bottom Action: Buka Blog Lengkap at Bottom-Right (Red X position) -->
        <div class="mt-8 flex justify-end">
            <a href="/blog"
                class="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white dark:bg-[#131D38] border-2 border-sky-400/60 hover:border-sky-500 text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all group cursor-pointer">
                <span>Buka Blog Lengkap</span>
                <span class="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
            </a>
        </div>
'@

$newGridBlock = @'
        <!-- Dynamic Themed Article Cards Grid: Exactly 1 Row of 4 Cards on Desktop (xl:grid-cols-4) -->
        <div x-show="paginatedArticles().length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <template x-for="art in paginatedArticles()" :key="art.id">
                <article :class="getArticleAccentClass(art.category)"
                    class="group bg-white dark:bg-[#131D38] rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 flex flex-col hover:-translate-y-1.5 transition-all duration-300">
                    
                    <!-- Card Banner Image with Hover Zoom -->
                    <div class="relative h-44 sm:h-48 overflow-hidden block bg-slate-100 dark:bg-slate-900 cursor-pointer" @click="openArticle(art)">
                        <img :src="art.coverImage || '/images/blog/cover-snbt-2027.jpg'"
                            :alt="art.title"
                            loading="lazy"
                            onerror="this.onerror=null;this.src='/images/blog/cover-snbt-2027.jpg';"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        
                        <!-- Multi-Category Badges -->
                        <div class="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[88%]">
                            <template x-for="(cat, cIdx) in (art.categories || [art.category || 'Informasi NLS'])" :key="cIdx">
                                <span class="backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border"
                                    :class="getCategoryBadgeClass(cat)"
                                    x-text="cat"></span>
                            </template>
                        </div>
                    </div>

                    <!-- Card Body (High Contrast Typography) -->
                    <div class="p-5 flex flex-col flex-grow justify-between space-y-3.5">
                        <div class="space-y-2">
                            <!-- Date & Author Row -->
                            <div class="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 flex-wrap">
                                <span class="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span x-text="formatDisplayDate(art.date)"></span>
                                </span>
                                <span class="text-slate-400">&bull;</span>
                                <span class="text-slate-700 dark:text-slate-300 font-extrabold truncate max-w-[120px]" x-text="art.author || 'Tim NLS'"></span>
                            </div>

                            <!-- Title -->
                            <h2 class="text-[15px] sm:text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 cursor-pointer"
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
                                class="inline-flex items-center gap-1.5 font-black text-xs text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 group-hover:translate-x-1 transition-all cursor-pointer">
                                <span>Baca Selengkapnya</span>
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </button>
                            
                            <span class="text-[11px] font-bold text-slate-400" x-text="calculateReadTime(art.content) + ' min'"></span>
                        </div>
                    </div>
                </article>
            </template>
        </div>

        <!-- Numeric Pagination Navigation Bar & Complete Blog Link -->
        <div class="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
            <!-- Left Info: Article Counters -->
            <div class="text-xs font-bold text-slate-500 dark:text-slate-400 text-center md:text-left">
                Halaman <span class="text-sky-600 dark:text-sky-400 font-black text-sm" x-text="currentPage"></span> dari <span class="text-slate-800 dark:text-slate-200 font-black text-sm" x-text="totalPages()"></span>
                <span class="mx-1.5 text-slate-300 dark:text-slate-700">•</span>
                Total <span class="font-black text-slate-800 dark:text-slate-200" x-text="filteredArticles().length"></span> Berita
            </div>

            <!-- Center: Numeric Pagination Buttons -->
            <div x-show="totalPages() > 1" class="flex items-center gap-1.5 flex-wrap justify-center">
                <!-- Prev Button -->
                <button type="button" @click="setPage(currentPage - 1)" :disabled="currentPage === 1"
                    class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border disabled:opacity-30 disabled:cursor-not-allowed"
                    :class="currentPage === 1 ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700' : 'bg-white dark:bg-[#131D38] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:text-sky-600 shadow-sm'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
                    <span class="hidden sm:inline">Sebelumnya</span>
                </button>

                <!-- Number Buttons Loop -->
                <template x-for="pageNum in totalPages()" :key="pageNum">
                    <button type="button" @click="setPage(pageNum)"
                        class="w-9 h-9 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer shadow-sm"
                        :class="currentPage === pageNum
                            ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sky-500/30 scale-105 ring-2 ring-sky-400/50'
                            : 'bg-white dark:bg-[#131D38] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-sky-400 hover:text-sky-600'">
                        <span x-text="pageNum"></span>
                    </button>
                </template>

                <!-- Next Button -->
                <button type="button" @click="setPage(currentPage + 1)" :disabled="currentPage === totalPages()"
                    class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border disabled:opacity-30 disabled:cursor-not-allowed"
                    :class="currentPage === totalPages() ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700' : 'bg-white dark:bg-[#131D38] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:text-sky-600 shadow-sm'">
                    <span class="hidden sm:inline">Selanjutnya</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                </button>
            </div>

            <!-- Right: Buka Blog Lengkap Button -->
            <div>
                <a href="/blog"
                    class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white dark:bg-[#131D38] border-2 border-sky-400/60 hover:border-sky-500 text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group cursor-pointer">
                    <span>Buka Blog Lengkap</span>
                    <span class="w-6 h-6 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </span>
                </a>
            </div>
        </div>
'@

$content = $content.Replace($oldGridBlock, $newGridBlock)

# 3. Update homeNewsApp JS in index.html to include currentPage, perPage, paginatedArticles, totalPages, setPage
$oldHomeNewsApp = @'
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
                    
                    // 1. Cross-tab Storage Event Listener
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

                    // 2. BroadcastChannel Instant Sync (Zero-Latency)
                    try {
                        const channel = new BroadcastChannel('nls_sync_channel');
                        channel.onmessage = (ev) => {
                            if (ev.data && ev.data.type === 'ARTICLES_UPDATED' && Array.isArray(ev.data.data)) {
                                this.articles = ev.data.data;
                            }
                        };
                    } catch (e) {}

                    // 3. Same-tab Custom Event Listener
                    window.addEventListener('nls-articles-updated', (e) => {
                        if (e.detail && Array.isArray(e.detail)) {
                            this.articles = e.detail;
                        }
                    });
                },

                loadArticles() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                                    window.NLS_DEFAULT_ARTICLES.forEach(defArt => {
                                        if (!parsed.some(a => a.id === defArt.id)) {
                                            parsed.unshift(defArt);
                                        }
                                    });
                                }
                                this.articles = parsed;
                                localStorage.setItem("nls_berita_articles_v1", JSON.stringify(this.articles));
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
                        return this.selectedCategory === 'all' || (art.categories && Array.isArray(art.categories) ? art.categories.includes(this.selectedCategory) : art.category === this.selectedCategory);
                    });
                },
'@

$newHomeNewsApp = @'
        function homeNewsApp() {
            return {
                selectedCategory: 'all',
                activeArticle: null,
                isReaderOpen: false,
                currentPage: 1,
                perPage: 4,

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
                    
                    this.$watch('selectedCategory', () => {
                        this.currentPage = 1;
                    });

                    // 1. Cross-tab Storage Event Listener
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

                    // 2. BroadcastChannel Instant Sync (Zero-Latency)
                    try {
                        const channel = new BroadcastChannel('nls_sync_channel');
                        channel.onmessage = (ev) => {
                            if (ev.data && ev.data.type === 'ARTICLES_UPDATED' && Array.isArray(ev.data.data)) {
                                this.articles = ev.data.data;
                            }
                        };
                    } catch (e) {}

                    // 3. Same-tab Custom Event Listener
                    window.addEventListener('nls-articles-updated', (e) => {
                        if (e.detail && Array.isArray(e.detail)) {
                            this.articles = e.detail;
                        }
                    });
                },

                loadArticles() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                if (typeof window.NLS_DEFAULT_ARTICLES !== "undefined" && Array.isArray(window.NLS_DEFAULT_ARTICLES)) {
                                    window.NLS_DEFAULT_ARTICLES.forEach(defArt => {
                                        if (!parsed.some(a => a.id === defArt.id)) {
                                            parsed.unshift(defArt);
                                        }
                                    });
                                }
                                this.articles = parsed;
                                localStorage.setItem("nls_berita_articles_v1", JSON.stringify(this.articles));
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
                        return this.selectedCategory === 'all' || (art.categories && Array.isArray(art.categories) ? art.categories.includes(this.selectedCategory) : art.category === this.selectedCategory);
                    });
                },

                paginatedArticles() {
                    const filtered = this.filteredArticles();
                    const start = (this.currentPage - 1) * this.perPage;
                    return filtered.slice(start, start + this.perPage);
                },

                totalPages() {
                    const count = this.filteredArticles().length;
                    return Math.max(1, Math.ceil(count / this.perPage));
                },

                setPage(page) {
                    if (page >= 1 && page <= this.totalPages()) {
                        this.currentPage = page;
                        const el = document.getElementById('berita');
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                },
'@

$content = $content.Replace($oldHomeNewsApp, $newHomeNewsApp)
[System.IO.File]::WriteAllText($homePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated homepage berita section to 1 row with numeric pagination!"
