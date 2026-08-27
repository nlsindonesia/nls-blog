$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Add Submenu CSS for Berita (Emerald) and Pengajar (Indigo) into <style>
$extraSubmenuCss = @'
        /* Emerald Submenu for Berita */
        .submenu-berita-active {
            background-color: #ffffff !important;
            color: #064e3b !important;
            border: 2px solid #059669 !important;
            box-shadow: 0 4px 14px rgba(5, 150, 105, 0.22) !important;
            font-weight: 900 !important;
        }
        html.dark .submenu-berita-active {
            background-color: #1e293b !important;
            color: #ffffff !important;
            border: 2px solid #34d399 !important;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45) !important;
        }

        /* Indigo Submenu for Pengajar */
        .submenu-pengajar-active {
            background-color: #ffffff !important;
            color: #3730a3 !important;
            border: 2px solid #4f46e5 !important;
            box-shadow: 0 4px 14px rgba(79, 70, 229, 0.22) !important;
            font-weight: 900 !important;
        }
        html.dark .submenu-pengajar-active {
            background-color: #1e293b !important;
            color: #ffffff !important;
            border: 2px solid #818cf8 !important;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45) !important;
        }
'@

if (-not $content.Contains('.submenu-berita-active')) {
    $content = $content.Replace('</style>', $extraSubmenuCss + "`n    </style>")
}

# 2. Update Sidebar Menus 2 (Berita) and 3 (Pengajar) to Dropdowns
$oldSidebarBeritaAndPengajar = @'
                    <!-- Menu 2: Berita & Artikel CMS -->
                    <button type="button" @click="activeTab = 'berita'; if(isMobile) isSidebarOpen = false"
                        :class="activeTab === 'berita' ? 'nav-pill-berita font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'"
                        class="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all cursor-pointer text-left group">
                        <div class="flex items-center gap-3">
                            <span class="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                                :class="activeTab === 'berita' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-500 group-hover:text-white'">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                            </span>
                            <span class="truncate">Berita &amp; Artikel</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                            x-text="articles.length"></span>
                    </button>

                    <!-- Menu 3: Daftar Pengajar & Tutor -->
                    <button type="button" @click="activeTab = 'pengajar'; if(isMobile) isSidebarOpen = false"
                        :class="activeTab === 'pengajar' ? 'nav-pill-pengajar font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'"
                        class="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all cursor-pointer text-left group">
                        <div class="flex items-center gap-3">
                            <span class="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                                :class="activeTab === 'pengajar' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-500 group-hover:text-white'">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </span>
                            <span class="truncate">Daftar Pengajar</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                            x-text="teachers.length"></span>
                    </button>
'@

