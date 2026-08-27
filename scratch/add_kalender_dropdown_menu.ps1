$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Update Sidebar Kalender Menu to Dropdown with Create Event & Present Event
$oldKalenderSidebarBtn = @'
                    <!-- Menu 1: Kalender & Event -->
                    <button type="button" @click="activeTab = 'kalender'; if(isMobile) isSidebarOpen = false"
                        :class="activeTab === 'kalender' ? 'nav-pill-kalender font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'"
                        class="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all cursor-pointer text-left group">
                        <div class="flex items-center gap-3">
                            <span class="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                                :class="activeTab === 'kalender' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-sky-500 group-hover:text-white'">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </span>
                            <span class="truncate">Kalender Event</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200"
                            x-text="events.length"></span>
                    </button>
'@

$newKalenderSidebarDropdown = @'
                    <!-- Menu 1: Kalender Event with Expandable Submenu Dropdown -->
                    <div class="space-y-1">
                        <button type="button" @click="toggleKalenderDropdown()"
                            :class="activeTab === 'kalender' ? 'nav-pill-kalender font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'"
                            class="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all cursor-pointer text-left group">
                            <div class="flex items-center gap-3">
                                <span class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-colors"
                                    :class="activeTab === 'kalender' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-sky-500 group-hover:text-white'">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </span>
                                <span class="truncate">Kalender Event</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200"
                                    x-text="events.length"></span>
                                <svg class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                                    :class="isKalenderDropdownOpen ? 'rotate-180 text-sky-600' : ''"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </button>

                        <!-- Dropdown Submenu: Create Event & Present Event -->
                        <div x-show="isKalenderDropdownOpen" x-cloak class="pl-4 pt-1 space-y-1">
                            <!-- Submenu 1: Create Event -->
                            <button type="button" @click="openCreateEventView()"
                                :class="activeTab === 'kalender' && kalenderView === 'create' ? 'bg-sky-500 text-white font-black shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-slate-800 font-bold'"
                                class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
                                <span>Create Event</span>
                            </button>

                            <!-- Submenu 2: Present Event -->
                            <button type="button" @click="openPresentEventView()"
                                :class="activeTab === 'kalender' && kalenderView === 'present' ? 'bg-sky-500 text-white font-black shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-slate-800 font-bold'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                                    <span class="truncate">Present Event</span>
                                </div>
                                <span class="text-[10px] font-black"
                                    :class="activeTab === 'kalender' && kalenderView === 'present' ? 'text-white' : 'text-slate-400'"
                                    x-text="events.length"></span>
                            </button>
                        </div>
                    </div>
'@

$content = $content.Replace($oldKalenderSidebarBtn, $newKalenderSidebarDropdown)

# 2. Update Breadcrumb in Header
$oldBreadcrumb = 'x-text="activeTab === ''kalender'' ? ''Kalender Event NLS'' : (activeTab === ''berita'' ? ''Berita & Artikel CMS'' : ''Direktori Pengajar'')"'
$newBreadcrumb = 'x-text="activeTab === ''kalender'' ? (kalenderView === ''create'' ? ''Kalender Event / Create Event'' : ''Kalender Event / Present Event'') : (activeTab === ''berita'' ? ''Berita & Artikel CMS'' : ''Direktori Pengajar'')"'
$content = $content.Replace($oldBreadcrumb, $newBreadcrumb)

# 3. Overhaul Tab 1 to support both Create Event View and Present Event View
$oldTab1Start = '<div x-show="activeTab === ''kalender''" x-cloak class="space-y-6">'

