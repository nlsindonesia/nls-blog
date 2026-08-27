$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$content = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

# 1. Add Full Color CSS Styles to <style>
$fullColorStyles = @'
        /* =========================================================================
           FULL COLOR HERO & BLOG VIBRANT STYLING
           ========================================================================= */
        .blog-hero-colorful {
            background: linear-gradient(135deg, #0a192f 0%, #1e3a8a 35%, #0284c7 70%, #059669 100%) !important;
            color: #ffffff !important;
            position: relative;
        }

        .category-pill-active-all {
            background: linear-gradient(135deg, #ff8a00 0%, #ea580c 100%) !important;
            color: #ffffff !important;
            border: 2px solid #fdba74 !important;
            box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35) !important;
            font-weight: 900 !important;
        }
        .category-pill-active-osn {
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important;
            color: #ffffff !important;
            border: 2px solid #7dd3fc !important;
            box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35) !important;
            font-weight: 900 !important;
        }
        .category-pill-active-snbt {
            background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
            color: #ffffff !important;
            border: 2px solid #6ee7b7 !important;
            box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35) !important;
            font-weight: 900 !important;
        }
        .category-pill-active-tka {
            background: linear-gradient(135deg, #d97706 0%, #b45309 100%) !important;
            color: #ffffff !important;
            border: 2px solid #fcd34d !important;
            box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35) !important;
            font-weight: 900 !important;
        }
        .category-pill-active-tips {
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
            color: #ffffff !important;
            border: 2px solid #c4b5fd !important;
            box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35) !important;
            font-weight: 900 !important;
        }
        .category-pill-active-school {
            background: linear-gradient(135deg, #e11d48 0%, #be123c 100%) !important;
            color: #ffffff !important;
            border: 2px solid #fda4af !important;
            box-shadow: 0 4px 14px rgba(225, 29, 72, 0.35) !important;
            font-weight: 900 !important;
        }
        .category-pill-active-info {
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%) !important;
            color: #ffffff !important;
            border: 2px solid #a5b4fc !important;
            box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35) !important;
            font-weight: 900 !important;
        }

        .category-pill-inactive {
            background: rgba(255, 255, 255, 0.15) !important;
            color: #ffffff !important;
            border: 1.5px solid rgba(255, 255, 255, 0.3) !important;
            font-weight: 700 !important;
            backdrop-filter: blur(8px);
        }
        .category-pill-inactive:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: translateY(-2px);
        }

        /* 3D Colorful Category Feature Cards */
        .feat-card-sky {
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.3) !important;
        }
        .feat-card-emerald {
            background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.3) !important;
        }
        .feat-card-amber {
            background: linear-gradient(135deg, #d97706 0%, #b45309 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 10px 25px -5px rgba(217, 119, 6, 0.3) !important;
        }
        .feat-card-purple {
            background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.3) !important;
        }

        /* Themed Article Border Accents */
        .card-accent-osn { border-top: 4px solid #0284c7 !important; }
        .card-accent-snbt { border-top: 4px solid #059669 !important; }
        .card-accent-tka { border-top: 4px solid #d97706 !important; }
        .card-accent-tips { border-top: 4px solid #7c3aed !important; }
        .card-accent-school { border-top: 4px solid #e11d48 !important; }
        .card-accent-info { border-top: 4px solid #4f46e5 !important; }
'@

if (-not $content.Contains('FULL COLOR HERO & BLOG VIBRANT STYLING')) {
    $content = $content.Replace('</style>', $fullColorStyles + "`n    </style>")
}

# 2. Overhaul the Hero Section and Article Grid with vibrant colors and dark readable typography
$oldMainPattern = '(?s)<main class="bg-surface min-h-screen" x-data="blogApp\(\)">.*?<\/main>'

$newMainSection = @'
<main class="bg-surface min-h-screen" x-data="blogApp()">
        
        <!-- FULL COLOR VIBRANT HERO BANNER -->
        <section class="blog-hero-colorful pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <!-- Decorative Light Spheres -->
            <div class="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"></div>

            <div class="max-w-4xl mx-auto text-center relative z-10 space-y-6">
                <!-- Badge Pill -->
                <div class="inline-flex items-center gap-2 rounded-full border-2 border-sky-300/40 bg-white/15 px-5 py-2 text-xs sm:text-sm font-black text-white backdrop-blur-md shadow-md">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span class="tracking-wide">Pusat Edukasi &amp; Informasi Resmi NLS</span>
                </div>

                <!-- Big Headline with Gradient Highlights -->
                <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                    Berita, Edukasi &amp; <span style="background: linear-gradient(135deg, #38bdf8 0%, #fbbf24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Prestasi NLS</span>
                </h1>

                <!-- Subtitle with High Legibility -->
                <p class="text-sm sm:text-lg text-sky-100 max-w-2xl mx-auto font-semibold leading-relaxed drop-shadow-sm">
                    Kumpulan artikel eksklusif, analisis bedah silabus OSN, strategi jitu menembus SNBT, dan wawasan dunia pendidikan terlengkap.
                </p>

                <!-- Crisp High-Contrast Search Input Bar -->
                <div class="max-w-2xl mx-auto pt-3">
                    <div class="relative flex items-center shadow-2xl rounded-full">
                        <span class="absolute inset-y-0 left-0 pl-5 flex items-center text-sky-600 pointer-events-none">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        <input type="text" x-model="searchQuery" placeholder="Cari judul artikel, tips belajar, silabus OSN, atau kata kunci..."
                            style="color: #0f172a !important; font-weight: 700 !important;"
                            class="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-full bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base border-2 border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-300/50 shadow-xl transition-all">
                        <button type="button" x-show="searchQuery" @click="searchQuery = ''"
                            class="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-rose-600 cursor-pointer transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>

                <!-- Vibrant Category Filter Pills -->
                <div class="flex flex-wrap items-center justify-center gap-2.5 pt-3">
                    <!-- Semua -->
                    <button type="button" @click="selectedCategory = 'all'"
                        :class="selectedCategory === 'all' ? 'category-pill-active-all scale-105' : 'category-pill-inactive'"
                        class="px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        ⭐ Semua Kategori
                    </button>

                    <!-- SNBT -->
                    <button type="button" @click="selectedCategory = 'SNBT & UTBK'"
                        :class="selectedCategory === 'SNBT & UTBK' ? 'category-pill-active-snbt scale-105' : 'category-pill-inactive'"
                        class="px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        🎓 SNBT &amp; UTBK
                    </button>

                    <!-- OSN -->
                    <button type="button" @click="selectedCategory = 'OSN & Sains'"
                        :class="selectedCategory === 'OSN & Sains' ? 'category-pill-active-osn scale-105' : 'category-pill-inactive'"
                        class="px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        🏆 OSN &amp; Sains
                    </button>

                    <!-- TKA -->
                    <button type="button" @click="selectedCategory = 'TKA & Akademik'"
                        :class="selectedCategory === 'TKA & Akademik' ? 'category-pill-active-tka scale-105' : 'category-pill-inactive'"
                        class="px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        📊 TKA &amp; Akademik
                    </button>

                    <!-- Tips Belajar -->
                    <button type="button" @click="selectedCategory = 'Tips Belajar & Prestasi'"
                        :class="selectedCategory === 'Tips Belajar & Prestasi' ? 'category-pill-active-tips scale-105' : 'category-pill-inactive'"
                        class="px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        💡 Tips Belajar &amp; Prestasi
                    </button>

                    <!-- Berita Sekolah -->
                    <button type="button" @click="selectedCategory = 'Berita Sekolah & Diknas'"
                        :class="selectedCategory === 'Berita Sekolah & Diknas' ? 'category-pill-active-school scale-105' : 'category-pill-inactive'"
                        class="px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        🏫 Berita Sekolah &amp; Diknas
                    </button>

                    <!-- Informasi NLS -->
                    <button type="button" @click="selectedCategory = 'Informasi NLS'"
                        :class="selectedCategory === 'Informasi NLS' ? 'category-pill-active-info scale-105' : 'category-pill-inactive'"
                        class="px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        📢 Informasi NLS
                    </button>
                </div>
            </div>
        </section>

        <!-- 4 FULL-COLOR 3D FEATURE HIGHLIGHT CARDS -->
        <section class="container-max px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Card 1: SNBT -->
                <div @click="selectedCategory = 'SNBT & UTBK'"
                    class="feat-card-emerald p-5 rounded-3xl cursor-pointer hover:scale-[1.03] transition-all flex items-center gap-4">
                    <span class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">🎓</span>
                    <div>
                        <h4 class="text-sm font-black text-white">Panduan SNBT</h4>
                        <p class="text-xs text-emerald-100 mt-0.5">Sistem IRT &amp; Strategi PTN</p>
                    </div>
                </div>

                <!-- Card 2: OSN -->
                <div @click="selectedCategory = 'OSN & Sains'"
                    class="feat-card-sky p-5 rounded-3xl cursor-pointer hover:scale-[1.03] transition-all flex items-center gap-4">
                    <span class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">🏆</span>
                    <div>
                        <h4 class="text-sm font-black text-white">Olimpiade OSN</h4>
                        <p class="text-xs text-sky-100 mt-0.5">Bedah Silabus &amp; Soal Juara</p>
                    </div>
                </div>

                <!-- Card 3: TKA -->
                <div @click="selectedCategory = 'TKA & Akademik'"
                    class="feat-card-amber p-5 rounded-3xl cursor-pointer hover:scale-[1.03] transition-all flex items-center gap-4">
                    <span class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">📊</span>
                    <div>
                        <h4 class="text-sm font-black text-white">Akademik &amp; TKA</h4>
                        <p class="text-xs text-amber-100 mt-0.5">Ujian Pusmendik &amp; Rapor</p>
                    </div>
                </div>

                <!-- Card 4: Tips Belajar -->
                <div @click="selectedCategory = 'Tips Belajar & Prestasi'"
                    class="feat-card-purple p-5 rounded-3xl cursor-pointer hover:scale-[1.03] transition-all flex items-center gap-4">
                    <span class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">💡</span>
                    <div>
                        <h4 class="text-sm font-black text-white">Tips &amp; Prestasi</h4>
                        <p class="text-xs text-purple-100 mt-0.5">Trik Belajar &amp; Beasiswa</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- ARTICLES LIST SECTION -->
        <div class="container-max px-4 sm:px-6 lg:px-8 py-14">
            
            <!-- Result Count & Active Filter Indicator -->
            <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div class="flex items-center gap-2.5">
                    <span class="text-sm font-bold text-slate-700 dark:text-slate-300">Menampilkan</span>
                    <span class="px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800"
                        x-text="filteredArticles().length + ' Artikel Terbit'"></span>
                    <span x-show="selectedCategory !== 'all'" class="text-xs font-bold text-slate-500 hidden sm:inline"
                        x-text="'• Filter: ' + selectedCategory"></span>
                </div>

                <button type="button" x-show="selectedCategory !== 'all' || searchQuery"
                    @click="selectedCategory = 'all'; searchQuery = ''"
                    class="text-xs font-bold text-sky-600 hover:text-sky-800 dark:text-sky-400 hover:underline cursor-pointer">
                    Tampilkan Semua
                </button>
            </div>

            <!-- Empty State -->
            <div x-show="filteredArticles().length === 0" x-cloak class="text-center py-16 bg-white dark:bg-slate-900/60 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-4 shadow-sm">
                <div class="w-16 h-16 rounded-full bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto text-3xl">
                    🔍
                </div>
                <h3 class="text-lg font-black text-slate-900 dark:text-white">Tidak Ada Artikel yang Cocok</h3>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Coba gunakan kata kunci pencarian yang lain atau pilih kategori artikel berbeda di atas.
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
                                    <span>•</span>
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
                                    <span class="text-slate-700 dark:text-slate-300 font-bold" x-text="'Penulis: ' + (activeArticle.author || 'Tim Akademik NLS')"></span>
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

# 3. Update Alpine blogApp() methods for themed accents
$oldBlogApp = 'getCategoryBadgeClass(cat) {'
$newBlogApp = @'
                getArticleAccentClass(cat) {
                    switch (cat) {
                        case 'OSN & Sains': return 'card-accent-osn';
                        case 'SNBT & UTBK': return 'card-accent-snbt';
                        case 'TKA & Akademik': return 'card-accent-tka';
                        case 'Tips Belajar & Prestasi': return 'card-accent-tips';
                        case 'Berita Sekolah & Diknas': return 'card-accent-school';
                        default: return 'card-accent-info';
                    }
                },

                getCategoryBadgeClass(cat) {
'@

if (-not $content.Contains('getArticleAccentClass(cat)')) {
    $content = $content.Replace($oldBlogApp, $newBlogApp)
}

[System.IO.File]::WriteAllText($blogPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Overhauled /blog with Full-Color Hero, 3D Stat Cards, and vibrant, legible typography!"
