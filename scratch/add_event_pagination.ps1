$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Add eventCurrentPage & eventPerPage in state
$oldFilterState = "eventFilter: { search: '', category: 'all', month: 'all' },"
$newFilterState = @"
eventFilter: { search: '', category: 'all', month: 'all' },
                eventCurrentPage: 1,
                eventPerPage: 3,
"@

$content = $content.Replace($oldFilterState, $newFilterState)

# 2. Add pagination methods to superAdminApp
$oldFilteredEvents = @'
                filteredEventsList() {
                    return this.events.filter(e => {
                        const matchSearch = !this.eventFilter.search || e.title.toLowerCase().includes(this.eventFilter.search.toLowerCase());
                        const matchCat = this.eventFilter.category === 'all' || e.category === this.eventFilter.category;
                        let matchMonth = true;
                        if (this.eventFilter.month !== 'all') {
                            const ym = `2026-${String(parseInt(this.eventFilter.month) + 1).padStart(2, '0')}`;
                            matchMonth = e.date.startsWith(ym);
                        }
                        return matchSearch && matchCat && matchMonth;
                    });
                },

                resetEventFilters() {
                    this.eventFilter = { search: '', category: 'all', month: 'all' };
                },
'@

$newFilteredEvents = @'
                filteredEventsList() {
                    return this.events.filter(e => {
                        const matchSearch = !this.eventFilter.search || e.title.toLowerCase().includes(this.eventFilter.search.toLowerCase());
                        const matchCat = this.eventFilter.category === 'all' || e.category === this.eventFilter.category;
                        let matchMonth = true;
                        if (this.eventFilter.month !== 'all') {
                            const ym = `2026-${String(parseInt(this.eventFilter.month) + 1).padStart(2, '0')}`;
                            matchMonth = e.date.startsWith(ym);
                        }
                        return matchSearch && matchCat && matchMonth;
                    });
                },

                totalEventPages() {
                    const list = this.filteredEventsList();
                    return Math.max(1, Math.ceil(list.length / this.eventPerPage));
                },

                paginatedEventsList() {
                    const list = this.filteredEventsList();
                    const total = this.totalEventPages();
                    if (this.eventCurrentPage > total) this.eventCurrentPage = total;
                    if (this.eventCurrentPage < 1) this.eventCurrentPage = 1;
                    const start = (this.eventCurrentPage - 1) * this.eventPerPage;
                    return list.slice(start, start + this.eventPerPage);
                },

                goToEventPage(p) {
                    const total = this.totalEventPages();
                    if (p >= 1 && p <= total) {
                        this.eventCurrentPage = p;
                    }
                },

                getEventPaginationRange() {
                    const total = this.totalEventPages();
                    const current = this.eventCurrentPage;
                    if (total <= 7) {
                        const pages = [];
                        for (let i = 1; i <= total; i++) pages.push(i);
                        return pages;
                    }
                    const pages = [1];
                    if (current > 3) pages.push('...');
                    const start = Math.max(2, current - 1);
                    const end = Math.min(total - 1, current + 1);
                    for (let i = start; i <= end; i++) pages.push(i);
                    if (current < total - 2) pages.push('...');
                    pages.push(total);
                    return pages;
                },

                resetEventFilters() {
                    this.eventFilter = { search: '', category: 'all', month: 'all' };
                    this.eventCurrentPage = 1;
                },
'@

$content = $content.Replace($oldFilteredEvents, $newFilteredEvents)

# 3. Update Present Event template:
# a. Add @input / @change on filter inputs to reset page to 1
$oldSearchInput = '<input type="text" x-model="eventFilter.search" placeholder="Cari judul agenda atau materi..."'
$newSearchInput = '<input type="text" x-model="eventFilter.search" @input="eventCurrentPage = 1" placeholder="Cari judul agenda atau materi..."'
$content = $content.Replace($oldSearchInput, $newSearchInput)

$oldCatSelect = '<select x-model="eventFilter.category" class="px-3 py-2 rounded-xl'
$newCatSelect = '<select x-model="eventFilter.category" @change="eventCurrentPage = 1" class="px-3 py-2 rounded-xl'
$content = $content.Replace($oldCatSelect, $newCatSelect)

$oldMonthSelect = '<select x-model="eventFilter.month" class="px-3 py-2 rounded-xl'
$newMonthSelect = '<select x-model="eventFilter.month" @change="eventCurrentPage = 1" class="px-3 py-2 rounded-xl'
$content = $content.Replace($oldMonthSelect, $newMonthSelect)

# b. Update x-for to use paginatedEventsList()
$oldGridXFor = '<template x-for="event in filteredEventsList()" :key="event.id">'
$newGridXFor = '<template x-for="event in paginatedEventsList()" :key="event.id">'
$content = $content.Replace($oldGridXFor, $newGridXFor)

# c. Add Numbered Pagination Bar below the grid
$oldGridEnd = @'
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

$newGridEnd = @'
                    <!-- Event Cards Grid Table (3 Events Per Page) -->
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

                    <!-- Numbered Pagination Bar (3 Events Per Page) -->
                    <div class="p-4 sm:p-5 bg-white dark:bg-[#131D38] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
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

$content = $content.Replace($oldGridEnd, $newGridEnd)

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated Kalender Event / Present Event to display 3 events per page with numbered navigation!"
