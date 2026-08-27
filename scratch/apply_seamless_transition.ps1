$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$content = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

# Replace the Hero and Articles start markup with the smooth wave and floating overlapping card
$oldHeroToArticlesPattern = '(?s)<!-- FULL COLOR VIBRANT HERO BANNER -->.*?<!-- FULL-COLOR INTUITIVE & STYLISH CONTROL BAR -->'

$newHeroToArticlesMarkup = @'
<!-- FULL COLOR VIBRANT HERO BANNER -->
        <section class="blog-hero-colorful pt-20 pb-28 sm:pb-36 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <!-- Decorative Ambient Glowing Light Spheres -->
            <div class="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-cyan-400/25 blur-3xl pointer-events-none"></div>
            <div class="absolute top-1/2 -right-24 w-[500px] h-[500px] rounded-full bg-emerald-400/25 blur-3xl pointer-events-none"></div>
            <div class="absolute bottom-0 left-1/3 w-[600px] h-48 bg-indigo-500/20 blur-3xl pointer-events-none"></div>

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
            </div>

            <!-- Seamless Organic Wave Divider Melting into Page Background -->
            <div class="absolute bottom-0 inset-x-0 overflow-hidden leading-none pointer-events-none z-0">
                <svg class="relative block w-full h-12 sm:h-20 text-slate-50 dark:text-[#0B1222]" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
                    <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"></path>
                </svg>
            </div>
        </section>

        <!-- ARTICLES LIST SECTION (5 ITEMS PER ROW ON DESKTOP) -->
        <div class="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20 pb-16">
            
            <!-- Ambient Glowing Mesh Background for Seamless Blending -->
            <div class="absolute top-20 left-10 w-96 h-96 rounded-full bg-sky-400/10 dark:bg-sky-500/5 blur-3xl pointer-events-none -z-10"></div>
            <div class="absolute top-80 right-10 w-96 h-96 rounded-full bg-emerald-400/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none -z-10"></div>

            <!-- FULL-COLOR INTUITIVE & STYLISH FLOATING CONTROL BAR -->
            <div class="bg-white/95 dark:bg-[#131D38]/95 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border-2 border-white dark:border-slate-700/80 shadow-2xl shadow-slate-300/60 dark:shadow-black/70 mb-8 transition-all">
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldHeroToArticlesPattern, $newHeroToArticlesMarkup)

[System.IO.File]::WriteAllText($blogPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Applied seamless wave transition and floating control card with ambient glow!"
