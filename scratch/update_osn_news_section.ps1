$osnPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\osn\index.html"
$content = [System.IO.File]::ReadAllText($osnPath, [System.Text.Encoding]::UTF8)

# 1. Update Head to include default-articles.js and card accent styles
$oldHeadEnd = @'
    <link rel="stylesheet" href="/theme.css" />
    <script src="/theme.js"></script>
</head>
'@

$newHeadEnd = @'
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
    <link rel="stylesheet" href="/theme.css" />
    <script src="/theme.js"></script>
</head>
'@

$content = $content.Replace($oldHeadEnd, $newHeadEnd)

# 2. Replace static Berita Terkini with Dynamic Canva-Style News Section + Modal + Pagination
$oldNewsSection = @'
<section class="py-32 bg-surface-bright">
<div class="container-max px-margin-mobile md:px-margin-desktop transition-all duration-700 opacity-100 translate-y-0 opacity-0 translate-y-10">
<div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
<div class="max-w-2xl">
<h2 class="text-headline-lg mb-4 text-action-blue font-extrabold">Berita Terkini</h2>
<p class="text-body-md text-on-surface-variant font-medium">Update terbaru seputar dunia olimpiade dan pendidikan di Next Level Study.</p>
</div>
<a class="text-action-blue font-bold text-label-md hover:underline flex items-center gap-2" href="javascript:void(0)">
        Lihat Semua <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<!-- News Card 1 -->
<div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-alt transition-all duration-300 hover:shadow-md group">
<div class="h-48 overflow-hidden">
<img alt="Provincial Ceremony" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4ABzuE3Zzf-5cMcIxaOvSqopv4O26QM0o2lvydzax8lb6cAKQ3N_ilcSp84Tiw2V_grOtTiP8vHPTJOoICRiBitGPvMupN-21RTa3RQ4jzVvYlmkYMbjY3cNFK_sN5x0dWfV2_927q-7qbyZdrk39cSB5Pj55hk5OU7rnDQ1IO2hewVJsuGzoWlTemsR5gP9Et-t9VHbIjpN8TS-bgY2mhRizCDo95PlAU4bjZvu2Txi_i2IrBBk2ARoxSl33MobeQEB2n2HoPeY">
</div>
<div class="p-6">
<span class="text-[10px] font-extrabold text-action-blue tracking-widest uppercase mb-3 block">PENGUMUMAN</span>
<h3 class="text-headline-md mb-3 text-on-background leading-tight">Jadwal Seleksi OSN Tingkat Provinsi 2024 Telah Rilis!</h3>
<p class="text-body-sm text-on-surface-variant mb-6 line-clamp-2">Persiapkan dirimu untuk menghadapi seleksi ketat di tingkat provinsi mendatang.</p>
<div class="flex items-center gap-2 text-on-surface-variant">
<span class="material-symbols-outlined text-[16px]">calendar_today</span>
<span class="text-label-sm">15 Mar 2024</span>
</div>
</div>
</div>
<!-- News Card 2 -->
<div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-alt transition-all duration-300 hover:shadow-md group">
<div class="h-48 overflow-hidden">
<img alt="Student Studying" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBndqh9vQDW_sbck_LFW7NxDxuKxMai7ZVQq8uv1-FYoSStMSx3un4_uWir6OJ-o_RLLXtLH748nYSfsVsIxLhY9kCU_28TYHLHXpFG072dZnyNHL8LTPLYDeS5pBLfXRBxXvsrEgjNWQzeA4Fq9Ews3MWH5xYLWifOrMQrsrlYEBE9NiNhN14IZ59FyKd8BzhHFW3f1Be9RwyBlMKXT0EXGsMMrusGTBIh8sT3CuvU100HTaZvp3w3glvTrJkNPIM-ZxX30nkgxlM">
</div>
<div class="p-6">
<span class="text-[10px] font-extrabold text-action-blue tracking-widest uppercase mb-3 block">TIPS &amp; TRIK</span>
<h3 class="text-headline-md mb-3 text-on-background leading-tight">Strategi Menjawab Soal Literasi Bahasa Inggris SNBT 2024</h3>
<p class="text-body-sm text-on-surface-variant mb-6 line-clamp-2">Kuasai teknik skimming dan scanning untuk menghemat waktu pengerjaan soal.</p>
<div class="flex items-center gap-2 text-on-surface-variant">
<span class="material-symbols-outlined text-[16px]">calendar_today</span>
<span class="text-label-sm">12 Mar 2024</span>
</div>
</div>
</div>
<!-- News Card 3 -->
<div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-alt transition-all duration-300 hover:shadow-md group">
<div class="h-48 overflow-hidden">
<img alt="Webinar Interface" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUGt1CUnScvWL3Fz1l7sDbXZtEbZMNSOlQD1bmDLGrhql8jgklfrS67O0v9oT-E0p6v6hyTZSiTnN5G6OXPXyykDd_AfZpewf9GQ9jlRREF4Tds5w4rCDh8_cJIeVbhGSJUipU0W2rxUl3X4xsMuAnyiXascOuqclIWxrOJIK9sM7Ae-yA9Z420sho4TTFbilayPYHp1K1kwOwnXqhd2fXIlSh3Hn_Y7WmWRq-_UkuTWwQmj5mf8gfMqaSzgLsYUDH61OtSMCbQj8">
</div>
<div class="p-6">
<span class="text-[10px] font-extrabold text-action-blue tracking-widest uppercase mb-3 block">EVENT</span>
<h3 class="text-headline-md mb-3 text-on-background leading-tight">Webinar Gratis: Kupas Tuntas Perubahan Sistem Seleksi PTN</h3>
<p class="text-body-sm text-on-surface-variant mb-6 line-clamp-2">Sesi berbagi bersama pakar pendidikan tentang arah baru kurikulum nasional.</p>
<div class="flex items-center gap-2 text-on-surface-variant">
<span class="material-symbols-outlined text-[16px]">calendar_today</span>
<span class="text-label-sm">10 Mar 2024</span>
</div>
</div>
</div>
</div>
</div>
</section>
'@

