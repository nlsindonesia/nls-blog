$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$privatContent = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

$oldSection2Pattern = '(?s)<!-- SECTION 2: PENYESUAIAN KHUSUS SESUAI PAKET.*?<!-- SECTION 3: FREKUENSI SESI & WAKTU BELAJAR -->'

$newSection2 = @'
<!-- SECTION 2: PENYESUAIAN KHUSUS SESUAI PAKET (NO WHITE TEXT, HIGH CONTRAST THEMED BLUE) -->
                        <div class="space-y-5 p-5 sm:p-6 rounded-3xl border-2 transition-all duration-300 shadow-sm"
                            :class="{
                                'bg-sky-50/60 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/80': $store.paketPrivat.activePackageKey === 'reguler',
                                'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/80': $store.paketPrivat.activePackageKey === 'intensif',
                                'bg-purple-50/60 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/80': $store.paketPrivat.activePackageKey === 'internasional'
                            }">

                            <!-- Section Header -->
                            <div class="flex items-center gap-3 pb-3.5 border-b"
                                :class="{
                                    'border-sky-200 dark:border-sky-800/80': $store.paketPrivat.activePackageKey === 'reguler',
                                    'border-amber-200 dark:border-amber-800/80': $store.paketPrivat.activePackageKey === 'intensif',
                                    'border-purple-200 dark:border-purple-800/80': $store.paketPrivat.activePackageKey === 'internasional'
                                }">
                                <div class="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-sm"
                                    :style="$store.paketPrivat.activePackageKey === 'reguler' ? 'background: #0284c7 !important; color: #ffffff !important;' : ($store.paketPrivat.activePackageKey === 'intensif' ? 'background: #f59e0b !important; color: #0f172a !important;' : 'background: #7c3aed !important; color: #ffffff !important;')">
                                    <span>2</span>
                                </div>
                                <div>
                                    <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider" x-text="'Penyesuaian ' + $store.paketPrivat.activePackage.title"></h4>
                                    <p class="text-xs text-slate-600 dark:text-slate-400 font-medium">Tentukan mata pelajaran dan target fokus pembelajaran Anda.</p>
                                </div>
                            </div>

                            <!-- INPUT MANUAL MATA PELAJARAN -->
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                                    <span class="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold">
                                        <span class="icon-[mdi--book-open-variant] text-base text-[#0284c7]"></span>
                                        <span>Mata Pelajaran yang Ingin Dipelajari <span class="text-red-500">*</span></span>
                                    </span>
                                    <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Bisa 1 atau beberapa mapel</span>
                                </label>
                                <div class="relative">
                                    <input x-model="$store.paketPrivat.formData.mataPelajaran" required type="text"
                                        placeholder="Contoh: Matematika, Fisika, Kimia, Biologi, Bahasa Inggris, atau materi tertentu..."
                                        class="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 rounded-2xl border-2 border-slate-300 dark:border-slate-700 focus:border-[#0284c7] focus:ring-2 focus:ring-sky-200 text-xs sm:text-sm font-medium placeholder:text-slate-400 shadow-sm transition-all">
                                </div>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400">Tuliskan nama mata pelajaran atau bab khusus yang ingin diperdalam bersama mentor.</p>
                            </div>

                            <!-- ADAPTIVE 1: PAKET REGULER (NO WHITE TEXT, SKY BLUE ACCENT) -->
                            <div x-show="$store.paketPrivat.activePackageKey === 'reguler'" class="space-y-4 pt-1">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="icon-[mdi--target] text-[#0284c7] text-sm"></span>
                                        <span class="text-slate-900 dark:text-white">Pilih Target &amp; Kebutuhan Belajar:</span>
                                        <span class="text-[11px] text-sky-700 dark:text-sky-300 font-semibold">(Klik untuk memilih)</span>
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                        <template x-for="item in [
                                            'Pendampingan Siswa Kurikulum Nasional',
                                            'Persiapan TKA SD, SMP, SMA',
                                            'Pemantapan Konsep & Peningkatan Nilai Rapor',
                                            'Persiapan Ulangan Harian & Ujian Semester (PAS/PAT)'
                                        ]" :key="item">
                                            <div @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.regulerFocus, item)"
                                                class="flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer select-none"
                                                :style="$store.paketPrivat.formData.regulerFocus.includes(item) 
                                                    ? 'background: #e0f2fe !important; border-color: #0284c7 !important; color: #0f172a !important; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.18);' 
                                                    : 'background: #ffffff; border-color: #cbd5e1; color: #0f172a;'">
                                                <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform"
                                                    :style="$store.paketPrivat.formData.regulerFocus.includes(item) 
                                                        ? 'background: #0284c7 !important; color: #ffffff !important;' 
                                                        : 'border: 2px solid #94a3b8; background: transparent; color: transparent;'">
                                                    <span class="icon-[mdi--check] text-xs font-black"></span>
                                                </span>
                                                <span style="color: #0f172a !important;" class="text-xs font-bold leading-snug" x-text="item"></span>
                                            </div>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="icon-[mdi--school] text-[#0284c7] text-sm"></span>
                                        <span class="text-slate-900 dark:text-white">Target Sekolah / Universitas Impian <span class="text-xs text-slate-400 font-normal">(Opsional)</span>:</span>
                                    </label>
                                    <input x-model="$store.paketPrivat.formData.regulerTargetKampus" type="text"
                                        placeholder="Contoh: SMA Negeri 1 / SMA Unggulan / PTN Impian"
                                        class="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 focus:border-[#0284c7] focus:ring-2 focus:ring-sky-200 text-xs font-medium placeholder:text-slate-400">
                                </div>
                            </div>

                            <!-- ADAPTIVE 2: PAKET EXCLUSIVE (NO WHITE TEXT, GOLD ACCENT) -->
                            <div x-show="$store.paketPrivat.activePackageKey === 'intensif'" class="space-y-4 pt-1">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="icon-[mdi--trophy] text-amber-500 text-sm"></span>
                                        <span class="text-slate-900 dark:text-white">Pilih Target &amp; Kebutuhan Belajar:</span>
                                        <span class="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">(Klik untuk memilih)</span>
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                        <template x-for="item in [
                                            'Persiapan OSN Tingkat Kota/Provinsi (SD, SMP, SMA)',
                                            'Pendampingan Siswa SD/SMP Kurikulum Internasional',
                                            'Persiapan SNBT / Mandiri'
                                        ]" :key="item">
                                            <div @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.intensifFocus, item)"
                                                class="flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer select-none"
                                                :style="$store.paketPrivat.formData.intensifFocus.includes(item) 
                                                    ? 'background: #fef3c7 !important; border-color: #f59e0b !important; color: #0f172a !important; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);' 
                                                    : 'background: #ffffff; border-color: #cbd5e1; color: #0f172a;'">
                                                <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform"
                                                    :style="$store.paketPrivat.formData.intensifFocus.includes(item) 
                                                        ? 'background: #f59e0b !important; color: #0f172a !important;' 
                                                        : 'border: 2px solid #94a3b8; background: transparent; color: transparent;'">
                                                    <span class="icon-[mdi--check] text-xs font-black"></span>
                                                </span>
                                                <span style="color: #0f172a !important;" class="text-xs font-bold leading-snug" x-text="item"></span>
                                            </div>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-2 pt-1">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="icon-[mdi--medal] text-amber-500 text-sm"></span>
                                        <span class="text-slate-900 dark:text-white">Pengalaman Siswa di Bidang Olimpiade / Lomba:</span>
                                        <span class="text-[11px] text-slate-400 font-normal">(Opsional)</span>
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                        <div @click="$store.paketPrivat.formData.intensifExperience = ($store.paketPrivat.formData.intensifExperience === 'Pemula (Mulai dari Nol / Fondasi Konsep)' ? '' : 'Pemula (Mulai dari Nol / Fondasi Konsep)')"
                                            class="flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer select-none"
                                            :style="$store.paketPrivat.formData.intensifExperience === 'Pemula (Mulai dari Nol / Fondasi Konsep)' 
                                                ? 'background: #fef3c7 !important; border-color: #f59e0b !important; color: #0f172a !important; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);' 
                                                : 'background: #ffffff; border-color: #cbd5e1; color: #0f172a;'">
                                            <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform"
                                                :style="$store.paketPrivat.formData.intensifExperience === 'Pemula (Mulai dari Nol / Fondasi Konsep)' 
                                                    ? 'background: #f59e0b !important; color: #0f172a !important;' 
                                                    : 'border: 2px solid #94a3b8; background: transparent; color: transparent;'">
                                                <span class="icon-[mdi--check] text-xs font-black"></span>
                                            </span>
                                            <div>
                                                <div style="color: #0f172a !important;" class="font-bold text-xs">Pemula (Mulai dari Nol)</div>
                                                <div style="color: #475569 !important;" class="text-[10px] font-medium">Fondasi &amp; Konsep Dasar</div>
                                            </div>
                                        </div>
                                        <div @click="$store.paketPrivat.formData.intensifExperience = ($store.paketPrivat.formData.intensifExperience === 'Menengah (Pernah ikut seleksi sekolah / lomba)' ? '' : 'Menengah (Pernah ikut seleksi sekolah / lomba)')"
                                            class="flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer select-none"
                                            :style="$store.paketPrivat.formData.intensifExperience === 'Menengah (Pernah ikut seleksi sekolah / lomba)' 
                                                ? 'background: #fef3c7 !important; border-color: #f59e0b !important; color: #0f172a !important; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);' 
                                                : 'background: #ffffff; border-color: #cbd5e1; color: #0f172a;'">
                                            <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform"
                                                :style="$store.paketPrivat.formData.intensifExperience === 'Menengah (Pernah ikut seleksi sekolah / lomba)' 
                                                ? 'background: #f59e0b !important; color: #0f172a !important;' 
                                                : 'border: 2px solid #94a3b8; background: transparent; color: transparent;'">
                                                <span class="icon-[mdi--check] text-xs font-black"></span>
                                            </span>
                                            <div>
                                                <div style="color: #0f172a !important;" class="font-bold text-xs">Pernah Ikut Seleksi / Lomba</div>
                                                <div style="color: #475569 !important;" class="text-[10px] font-medium">Siap Latihan Soal Lanjut</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- ADAPTIVE 3: PAKET JUARA (NO WHITE TEXT, PURPLE ACCENT) -->
                            <div x-show="$store.paketPrivat.activePackageKey === 'internasional'" class="space-y-4 pt-1">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="icon-[mdi--earth] text-purple-500 text-sm"></span>
                                        <span class="text-slate-900 dark:text-white">Pilih Target &amp; Kebutuhan Belajar:</span>
                                        <span class="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">(Klik untuk memilih)</span>
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                        <template x-for="item in [
                                            'Persiapan OSN Tingkat Semifinal/Final (SD, SMP, SMA)',
                                            'Pendampingan Siswa SMA Kurikulum Internasional',
                                            'Persiapan Kompetisi Internasional seperti AMO, SEAMO dan sebagainya'
                                        ]" :key="item">
                                            <div @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.internasionalFocus, item)"
                                                class="flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer select-none"
                                                :style="$store.paketPrivat.formData.internasionalFocus.includes(item) 
                                                    ? 'background: #f3e8ff !important; border-color: #7c3aed !important; color: #0f172a !important; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.18);' 
                                                    : 'background: #ffffff; border-color: #cbd5e1; color: #0f172a;'">
                                                <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform"
                                                    :style="$store.paketPrivat.formData.internasionalFocus.includes(item) 
                                                        ? 'background: #7c3aed !important; color: #ffffff !important;' 
                                                        : 'border: 2px solid #94a3b8; background: transparent; color: transparent;'">
                                                    <span class="icon-[mdi--check] text-xs font-black"></span>
                                                </span>
                                                <span style="color: #0f172a !important;" class="text-xs font-bold leading-snug" x-text="item"></span>
                                            </div>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="icon-[mdi--school] text-purple-500 text-sm"></span>
                                        <span class="text-slate-900 dark:text-white">Target Universitas Impian (Luar Negeri / Top PTN):</span>
                                        <span class="text-xs text-slate-400 font-normal">(Opsional)</span>
                                    </label>
                                    <input x-model="$store.paketPrivat.formData.internasionalTargetKampus" type="text"
                                        placeholder="Contoh: National University of Singapore (NUS), NTU, Oxford, MIT, ITB, UI"
                                        class="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-200 text-xs font-medium placeholder:text-slate-400">
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 3: FREKUENSI SESI & WAKTU BELAJAR -->
'@

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldSection2Pattern, $newSection2)

[System.IO.File]::WriteAllText($privatPath, $privatContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated Section 2 with dark text and themed blue accents!"
