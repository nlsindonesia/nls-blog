$kalenderPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html"
$content = [System.IO.File]::ReadAllText($kalenderPath, [System.Text.Encoding]::UTF8)

# 1. Update CSS in <head>
$oldCssPattern = '(?s)\/\* ==========================================================================\s*PREMIUM CALENDAR & CONTROLS DESIGN SYSTEM.*?\.month-chip-btn\.active \{.*?\n        \}'

$newCss = @'
/* ==========================================================================
   PREMIUM FULL-COLOR SIDE-BY-SIDE CALENDAR & DASHBOARD DESIGN SYSTEM
   ========================================================================== */

.cal-container-wide {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
}

.calendar-main-card {
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 1.75rem;
    box-shadow: 0 20px 45px -15px rgba(0, 46, 71, 0.08), 0 0 1px rgba(0,0,0,0.05);
    overflow: hidden;
}
html.dark .calendar-main-card {
    background: #131d38;
    border-color: #273549;
    box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.6);
}

.calendar-detail-card {
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 1.75rem;
    box-shadow: 0 20px 45px -15px rgba(0, 46, 71, 0.08);
}
html.dark .calendar-detail-card {
    background: #131d38;
    border-color: #273549;
    box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.6);
}

/* Custom Scrollbar for Event Panel */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 9999px;
}
html.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #334155;
}

/* Filter Controls */
.filter-controls-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
}
@media (min-width: 768px) {
    .filter-controls-row {
        flex-direction: row;
        align-items: stretch;
    }
}

.filter-field {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.filter-select-input {
    width: 100%;
    height: 48px;
    padding: 0 2.5rem 0 1.15rem;
    border-radius: 1rem;
    border: 1.5px solid #cbd5e1;
    background-color: #f8fafc;
    color: #0f172a;
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23006493' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1.1rem;
}
html.dark .filter-select-input {
    background-color: #1a2542;
    border-color: #334155;
    color: #ffffff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2338bdf8' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
}
.filter-select-input:focus {
    outline: none;
    border-color: #006493;
    box-shadow: 0 0 0 3px rgba(0, 100, 147, 0.2);
    background-color: #ffffff;
}

/* Calendar 7-Column Grid */
.cal-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0.35rem;
}
@media (min-width: 640px) {
    .cal-grid {
        gap: 0.5rem;
    }
}
@media (min-width: 1024px) {
    .cal-grid {
        gap: 0.55rem;
    }
}

/* FULL-COLOR DAY HEADERS */
.cal-day-header {
    padding: 0.65rem 0.2rem;
    text-align: center;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-radius: 0.75rem;
}
.cal-day-header.senin {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
}
.cal-day-header.selasa {
    background: #f0fdfa;
    color: #0f766e;
    border: 1px solid #99f6e4;
}
.cal-day-header.rabu {
    background: #eef2ff;
    color: #4338ca;
    border: 1px solid #c7d2fe;
}
.cal-day-header.kamis {
    background: #faf5ff;
    color: #7e22ce;
    border: 1px solid #e9d5ff;
}
.cal-day-header.jumat {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
}
.cal-day-header.saturday {
    color: #b45309;
    background: #fffbeb;
    border: 1px solid #fde68a;
}
.cal-day-header.sunday {
    color: #be123c !important;
    background: #ffe4e6 !important;
    border: 1.5px solid #fecdd3 !important;
    font-weight: 900 !important;
    box-shadow: 0 2px 5px rgba(225, 29, 72, 0.08);
}