$newTab1Content = @'
                <div x-show="activeTab === ''kalender''" x-cloak class="space-y-6">
                    
                    <!-- =================================================================
                         VIEW 1: CREATE / EDIT EVENT BUILDER VIEW
                         ================================================================= -->
                    <div x-show="kalenderView === ''create''" class="space-y-6">
                        <!-- Action Bar -->
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#131D38] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                            <button type="button" @click="openPresentEventView()"
                                class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-sky-600 transition-colors cursor-pointer">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                <span>Kembali ke Present Event (Daftar Event)</span>
                            </button>

                            <div class="flex items-center gap-2">
                                <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                                    :class="eventForm.isEdit ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'"
                                    x-text="eventForm.isEdit ? 'Mode: Revisi Agenda' : 'Mode: Create Event Baru'"></span>
                            </div>
                        </div>

                        <!-- 2-Column Responsive Layout: Left Form Inputs, Right Live Card Preview -->
                        <div class="art-editor-container">
                            <!-- Left: Event Builder Form -->
                            <div class="bg-white dark:bg-[#131D38] p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                                <div class="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                                    <span class="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center text-lg shadow-sm">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </span>
                                    <div>
                                        <h3 class="text-base font-black text-slate-900 dark:text-white" x-text="eventForm.isEdit ? 'Revisi Parameter Agenda Event' : 'Buat Agenda Event Kalender Baru'"></h3>
                                        <p class="text-xs text-slate-500">Lengkapi informasi jadwal &amp; kegiatan kalender publik.</p>
                                    </div>
                                </div>

                                <form @submit.prevent="saveEventFromBuilder()" class="space-y-4 text-xs font-semibold">
                                    <div>
                                        <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Judul Agenda Kegiatan *</label>
                                        <input type="text" x-model="eventForm.title" required placeholder="Contoh: Try Out Akbar Nasional OSN Matematika 2026"
                                            class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-black focus:outline-none focus:ring-2 focus:ring-sky-500">
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Kategori Event *</label>
                                            <select x-model="eventForm.category" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold">
                                                <option value="OSN">OSN (Biru - Olimpiade Sains)</option>
                                                <option value="TKA">TKA (Kuning - Tes Kemampuan Akademik)</option>
                                                <option value="SNBT">SNBT (Hijau - Masuk PTN / UTBK)</option>
                                                <option value="Mitra Sekolah">Mitra Sekolah (Ungu - Kerjasama)</option>
                                                <option value="Event Dinas">Event Dinas (Merah - Diknas)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Jenjang Sasaran *</label>
                                            <select x-model="eventForm.jenjang" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold">
                                                <option value="SD">SD / MI</option>
                                                <option value="SMP">SMP / MTs</option>
                                                <option value="SMA">SMA / MA / SMK</option>
                                                <option value="Guru / Instansi">Guru / Instansi</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="art-meta-row">
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Tanggal Kegiatan *</label>
                                            <input type="date" x-model="eventForm.date" required
                                                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold">
                                        </div>
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Waktu / Jam *</label>
                                            <input type="text" x-model="eventForm.time" required placeholder="08:00 - 11:30 WIB"
                                                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
                                        </div>
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Mode Pelaksanaan *</label>
                                            <input type="text" x-model="eventForm.mode" required placeholder="Online (CBT NLS)"
                                                class="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Lokasi / Platform</label>
                                        <input type="text" x-model="eventForm.location" placeholder="Platform CBT Next Level Study / Zoom Meeting"
                                            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Deskripsi Ringkasan Kegiatan</label>
                                        <textarea x-model="eventForm.description" rows="3" placeholder="Jelaskan ringkasan materi, sasaran target siswa, atau tujuan pelaksanaan kegiatan..."
                                            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"></textarea>
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Fasilitas &amp; Materi Unggulan (Pisahkan tiap baris)</label>
                                        <textarea x-model="eventForm.highlightsRaw" rows="3" placeholder="Sistem Penilaian IRT Standar Nasional&#10;Webinar Live Pembahasan Soal &amp; Bedah Trik&#10;E-Sertifikat Resmi &amp; Analisis Rapor Nilai"
                                            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"></textarea>
                                    </div>

                                    <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                                        <button type="button" @click="openPresentEventView()"
                                            class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer transition-all">
                                            Batal
                                        </button>
                                        <button type="submit"
                                            style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important;"
                                            class="px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-sky-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-white">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                            <span x-text="eventForm.isEdit ? 'Simpan Perubahan Agenda' : 'Publikasikan ke Kalender Publik'"></span>
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Right: Live Realtime Card Preview -->
                            <div class="space-y-4">
                                <div class="bg-white dark:bg-[#131D38] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                    <div class="flex items-center justify-between">
                                        <h4 class="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">Live Card Preview (/kalender)</h4>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200">Realtime Preview</span>
                                    </div>

                                    <!-- Themed Preview Card -->
                                    <div class="p-5 rounded-2xl shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                                        :class="getEventAdminCardClass(eventForm.category)">
                                        <!-- Left Category Stripe -->
                                        <div class="absolute left-0 top-0 bottom-0 w-2" :class="getCategoryStripe(eventForm.category)"></div>

                                        <div class="pl-2 space-y-3">
                                            <div class="flex items-center justify-between gap-1.5 flex-wrap">
                                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                                                    :class="getEventCategoryBadge(eventForm.category)"
                                                    x-text="eventForm.category"></span>
                                                <span class="text-xs font-bold text-slate-600" x-text="eventForm.date || '2026-08-15'"></span>
                                            </div>

                                            <h4 class="text-base font-black text-slate-900 dark:text-white leading-snug"
                                                x-text="eventForm.title || 'Judul Agenda Event'"></h4>

                                            <div class="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                                <div class="flex items-center gap-1.5 font-semibold">
                                                    <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    <span x-text="eventForm.time || '08:00 - 11:30 WIB'"></span>
                                                </div>
                                                <div class="flex items-center gap-1.5 font-semibold">
                                                    <svg class="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                    <span x-text="(eventForm.mode || 'Online') + ' • ' + (eventForm.location || 'Platform CBT NLS')"></span>
                                                </div>
                                            </div>

                                            <p class="text-xs text-slate-600 line-clamp-3" x-text="eventForm.description || 'Deskripsi kegiatan akan ditampilkan di sini...'"></p>

                                            <!-- Highlights Preview -->
                                            <div class="pt-2 space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                                                <template x-for="(hl, hlIdx) in (eventForm.highlightsRaw ? eventForm.highlightsRaw.split('\n').filter(Boolean) : ['Sistem Penilaian IRT', 'Webinar Live Pembahasan'])" :key="hlIdx">
                                                    <div class="flex items-center gap-1.5">
                                                        <span class="text-emerald-500">✓</span>
                                                        <span x-text="hl"></span>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>

                                        <div class="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between pl-2">
                                            <span class="text-[11px] font-bold text-slate-500" x-text="'Jenjang: ' + (eventForm.jenjang || 'SMA')"></span>
                                            <span class="px-3 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white flex items-center gap-1">
                                                <span>WhatsApp Daftar</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- =================================================================
                         VIEW 2: PRESENT EVENT (DAFTAR EVENT YANG SUDAH DIBUAT)
                         ================================================================= -->
                    <div x-show="kalenderView === ''present''" class="space-y-6">