$newSidebarBeritaAndPengajar = @'
                    <!-- Menu 2: Berita & Artikel CMS with Expandable Submenu Dropdown -->
                    <div class="space-y-1">
                        <button type="button" @click="toggleBeritaDropdown()"
                            :class="activeTab === 'berita' ? 'nav-pill-berita font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'"
                            class="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all cursor-pointer text-left group">
                            <div class="flex items-center gap-3">
                                <span class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-colors"
                                    :class="activeTab === 'berita' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-500 group-hover:text-white'">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                                </span>
                                <span class="truncate">Berita &amp; Artikel</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                                    x-text="articles.length"></span>
                                <svg class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                                    :class="isBeritaDropdownOpen ? 'rotate-180 text-emerald-600' : ''"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </button>

                        <!-- Dropdown Submenu: Create News & Present News -->
                        <div x-show="isBeritaDropdownOpen" x-cloak class="border-l-2 border-emerald-300 dark:border-emerald-800 ml-4 pl-2.5 pt-1 space-y-1.5">
                            <!-- Submenu 1: Create News -->
                            <button type="button" @click="openCreateNewsView()"
                                :class="activeTab === 'berita' && beritaView === 'create' ? 'submenu-berita-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'berita' && beritaView === 'create' ? 'bg-emerald-600 ring-4 ring-emerald-200 dark:ring-emerald-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Create News</span>
                                </div>
                                <span x-show="activeTab === 'berita' && beritaView === 'create'" class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black tracking-wide">Aktif</span>
                            </button>

                            <!-- Submenu 2: Present News -->
                            <button type="button" @click="openPresentNewsView()"
                                :class="activeTab === 'berita' && beritaView === 'present' ? 'submenu-berita-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'berita' && beritaView === 'present' ? 'bg-emerald-600 ring-4 ring-emerald-200 dark:ring-emerald-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Present News</span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="activeTab === 'berita' && beritaView === 'present' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
                                    x-text="articles.length"></span>
                            </button>
                        </div>
                    </div>

                    <!-- Menu 3: Daftar Pengajar with Expandable Submenu Dropdown -->
                    <div class="space-y-1">
                        <button type="button" @click="togglePengajarDropdown()"
                            :class="activeTab === 'pengajar' ? 'nav-pill-pengajar font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'"
                            class="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all cursor-pointer text-left group">
                            <div class="flex items-center gap-3">
                                <span class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-colors"
                                    :class="activeTab === 'pengajar' ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-500 group-hover:text-white'">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                </span>
                                <span class="truncate">Daftar Pengajar</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                                    x-text="teachers.length"></span>
                                <svg class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                                    :class="isPengajarDropdownOpen ? 'rotate-180 text-indigo-600' : ''"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </button>

                        <!-- Dropdown Submenu: Add Teacher & Present Teacher -->
                        <div x-show="isPengajarDropdownOpen" x-cloak class="border-l-2 border-indigo-300 dark:border-indigo-800 ml-4 pl-2.5 pt-1 space-y-1.5">
                            <!-- Submenu 1: Add Teacher -->
                            <button type="button" @click="openAddTeacherView()"
                                :class="activeTab === 'pengajar' && pengajarView === 'add' ? 'submenu-pengajar-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'pengajar' && pengajarView === 'add' ? 'bg-indigo-600 ring-4 ring-indigo-200 dark:ring-indigo-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Add Teacher</span>
                                </div>
                                <span x-show="activeTab === 'pengajar' && pengajarView === 'add'" class="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-black tracking-wide">Aktif</span>
                            </button>

                            <!-- Submenu 2: Present Teacher -->
                            <button type="button" @click="openPresentTeacherView()"
                                :class="activeTab === 'pengajar' && pengajarView === 'present' ? 'submenu-pengajar-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'pengajar' && pengajarView === 'present' ? 'bg-indigo-600 ring-4 ring-indigo-200 dark:ring-indigo-900/80 scale-110' : 'bg-slate-300 dark:bg-slate-600'"></span>
                                    <span class="truncate">Present Teacher</span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="activeTab === 'pengajar' && pengajarView === 'present' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
                                    x-text="teachers.length"></span>
                            </button>
                        </div>
                    </div>
'@

$content = $content.Replace($oldSidebarBeritaAndPengajar, $newSidebarBeritaAndPengajar)

# 3. Update Breadcrumb in Header for all 3 modules
$oldBreadcrumbPattern = '(?s)<span class="text-slate-900 dark:text-white".*?x-text=".*?".*?<\/span>'
$newBreadcrumb = @'
<span class="text-slate-900 dark:text-white"
                            x-text="activeTab === 'kalender' ? (kalenderView === 'create' ? 'Kalender Event / Create Event' : 'Kalender Event / Present Event') : (activeTab === 'berita' ? (beritaView === 'create' ? 'Berita & Artikel / Create News' : 'Berita & Artikel / Present News') : (pengajarView === 'add' ? 'Daftar Pengajar / Add Teacher' : 'Daftar Pengajar / Present Teacher'))"></span>
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldBreadcrumbPattern, $newBreadcrumb)

# 4. In Berita Tab, connect beritaView with articleEditor.isOpen
$content = $content.Replace('x-show="!articleEditor.isOpen"', 'x-show="beritaView === ''present''"')
$content = $content.Replace('x-show="articleEditor.isOpen"', 'x-show="beritaView === ''create''"')
$content = $content.Replace('@click="openNewArticleEditor()"', '@click="openCreateNewsView()"')
$content = $content.Replace('@click="closeArticleEditor()"', '@click="openPresentNewsView()"')
$content = $content.Replace('<span>Tulis Berita / Artikel Baru</span>', '<span>Create News Baru</span>')
$content = $content.Replace('<span>Kembali ke Daftar Berita</span>', '<span>Kembali ke Present News (Daftar Berita)</span>')