html.dark .cal-day-header.senin { background: #172554; color: #93c5fd; border-color: #1e3a8a; }
html.dark .cal-day-header.selasa { background: #134e4a; color: #5eead4; border-color: #115e59; }
html.dark .cal-day-header.rabu { background: #1e1b4b; color: #a5b4fc; border-color: #312e81; }
html.dark .cal-day-header.kamis { background: #3b0764; color: #d8b4fe; border-color: #581c87; }
html.dark .cal-day-header.jumat { background: #064e3b; color: #6ee7b7; border-color: #065f46; }
html.dark .cal-day-header.saturday { background: #451a03; color: #fcd34d; border-color: #78350f; }
html.dark .cal-day-header.sunday { background: #4c0519; color: #fda4af; border-color: #881337; }

/* FULL-COLOR CALENDAR CELLS */
.cal-cell {
    min-height: 72px;
    border-radius: 1rem;
    padding: 0.45rem;
    display: flex;
    flex-direction: column;
    position: relative;
    border: 1.5px solid #e2e8f0;
    background: #ffffff;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    user-select: none;
}
@media (min-width: 640px) {
    .cal-cell {
        min-height: 88px;
        padding: 0.55rem;
    }
}
@media (min-width: 1024px) {
    .cal-cell {
        min-height: 104px;
        padding: 0.65rem;
    }
}
html.dark .cal-cell {
    background: #16223e;
    border-color: #263654;
}

.cal-cell:hover:not(.empty) {
    transform: translateY(-2px);
    border-color: #0284c7;
    box-shadow: 0 10px 22px -5px rgba(2, 132, 199, 0.2);
    z-index: 10;
}
html.dark .cal-cell:hover:not(.empty) {
    border-color: #38bdf8;
    box-shadow: 0 10px 22px -5px rgba(0, 0, 0, 0.6);
}

/* Saturday Cell */
.cal-cell.saturday {
    background: #fffdfa;
    border-color: #fef08a;
}
html.dark .cal-cell.saturday {
    background: #17151f;
    border-color: #3b281c;
}

/* Sunday Cell */
.cal-cell.sunday {
    background: #fff5f5 !important;
    border-color: #fecdd3 !important;
}
html.dark .cal-cell.sunday {
    background: #1e1117 !important;
    border-color: #4a1523 !important;
}
.cal-cell.sunday:hover:not(.empty) {
    border-color: #e11d48 !important;
    box-shadow: 0 10px 22px -5px rgba(225, 29, 72, 0.22) !important;
}

/* Today Cell */
.cal-cell.today {
    background: linear-gradient(145deg, #e0f2fe 0%, #dbeafe 100%) !important;
    border: 2.5px solid #0284c7 !important;
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.28), 0 10px 22px -5px rgba(2, 132, 199, 0.25) !important;
    transform: scale(1.015);
    z-index: 15;
}
html.dark .cal-cell.today {
    background: linear-gradient(145deg, #0b2545 0%, #11335e 100%) !important;
    border: 2.5px solid #38bdf8 !important;
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.35), 0 10px 22px -5px rgba(0, 0, 0, 0.7) !important;
}
.cal-cell.today:hover:not(.empty) {
    transform: scale(1.025) translateY(-2px);
}

/* Has Events */
.cal-cell.has-events {
    border-color: #93c5fd;
    box-shadow: 0 2px 8px rgba(2, 132, 199, 0.08);
}
html.dark .cal-cell.has-events {
    border-color: #2563eb;
}

/* Selected Cell */
.cal-cell.selected {
    border-color: #0284c7 !important;
    background: #e0f2fe !important;
    box-shadow: 0 0 0 3.5px rgba(2, 132, 199, 0.35), 0 12px 24px -6px rgba(2, 132, 199, 0.3) !important;
    transform: scale(1.02);
    z-index: 20;
}
html.dark .cal-cell.selected {
    background: #172d57 !important;
    border-color: #38bdf8 !important;
    box-shadow: 0 0 0 3.5px rgba(56, 189, 248, 0.4) !important;
}

/* Event Tag Pills inside cells */
.cal-pill {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.2rem 0.4rem;
    border-radius: 0.45rem;
    font-size: 0.68rem;
    font-weight: 800;
    line-height: 1.15;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 0.2rem;
    border: 1px solid transparent;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.pill-osn { background: #e0f2fe; color: #0369a1; border-color: #bae6fd; }
.pill-snbt { background: #ffedd5; color: #c2410c; border-color: #fed7aa; }
.pill-tka { background: #ccfbf1; color: #0f766e; border-color: #99f6e4; }
.pill-mitra { background: #f3e8ff; color: #6b21a8; border-color: #e9d5ff; }
.pill-dinas { background: #ffe4e6; color: #be123c; border-color: #fecdd3; }

html.dark .pill-osn { background: #082f49; color: #7dd3fc; border-color: #0369a1; }
html.dark .pill-snbt { background: #431407; color: #fdba74; border-color: #9a3412; }
html.dark .pill-tka { background: #042f2e; color: #5eead4; border-color: #115e59; }
html.dark .pill-mitra { background: #3b0764; color: #d8b4fe; border-color: #7e22ce; }
html.dark .pill-dinas { background: #4c0519; color: #fda4af; border-color: #9f1239; }

/* Quick Month Scroll Navigation */
.month-chip-bar {
    display: flex;
    gap: 0.4rem;
    overflow-x: auto;
    padding-bottom: 0.4rem;
    scrollbar-width: thin;
}
.month-chip-btn {
    flex-shrink: 0;
    padding: 0.4rem 0.85rem;
    border-radius: 9999px;
    font-size: 0.78rem;
    font-weight: 700;
    border: 1.5px solid #e2e8f0;
    background: #ffffff;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s ease;
}
html.dark .month-chip-btn {
    background: #1a2542;
    border-color: #334155;
    color: #94a3b8;
}
.month-chip-btn:hover {
    border-color: #0284c7;
    color: #0284c7;
    transform: translateY(-1px);
}
.month-chip-btn.active {
    background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%) !important;
    border-color: transparent !important;
    color: #ffffff !important;
    font-weight: 900;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
}
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldCssPattern, $newCss)

# 2. Update Main Calendar & Detail Layout to Side-by-Side (7:5 cols on Desktop)
$oldSectionPattern = '(?s)<!-- Main Calendar Section -->.*?<!-- Call to Action Banner -->'

$newSection = @'
<!-- Main Calendar & Event Detail Section (Side-by-Side Full Color Dashboard) -->
            <section class="py-8 md:py-12 bg-surface">
                <div class="cal-container-wide px-4 sm:px-6 md:px-8">
                    
                    <!-- Dual Filter Control Hub (Full Width Compact) -->
                    <div class="bg-white dark:bg-[#131d38] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md mb-6">
                        <div class="filter-controls-row">
                            <!-- Filter 1: Jenis Kegiatan -->
                            <div class="filter-field">
                                <label class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <span class="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                                    Filter 1: Jenis Kegiatan
                                </label>
                                <select x-model="selectedCategory" @change="selectedDate = null" class="filter-select-input">
                                    <option value="all">🌟 Semua Jenis Kegiatan (OSN, SNBT, TKA, Mitra, Dinas)</option>
                                    <option value="OSN">🏆 Olimpiade Sains Nasional (OSN)</option>
                                    <option value="SNBT">🎯 Seleksi Nasional Masuk PTN (SNBT)</option>
                                    <option value="TKA">📚 Tes Kemampuan Akademik (TKA)</option>
                                    <option value="Mitra Sekolah">🏫 Mitra Sekolah (LDKS, IHT, Try Out Sekolah)</option>
                                    <option value="Event Dinas">🏛️ Event Dinas (Pelatihan Guru &amp; Pembinaan Diknas)</option>
                                </select>
                            </div>

                            <!-- Filter 2: Jenjang Pendidikan -->
                            <div class="filter-field">
                                <label class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    Filter 2: Jenjang Pendidikan
                                </label>
                                <select x-model="selectedJenjang" @change="selectedDate = null" class="filter-select-input">
                                    <option value="all">🎓 Semua Jenjang Pendidikan (SD, SMP, SMA, Guru/Umum)</option>
                                    <option value="SD">🎒 SD / MI / Sederajat</option>
                                    <option value="SMP">📘 SMP / MTs / Sederajat</option>
                                    <option value="SMA">🎓 SMA / MA / SMK / Gap Year</option>
                                    <option value="Guru / Instansi">🏛️ Guru / Sekolah / Dinas / Umum</option>
                                </select>
                            </div>
                        </div>

                        <!-- Active Filter Summary & Reset Bar -->
                        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                            <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300 flex-wrap">
                                <span class="font-medium text-xs">Menampilkan:</span>
                                <span class="font-black text-primary text-xs" x-text="categoryLabel()"></span>
                                <span>•</span>
                                <span class="font-black text-emerald-600 dark:text-emerald-400 text-xs" x-text="jenjangLabel()"></span>
                                <span class="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 font-extrabold text-blue-700 dark:text-blue-300 text-[11px] border border-blue-200/60 dark:border-blue-800/50">
                                    <span x-text="eventsInCurrentMonth().length"></span> agenda pada bulan ini
                                </span>
                            </div>

                            <button @click="resetFilters()"
                                x-show="selectedCategory !== 'all' || selectedJenjang !== 'all' || selectedDate !== null"
                                class="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer">
                                <span class="icon-[mdi--refresh] text-sm"></span>
                                Reset Filter &amp; Tanggal
                            </button>
                        </div>
                    </div>

                    <!-- SIDE-BY-SIDE 2-COLUMN DASHBOARD (Kalender di Kiri, Keterangan di Kanan) -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-12">
                        
                        <!-- ==============================================
                             KOLOM KIRI: KALENDER INTERAKTIF (7 Kolom)
                             ============================================== -->
                        <div class="lg:col-span-7 xl:col-span-7 flex flex-col gap-6">
                            
                            <div class="calendar-main-card">
                                <!-- Month Navigation Header Bar -->
                                <div class="p-4 sm:p-5 bg-gradient-to-r from-sky-50/80 via-white to-blue-50/80 dark:from-[#0f182e] dark:via-[#131d38] dark:to-[#0f182e] border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                                            <span class="icon-[mdi--calendar-month] text-2xl text-white"></span>
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white" x-text="monthLabel"></h2>
                                                <span class="px-2 py-0.5 rounded-full text-xs font-black bg-sky-100 text-sky-700 border border-sky-300 dark:bg-sky-950/80 dark:text-sky-300"
                                                    x-text="eventsInCurrentMonth().length + ' Agenda'"></span>
                                            </div>
                                            <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                                Klik tanggal untuk melihat rincian di panel kanan
                                            </p>
                                        </div>
                                    </div>

                                    <!-- Prev / Today / Next Controls -->
                                    <div class="flex items-center gap-1.5 self-start sm:self-auto">
                                        <button type="button" @click="goToToday()"
                                            class="px-3 py-1.5 rounded-xl text-xs font-black bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs">
                                            Hari Ini
                                        </button>
                                        <button type="button" @click="prevMonth()"
                                            class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all flex items-center justify-center cursor-pointer shadow-xs"
                                            title="Bulan Sebelumnya" aria-label="Bulan Sebelumnya">
                                            <span class="icon-[mdi--chevron-left] text-lg"></span>
                                        </button>
                                        <button type="button" @click="nextMonth()"
                                            class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all flex items-center justify-center cursor-pointer shadow-xs"
                                            title="Bulan Berikutnya" aria-label="Bulan Berikutnya">
                                            <span class="icon-[mdi--chevron-right] text-lg"></span>
                                        </button>
                                    </div>
                                </div>

                                <!-- Quick Month Jump Bar -->
                                <div class="px-4 sm:px-5 py-2.5 bg-slate-50/50 dark:bg-[#101930] border-b border-slate-100 dark:border-slate-800">
                                    <div class="month-chip-bar no-scrollbar">
                                        <template x-for="(mName, mIdx) in monthNames" :key="mIdx">
                                            <button type="button"
                                                @click="setMonth(mIdx)"
                                                class="month-chip-btn"
                                                :class="currentMonth === mIdx ? 'active' : ''"
                                                x-text="mName">
                                            </button>
                                        </template>
                                    </div>
                                </div>

                                <!-- Calendar Grid Body -->
                                <div class="p-3 sm:p-5">
                                    <!-- 7-Day Header (Senin - Minggu) - FULL COLOR -->
                                    <div class="cal-grid mb-2">
                                        <div class="cal-day-header senin">Senin</div>
                                        <div class="cal-day-header selasa">Selasa</div>
                                        <div class="cal-day-header rabu">Rabu</div>
                                        <div class="cal-day-header kamis">Kamis</div>
                                        <div class="cal-day-header jumat">Jumat</div>
                                        <div class="cal-day-header saturday">Sabtu</div>
                                        <div class="cal-day-header sunday">Minggu</div>
                                    </div>

                                    <!-- Day Cells Grid -->
                                    <div class="cal-grid">
                                        <template x-for="(cell, idx) in calendarCells" :key="idx">
                                            <div class="cal-cell"
                                                :class="getCellClasses(cell)"
                                                @click="onCellClick(cell)">
                                                
                                                <!-- Cell Top Row: Date Number & Badge -->
                                                <div class="flex items-center justify-between w-full">
                                                    <span class="text-xs sm:text-sm font-black"
                                                        :class="getDateNumberClasses(cell)"
                                                        x-text="cell.dayNumber || ''"></span>

                                                    <!-- Today Badge -->
                                                    <template x-if="cell.isToday">
                                                        <span style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important;" class="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-xs">Hari Ini</span>
                                                    </template>

                                                    <!-- Event Count Dot Indicator -->
                                                    <template x-if="cell.hasEvents && !cell.isToday">
                                                        <span class="w-2 h-2 rounded-full ring-2 ring-white dark:ring-slate-900"
                                                            :class="getCategoryDotClass(cell.events[0].category)"></span>
                                                    </template>
                                                </div>

                                                <!-- Event Pills inside Cell -->
                                                <div class="mt-1 flex-1 flex flex-col gap-1 overflow-hidden" x-show="cell.hasEvents">
                                                    <template x-for="evt in cell.events.slice(0, 2)" :key="evt.id">
                                                        <div class="cal-pill" :class="getPillClass(evt.category)" :title="evt.title">
                                                            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="getCategoryDotClass(evt.category)"></span>
                                                            <span class="truncate" x-text="evt.title"></span>
                                                        </div>
                                                    </template>

                                                    <!-- More indicator if > 2 events -->
                                                    <template x-if="cell.events.length > 2">
                                                        <div class="text-[9px] font-black text-primary dark:text-sky-400 pl-1">
                                                            +<span x-text="cell.events.length - 2"></span> agenda
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>

                                <!-- Legend Bar at bottom of calendar -->
                                <div class="px-4 py-3 bg-slate-50 dark:bg-[#0c1427] border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[11px] font-bold">
                                    <span class="text-slate-500 dark:text-slate-400 font-extrabold">Petunjuk Kategori:</span>
                                    <div class="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" @click="setCategory('OSN')">
                                        <span class="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
                                        <span class="text-slate-800 dark:text-slate-200">OSN</span>
                                    </div>
                                    <div class="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" @click="setCategory('SNBT')">
                                        <span class="w-2.5 h-2.5 rounded-full bg-[#ea580c]"></span>
                                        <span class="text-slate-800 dark:text-slate-200">SNBT</span>
                                    </div>
                                    <div class="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" @click="setCategory('TKA')">
                                        <span class="w-2.5 h-2.5 rounded-full bg-[#0d9488]"></span>
                                        <span class="text-slate-800 dark:text-slate-200">TKA</span>
                                    </div>
                                    <div class="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" @click="setCategory('Mitra Sekolah')">
                                        <span class="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></span>
                                        <span class="text-slate-800 dark:text-slate-200">Mitra</span>
                                    </div>
                                    <div class="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" @click="setCategory('Event Dinas')">
                                        <span class="w-2.5 h-2.5 rounded-full bg-[#e11d48]"></span>
                                        <span class="text-slate-800 dark:text-slate-200">Dinas</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- ==============================================
                             KOLOM KANAN: RINCIAN & KETERANGAN AGENDA (5 Kolom)
                             ============================================== -->
                        <div id="detail-kegiatan" class="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 scroll-mt-24 flex flex-col gap-4">
                            
                            <div class="calendar-detail-card p-5 sm:p-6 flex flex-col max-h-[840px]">
                                
                                <!-- Panel Header -->
                                <div class="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                                    <div class="flex items-center justify-between gap-2 mb-1.5">
                                        <div class="inline-flex items-center gap-1 text-[11px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                                            <span class="icon-[mdi--clipboard-text-clock-outline] text-sm"></span>
                                            <span>Rincian &amp; Keterangan</span>
                                        </div>
                                        
                                        <span class="px-2 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                            <span x-text="displayedEvents().length"></span> Kegiatan
                                        </span>
                                    </div>

                                    <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                                        <template x-if="selectedDate">
                                            <span>Agenda: <span class="text-sky-600 dark:text-sky-400" x-text="formatDateFull(selectedDate)"></span></span>
                                        </template>
                                        <template x-if="!selectedDate">
                                            <span>Agenda: <span class="text-sky-600 dark:text-sky-400" x-text="monthLabel"></span></span>
                                        </template>
                                    </h3>

                                    <template x-if="selectedDate">
                                        <div class="mt-2 flex items-center justify-between">
                                            <p class="text-xs text-slate-500 font-medium">Memfilter tanggal terpilih</p>
                                            <button @click="selectedDate = null"
                                                class="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer">
                                                <span class="icon-[mdi--arrow-left] text-sm"></span>
                                                Lihat Semua Bulan Ini
                                            </button>
                                        </div>
                                    </template>
                                </div>

                                <!-- Scrollable Event Cards List -->
                                <div class="overflow-y-auto pr-1 space-y-4 flex-1 custom-scrollbar">
                                    
                                    <!-- Empty State if no events -->
                                    <template x-if="displayedEvents().length === 0">
                                        <div class="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
                                            <div class="w-12 h-12 rounded-2xl bg-slate-200/70 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                                                <span class="icon-[mdi--calendar-blank-outline]"></span>
                                            </div>
                                            <div>
                                                <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">Tidak Ada Kegiatan</h4>
                                                <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                                    Tidak ditemukan agenda pada tanggal ini. Klik tanggal lain yang memiliki titik warna.
                                                </p>
                                            </div>
                                            <button @click="selectedDate = null; resetFilters()"
                                                class="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-all cursor-pointer shadow-xs">
                                                Lihat Semua Agenda Bulan Ini
                                            </button>
                                        </div>
                                    </template>

                                    <!-- Event Cards -->
                                    <template x-for="event in displayedEvents()" :key="event.id">
                                        <div class="bg-slate-50/70 dark:bg-[#16223e] rounded-2xl border border-slate-200 dark:border-slate-700/80 p-4 sm:p-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden group space-y-3">
                                            
                                            <!-- Left Category Color Accent Stripe -->
                                            <div class="absolute left-0 top-0 bottom-0 w-2" :class="getCategoryStripe(event.category)"></div>

                                            <div class="pl-1 space-y-2.5">
                                                <!-- Badges Header -->
                                                <div class="flex flex-wrap items-center gap-1.5">
                                                    <!-- Category Badge -->
                                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs"
                                                        :class="getCategoryBadgeClass(event.category)"
                                                        x-text="event.category"></span>

                                                    <!-- Jenjang Badge -->
                                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                                        x-text="event.jenjangLabel || event.jenjang"></span>

                                                    <!-- Status Badge -->
                                                    <span x-show="event.badgeText"
                                                        class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        <span x-text="event.badgeText"></span>
                                                    </span>
                                                </div>

                                                <!-- Event Title -->
                                                <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-primary transition-colors"
                                                    x-text="event.title"></h4>

                                                <!-- Meta: Date, Time, Mode -->
                                                <div class="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300 font-semibold pt-0.5">
                                                    <div class="flex items-center gap-1.5">
                                                        <span class="icon-[mdi--calendar-clock] text-sky-600 text-sm shrink-0"></span>
                                                        <span x-text="formatDateFull(event.date)"></span>
                                                    </div>
                                                    <div class="flex items-center gap-1.5">
                                                        <span class="icon-[mdi--clock-outline] text-amber-600 text-sm shrink-0"></span>
                                                        <span x-text="event.time"></span>
                                                    </div>
                                                    <div class="flex items-center gap-1.5">
                                                        <span class="icon-[mdi--laptop] text-teal-600 text-sm shrink-0"></span>
                                                        <span x-text="event.mode"></span>
                                                    </div>
                                                    <div class="flex items-center gap-1.5">
                                                        <span class="icon-[mdi--map-marker] text-rose-600 text-sm shrink-0"></span>
                                                        <span class="truncate" x-text="event.location"></span>
                                                    </div>
                                                </div>

                                                <!-- Description -->
                                                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal pt-1 border-t border-slate-200/60 dark:border-slate-700/60"
                                                    x-text="event.description"></p>

                                                <!-- Highlights (if available) -->
                                                <template x-if="event.highlights && event.highlights.length > 0">
                                                    <div class="bg-white dark:bg-[#101930] p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                                                        <p class="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Fasilitas &amp; Materi:</p>
                                                        <ul class="space-y-1">
                                                            <template x-for="(hl, hIdx) in event.highlights" :key="hIdx">
                                                                <li class="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                                                    <span class="icon-[mdi--check-circle] text-emerald-500 text-sm shrink-0 mt-0.5"></span>
                                                                    <span x-text="hl"></span>
                                                                </li>
                                                            </template>
                                                        </ul>
                                                    </div>
                                                </template>

                                                <!-- Direct WhatsApp CTA Button -->
                                                <div class="pt-2">
                                                    <a :href="'https://wa.me/6285163070002?text=' + encodeURIComponent(event.whatsappMessage)"
                                                        target="_blank"
                                                        style="background: linear-gradient(135deg, #FF8A00 0%, #EA580C 100%) !important; color: #ffffff !important;"
                                                        class="w-full py-2.5 px-4 rounded-xl font-black text-xs shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-white">
                                                        <span class="icon-[mdi--whatsapp] text-lg"></span>
                                                        <span>Daftar / Tanya via WhatsApp</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Call to Action Banner -->
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldSectionPattern, $newSection)

[System.IO.File]::WriteAllText($kalenderPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated kalender/index.html to Full-Color Side-by-Side Dashboard Layout!"
