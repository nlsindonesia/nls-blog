$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$content = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

# Replace the entire ARTICLES LIST SECTION with the complete, correctly structured section
$oldSectionPattern = '(?s)<!-- ARTICLES LIST SECTION -->.*?<!-- Full Article Reader Modal'

$newSectionMarkup = @'
<!-- ARTICLES LIST SECTION -->
        <div class="container-max px-4 sm:px-6 lg:px-8 py-14">
            
            <!-- Result Count & Active Filter Indicator with Category Dropdown (at marked red X position) -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div class="flex items-center gap-2.5">
                    <span class="text-sm font-bold text-slate-700 dark:text-slate-300">Menampilkan</span>
                    <span class="px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800"
                        x-text="filteredArticles().length + ' Artikel Terbit'"></span>
                    <span x-show="selectedCategory !== 'all'" class="text-xs font-bold text-slate-500 hidden sm:inline"
                        x-text="'• Filter: ' + selectedCategory"></span>
                </div>

                <!-- CATEGORY DROPDOWN (EXACTLY AT RED X POSITION) -->
                <div class="flex items-center gap-3 self-start sm:self-auto">
                    <label class="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:inline">Kategori:</label>
                    <div class="relative min-w-[210px] sm:min-w-[240px]">
                        <select x-model="selectedCategory"
                            class="w-full appearance-none pl-4 pr-10 py-2.5 rounded-2xl bg-white dark:bg-[#131D38] border-2 border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 cursor-pointer transition-all">
                            <option value="all">Semua Kategori</option>
                            <option value="OSN & Sains">OSN &amp; Sains</option>
                            <option value="SNBT & UTBK">SNBT &amp; UTBK</option>
                            <option value="TKA & Akademik">TKA &amp; Akademik</option>
                            <option value="Tips Belajar & Prestasi">Tips Belajar &amp; Prestasi</option>
                            <option value="Berita Sekolah & Diknas">Berita Sekolah &amp; Diknas</option>
                            <option value="Informasi NLS">Informasi NLS</option>
                            <option value="Panduan Beasiswa">Panduan Beasiswa</option>
                            <option value="Bimbel NexGen">Bimbel NexGen</option>
                        </select>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-500 dark:text-slate-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
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
                    Coba gunakan kata kunci pencarian yang lain atau pilih kategori artikel berbeda di dropdown atas.
                </p>
                <button type="button" @click="selectedCategory = 'all'; searchQuery = ''"
                    class="px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-black transition-all shadow-md cursor-pointer">
                    Reset Filter Pencarian
                </button>
            </div>

            <!-- Dynamic Themed Article Cards Grid -->
            <div x-show="filteredArticles().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <template x-for="art in filteredArticles()" :key="art.id">
                    <article :class="getArticleAccentClass(art.category)"
                        class="group bg-white dark:bg-[#131D38] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 flex flex-col hover:-translate-y-2 transition-all duration-300">
                        
                        <!-- Card Banner Image with Hover Zoom -->
                        <div class="relative h-56 overflow-hidden block bg-slate-100 dark:bg-slate-900 cursor-pointer" @click="openArticle(art)">
                            <img :src="art.coverImage || '/nls-logo-300.png'"
                                :alt="art.title"
                                loading="lazy"
                                onerror="this.onerror=null;this.src='/nls-logo-300.png';"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            
                            <!-- Category Badge -->
                            <div class="absolute top-4 left-4 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md border"
                                :class="getCategoryBadgeClass(art.category)"
                                x-text="art.category">
                            </div>
                        </div>

                        <!-- Card Body (High Contrast Typography) -->
                        <div class="p-6 sm:p-7 flex flex-col flex-grow justify-between space-y-4">
                            <div class="space-y-3">
                                <!-- Date & Author Row -->
                                <div class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                                    <span class="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <span x-text="formatDisplayDate(art.date)"></span>
                                    </span>
                                    <span class="text-slate-400">&bull;</span>
                                    <span class="text-slate-700 dark:text-slate-300 font-extrabold truncate" x-text="art.author || 'Tim NLS'"></span>
                                </div>

                                <!-- Title (100% Dark Black, NEVER White in Light Mode) -->
                                <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 cursor-pointer"
                                    @click="openArticle(art)"
                                    x-text="art.title">
                                </h2>

                                <!-- Description Excerpt -->
                                <p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed font-medium"
                                    x-text="art.metaDescription || art.title">
                                </p>
                            </div>

                            <!-- Read Button -->
                            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <button type="button" @click="openArticle(art)"
                                    class="inline-flex items-center gap-1.5 font-black text-xs text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 group-hover:translate-x-1 transition-all cursor-pointer">
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

        <!-- Full Article Reader Modal
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldSectionPattern, $newSectionMarkup)

# Also ensure loadArticles() is called on init() in blogApp()
$oldInit = @'
                init() {
                    // Listen to real-time changes from /nlsadmin across tabs
                    window.addEventListener('storage', (e) => {
'@

$newInit = @'
                init() {
                    this.loadArticles();
                    // Listen to real-time changes from /nlsadmin across tabs
                    window.addEventListener('storage', (e) => {
'@

if (-not $content.Contains('this.loadArticles();')) {
    $content = $content.Replace($oldInit, $newInit)
}

$oldLoadArticlesLocation = 'filteredArticles() {'
$newLoadArticlesMethod = @'
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
'@

if (-not $content.Contains('loadArticles() {')) {
    $content = $content.Replace($oldLoadArticlesLocation, $newLoadArticlesMethod)
}

[System.IO.File]::WriteAllText($blogPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Fixed complete article grid structure and rendering in blog/index.html!"
