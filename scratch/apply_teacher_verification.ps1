$filePath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# 1. Update Sidebar with Teacher Verification Submenu
$oldSidebar = @'
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

                            <!-- Submenu 3: Trash Teacher -->
'@

$newSidebar = @'
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

                            <!-- Submenu 3: Teacher Verification (NEW) -->
                            <button type="button" @click="openTeacherVerificationView()"
                                :class="activeTab === 'pengajar' && pengajarView === 'verification' ? 'submenu-pengajar-active' : 'submenu-btn-inactive'"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer text-left group">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full shrink-0 transition-all"
                                        :class="activeTab === 'pengajar' && pengajarView === 'verification' ? 'bg-amber-500 ring-4 ring-amber-200 dark:ring-amber-900/80 scale-110' : 'bg-amber-400 dark:bg-amber-600'"></span>
                                    <span class="truncate flex items-center gap-1.5">
                                        <span>Teacher Verification</span>
                                    </span>
                                </div>
                                <span class="text-[10px] px-2 py-0.5 rounded-full font-black"
                                    :class="pendingTeacherApplicationsCount() > 0 ? 'bg-amber-500 text-white shadow-xs animate-pulse' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
                                    x-text="pendingTeacherApplicationsCount()"></span>
                            </button>

                            <!-- Submenu 4: Trash Teacher -->
'@

if ($content.Contains($oldSidebar)) {
    $content = $content.Replace($oldSidebar, $newSidebar)
    Write-Host "Updated Sidebar Submenu successfully"
} else {
    Write-Host "[ERROR] Could not find oldSidebar block"
}

# 2. Add Teacher Verification View HTML in Main Content Area
$oldMainInsertMarker = @'
                    <!-- =================================================================
                         VIEW 3: TRASH TEACHER (TEMPAT SAMPAH DATA PENGAJAR TERHAPUS)
                         ================================================================= -->
'@

