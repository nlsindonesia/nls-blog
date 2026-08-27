$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# 1. Inject Rich Color Styles into <style>
$colorStyles = @'
        /* =========================================================================
           VIBRANT FULL-COLOR SUPER ADMIN STYLES & GRADIENTS
           ========================================================================= */
        
        /* Hero Banners */
        .admin-hero-kalender {
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #0f172a 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 14px 35px -8px rgba(2, 132, 199, 0.4);
        }
        .admin-hero-berita {
            background: linear-gradient(135deg, #059669 0%, #047857 60%, #0f172a 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 14px 35px -8px rgba(5, 150, 105, 0.4);
        }
        .admin-hero-pengajar {
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 60%, #0f172a 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 14px 35px -8px rgba(79, 70, 229, 0.4);
        }

        /* 3D Vibrant Stat Cards */
        .stat-card-indigo {
            background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.25s ease;
        }
        .stat-card-indigo:hover { transform: translateY(-3px); }

        .stat-card-sky {
            background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.25s ease;
        }
        .stat-card-sky:hover { transform: translateY(-3px); }

        .stat-card-amber {
            background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 10px 25px -5px rgba(217, 119, 6, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.25s ease;
        }
        .stat-card-amber:hover { transform: translateY(-3px); }

        .stat-card-emerald {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.25s ease;
        }
        .stat-card-emerald:hover { transform: translateY(-3px); }

        .stat-card-purple {
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.25s ease;
        }
        .stat-card-purple:hover { transform: translateY(-3px); }

        .stat-card-rose {
            background: linear-gradient(135deg, #e11d48 0%, #fb7185 100%) !important;
            color: #ffffff !important;
            box-shadow: 0 10px 25px -5px rgba(225, 29, 72, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.25s ease;
        }
        .stat-card-rose:hover { transform: translateY(-3px); }

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

        /* Sidebar Brand Header */
        .admin-sidebar-header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
            border-bottom: 1.5px solid #334155;
        }
        html.dark .admin-sidebar-header {
            background: linear-gradient(135deg, #070d1e 0%, #0f172a 100%) !important;
            border-color: #1e293b;
        }

        /* Colored Navigation Active Pills */
        .nav-pill-kalender {
            background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%) !important;
            color: #0369a1 !important;
            border: 1.5px solid #7dd3fc !important;
            box-shadow: 0 4px 14px rgba(2, 132, 199, 0.2);
        }
        html.dark .nav-pill-kalender {
            background: linear-gradient(135deg, #082f49 0%, #0c4a6e 100%) !important;
            color: #7dd3fc !important;
            border-color: #0284c7 !important;
        }

        .nav-pill-berita {
            background: linear-gradient(135deg, #dcfce7 0%, #a7f3d0 100%) !important;
            color: #065f46 !important;
            border: 1.5px solid #6ee7b7 !important;
            box-shadow: 0 4px 14px rgba(5, 150, 105, 0.2);
        }
        html.dark .nav-pill-berita {
            background: linear-gradient(135deg, #064e3b 0%, #065f46 100%) !important;
            color: #6ee7b7 !important;
            border-color: #059669 !important;
        }

        .nav-pill-pengajar {
            background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%) !important;
            color: #5b21b6 !important;
            border: 1.5px solid #c4b5fd !important;
            box-shadow: 0 4px 14px rgba(124, 58, 237, 0.2);
        }
        html.dark .nav-pill-pengajar {
            background: linear-gradient(135deg, #3b0764 0%, #4c1d95 100%) !important;
            color: #c4b5fd !important;
            border-color: #7c3aed !important;
        }
'@

$content = $content.Replace('</style>', $colorStyles + "`n    </style>")

# 2. Update Sidebar Active Pills
$content = $content.Replace(":class=`"activeTab === 'kalender' ? 'bg-sky-50 text-sky-800 dark:bg-sky-950/80 dark:text-sky-200 font-black border border-sky-200 dark:border-sky-800 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'`"", ":class=`"activeTab === 'kalender' ? 'nav-pill-kalender font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'`"")
$content = $content.Replace(":class=`"activeTab === 'berita' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 font-black border border-emerald-200 dark:border-emerald-800 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'`"", ":class=`"activeTab === 'berita' ? 'nav-pill-berita font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'`"")
$content = $content.Replace(":class=`"activeTab === 'pengajar' ? 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-200 font-black border border-indigo-200 dark:border-indigo-800 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'`"", ":class=`"activeTab === 'pengajar' ? 'nav-pill-pengajar font-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'`"")

# 3. Add Top Aura Line below Right Header
$content = $content.Replace('</header>', '</header>' + "`n            <div class=`"w-full h-1 bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-600 shrink-0`"></div>")

# 4. Update Kalender Tab Hero & Stat Cards
$content = $content.Replace('<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#131D38] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">', '<div class="admin-hero-kalender flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-sky-400/30">')
$content = $content.Replace('<p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">', '<p class="text-xs sm:text-sm text-sky-100 mt-1">')

# Kalender 6 Stat Cards
$oldKalenderStats = @'
                    <!-- Statistics Chips -->
                    <div class="admin-grid-6">
                        <div class="p-4 rounded-2xl bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800">
                            <p class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Total Agenda</p>
                            <h4 class="text-2xl font-black text-slate-900 dark:text-white mt-1" x-text="events.length"></h4>
                        </div>
                        <div class="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                            <p class="text-[11px] font-bold text-sky-700 dark:text-sky-300 uppercase">OSN (Biru)</p>
                            <h4 class="text-2xl font-black text-sky-800 dark:text-sky-200 mt-1" x-text="countEventsByCat('OSN')"></h4>
                        </div>
                        <div class="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                            <p class="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase">TKA (Kuning)</p>
                            <h4 class="text-2xl font-black text-amber-800 dark:text-amber-200 mt-1" x-text="countEventsByCat('TKA')"></h4>
                        </div>
                        <div class="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                            <p class="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">SNBT (Hijau)</p>
                            <h4 class="text-2xl font-black text-emerald-800 dark:text-emerald-200 mt-1" x-text="countEventsByCat('SNBT')"></h4>
                        </div>
                        <div class="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                            <p class="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase">Mitra (Ungu)</p>
                            <h4 class="text-2xl font-black text-purple-800 dark:text-purple-200 mt-1" x-text="countEventsByCat('Mitra Sekolah')"></h4>
                        </div>
                        <div class="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                            <p class="text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase">Dinas (Merah)</p>
                            <h4 class="text-2xl font-black text-rose-800 dark:text-rose-200 mt-1" x-text="countEventsByCat('Event Dinas')"></h4>
                        </div>
                    </div>
'@

$newKalenderStats = @'
                    <!-- Vibrant 6 Stat Cards -->
                    <div class="admin-grid-6">
                        <div class="stat-card-indigo p-4 rounded-2xl flex flex-col justify-between">
                            <p class="text-[10px] font-black uppercase tracking-wider text-indigo-100">Total Agenda</p>
                            <div class="flex items-baseline justify-between mt-2">
                                <h4 class="text-2xl font-black text-white" x-text="events.length"></h4>
                                <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">Event</span>
                            </div>
                        </div>
                        <div class="stat-card-sky p-4 rounded-2xl flex flex-col justify-between">
                            <p class="text-[10px] font-black uppercase tracking-wider text-sky-100">OSN (Biru)</p>
                            <div class="flex items-baseline justify-between mt-2">
                                <h4 class="text-2xl font-black text-white" x-text="countEventsByCat('OSN')"></h4>
                                <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">Olimpiade</span>
                            </div>
                        </div>
                        <div class="stat-card-amber p-4 rounded-2xl flex flex-col justify-between">
                            <p class="text-[10px] font-black uppercase tracking-wider text-amber-100">TKA (Kuning)</p>
                            <div class="flex items-baseline justify-between mt-2">
                                <h4 class="text-2xl font-black text-white" x-text="countEventsByCat('TKA')"></h4>
                                <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">Akademik</span>
                            </div>
                        </div>
                        <div class="stat-card-emerald p-4 rounded-2xl flex flex-col justify-between">
                            <p class="text-[10px] font-black uppercase tracking-wider text-emerald-100">SNBT (Hijau)</p>
                            <div class="flex items-baseline justify-between mt-2">
                                <h4 class="text-2xl font-black text-white" x-text="countEventsByCat('SNBT')"></h4>
                                <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">Masuk PTN</span>
                            </div>
                        </div>
                        <div class="stat-card-purple p-4 rounded-2xl flex flex-col justify-between">
                            <p class="text-[10px] font-black uppercase tracking-wider text-purple-100">Mitra (Ungu)</p>
                            <div class="flex items-baseline justify-between mt-2">
                                <h4 class="text-2xl font-black text-white" x-text="countEventsByCat('Mitra Sekolah')"></h4>
                                <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">Sekolah</span>
                            </div>
                        </div>
                        <div class="stat-card-rose p-4 rounded-2xl flex flex-col justify-between">
                            <p class="text-[10px] font-black uppercase tracking-wider text-rose-100">Dinas (Merah)</p>
                            <div class="flex items-baseline justify-between mt-2">
                                <h4 class="text-2xl font-black text-white" x-text="countEventsByCat('Event Dinas')"></h4>
                                <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">Diknas</span>
                            </div>
                        </div>
                    </div>
'@

$content = $content.Replace($oldKalenderStats, $newKalenderStats)

# 5. Update Themed Event Card Loop in Kalender Tab
$content = $content.Replace('<div class="p-5 rounded-2xl bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden">', '<div class="p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 relative overflow-hidden" :class="getEventAdminCardClass(event.category)">')

# 6. Update Berita Tab Hero & Stat Cards
$oldBeritaHero = '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#131D38] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">'
$newBeritaHero = '<div class="admin-hero-berita flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-emerald-400/30">'
$content = $content.Replace($oldBeritaHero, $newBeritaHero)

$oldBeritaStats = @'
                        <!-- Statistics -->
                        <div class="admin-grid-4">
                            <div class="p-4 rounded-2xl bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800">
                                <p class="text-[11px] font-bold text-slate-500 uppercase">Total Artikel</p>
                                <h4 class="text-2xl font-black text-slate-900 dark:text-white mt-1" x-text="articles.length"></h4>
                            </div>
                            <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                                <p class="text-[11px] font-bold text-emerald-700 uppercase">Diterbitkan</p>
                                <h4 class="text-2xl font-black text-emerald-800 dark:text-emerald-200 mt-1" x-text="articles.filter(a => a.status === 'published').length"></h4>
                            </div>
                            <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                                <p class="text-[11px] font-bold text-amber-700 uppercase">Draf / Konsep</p>
                                <h4 class="text-2xl font-black text-amber-800 dark:text-amber-200 mt-1" x-text="articles.filter(a => a.status === 'draft').length"></h4>
                            </div>
                            <div class="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                                <p class="text-[11px] font-bold text-sky-700 uppercase">Skor SEO Bagus (&gt;80)</p>
                                <h4 class="text-2xl font-black text-sky-800 dark:text-sky-200 mt-1" x-text="articles.filter(a => (a.seoScore || 0) >= 80).length"></h4>
                            </div>
                        </div>
'@

$newBeritaStats = @'
                        <!-- Vibrant 4 Stat Cards for Berita CMS -->
                        <div class="admin-grid-4">
                            <div class="stat-card-purple p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                                <p class="text-[10px] font-black uppercase tracking-wider text-purple-100">Total Artikel</p>
                                <div class="flex items-baseline justify-between mt-2">
                                    <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="articles.length"></h4>
                                    <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Konten</span>
                                </div>
                            </div>
                            <div class="stat-card-emerald p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                                <p class="text-[10px] font-black uppercase tracking-wider text-emerald-100">Diterbitkan Live</p>
                                <div class="flex items-baseline justify-between mt-2">
                                    <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="articles.filter(a => a.status === 'published').length"></h4>
                                    <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Live</span>
                                </div>
                            </div>
                            <div class="stat-card-amber p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                                <p class="text-[10px] font-black uppercase tracking-wider text-amber-100">Draf / Konsep</p>
                                <div class="flex items-baseline justify-between mt-2">
                                    <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="articles.filter(a => a.status === 'draft').length"></h4>
                                    <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Pending</span>
                                </div>
                            </div>
                            <div class="stat-card-sky p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                                <p class="text-[10px] font-black uppercase tracking-wider text-sky-100">Skor SEO Bagus (&gt;80)</p>
                                <div class="flex items-baseline justify-between mt-2">
                                    <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="articles.filter(a => (a.seoScore || 0) >= 80).length"></h4>
                                    <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Optimal</span>
                                </div>
                            </div>
                        </div>
'@

$content = $content.Replace($oldBeritaStats, $newBeritaStats)

# 7. Update Pengajar Tab Hero & Stat Cards
$oldPengajarHero = '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#131D38] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">'
$newPengajarHero = '<div class="admin-hero-pengajar flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-indigo-400/30">'
$content = $content.Replace($oldPengajarHero, $newPengajarHero)

$oldPengajarStats = @'
                    <!-- Statistics Chips -->
                    <div class="admin-grid-4">
                        <div class="p-4 rounded-2xl bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800">
                            <p class="text-[11px] font-bold text-slate-500 uppercase">Total Pengajar</p>
                            <h4 class="text-2xl font-black text-slate-900 dark:text-white mt-1" x-text="teachers.length"></h4>
                        </div>
                        <div class="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                            <p class="text-[11px] font-bold text-sky-700 uppercase">Spesialis OSN</p>
                            <h4 class="text-2xl font-black text-sky-800 dark:text-sky-200 mt-1" x-text="teachers.filter(t => t.categories && t.categories.includes('OSN')).length"></h4>
                        </div>
                        <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                            <p class="text-[11px] font-bold text-emerald-700 uppercase">Spesialis SNBT</p>
                            <h4 class="text-2xl font-black text-emerald-800 dark:text-emerald-200 mt-1" x-text="teachers.filter(t => t.categories && t.categories.includes('SNBT')).length"></h4>
                        </div>
                        <div class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                            <p class="text-[11px] font-bold text-amber-700 uppercase">Spesialis TKA</p>
                            <h4 class="text-2xl font-black text-amber-800 dark:text-amber-200 mt-1" x-text="teachers.filter(t => t.categories && t.categories.includes('TKA')).length"></h4>
                        </div>
                    </div>
'@

$newPengajarStats = @'
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
'@

$content = $content.Replace($oldPengajarStats, $newPengajarStats)

# 8. Add getEventAdminCardClass helper method to Alpine
$oldHelperPattern = 'getEventCategoryBadge\(cat\) \{'
$newHelper = @'
getEventAdminCardClass(cat) {
                    switch (cat) {
                        case 'OSN': return 'admin-card-osn';
                        case 'TKA': return 'admin-card-tka';
                        case 'SNBT': return 'admin-card-snbt';
                        case 'Mitra Sekolah': return 'admin-card-mitra';
                        case 'Event Dinas': return 'admin-card-dinas';
                        default: return 'admin-card-osn';
                    }
                },

                getEventCategoryBadge(cat) {
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldHelperPattern, $newHelper)

[System.IO.File]::WriteAllText($adminPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Applied vibrant full-color styles and hero gradients across /nlsadmin!"
