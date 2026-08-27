$blogPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\index.html"
$content = [System.IO.File]::ReadAllText($blogPath, [System.Text.Encoding]::UTF8)

# Replace the control bar with a full-color, intuitive, and modern control bar card
$oldBarPattern = '(?s)<!-- Result Count & Active Filter Indicator with Category Dropdown.*?<\/div>\s*<\/div>\s*<\/div>'

$newBarMarkup = @'
<!-- FULL-COLOR INTUITIVE & STYLISH CONTROL BAR -->
            <div class="bg-white dark:bg-[#131D38] p-5 sm:p-6 rounded-3xl border-2 border-sky-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 mb-10 transition-all">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    
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
                        <div class="flex items-center gap-2 flex-wrap pt-1" x-show="selectedCategory !== 'all' || searchQuery">
                            <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Filter Aktif:</span>
                            
                            <!-- Active Category Pill -->
                            <template x-if="selectedCategory !== 'all'">
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-xs border"
                                    :class="getCategoryBadgeClass(selectedCategory)">
                                    <span x-text="selectedCategory"></span>
                                    <button type="button" @click="selectedCategory = 'all'" class="hover:opacity-75 cursor-pointer ml-1 font-bold">✕</button>
                                </span>
                            </template>

                            <!-- Active Search Query Pill -->
                            <template x-if="searchQuery">
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-sky-50 text-sky-800 border border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800 shadow-xs">
                                    <span>Pencarian: "<strong x-text="searchQuery"></strong>"</span>
                                    <button type="button" @click="searchQuery = ''" class="hover:text-rose-500 cursor-pointer ml-1 font-bold">✕</button>
                                </span>
                            </template>

                            <!-- Reset All Button -->
                            <button type="button" @click="selectedCategory = 'all'; searchQuery = ''"
                                class="text-xs font-black text-rose-600 hover:text-rose-700 dark:text-rose-400 underline cursor-pointer ml-2">
                                Reset Filter
                            </button>
                        </div>
                    </div>

                    <!-- Right: Full-Color Category Dropdown with Signature Accent -->
                    <div class="flex flex-col sm:flex-row sm:items-center gap-3 self-stretch lg:self-auto shrink-0">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                            <label class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Saring Kategori:
                            </label>
                        </div>

                        <div class="relative min-w-[240px] sm:min-w-[270px]">
                            <select x-model="selectedCategory"
                                class="w-full appearance-none pl-11 pr-10 py-3 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 border-2 border-sky-400 dark:border-sky-600 text-xs sm:text-sm font-black text-slate-900 dark:text-white shadow-md focus:outline-none focus:ring-4 focus:ring-sky-300/50 cursor-pointer transition-all">
                                <option value="all">⭐ Semua Kategori Berita</option>
                                <option value="OSN & Sains">🏆 OSN &amp; Sains</option>
                                <option value="SNBT & UTBK">🎓 SNBT &amp; UTBK</option>
                                <option value="TKA & Akademik">📊 TKA &amp; Akademik</option>
                                <option value="Tips Belajar & Prestasi">💡 Tips Belajar &amp; Prestasi</option>
                                <option value="Berita Sekolah & Diknas">🏫 Berita Sekolah &amp; Diknas</option>
                                <option value="Informasi NLS">📢 Informasi NLS</option>
                                <option value="Panduan Beasiswa">📜 Panduan Beasiswa</option>
                                <option value="Bimbel NexGen">🚀 Bimbel NexGen</option>
                            </select>

                            <!-- Left Filter Funnel Icon -->
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-sky-600 dark:text-sky-400">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                            </div>

                            <!-- Right Chevron Icon -->
                            <div class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-600 dark:text-slate-300">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldBarPattern, $newBarMarkup)

[System.IO.File]::WriteAllText($blogPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Upgraded Control Bar to Full-Color, highly intuitive card layout!"
