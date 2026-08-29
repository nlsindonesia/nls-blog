const fs = require('fs');

const userTabHtml = `
            <!-- ==========================================
                 4. USER MANAGEMENT (ADD USER, PRESENT USER, TRASH)
                 ========================================== -->
            <div x-show="activeTab === 'users'" x-cloak class="space-y-6">
                
                <!-- Hero Banner -->
                <div class="admin-hero-users rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div class="space-y-2 max-w-2xl">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-black tracking-wide uppercase">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                <span>Manajemen Pengguna & Otoritas</span>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
                                User Management & Role Control
                            </h1>
                            <p class="text-xs sm:text-sm text-fuchsia-100/90 font-medium leading-relaxed">
                                Kelola akun staf, koordinator pengajar, administrator modul, dan hak akses portal Next Level Study secara terpusat dan aman.
                            </p>
                        </div>

                        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
                            <button type="button" @click="openAddUserView()"
                                class="px-4 py-2.5 rounded-2xl bg-white text-fuchsia-900 hover:bg-fuchsia-50 text-xs font-black shadow-lg shadow-fuchsia-950/20 transition-all flex items-center gap-2 cursor-pointer">
                                <svg class="w-4 h-4 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                                <span>Tambah Pengguna</span>
                            </button>
                            <button type="button" @click="openPresentUserView()"
                                class="px-4 py-2.5 rounded-2xl bg-fuchsia-900/60 hover:bg-fuchsia-900/80 text-white border border-fuchsia-400/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                                <span>Daftar User (<span x-text="users.length"></span>)</span>
                            </button>
                            <button type="button" @click="exportUsersJSON()"
                                class="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                                title="Export Dataset User ke JSON">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 4 Quick Stat Cards -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Pengguna</span>
                            <span class="p-2 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </span>
                        </div>
                        <div class="text-2xl font-black text-slate-900 dark:text-white" x-text="users.length"></div>
                        <p class="text-[10px] text-slate-400 mt-1 font-medium">Akun internal terdaftar</p>
                    </div>

                    <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Super Admin</span>
                            <span class="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </span>
                        </div>
                        <div class="text-2xl font-black text-slate-900 dark:text-white" x-text="countUsersByRole('super_admin')"></div>
                        <p class="text-[10px] text-slate-400 mt-1 font-medium">Akses penuh sistem</p>
                    </div>

                    <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status Aktif</span>
                            <span class="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            </span>
                        </div>
                        <div class="text-2xl font-black text-slate-900 dark:text-white" x-text="users.filter(u => u.status === 'Aktif').length"></div>
                        <p class="text-[10px] text-slate-400 mt-1 font-medium">Bisa login ke portal</p>
                    </div>

                    <div class="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-rose-300 transition-colors"
                        @click="openTrashUserView()">
                        <div class="flex items-center justify-between gap-2 mb-2">
                            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trash User</span>
                            <span class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </span>
                        </div>
                        <div class="text-2xl font-black text-slate-900 dark:text-white" x-text="trashUsers.length"></div>
                        <p class="text-[10px] text-rose-500 mt-1 font-medium">Akun terhapus / arsip</p>
                    </div>
                </div>

                <!-- ==============================================================
                     SUBVIEW 1: ADD / EDIT USER FORM (userView === 'add')
                     ============================================================== -->
                <div x-show="userView === 'add'" x-cloak class="bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
                        <div class="space-y-1">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black"
                                :class="userForm.isEdit ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300'">
                                <span class="w-2 h-2 rounded-full" :class="userForm.isEdit ? 'bg-amber-500' : 'bg-fuchsia-500'"></span>
                                <span x-text="userForm.isEdit ? 'Mode Edit Pengguna' : 'Formulir Pengguna Baru'"></span>
                            </div>
                            <h2 class="text-xl font-black text-slate-900 dark:text-white"
                                x-text="userForm.isEdit ? 'Perbarui Informasi Akun & Hak Akses' : 'Tambah Pengguna Baru & Tetapkan Peran'"></h2>
                        </div>
                        <button type="button" @click="openPresentUserView()"
                            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto">
                            Kembali ke Daftar
                        </button>
                    </div>

                    <form @submit.prevent="saveUser()" class="space-y-6">
                        <!-- Basic Info Grid -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <!-- Nama Lengkap -->
                            <div class="space-y-1.5">
                                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Nama Lengkap & Gelar <span class="text-rose-500">*</span>
                                </label>
                                <input type="text" x-model="userForm.name" required
                                    placeholder="Contoh: Kak Raditya Pratama, M.Sc."
                                    class="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500">
                            </div>

                            <!-- Username -->
                            <div class="space-y-1.5">
                                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Username Login <span class="text-rose-500">*</span>
                                </label>
                                <div class="relative">
                                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">@</span>
                                    <input type="text" x-model="userForm.username" required
                                        placeholder="raditya.akademik"
                                        class="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500">
                                </div>
                            </div>

                            <!-- Email -->
                            <div class="space-y-1.5">
                                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Alamat Email Resmi <span class="text-rose-500">*</span>
                                </label>
                                <input type="email" x-model="userForm.email" required
                                    placeholder="raditya@next-level-study.com"
                                    class="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500">
                            </div>

                            <!-- WhatsApp -->
                            <div class="space-y-1.5">
                                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Nomor WhatsApp / Kontak Aktif
                                </label>
                                <input type="tel" x-model="userForm.phone"
                                    placeholder="Contoh: 081286096600"
                                    class="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500">
                            </div>

                            <!-- Departemen / Divisi -->
                            <div class="space-y-1.5">
                                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Departemen / Divisi Kerja
                                </label>
                                <input type="text" x-model="userForm.department"
                                    placeholder="Contoh: Divisi Kurikulum & OSN"
                                    class="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500">
                            </div>

                            <!-- Status Akun -->
                            <div class="space-y-1.5">
                                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Status Akun
                                </label>
                                <div class="flex items-center gap-3 pt-1">
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="Aktif" x-model="userForm.status" class="text-fuchsia-600 focus:ring-fuchsia-500">
                                        <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">Aktif (Dapat Login)</span>
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" value="Nonaktif" x-model="userForm.status" class="text-fuchsia-600 focus:ring-fuchsia-500">
                                        <span class="text-xs font-bold text-slate-500">Nonaktif (Dibekukan)</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Role Selector Section -->
                        <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <div>
                                <label class="block text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                    Penentuan Peran & Hak Akses (*Role Permission*) <span class="text-rose-500">*</span>
                                </label>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Pilih peran pengguna untuk menentukan menu dan wewenang yang dapat diakses di portal.
                                </p>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <!-- Role 1: Super Admin -->
                                <div @click="setUserRole('super_admin', 'Super Admin')"
                                    class="p-4 rounded-2xl border-2 transition-all cursor-pointer relative"
                                    :class="userForm.role_id === 'super_admin' ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-rose-300 bg-slate-50/50 dark:bg-slate-900/40'">
                                    <div class="flex items-center justify-between gap-2 mb-1.5">
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">Super Admin</span>
                                        <span x-show="userForm.role_id === 'super_admin'" class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                                    </div>
                                    <h4 class="text-xs font-black text-slate-900 dark:text-white">Akses Penuh</h4>
                                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                        Seluruh modul (Kalender, Berita CMS, Pengajar, User Management, Database Backup).
                                    </p>
                                </div>

                                <!-- Role 2: Admin Akademik -->
                                <div @click="setUserRole('admin_akademik', 'Admin Akademik')"
                                    class="p-4 rounded-2xl border-2 transition-all cursor-pointer relative"
                                    :class="userForm.role_id === 'admin_akademik' ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-sky-300 bg-slate-50/50 dark:bg-slate-900/40'">
                                    <div class="flex items-center justify-between gap-2 mb-1.5">
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">Admin Akademik</span>
                                        <span x-show="userForm.role_id === 'admin_akademik'" class="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                                    </div>
                                    <h4 class="text-xs font-black text-slate-900 dark:text-white">Kalender & CBT</h4>
                                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                        Kelola jadwal agenda, event try out berkala, webinar, dan jadwal kelas olimpiade.
                                    </p>
                                </div>

                                <!-- Role 3: Content Editor -->
                                <div @click="setUserRole('content_editor', 'Content Editor')"
                                    class="p-4 rounded-2xl border-2 transition-all cursor-pointer relative"
                                    :class="userForm.role_id === 'content_editor' ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 bg-slate-50/50 dark:bg-slate-900/40'">
                                    <div class="flex items-center justify-between gap-2 mb-1.5">
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Content Editor</span>
                                        <span x-show="userForm.role_id === 'content_editor'" class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    </div>
                                    <h4 class="text-xs font-black text-slate-900 dark:text-white">Berita & Artikel CMS</h4>
                                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                        Tulis artikel blog edukasi, optimasi SEO keyword, dan publikasi wawasan belajar.
                                    </p>
                                </div>

                                <!-- Role 4: Koordinator Pengajar -->
                                <div @click="setUserRole('koordinator_pengajar', 'Koordinator Pengajar')"
                                    class="p-4 rounded-2xl border-2 transition-all cursor-pointer relative"
                                    :class="userForm.role_id === 'koordinator_pengajar' ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 bg-slate-50/50 dark:bg-slate-900/40'">
                                    <div class="flex items-center justify-between gap-2 mb-1.5">
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">Koordinator Pengajar</span>
                                        <span x-show="userForm.role_id === 'koordinator_pengajar'" class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                                    </div>
                                    <h4 class="text-xs font-black text-slate-900 dark:text-white">Pengajar & Verifikasi</h4>
                                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                        Kelola profil tutor, kurasi berkas lamaran guru, dan seleksi calon pengajar.
                                    </p>
                                </div>

                                <!-- Role 5: Customer Service -->
                                <div @click="setUserRole('customer_service', 'Customer Service')"
                                    class="p-4 rounded-2xl border-2 transition-all cursor-pointer relative"
                                    :class="userForm.role_id === 'customer_service' ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 bg-slate-50/50 dark:bg-slate-900/40'">
                                    <div class="flex items-center justify-between gap-2 mb-1.5">
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Customer Service</span>
                                        <span x-show="userForm.role_id === 'customer_service'" class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                    </div>
                                    <h4 class="text-xs font-black text-slate-900 dark:text-white">Layanan & Pendaftaran</h4>
                                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                        Respon konsultasi pendaftaran siswa, bimbingan program, dan informasi kontak.
                                    </p>
                                </div>

                                <!-- Role 6: Tutor / Mentor Ahli -->
                                <div @click="setUserRole('tutor_mentor', 'Tutor / Mentor Ahli')"
                                    class="p-4 rounded-2xl border-2 transition-all cursor-pointer relative"
                                    :class="userForm.role_id === 'tutor_mentor' ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 shadow-sm' : 'border-slate-200 dark:border-slate-800 hover:border-purple-300 bg-slate-50/50 dark:bg-slate-900/40'">
                                    <div class="flex items-center justify-between gap-2 mb-1.5">
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">Tutor / Mentor</span>
                                        <span x-show="userForm.role_id === 'tutor_mentor'" class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                                    </div>
                                    <h4 class="text-xs font-black text-slate-900 dark:text-white">Pengajar Spesialis</h4>
                                    <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                        Akses jadwal kelas dan catatan pembinaan materi khusus jenjang terkait.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Password & Security -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <div class="space-y-1.5">
                                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Kata Sandi / Password <span x-show="!userForm.isEdit" class="text-rose-500">*</span>
                                </label>
                                <div class="relative">
                                    <input :type="showUserPassword ? 'text' : 'password'" x-model="userForm.password"
                                        :required="!userForm.isEdit"
                                        placeholder="Minimal 6 karakter kombinasi"
                                        class="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500">
                                    <button type="button" @click="showUserPassword = !showUserPassword"
                                        class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                    </button>
                                </div>
                                <p x-show="userForm.isEdit" class="text-[10px] text-slate-400">Kosongkan jika tidak ingin mengubah password lama.</p>
                            </div>

                            <div class="space-y-1.5">
                                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Catatan Tambahan / Memo Internal
                                </label>
                                <input type="text" x-model="userForm.notes"
                                    placeholder="Contoh: PJ Try Out OSN Matematika Wilayah Barat"
                                    class="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500">
                            </div>
                        </div>

                        <!-- Form Action Buttons -->
                        <div class="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
                            <button type="button" @click="openPresentUserView()"
                                class="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer">
                                Batal
                            </button>
                            <button type="submit"
                                class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white text-xs font-black shadow-lg shadow-fuchsia-500/25 transition-all cursor-pointer flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                <span x-text="userForm.isEdit ? 'Perbarui Pengguna' : 'Simpan Pengguna'"></span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- ==============================================================
                     SUBVIEW 2: PRESENT USER DIRECTORY (userView === 'present')
                     ============================================================== -->
                <div x-show="userView === 'present'" x-cloak class="space-y-4">
                    <!-- Filters & Search Toolbar -->
                    <div class="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex-1 relative">
                            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                            <input type="text" x-model="userFilter.search"
                                placeholder="Cari nama pengguna, username, email, WhatsApp, divisi..."
                                class="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500">
                        </div>

                        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
                            <!-- Role Filter Dropdown -->
                            <select x-model="userFilter.role"
                                class="px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500 cursor-pointer">
                                <option value="all">Semua Peran (All Roles)</option>
                                <option value="super_admin">Super Admin</option>
                                <option value="admin_akademik">Admin Akademik</option>
                                <option value="content_editor">Content Editor</option>
                                <option value="koordinator_pengajar">Koordinator Pengajar</option>
                                <option value="customer_service">Customer Service</option>
                                <option value="tutor_mentor">Tutor / Mentor Ahli</option>
                            </select>

                            <!-- Status Filter Dropdown -->
                            <select x-model="userFilter.status"
                                class="px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-fuchsia-500 cursor-pointer">
                                <option value="all">Semua Status</option>
                                <option value="Aktif">Hanya Aktif</option>
                                <option value="Nonaktif">Hanya Nonaktif</option>
                            </select>

                            <button type="button" @click="resetUserFilters()"
                                class="px-3 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                                title="Reset Filter">
                                Reset
                            </button>
                        </div>
                    </div>

                    <!-- User Table / Card List -->
                    <div class="bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <th class="py-3.5 px-4 sm:px-6">Pengguna</th>
                                        <th class="py-3.5 px-4">Peran & Divisi</th>
                                        <th class="py-3.5 px-4">Kontak Resmi</th>
                                        <th class="py-3.5 px-4">Status</th>
                                        <th class="py-3.5 px-4">Aktivitas Terakhir</th>
                                        <th class="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                                    <template x-for="user in filteredUsersList()" :key="user.id">
                                        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                                            <!-- User Name & Avatar -->
                                            <td class="py-4 px-4 sm:px-6">
                                                <div class="flex items-center gap-3">
                                                    <img :src="user.avatar || '/nls-logo-300.png'"
                                                        @error="$event.target.src = '/nls-logo-300.png'"
                                                        :alt="user.name"
                                                        class="w-10 h-10 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs">
                                                    <div class="min-w-0">
                                                        <div class="font-black text-slate-900 dark:text-white truncate" x-text="user.name"></div>
                                                        <div class="text-[11px] text-slate-400 dark:text-slate-500 font-bold truncate">@<span x-text="user.username"></span></div>
                                                    </div>
                                                </div>
                                            </td>

                                            <!-- Role & Department -->
                                            <td class="py-4 px-4">
                                                <div class="space-y-1">
                                                    <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide"
                                                        :class="getUserRoleBadgeClass(user.role_id)">
                                                        <span x-text="user.role"></span>
                                                    </span>
                                                    <div class="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate" x-text="user.department || 'Operasional'"></div>
                                                </div>
                                            </td>

                                            <!-- Contact -->
                                            <td class="py-4 px-4 space-y-1">
                                                <div class="text-slate-700 dark:text-slate-300 font-medium truncate" x-text="user.email"></div>
                                                <div x-show="user.phone" class="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                    <a :href="'https://wa.me/' + cleanPhone(user.phone)" target="_blank" class="hover:underline" x-text="user.phone"></a>
                                                </div>
                                            </td>

                                            <!-- Status -->
                                            <td class="py-4 px-4">
                                                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black"
                                                    :class="user.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'">
                                                    <span class="w-1.5 h-1.5 rounded-full" :class="user.status === 'Aktif' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
                                                    <span x-text="user.status"></span>
                                                </span>
                                            </td>

                                            <!-- Last Login -->
                                            <td class="py-4 px-4 text-slate-500 dark:text-slate-400 text-[11px] font-medium" x-text="user.last_login || 'Belum Login'"></td>

                                            <!-- Actions -->
                                            <td class="py-4 px-4 sm:px-6 text-right">
                                                <div class="inline-flex items-center gap-1">
                                                    <!-- Edit User Button -->
                                                    <button type="button" @click="editUser(user)"
                                                        class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-fuchsia-600 transition-all cursor-pointer"
                                                        title="Edit Informasi User">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                    </button>

                                                    <!-- Toggle Status Button -->
                                                    <button type="button" @click="toggleUserStatus(user.id)"
                                                        class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                                                        :title="user.status === 'Aktif' ? 'Bekukan Akun' : 'Aktifkan Akun'">
                                                        <svg x-show="user.status === 'Aktif'" class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                                        <svg x-show="user.status !== 'Aktif'" class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    </button>

                                                    <!-- Delete to Trash Button -->
                                                    <button type="button" @click="deleteUserToTrash(user.id)"
                                                        class="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-all cursor-pointer"
                                                        title="Pindahkan ke Tempat Sampah">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>

                                    <!-- Empty State -->
                                    <tr x-show="filteredUsersList().length === 0">
                                        <td colspan="6" class="py-12 text-center text-slate-400">
                                            <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            </div>
                                            <div class="text-sm font-bold text-slate-700 dark:text-slate-300">Tidak ada data pengguna ditemukan</div>
                                            <div class="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau reset filter.</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- ==============================================================
                     SUBVIEW 3: TRASH USER MANAGEMENT (userView === 'trash')
                     ============================================================== -->
                <div x-show="userView === 'trash'" x-cloak class="space-y-4">
                    <div class="p-4 sm:p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="space-y-1">
                            <h3 class="text-base font-black text-rose-900 dark:text-rose-200 flex items-center gap-2">
                                <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                <span>Tempat Sampah Pengguna (Trash User)</span>
                            </h3>
                            <p class="text-xs text-rose-700 dark:text-rose-300 font-medium">
                                Pengguna yang dihapus dapat dipulihkan kembali atau dihapus permanen dari sistem.
                            </p>
                        </div>

                        <div class="flex items-center gap-2.5 shrink-0">
                            <button type="button" @click="emptyUsersTrash()" :disabled="trashUsers.length === 0"
                                class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow-xs">
                                Kosongkan Trash
                            </button>
                            <button type="button" @click="openPresentUserView()"
                                class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer">
                                Kembali
                            </button>
                        </div>
                    </div>

                    <!-- Trash Table -->
                    <div class="bg-white dark:bg-[#131D38] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        <th class="py-3.5 px-4 sm:px-6">Pengguna Dihapus</th>
                                        <th class="py-3.5 px-4">Peran & Divisi</th>
                                        <th class="py-3.5 px-4">Waktu Dihapus</th>
                                        <th class="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                                    <template x-for="user in trashUsers" :key="user.id">
                                        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                                            <td class="py-4 px-4 sm:px-6">
                                                <div class="flex items-center gap-3">
                                                    <img :src="user.avatar || '/nls-logo-300.png'"
                                                        @error="$event.target.src = '/nls-logo-300.png'"
                                                        :alt="user.name"
                                                        class="w-10 h-10 rounded-2xl object-cover grayscale opacity-75 shrink-0 border border-slate-200 dark:border-slate-700">
                                                    <div class="min-w-0">
                                                        <div class="font-black text-slate-900 dark:text-white line-through opacity-75 truncate" x-text="user.name"></div>
                                                        <div class="text-[11px] text-slate-400 truncate">@<span x-text="user.username"></span></div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td class="py-4 px-4">
                                                <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase"
                                                    :class="getUserRoleBadgeClass(user.role_id)">
                                                    <span x-text="user.role"></span>
                                                </span>
                                            </td>

                                            <td class="py-4 px-4 text-slate-500 dark:text-slate-400 text-[11px] font-medium"
                                                x-text="user.deleted_at ? new Date(user.deleted_at).toLocaleString('id-ID') : 'Tidak tercatat'"></td>

                                            <td class="py-4 px-4 sm:px-6 text-right">
                                                <div class="inline-flex items-center gap-2">
                                                    <button type="button" @click="restoreUserFromTrash(user.id)"
                                                        class="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all cursor-pointer">
                                                        Pulihkan
                                                    </button>
                                                    <button type="button" @click="permanentDeleteUser(user.id)"
                                                        class="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer">
                                                        Hapus Permanen
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>

                                    <!-- Empty Trash State -->
                                    <tr x-show="trashUsers.length === 0">
                                        <td colspan="4" class="py-12 text-center text-slate-400">
                                            <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                            <div class="text-sm font-bold text-slate-700 dark:text-slate-300">Tempat Sampah Bersih</div>
                                            <div class="text-xs text-slate-400 mt-1">Tidak ada akun pengguna yang berada di tempat sampah.</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
`;

let html = fs.readFileSync('nlsadmin/index.html', 'utf8');

// Insert inside <main> right before </main>
const target = '</main>';
html = html.replace(target, userTabHtml + '\n\n            ' + target);

// Fix toggleUserDropdown to always set activeTab = 'users' and userView = 'present' if navigating
const oldToggleUser = `toggleUserDropdown() {
                    this.isUserDropdownOpen = !this.isUserDropdownOpen;
                    if (this.isUserDropdownOpen) {
                        this.activeTab = 'users';
                    }
                },`;

const newToggleUser = `toggleUserDropdown() {
                    if (this.activeTab !== 'users') {
                        this.activeTab = 'users';
                        this.userView = 'present';
                        this.isUserDropdownOpen = true;
                    } else {
                        this.isUserDropdownOpen = !this.isUserDropdownOpen;
                    }
                },`;

html = html.replace(oldToggleUser, newToggleUser);

fs.writeFileSync('nlsadmin/index.html', html, 'utf8');
console.log('✅ Properly inserted User Management tab markup inside <main> and updated toggleUserDropdown');
