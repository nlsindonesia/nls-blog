$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$content = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

$oldPricingSection = '(?s)<!-- Pricing Section -->.*?<!-- ===== POP-UP MODAL FORM KEBUTUHAN PRIVAT SESUAI PAKET ===== -->'

$newPricingSection = @'
<!-- Pricing Section -->
            <section id="paket"
                class="py-24 bg-gradient-to-b from-[#F0F6FF] via-white to-[#F0F6FF] dark:from-[#0B132B] dark:via-[#0F1A3A] dark:to-[#0B132B] border-y border-slate-200 dark:border-slate-800">
                <div class="px-4 md:px-8 container-max">
                    <div class="text-center mb-16 max-w-3xl mx-auto space-y-4">
                        <div
                            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-sky-950/80 border border-blue-200 dark:border-sky-800 text-blue-700 dark:text-sky-300 text-xs font-extrabold uppercase tracking-widest">
                            <span class="icon-[mdi--tag-outline] text-base"></span>
                            Investasi Pendidikan Terbaik
                        </div>
                        <h2
                            class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                            Pilihan Paket Les Privat NLS
                        </h2>
                        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            Pendampingan 1-on-1 intensif dan terstruktur dengan mentor terbaik untuk mendongkrak nilai
                            sekolah, meloloskan UTBK-SNBT, hingga menembus medali olimpiade dunia.
                        </p>
                    </div>

                    <div x-data class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">

                        <!-- 1. Paket Reguler -->
                        <div
                            class="bg-white dark:bg-[#131D38] p-8 md:p-9 rounded-[36px] border-2 border-sky-100 dark:border-sky-900/60 shadow-lg hover:shadow-2xl hover:border-sky-400 transition-all duration-300 flex flex-col justify-between relative group">
                            <div class="flex flex-col flex-1">
                                <!-- Top Badge -->
                                <div class="mb-4 h-8 flex items-center">
                                    <span
                                        style="background: #e0f2fe !important; color: #0284c7 !important; border: 1.5px solid #bae6fd !important; padding: 5px 16px !important; border-radius: 9999px !important; font-size: 0.8rem !important; font-weight: 800 !important; display: inline-flex !important; align-items: center !important; gap: 8px !important; white-space: nowrap !important;"
                                        class="shadow-sm">
                                        <span class="icon-[mdi--school] text-base"></span>
                                        Kurikulum Nasional &amp; TKA
                                    </span>
                                </div>

                                <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Paket Reguler</h3>
                                
                                <!-- Diperuntukkan Untuk (Reguler) - Pill Curved Shape & Compact Spacing -->
                                <div class="mb-6 space-y-2.5 min-h-[165px] lg:min-h-[175px] flex flex-col justify-start">
                                    <div style="background: #e0f2fe !important; border: 1.5px solid #bae6fd !important; color: #0369a1 !important; border-radius: 9999px !important;"
                                        class="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-black uppercase tracking-wider self-start shadow-2xs mb-0.5">
                                        <span style="background: #0284c7; border-radius: 9999px;" class="w-2 h-2"></span>
                                        <span>Diperuntukkan Untuk:</span>
                                    </div>
                                    <div class="space-y-2">
                                        <div style="background: #f0f9ff !important; border: 1.5px solid #bae6fd !important; border-radius: 9999px !important;"
                                            class="py-2.5 px-4 flex items-center gap-3 shadow-2xs transition-all hover:border-sky-400">
                                            <span style="background: #0284c7 !important; color: #ffffff !important; border-radius: 9999px !important;"
                                                class="w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 shadow-xs">1</span>
                                            <span style="color: #0f172a !important;" class="text-xs sm:text-[13px] font-bold leading-tight">Pendampingan siswa Kurikulum Nasional</span>
                                        </div>
                                        <div style="background: #f0f9ff !important; border: 1.5px solid #bae6fd !important; border-radius: 9999px !important;"
                                            class="py-2.5 px-4 flex items-center gap-3 shadow-2xs transition-all hover:border-sky-400">
                                            <span style="background: #0284c7 !important; color: #ffffff !important; border-radius: 9999px !important;"
                                                class="w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 shadow-xs">2</span>
                                            <span style="color: #0f172a !important;" class="text-xs sm:text-[13px] font-bold leading-tight">Persiapan TKA SD, SMP, SMA</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Price Block (Horizontally Aligned) -->
                                <div class="pt-5 pb-3 border-t border-slate-100 dark:border-slate-800/80 mb-6">
                                    <div class="flex items-baseline gap-1.5 mb-1">
                                        <span style="color: #0284c7 !important;"
                                            class="text-3xl sm:text-4xl font-black tracking-tight">Rp 120.000</span>
                                        <span class="text-sm font-bold text-slate-500 dark:text-slate-400">/ Jam</span>
                                    </div>
                                    <span style="color: #0284c7 !important;"
                                        class="text-xs font-extrabold inline-block">Bimbingan 1-on-1 Intensif</span>
                                </div>

                                <!-- Feature List -->
                                <div class="space-y-3.5 mb-7 min-h-[185px] flex flex-col justify-start">
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-emerald-500 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">Ideal 8 sesi per bulan</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-emerald-500 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">Kurikulum Nasional Terpadu</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-emerald-500 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">Mentor Kampus Top Terverifikasi</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-emerald-500 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">Support LMS &amp; Try Out Bulanan</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Bottom Button -->
                            <div class="pt-2">
                                <button type="button" @click="$store.paketPrivat.open('reguler')" onclick="openPrivatPackage('reguler')"
                                    style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important; box-shadow: 0 8px 20px rgba(2, 132, 199, 0.35) !important;"
                                    class="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg">
                                    <span class="icon-[mdi--pencil-plus] text-xl"></span>
                                    Pilih Paket Reguler
                                </button>
                            </div>
                        </div>

                        <!-- 2. Paket Exclusive (Sebelumnya: Paket Intensif OSN & IB) -->
                        <div style="background: linear-gradient(165deg, #0b224d 0%, #061530 100%) !important; color: #ffffff !important; border: 2.5px solid #f59e0b !important; box-shadow: 0 20px 45px -10px rgba(11, 34, 77, 0.6), 0 0 25px rgba(245, 158, 11, 0.3) !important;"
                            class="p-8 md:p-9 rounded-[36px] relative flex flex-col justify-between group z-20">

                            <!-- Top Recommendation Ribbon -->
                            <div style="background: linear-gradient(90deg, #f59e0b, #ea580c) !important; color: #ffffff !important; box-shadow: 0 6px 18px rgba(234, 88, 12, 0.4) !important; padding: 6px 20px !important; border-radius: 9999px !important; font-size: 0.75rem !important; font-weight: 900 !important; letter-spacing: 0.05em !important; display: inline-flex !important; align-items: center !important; gap: 8px !important; white-space: nowrap !important; border: 1.5px solid rgba(255, 255, 255, 0.35) !important;"
                                class="absolute -top-4 left-1/2 -translate-x-1/2 uppercase tracking-wider">
                                <span class="icon-[mdi--fire] text-base animate-bounce"></span>
                                PALING DIMINATI &bull; REKOMENDASI
                            </div>

                            <div class="flex flex-col flex-1">
                                <!-- Top Badge -->
                                <div class="mb-4 h-8 flex items-center">
                                    <span
                                        style="background: rgba(245, 158, 11, 0.2) !important; border: 1.5px solid rgba(245, 158, 11, 0.5) !important; color: #fde047 !important; padding: 5px 16px !important; border-radius: 9999px !important; font-size: 0.8rem !important; font-weight: 800 !important; display: inline-flex !important; align-items: center !important; gap: 8px !important; white-space: nowrap !important;">
                                        <span class="icon-[mdi--trophy] text-base"></span>
                                        OSN Kota/Provinsi &amp; SNBT
                                    </span>
                                </div>

                                <h3 style="color: #ffffff !important;" class="text-2xl sm:text-3xl font-black mb-4 tracking-tight">Paket Exclusive</h3>
                                
                                <!-- Diperuntukkan Untuk (Exclusive) - Pill Curved Shape & Compact Spacing -->
                                <div class="mb-6 space-y-2.5 min-h-[165px] lg:min-h-[175px] flex flex-col justify-start">
                                    <div style="background: rgba(245, 158, 11, 0.25) !important; border: 1.5px solid rgba(245, 158, 11, 0.6) !important; color: #fde047 !important; border-radius: 9999px !important;"
                                        class="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-black uppercase tracking-wider self-start shadow-2xs mb-0.5">
                                        <span style="background: #fbbf24; border-radius: 9999px;" class="w-2 h-2 animate-pulse"></span>
                                        <span>Diperuntukkan Untuk:</span>
                                    </div>
                                    <div class="space-y-2">
                                        <div style="background: rgba(255, 255, 255, 0.08) !important; border: 1.5px solid rgba(245, 158, 11, 0.4) !important; border-radius: 9999px !important;"
                                            class="py-2.5 px-4 flex items-center gap-3 shadow-2xs backdrop-blur-xs transition-all hover:border-amber-400">
                                            <span style="background: linear-gradient(135deg, #f59e0b, #d97706) !important; color: #0b1727 !important; border-radius: 9999px !important;"
                                                class="w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 shadow-xs">1</span>
                                            <span style="color: #ffffff !important;" class="text-xs sm:text-[13px] font-bold leading-tight">Persiapan OSN Tingkat Kota/Provinsi (SD, SMP, SMA)</span>
                                        </div>
                                        <div style="background: rgba(255, 255, 255, 0.08) !important; border: 1.5px solid rgba(245, 158, 11, 0.4) !important; border-radius: 9999px !important;"
                                            class="py-2.5 px-4 flex items-center gap-3 shadow-2xs backdrop-blur-xs transition-all hover:border-amber-400">
                                            <span style="background: linear-gradient(135deg, #f59e0b, #d97706) !important; color: #0b1727 !important; border-radius: 9999px !important;"
                                                class="w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 shadow-xs">2</span>
                                            <span style="color: #ffffff !important;" class="text-xs sm:text-[13px] font-bold leading-tight">Pendampingan siswa SD/SMP Kurikulum Internasional</span>
                                        </div>
                                        <div style="background: rgba(255, 255, 255, 0.08) !important; border: 1.5px solid rgba(245, 158, 11, 0.4) !important; border-radius: 9999px !important;"
                                            class="py-2.5 px-4 flex items-center gap-3 shadow-2xs backdrop-blur-xs transition-all hover:border-amber-400">
                                            <span style="background: linear-gradient(135deg, #f59e0b, #d97706) !important; color: #0b1727 !important; border-radius: 9999px !important;"
                                                class="w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 shadow-xs">3</span>
                                            <span style="color: #ffffff !important;" class="text-xs sm:text-[13px] font-bold leading-tight">Persiapan SNBT / Mandiri</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Price Block (Horizontally Aligned) -->
                                <div style="border-color: rgba(255, 255, 255, 0.15);" class="pt-5 pb-3 border-t mb-6">
                                    <div class="flex items-baseline gap-1.5 mb-1">
                                        <span style="color: #fbbf24 !important;"
                                            class="text-3xl sm:text-4xl font-black tracking-tight">Rp 160.000</span>
                                        <span style="color: #94a3b8 !important;" class="text-sm font-bold">/ Jam</span>
                                    </div>
                                    <span style="color: #fde68a !important;"
                                        class="text-xs font-extrabold inline-flex items-center gap-1.5">
                                        <span class="icon-[mdi--star] text-amber-300 text-sm"></span>
                                        Paket Terfavorit Siswa Berprestasi
                                    </span>
                                </div>

                                <!-- Feature List -->
                                <div class="space-y-3.5 mb-7 min-h-[185px] flex flex-col justify-start">
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-amber-400 text-xl shrink-0 mt-0.5"></span>
                                        <span style="color: #f8fafc !important;" class="text-xs sm:text-sm font-semibold leading-snug">Ideal 10 sesi per bulan</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-amber-400 text-xl shrink-0 mt-0.5"></span>
                                        <span style="color: #f8fafc !important;" class="text-xs sm:text-sm font-semibold leading-snug">Bank Soal Eksklusif &amp; Modul Bedah Tipe</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-amber-400 text-xl shrink-0 mt-0.5"></span>
                                        <span style="color: #f8fafc !important;" class="text-xs sm:text-sm font-semibold leading-snug">Simulasi Ujian Rutin &amp; Analisis IRT</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-amber-400 text-xl shrink-0 mt-0.5"></span>
                                        <span style="color: #f8fafc !important;" class="text-xs sm:text-sm font-semibold leading-snug">Laporan Progres Detail ke Orang Tua</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-amber-400 text-xl shrink-0 mt-0.5"></span>
                                        <span style="color: #fef08a !important;" class="text-xs sm:text-sm font-black leading-snug">Mentor Medalis &amp; Expert Berpengalaman</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Bottom Button -->
                            <div class="pt-2">
                                <button type="button" @click="$store.paketPrivat.open('intensif')" onclick="openPrivatPackage('intensif')"
                                    style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%) !important; color: #0b1727 !important; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4) !important;"
                                    class="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg">
                                    <span class="icon-[mdi--pencil-plus] text-xl"></span>
                                    Pilih Paket Exclusive
                                </button>
                            </div>
                        </div>

                        <!-- 3. Paket Juara (Sebelumnya: Paket Internasional & OSN+) -->
                        <div
                            class="bg-white dark:bg-[#131D38] p-8 md:p-9 rounded-[36px] border-2 border-purple-100 dark:border-purple-900/60 shadow-lg hover:shadow-2xl hover:border-purple-400 transition-all duration-300 flex flex-col justify-between relative group">
                            <div class="flex flex-col flex-1">
                                <!-- Top Badge -->
                                <div class="mb-4 h-8 flex items-center">
                                    <span
                                        style="background: #f3e8ff !important; color: #7c3aed !important; border: 1.5px solid #ddd6fe !important; padding: 5px 16px !important; border-radius: 9999px !important; font-size: 0.8rem !important; font-weight: 800 !important; display: inline-flex !important; align-items: center !important; gap: 8px !important; white-space: nowrap !important;"
                                        class="shadow-sm">
                                        <span class="icon-[mdi--earth] text-base"></span>
                                        OSN Final &amp; Global (AMO, SEAMO)
                                    </span>
                                </div>

                                <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Paket Juara</h3>
                                
                                <!-- Diperuntukkan Untuk (Juara) - Pill Curved Shape & Compact Spacing -->
                                <div class="mb-6 space-y-2.5 min-h-[165px] lg:min-h-[175px] flex flex-col justify-start">
                                    <div style="background: #f3e8ff !important; border: 1.5px solid #ddd6fe !important; color: #6b21a8 !important; border-radius: 9999px !important;"
                                        class="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-black uppercase tracking-wider self-start shadow-2xs mb-0.5">
                                        <span style="background: #9333ea; border-radius: 9999px;" class="w-2 h-2"></span>
                                        <span>Diperuntukkan Untuk:</span>
                                    </div>
                                    <div class="space-y-2">
                                        <div style="background: #faf5ff !important; border: 1.5px solid #e9d5ff !important; border-radius: 9999px !important;"
                                            class="py-2.5 px-4 flex items-center gap-3 shadow-2xs transition-all hover:border-purple-400">
                                            <span style="background: #7c3aed !important; color: #ffffff !important; border-radius: 9999px !important;"
                                                class="w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 shadow-xs">1</span>
                                            <span style="color: #0f172a !important;" class="text-xs sm:text-[13px] font-bold leading-tight">Persiapan OSN Tingkat Semifinal/Final (SD, SMP, SMA)</span>
                                        </div>
                                        <div style="background: #faf5ff !important; border: 1.5px solid #e9d5ff !important; border-radius: 9999px !important;"
                                            class="py-2.5 px-4 flex items-center gap-3 shadow-2xs transition-all hover:border-purple-400">
                                            <span style="background: #7c3aed !important; color: #ffffff !important; border-radius: 9999px !important;"
                                                class="w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 shadow-xs">2</span>
                                            <span style="color: #0f172a !important;" class="text-xs sm:text-[13px] font-bold leading-tight">Pendampingan siswa SMA Kurikulum Internasional</span>
                                        </div>
                                        <div style="background: #faf5ff !important; border: 1.5px solid #e9d5ff !important; border-radius: 9999px !important;"
                                            class="py-2.5 px-4 flex items-center gap-3 shadow-2xs transition-all hover:border-purple-400">
                                            <span style="background: #7c3aed !important; color: #ffffff !important; border-radius: 9999px !important;"
                                                class="w-6 h-6 flex items-center justify-center text-xs font-black shrink-0 shadow-xs">3</span>
                                            <span style="color: #0f172a !important;" class="text-xs sm:text-[13px] font-bold leading-tight">Persiapan Kompetisi Internasional (AMO, SEAMO, TIMO, dll.)</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Price Block (Horizontally Aligned) -->
                                <div class="pt-5 pb-3 border-t border-slate-100 dark:border-slate-800/80 mb-6">
                                    <div class="flex items-baseline gap-1.5 mb-1">
                                        <span style="color: #7c3aed !important;"
                                            class="text-3xl sm:text-4xl font-black tracking-tight">Rp 200.000</span>
                                        <span class="text-sm font-bold text-slate-500 dark:text-slate-400">/ Jam</span>
                                    </div>
                                    <span style="color: #7c3aed !important;"
                                        class="text-xs font-extrabold inline-block">Bimbingan Champion Level Dunia</span>
                                </div>

                                <!-- Feature List -->
                                <div class="space-y-3.5 mb-7 min-h-[185px] flex flex-col justify-start">
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-purple-600 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">Ideal 8 sesi per bulan</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-purple-600 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">Mentor Pakar Olimpiade Internasional</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-purple-600 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">Standar Kurikulum Internasional (IB/AP)</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-purple-600 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">Portofolio Masuk Universitas Top Dunia</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-purple-600 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">Pendampingan Penuh Kompetisi Global</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Bottom Button -->
                            <div class="pt-2">
                                <button type="button" @click="$store.paketPrivat.open('internasional')" onclick="openPrivatPackage('internasional')"
                                    style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important; color: #ffffff !important; box-shadow: 0 8px 20px rgba(124, 58, 237, 0.35) !important;"
                                    class="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg">
                                    <span class="icon-[mdi--pencil-plus] text-xl"></span>
                                    Pilih Paket Juara
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ===== POP-UP MODAL FORM KEBUTUHAN PRIVAT SESUAI PAKET ===== -->
'@

$content = [System.Text.RegularExpressions.Regex]::Replace($content, $oldPricingSection, $newPricingSection)

[System.IO.File]::WriteAllText($privatPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Applied curved pill design and compact spacing to privat/index.html!"
