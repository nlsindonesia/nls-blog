$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$privatContent = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

$oldPattern = '(?s)<!-- ===== 7\. JARINGAN MITRA & KOLABORASI RESMI.*?<!-- Pricing Section -->'

$newContent = @'
<!-- ===== 7. JARINGAN MITRA & KOLABORASI RESMI (VIBRANT & COMPACT LOGOS) ===== -->
            <section class="relative py-16 md:py-20 px-4 md:px-8 overflow-hidden bg-gradient-to-b from-[#f0f7ff] via-white to-[#f4faff] dark:from-[#0B132B] dark:via-[#0F1A3A] dark:to-[#0B132B] border-y border-blue-100/80 dark:border-slate-800">
                <!-- Background Glow Orbs -->
                <div class="absolute -top-32 -left-32 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"></div>

                <div class="container-max mx-auto w-full flex flex-col gap-10 relative z-10">
                    <!-- Header -->
                    <div class="text-center max-w-3xl mx-auto flex flex-col items-center gap-3">
                        <div style="background: linear-gradient(90deg, #0284c7, #2563eb, #d97706) !important; color: #ffffff !important;"
                            class="inline-flex items-center gap-2 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                            <span class="icon-[mdi--handshake] text-base"></span>
                            <span>Jaringan Kemitraan Resmi &amp; Prestisius</span>
                        </div>
                        <h2 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                            Dipercaya oleh <span style="color: #0284c7 !important;">100+ Sekolah Unggulan</span> &amp; Lembaga Nasional
                        </h2>
                        <p class="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            Next Level Study menjalin kemitraan erat bersama dinas pendidikan, sekolah menengah atas favorit, dan institusi resmi di seluruh penjuru Indonesia.
                        </p>
                    </div>

                    <!-- 3 Featured Pillar Chips (Fixed Solid Background & Iconify Icons) -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-4xl mx-auto w-full">
                        <div style="border-radius: 20px !important; border: 1.5px solid #bfdbfe;"
                            class="bg-white dark:bg-[#131D38] dark:border-slate-700 p-3.5 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
                            <div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #0284c7, #0369a1) !important; color: #ffffff !important;"
                                class="flex items-center justify-center text-xl shadow-xs shrink-0">
                                <span class="icon-[mdi--bank]"></span>
                            </div>
                            <div class="text-left min-w-0">
                                <p class="text-xs font-black text-slate-900 dark:text-white">Dinas Pendidikan &amp; B2G</p>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Kerja sama pembinaan daerah</p>
                            </div>
                        </div>

                        <div style="border-radius: 20px !important; border: 1.5px solid #fed7aa;"
                            class="bg-white dark:bg-[#131D38] dark:border-slate-700 p-3.5 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
                            <div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #d97706) !important; color: #ffffff !important;"
                                class="flex items-center justify-center text-xl shadow-xs shrink-0">
                                <span class="icon-[mdi--school]"></span>
                            </div>
                            <div class="text-left min-w-0">
                                <p class="text-xs font-black text-slate-900 dark:text-white">SMA Unggulan &amp; Labschool</p>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Pelatihan OSN, SNBT &amp; TKA</p>
                            </div>
                        </div>

                        <div style="border-radius: 20px !important; border: 1.5px solid #a7f3d0;"
                            class="bg-white dark:bg-[#131D38] dark:border-slate-700 p-3.5 shadow-xs flex items-center gap-3.5 hover:shadow-md transition-all">
                            <div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #059669, #047857) !important; color: #ffffff !important;"
                                class="flex items-center justify-center text-xl shadow-xs shrink-0">
                                <span class="icon-[mdi--check-decagram]"></span>
                            </div>
                            <div class="text-left min-w-0">
                                <p class="text-xs font-black text-slate-900 dark:text-white">SIPLaH Kemendikbud</p>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Pengadaan resmi terverifikasi</p>
                            </div>
                        </div>
                    </div>

                    <!-- 20 Sleek & Compact Partner Logos Grid -->
                    <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-3 items-center max-w-5xl mx-auto w-full">
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-sky-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-01.jpg" alt="Mitra 1" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-sky-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-02.jpg" alt="CASIO Education Partner" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-amber-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-03.jpg" alt="Mitra 3" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-indigo-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-04.jpg" alt="Mitra 4" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-emerald-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-05.jpg" alt="Mitra 5" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-cyan-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-06.jpg" alt="Mitra 6" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-blue-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-07.jpg" alt="Mitra 7" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-purple-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-08.jpg" alt="Mitra 8" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-rose-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-09.jpg" alt="Mitra 9" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-teal-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-10.jpg" alt="Mitra 10" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-amber-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-11.jpg" alt="Mitra 11" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-blue-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-12.jpg" alt="Mitra 12" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-emerald-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-13.jpg" alt="Mitra 13" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-indigo-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-14.jpg" alt="Mitra 14" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-sky-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-15.jpg" alt="Mitra 15" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-orange-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-16.jpg" alt="Mitra 16" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-violet-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-17.jpg" alt="Mitra 17" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-pink-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-18.jpg" alt="Mitra 18" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-cyan-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-19.jpg" alt="Mitra 19" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                        <div class="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-emerald-400 shadow-2xs hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center h-14 sm:h-16">
                            <img src="/images/mitra/partner-20.jpg" alt="Mitra 20" class="max-h-8 sm:max-h-9 max-w-full object-contain" loading="lazy">
                        </div>
                    </div>

                    <p class="text-xs text-slate-500 font-bold text-center -mt-4">... serta 100++ institusi pendidikan mitra lainnya di seluruh Indonesia</p>

                    <!-- SIPLaH Kemendikbud & Kemitraan Card -->
                    <div style="border-radius: 28px !important; border: 1.5px solid #bfdbfe;"
                        class="bg-white dark:bg-[#131D38] dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md max-w-5xl mx-auto w-full">
                        <div class="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                            <div class="bg-white p-3 rounded-2xl border border-blue-100 shadow-xs shrink-0">
                                <img src="/images/mitra/siplah.jpg" alt="Logo Resmi SIPLaH Kemendikbudristek" class="h-12 w-auto object-contain">
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700 bg-emerald-100/80 px-3 py-0.5 rounded-full w-max mx-auto sm:mx-0">
                                    <span class="icon-[mdi--check-decagram] text-sm"></span>
                                    Terdaftar Resmi di SIPLaH Kemendikbudristek
                                </span>
                                <h3 class="text-base md:text-lg font-black text-slate-900 dark:text-white">Kemudahan Pengadaan Sekolah Secara Transparan</h3>
                                <p class="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-xl font-medium">
                                    Seluruh produk bimbingan belajar, pelatihan OSN, paket CBT Tryout, dan asesmen psikotes dapat dipesan langsung oleh pihak sekolah melalui platform SIPLaH resmi.
                                </p>
                            </div>
                        </div>
                        <div class="shrink-0">
                            <a href="/mitra" style="border-radius: 9999px !important; background: linear-gradient(90deg, #0284c7, #0369a1) !important; color: #ffffff !important;"
                                class="font-black text-xs sm:text-sm h-[46px] px-7 shadow-md hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                                <span>Buka Halaman Mitra</span>
                                <span class="icon-[mdi--arrow-right] text-base"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Pricing Section -->
'@

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldPattern, $newContent)

[System.IO.File]::WriteAllText($privatPath, $privatContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Fixed chip icons and made partner logos compact & sleek!"
