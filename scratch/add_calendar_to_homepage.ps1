# ==============================================================================
# Script: add_calendar_to_homepage.ps1
# Add the interactive Calendar Dashboard to index.html below "Melihat Lebih Dekat"
# ==============================================================================

$indexPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\index.html"
$content = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)

# 1. Add /kalender/default-events.js and Calendar Styles in <head>
$headScripts = @'
    <script src="/blog/default-articles.js"></script>
    <script src="/kalender/default-events.js"></script>
    <style>
        /* ==========================================================================
           PREMIUM FULL-COLOR SIDE-BY-SIDE CALENDAR & DASHBOARD DESIGN SYSTEM
           ========================================================================== */
        .cal-container-wide { width: 100%; max-width: 1440px; margin: 0 auto; }
        .cal-side-dashboard { display: flex; flex-direction: column; gap: 1.5rem; width: 100%; }
        @media (min-width: 1024px) {
            .cal-side-dashboard { display: grid; grid-template-columns: 1.35fr 1fr; gap: 1.75rem; align-items: stretch; }
        }
        @media (min-width: 1280px) {
            .cal-side-dashboard { grid-template-columns: 1.45fr 1fr; gap: 2rem; }
        }
        .cal-col-left { width: 100%; min-width: 0; display: flex; flex-direction: column; }
        .cal-col-right { width: 100%; min-width: 0; display: flex; flex-direction: column; height: 100%; }
        .calendar-main-card { width: 100%; background: #ffffff; border: 2px solid #e2e8f0; border-radius: 1.75rem; box-shadow: 0 20px 45px -15px rgba(0, 46, 71, 0.08); overflow: hidden; display: flex; flex-direction: column; }
        html.dark .calendar-main-card { background: #131d38; border-color: #273549; box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.6); }
        .calendar-detail-card { width: 100%; height: 100%; background: #ffffff; border: 2px solid #e2e8f0; border-radius: 1.75rem; box-shadow: 0 20px 45px -15px rgba(0, 46, 71, 0.08); display: flex; flex-direction: column; overflow: hidden; box-sizing: border-box; }
        html.dark .calendar-detail-card { background: #131d38; border-color: #273549; box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.6); }
        .cal-detail-body { flex: 1 1 0%; min-height: 0; overflow-y: auto; padding-right: 0.35rem; }
        @media (max-width: 1023px) { .cal-detail-body { max-height: 520px; } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
        html.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
        .cal-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0.35rem; width: 100%; }
        @media (min-width: 640px) { .cal-grid { gap: 0.5rem; } }
        @media (min-width: 1024px) { .cal-grid { gap: 0.55rem; } }
        .cal-day-header { padding: 0.65rem 0.2rem; text-align: center; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 0.75rem; }
        .cal-day-header.senin { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .cal-day-header.selasa { background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; }
        .cal-day-header.rabu { background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; }
        .cal-day-header.kamis { background: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; }
        .cal-day-header.jumat { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
        .cal-day-header.saturday { color: #b45309; background: #fffbeb; border: 1px solid #fde68a; }
        .cal-day-header.sunday { color: #be123c !important; background: #ffe4e6 !important; border: 1.5px solid #fecdd3 !important; font-weight: 900 !important; }
        html.dark .cal-day-header.senin { background: #172554; color: #93c5fd; border-color: #1e3a8a; }
        html.dark .cal-day-header.selasa { background: #134e4a; color: #5eead4; border-color: #115e59; }
        html.dark .cal-day-header.rabu { background: #1e1b4b; color: #a5b4fc; border-color: #312e81; }
        html.dark .cal-day-header.kamis { background: #3b0764; color: #d8b4fe; border-color: #581c87; }
        html.dark .cal-day-header.jumat { background: #064e3b; color: #6ee7b7; border-color: #065f46; }
        html.dark .cal-day-header.saturday { background: #451a03; color: #fcd34d; border-color: #78350f; }
        html.dark .cal-day-header.sunday { background: #4c0519; color: #fda4af; border-color: #881337; }
        .cal-cell { min-height: 72px; border-radius: 1rem; padding: 0.45rem; display: flex; flex-direction: column; position: relative; border: 1.5px solid #e2e8f0; background: #ffffff; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; user-select: none; }
        @media (min-width: 640px) { .cal-cell { min-height: 88px; padding: 0.55rem; } }
        @media (min-width: 1024px) { .cal-cell { min-height: 102px; padding: 0.65rem; } }
        html.dark .cal-cell { background: #16223e; border-color: #263654; }
        .cal-cell:hover:not(.empty) { transform: translateY(-2px); border-color: #0284c7; box-shadow: 0 10px 22px -5px rgba(2, 132, 199, 0.2); z-index: 10; }
        html.dark .cal-cell:hover:not(.empty) { border-color: #38bdf8; box-shadow: 0 10px 22px -5px rgba(0, 0, 0, 0.6); }
        .cal-cell.saturday { background: #fffdfa; border-color: #fef08a; }
        html.dark .cal-cell.saturday { background: #17151f; border-color: #3b281c; }
        .cal-cell.sunday { background: #fff5f5 !important; border-color: #fecdd3 !important; }
        html.dark .cal-cell.sunday { background: #1e1117 !important; border-color: #4a1523 !important; }
        .cal-cell.today { background: linear-gradient(145deg, #e0f2fe 0%, #dbeafe 100%) !important; border: 2.5px solid #0284c7 !important; box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.28), 0 10px 22px -5px rgba(2, 132, 199, 0.25) !important; transform: scale(1.015); z-index: 15; }
        html.dark .cal-cell.today { background: linear-gradient(145deg, #0b2545 0%, #11335e 100%) !important; border: 2.5px solid #38bdf8 !important; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.35) !important; }
        .cal-cell.has-events { border-color: #93c5fd; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.08); }
        html.dark .cal-cell.has-events { border-color: #2563eb; }
        .cal-cell.selected { border-color: #0284c7 !important; background: #e0f2fe !important; box-shadow: 0 0 0 3.5px rgba(2, 132, 199, 0.35), 0 12px 24px -6px rgba(2, 132, 199, 0.3) !important; transform: scale(1.02); z-index: 20; }
        html.dark .cal-cell.selected { background: #172d57 !important; border-color: #38bdf8 !important; box-shadow: 0 0 0 3.5px rgba(56, 189, 248, 0.4) !important; }
        .cal-pill { display: flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.4rem; border-radius: 0.45rem; font-size: 0.68rem; font-weight: 800; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 0.2rem; border: 1px solid transparent; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
        .pill-osn { background: #e0f2fe; color: #0369a1; border-color: #bae6fd; }
        .pill-tka { background: #fef3c7; color: #92400e; border-color: #fde68a; }
        .pill-snbt { background: #d1fae5; color: #065f46; border-color: #a7f3d0; }
        .pill-mitra { background: #f3e8ff; color: #6b21a8; border-color: #e9d5ff; }
        .pill-dinas { background: #ffe4e6; color: #be123c; border-color: #fecdd3; }
        html.dark .pill-osn { background: #082f49; color: #7dd3fc; border-color: #0369a1; }
        html.dark .pill-tka { background: #451a03; color: #fde68a; border-color: #92400e; }
        html.dark .pill-snbt { background: #064e3b; color: #6ee7b7; border-color: #065f46; }
        html.dark .pill-mitra { background: #3b0764; color: #d8b4fe; border-color: #7e22ce; }
        html.dark .pill-dinas { background: #4c0519; color: #fda4af; border-color: #9f1239; }
        .month-chip-bar { display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 0.4rem; scrollbar-width: thin; }
        .month-chip-btn { flex-shrink: 0; padding: 0.4rem 0.85rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 700; border: 1.5px solid #e2e8f0; background: #ffffff; color: #475569; cursor: pointer; transition: all 0.2s ease; }
        html.dark .month-chip-btn { background: #1a2542; border-color: #334155; color: #94a3b8; }
        .month-chip-btn:hover { border-color: #0284c7; color: #0284c7; transform: translateY(-1px); }
        .month-chip-btn.active { background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%) !important; border-color: transparent !important; color: #ffffff !important; font-weight: 900; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35); }
    </style>
'@

$content = $content.Replace('<script src="/blog/default-articles.js"></script>', $headScripts)

# 2. Calendar Section Markup to insert after <section id="kaleidoskop"> ... </section>
$calendarSectionMarkup = @'

<!-- =========================================================================
     CALENDAR & UPCOMING EVENTS SECTION (INTEGRATED FULL-COLOR SIDE-BY-SIDE)
     ========================================================================= -->
<section id="kalender" class="py-20 bg-surface relative overflow-hidden scroll-mt-20" x-data="homeCalendarApp()">
    <div class="container-max px-margin-mobile md:px-margin-desktop">
        
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
                        <button type="button" @click="setCategory('TKA')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            :class="selectedCategory === 'TKA' ? 'bg-amber-600 text-white font-black shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'">
                            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                            <span>TKA</span>
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

        <!-- BULLETPROOF SIDE-BY-SIDE 2-COLUMN DASHBOARD -->
        <div class="cal-side-dashboard">
            
            <!-- KOLOM KIRI: KALENDER INTERAKTIF -->
            <div class="cal-col-left">
                <div id="home-cal-main-card-el" class="calendar-main-card">
                    <!-- Month Navigation Header Bar -->
                    <div class="p-4 sm:p-5 bg-gradient-to-r from-sky-50/80 via-white to-blue-50/80 dark:from-[#0f182e] dark:via-[#131d38] dark:to-[#0f182e] border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white" x-text="monthLabel"></h3>
                                    <span class="px-2 py-0.5 rounded-full text-xs font-black bg-sky-100 text-sky-700 border border-sky-300 dark:bg-sky-950/80 dark:text-sky-300"
                                        x-text="eventsInCurrentMonth().length + ' Agenda'"></span>
                                </div>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                    Pilih tanggal berpenanda untuk melihat rincian di panel kanan
                                </p>
                            </div>
                        </div>

                        <!-- Controls -->
                        <div class="flex items-center gap-1.5 self-start sm:self-auto">
                            <button type="button" @click="goToToday()"
                                class="px-3 py-1.5 rounded-xl text-xs font-black bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-xs">
                                Hari Ini
                            </button>
                            <button type="button" @click="prevMonth()"
                                class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-sky-600 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
                                title="Bulan Sebelumnya">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
                            </button>
                            <button type="button" @click="nextMonth()"
                                class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-sky-600 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs"
                                title="Bulan Berikutnya">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                            </button>
                        </div>
                    </div>

                    <!-- Quick Month Jump Bar -->
                    <div class="px-4 sm:px-5 py-2.5 bg-slate-50/50 dark:bg-[#101930] border-b border-slate-100 dark:border-slate-800 shrink-0">
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
                    <div class="p-3 sm:p-5 flex-1 flex flex-col justify-between">
                        <!-- 7-Day Header -->
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
                                        <template x-if="cell.events.length > 2">
                                            <div class="text-[9px] font-black text-sky-600 dark:text-sky-400 pl-1">
                                                +<span x-text="cell.events.length - 2"></span> agenda
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Legend Bar -->
                    <div class="px-4 py-3 bg-slate-50 dark:bg-[#0c1427] border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[11px] font-bold shrink-0">
                        <span class="text-slate-500 dark:text-slate-400 font-extrabold">Petunjuk Kategori:</span>
                        <div class="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" @click="setCategory('OSN')">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
                            <span class="text-slate-800 dark:text-slate-200">OSN (Biru)</span>
                        </div>
                        <div class="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" @click="setCategory('TKA')">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#d97706]"></span>
                            <span class="text-slate-800 dark:text-slate-200">TKA (Kuning)</span>
                        </div>
                        <div class="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" @click="setCategory('SNBT')">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
                            <span class="text-slate-800 dark:text-slate-200">SNBT (Hijau)</span>
                        </div>
                        <div class="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" @click="setCategory('Mitra Sekolah')">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></span>
                            <span class="text-slate-800 dark:text-slate-200">Mitra (Ungu)</span>
                        </div>
                        <div class="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" @click="setCategory('Event Dinas')">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#e11d48]"></span>
                            <span class="text-slate-800 dark:text-slate-200">Dinas (Merah)</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- KOLOM KANAN: RINCIAN & AGENDA BULAN INI (MATCHING PRESENT EVENT VIEW) -->
            <div class="cal-col-right">
                <div class="calendar-detail-card p-5 sm:p-6" :style="mainCardHeight ? 'height: ' + mainCardHeight + 'px;' : ''">
                    
                    <!-- Panel Header -->
                    <div class="pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <div class="flex items-center justify-between gap-2 mb-1.5">
                            <div class="inline-flex items-center gap-1 text-[11px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                                <span>Rincian &amp; Agenda Event</span>
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
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                                    Lihat Semua Bulan Ini
                                </button>
                            </div>
                        </template>
                    </div>

                    <!-- Scrollable Event Cards List -->
                    <div class="cal-detail-body custom-scrollbar space-y-4">
                        
                        <!-- Empty State -->
                        <template x-if="displayedEvents().length === 0">
                            <div class="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3 my-auto">
                                <div class="w-12 h-12 rounded-2xl bg-slate-200/70 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">Tidak Ada Kegiatan</h4>
                                    <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                        Tidak ditemukan agenda pada filter ini. Klik tanggal lain atau pilih bulan berikutnya.
                                    </p>
                                </div>
                                <button @click="selectedDate = null; resetFilters()"
                                    class="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-all cursor-pointer shadow-xs">
                                    Lihat Semua Agenda Bulan Ini
                                </button>
                            </div>
                        </template>

                        <!-- Event Cards (Synced with Present Event View in Admin) -->
                        <template x-for="event in displayedEvents()" :key="event.id">
                            <div class="p-5 sm:p-6 rounded-3xl transition-all flex flex-col justify-between space-y-4 relative overflow-hidden hover:-translate-y-1 shadow-md hover:shadow-lg"
                                :class="getEventAdminCardClass(event.category)">
                                
                                <!-- Left Category Accent Stripe -->
                                <div class="absolute left-0 top-0 bottom-0 w-2.5" :class="getCategoryStripe(event.category)"></div>

                                <div class="pl-2 space-y-3">
                                    <!-- Category Badge & Date Row -->
                                    <div class="flex items-center justify-between gap-2 flex-wrap">
                                        <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider"
                                            :class="getEventCategoryBadge(event.category)"
                                            x-text="event.category"></span>
                                        
                                        <span class="inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-black/40 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-white/10"
                                            x-text="formatDateFull ? formatDateFull(event.date) : event.date"></span>
                                    </div>

                                    <!-- Title -->
                                    <h4 class="text-base sm:text-lg font-black text-slate-950 dark:text-white leading-snug"
                                        x-text="event.title"></h4>

                                    <!-- Info Box (Glassmorphic Box with Amber Clock & Teal Screen Icons) -->
                                    <div class="p-3 rounded-2xl bg-white/80 dark:bg-black/30 border border-black/5 dark:border-white/10 space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
                                        <div class="flex items-center gap-2 font-black">
                                            <span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            </span>
                                            <span x-text="event.time"></span>
                                        </div>
                                        <div class="flex items-center gap-2 font-bold">
                                            <span class="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-600 flex items-center justify-center shrink-0">
                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            </span>
                                            <span class="truncate" x-text="event.mode + (event.location ? ' - ' + event.location : '')"></span>
                                        </div>
                                    </div>

                                    <p class="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed" x-text="event.description"></p>

                                    <!-- Highlights (if available) -->
                                    <template x-if="event.highlights && event.highlights.length > 0">
                                        <div class="bg-white/80 dark:bg-black/30 p-3 rounded-2xl border border-black/5 dark:border-white/10 space-y-1.5">
                                            <p class="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Fasilitas &amp; Materi:</p>
                                            <ul class="space-y-1">
                                                <template x-for="(hl, hIdx) in event.highlights" :key="hIdx">
                                                    <li class="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                                                        <svg class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                                                        <span x-text="hl"></span>
                                                    </li>
                                                </template>
                                            </ul>
                                        </div>
                                    </template>
                                </div>

                                <!-- Bottom Action Row -->
                                <div class="pt-3.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2 pl-2">
                                    <span class="px-2.5 py-1 rounded-xl text-[11px] font-black bg-white/70 dark:bg-black/40 text-slate-800 dark:text-slate-200 border border-black/5 dark:border-white/10"
                                        x-text="event.jenjangLabel || event.jenjang"></span>
                                    
                                    <a :href="'https://wa.me/6285163070002?text=' + encodeURIComponent(event.whatsappMessage || ('Halo Next Level Study, saya ingin info pendaftaran untuk agenda: ' + event.title))"
                                        target="_blank" rel="noopener noreferrer"
                                        class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-md shadow-sky-600/30 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                                        <span>Daftar / Tanya CS</span>
                                    </a>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
'@

# Target after </section> of kaleidoskop
$kaleidoskopEnd = @'
            </div>
        </div>
    </div>
</section>
'@

$replacementWithCalendar = $kaleidoskopEnd + $calendarSectionMarkup
$content = $content.Replace($kaleidoskopEnd, $replacementWithCalendar)

# 3. Alpine.js Engine homeCalendarApp() to insert before </body>
$homeCalendarScript = @'
        function homeCalendarApp() {
            return {
                currentYear: 2026,
                currentMonth: 7, // Agustus 2026
                selectedDate: null,
                selectedCategory: 'all',
                events: [],
                mainCardHeight: null,
                monthNames: [
                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ],

                init() {
                    this.loadEvents();
                    this.setupAutoSync();
                    
                    this.$nextTick(() => {
                        this.updateCardHeight();
                    });

                    window.addEventListener('resize', () => {
                        this.updateCardHeight();
                    });
                },

                updateCardHeight() {
                    const el = document.getElementById('home-cal-main-card-el');
                    if (el && window.innerWidth >= 1024) {
                        this.mainCardHeight = el.offsetHeight;
                    } else {
                        this.mainCardHeight = null;
                    }
                },

                loadEvents() {
                    const saved = localStorage.getItem('nls_kalender_events_v1');
                    if (saved) {
                        try {
                            const parsed = JSON.parse(saved);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                this.events = parsed;
                                return;
                            }
                        } catch (e) {
                            console.error('Error reading localStorage events:', e);
                        }
                    }

                    if (window.NLS_DEFAULT_EVENTS && Array.isArray(window.NLS_DEFAULT_EVENTS)) {
                        this.events = JSON.parse(JSON.stringify(window.NLS_DEFAULT_EVENTS));
                        localStorage.setItem('nls_kalender_events_v1', JSON.stringify(this.events));
                    } else {
                        this.events = [];
                    }
                },

                setupAutoSync() {
                    try {
                        const channel = new BroadcastChannel('nls_sync_channel');
                        channel.onmessage = (msg) => {
                            if (msg.data && (msg.data.type === 'EVENTS_UPDATED' || msg.data.type === 'SYNC_ALL')) {
                                this.loadEvents();
                                this.$nextTick(() => this.updateCardHeight());
                            }
                        };
                    } catch (e) {
                        console.warn('BroadcastChannel not supported:', e);
                    }

                    window.addEventListener('storage', (e) => {
                        if (e.key === 'nls_kalender_events_v1') {
                            this.loadEvents();
                            this.$nextTick(() => this.updateCardHeight());
                        }
                    });

                    window.addEventListener('nls-events-updated', () => {
                        this.loadEvents();
                        this.$nextTick(() => this.updateCardHeight());
                    });
                },

                get monthLabel() {
                    return `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
                },

                prevMonth() {
                    if (this.currentMonth === 0) {
                        this.currentMonth = 11;
                        this.currentYear--;
                    } else {
                        this.currentMonth--;
                    }
                    this.selectedDate = null;
                    this.$nextTick(() => this.updateCardHeight());
                },

                nextMonth() {
                    if (this.currentMonth === 11) {
                        this.currentMonth = 0;
                        this.currentYear++;
                    } else {
                        this.currentMonth++;
                    }
                    this.selectedDate = null;
                    this.$nextTick(() => this.updateCardHeight());
                },

                goToToday() {
                    const today = new Date();
                    this.currentYear = today.getFullYear();
                    this.currentMonth = today.getMonth();
                    this.selectedDate = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                    this.$nextTick(() => this.updateCardHeight());
                },

                setMonth(mIdx) {
                    this.currentMonth = mIdx;
                    this.selectedDate = null;
                    this.$nextTick(() => this.updateCardHeight());
                },

                setCategory(cat) {
                    this.selectedCategory = cat;
                    this.$nextTick(() => this.updateCardHeight());
                },

                resetFilters() {
                    this.selectedCategory = 'all';
                    this.selectedDate = null;
                    this.$nextTick(() => this.updateCardHeight());
                },

                categoryLabel() {
                    switch (this.selectedCategory) {
                        case 'OSN': return 'Kategori: OSN (Olimpiade)';
                        case 'SNBT': return 'Kategori: SNBT (PTN)';
                        case 'TKA': return 'Kategori: TKA (Akademik)';
                        case 'Mitra Sekolah': return 'Kategori: Mitra Sekolah';
                        case 'Event Dinas': return 'Kategori: Event Dinas';
                        default: return 'Semua Kategori Event';
                    }
                },

                filteredEvents() {
                    return this.events.filter(e => {
                        return this.selectedCategory === 'all' || e.category === this.selectedCategory;
                    });
                },

                eventsInCurrentMonth() {
                    const mStr = String(this.currentMonth + 1).padStart(2, '0');
                    const prefix = `${this.currentYear}-${mStr}`;
                    return this.filteredEvents().filter(e => e.date && e.date.startsWith(prefix));
                },

                displayedEvents() {
                    if (this.selectedDate) {
                        return this.filteredEvents().filter(e => e.date === this.selectedDate);
                    }
                    return this.eventsInCurrentMonth();
                },

                get calendarCells() {
                    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
                    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
                    const totalDays = lastDay.getDate();

                    let startDay = firstDay.getDay(); // 0 is Sunday
                    let mondayOffset = (startDay === 0) ? 6 : startDay - 1;

                    const cells = [];
                    for (let i = 0; i < mondayOffset; i++) {
                        cells.push({ isEmpty: true });
                    }

                    const today = new Date();
                    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

                    for (let d = 1; d <= totalDays; d++) {
                        const dStr = String(d).padStart(2, '0');
                        const mStr = String(this.currentMonth + 1).padStart(2, '0');
                        const dateKey = `${this.currentYear}-${mStr}-${dStr}`;

                        const dayOfWeek = (mondayOffset + d - 1) % 7; // 0=Senin, 5=Sabtu, 6=Minggu
                        const dayEvents = this.filteredEvents().filter(e => e.date === dateKey);

                        cells.push({
                            isEmpty: false,
                            dayNumber: d,
                            dateStr: dateKey,
                            isToday: (dateKey === todayStr),
                            isSaturday: (dayOfWeek === 5),
                            isSunday: (dayOfWeek === 6),
                            hasEvents: dayEvents.length > 0,
                            events: dayEvents
                        });
                    }

                    while (cells.length % 7 !== 0) {
                        cells.push({ isEmpty: true });
                    }

                    return cells;
                },

                onCellClick(cell) {
                    if (cell.isEmpty) return;
                    if (this.selectedDate === cell.dateStr) {
                        this.selectedDate = null;
                    } else {
                        this.selectedDate = cell.dateStr;
                    }
                    this.$nextTick(() => this.updateCardHeight());
                },

                getCellClasses(cell) {
                    if (cell.isEmpty) return 'empty opacity-0 pointer-events-none';
                    let classes = [];
                    if (cell.isSaturday) classes.push('saturday');
                    if (cell.isSunday) classes.push('sunday');
                    if (cell.isToday) classes.push('today');
                    if (cell.hasEvents) classes.push('has-events');
                    if (this.selectedDate === cell.dateStr) classes.push('selected');
                    return classes.join(' ');
                },

                getDateNumberClasses(cell) {
                    if (cell.isSunday) return 'text-rose-600 dark:text-rose-400 font-black';
                    if (cell.isSaturday) return 'text-amber-700 dark:text-amber-400 font-bold';
                    if (cell.isToday) return 'text-sky-700 dark:text-white font-black';
                    return 'text-slate-800 dark:text-slate-100';
                },

                getCategoryDotClass(cat) {
                    switch (cat) {
                        case 'OSN': return 'bg-[#0284c7]';
                        case 'TKA': return 'bg-[#d97706]';
                        case 'SNBT': return 'bg-[#059669]';
                        case 'Mitra Sekolah': return 'bg-[#7c3aed]';
                        case 'Event Dinas': return 'bg-[#e11d48]';
                        default: return 'bg-[#0284c7]';
                    }
                },

                getPillClass(cat) {
                    switch (cat) {
                        case 'OSN': return 'pill-osn';
                        case 'TKA': return 'pill-tka';
                        case 'SNBT': return 'pill-snbt';
                        case 'Mitra Sekolah': return 'pill-mitra';
                        case 'Event Dinas': return 'pill-dinas';
                        default: return 'pill-osn';
                    }
                },

                getEventAdminCardClass(cat) {
                    switch (cat) {
                        case 'OSN':
                            return 'bg-gradient-to-br from-sky-50 to-blue-50/60 dark:from-[#0f243a] dark:to-[#132d4b] border-2 border-sky-300 dark:border-sky-700 shadow-md shadow-sky-500/10';
                        case 'TKA':
                            return 'bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-[#33220f] dark:to-[#422c15] border-2 border-amber-300 dark:border-amber-700 shadow-md shadow-amber-500/10';
                        case 'SNBT':
                            return 'bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-[#0f2d24] dark:to-[#143d31] border-2 border-emerald-300 dark:border-emerald-700 shadow-md shadow-emerald-500/10';
                        case 'Mitra Sekolah':
                            return 'bg-gradient-to-br from-purple-50 to-indigo-50/60 dark:from-[#2d124d] dark:to-[#38185f] border-2 border-purple-300 dark:border-purple-700 shadow-md shadow-purple-500/10';
                        case 'Event Dinas':
                            return 'bg-gradient-to-br from-rose-50 to-pink-50/60 dark:from-[#3d121c] dark:to-[#4d1825] border-2 border-rose-300 dark:border-rose-700 shadow-md shadow-rose-500/10';
                        default:
                            return 'bg-gradient-to-br from-sky-50 to-blue-50/60 dark:from-[#0f243a] dark:to-[#132d4b] border-2 border-sky-300 dark:border-sky-700 shadow-md shadow-sky-500/10';
                    }
                },

                getCategoryStripe(cat) {
                    switch (cat) {
                        case 'OSN': return 'bg-sky-500';
                        case 'TKA': return 'bg-amber-500';
                        case 'SNBT': return 'bg-emerald-500';
                        case 'Mitra Sekolah': return 'bg-purple-500';
                        case 'Event Dinas': return 'bg-rose-500';
                        default: return 'bg-sky-500';
                    }
                },

                getEventCategoryBadge(cat) {
                    switch (cat) {
                        case 'OSN': return 'bg-sky-600 text-white shadow-sm';
                        case 'TKA': return 'bg-amber-600 text-white shadow-sm';
                        case 'SNBT': return 'bg-emerald-600 text-white shadow-sm';
                        case 'Mitra Sekolah': return 'bg-purple-600 text-white shadow-sm';
                        case 'Event Dinas': return 'bg-rose-600 text-white shadow-sm';
                        default: return 'bg-sky-600 text-white shadow-sm';
                    }
                },

                formatDateFull(dateStr) {
                    if (!dateStr) return '';
                    try {
                        const d = new Date(dateStr);
                        if (isNaN(d.getTime())) return dateStr;
                        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                        const dayName = days[d.getDay()];
                        return `${dayName}, ${d.getDate()} ${this.monthNames[d.getMonth()]} ${d.getFullYear()}`;
                    } catch (e) {
                        return dateStr;
                    }
                }
            };
        }
'@

$content = $content.Replace('function homeNewsApp() {', "$homeCalendarScript`n`n        function homeNewsApp() {")

[System.IO.File]::WriteAllText($indexPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Successfully injected Calendar section into index.html!"
