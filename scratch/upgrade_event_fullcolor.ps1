$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Update Themed Event Cards CSS in <style>
$oldCardStyles = @'
        /* Themed Event Cards in Admin */
        .admin-card-osn {
            background: linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 100%) !important;
            border: 1.5px solid #bae6fd !important;
        }
        html.dark .admin-card-osn {
            background: linear-gradient(145deg, #0c2340 0%, #082f49 100%) !important;
            border-color: #0369a1 !important;
        }

        .admin-card-tka {
            background: linear-gradient(145deg, #fffdf0 0%, #fef3c7 100%) !important;
            border: 1.5px solid #fde68a !important;
        }
        html.dark .admin-card-tka {
            background: linear-gradient(145deg, #331e08 0%, #451a03 100%) !important;
            border-color: #92400e !important;
        }

        .admin-card-snbt {
            background: linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%) !important;
            border: 1.5px solid #a7f3d0 !important;
        }
        html.dark .admin-card-snbt {
            background: linear-gradient(145deg, #063828 0%, #064e3b 100%) !important;
            border-color: #065f46 !important;
        }

        .admin-card-mitra {
            background: linear-gradient(145deg, #faf5ff 0%, #f3e8ff 100%) !important;
            border: 1.5px solid #e9d5ff !important;
        }
        html.dark .admin-card-mitra {
            background: linear-gradient(145deg, #280c42 0%, #3b0764 100%) !important;
            border-color: #6b21a8 !important;
        }

        .admin-card-dinas {
            background: linear-gradient(145deg, #fff1f2 0%, #ffe4e6 100%) !important;
            border: 1.5px solid #fecdd3 !important;
        }
        html.dark .admin-card-dinas {
            background: linear-gradient(145deg, #3d0918 0%, #4c0519 100%) !important;
            border-color: #9f1239 !important;
        }
'@

$newCardStyles = @'
        /* Full-Color Vibrant Themed Event Cards in Admin (High Contrast) */
        .admin-card-osn {
            background: linear-gradient(145deg, #e0f2fe 0%, #bae6fd 100%) !important;
            border: 2.5px solid #38bdf8 !important;
            box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.25) !important;
        }
        html.dark .admin-card-osn {
            background: linear-gradient(145deg, #0c2d48 0%, #0f3d63 100%) !important;
            border: 2.5px solid #0284c7 !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
        }

        .admin-card-tka {
            background: linear-gradient(145deg, #fef3c7 0%, #fde68a 100%) !important;
            border: 2.5px solid #f59e0b !important;
            box-shadow: 0 10px 25px -5px rgba(217, 119, 6, 0.25) !important;
        }
        html.dark .admin-card-tka {
            background: linear-gradient(145deg, #452404 0%, #5e3206 100%) !important;
            border: 2.5px solid #d97706 !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
        }

        .admin-card-snbt {
            background: linear-gradient(145deg, #dcfce7 0%, #bbf7d0 100%) !important;
            border: 2.5px solid #10b981 !important;
            box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.25) !important;
        }
        html.dark .admin-card-snbt {
            background: linear-gradient(145deg, #063d27 0%, #095738 100%) !important;
            border: 2.5px solid #059669 !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
        }

        .admin-card-mitra {
            background: linear-gradient(145deg, #f3e8ff 0%, #e9d5ff 100%) !important;
            border: 2.5px solid #a855f7 !important;
            box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.25) !important;
        }
        html.dark .admin-card-mitra {
            background: linear-gradient(145deg, #320d53 0%, #461573 100%) !important;
            border: 2.5px solid #7c3aed !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
        }

        .admin-card-dinas {
            background: linear-gradient(145deg, #ffe4e6 0%, #fecdd3 100%) !important;
            border: 2.5px solid #f43f5e !important;
            box-shadow: 0 10px 25px -5px rgba(225, 29, 72, 0.25) !important;
        }
        html.dark .admin-card-dinas {
            background: linear-gradient(145deg, #4d0a1b 0%, #680f25 100%) !important;
            border: 2.5px solid #e11d48 !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
        }
'@

$content = $content.Replace($oldCardStyles, $newCardStyles)

# 2. Update getEventCategoryBadge in JS for Rich Vibrant Contrast Badges
$oldBadgeMethod = @'
                getEventCategoryBadge(cat) {
                    switch (cat) {
                        case 'OSN': return 'bg-sky-100 text-sky-800 border border-sky-300';
                        case 'TKA': return 'bg-amber-100 text-amber-900 border border-amber-300';
                        case 'SNBT': return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
                        case 'Mitra Sekolah': return 'bg-purple-100 text-purple-800 border border-purple-300';
                        case 'Event Dinas': return 'bg-rose-100 text-rose-800 border border-rose-300';
                        default: return 'bg-slate-100 text-slate-700';
                    }
                },
'@

$newBadgeMethod = @'
                getEventCategoryBadge(cat) {
                    switch (cat) {
                        case 'OSN': return 'bg-sky-600 text-white font-black border border-sky-400 shadow-sm';
                        case 'TKA': return 'bg-amber-600 text-white font-black border border-amber-400 shadow-sm';
                        case 'SNBT': return 'bg-emerald-600 text-white font-black border border-emerald-400 shadow-sm';
                        case 'Mitra Sekolah': return 'bg-purple-600 text-white font-black border border-purple-400 shadow-sm';
                        case 'Event Dinas': return 'bg-rose-600 text-white font-black border border-rose-400 shadow-sm';
                        default: return 'bg-slate-700 text-white font-black shadow-sm';
                    }
                },
'@

$content = $content.Replace($oldBadgeMethod, $newBadgeMethod)

# 3. Update Filter & Search Controls Bar to be Full-Color & High Contrast
$oldFilterBar = @'
                    <!-- Filter & Search Controls -->
                    <div class="p-4 sm:p-5 bg-white dark:bg-[#131D38] rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                        <div class="flex-1 flex flex-col sm:flex-row gap-2.5">
                            <!-- Search -->
                            <div class="relative flex-1">
                                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </span>
                                <input type="text" x-model="eventFilter.search" @input="eventCurrentPage = 1" placeholder="Cari judul agenda atau materi..."
                                    class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500">
                            </div>

                            <!-- Filter Category -->
                            <select x-model="eventFilter.category" @change="eventCurrentPage = 1" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                                <option value="all">Semua Kategori</option>
                                <option value="OSN">OSN (Olimpiade)</option>
                                <option value="TKA">TKA (Akademik)</option>
                                <option value="SNBT">SNBT (PTN)</option>
                                <option value="Mitra Sekolah">Mitra Sekolah</option>
                                <option value="Event Dinas">Event Dinas</option>
                            </select>

                            <!-- Filter Month -->
                            <select x-model="eventFilter.month" @change="eventCurrentPage = 1" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                                <option value="all">Semua Bulan 2026</option>
                                <template x-for="(m, mIdx) in monthNames" :key="mIdx">
                                    <option :value="mIdx" x-text="m + ' 2026'"></option>
                                </template>
                            </select>
                        </div>

                        <button @click="resetEventFilters()"
                            x-show="eventFilter.search || eventFilter.category !== 'all' || eventFilter.month !== 'all'"
                            class="px-3 py-2 text-xs font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1 self-end md:self-auto">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            <span>Reset Filter</span>
                        </button>
                    </div>
'@

$newFilterBar = @'
                    <!-- Filter & Search Controls (Full-Color High-Contrast Card) -->
                    <div class="p-4 sm:p-5 bg-white dark:bg-[#131D38] rounded-3xl border-2 border-sky-200 dark:border-slate-700 shadow-md shadow-sky-500/5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                        <div class="flex-1 flex flex-col sm:flex-row gap-2.5">
                            <!-- Search -->
                            <div class="relative flex-1">
                                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sky-600 dark:text-sky-400 pointer-events-none">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </span>
                                <input type="text" x-model="eventFilter.search" @input="eventCurrentPage = 1" placeholder="Cari judul agenda atau materi..."
                                    class="w-full pl-10 pr-3 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all">
                            </div>

                            <!-- Filter Category -->
                            <select x-model="eventFilter.category" @change="eventCurrentPage = 1" class="px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-black text-slate-800 dark:text-white focus:outline-none focus:border-sky-500 transition-all">
                                <option value="all">🔍 Semua Kategori</option>
                                <option value="OSN">🏆 OSN (Olimpiade)</option>
                                <option value="TKA">📊 TKA (Akademik)</option>
                                <option value="SNBT">🎯 SNBT (PTN)</option>
                                <option value="Mitra Sekolah">🤝 Mitra Sekolah</option>
                                <option value="Event Dinas">🏛️ Event Dinas</option>
                            </select>

                            <!-- Filter Month -->
                            <select x-model="eventFilter.month" @change="eventCurrentPage = 1" class="px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-black text-slate-800 dark:text-white focus:outline-none focus:border-sky-500 transition-all">
                                <option value="all">📅 Semua Bulan 2026</option>
                                <template x-for="(m, mIdx) in monthNames" :key="mIdx">
                                    <option :value="mIdx" x-text="m + ' 2026'"></option>
                                </template>
                            </select>
                        </div>

                        <button @click="resetEventFilters()"
                            x-show="eventFilter.search || eventFilter.category !== 'all' || eventFilter.month !== 'all'"
                            class="px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-2 border-rose-200 dark:border-rose-800 text-xs font-black hover:bg-rose-100 cursor-pointer flex items-center gap-1.5 self-end md:self-auto transition-all shadow-xs">
                            <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            <span>Reset Filter</span>
                        </button>
                    </div>
'@

$content = $content.Replace($oldFilterBar, $newFilterBar)

# 4. Update Event Cards Grid to have Rich Themed Headers, Clear Action Buttons & Information
$oldGridBlock = @'
                    <!-- Event Cards Grid Table -->
                    <div class="admin-grid-3">
                        <template x-for="event in paginatedEventsList()" :key="event.id">
                            <div class="p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative overflow-hidden" :class="getEventAdminCardClass(event.category)">
                                <!-- Left Stripe -->
                                <div class="absolute left-0 top-0 bottom-0 w-2" :class="getCategoryStripe(event.category)"></div>

                                <div class="pl-2 space-y-2.5">
                                    <div class="flex items-center justify-between gap-1.5 flex-wrap">
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                                            :class="getEventCategoryBadge(event.category)"
                                            x-text="event.category"></span>
                                        <span class="text-[11px] font-bold text-slate-500" x-text="event.date"></span>
                                    </div>

                                    <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug"
                                        x-text="event.title"></h4>

                                    <div class="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                        <div class="flex items-center gap-1.5 font-semibold">
                                            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <span x-text="event.time"></span>
                                        </div>
                                        <div class="flex items-center gap-1.5 font-semibold">
                                            <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                            <span x-text="event.mode + ' • ' + event.location"></span>
                                        </div>
                                    </div>

                                    <p class="text-xs text-slate-500 line-clamp-2" x-text="event.description"></p>
                                </div>

                                <!-- Action Buttons -->
                                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 pl-2">
                                    <span class="text-[10px] font-bold text-slate-400" x-text="event.jenjangLabel || event.jenjang"></span>
                                    <div class="flex items-center gap-1">
                                        <button type="button" @click="editEvent(event)"
                                            class="p-2 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300 transition-all cursor-pointer"
                                            title="Edit / Revisi">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        <button type="button" @click="duplicateEvent(event)"
                                            class="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-all cursor-pointer"
                                            title="Duplikasi">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                                        </button>
                                        <button type="button" @click="deleteEvent(event.id)"
                                            class="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 transition-all cursor-pointer"
                                            title="Hapus">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
'@

$newGridBlock = @'
                    <!-- Event Cards Grid Table (3 Events Per Page, Full-Color High-Contrast) -->
                    <div class="admin-grid-3">
                        <template x-for="event in paginatedEventsList()" :key="event.id">
                            <div class="p-6 rounded-3xl transition-all flex flex-col justify-between space-y-4 relative overflow-hidden hover:-translate-y-1" :class="getEventAdminCardClass(event.category)">
                                <!-- Left Category Accent Stripe -->
                                <div class="absolute left-0 top-0 bottom-0 w-2.5" :class="getCategoryStripe(event.category)"></div>

                                <div class="pl-2 space-y-3">
                                    <!-- Category Badge & Date Row -->
                                    <div class="flex items-center justify-between gap-2 flex-wrap">
                                        <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider"
                                            :class="getEventCategoryBadge(event.category)"
                                            x-text="event.category"></span>
                                        <span class="inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-black/40 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-white/10"
                                            x-text="event.date"></span>
                                    </div>

                                    <!-- Title -->
                                    <h4 class="text-base sm:text-lg font-black text-slate-950 dark:text-white leading-snug"
                                        x-text="event.title"></h4>

                                    <!-- Info Row -->
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

                                    <p class="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed" x-text="event.description"></p>
                                </div>

                                <!-- Action Buttons Row (Solid Full-Color Vivid Buttons) -->
                                <div class="pt-3.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2 pl-2">
                                    <span class="px-2.5 py-1 rounded-xl text-[11px] font-black bg-white/70 dark:bg-black/40 text-slate-800 dark:text-slate-200 border border-black/5 dark:border-white/10"
                                        x-text="event.jenjangLabel || event.jenjang"></span>
                                    
                                    <div class="flex items-center gap-1.5">
                                        <!-- Edit Button (Vivid Sky Blue) -->
                                        <button type="button" @click="editEvent(event)"
                                            class="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                            title="Edit / Revisi Agenda">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        
                                        <!-- Duplicate Button (Vivid Indigo) -->
                                        <button type="button" @click="duplicateEvent(event)"
                                            class="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                            title="Duplikasi Agenda">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                                        </button>
                                        
                                        <!-- Delete Button (Vivid Rose) -->
                                        <button type="button" @click="deleteEvent(event.id)"
                                            class="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                            title="Pindahkan ke Trash">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
'@

$content = $content.Replace($oldGridBlock, $newGridBlock)

# 5. Update Numbered Pagination Bar to be Ultra Full-Color, High Contrast, and Clear
$oldPaginationBar = @'
                    <!-- Numbered Pagination Bar (3 Events Per Page) -->
                    <div class="p-4 sm:p-5 bg-white dark:bg-[#131D38] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                        <!-- Left: Status Info -->
                        <div class="text-xs font-bold text-slate-500 dark:text-slate-400 text-center sm:text-left">
                            Menampilkan <span class="text-slate-900 dark:text-white font-black" x-text="filteredEventsList().length === 0 ? 0 : ((eventCurrentPage - 1) * eventPerPage + 1)"></span> - <span class="text-slate-900 dark:text-white font-black" x-text="Math.min(eventCurrentPage * eventPerPage, filteredEventsList().length)"></span> dari <span class="text-sky-600 dark:text-sky-400 font-black" x-text="filteredEventsList().length"></span> total agenda aktif
                        </div>

                        <!-- Right: Numbered Page Navigation -->
                        <div class="flex items-center gap-1.5 flex-wrap justify-center" x-show="totalEventPages() > 1">
                            <!-- Prev Button -->
                            <button type="button" @click="goToEventPage(eventCurrentPage - 1)" :disabled="eventCurrentPage === 1"
                                :class="eventCurrentPage === 1 ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs'"
                                class="px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
                                <span class="hidden sm:inline">Sebelumnya</span>
                            </button>

                            <!-- Page Number Buttons Loop -->
                            <template x-for="p in getEventPaginationRange()" :key="p">
                                <div>
                                    <template x-if="p === '...'">
                                        <span class="w-9 h-9 flex items-center justify-center text-xs font-bold text-slate-400 select-none">...</span>
                                    </template>
                                    <template x-if="p !== '...'">
                                        <button type="button" @click="goToEventPage(p)"
                                            :class="eventCurrentPage === p ? 'bg-sky-600 text-white font-black shadow-md shadow-sky-600/30 ring-2 ring-sky-300 dark:ring-sky-700 scale-105' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'"
                                            class="w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                                            x-text="p">
                                        </button>
                                    </template>
                                </div>
                            </template>

                            <!-- Next Button -->
                            <button type="button" @click="goToEventPage(eventCurrentPage + 1)" :disabled="eventCurrentPage === totalEventPages()"
                                :class="eventCurrentPage === totalEventPages() ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs'"
                                class="px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1">
                                <span class="hidden sm:inline">Berikutnya</span>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                            </button>
                        </div>
                    </div>
'@

$newPaginationBar = @'
                    <!-- Numbered Pagination Bar (Full-Color, High-Contrast & Vibrant) -->
                    <div class="p-4 sm:p-5 bg-white dark:bg-[#131D38] rounded-3xl border-2 border-sky-300 dark:border-slate-700 shadow-xl shadow-sky-500/10 flex flex-col md:flex-row items-center justify-between gap-4 mt-8 transition-all">
                        
                        <!-- Left: Full-Color Status Badge -->
                        <div class="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/80 dark:to-indigo-950/80 border-2 border-sky-200 dark:border-sky-800 shadow-sm">
                            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                            <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
                                <span>Menampilkan </span>
                                <span class="px-2 py-0.5 rounded-lg bg-sky-600 text-white font-black text-xs shadow-xs" x-text="filteredEventsList().length === 0 ? 0 : ((eventCurrentPage - 1) * eventPerPage + 1)"></span>
                                <span> - </span>
                                <span class="px-2 py-0.5 rounded-lg bg-sky-600 text-white font-black text-xs shadow-xs" x-text="Math.min(eventCurrentPage * eventPerPage, filteredEventsList().length)"></span>
                                <span> dari </span>
                                <span class="px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white font-black text-xs shadow-xs" x-text="filteredEventsList().length"></span>
                                <span class="font-extrabold text-slate-900 dark:text-white"> Total Agenda Aktif</span>
                            </div>
                        </div>

                        <!-- Right: Numbered Page Navigation with High-Contrast Buttons -->
                        <div class="flex items-center gap-2 flex-wrap justify-center" x-show="totalEventPages() > 1">
                            <!-- Prev Button -->
                            <button type="button" @click="goToEventPage(eventCurrentPage - 1)" :disabled="eventCurrentPage === 1"
                                :class="eventCurrentPage === 1 ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700' : 'bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white dark:bg-sky-950 dark:text-sky-300 dark:hover:bg-sky-600 dark:hover:text-white border-2 border-sky-400 dark:border-sky-600 cursor-pointer shadow-md hover:scale-105 active:scale-95'"
                                class="px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"/></svg>
                                <span class="hidden sm:inline">Sebelumnya</span>
                            </button>

                            <!-- Page Number Buttons Loop -->
                            <template x-for="p in getEventPaginationRange()" :key="p">
                                <div>
                                    <template x-if="p === '...'">
                                        <span class="w-10 h-10 flex items-center justify-center font-black text-slate-400 dark:text-slate-500 text-sm select-none">...</span>
                                    </template>
                                    <template x-if="p !== '...'">
                                        <button type="button" @click="goToEventPage(p)"
                                            :style="eventCurrentPage === p ? 'background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important; border: 2.5px solid #38bdf8 !important;' : ''"
                                            :class="eventCurrentPage === p ? 'shadow-lg shadow-sky-600/40 ring-4 ring-sky-200 dark:ring-sky-900/80 scale-110' : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-400 border-2 border-slate-300 dark:border-slate-700 shadow-sm hover:scale-105 active:scale-95'"
                                            class="w-10 h-10 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center"
                                            x-text="p">
                                        </button>
                                    </template>
                                </div>
                            </template>

                            <!-- Next Button -->
                            <button type="button" @click="goToEventPage(eventCurrentPage + 1)" :disabled="eventCurrentPage === totalEventPages()"
                                :class="eventCurrentPage === totalEventPages() ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-2 border-slate-200 dark:border-slate-700' : 'bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white dark:bg-sky-950 dark:text-sky-300 dark:hover:bg-sky-600 dark:hover:text-white border-2 border-sky-400 dark:border-sky-600 cursor-pointer shadow-md hover:scale-105 active:scale-95'"
                                class="px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5">
                                <span class="hidden sm:inline">Berikutnya</span>
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"/></svg>
                            </button>
                        </div>
                    </div>
'@

$content = $content.Replace($oldPaginationBar, $newPaginationBar)

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Upgraded Kalender Event / Present Event to Full-Color, High Contrast design with prominent pagination numbers!"