# 5. Overhaul Tab 3 (Daftar Pengajar) to support Add Teacher View and Present Teacher View
$oldTab3Content = @'
                <!-- =========================================================================
                     TAB 3: MANAJEMEN DAFTAR PENGAJAR & TUTOR (SYNC TO /pengajar)
                     ========================================================================= -->
                <div x-show="activeTab === 'pengajar'" x-cloak class="space-y-6">
                    
                    <!-- Header Section -->
                    <div class="admin-hero-kalender flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-sky-400/30">
                        <div>
                            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mb-2 border border-indigo-200 dark:border-indigo-800">
                                <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                <span>Manajemen Direktori Pengajar</span>
                            </div>
                            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Tim Guru &amp; Mentor Ahli NLS</h2>
                            <p class="text-xs sm:text-sm text-sky-100 mt-1">
                                Tambah, revisi profil, keahlian subjek, dan prestasi pengajar yang langsung live di <a href="/pengajar" target="_blank" class="text-sky-600 font-bold hover:underline">/pengajar</a>.
                            </p>
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                            <button type="button" @click="openTeacherModal()"
                                style="background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%) !important; color: #ffffff !important;"
                                class="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-white">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                <span>Tambah Pengajar Baru</span>
                            </button>
                            <button type="button" @click="exportTeachersJSON()"
                                class="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                <span>Ekspor JSON</span>
                            </button>
                        </div>
                    </div>

                    <!-- Vibrant 4 Stat Cards for Pengajar Directory -->
                    <div class="admin-grid-4">
                        <div class="stat-card-indigo p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                            <p class="text-[10px] font-black uppercase tracking-wider text-indigo-100">Total Pengajar</p>
                            <div class="flex items-baseline justify-between mt-2">
                                <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="teachers.length"></h4>
                                <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Mentor</span>
                            </div>
                        </div>
                        <div class="stat-card-sky p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                            <p class="text-[10px] font-black uppercase tracking-wider text-sky-100">Spesialis OSN</p>
                            <div class="flex items-baseline justify-between mt-2">
                                <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="teachers.filter(t => t.categories && t.categories.includes('OSN')).length"></h4>
                                <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Olimpiade</span>
                            </div>
                        </div>
                        <div class="stat-card-emerald p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                            <p class="text-[10px] font-black uppercase tracking-wider text-emerald-100">Spesialis SNBT</p>
                            <div class="flex items-baseline justify-between mt-2">
                                <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="teachers.filter(t => t.categories && t.categories.includes('SNBT')).length"></h4>
                                <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Masuk PTN</span>
                            </div>
                        </div>
                        <div class="stat-card-amber p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                            <p class="text-[10px] font-black uppercase tracking-wider text-amber-100">Spesialis TKA</p>
                            <div class="flex items-baseline justify-between mt-2">
                                <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="teachers.filter(t => t.categories && t.categories.includes('TKA')).length"></h4>
                                <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Akademik</span>
                            </div>
                        </div>
                    </div>

                    <!-- Search & Filter Controls -->
                    <div class="p-4 sm:p-5 bg-white dark:bg-[#131D38] rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                        <div class="relative flex-1">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                            <input type="text" x-model="teacherSearch" placeholder="Cari nama guru, mata pelajaran, atau kampus..."
                                class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>

                        <select x-model="teacherCategoryFilter" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                            <option value="all">Semua Bidang Keahlian</option>
                            <option value="OSN">Spesialis OSN</option>
                            <option value="SNBT">Spesialis SNBT</option>
                            <option value="TKA">Spesialis TKA</option>
                            <option value="Kurikulum Nasional">Kurikulum Nasional</option>
                            <option value="Kurikulum Internasional">Kurikulum Internasional</option>
                        </select>
                    </div>

                    <!-- Teachers Grid Cards -->
                    <div class="admin-grid-3">
                        <template x-for="teacher in filteredTeachersList()" :key="teacher.id">
                            <div class="p-5 rounded-3xl bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                                <div class="space-y-3">
                                    <div class="flex items-start gap-3.5">
                                        <img :src="teacher.photo || '/images/pengajar/mentor-1-math.jpg'" alt="Photo" class="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100">
                                        <div class="min-w-0">
                                            <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug" x-text="teacher.name"></h4>
                                            <p class="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate" x-text="teacher.shortName"></p>
                                            <p class="text-[11px] text-slate-500 truncate" x-text="teacher.education"></p>
                                        </div>
                                    </div>

                                    <!-- Categories -->
                                    <div class="flex flex-wrap gap-1">
                                        <template x-for="(cat, cIdx) in teacher.categories" :key="cIdx">
                                            <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                                x-text="cat"></span>
                                        </template>
                                    </div>

                                    <!-- Subject Details -->
                                    <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                                        <p class="font-bold text-slate-800 dark:text-slate-200 truncate" x-text="teacher.subject"></p>
                                        <p class="text-[11px] text-slate-500 line-clamp-2" x-text="teacher.kebutuhanPrivat"></p>
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span class="text-[11px] font-bold text-slate-400" x-text="teacher.jenjangLabel || (teacher.jenjang && teacher.jenjang.join(', '))"></span>
                                    <div class="flex items-center gap-1">
                                        <button type="button" @click="editTeacher(teacher)"
                                            class="p-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 transition-all cursor-pointer"
                                            title="Edit / Revisi Pengajar">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        <button type="button" @click="duplicateTeacher(teacher)"
                                            class="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-all cursor-pointer"
                                            title="Duplikasi Pengajar">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                                        </button>
                                        <button type="button" @click="deleteTeacher(teacher.id)"
                                            class="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 transition-all cursor-pointer"
                                            title="Hapus Pengajar">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
