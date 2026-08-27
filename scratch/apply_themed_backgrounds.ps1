$kalenderPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html"
$content = [System.IO.File]::ReadAllText($kalenderPath, [System.Text.Encoding]::UTF8)

# 1. Add Card Themes and update Pills in CSS
$oldPillPattern = '(?s)\/\* Event Tag Pills inside cells \*\/.*?\.month-chip-bar \{'

$newPillCss = @'
/* THEMED EVENT CARDS (Full-Color Dynamic Themes for Details Panel) */
.event-card-item {
    border-radius: 1.25rem;
    padding: 1.15rem 1.25rem;
    position: relative;
    overflow: hidden;
    transition: all 0.25s ease;
    box-shadow: 0 4px 14px -3px rgba(0, 0, 0, 0.05);
}
.event-card-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.1);
}

/* OSN: Biru */
.card-theme-osn {
    background: linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 100%) !important;
    border: 1.5px solid #bae6fd !important;
}
html.dark .card-theme-osn {
    background: linear-gradient(145deg, #0c2340 0%, #082f49 100%) !important;
    border-color: #0369a1 !important;
}

/* TKA: Kuning / Amber Gold */
.card-theme-tka {
    background: linear-gradient(145deg, #fffdf0 0%, #fef3c7 100%) !important;
    border: 1.5px solid #fde68a !important;
}
html.dark .card-theme-tka {
    background: linear-gradient(145deg, #331e08 0%, #451a03 100%) !important;
    border-color: #92400e !important;
}

/* SNBT: Hijau / Emerald */
.card-theme-snbt {
    background: linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%) !important;
    border: 1.5px solid #a7f3d0 !important;
}
html.dark .card-theme-snbt {
    background: linear-gradient(145deg, #063828 0%, #064e3b 100%) !important;
    border-color: #065f46 !important;
}

/* Mitra Sekolah: Ungu / Violet */
.card-theme-mitra {
    background: linear-gradient(145deg, #faf5ff 0%, #f3e8ff 100%) !important;
    border: 1.5px solid #e9d5ff !important;
}
html.dark .card-theme-mitra {
    background: linear-gradient(145deg, #280c42 0%, #3b0764 100%) !important;
    border-color: #6b21a8 !important;
}

/* Event Dinas: Merah / Rose */
.card-theme-dinas {
    background: linear-gradient(145deg, #fff1f2 0%, #ffe4e6 100%) !important;
    border: 1.5px solid #fecdd3 !important;
}
html.dark .card-theme-dinas {
    background: linear-gradient(145deg, #3d0918 0%, #4c0519 100%) !important;
    border-color: #9f1239 !important;
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
.pill-tka { background: #fef3c7; color: #92400e; border-color: #fde68a; }
.pill-snbt { background: #d1fae5; color: #065f46; border-color: #a7f3d0; }
.pill-mitra { background: #f3e8ff; color: #6b21a8; border-color: #e9d5ff; }
.pill-dinas { background: #ffe4e6; color: #be123c; border-color: #fecdd3; }

html.dark .pill-osn { background: #082f49; color: #7dd3fc; border-color: #0369a1; }
html.dark .pill-tka { background: #451a03; color: #fde68a; border-color: #92400e; }
html.dark .pill-snbt { background: #064e3b; color: #6ee7b7; border-color: #065f46; }
html.dark .pill-mitra { background: #3b0764; color: #d8b4fe; border-color: #7e22ce; }
html.dark .pill-dinas { background: #4c0519; color: #fda4af; border-color: #9f1239; }

.month-chip-bar {
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldPillPattern, $newPillCss)

# 2. Update Legend Bar to match (OSN=blue, TKA=yellow, SNBT=green, Mitra=purple, Dinas=rose)
$oldLegendPattern = '(?s)<!-- Legend Bar at bottom of calendar -->.*?</div>\s*</div>\s*</div>\s*<!-- ='

$newLegend = @'
<!-- Legend Bar at bottom of calendar -->
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

                        <!-- =
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldLegendPattern, $newLegend)

# 3. Update Event Cards Template in Detail Panel to use themed background
$oldCardTplPattern = '(?s)<!-- Event Cards -->\s*<template x-for="event in displayedEvents\(\)" :key="event\.id">.*?<!-- Direct WhatsApp CTA Button -->'

$newCardTpl = @'
<!-- Event Cards (Themed Background Colors) -->
                                    <template x-for="event in displayedEvents()" :key="event.id">
                                        <div class="event-card-item space-y-3" :class="getEventCardClass(event.category)">
                                            
                                            <!-- Left Category Color Accent Stripe -->
                                            <div class="absolute left-0 top-0 bottom-0 w-2.5" :class="getCategoryStripe(event.category)"></div>

                                            <div class="pl-2 space-y-2.5">
                                                <!-- Badges Header -->
                                                <div class="flex flex-wrap items-center gap-1.5">
                                                    <!-- Category Badge -->
                                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs"
                                                        :class="getCategoryBadgeClass(event.category)"
                                                        x-text="event.category"></span>

                                                    <!-- Jenjang Badge -->
                                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                                                        x-text="event.jenjangLabel || event.jenjang"></span>

                                                    <!-- Status Badge -->
                                                    <span x-show="event.badgeText"
                                                        class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 dark:bg-slate-900/90 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1 shadow-2xs">
                                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        <span x-text="event.badgeText"></span>
                                                    </span>
                                                </div>

                                                <!-- Event Title -->
                                                <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-primary transition-colors"
                                                    x-text="event.title"></h4>

                                                <!-- Meta: Date, Time, Mode -->
                                                <div class="flex flex-col gap-1 text-xs text-slate-700 dark:text-slate-200 font-bold pt-0.5">
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
                                                <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal pt-1.5 border-t border-black/10 dark:border-white/10"
                                                    x-text="event.description"></p>

                                                <!-- Highlights (if available) -->
                                                <template x-if="event.highlights && event.highlights.length > 0">
                                                    <div class="bg-white/85 dark:bg-slate-950/60 backdrop-blur-xs p-3 rounded-xl border border-black/10 dark:border-white/10 space-y-1.5">
                                                        <p class="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Fasilitas &amp; Materi:</p>
                                                        <ul class="space-y-1">
                                                            <template x-for="(hl, hIdx) in event.highlights" :key="hIdx">
                                                                <li class="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                                                                    <span class="icon-[mdi--check-circle] text-emerald-600 text-sm shrink-0 mt-0.5"></span>
                                                                    <span x-text="hl"></span>
                                                                </li>
                                                            </template>
                                                        </ul>
                                                    </div>
                                                </template>

                                                <!-- Direct WhatsApp CTA Button -->
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldCardTplPattern, $newCardTpl)

# 4. Update helper functions in Alpine kalenderApp()
$oldMethodsPattern = '(?s)getPillClass\(cat\) \{.*?formatDateFull\(dateStr\) \{'

$newMethods = @'
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

                getEventCardClass(cat) {
                    switch (cat) {
                        case 'OSN': return 'card-theme-osn';
                        case 'TKA': return 'card-theme-tka';
                        case 'SNBT': return 'card-theme-snbt';
                        case 'Mitra Sekolah': return 'card-theme-mitra';
                        case 'Event Dinas': return 'card-theme-dinas';
                        default: return 'card-theme-osn';
                    }
                },

                getCategoryDotClass(cat) {
                    switch (cat) {
                        case 'OSN': return 'bg-[#0284c7]';
                        case 'TKA': return 'bg-[#d97706]';
                        case 'SNBT': return 'bg-[#059669]';
                        case 'Mitra Sekolah': return 'bg-[#7c3aed]';
                        case 'Event Dinas': return 'bg-[#e11d48]';
                        default: return 'bg-primary';
                    }
                },

                getCategoryStripe(cat) {
                    switch (cat) {
                        case 'OSN': return 'bg-[#0284c7]';
                        case 'TKA': return 'bg-[#d97706]';
                        case 'SNBT': return 'bg-[#059669]';
                        case 'Mitra Sekolah': return 'bg-[#7c3aed]';
                        case 'Event Dinas': return 'bg-[#e11d48]';
                        default: return 'bg-primary';
                    }
                },

                getCategoryBadgeClass(cat) {
                    switch (cat) {
                        case 'OSN':
                            return 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/80 dark:text-sky-200 dark:border-sky-700';
                        case 'TKA':
                            return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/80 dark:text-amber-200 dark:border-amber-700';
                        case 'SNBT':
                            return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/80 dark:text-emerald-200 dark:border-emerald-700';
                        case 'Mitra Sekolah':
                            return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/80 dark:text-purple-200 dark:border-purple-700';
                        case 'Event Dinas':
                            return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/80 dark:text-rose-200 dark:border-rose-700';
                        default:
                            return 'bg-slate-100 text-slate-700 border-slate-200';
                    }
                },

                getKebutuhanForCategory(cat) {
                    if (cat === 'OSN' || cat === 'SNBT' || cat === 'TKA') return 'Bimbel Online';
                    if (cat === 'Mitra Sekolah') return 'Mitra Sekolah';
                    if (cat === 'Event Dinas') return 'Mitra Dinas';
                    return 'Privat';
                },

                formatDateFull(dateStr) {
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldMethodsPattern, $newMethods)

[System.IO.File]::WriteAllText($kalenderPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Applied themed background colors to event cards in kalender/index.html!"