$newNewsSection = @'
<!-- =========================================================================
     DYNAMIC NEWS SECTION (CANVA-STYLE CARDS, FILTER, MODAL READER & PAGINATION)
     ========================================================================= -->
<section id="berita" class="py-20 bg-surface-bright relative overflow-hidden scroll-mt-20" x-data="osnNewsApp()">
    <div class="container-max px-margin-mobile md:px-margin-desktop">
        
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

        <!-- Empty State -->
        <div x-show="filteredArticles().length === 0" x-cloak class="text-center py-16 bg-white dark:bg-slate-900/60 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-4 shadow-sm">
            <div class="w-16 h-16 rounded-full bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto text-3xl">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <h3 class="text-lg font-black text-slate-900 dark:text-white">Tidak Ada Artikel yang Cocok</h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Pilih kategori artikel lain pada dropdown di atas atau buka katalog blog lengkap kami.
            </p>
            <button type="button" @click="selectedCategory = 'all'"
                class="px-5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-black transition-all shadow-md cursor-pointer">
                Reset Filter Kategori
            </button>
        </div>

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
            <div class="p-6 sm:p-10 overflow-y-auto space-y-6 flex-1">
                <template x-if="activeArticle">
                    <div class="space-y-6 max-w-3xl mx-auto">
                        <!-- Article Cover Banner -->
                        <div class="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                            <img :src="activeArticle.coverImage || '/images/blog/cover-snbt-2027.jpg'"
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
                                <span class="text-slate-700 dark:text-slate-300 font-bold" x-text="'Penulis: ' + (activeArticle.author || 'Tim Akademik NLS')"></span>
                            </div>

                            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight"
                                x-text="activeArticle.title"></h1>
                        </div>

                        <!-- Full Rich Article Content Body -->
                        <div class="blog-prose pt-4 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed"
                            x-html="activeArticle.content"></div>
                    </div>
                </template>
            </div>
            
            <!-- Modal Footer -->
            <div class="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center shrink-0">
                <a href="/blog" class="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1">
                    <span>Lihat Semua Artikel di Blog</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </a>
                <button type="button" @click="closeReader()"
                    class="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black hover:opacity-90 transition-opacity cursor-pointer">
                    Tutup Artikel
                </button>
            </div>
        </div>
    </div>
</section>
'@

$content = $content.Replace($oldNewsSection, $newNewsSection)

# 3. Add osnNewsApp script at bottom of osn/index.html before </body>
$scriptToAppend = @'
    <!-- Dynamic OSN News Application Engine Script -->
    <script>
        function osnNewsApp() {
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
</body>
</html>
'@

$oldBodyEnd = '</body></html>'
$content = $content.Replace($oldBodyEnd, $scriptToAppend)

[System.IO.File]::WriteAllText($osnPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated osn/index.html with dynamic Canva-style news section & reader modal!"