'@

$newTab3Content = @'
                <!-- =========================================================================
                     TAB 3: MANAJEMEN DAFTAR PENGAJAR & TUTOR (SYNC TO /pengajar)
                     ========================================================================= -->
                <div x-show="activeTab === 'pengajar'" x-cloak class="space-y-6">
                    
                    <!-- =================================================================
                         VIEW 1: ADD / EDIT TEACHER BUILDER VIEW
                         ================================================================= -->
                    <div x-show="pengajarView === 'add'" class="space-y-6">
                        <!-- Action Bar -->
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#131D38] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                            <button type="button" @click="openPresentTeacherView()"
                                class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                <span>Kembali ke Present Teacher (Direktori Guru)</span>
                            </button>

                            <div class="flex items-center gap-2">
                                <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                                    :class="teacherForm.isEdit ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'"
                                    x-text="teacherForm.isEdit ? 'Mode: Revisi Profil Guru' : 'Mode: Add Teacher Baru'"></span>
                            </div>
                        </div>

                        <!-- 2-Column Responsive Layout: Left Form Inputs, Right Live Card Preview -->
                        <div class="art-editor-container">
                            <!-- Left: Teacher Builder Form -->
                            <div class="bg-white dark:bg-[#131D38] p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                                <div class="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                                    <span class="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-lg shadow-sm">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                    </span>
                                    <div>
                                        <h3 class="text-base font-black text-slate-900 dark:text-white" x-text="teacherForm.isEdit ? 'Revisi Profil Pengajar / Tutor' : 'Tambah Profil Pengajar / Mentor Baru'"></h3>
                                        <p class="text-xs text-slate-500">Data akan tersinkronisasi otomatis ke /pengajar.</p>
                                    </div>
                                </div>

                                <form @submit.prevent="saveTeacherFromBuilder()" class="space-y-4 text-xs font-semibold">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Nama Lengkap &amp; Gelar *</label>
                                            <input type="text" x-model="teacherForm.name" required placeholder="Contoh: Raditya Pratama, S.Si."
                                                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold">
                                        </div>
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Nama Panggilan (Short Name) *</label>
                                            <input type="text" x-model="teacherForm.shortName" required placeholder="Contoh: Kak Radit"
                                                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold">
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Foto Profil (URL / Path)</label>
                                            <input type="text" x-model="teacherForm.photo" placeholder="/images/pengajar/mentor-1-math.jpg"
                                                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
                                        </div>
                                        <div>
                                            <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Almamater / Latar Belakang Kampus *</label>
                                            <input type="text" x-model="teacherForm.education" required placeholder="Matematika ITB (Medalis Emas OSN)"
                                                class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Kategori Spesialisasi (Centang yang sesuai) *</label>
                                        <div class="flex flex-wrap gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                            <label class="inline-flex items-center gap-1.5 cursor-pointer">
                                                <input type="checkbox" value="OSN" x-model="teacherForm.categories" class="rounded text-indigo-600">
                                                <span>OSN (Olimpiade)</span>
                                            </label>
                                            <label class="inline-flex items-center gap-1.5 cursor-pointer">
                                                <input type="checkbox" value="SNBT" x-model="teacherForm.categories" class="rounded text-indigo-600">
                                                <span>SNBT (PTN)</span>
                                            </label>
                                            <label class="inline-flex items-center gap-1.5 cursor-pointer">
                                                <input type="checkbox" value="TKA" x-model="teacherForm.categories" class="rounded text-indigo-600">
                                                <span>TKA (Akademik)</span>
                                            </label>
                                            <label class="inline-flex items-center gap-1.5 cursor-pointer">
                                                <input type="checkbox" value="Kurikulum Nasional" x-model="teacherForm.categories" class="rounded text-indigo-600">
                                                <span>Kurikulum Nasional</span>
                                            </label>
                                            <label class="inline-flex items-center gap-1.5 cursor-pointer">
                                                <input type="checkbox" value="Kurikulum Internasional" x-model="teacherForm.categories" class="rounded text-indigo-600">
                                                <span>Kurikulum Internasional (IB/Cambridge)</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Mata Pelajaran Utama *</label>
                                        <input type="text" x-model="teacherForm.subject" required placeholder="Contoh: Matematika Lanjut (OSN, TKA, &amp; IB / Cambridge)"
                                            class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs">
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Kebutuhan Privat yang Dilayani</label>
                                        <textarea x-model="teacherForm.kebutuhanPrivat" rows="2" placeholder="Bimbingan intensif persiapan OSN, ujian sekolah, dan olimpiade..."
                                            class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"></textarea>
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-slate-700 dark:text-slate-300 font-bold">Poin Prestasi &amp; Highlights (Pisahkan tiap baris)</label>
                                        <textarea x-model="teacherForm.highlightsRaw" rows="3" placeholder="Membimbing 20+ peraih medali OSN Nasional&#10;Tutor privat Cambridge A-Level &amp; IB Diploma&#10;Alumni bimbingan lolos ITB, UI, dan UGM"
                                            class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"></textarea>
                                    </div>

                                    <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                                        <button type="button" @click="openPresentTeacherView()"
                                            class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer transition-all">
                                            Batal
                                        </button>
                                        <button type="submit"
                                            style="background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%) !important; color: #ffffff !important;"
                                            class="px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-white">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                            <span x-text="teacherForm.isEdit ? 'Simpan Perubahan Pengajar' : 'Publikasikan ke Direktori Pengajar'"></span>
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <!-- Right: Live Realtime Teacher Card Preview -->
                            <div class="space-y-4">
                                <div class="bg-white dark:bg-[#131D38] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                    <div class="flex items-center justify-between">
                                        <h4 class="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Live Teacher Card Preview (/pengajar)</h4>
                                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200">Realtime Preview</span>
                                    </div>

                                    <!-- Themed Preview Card -->
                                    <div class="p-5 rounded-3xl bg-white dark:bg-[#131D38] border-2 border-indigo-200 dark:border-indigo-800 shadow-md transition-all flex flex-col justify-between space-y-4">
                                        <div class="space-y-3">
                                            <div class="flex items-start gap-3.5">
                                                <img :src="teacherForm.photo || '/images/pengajar/mentor-1-math.jpg'" alt="Photo" class="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400 shrink-0 bg-slate-100 shadow-sm">
                                                <div class="min-w-0">
                                                    <h4 class="text-base font-black text-slate-900 dark:text-white leading-snug" x-text="teacherForm.name || 'Nama Lengkap Guru, S.Si.'"></h4>
                                                    <p class="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate" x-text="teacherForm.shortName || 'Nama Panggilan'"></p>
                                                    <p class="text-[11px] text-slate-500 truncate" x-text="teacherForm.education || 'Almamater Kampus'"></p>
                                                </div>
                                            </div>

                                            <!-- Categories -->
                                            <div class="flex flex-wrap gap-1">
                                                <template x-for="(cat, cIdx) in (teacherForm.categories || ['OSN'])" :key="cIdx">
                                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300"
                                                        x-text="cat"></span>
                                                </template>
                                            </div>

                                            <!-- Subject Details -->
                                            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                                                <p class="font-bold text-slate-800 dark:text-slate-200 truncate" x-text="teacherForm.subject || 'Mata Pelajaran Utama'"></p>
                                                <p class="text-[11px] text-slate-500 line-clamp-2" x-text="teacherForm.kebutuhanPrivat || 'Kebutuhan bimbingan privat yang dilayani...'"></p>
                                            </div>

                                            <!-- Highlights -->
                                            <div class="pt-1 space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                                                <template x-for="(hl, hlIdx) in getPreviewTeacherHighlights()" :key="hlIdx">
                                                    <div class="flex items-center gap-1.5">
                                                        <span class="text-indigo-500 font-bold">✓</span>
                                                        <span x-text="hl"></span>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>

                                        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <span class="text-[11px] font-bold text-slate-400" x-text="teacherForm.jenjangLabel || 'Semua Jenjang'"></span>
                                            <span class="px-3 py-1 rounded-xl text-xs font-black bg-indigo-600 text-white flex items-center gap-1">
                                                <span>Pilih Mentor</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- =================================================================
                         VIEW 2: PRESENT TEACHER (DIREKTORI PENGAJAR AKTIF)
                         ================================================================= -->
                    <div x-show="pengajarView === 'present'" class="space-y-6">
                        <!-- Header Section -->
                        <div class="admin-hero-pengajar flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-indigo-400/30">
                            <div>
                                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 mb-2 border border-indigo-200 dark:border-indigo-800">
                                    <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                    <span>Manajemen Direktori Pengajar</span>
                                </div>
                                <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Tim Guru &amp; Mentor Ahli NLS</h2>
                                <p class="text-xs sm:text-sm text-sky-100 mt-1">
                                    Tambah, revisi profil, keahlian subjek, dan prestasi pengajar yang langsung live di <a href="/pengajar" target="_blank" class="text-sky-600 font-bold hover:underline">/pengajar</a>.
                                </p>
                            </div>

                            <div class="flex flex-wrap items-center gap-2">
                                <button type="button" @click="openAddTeacherView()"
                                    style="background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%) !important; color: #ffffff !important;"
                                    class="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-white">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                    <span>Add Teacher Baru</span>
                                </button>
                                <button type="button" @click="exportTeachersJSON()"
                                    class="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    <span>Ekspor JSON</span>
                                </button>
                            </div>
                        </div>

                        <!-- Vibrant 4 Stat Cards for Pengajar Directory -->
                        <div class="admin-grid-4">
                            <div class="stat-card-indigo p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                                <p class="text-[10px] font-black uppercase tracking-wider text-indigo-100">Total Pengajar</p>
                                <div class="flex items-baseline justify-between mt-2">
                                    <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="teachers.length"></h4>
                                    <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Mentor</span>
                                </div>
                            </div>
                            <div class="stat-card-sky p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                                <p class="text-[10px] font-black uppercase tracking-wider text-sky-100">Spesialis OSN</p>
                                <div class="flex items-baseline justify-between mt-2">
                                    <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="teachers.filter(t => t.categories && t.categories.includes('OSN')).length"></h4>
                                    <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Olimpiade</span>
                                </div>
                            </div>
                            <div class="stat-card-emerald p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                                <p class="text-[10px] font-black uppercase tracking-wider text-emerald-100">Spesialis SNBT</p>
                                <div class="flex items-baseline justify-between mt-2">
                                    <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="teachers.filter(t => t.categories && t.categories.includes('SNBT')).length"></h4>
                                    <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Masuk PTN</span>
                                </div>
                            </div>
                            <div class="stat-card-amber p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                                <p class="text-[10px] font-black uppercase tracking-wider text-amber-100">Spesialis TKA</p>
                                <div class="flex items-baseline justify-between mt-2">
                                    <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="teachers.filter(t => t.categories && t.categories.includes('TKA')).length"></h4>
                                    <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Akademik</span>
                                </div>
                            </div>
                        </div>

                        <!-- Search & Filter Controls -->
                        <div class="p-4 sm:p-5 bg-white dark:bg-[#131D38] rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                            <div class="relative flex-1">
                                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </span>
                                <input type="text" x-model="teacherSearch" placeholder="Cari nama guru, mata pelajaran, atau kampus..."
                                    class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            </div>

                            <select x-model="teacherCategoryFilter" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                                <option value="all">Semua Bidang Keahlian</option>
                                <option value="OSN">Spesialis OSN</option>
                                <option value="SNBT">Spesialis SNBT</option>
                                <option value="TKA">Spesialis TKA</option>
                                <option value="Kurikulum Nasional">Kurikulum Nasional</option>
                                <option value="Kurikulum Internasional">Kurikulum Internasional</option>
                            </select>
                        </div>

                        <!-- Teachers Grid Cards -->
                        <div class="admin-grid-3">
                            <template x-for="teacher in filteredTeachersList()" :key="teacher.id">
                                <div class="p-5 rounded-3xl bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                                    <div class="space-y-3">
                                        <div class="flex items-start gap-3.5">
                                            <img :src="teacher.photo || '/images/pengajar/mentor-1-math.jpg'" alt="Photo" class="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100">
                                            <div class="min-w-0">
                                                <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug" x-text="teacher.name"></h4>
                                                <p class="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate" x-text="teacher.shortName"></p>
                                                <p class="text-[11px] text-slate-500 truncate" x-text="teacher.education"></p>
                                            </div>
                                        </div>

                                        <!-- Categories -->
                                        <div class="flex flex-wrap gap-1">
                                            <template x-for="(cat, cIdx) in teacher.categories" :key="cIdx">
                                                <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                                    x-text="cat"></span>
                                            </template>
                                        </div>

                                        <!-- Subject Details -->
                                        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                                            <p class="font-bold text-slate-800 dark:text-slate-200 truncate" x-text="teacher.subject"></p>
                                            <p class="text-[11px] text-slate-500 line-clamp-2" x-text="teacher.kebutuhanPrivat"></p>
                                        </div>
                                    </div>

                                    <!-- Actions -->
                                    <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <span class="text-[11px] font-bold text-slate-400" x-text="teacher.jenjangLabel || (teacher.jenjang && teacher.jenjang.join(', '))"></span>
                                        <div class="flex items-center gap-1">
                                            <button type="button" @click="editTeacher(teacher)"
                                                class="p-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 transition-all cursor-pointer"
                                                title="Edit / Revisi Pengajar">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                            </button>
                                            <button type="button" @click="duplicateTeacher(teacher)"
                                                class="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-all cursor-pointer"
                                                title="Duplikasi Pengajar">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                                            </button>
                                            <button type="button" @click="deleteTeacher(teacher.id)"
                                                class="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-300 transition-all cursor-pointer"
                                                title="Hapus Pengajar">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
