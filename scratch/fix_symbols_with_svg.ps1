$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$content = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

# Replace the pills container with clean inline SVGs
$oldPillsPattern = '(?s)<!-- Vibrant Category Filter Pills -->.*?<\/div>\s*<\/div>\s*<\/section>'

$newPillsMarkup = @'
<!-- Vibrant Category Filter Pills with Crisp SVG Icons -->
                <div class="flex flex-wrap items-center justify-center gap-2.5 pt-3">
                    <!-- Semua -->
                    <button type="button" @click="selectedCategory = 'all'"
                        :class="selectedCategory === 'all' ? 'category-pill-active-all scale-105' : 'category-pill-inactive'"
                        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span>Semua Kategori</span>
                    </button>

                    <!-- SNBT -->
                    <button type="button" @click="selectedCategory = 'SNBT & UTBK'"
                        :class="selectedCategory === 'SNBT & UTBK' ? 'category-pill-active-snbt scale-105' : 'category-pill-inactive'"
                        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
                        <span>SNBT &amp; UTBK</span>
                    </button>

                    <!-- OSN -->
                    <button type="button" @click="selectedCategory = 'OSN & Sains'"
                        :class="selectedCategory === 'OSN & Sains' ? 'category-pill-active-osn scale-105' : 'category-pill-inactive'"
                        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>
                        <span>OSN &amp; Sains</span>
                    </button>

                    <!-- TKA -->
                    <button type="button" @click="selectedCategory = 'TKA & Akademik'"
                        :class="selectedCategory === 'TKA & Akademik' ? 'category-pill-active-tka scale-105' : 'category-pill-inactive'"
                        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>
                        <span>TKA &amp; Akademik</span>
                    </button>

                    <!-- Tips Belajar -->
                    <button type="button" @click="selectedCategory = 'Tips Belajar & Prestasi'"
                        :class="selectedCategory === 'Tips Belajar & Prestasi' ? 'category-pill-active-tips scale-105' : 'category-pill-inactive'"
                        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>
                        <span>Tips Belajar &amp; Prestasi</span>
                    </button>

                    <!-- Berita Sekolah -->
                    <button type="button" @click="selectedCategory = 'Berita Sekolah & Diknas'"
                        :class="selectedCategory === 'Berita Sekolah & Diknas' ? 'category-pill-active-school scale-105' : 'category-pill-inactive'"
                        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9z"/></svg>
                        <span>Berita Sekolah &amp; Diknas</span>
                    </button>

                    <!-- Informasi NLS -->
                    <button type="button" @click="selectedCategory = 'Informasi NLS'"
                        :class="selectedCategory === 'Informasi NLS' ? 'category-pill-active-info scale-105' : 'category-pill-inactive'"
                        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/></svg>
                        <span>Informasi NLS</span>
                    </button>
                </div>
            </div>
        </section>
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldPillsPattern, $newPillsMarkup)

# Replace the 4 3D feature cards with clean SVG icons
$oldCardsPattern = '(?s)<!-- 4 FULL-COLOR 3D FEATURE HIGHLIGHT CARDS -->.*?<\/section>'

$newCardsMarkup = @'
<!-- 4 FULL-COLOR 3D FEATURE HIGHLIGHT CARDS -->
        <section class="container-max px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Card 1: SNBT -->
                <div @click="selectedCategory = 'SNBT & UTBK'"
                    class="feat-card-emerald p-5 rounded-3xl cursor-pointer hover:scale-[1.03] transition-all flex items-center gap-4">
                    <span class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
                    </span>
                    <div>
                        <h4 class="text-sm font-black text-white">Panduan SNBT</h4>
                        <p class="text-xs text-emerald-100 mt-0.5">Sistem IRT &amp; Strategi PTN</p>
                    </div>
                </div>

                <!-- Card 2: OSN -->
                <div @click="selectedCategory = 'OSN & Sains'"
                    class="feat-card-sky p-5 rounded-3xl cursor-pointer hover:scale-[1.03] transition-all flex items-center gap-4">
                    <span class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>
                    </span>
                    <div>
                        <h4 class="text-sm font-black text-white">Olimpiade OSN</h4>
                        <p class="text-xs text-sky-100 mt-0.5">Bedah Silabus &amp; Soal Juara</p>
                    </div>
                </div>

                <!-- Card 3: TKA -->
                <div @click="selectedCategory = 'TKA & Akademik'"
                    class="feat-card-amber p-5 rounded-3xl cursor-pointer hover:scale-[1.03] transition-all flex items-center gap-4">
                    <span class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/></svg>
                    </span>
                    <div>
                        <h4 class="text-sm font-black text-white">Akademik &amp; TKA</h4>
                        <p class="text-xs text-amber-100 mt-0.5">Ujian Pusmendik &amp; Rapor</p>
                    </div>
                </div>

                <!-- Card 4: Tips Belajar -->
                <div @click="selectedCategory = 'Tips Belajar & Prestasi'"
                    class="feat-card-purple p-5 rounded-3xl cursor-pointer hover:scale-[1.03] transition-all flex items-center gap-4">
                    <span class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>
                    </span>
                    <div>
                        <h4 class="text-sm font-black text-white">Tips &amp; Prestasi</h4>
                        <p class="text-xs text-purple-100 mt-0.5">Trik Belajar &amp; Beasiswa</p>
                    </div>
                </div>
            </div>
        </section>
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldCardsPattern, $newCardsMarkup)

# Also check empty state icon
$content = $content.Replace('🔍', '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>')

[System.IO.File]::WriteAllText($blogPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Replaced all corrupted characters with clean, razor-sharp SVG icons!"
