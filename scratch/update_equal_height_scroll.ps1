$kalenderPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html"
$content = [System.IO.File]::ReadAllText($kalenderPath, [System.Text.Encoding]::UTF8)

# 1. Update CSS in <style> block
$oldCssPattern = '(?s)\/\* Bulletproof Side-by-Side Grid \*\/.*?\.custom-scrollbar::-webkit-scrollbar-thumb \{.*?\n\}'

$newCss = @'
/* Bulletproof Side-by-Side Grid with Exact Equal Height */
.cal-side-dashboard {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    margin-bottom: 3rem;
}
@media (min-width: 1024px) {
    .cal-side-dashboard {
        display: grid;
        grid-template-columns: 1.35fr 1fr;
        gap: 1.75rem;
        align-items: stretch;
    }
}
@media (min-width: 1280px) {
    .cal-side-dashboard {
        grid-template-columns: 1.45fr 1fr;
        gap: 2rem;
    }
}

.cal-col-left {
    width: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.cal-col-right {
    width: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.calendar-main-card {
    width: 100%;
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 1.75rem;
    box-shadow: 0 20px 45px -15px rgba(0, 46, 71, 0.08), 0 0 1px rgba(0,0,0,0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
html.dark .calendar-main-card {
    background: #131d38;
    border-color: #273549;
    box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.6);
}

.calendar-detail-card {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 1.75rem;
    box-shadow: 0 20px 45px -15px rgba(0, 46, 71, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
}
html.dark .calendar-detail-card {
    background: #131d38;
    border-color: #273549;
    box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.6);
}

/* Detail Card Inner Scrollable Body */
.cal-detail-body {
    flex: 1 1 0%;
    min-height: 0;
    overflow-y: auto;
    padding-right: 0.35rem;
}
@media (max-width: 1023px) {
    .cal-detail-body {
        max-height: 520px;
    }
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
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldCssPattern, $newCss)

# 2. Update HTML structure of Main Card and Detail Card
$oldCardsPattern = '(?s)<!-- BULLETPROOF SIDE-BY-SIDE 2-COLUMN DASHBOARD -->.*?<!-- Call to Action Banner -->'

$newCards = @'
<!-- BULLETPROOF SIDE-BY-SIDE 2-COLUMN DASHBOARD -->
                    <div class="cal-side-dashboard">
                        
                        <!-- ==============================================
                             KOLOM KIRI: KALENDER INTERAKTIF
                             ============================================== -->
                        <div class="cal-col-left">
                            
                            <div id="cal-main-card-el" class="calendar-main-card">
                                <!-- Month Navigation Header Bar -->
                                <div class="p-4 sm:p-5 bg-gradient-to-r from-sky-50/80 via-white to-blue-50/80 dark:from-[#0f182e] dark:via-[#131d38] dark:to-[#0f182e] border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
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
                                                Pilih tanggal berpenanda untuk melihat rincian di panel kanan
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
                                <div class="px-4 py-3 bg-slate-50 dark:bg-[#0c1427] border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[11px] font-bold shrink-0">
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
                             KOLOM KANAN: RINCIAN & KETERANGAN AGENDA
                             (Ukurannya sama persis dengan kalender & bisa di-scroll)
                             ============================================== -->
                        <div id="detail-kegiatan" class="cal-col-right scroll-mt-24">
                            
                            <div class="calendar-detail-card p-5 sm:p-6" :style="mainCardHeight ? 'height: ' + mainCardHeight + 'px;' : ''">
                                
                                <!-- Panel Header (Fixed at top) -->
                                <div class="pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
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

                                <!-- Scrollable Event Cards List (Fills remainder & scrolls) -->
                                <div class="cal-detail-body custom-scrollbar space-y-4">
                                    
                                    <!-- Empty State if no events -->
                                    <template x-if="displayedEvents().length === 0">
                                        <div class="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3 my-auto">
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

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldCardsPattern, $newCards)

# 3. Update Alpine kalenderApp() to sync mainCardHeight dynamically
$oldScriptPattern = '(?s)function kalenderApp\(\) \{\s*return \{\s*currentYear: 2026,.*?init\(\) \{'

$newScript = @'
function kalenderApp() {
            return {
                currentYear: 2026,
                currentMonth: 7, // 7 = Agustus 2026
                selectedCategory: 'all',
                selectedJenjang: 'all',
                selectedDate: null,
                mainCardHeight: null,
                monthNames: [
                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ],
                
                // Dynamic Events Dataset (Synced with /kalender-admin & localStorage)
                events: (function() {
                    try {
                        const stored = localStorage.getItem("nls_kalender_events_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                return parsed;
                            }
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_EVENTS !== "undefined") ? window.NLS_DEFAULT_EVENTS : [];
                })(),

                updateCardHeight() {
                    if (window.innerWidth >= 1024) {
                        const el = document.getElementById('cal-main-card-el');
                        if (el) {
                            this.mainCardHeight = el.offsetHeight;
                        }
                    } else {
                        this.mainCardHeight = null;
                    }
                },

                init() {
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldScriptPattern, $newScript)

# Add updateCardHeight calls on month/filter changes in init
$oldInitEndPattern = '(?s)window\.addEventListener\("nls-events-updated", \(e\) => \{.*?\}\);\s*\},'

$newInitEnd = @'
window.addEventListener("nls-events-updated", (e) => {
                        if (e.detail && Array.isArray(e.detail)) {
                            this.events = e.detail;
                            this.$nextTick(() => this.updateCardHeight());
                        }
                    });

                    // Sync card height on load & resize
                    this.$nextTick(() => {
                        this.updateCardHeight();
                    });
                    window.addEventListener("resize", () => {
                        this.updateCardHeight();
                    });
                },
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldInitEndPattern, $newInitEnd)

[System.IO.File]::WriteAllText($kalenderPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Configured exact equal vertical height and inner scroll for Rincian & Keterangan in kalender/index.html!"