$newVerificationView = @'
                    <!-- =================================================================
                         VIEW: TEACHER VERIFICATION (VERIFIKASI & SELEKSI CALON PENGAJAR NLS)
                         ================================================================= -->
                    <div x-show="pengajarView === 'verification'" class="space-y-6">
                        <!-- Header Bar -->
                        <div class="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                            <div>
                                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white mb-2 border border-white/30 backdrop-blur-xs">
                                    <svg class="w-4 h-4 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    <span>Teacher Verification Queue</span>
                                </div>
                                <h2 class="text-xl sm:text-2xl font-black text-white">Verifikasi Calon Pengajar &amp; Mentor</h2>
                                <p class="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl">
                                    Daftar guru yang mengajukan pendaftaran melalui formulir publik di <a href="/pengajar" target="_blank" class="text-white underline font-bold hover:text-amber-200">/pengajar</a>. Klik <strong>Accept &amp; Terbitkan</strong> untuk langsung memasukkan calon pengajar ke menu <em>Present Teacher</em>.
                                </p>
                            </div>

                            <div class="flex flex-wrap items-center gap-2">
                                <a href="/pengajar" target="_blank"
                                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                    <span>Buka Form di /pengajar</span>
                                </a>
                                <button type="button" @click="addSampleApplicant()"
                                    class="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                    <span>+ Simulasi Pendaftar Baru</span>
                                </button>
                            </div>
                        </div>

                        <!-- 4 Stat Cards for Teacher Verification -->
                        <div class="admin-grid-4">
                            <div class="p-4 sm:p-5 rounded-2xl flex flex-col justify-between" style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%) !important; color: #ffffff !important;">
                                <p class="text-[10px] font-black uppercase tracking-wider text-amber-100">Menunggu Verifikasi (Pending)</p>
                                <div class="flex items-baseline justify-between mt-2">
                                    <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="pendingTeacherApplicationsCount()"></h4>
                                    <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Pelamar</span>
                                </div>
                            </div>
                            <div class="p-4 sm:p-5 rounded-2xl flex flex-col justify-between" style="background: linear-gradient(135deg, #059669 0%, #047857 100%) !important; color: #ffffff !important;">
                                <p class="text-[10px] font-black uppercase tracking-wider text-emerald-100">Disetujui (Accepted)</p>
                                <div class="flex items-baseline justify-between mt-2">
                                    <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="acceptedTeacherApplicationsCount()"></h4>
                                    <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Terbit</span>
                                </div>
                            </div>
                            <div class="p-4 sm:p-5 rounded-2xl flex flex-col justify-between" style="background: linear-gradient(135deg, #e11d48 0%, #be123c 100%) !important; color: #ffffff !important;">
                                <p class="text-[10px] font-black uppercase tracking-wider text-rose-100">Ditolak (Rejected)</p>
                                <div class="flex items-baseline justify-between mt-2">
                                    <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="rejectedTeacherApplicationsCount()"></h4>
                                    <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Berkas</span>
                                </div>
                            </div>
                            <div class="p-4 sm:p-5 rounded-2xl flex flex-col justify-between" style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%) !important; color: #ffffff !important;">
                                <p class="text-[10px] font-black uppercase tracking-wider text-indigo-100">Total Pengajuan Masuk</p>
                                <div class="flex items-baseline justify-between mt-2">
                                    <h4 class="text-2xl sm:text-3xl font-black text-white" x-text="teacherApplications.length"></h4>
                                    <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Total</span>
                                </div>
                            </div>
                        </div>

                        <!-- Filter & Search Controls -->
                        <div class="p-4 sm:p-5 bg-white dark:bg-[#131D38] rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                            <div class="relative flex-1 flex items-center">
                                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-amber-600 dark:text-amber-400 pointer-events-none z-10">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                <input type="text" x-model="teacherAppSearch" placeholder="Cari nama calon guru, WhatsApp, email, mapel, atau kampus..."
                                    style="padding-left: 2.75rem !important;"
                                    class="w-full pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                            </div>

                            <div class="flex items-center gap-2">
                                <select x-model="teacherAppStatusFilter" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                                    <option value="all">Semua Status Pendaftaran</option>
                                    <option value="pending">⏳ Menunggu Review (Pending)</option>
                                    <option value="accepted">✓ Telah Diterima (Accepted)</option>
                                    <option value="rejected">✕ Ditolak (Rejected)</option>
                                </select>

                                <select x-model="teacherAppCategoryFilter" class="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold">
                                    <option value="all">Semua Kategori</option>
                                    <option value="OSN">OSN (Olimpiade)</option>
                                    <option value="SNBT">SNBT (PTN)</option>
                                    <option value="TKA">TKA (Akademik)</option>
                                    <option value="Kurikulum Nasional">Kurikulum Nasional</option>
                                    <option value="Kurikulum Internasional">Kurikulum Internasional</option>
                                </select>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div x-show="filteredTeacherApplicationsList().length === 0" class="text-center py-16 bg-white dark:bg-[#131D38] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
                            <div class="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto text-2xl">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h3 class="text-base font-black text-slate-800 dark:text-slate-200">Tidak Ada Data Pendaftaran Calon Guru</h3>
                            <p class="text-xs text-slate-500 max-w-sm mx-auto">
                                Belum ada formulir pendaftaran yang sesuai dengan filter pencarian saat ini.
                            </p>
                        </div>

                        <!-- Applications Grid Cards -->
                        <div x-show="filteredTeacherApplicationsList().length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <template x-for="app in filteredTeacherApplicationsList()" :key="app.id">
                                <div class="p-6 rounded-3xl bg-white dark:bg-[#131D38] border transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-5"
                                    :class="{
                                        'border-amber-300 dark:border-amber-700/80 ring-1 ring-amber-400/20': app.status === 'pending',
                                        'border-emerald-300 dark:border-emerald-700/80': app.status === 'accepted',
                                        'border-rose-200 dark:border-rose-900/60 opacity-75': app.status === 'rejected'
                                    }">
                                    
                                    <!-- Top Card Header: Status & Submitted Date -->
                                    <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <div class="flex items-center gap-2">
                                            <span x-show="app.status === 'pending'" class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                                                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                                                <span>Menunggu Review</span>
                                            </span>
                                            <span x-show="app.status === 'accepted'" class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                                                <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                                                <span>Diterima (Terbit di Present Teacher)</span>
                                            </span>
                                            <span x-show="app.status === 'rejected'" class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                                                ✕ Ditolak
                                            </span>
                                        </div>
                                        <span class="text-[11px] text-slate-400 font-medium" x-text="formatDisplayDate(app.submittedAt)"></span>
                                    </div>

                                    <!-- Applicant Profile Information -->
                                    <div class="space-y-4">
                                        <div class="flex items-start gap-4">
                                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-500 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                                                <span x-text="app.panggilan ? app.panggilan.substring(0, 2).toUpperCase() : app.nama.substring(0, 2).toUpperCase()"></span>
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <div class="flex items-center gap-2">
                                                    <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight" x-text="app.nama"></h3>
                                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 shrink-0" x-text="app.panggilan || 'Tutor'"></span>
                                                </div>
                                                <p class="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1" x-text="app.pendidikan"></p>
                                                
                                                <!-- Contact Badges -->
                                                <div class="flex flex-wrap items-center gap-2 mt-2">
                                                    <a :href="'https://wa.me/' + (app.wa ? app.wa.replace(/[^0-9]/g, '') : '')" target="_blank"
                                                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition-colors">
                                                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z"/></svg>
                                                        <span x-text="app.wa"></span>
                                                    </a>
                                                    <a :href="'mailto:' + app.email"
                                                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 transition-colors">
                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                        <span x-text="app.email"></span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Categories & Jenjang Pills -->
                                        <div class="flex flex-wrap gap-1.5">
                                            <template x-for="(cat, cIdx) in app.categories" :key="cIdx">
                                                <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                                                    x-text="cat"></span>
                                            </template>
                                            <template x-for="(j, jIdx) in app.jenjang" :key="jIdx">
                                                <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                                    x-text="'Jenjang ' + j"></span>
                                            </template>
                                        </div>

                                        <!-- Subject & Scope -->
                                        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
                                            <div class="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-bold">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                                <span class="font-extrabold text-slate-900 dark:text-white" x-text="app.subject"></span>
                                            </div>
                                            <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed" x-text="app.kebutuhanPrivat || 'Kebutuhan privat tidak dispesifikasikan'"></p>
                                        </div>

                                        <!-- Teaching Philosophy Quote -->
                                        <div x-show="app.philosophy" class="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs italic text-amber-900 dark:text-amber-200">
                                            &ldquo;<span x-text="app.philosophy"></span>&rdquo;
                                        </div>

                                        <!-- Highlights & Prestasi -->
                                        <div class="space-y-1.5 pt-1">
                                            <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Rekam Jejak &amp; Prestasi Terlampir:</p>
                                            <template x-for="(hl, hlIdx) in app.highlights" :key="hlIdx">
                                                <div class="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                                                    <svg class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                    <span x-text="hl"></span>
                                                </div>
                                            </template>
                                        </div>

                                        <!-- CV / Portfolio Link -->
                                        <div x-show="app.portfolio" class="pt-1">
                                            <a :href="app.portfolio.startsWith('http') ? app.portfolio : 'https://' + app.portfolio" target="_blank"
                                                class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                <span>Buka Tautan Portofolio / CV Pelamar</span>
                                            </a>
                                        </div>
                                    </div>

                                    <!-- Actions Footer -->
                                    <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                                        <!-- Actions for PENDING -->
                                        <div x-show="app.status === 'pending'" class="flex flex-wrap items-center gap-2 w-full justify-between">
                                            <div class="flex items-center gap-2">
                                                <button type="button" @click="contactApplicantWA(app)"
                                                    class="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
                                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824z"/></svg>
                                                    <span>Hubungi WA</span>
                                                </button>
                                                <button type="button" @click="rejectTeacherApplication(app)"
                                                    class="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer">
                                                    <span>✕ Tolak</span>
                                                </button>
                                                <button type="button" @click="deleteTeacherApplication(app.id)"
                                                    class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-all cursor-pointer"
                                                    title="Hapus Pengajuan">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>

                                            <button type="button" @click="acceptTeacherApplication(app)"
                                                style="background: linear-gradient(135deg, #059669 0%, #047857 100%) !important; color: #ffffff !important;"
                                                class="px-5 py-2.5 rounded-xl font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-white">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                <span>Accept &amp; Terbitkan</span>
                                            </button>
                                        </div>

                                        <!-- Actions for ACCEPTED -->
                                        <div x-show="app.status === 'accepted'" class="flex items-center justify-between w-full">
                                            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                <span>Telah Terbit di Direktori Pengajar</span>
                                            </span>
                                            <div class="flex items-center gap-2">
                                                <button type="button" @click="openPresentTeacherView()"
                                                    class="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer">
                                                    Lihat di Present Teacher &rarr;
                                                </button>
                                                <button type="button" @click="deleteTeacherApplication(app.id)"
                                                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                                                    title="Hapus dari antrean">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Actions for REJECTED -->
                                        <div x-show="app.status === 'rejected'" class="flex items-center justify-between w-full">
                                            <span class="text-xs font-bold text-rose-600 dark:text-rose-400">Pengajuan Ditolak</span>
                                            <div class="flex items-center gap-2">
                                                <button type="button" @click="restoreApplicationToPending(app)"
                                                    class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer">
                                                    Pulihkan ke Pending
                                                </button>
                                                <button type="button" @click="deleteTeacherApplication(app.id)"
                                                    class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer">
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- =================================================================
                         VIEW 3: TRASH TEACHER (TEMPAT SAMPAH DATA PENGAJAR TERHAPUS)
                         ================================================================= -->