'@

$content = $content.Replace($oldTab3Content, $newTab3Content)

# 6. Update Alpine state and methods for Berita & Pengajar Dropdowns
$oldAlpineKalenderState = "kalenderView: 'present', // 'present' (default list) or 'create' (create event builder)"
$newAlpineFullState = @"
kalenderView: 'present', // 'present' or 'create'
                isKalenderDropdownOpen: true,

                beritaView: 'present', // 'present' or 'create'
                isBeritaDropdownOpen: true,

                pengajarView: 'present', // 'present' or 'add'
                isPengajarDropdownOpen: true,

                teacherForm: {
                    id: '',
                    isEdit: false,
                    name: '',
                    shortName: '',
                    photo: '/images/pengajar/mentor-1-math.jpg',
                    education: '',
                    categories: ['OSN'],
                    jenjang: ['SMA'],
                    jenjangLabel: 'SMA & Alumni',
                    subject: '',
                    kebutuhanPrivat: '',
                    philosophy: '',
                    highlightsRaw: 'Membimbing 20+ peraih medali OSN Nasional\nTutor privat Cambridge A-Level & IB Diploma\nAlumni bimbingan lolos ITB, UI, dan UGM'
                },
"@

$content = $content.Replace($oldAlpineKalenderState, $newAlpineFullState)

