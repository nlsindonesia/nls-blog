$osnPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\osn\index.html"
$content = [System.IO.File]::ReadAllText($osnPath, [System.Text.Encoding]::UTF8)

# 1. Update Header Bar & Filter Controls of Calendar Section
$oldCalendarHeader = @'
        <!-- Section Header & Filter Hub -->
        <div class="bg-white dark:bg-[#131d38] p-5 sm:p-6 rounded-3xl border-2 border-sky-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 mb-8 transition-all">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <!-- Title & Badge -->
                <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Kalender Kegiatan &amp; Event Mendatang
                            </h2>
                            <span class="px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                                <span x-text="categoryLabel()"></span>
                            </span>
                        </div>
                        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                            Jadwal lengkap Try Out, Pelatihan Olimpiade Sains, Seleksi OSN, dan Agenda Akademik di Next Level Study.
                        </p>
                    </div>
                </div>

                <!-- Right Buttons: Filter Category Pill Tabs & Complete Calendar Link -->
                <div class="flex flex-wrap items-center gap-2">
                    <div class="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <button type="button" @click="setCategory('all')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            :class="selectedCategory === 'all' ? 'bg-white dark:bg-[#131D38] text-sky-600 dark:text-sky-400 font-black shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'">
                            Semua
                        </button>
                        <button type="button" @click="setCategory('OSN')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            :class="selectedCategory === 'OSN' ? 'bg-sky-600 text-white font-black shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-sky-600'">
                            <span class="w-2 h-2 rounded-full bg-sky-400"></span>
                            <span>OSN</span>
                        </button>
                        <button type="button" @click="setCategory('SNBT')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            :class="selectedCategory === 'SNBT' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'">
                            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span>SNBT</span>
                        </button>
                    </div>

                    <a href="/kalender"
                        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer">
                        <span>Buka Kalender Penuh</span>
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </a>
                </div>
            </div>
        </div>
'@

$newCalendarHeader = @'
        <!-- Section Header & Dedicated OSN Calendar Badge -->
        <div class="bg-white dark:bg-[#131d38] p-5 sm:p-6 rounded-3xl border-2 border-sky-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 mb-8 transition-all">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <!-- Title & Dedicated OSN Badge -->
                <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Kalender Kegiatan &amp; Agenda OSN
                            </h2>
                            <span class="px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                                <span>Kategori Khusus: OSN &amp; Sains</span>
                            </span>
                        </div>
                        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                            Jadwal lengkap Try Out OSN, Pelatihan Intensif Medalis, Pembinaan Olimpiade Sains, dan Timeline Seleksi OSN 2026.
                        </p>
                    </div>
                </div>

                <!-- Right Buttons: Month Counter & Complete Calendar Link -->
                <div class="flex flex-wrap items-center gap-2.5 shrink-0">
                    <span class="px-3 py-1.5 rounded-2xl text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <span class="text-sky-600 dark:text-sky-400 font-black text-sm" x-text="eventsInCurrentMonth().length"></span> Agenda OSN Bulan Ini
                    </span>

                    <a href="/kalender"
                        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer">
                        <span>Buka Kalender Penuh</span>
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </a>
                </div>
            </div>
        </div>
'@

$content = $content.Replace($oldCalendarHeader, $newCalendarHeader)

# 2. Update Legend Bar of Calendar
$oldLegendBar = @'
                    <!-- Legend Bar -->
                    <div class="px-4 py-3 bg-slate-50 dark:bg-[#0c1427] border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[11px] font-bold shrink-0">
                        <span class="text-slate-500 dark:text-slate-400 font-extrabold">Petunjuk Warna:</span>
                        <div class="flex items-center gap-1.5 cursor-pointer" @click="setCategory('OSN')">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
                            <span class="text-slate-800 dark:text-slate-200">OSN (Biru)</span>
                        </div>
                        <div class="flex items-center gap-1.5 cursor-pointer" @click="setCategory('SNBT')">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
                            <span class="text-slate-800 dark:text-slate-200">SNBT (Hijau)</span>
                        </div>
                        <div class="flex items-center gap-1.5 cursor-pointer" @click="setCategory('TKA')">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#d97706]"></span>
                            <span class="text-slate-800 dark:text-slate-200">TKA (Kuning)</span>
                        </div>
                    </div>
'@

$newLegendBar = @'
                    <!-- Legend Bar -->
                    <div class="px-4 py-3 bg-slate-50 dark:bg-[#0c1427] border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] font-bold shrink-0">
                        <span class="text-slate-500 dark:text-slate-400 font-extrabold">Petunjuk Kalender:</span>
                        <div class="flex items-center gap-1.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
                            <span class="text-slate-800 dark:text-slate-200 font-bold">Agenda OSN &amp; Sains</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-sky-500 ring-2 ring-sky-300"></span>
                            <span class="text-slate-800 dark:text-slate-200 font-bold">Hari Ini</span>
                        </div>
                    </div>
'@

$content = $content.Replace($oldLegendBar, $newLegendBar)

# 3. Update filteredEvents() in osnCalendarApp script to strictly filter OSN only
$oldFilteredEvents = @'
                filteredEvents() {
                    return this.events.filter(e => {
                        return this.selectedCategory === 'all' || e.category === this.selectedCategory;
                    });
                },
'@

$newFilteredEvents = @'
                filteredEvents() {
                    return this.events.filter(e => {
                        return e.category === 'OSN' || (e.category && e.category.toUpperCase().includes('OSN'));
                    });
                },
'@

$content = $content.Replace($oldFilteredEvents, $newFilteredEvents)

[System.IO.File]::WriteAllText($osnPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated osn/index.html to focus calendar strictly on OSN events!"
