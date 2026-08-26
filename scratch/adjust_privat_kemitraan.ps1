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
                            <span class="icon-[mdi--handshake] text-base text-white"></span>
                            <span>Jaringan Kemitraan Resmi &amp; Prestisius</span>
                        </div>
                        <h2 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                            Dipercaya oleh <span style="color: #0284c7 !important;">100+ Sekolah Unggulan</span> &amp; Lembaga Nasional
                        </h2>
                        <p class="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            Siswa les privat Next Level Study berasal dari berbagai sekolah unggulan, dinas pendidikan daerah, dan institusi pendidikan terkemuka di seluruh Indonesia.
                        </p>
                    </div>

                    <!-- 3 Featured Pillar Chips (Robust Flexbox, Valid Icons & High Contrast) -->
                    <div style="display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; width: 100%; max-width: 920px; margin: 0 auto;">
                        
                        <!-- Chip 1: Dinas Pendidikan & B2G -->
                        <div style="flex: 1 1 250px; max-width: 290px; border-radius: 20px !important; border: 1.5px solid #bfdbfe; background: #ffffff; padding: 12px 18px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);"
                            class="dark:bg-[#131D38] dark:border-slate-700">
                            <div style="width: 44px; height: 44px; border-radius: 14px; background: #0284c7 !important; color: #ffffff !important; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
                                class="text-2xl shadow-xs">
                                <span class="icon-[mdi--office-building] text-white"></span>
                            </div>
                            <div style="text-align: left; min-width: 0;">
                                <p class="text-xs font-black text-slate-900 dark:text-white leading-tight mb-0.5">Dinas Pendidikan &amp; B2G</p>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-tight">Kerja sama pembinaan daerah</p>
                            </div>
                        </div>

                        <!-- Chip 2: SMA Unggulan & Labschool -->
                        <div style="flex: 1 1 250px; max-width: 290px; border-radius: 20px !important; border: 1.5px solid #fed7aa; background: #ffffff; padding: 12px 18px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);"
                            class="dark:bg-[#131D38] dark:border-slate-700">
                            <div style="width: 44px; height: 44px; border-radius: 14px; background: #f59e0b !important; color: #ffffff !important; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
                                class="text-2xl shadow-xs">
                                <span class="icon-[mdi--school] text-white"></span>
                            </div>
                            <div style="text-align: left; min-width: 0;">
                                <p class="text-xs font-black text-slate-900 dark:text-white leading-tight mb-0.5">SMA Unggulan &amp; Labschool</p>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-tight">Pelatihan OSN, SNBT &amp; TKA</p>
                            </div>
                        </div>

                        <!-- Chip 3: Mutu Terverifikasi & Resmi -->
                        <div style="flex: 1 1 250px; max-width: 290px; border-radius: 20px !important; border: 1.5px solid #a7f3d0; background: #ffffff; padding: 12px 18px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);"
                            class="dark:bg-[#131D38] dark:border-slate-700">
                            <div style="width: 44px; height: 44px; border-radius: 14px; background: #059669 !important; color: #ffffff !important; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
                                class="text-2xl shadow-xs">
                                <span class="icon-[mdi--shield-check] text-white"></span>
                            </div>
                            <div style="text-align: left; min-width: 0;">
                                <p class="text-xs font-black text-slate-900 dark:text-white leading-tight mb-0.5">Mitra Resmi &amp; Terverifikasi</p>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-tight">Pengadaan &amp; mutu terstandar</p>
                            </div>
                        </div>

                    </div>

                    <!-- 20 Sleek & Compact Partner Logos Flex Grid (BULLETPROOF INLINE & CSS STYLING) -->
                    <div class="partner-logo-grid">
                        <div class="partner-logo-item"><img src="/images/mitra/partner-01.jpg" alt="Mitra 1" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-02.jpg" alt="CASIO Education Partner" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-03.jpg" alt="Mitra 3" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-04.jpg" alt="Mitra 4" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-05.jpg" alt="Mitra 5" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-06.jpg" alt="Mitra 6" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-07.jpg" alt="Mitra 7" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-08.jpg" alt="Mitra 8" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-09.jpg" alt="Mitra 9" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-10.jpg" alt="Mitra 10" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-11.jpg" alt="Mitra 11" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-12.jpg" alt="Mitra 12" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-13.jpg" alt="Mitra 13" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-14.jpg" alt="Mitra 14" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-15.jpg" alt="Mitra 15" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-16.jpg" alt="Mitra 16" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-17.jpg" alt="Mitra 17" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-18.jpg" alt="Mitra 18" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-19.jpg" alt="Mitra 19" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                        <div class="partner-logo-item"><img src="/images/mitra/partner-20.jpg" alt="Mitra 20" style="max-width: 56px !important; max-height: 32px !important; width: auto !important; height: auto !important; object-fit: contain !important;" loading="lazy"></div>
                    </div>

                    <p class="text-xs text-slate-500 font-bold text-center -mt-2">... serta 100++ institusi pendidikan mitra lainnya di seluruh Indonesia</p>
                </div>
            </section>

            <!-- Pricing Section -->
'@

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldPattern, $newContent)

[System.IO.File]::WriteAllText($privatPath, $privatContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Adjusted icons, copy, and styling for /privat!"
