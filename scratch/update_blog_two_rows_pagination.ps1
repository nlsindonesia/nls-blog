$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$content = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

# 1. Update Articles container div with id="katalog-artikel"
$oldContainer = '<div class="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20 pb-16">'
$newContainer = '<div id="katalog-artikel" class="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20 pb-16 scroll-mt-24">'
$content = $content.Replace($oldContainer, $newContainer)

# 2. Update Grid and Add Numeric Pagination Bar
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

                            <!-- Title (100% Dark Black, NEVER White in Light Mode) -->
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
'@

$newGridBlock = @'
            <!-- Dynamic Themed Article Cards Grid: Exactly 2 Rows on Desktop (4 cols x 2 rows = 8 cards) -->
            <div x-show="paginatedArticles().length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
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

                                <!-- Title (100% Dark Black, NEVER White in Light Mode) -->
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

            <!-- Numeric Pagination Navigation Bar for Blog Catalog -->
            <div x-show="totalPages() > 1" class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
                <!-- Left Info: Article Counters -->
                <div class="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 text-center sm:text-left">
                    Halaman <span class="text-sky-600 dark:text-sky-400 font-black text-sm sm:text-base" x-text="currentPage"></span> dari <span class="text-slate-800 dark:text-slate-200 font-black text-sm sm:text-base" x-text="totalPages()"></span>
                    <span class="mx-2 text-slate-300 dark:text-slate-700">•</span>
                    Menampilkan <span class="text-slate-800 dark:text-slate-200 font-black" x-text="paginatedArticles().length"></span> dari <span class="text-slate-800 dark:text-slate-200 font-black" x-text="filteredArticles().length"></span> Artikel
                </div>

                <!-- Center/Right: Numeric Pagination Buttons -->
                <div class="flex items-center gap-2 flex-wrap justify-center">
                    <!-- Prev Button -->
                    <button type="button" @click="setPage(currentPage - 1)" :disabled="currentPage === 1"
                        class="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border disabled:opacity-30 disabled:cursor-not-allowed"
                        :class="currentPage === 1 ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700' : 'bg-white dark:bg-[#131D38] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:text-sky-600 shadow-sm'">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
                        <span>Sebelumnya</span>
                    </button>

                    <!-- Number Buttons Loop -->
                    <template x-for="pageNum in totalPages()" :key="pageNum">
                        <button type="button" @click="setPage(pageNum)"
                            class="w-10 h-10 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer shadow-sm"
                            :class="currentPage === pageNum
                                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sky-500/30 scale-105 ring-2 ring-sky-400/50'
                                : 'bg-white dark:bg-[#131D38] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-sky-400 hover:text-sky-600'">
                            <span x-text="pageNum"></span>
                        </button>
                    </template>

                    <!-- Next Button -->
                    <button type="button" @click="setPage(currentPage + 1)" :disabled="currentPage === totalPages()"
                        class="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border disabled:opacity-30 disabled:cursor-not-allowed"
                        :class="currentPage === totalPages() ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700' : 'bg-white dark:bg-[#131D38] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:text-sky-600 shadow-sm'">
                        <span>Selanjutnya</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
'@

$content = $content.Replace($oldGridBlock, $newGridBlock)

# 3. Update blogApp in blog/index.html to include currentPage, perPage, paginatedArticles, totalPages, setPage
$oldBlogApp = @'
        function blogApp() {
            return {
                searchQuery: '',
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

                articles: (function() {
'@

$newBlogApp = @'
        function blogApp() {
            return {
                searchQuery: '',
                selectedCategory: 'all',
                activeArticle: null,
                isReaderOpen: false,
                currentPage: 1,
                perPage: 8,

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

                articles: (function() {
'@

$content = $content.Replace($oldBlogApp, $newBlogApp)

# Add watches and pagination methods in blogApp
$oldBlogInit = @'
                init() {
                    this.loadArticles();
                    
                    // 1. Cross-tab Storage Event Listener
'@

$newBlogInit = @'
                init() {
                    this.loadArticles();

                    this.$watch('selectedCategory', () => {
                        this.currentPage = 1;
                    });
                    this.$watch('searchQuery', () => {
                        this.currentPage = 1;
                    });
                    
                    // 1. Cross-tab Storage Event Listener
'@

$content = $content.Replace($oldBlogInit, $newBlogInit)

# Add paginatedArticles, totalPages, and setPage after filteredArticles
$oldFilteredArticles = @'
                filteredArticles() {
                    return this.articles.filter(art => {
                        if (art.status && art.status !== 'published') return false;
                        
                        const matchCat = this.selectedCategory === 'all' || 
                            (art.categories && Array.isArray(art.categories) ? art.categories.includes(this.selectedCategory) : art.category === this.selectedCategory);
                        const q = this.searchQuery.toLowerCase().trim();
                        const matchSearch = !q ||
                            (art.title && art.title.toLowerCase().includes(q)) ||
                            (art.metaDescription && art.metaDescription.toLowerCase().includes(q)) ||
                            (art.categories ? art.categories.join(' ').toLowerCase().includes(q) : (art.category && art.category.toLowerCase().includes(q))) ||
                            (art.author && art.author.toLowerCase().includes(q));

                        return matchCat && matchSearch;
                    });
                },
'@

$newFilteredArticles = @'
                filteredArticles() {
                    return this.articles.filter(art => {
                        if (art.status && art.status !== 'published') return false;
                        
                        const matchCat = this.selectedCategory === 'all' || 
                            (art.categories && Array.isArray(art.categories) ? art.categories.includes(this.selectedCategory) : art.category === this.selectedCategory);
                        const q = this.searchQuery.toLowerCase().trim();
                        const matchSearch = !q ||
                            (art.title && art.title.toLowerCase().includes(q)) ||
                            (art.metaDescription && art.metaDescription.toLowerCase().includes(q)) ||
                            (art.categories ? art.categories.join(' ').toLowerCase().includes(q) : (art.category && art.category.toLowerCase().includes(q))) ||
                            (art.author && art.author.toLowerCase().includes(q));

                        return matchCat && matchSearch;
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
                        const el = document.getElementById('katalog-artikel');
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                },
'@

$content = $content.Replace($oldFilteredArticles, $newFilteredArticles)
[System.IO.File]::WriteAllText($blogPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated blog/index.html to 2 rows with numeric pagination!"