'@

if ($content.Contains($oldMainInsertMarker)) {
    $content = $content.Replace($oldMainInsertMarker, $newVerificationView)
    Write-Host "Inserted Teacher Verification View HTML successfully"
} else {
    Write-Host "[ERROR] Could not find oldMainInsertMarker"
}

# 3. Add teacherApplications state in superAdminApp
$oldTeachersState = @'
                teachers: (function() {
                    try {
                        const stored = localStorage.getItem("nls_pengajar_teachers_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_TEACHERS !== "undefined") ? window.NLS_DEFAULT_TEACHERS : [];
                })(),
'@

$newTeachersAndApplicationsState = @'
                teachers: (function() {
                    try {
                        const stored = localStorage.getItem("nls_pengajar_teachers_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_TEACHERS !== "undefined") ? window.NLS_DEFAULT_TEACHERS : [];
                })(),

                teacherApplications: (function() {
                    try {
                        const stored = localStorage.getItem("nls_teacher_applications_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                        }
                    } catch (e) {}
                    return [
                        {
                            id: 'app-sample-1',
                            submittedAt: '2026-08-27T10:30:00.000Z',
                            status: 'pending',
                            nama: 'Fajar Hidayatullah, M.Sc.',
                            panggilan: 'Kak Fajar',
                            wa: '081234567890',
                            email: 'fajar.hidayat@gmail.com',
                            pendidikan: 'S2 Fisika Teori Universitas Indonesia (Medalis Perak OSN Fisika)',
                            photo: '/images/pengajar/mentor-2-physics.jpg',
                            categories: ['OSN', 'Kurikulum Internasional'],
                            jenjang: ['SMP', 'SMA'],
                            jenjangLabel: 'SMP & SMA',
                            subject: 'Fisika Kuantum & Mekanika Lanjut (OSN & IPhO)',
                            kebutuhanPrivat: 'Bimbingan intensif seleksi OSN Fisika tingkat Kabupaten hingga Nasional, serta persiapan IGCSE & A-Level Physics.',
                            philosophy: 'Memahami fenomena alam melalui logika matematika yang elegan dan eksperimen pemikiran.',
                            highlights: [
                                'Medali Perak OSN Fisika Tingkat Nasional',
                                'Alumni S2 Fisika Universitas Indonesia (Cumlaude)',
                                'Berpengalaman 4+ tahun membimbing 15+ peraih medali OSN-P'
                            ],
                            portfolio: 'https://drive.google.com/file/d/sample-cv-fajar/view',
                            notes: ''
                        },
                        {
                            id: 'app-sample-2',
                            submittedAt: '2026-08-26T15:45:00.000Z',
                            status: 'pending',
                            nama: 'Nabila Azzahra, S.Si.',
                            panggilan: 'Kak Nabila',
                            wa: '085712349876',
                            email: 'nabila.azzahra@ugm.ac.id',
                            pendidikan: 'Kimia Universitas Gadjah Mada (Top 3 LKTI Nasional)',
                            photo: '/images/pengajar/mentor-3-chem.jpg',
                            categories: ['OSN', 'SNBT'],
                            jenjang: ['SMA'],
                            jenjangLabel: 'SMA & Alumni',
                            subject: 'Kimia Organik & Stoikiometri UTBK SNBT',
                            kebutuhanPrivat: 'Pemahaman mendalam reaksi organik, termokimia, dan trik cepat penalaran analitik SNBT.',
                            philosophy: 'Kimia bukan menghafal rumus, melainkan memahami interaksi partikel dan aplikasi nyata.',
                            highlights: [
                                'Juara 1 Lomba Cepat Tepat Kimia Regional Jawa-Bali',
                                'Tutor Kimia UTBK SNBT dengan 92% kelolosan siswa ke PTN Top',
                                'Penulis modul pemantapan stoikiometri intensif'
                            ],
                            portfolio: 'https://linkedin.com/in/nabila-azzahra-chem',
                            notes: ''
                        }
                    ];
                })(),

                teacherAppSearch: '',
                teacherAppStatusFilter: 'all',
                teacherAppCategoryFilter: 'all',
'@

if ($content.Contains($oldTeachersState)) {
    $content = $content.Replace($oldTeachersState, $newTeachersAndApplicationsState)
    Write-Host "Updated State Variables successfully"
} else {
    Write-Host "[ERROR] Could not find oldTeachersState block"
}

# 4. Add JavaScript methods in superAdminApp for Teacher Verification
$oldPengajarMethods = @'
                openTrashTeacherView() {
                    this.activeTab = 'pengajar';
                    this.pengajarView = 'trash';
                    this.isPengajarDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },
'@

$newPengajarMethods = @'
                openTeacherVerificationView() {
                    this.activeTab = 'pengajar';
                    this.pengajarView = 'verification';
                    this.isPengajarDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                openTrashTeacherView() {
                    this.activeTab = 'pengajar';
                    this.pengajarView = 'trash';
                    this.isPengajarDropdownOpen = true;
                    if (this.isMobile) this.isSidebarOpen = false;
                },

                saveTeacherApplicationsToStorage() {
                    try {
                        localStorage.setItem("nls_teacher_applications_v1", JSON.stringify(this.teacherApplications));
                        if (typeof BroadcastChannel !== 'undefined') {
                            const bc = new BroadcastChannel('nls_sync_channel');
                            bc.postMessage({ type: 'TEACHER_APPLICATIONS_UPDATED', data: this.teacherApplications });
                        }
                        window.dispatchEvent(new CustomEvent('nls-teacher-applications-updated', { detail: this.teacherApplications }));
                    } catch (e) {}
                },

                pendingTeacherApplicationsCount() {
                    return this.teacherApplications.filter(a => a.status === 'pending').length;
                },

                acceptedTeacherApplicationsCount() {
                    return this.teacherApplications.filter(a => a.status === 'accepted').length;
                },

                rejectedTeacherApplicationsCount() {
                    return this.teacherApplications.filter(a => a.status === 'rejected').length;
                },

                filteredTeacherApplicationsList() {
                    return this.teacherApplications.filter(app => {
                        const q = (this.teacherAppSearch || '').toLowerCase();
                        const matchSearch = !q || 
                            (app.nama && app.nama.toLowerCase().includes(q)) ||
                            (app.panggilan && app.panggilan.toLowerCase().includes(q)) ||
                            (app.wa && app.wa.toLowerCase().includes(q)) ||
                            (app.email && app.email.toLowerCase().includes(q)) ||
                            (app.subject && app.subject.toLowerCase().includes(q)) ||
                            (app.pendidikan && app.pendidikan.toLowerCase().includes(q));

                        const matchStatus = this.teacherAppStatusFilter === 'all' || app.status === this.teacherAppStatusFilter;

                        let matchCat = true;
                        if (this.teacherAppCategoryFilter !== 'all') {
                            matchCat = app.categories && Array.isArray(app.categories) && app.categories.includes(this.teacherAppCategoryFilter);
                        }

                        return matchSearch && matchStatus && matchCat;
                    });
                },

                acceptTeacherApplication(app) {
                    // 1. Create a new teacher record
                    const newTeacher = {
                        id: 'tchr-' + Date.now(),
                        name: app.nama,
                        shortName: app.panggilan || app.nama.split(' ')[0],
                        photo: app.photo || '/images/pengajar/mentor-1-math.jpg',
                        education: app.pendidikan,
                        categories: app.categories || ['OSN'],
                        jenjang: app.jenjang || ['SMA'],
                        jenjangLabel: app.jenjangLabel || (app.jenjang ? app.jenjang.join(' & ') : 'Semua Jenjang'),
                        subject: app.subject,
                        subjects: [app.subject],
                        kebutuhanPrivat: app.kebutuhanPrivat,
                        philosophy: app.philosophy || 'Mendidik dengan integritas dan keunggulan akademik.',
                        highlights: app.highlights && app.highlights.length > 0 ? app.highlights : ['Pengajar terverifikasi Next Level Study']
                    };

                    // 2. Add to active teachers dataset
                    const exists = this.teachers.some(t => t.name.toLowerCase() === newTeacher.name.toLowerCase());
                    if (!exists) {
                        this.teachers.unshift(newTeacher);
                        this.saveTeachersToStorage();
                    }

                    // 3. Mark application as accepted
                    app.status = 'accepted';
                    this.saveTeacherApplicationsToStorage();

                    this.showToast(`Calon guru "${app.nama}" berhasil di-accept dan langsung terbit di Present Teacher & /pengajar!`);
                },

                rejectTeacherApplication(app) {
                    if (confirm(`Tolak pengajuan dari calon pengajar "${app.nama}"?`)) {
                        app.status = 'rejected';
                        this.saveTeacherApplicationsToStorage();
                        this.showToast(`Pengajuan "${app.nama}" ditandai sebagai ditolak.`);
                    }
                },

                restoreApplicationToPending(app) {
                    app.status = 'pending';
                    this.saveTeacherApplicationsToStorage();
                    this.showToast(`Status pengajuan "${app.nama}" dikembalikan ke Pending.`);
                },

                deleteTeacherApplication(id) {
                    const target = this.teacherApplications.find(a => a.id === id);
                    const name = target ? target.nama : 'Pengajuan';
                    if (confirm(`Hapus data pendaftaran "${name}" dari antrean Teacher Verification?`)) {
                        this.teacherApplications = this.teacherApplications.filter(a => a.id !== id);
                        this.saveTeacherApplicationsToStorage();
                        this.showToast(`Data pendaftaran "${name}" berhasil dihapus.`);
                    }
                },

                contactApplicantWA(app) {
                    const num = app.wa ? app.wa.replace(/[^0-9]/g, '') : '';
                    const formattedNum = num.startsWith('0') ? '62' + num.substring(1) : num;
                    const text = encodeURIComponent(`Halo ${app.nama}, kami dari Tim Akademik Next Level Study (NLS) mengonfirmasi pengajuan pendaftaran Anda sebagai Pengajar/Mentor bidang ${app.subject}. Kami ingin mengundang Anda untuk tahap wawancara.`);
                    window.open(`https://wa.me/${formattedNum}?text=${text}`, '_blank');
                },

                addSampleApplicant() {
                    const sample = {
                        id: 'app-' + Date.now(),
                        submittedAt: new Date().toISOString(),
                        status: 'pending',
                        nama: 'Rifki Pratama, S.Si.',
                        panggilan: 'Kak Rifki',
                        wa: '081298765432',
                        email: 'rifki.pratama@alumni.itb.ac.id',
                        pendidikan: 'Teknik Elektro ITB (Medalis Emas OSN Astronomi)',
                        photo: '/images/pengajar/mentor-1-math.jpg',
                        categories: ['OSN', 'TKA'],
                        jenjang: ['SMA'],
                        jenjangLabel: 'SMA & MA',
                        subject: 'Astronomi & Astrofisika Olimpiade',
                        kebutuhanPrivat: 'Bimbingan intensif persiapan OSN Astronomi dan pembinaan soal astrofisika observasional.',
                        philosophy: 'Melihat semesta raya dengan ketelitian fisika dan logika matematika murni.',
                        highlights: [
                            'Medali Emas OSN Astronomi Tingkat Nasional',
                            'Ketua Divisi Akademik Komunitas Olimpiade Sains',
                            'Membimbing 10+ siswa masuk finalis OSN Nasional'
                        ],
                        portfolio: 'https://github.com/rifki-astronomy-portfolio',
                        notes: ''
                    };
                    this.teacherApplications.unshift(sample);
                    this.saveTeacherApplicationsToStorage();
                    this.showToast('Simulasi pendaftar baru berhasil ditambahkan ke antrean verifikasi!');
                },
'@

if ($content.Contains($oldPengajarMethods)) {
    $content = $content.Replace($oldPengajarMethods, $newPengajarMethods)
    Write-Host "Updated JavaScript Methods successfully"
} else {
    Write-Host "[ERROR] Could not find oldPengajarMethods block"
}

# 5. Add Storage and Broadcast listeners for teacher applications in init()
$oldListeners = @'
                    // Cross-tab real-time storage & broadcast listeners
                    window.addEventListener('storage', (e) => {
                        if (e.key === 'nls_berita_articles_v1' && e.newValue) {
                            try {
                                const parsed = JSON.parse(e.newValue);
                                if (Array.isArray(parsed) && parsed.length > 0) this.articles = parsed;
                            } catch (err) {}
                        }
                    });
'@

$newListeners = @'
                    // Cross-tab real-time storage & broadcast listeners
                    window.addEventListener('storage', (e) => {
                        if (e.key === 'nls_berita_articles_v1' && e.newValue) {
                            try {
                                const parsed = JSON.parse(e.newValue);
                                if (Array.isArray(parsed) && parsed.length > 0) this.articles = parsed;
                            } catch (err) {}
                        }
                        if (e.key === 'nls_teacher_applications_v1' && e.newValue) {
                            try {
                                const parsed = JSON.parse(e.newValue);
                                if (Array.isArray(parsed)) this.teacherApplications = parsed;
                            } catch (err) {}
                        }
                    });

                    window.addEventListener('nls-teacher-application-added', (e) => {
                        if (e.detail) {
                            this.teacherApplications.unshift(e.detail);
                            this.showToast(`Pendaftaran guru baru dari "${e.detail.nama}" masuk ke Teacher Verification!`);
                        }
                    });
'@

if ($content.Contains($oldListeners)) {
    $content = $content.Replace($oldListeners, $newListeners)
    Write-Host "Updated Event Listeners successfully"
} else {
    Write-Host "[ERROR] Could not find oldListeners block"
}

# 6. Save modified file
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "File nlsadmin/index.html updated successfully!"
