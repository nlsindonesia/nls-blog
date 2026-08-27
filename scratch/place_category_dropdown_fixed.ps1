$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$content = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

# 1. Remove pills from Hero
$oldPillsPattern = '(?s)<!-- Vibrant Category Filter Pills with Crisp SVG Icons -->.*?<\/div>\s*<\/div>\s*<\/section>'
$newHeroEnd = @'
            </div>
        </section>
'@
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldPillsPattern, $newHeroEnd)

# 2. Add Category Dropdown at Red "X" location
$oldHeaderBarPattern = '(?s)<!-- Result Count & Active Filter Indicator -->.*?<\/div>\s*<\/div>'

$newHeaderBarMarkup = @'
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
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldHeaderBarPattern, $newHeaderBarMarkup)

[System.IO.File]::WriteAllText($blogPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Placed Category Dropdown at the marked red X position in blog/index.html!"