'@

$content = $content.Replace($oldTab1Start, $newTab1Content)

# 4. Close the Present Event View container right before the tab 2 start
$content = $content.Replace('</div>' + "`n`n" + '                <!-- =========================================================================' + "`n" + '                     TAB 2: MANAJEMEN BERITA', '</div>' + "`n`n                    </div>" + "`n`n" + '                <!-- =========================================================================' + "`n" + '                     TAB 2: MANAJEMEN BERITA')

# 5. In Kalender Present Event Header, update the button to switch to Create Event
$oldTambahAgendaBtn = @'
                            <button type="button" @click="openEventModal()"
                                style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important;"
                                class="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-white">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                <span>Tambah Agenda Baru</span>
                            </button>
'@

$newTambahAgendaBtn = @'
                            <button type="button" @click="openCreateEventView()"
                                style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important;"
                                class="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-white">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                <span>Create Event Baru</span>
                            </button>
'@

$content = $content.Replace($oldTambahAgendaBtn, $newTambahAgendaBtn)

# 6. Update Alpine state and methods for Dropdown and Builder
$oldAlpineState = "activeTab: 'kalender', // 'kalender', 'berita', 'pengajar'"
$newAlpineState = @'
activeTab: 'kalender', // 'kalender', 'berita', 'pengajar'
                kalenderView: 'present', // 'present' (default list) or 'create' (create event builder)
                isKalenderDropdownOpen: true,

                eventForm: {
                    id: '',
                    isEdit: false,
                    title: '',
                    category: 'OSN',
                    jenjang: 'SMA',
                    date: '2026-08-15',
                    time: '08:00 - 11:30 WIB',
                    mode: 'Online (CBT NLS)',
                    location: 'Platform CBT Next Level Study',
                    description: '',
                    highlightsRaw: ''
                },
