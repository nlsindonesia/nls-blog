$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$privatContent = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

$oldPattern = '(?s)<!-- Program Fokus Akademik Title.*?<!-- Testimonial / Mentor Spotlight -->'

$newContent = @'
<!-- Program Pengembangan Akademik Terpadu (SIMPLE, CLEAN & COMPACT 4-PILLAR) -->
            <section class="py-16 md:py-20 bg-white dark:bg-[#0b132b]">
                <div class="px-4 md:px-8 container-max">
                    <!-- Header -->
                    <div class="text-center mb-10 md:mb-12 max-w-3xl mx-auto">
                        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-primary dark:text-sky-400 font-extrabold text-xs tracking-wider uppercase mb-3 shadow-2xs">
                            <span class="icon-[mdi--target-account] text-sm"></span>
                            <span>4 Pilar Fokus Bimbingan</span>
                        </div>
                        <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                            Program Pengembangan Akademik Terpadu
                        </h2>
                        <p class="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
                            Pendampingan 1-on-1 strategis untuk mengoptimalkan potensi dan kesuksesan akademik siswa di setiap jenjang.
                        </p>
                    </div>

                    <!-- 4 Clean Compact Cards Grid -->
                    <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; width: 100%;">
                        
                        <!-- 1. OSN & Olimpiade -->
                        <div style="flex: 1 1 240px; max-width: 290px; border-radius: 24px !important; border: 1.5px solid #e2e8f0;"
                            class="bg-slate-50/70 dark:bg-[#131D38] dark:border-slate-800 p-6 flex flex-col justify-between hover:border-amber-400 transition-all duration-200 hover:-translate-y-1 shadow-xs hover:shadow-md">
                            <div>
                                <div style="width: 48px; height: 48px; border-radius: 16px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff;"
                                    class="flex items-center justify-center text-2xl shadow-sm mb-4">
                                    <span class="icon-[mdi--trophy]"></span>
                                </div>
                                <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight">
                                    OSN &amp; Olimpiade Global
                                </h3>
                                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
                                    Bimbingan intensif persiapan OSN tingkat Kota s.d. Nasional serta kompetisi internasional (AMO, SEAMO, SIMOC).
                                </p>
                            </div>
                            <button type="button" @click="$store.paketPrivat.open('intensif')" onclick="openPrivatPackage('intensif')"
                                class="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 hover:underline self-start cursor-pointer">
                                <span>Pilih Paket Exclusive</span>
                                <span class="icon-[mdi--arrow-right]"></span>
                            </button>
                        </div>

                        <!-- 2. SNBT & Mandiri -->
                        <div style="flex: 1 1 240px; max-width: 290px; border-radius: 24px !important; border: 1.5px solid #e2e8f0;"
                            class="bg-slate-50/70 dark:bg-[#131D38] dark:border-slate-800 p-6 flex flex-col justify-between hover:border-sky-400 transition-all duration-200 hover:-translate-y-1 shadow-xs hover:shadow-md">
                            <div>
                                <div style="width: 48px; height: 48px; border-radius: 16px; background: linear-gradient(135deg, #0284c7, #0369a1); color: #ffffff;"
                                    class="flex items-center justify-center text-2xl shadow-sm mb-4">
                                    <span class="icon-[mdi--school]"></span>
                                </div>
                                <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight">
                                    UTBK-SNBT &amp; Ujian Mandiri
                                </h3>
                                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
                                    Penguasaan materi fundamental, latihan soal prediktif TPS &amp; Literasi, serta trik manajemen waktu masuk PTN.
                                </p>
                            </div>
                            <button type="button" @click="$store.paketPrivat.open('intensif')" onclick="openPrivatPackage('intensif')"
                                class="text-xs font-extrabold text-sky-600 dark:text-sky-400 flex items-center gap-1.5 hover:underline self-start cursor-pointer">
                                <span>Pilih Persiapan PTN</span>
                                <span class="icon-[mdi--arrow-right]"></span>
                            </button>
                        </div>

                        <!-- 3. TKA & Kurikulum Nasional -->
                        <div style="flex: 1 1 240px; max-width: 290px; border-radius: 24px !important; border: 1.5px solid #e2e8f0;"
                            class="bg-slate-50/70 dark:bg-[#131D38] dark:border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-400 transition-all duration-200 hover:-translate-y-1 shadow-xs hover:shadow-md">
                            <div>
                                <div style="width: 48px; height: 48px; border-radius: 16px; background: linear-gradient(135deg, #059669, #047857); color: #ffffff;"
                                    class="flex items-center justify-center text-2xl shadow-sm mb-4">
                                    <span class="icon-[mdi--book-check]"></span>
                                </div>
                                <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight">
                                    TKA SD, SMP &amp; SMA
                                </h3>
                                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
                                    Pendampingan penguasaan Tes Kemampuan Akademik (TKA) Pusmendik RI &amp; penguatan nilai rapor harian sekolah.
                                </p>
                            </div>
                            <button type="button" @click="$store.paketPrivat.open('reguler')" onclick="openPrivatPackage('reguler')"
                                class="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:underline self-start cursor-pointer">
                                <span>Pilih Paket Reguler</span>
                                <span class="icon-[mdi--arrow-right]"></span>
                            </button>
                        </div>

                        <!-- 4. Kurikulum Internasional -->
                        <div style="flex: 1 1 240px; max-width: 290px; border-radius: 24px !important; border: 1.5px solid #e2e8f0;"
                            class="bg-slate-50/70 dark:bg-[#131D38] dark:border-slate-800 p-6 flex flex-col justify-between hover:border-purple-400 transition-all duration-200 hover:-translate-y-1 shadow-xs hover:shadow-md">
                            <div>
                                <div style="width: 48px; height: 48px; border-radius: 16px; background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #ffffff;"
                                    class="flex items-center justify-center text-2xl shadow-sm mb-4">
                                    <span class="icon-[mdi--earth]"></span>
                                </div>
                                <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight">
                                    Kurikulum Internasional
                                </h3>
                                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
                                    Bimbingan bilingual untuk kurikulum Cambridge (IGCSE/A-Level), IB Diploma, serta kurikulum global lainnya.
                                </p>
                            </div>
                            <button type="button" @click="$store.paketPrivat.open('internasional')" onclick="openPrivatPackage('internasional')"
                                class="text-xs font-extrabold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 hover:underline self-start cursor-pointer">
                                <span>Pilih Paket Juara</span>
                                <span class="icon-[mdi--arrow-right]"></span>
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            <!-- Testimonial / Mentor Spotlight -->
'@

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldPattern, $newContent)

[System.IO.File]::WriteAllText($privatPath, $privatContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Simplified Program Pengembangan Akademik Terpadu into a clean, compact 4-pillar section!"
