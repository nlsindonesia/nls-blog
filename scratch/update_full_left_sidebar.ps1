$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# Replace the layout from <!-- 2. MAIN SUPER ADMIN DASHBOARD --> to </main>
$oldLayoutPattern = '(?s)<!-- ==========================================\s*2\. MAIN SUPER ADMIN DASHBOARD\s*========================================== -->.*?<\/main>\s*<\/div>\s*<\/div>'

$newLayout = @'
<!-- ==========================================
         2. MAIN SUPER ADMIN DASHBOARD
         ========================================== -->
    <div x-show="isAuthenticated" x-cloak class="min-h-screen flex bg-slate-100/70 dark:bg-[#070D1E] antialiased">
        
        <!-- ==========================================
             FULL-HEIGHT LEFT SIDEBAR (COLLAPSIBLE / HIDEABLE)
             ========================================== -->
        <!-- Mobile Overlay Backdrop -->
        <div x-show="isSidebarOpen && isMobile" x-cloak @click="isSidebarOpen = false"
            class="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"></div>

        <aside :class="[
                isSidebarOpen ? 'w-68' : 'w-0 -translate-x-full lg:w-0 lg:translate-x-0',
                isMobile ? 'fixed inset-y-0 left-0 z-50 shadow-2xl' : 'sticky top-0 h-screen'
            ]"
            class="bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between shrink-0 overflow-hidden select-none">
            
            <!-- Top: Brand Header & Hide Sidebar Button -->
            <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <div class="flex items-center gap-3 min-w-0">
                    <img src="/nls-logo-300.png" alt="NLS Logo" class="w-9 h-9 rounded-full object-cover shadow-sm shrink-0">
                    <div class="min-w-0">
                        <h2 class="text-sm font-black text-slate-900 dark:text-white tracking-tight truncate leading-none">Next Level Study</h2>
                        <span class="inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-2xs mt-1">
                            Super Admin
                        </span>
                    </div>
                </div>
                
                <!-- Sembunyikan / Hide Button Inside Sidebar -->
                <button type="button" @click="isSidebarOpen = false"
                    class="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                    title="Sembunyikan Menu Sidebar">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                </button>
            </div>

            <!-- Middle: Menu Navigation -->
            <div class="p-3.5 flex-1 overflow-y-auto admin-scrollbar space-y-4">
                
                <div class="px-2 pt-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    MODUL MANAJEMEN
                </div>

                <nav class="space-y-1.5">
                    <!-- Menu 1: Kalender & Event -->
                    <button type="button" @click="activeTab = 'kalender'; if(isMobile) isSidebarOpen = false"
                        :class="activeTab === 'kalender' ? 'bg-sky-50 text-sky-800 dark:bg-sky-950/80 dark:text-sky-200 font-black border border-sky-200 dark:border-sky-800 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'"
                        class="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all cursor-pointer text-left group">
                        <div class="flex items-center gap-3">
                            <span class="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                                :class="activeTab === 'kalender' ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 group-hover:bg-sky-500 group-hover:text-white'">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </span>
                            <span class="truncate">Kalender Event</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200"
                            x-text="events.length"></span>
                    </button>

                    <!-- Menu 2: Berita & Artikel CMS -->
                    <button type="button" @click="activeTab = 'berita'; if(isMobile) isSidebarOpen = false"
                        :class="activeTab === 'berita' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 font-black border border-emerald-200 dark:border-emerald-800 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'"
                        class="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all cursor-pointer text-left group">
                        <div class="flex items-center gap-3">
                            <span class="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                                :class="activeTab === 'berita' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 group-hover:bg-emerald-500 group-hover:text-white'">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                            </span>
                            <span class="truncate">Berita &amp; Artikel</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                            x-text="articles.length"></span>
                    </button>

                    <!-- Menu 3: Daftar Pengajar & Tutor -->
                    <button type="button" @click="activeTab = 'pengajar'; if(isMobile) isSidebarOpen = false"
                        :class="activeTab === 'pengajar' ? 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-200 font-black border border-indigo-200 dark:border-indigo-800 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'"
                        class="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs transition-all cursor-pointer text-left group">
                        <div class="flex items-center gap-3">
                            <span class="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                                :class="activeTab === 'pengajar' ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 group-hover:bg-indigo-500 group-hover:text-white'">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </span>
                            <span class="truncate">Daftar Pengajar</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                            x-text="teachers.length"></span>
                    </button>
                </nav>

                <!-- Quick Public Links -->
                <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                    <div class="px-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        PINTASAN PUBLIK
                    </div>
                    <a href="/kalender" target="_blank" class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            <span>Halaman /kalender</span>
                        </span>
                    </a>
                    <a href="/pengajar" target="_blank" class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            <span>Halaman /pengajar</span>
                        </span>
                    </a>
                    <a href="/blog" target="_blank" class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            <span>Halaman /blog</span>
                        </span>
                    </a>
                </div>

                <!-- Sync Status Box -->
                <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <div class="flex items-center justify-between font-black text-slate-700 dark:text-slate-300">
                        <span>Status Sinkronisasi</span>
                        <span class="flex h-2 w-2 relative">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                    </div>
                    <p class="text-[10px] leading-relaxed">Perubahan data langsung live pada seluruh halaman website.</p>
                </div>
            </div>

            <!-- Bottom: User Profile & Logout -->
            <div class="p-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
                <div class="flex items-center gap-2.5 min-w-0">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                        SA
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs font-black text-slate-800 dark:text-slate-200 truncate">nlsindonesia</p>
                        <p class="text-[10px] font-bold text-sky-600 dark:text-sky-400">Super Admin</p>
                    </div>
                </div>
                <button type="button" @click="logout()"
                    class="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:text-rose-400 transition-all cursor-pointer shrink-0"
                    title="Keluar / Logout">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
            </div>
        </aside>

        <!-- ==========================================
             RIGHT MAIN CONTENT AREA
             ========================================== -->
        <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            
            <!-- Top App Bar for Right Area -->
            <header class="sticky top-0 z-20 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs shrink-0">
                
                <div class="flex items-center gap-3">
                    <!-- Toggle / Show Sidebar Button -->
                    <button type="button" @click="isSidebarOpen = !isSidebarOpen"
                        class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 text-xs font-bold"
                        :title="isSidebarOpen ? 'Sembunyikan Menu Sidebar' : 'Tampilkan Menu Sidebar'">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        <span class="hidden sm:inline" x-text="isSidebarOpen ? 'Sembunyikan Sidebar' : 'Buka Sidebar'"></span>
                    </button>

                    <!-- Breadcrumb -->
                    <div class="flex items-center gap-2 text-xs font-bold">
                        <span class="text-slate-400">Portal</span>
                        <span class="text-slate-300">/</span>
                        <span class="text-slate-900 dark:text-white"
                            x-text="activeTab === 'kalender' ? 'Kalender Event NLS' : (activeTab === 'berita' ? 'Berita & Artikel CMS' : 'Direktori Pengajar')"></span>
                    </div>
                </div>

                <!-- Right Controls -->
                <div class="flex items-center gap-2.5">
                    <a href="/" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/60 dark:hover:text-sky-300 border border-slate-200 dark:border-slate-700 transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        <span>Lihat Web</span>
                    </a>
                </div>
            </header>

            <!-- Scrolling Main Content Area -->
            <main class="flex-1 overflow-y-auto admin-scrollbar p-4 sm:p-6 lg:p-8 space-y-6">
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldLayoutPattern, $newLayout)

# Also fix the closing tags at the bottom before modal
# In the original file: </main> </div> </div>
# In the new file: </main> </div> </div>

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated nlsadmin/index.html to full-height left sidebar layout!"
