# =========================================================================
# SYNC PRESENT EVENT CARD DESIGN ACROSS ALL PAGES (kalender/index.html & osn/index.html)
# Matching https://nls-blog-plum.vercel.app/nlsadmin Present Event View
# =========================================================================

$eventCardTemplate = @'
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
                                                        <span class="truncate" x-text="event.mode + ' • ' + event.location"></span>
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
'@

# Helper methods to inject into kalenderApp / osnCalendarApp
$helperMethods = @'
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
'@

# 1. Update kalender/index.html
$kalenderPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\index.html"
$kContent = [System.IO.File]::ReadAllText($kalenderPath, [System.Text.Encoding]::UTF8)

# Replace the displayedEvents template in kalender/index.html
$oldKalenderCardsPattern = '(?s)<!-- Event Cards \(Themed Background Colors\) -->\s*<template x-for="event in displayedEvents\(\)" :key="event\.id">.*?</template>'
$kContent = [System.Text.RegularExpressions.Regex]::Replace($kContent, $oldKalenderCardsPattern, $eventCardTemplate)

# Ensure helper methods exist in kalender/index.html
if (-not $kContent.Contains('getEventAdminCardClass(cat)')) {
    $kContent = $kContent.Replace('getEventCardClass(cat) {', "$helperMethods`n                getEventCardClass(cat) {")
}

[System.IO.File]::WriteAllText($kalenderPath, $kContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated kalender/index.html with Present Event cards!"

# 2. Update osn/index.html
$osnPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\osn\index.html"
$oContent = [System.IO.File]::ReadAllText($osnPath, [System.Text.Encoding]::UTF8)

# Replace the displayedEvents template in osn/index.html
$oldOsnCardsPattern = '(?s)<!-- Event Cards Loop -->\s*<template x-for="event in displayedEvents\(\)" :key="event\.id">.*?</template>'
$oContent = [System.Text.RegularExpressions.Regex]::Replace($oContent, $oldOsnCardsPattern, $eventCardTemplate)

# Ensure helper methods exist in osn/index.html
if (-not $oContent.Contains('getEventAdminCardClass(cat)')) {
    $oContent = $oContent.Replace('getEventCardClass(cat) {', "$helperMethods`n                getEventCardClass(cat) {")
}

[System.IO.File]::WriteAllText($osnPath, $oContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated osn/index.html with Present Event cards!"