# 7. Add Alpine methods for Berita & Pengajar Dropdowns
$extraMethods = @'
                // BERITA DROPDOWN METHODS
                toggleBeritaDropdown() {
                    this.activeTab = 'berita';
                    this.isBeritaDropdownOpen = !this.isBeritaDropdownOpen;
                },

                openCreateNewsView() {
                    this.activeTab = 'berita';
                    this.beritaView = 'create';
                    this.isBeritaDropdownOpen = true;
                    this.articleEditor.isEdit = false;
                    this.articleEditor.form = {
                        id: 'art-' + Date.now(),
                        title: '',
                        slug: '',
                        category: 'SNBT & UTBK',
                        date: new Date().toISOString().split('T')[0],
                        author: 'Tim Akademik NLS',
                        status: 'published',
                        coverImage: '/nls-logo-300.png',
                        focusKeyword: '',
                        metaTitle: '',
                        metaDescription: '',
                        content: '<p>Tulis konten artikel lengkap di sini...</p>',
                        seoScore: 85
                    };
                    this.articleEditor.isOpen = true;
                    this.isHtmlView = false;
                    this.$nextTick(() => {
                        const ed = document.getElementById('editorArea');
                        if (ed) ed.innerHTML = this.articleEditor.form.content;
                    });
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                openPresentNewsView() {
                    this.activeTab = 'berita';
                    this.beritaView = 'present';
                    this.articleEditor.isOpen = false;
                    this.isBeritaDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                // PENGAJAR DROPDOWN METHODS
                togglePengajarDropdown() {
                    this.activeTab = 'pengajar';
                    this.isPengajarDropdownOpen = !this.isPengajarDropdownOpen;
                },

                openAddTeacherView() {
                    this.activeTab = 'pengajar';
                    this.pengajarView = 'add';
                    this.isPengajarDropdownOpen = true;
                    this.teacherForm = {
                        id: 't-' + Date.now(),
                        isEdit: false,
                        name: '',
                        shortName: '',
                        photo: '/images/pengajar/mentor-1-math.jpg',
                        education: '',
                        categories: ['OSN'],
                        jenjang: ['SMA'],
                        jenjangLabel: 'SMA & Alumni',
                        subject: '',
                        kebutuhanPrivat: '',
                        philosophy: '',
                        highlightsRaw: 'Membimbing 20+ peraih medali OSN Nasional\nTutor privat Cambridge A-Level & IB Diploma\nAlumni bimbingan lolos ITB, UI, dan UGM'
                    };
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                openPresentTeacherView() {
                    this.activeTab = 'pengajar';
                    this.pengajarView = 'present';
                    this.isPengajarDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                getPreviewTeacherHighlights() {
                    if (!this.teacherForm || !this.teacherForm.highlightsRaw) {
                        return ['Membimbing 20+ peraih medali OSN Nasional', 'Tutor privat Cambridge A-Level & IB Diploma'];
                    }
                    return this.teacherForm.highlightsRaw.split('\n').map(s => s.trim()).filter(Boolean);
                },

                saveTeacherFromBuilder() {
                    const f = this.teacherForm;
                    const highlights = f.highlightsRaw ? f.highlightsRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];
                    const teacherData = {
                        id: f.id || 't-' + Date.now(),
                        name: f.name,
                        shortName: f.shortName,
                        photo: f.photo || '/images/pengajar/mentor-1-math.jpg',
                        education: f.education,
                        categories: f.categories,
                        jenjang: f.jenjang,
                        jenjangLabel: f.jenjangLabel || (f.jenjang ? f.jenjang.join(', ') : 'Semua Jenjang'),
                        subject: f.subject,
                        subjects: [f.subject],
                        kebutuhanPrivat: f.kebutuhanPrivat,
                        philosophy: f.philosophy || 'Mendidik dengan kejujuran sains dan integritas tinggi.',
                        highlights: highlights
                    };

                    if (f.isEdit) {
                        const idx = this.teachers.findIndex(t => t.id === teacherData.id);
                        if (idx !== -1) this.teachers[idx] = teacherData;
                    } else {
                        this.teachers.unshift(teacherData);
                    }

                    this.saveTeachersToStorage();
                    this.showToast('Data pengajar berhasil disimpan dan langsung live di /pengajar!');
                    this.pengajarView = 'present';
                },
'@

$content = $content.Replace('// BERITA & ARTIKEL CMS METHODS', '// BERITA & ARTIKEL CMS METHODS' + "`n" + $extraMethods)

# 8. Update editArticle and editTeacher to switch to their respective create/add views
$oldEditArticle = @'
                editArticle(art) {
                    this.articleEditor.isEdit = true;
                    this.articleEditor.form = JSON.parse(JSON.stringify(art));
                    this.articleEditor.isOpen = true;
                    this.isHtmlView = false;
                    this.$nextTick(() => {
                        const ed = document.getElementById('editorArea');
                        if (ed) ed.innerHTML = this.articleEditor.form.content || '';
                    });
                },
'@

$newEditArticle = @'
                editArticle(art) {
                    this.activeTab = 'berita';
                    this.beritaView = 'create';
                    this.isBeritaDropdownOpen = true;
                    this.articleEditor.isEdit = true;
                    this.articleEditor.form = JSON.parse(JSON.stringify(art));
                    this.articleEditor.isOpen = true;
                    this.isHtmlView = false;
                    this.$nextTick(() => {
                        const ed = document.getElementById('editorArea');
                        if (ed) ed.innerHTML = this.articleEditor.form.content || '';
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
'@

$content = $content.Replace($oldEditArticle, $newEditArticle)

$oldEditTeacher = @'
                editTeacher(t) {
                    this.teacherModal.isEdit = true;
                    this.teacherModal.form = {
                        ...t,
                        highlightsRaw: t.highlights ? t.highlights.join('\n') : ''
                    };
                    this.teacherModal.isOpen = true;
                },
'@

$newEditTeacher = @'
                editTeacher(t) {
                    this.activeTab = 'pengajar';
                    this.pengajarView = 'add';
                    this.isPengajarDropdownOpen = true;
                    this.teacherForm = {
                        ...t,
                        isEdit: true,
                        highlightsRaw: t.highlights ? t.highlights.join('\n') : ''
                    };
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                },
'@

$content = $content.Replace($oldEditTeacher, $newEditTeacher)

# 9. In saveArticle, switch back to present view
$content = $content.Replace('this.articleEditor.isOpen = false;', 'this.articleEditor.isOpen = false; this.beritaView = ''present'';')

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Overhauled Berita & Pengajar with Create/Add and Present Dropdown views!"
