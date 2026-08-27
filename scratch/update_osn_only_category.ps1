$osnPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\osn\index.html"
$content = [System.IO.File]::ReadAllText($osnPath, [System.Text.Encoding]::UTF8)

# 1. Update Header Bar to dedicated OSN Category Badge & Direct Link
$oldHeaderBlock = @'
        <!-- Header & Category Filter Bar -->
        <div class="bg-white dark:bg-[#131D38] p-5 sm:p-6 rounded-3xl border-2 border-sky-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 mb-8 transition-all">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <!-- Section Title -->
                <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Berita Terkini &amp; Wawasan OSN
                            </h2>
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                <span x-text="filteredArticles().length"></span> Berita
                            </span>
                        </div>
                        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                            Update informasi olimpiade sains, bedah silabus, strategi peraih medali, dan kabar edukasi terbaru.
                        </p>
                    </div>
                </div>

                <!-- Category Filter Dropdown -->
                <div class="flex items-center gap-3 self-start lg:self-auto" x-data="{ isCatMenuOpen: false }" @click.outside="isCatMenuOpen = false">
                    <div class="relative min-w-[220px] sm:min-w-[250px]">
                        <button type="button" @click="isCatMenuOpen = !isCatMenuOpen"
                            class="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-sky-400 dark:border-sky-600 shadow-sm hover:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-300/40 cursor-pointer transition-all">
                            <div class="flex items-center gap-2 min-w-0">
                                <span class="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0"></span>
                                <span class="text-xs sm:text-sm font-black text-slate-800 dark:text-white truncate"
                                    x-text="selectedCategory === 'all' ? 'Semua Kategori Berita' : selectedCategory"></span>
                            </div>
                            <svg class="w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0"
                                :class="isCatMenuOpen ? 'rotate-180 text-sky-600' : ''"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                        </button>

                        <div x-show="isCatMenuOpen" x-cloak
                            x-transition:enter="transition ease-out duration-150"
                            x-transition:enter-start="opacity-0 translate-y-1 scale-95"
                            x-transition:enter-end="opacity-100 translate-y-0 scale-100"
                            x-transition:leave="transition ease-in duration-100"
                            x-transition:leave-start="opacity-100 translate-y-0 scale-100"
                            x-transition:leave-end="opacity-0 translate-y-1 scale-95"
                            class="absolute right-0 top-full mt-2 w-full min-w-[250px] rounded-2xl bg-white dark:bg-[#131D38] border-2 border-slate-200 dark:border-slate-700 shadow-2xl p-1.5 z-40 space-y-0.5 max-h-72 overflow-y-auto">
                            
                            <button type="button" @click="selectedCategory = 'all'; isCatMenuOpen = false"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left"
                                :class="selectedCategory === 'all' ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-black' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'">
                                <span>Semua Kategori Berita</span>
                                <svg x-show="selectedCategory === 'all'" class="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                            </button>

                            <template x-for="cat in categories" :key="cat">
                                <button type="button" @click="selectedCategory = cat; isCatMenuOpen = false"
                                    class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left"
                                    :class="selectedCategory === cat ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-black' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'">
                                    <span x-text="cat"></span>
                                    <svg x-show="selectedCategory === cat" class="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                                </button>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
'@

$newHeaderBlock = @'
        <!-- Header & Dedicated OSN Category Badge Bar -->
        <div class="bg-white dark:bg-[#131D38] p-5 sm:p-6 rounded-3xl border-2 border-sky-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 mb-8 transition-all">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <!-- Section Title -->
                <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                    </div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Berita Terkini &amp; Wawasan OSN
                            </h2>
                            <span class="px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                                <span>Kategori: OSN &amp; Sains</span>
                            </span>
                        </div>
                        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                            Update eksklusif olimpiade sains, bedah silabus kompetisi, strategi peraih medali, dan kabar pembinaan OSN.
                        </p>
                    </div>
                </div>

                <!-- Right: Total Counter & Link to Blog -->
                <div class="flex items-center gap-3 shrink-0">
                    <span class="px-3 py-1.5 rounded-2xl text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <span class="text-sky-600 dark:text-sky-400 font-black text-sm" x-text="filteredArticles().length"></span> Artikel OSN
                    </span>
                </div>
            </div>
        </div>
'@

$content = $content.Replace($oldHeaderBlock, $newHeaderBlock)

# 2. Update filteredArticles in osnNewsApp to filter ONLY OSN articles
$oldFilteredArticles = @'
                filteredArticles() {
                    return this.articles.filter(art => {
                        if (art.status && art.status !== 'published') return false;
                        return this.selectedCategory === 'all' || (art.categories && Array.isArray(art.categories) ? art.categories.includes(this.selectedCategory) : art.category === this.selectedCategory);
                    });
                },
'@

$newFilteredArticles = @'
                filteredArticles() {
                    return this.articles.filter(art => {
                        if (art.status && art.status !== 'published') return false;
                        const cats = (art.categories && Array.isArray(art.categories)) ? art.categories : [art.category || ''];
                        return cats.some(c => c && c.toLowerCase().includes('osn'));
                    });
                },
'@

$content = $content.Replace($oldFilteredArticles, $newFilteredArticles)

[System.IO.File]::WriteAllText($osnPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated osn/index.html to filter ONLY OSN news!"
