$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$privatContent = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

$oldSectionPattern = '(?s)<!-- Pilihan Subjek Privat -->\s*<section class="py-20 px-4 md:px-8 container-max">.*?<!-- Program Fokus Akademik Title -->'

$newSection = @'
<!-- Pilihan Subjek Privat (PREMIUM, VIBRANT & INTERACTIVE) -->
            <section class="py-24 px-4 md:px-8 container-max relative overflow-hidden">
                <!-- Background Decorative Glows -->
                <div class="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Section Header -->
                <div class="text-center mb-16 relative z-10">
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-primary dark:text-sky-400 font-extrabold text-xs tracking-wider uppercase mb-4 shadow-xs">
                        <span class="icon-[mdi--sparkles] text-sm"></span>
                        <span>Bidang Pembelajaran Lengkap &amp; Terarah</span>
                    </div>
                    <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Pilihan Subjek Les Privat
                    </h2>
                    <p class="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-base md:text-lg leading-relaxed font-medium">
                        Mentor ahli terverifikasi siap membimbing secara personal dari pemantapan materi sekolah, persiapan ujian masuk PTN &amp; kedinasan, hingga kompetisi sains bergengsi.
                    </p>
                </div>

                <!-- 5 Interactive Subject Cards Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">

                    <!-- 1. Matematika -->
                    <div style="border-radius: 28px !important;"
                        class="group relative bg-white dark:bg-[#131D38] p-6 sm:p-7 border-2 border-sky-100 dark:border-sky-900/50 hover:border-sky-500 dark:hover:border-sky-400 shadow-lg hover:shadow-2xl hover:shadow-sky-500/15 transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 cursor-pointer overflow-hidden"
                        @click="$store.paketPrivat.formData.mataPelajaran = 'Matematika'; $store.paketPrivat.open('reguler')"
                        onclick="openPrivatPackage('reguler')">
                        
                        <div class="absolute top-0 right-0 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

                        <div>
                            <!-- Icon Box -->
                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white text-3xl shadow-md shadow-sky-500/30 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <span class="icon-[mdi--function-variant]"></span>
                            </div>

                            <div class="flex items-center gap-2 mb-1.5">
                                <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                    Matematika
                                </h3>
                            </div>
                            <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4">
                                SD, SMP, SMA, Olimpiade &amp; Kuliah
                            </p>

                            <!-- Micro Topic Chips -->
                            <div class="flex flex-wrap gap-1.5 mb-6">
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">Aljabar &amp; Geometri</span>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">Kalkulus &amp; Matdas</span>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">OSN MTK / Cambridge</span>
                            </div>
                        </div>

                        <!-- Card Action Link -->
                        <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-black text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
                            <span>Pilih Matematika</span>
                            <span class="icon-[mdi--arrow-right] text-base"></span>
                        </div>
                    </div>

                    <!-- 2. Sains (IPA) -->
                    <div style="border-radius: 28px !important;"
                        class="group relative bg-white dark:bg-[#131D38] p-6 sm:p-7 border-2 border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/15 transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 cursor-pointer overflow-hidden"
                        @click="$store.paketPrivat.formData.mataPelajaran = 'Fisika / Kimia / Biologi'; $store.paketPrivat.open('reguler')"
                        onclick="openPrivatPackage('reguler')">
                        
                        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

                        <div>
                            <!-- Icon Box -->
                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-3xl shadow-md shadow-emerald-500/30 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <span class="icon-[mdi--flask]"></span>
                            </div>

                            <div class="flex items-center gap-2 mb-1.5">
                                <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    Sains (IPA)
                                </h3>
                            </div>
                            <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4">
                                Teori Konseptual &amp; Bedah Soal
                            </p>

                            <!-- Micro Topic Chips -->
                            <div class="flex flex-wrap gap-1.5 mb-6">
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">Fisika &amp; Astronomi</span>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">Kimia Organik/Anorganik</span>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">Biologi &amp; Kebumian</span>
                            </div>
                        </div>

                        <!-- Card Action Link -->
                        <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-black text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                            <span>Pilih Sains (IPA)</span>
                            <span class="icon-[mdi--arrow-right] text-base"></span>
                        </div>
                    </div>

                    <!-- 3. Bahasa Internasional -->
                    <div style="border-radius: 28px !important;"
                        class="group relative bg-white dark:bg-[#131D38] p-6 sm:p-7 border-2 border-purple-100 dark:border-purple-900/50 hover:border-purple-500 dark:hover:border-purple-400 shadow-lg hover:shadow-2xl hover:shadow-purple-500/15 transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 cursor-pointer overflow-hidden"
                        @click="$store.paketPrivat.formData.mataPelajaran = 'Bahasa Inggris / Mandarin / Jepang'; $store.paketPrivat.open('reguler')"
                        onclick="openPrivatPackage('reguler')">
                        
                        <div class="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

                        <div>
                            <!-- Icon Box -->
                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-3xl shadow-md shadow-purple-500/30 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <span class="icon-[mdi--translate]"></span>
                            </div>

                            <div class="flex items-center gap-2 mb-1.5">
                                <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    Bahasa Asing
                                </h3>
                            </div>
                            <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4">
                                Komunikasi, Akademik &amp; Sertifikasi
                            </p>

                            <!-- Micro Topic Chips -->
                            <div class="flex flex-wrap gap-1.5 mb-6">
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">English (IELTS/TOEFL)</span>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">Mandarin (HSK)</span>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">Jepang (JLPT) &amp; Jerman</span>
                            </div>
                        </div>

                        <!-- Card Action Link -->
                        <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-black text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                            <span>Pilih Bahasa</span>
                            <span class="icon-[mdi--arrow-right] text-base"></span>
                        </div>
                    </div>

                    <!-- 4. Programming & Informatika -->
                    <div style="border-radius: 28px !important;"
                        class="group relative bg-white dark:bg-[#131D38] p-6 sm:p-7 border-2 border-amber-100 dark:border-amber-900/50 hover:border-amber-500 dark:hover:border-amber-400 shadow-lg hover:shadow-2xl hover:shadow-amber-500/15 transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 cursor-pointer overflow-hidden"
                        @click="$store.paketPrivat.formData.mataPelajaran = 'Programming / OSN Informatika / Python'; $store.paketPrivat.open('intensif')"
                        onclick="openPrivatPackage('intensif')">
                        
                        <div class="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

                        <div>
                            <!-- Icon Box -->
                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-3xl shadow-md shadow-amber-500/30 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <span class="icon-[mdi--code-tags]"></span>
                            </div>

                            <div class="flex items-center gap-2 mb-1.5">
                                <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                    Informatika
                                </h3>
                            </div>
                            <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4">
                                Competitive Programming &amp; Coding
                            </p>

                            <!-- Micro Topic Chips -->
                            <div class="flex flex-wrap gap-1.5 mb-6">
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">OSN Informatika</span>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">Python &amp; C++ Lanjut</span>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">Algoritma &amp; Web Dev</span>
                            </div>
                        </div>

                        <!-- Card Action Link -->
                        <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-black text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                            <span>Pilih Informatika</span>
                            <span class="icon-[mdi--arrow-right] text-base"></span>
                        </div>
                    </div>

                    <!-- 5. Humaniora & IPS -->
                    <div style="border-radius: 28px !important;"
                        class="group relative bg-white dark:bg-[#131D38] p-6 sm:p-7 border-2 border-rose-100 dark:border-rose-900/50 hover:border-rose-500 dark:hover:border-rose-400 shadow-lg hover:shadow-2xl hover:shadow-rose-500/15 transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 cursor-pointer overflow-hidden"
                        @click="$store.paketPrivat.formData.mataPelajaran = 'Ekonomi / Geografi / Sosiologi / Sejarah'; $store.paketPrivat.open('reguler')"
                        onclick="openPrivatPackage('reguler')">
                        
                        <div class="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

                        <div>
                            <!-- Icon Box -->
                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white text-3xl shadow-md shadow-rose-500/30 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <span class="icon-[mdi--book-open-page-variant]"></span>
                            </div>

                            <div class="flex items-center gap-2 mb-1.5">
                                <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                    Humaniora (IPS)
                                </h3>
                            </div>
                            <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4">
                                Pemahaman Analitis &amp; UTBK-SNBT
                            </p>

                            <!-- Micro Topic Chips -->
                            <div class="flex flex-wrap gap-1.5 mb-6">
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">Ekonomi &amp; Akuntansi</span>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">Geografi &amp; Sosiologi</span>
                                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">Sejarah &amp; Literasi</span>
                            </div>
                        </div>

                        <!-- Card Action Link -->
                        <div class="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-black text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                            <span>Pilih Humaniora</span>
                            <span class="icon-[mdi--arrow-right] text-base"></span>
                        </div>
                    </div>

                </div>
            </section>

            <!-- Program Fokus Akademik Title -->
'@

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldSectionPattern, $newSection)

[System.IO.File]::WriteAllText($privatPath, $privatContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Upgraded Pilihan Subjek Privat section into a stunning and interactive showcase!"
