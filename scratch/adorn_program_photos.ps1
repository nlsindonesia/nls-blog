$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$privatContent = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

$oldPattern = '(?s)<!-- Program Pengembangan Akademik Terpadu.*?<!-- Testimonial / Mentor Spotlight -->'

$newContent = @'
<!-- Program Pengembangan Akademik Terpadu (PHOTO-ENHANCED & MODERN 4 PILLARS) -->
            <section class="py-20 md:py-24 bg-surface-alt dark:bg-[#0b132b]">
                <div class="px-4 md:px-8 container-max">
                    <!-- Section Header -->
                    <div class="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
                        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-primary dark:text-sky-400 font-extrabold text-xs tracking-wider uppercase mb-3 shadow-2xs">
                            <span class="icon-[mdi--target-account] text-sm"></span>
                            <span>4 Fokus Utama Bimbingan</span>
                        </div>
                        <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                            Program Pengembangan Akademik Terpadu
                        </h2>
                        <p class="text-slate-600 dark:text-slate-300 text-base md:text-lg font-medium leading-relaxed">
                            Pendampingan 1-on-1 strategis bersama mentor terbaik untuk mengoptimalkan potensi, nilai, dan prestasi akademik siswa.
                        </p>
                    </div>

                    <!-- 4 Photo Cards Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        
                        <!-- 1. OSN & Olimpiade Card -->
                        <div style="border-radius: 28px !important;"
                            class="group bg-white dark:bg-[#131D38] border-2 border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 shadow-md hover:shadow-2xl hover:shadow-amber-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-2">
                            
                            <div>
                                <!-- Image Container with Floating Badge -->
                                <div class="relative h-48 w-full overflow-hidden">
                                    <img alt="Les Privat OSN & Olimpiade Internasional"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        src="/images/privat/fokus-osn.jpg">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                                    <span style="border-radius: 9999px !important;"
                                        class="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                                        <span class="icon-[mdi--trophy] text-xs"></span>
                                        OSN &amp; Global
                                    </span>
                                </div>

                                <!-- Body -->
                                <div class="p-6">
                                    <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                        OSN &amp; Olimpiade Sains
                                    </h3>
                                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                        Bimbingan intensif persiapan OSN tingkat Kota s.d. Nasional dan kompetisi internasional (AMO, SEAMO, SIMOC) bersama mentor medalis.
                                    </p>
                                </div>
                            </div>

                            <!-- Footer Link -->
                            <div class="p-6 pt-0">
                                <button type="button" @click="$store.paketPrivat.open('intensif')" onclick="openPrivatPackage('intensif')"
                                    class="w-full py-2.5 px-4 rounded-xl text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-500 hover:text-slate-950 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                                    <span>Pilih Paket Exclusive</span>
                                    <span class="icon-[mdi--arrow-right]"></span>
                                </button>
                            </div>
                        </div>

                        <!-- 2. SNBT & Mandiri Card -->
                        <div style="border-radius: 28px !important;"
                            class="group bg-white dark:bg-[#131D38] border-2 border-slate-200/80 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-400 shadow-md hover:shadow-2xl hover:shadow-sky-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-2">
                            
                            <div>
                                <!-- Image Container with Floating Badge -->
                                <div class="relative h-48 w-full overflow-hidden">
                                    <img alt="Les Privat SNBT & Mandiri"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        src="/images/privat/fokus-snbt.jpg">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                                    <span style="border-radius: 9999px !important;"
                                        class="absolute top-3 left-3 px-3 py-1 bg-[#0284c7] text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                                        <span class="icon-[mdi--school] text-xs"></span>
                                        Target PTN
                                    </span>
                                </div>

                                <!-- Body -->
                                <div class="p-6">
                                    <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                        UTBK-SNBT &amp; Mandiri
                                    </h3>
                                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                        Penguasaan materi fundamental, bedah pola soal TPS &amp; Literasi, serta strategi taktis lulus Perguruan Tinggi Negeri impian.
                                    </p>
                                </div>
                            </div>

                            <!-- Footer Link -->
                            <div class="p-6 pt-0">
                                <button type="button" @click="$store.paketPrivat.open('intensif')" onclick="openPrivatPackage('intensif')"
                                    class="w-full py-2.5 px-4 rounded-xl text-xs font-black text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800/60 hover:bg-[#0284c7] hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                                    <span>Pilih Persiapan PTN</span>
                                    <span class="icon-[mdi--arrow-right]"></span>
                                </button>
                            </div>
                        </div>

                        <!-- 3. TKA SD, SMP & SMA Card -->
                        <div style="border-radius: 28px !important;"
                            class="group bg-white dark:bg-[#131D38] border-2 border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-400 shadow-md hover:shadow-2xl hover:shadow-emerald-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-2">
                            
                            <div>
                                <!-- Image Container with Floating Badge -->
                                <div class="relative h-48 w-full overflow-hidden">
                                    <img alt="Les Privat TKA SD SMP SMA"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        src="/images/privat/fokus-tka.jpg">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                                    <span style="border-radius: 9999px !important;"
                                        class="absolute top-3 left-3 px-3 py-1 bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                                        <span class="icon-[mdi--book-check] text-xs"></span>
                                        TKA Pusmendik
                                    </span>
                                </div>

                                <!-- Body -->
                                <div class="p-6">
                                    <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        TKA SD, SMP &amp; SMA
                                    </h3>
                                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                        Pendampingan kurikulum nasional &amp; Tes Kemampuan Akademik (TKA) Pusmendik RI untuk melejitkan nilai rapor harian sekolah.
                                    </p>
                                </div>
                            </div>

                            <!-- Footer Link -->
                            <div class="p-6 pt-0">
                                <button type="button" @click="$store.paketPrivat.open('reguler')" onclick="openPrivatPackage('reguler')"
                                    class="w-full py-2.5 px-4 rounded-xl text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                                    <span>Pilih Paket Reguler</span>
                                    <span class="icon-[mdi--arrow-right]"></span>
                                </button>
                            </div>
                        </div>

                        <!-- 4. Kurikulum Internasional Card -->
                        <div style="border-radius: 28px !important;"
                            class="group bg-white dark:bg-[#131D38] border-2 border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-400 shadow-md hover:shadow-2xl hover:shadow-purple-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-2">
                            
                            <div>
                                <!-- Image Container with Floating Badge -->
                                <div class="relative h-48 w-full overflow-hidden">
                                    <img alt="Les Privat Kurikulum Internasional"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        src="/images/privat/fokus-internasional.jpg">
                                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                                    <span style="border-radius: 9999px !important;"
                                        class="absolute top-3 left-3 px-3 py-1 bg-purple-600 text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                                        <span class="icon-[mdi--earth] text-xs"></span>
                                        Global Standard
                                    </span>
                                </div>

                                <!-- Body -->
                                <div class="p-6">
                                    <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        Kurikulum Internasional
                                    </h3>
                                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                        Bimbingan bilingual untuk standar Cambridge (Checkpoint, IGCSE, A-Level), IB Diploma, serta asesmen global sekolah internasional.
                                    </p>
                                </div>
                            </div>

                            <!-- Footer Link -->
                            <div class="p-6 pt-0">
                                <button type="button" @click="$store.paketPrivat.open('internasional')" onclick="openPrivatPackage('internasional')"
                                    class="w-full py-2.5 px-4 rounded-xl text-xs font-black text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-800/60 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                                    <span>Pilih Paket Juara</span>
                                    <span class="icon-[mdi--arrow-right]"></span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <!-- Testimonial / Mentor Spotlight -->
'@

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldPattern, $newContent)

[System.IO.File]::WriteAllText($privatPath, $privatContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Adorned Program Pengembangan Akademik Terpadu with original photo cards!"