'@

$content = $content.Replace($oldAlpineState, $newAlpineState)

# 7. Add Alpine methods for Kalender Dropdown and Builder
$methodsToInject = @'
                toggleKalenderDropdown() {
                    this.activeTab = 'kalender';
                    this.isKalenderDropdownOpen = !this.isKalenderDropdownOpen;
                },

                openCreateEventView() {
                    this.activeTab = 'kalender';
                    this.kalenderView = 'create';
                    this.isKalenderDropdownOpen = true;
                    this.eventForm = {
                        id: 'evt-' + Date.now(),
                        isEdit: false,
                        title: '',
                        category: 'OSN',
                        jenjang: 'SMA',
                        date: new Date().toISOString().split('T')[0],
                        time: '08:00 - 11:30 WIB',
                        mode: 'Online (CBT NLS)',
                        location: 'Platform CBT Next Level Study',
                        description: '',
                        highlightsRaw: 'Sistem Penilaian IRT Standar Nasional\nWebinar Live Pembahasan Soal & Bedah Trik\nE-Sertifikat Resmi & Analisis Rapor Nilai'
                    };
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                openPresentEventView() {
                    this.activeTab = 'kalender';
                    this.kalenderView = 'present';
                    this.isKalenderDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                saveEventFromBuilder() {
                    const f = this.eventForm;
                    const highlights = f.highlightsRaw ? f.highlightsRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];
                    const eventData = {
                        id: f.id || 'evt-' + Date.now(),
                        title: f.title,
                        category: f.category,
                        jenjang: f.jenjang,
                        jenjangLabel: 'Jenjang ' + f.jenjang,
                        date: f.date,
                        time: f.time,
                        mode: f.mode,
                        location: f.location,
                        description: f.description,
                        badgeText: 'Pendaftaran Dibuka',
                        whatsappMessage: `Halo Next Level Study, saya ingin mendaftar kegiatan: ${f.title} (${f.date})`,
                        highlights: highlights
                    };

                    if (f.isEdit) {
                        const idx = this.events.findIndex(e => e.id === eventData.id);
                        if (idx !== -1) this.events[idx] = eventData;
                    } else {
                        this.events.unshift(eventData);
                    }

                    this.saveEventsToStorage();
                    this.showToast('Agenda berhasil disimpan dan langsung live di /kalender!');
                    this.kalenderView = 'present';
                },
'@

$content = $content.Replace('// KALENDER METHODS', '// KALENDER METHODS' + "`n" + $methodsToInject)

# 8. Update editEvent to switch to Create/Edit builder view
$oldEditEvent = @'
                editEvent(event) {
                    this.eventModal.isEdit = true;
                    this.eventModal.form = {
                        ...event,
                        highlightsRaw: event.highlights ? event.highlights.join('\n') : ''
                    };
                    this.eventModal.isOpen = true;
                },
'@

$newEditEvent = @'
                editEvent(event) {
                    this.activeTab = 'kalender';
                    this.kalenderView = 'create';
                    this.isKalenderDropdownOpen = true;
                    this.eventForm = {
                        ...event,
                        isEdit: true,
                        highlightsRaw: event.highlights ? event.highlights.join('\n') : ''
                    };
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
'@

$content = $content.Replace($oldEditEvent, $newEditEvent)

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Added Kalender Event Dropdown with Create Event and Present Event!"
