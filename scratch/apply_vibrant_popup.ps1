$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$themePath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\theme.js"

# 1. Update theme.js to set empty defaults
$themeContent = [System.IO.File]::ReadAllText($themePath, [System.Text.Encoding]::UTF8)

$oldDefaults = '(?s)regulerFocus:\s*\[.*?\],\s*regulerTargetKampus:.*?catatanKhusus:\s*\x27\x27'
$newDefaults = @'
regulerFocus: [],
                regulerTargetKampus: '',

                // Intensif (Exclusive) Specifics
                intensifFocus: [],
                intensifExperience: '',

                // Internasional (Juara) Specifics
                internasionalFocus: [],
                internasionalTargetKampus: '',

                // Scheduling
                sesiPerBulan: '8 Sesi / Bulan (2x seminggu - Standar)',
                waktuBelajar: 'Sore / Malam (18.30 - 21.00 WIB)',
                hariPreferensi: ['Hari Kerja (Senin - Jumat)'],
                catatanKhusus: ''
'@

$themeContent = [System.Text.RegularExpressions.Regex]::Replace($themeContent, $oldDefaults, $newDefaults)
[System.IO.File]::WriteAllText($themePath, $themeContent, [System.Text.Encoding]::UTF8)
Write-Host "Updated theme.js with empty defaults!"

# 2. Update privat/index.html Section 2 markup
$privatContent = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

$oldSection2Pattern = '(?s)<!-- SECTION 2: PENYESUAIAN KHUSUS SESUAI PAKET.*?<!-- SECTION 3: FREKUENSI SESI & WAKTU BELAJAR -->'

$newSection2 = @'
<!-- SECTION 2: PENYESUAIAN KHUSUS SESUAI PAKET (COOL, VIBRANT & COLORFUL) -->
                        <div class="space-y-5 p-5 sm:p-6 rounded-3xl border transition-all duration-300 shadow-sm"
                            :class="{
                                'bg-gradient-to-br from-sky-50/80 via-white to-blue-50/50 dark:from-sky-950/30 dark:via-[#0f182e] dark:to-slate-900 border-sky-200 dark:border-sky-800/80': $store.paketPrivat.activePackageKey === 'reguler',
                                'bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 dark:from-amber-950/30 dark:via-[#0f182e] dark:to-slate-900 border-amber-200 dark:border-amber-800/80': $store.paketPrivat.activePackageKey === 'intensif',
                                'bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/50 dark:from-purple-950/30 dark:via-[#0f182e] dark:to-slate-900 border-purple-200 dark:border-purple-800/80': $store.paketPrivat.activePackageKey === 'internasional'
                            }">

                            <div class="flex items-center gap-3 pb-3 border-b"
                                :class="{
                                    'border-sky-100 dark:border-sky-900/60': $store.paketPrivat.activePackageKey === 'reguler',
                                    'border-amber-100 dark:border-amber-900/60': $store.paketPrivat.activePackageKey === 'intensif',
                                    'border-purple-100 dark:border-purple-900/60': $store.paketPrivat.activePackageKey === 'internasional'
                                }">
                                <div class="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-sm"
                                    :class="{
                                        'bg-sky-500 text-white': $store.paketPrivat.activePackageKey === 'reguler',
                                        'bg-amber-500 text-slate-950': $store.paketPrivat.activePackageKey === 'intensif',
                                        'bg-purple-600 text-white': $store.paketPrivat.activePackageKey === 'internasional'
                                    }">2</div>
                                <div>
                                    <h4 class="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider" x-text="'Penyesuaian ' + $store.paketPrivat.activePackage.title"></h4>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">Tentukan mata pelajaran dan target fokus pembelajaran Anda.</p>
                                </div>
                            </div>

                            <!-- INPUT MANUAL MATA PELAJARAN (UNTUK SEMUA PAKET) -->
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                                    <span class="flex items-center gap-1.5">
                                        <span class="icon-[mdi--book-open-variant] text-base text-primary"></span>
                                        <span>Mata Pelajaran yang Ingin Dipelajari <span class="text-red-500">*</span></span>
                                    </span>
                                    <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Bisa 1 atau beberapa mapel</span>
                                </label>
                                <div class="relative">
                                    <input x-model="$store.paketPrivat.formData.mataPelajaran" required type="text"
                                        placeholder="Contoh: Matematika, Fisika, Kimia, Biologi, Bahasa Inggris, atau materi tertentu..."
                                        class="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary text-xs sm:text-sm font-medium placeholder:text-slate-400 shadow-sm transition-all">
                                </div>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400">Tuliskan nama mata pelajaran atau bab khusus yang ingin diperdalam bersama mentor.</p>
                            </div>

                            <!-- ADAPTIVE 1: PAKET REGULER (VIBRANT SKY BLUE CARDS) -->
                            <div x-show="$store.paketPrivat.activePackageKey === 'reguler'" class="space-y-4 pt-1">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="icon-[mdi--target] text-sky-500 text-sm"></span>
                                        <span>Pilih Target &amp; Kebutuhan Belajar:</span>
                                        <span class="text-[11px] text-slate-400 font-normal">(Klik untuk memilih)</span>
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                        <template x-for="item in [
                                            'Pendampingan Siswa Kurikulum Nasional',
                                            'Persiapan TKA SD, SMP, SMA',
                                            'Pemantapan Konsep & Peningkatan Nilai Rapor',
                                            'Persiapan Ulangan Harian & Ujian Semester (PAS/PAT)'
                                        ]" :key="item">
                                            <div @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.regulerFocus, item)"
                                                class="flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none"
                                                :class="$store.paketPrivat.formData.regulerFocus.includes(item) 
                                                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-transparent shadow-md shadow-sky-500/25 scale-[1.01]' 
                                                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:border-sky-300 hover:bg-sky-50/50 dark:hover:bg-slate-800'">
                                                <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform"
                                                    :class="$store.paketPrivat.formData.regulerFocus.includes(item) 
                                                        ? 'bg-white text-sky-600 font-black shadow-xs scale-110' 
                                                        : 'border-2 border-slate-300 dark:border-slate-600 bg-transparent text-transparent'">
                                                    <span class="icon-[mdi--check] text-xs"></span>
                                                </span>
                                                <span class="text-xs font-bold leading-snug" x-text="item"></span>
                                            </div>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="icon-[mdi--school] text-sky-500 text-sm"></span>
                                        <span>Target Sekolah / Universitas Impian <span class="text-xs text-slate-400 font-normal">(Opsional)</span>:</span>
                                    </label>
                                    <input x-model="$store.paketPrivat.formData.regulerTargetKampus" type="text"
                                        placeholder="Contoh: SMA Negeri 1 / SMA Unggulan / PTN Impian"
                                        class="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#0284c7] text-xs font-medium placeholder:text-slate-400">
                                </div>
                            </div>

                            <!-- ADAPTIVE 2: PAKET EXCLUSIVE (VIBRANT GOLD/AMBER CARDS) -->
                            <div x-show="$store.paketPrivat.activePackageKey === 'intensif'" class="space-y-4 pt-1">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="icon-[mdi--trophy] text-amber-500 text-sm"></span>
                                        <span>Pilih Target &amp; Kebutuhan Belajar:</span>
                                        <span class="text-[11px] text-slate-400 font-normal">(Klik untuk memilih)</span>
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                        <template x-for="item in [
                                            'Persiapan OSN Tingkat Kota/Provinsi (SD, SMP, SMA)',
                                            'Pendampingan Siswa SD/SMP Kurikulum Internasional',
                                            'Persiapan SNBT / Mandiri'
                                        ]" :key="item">
                                            <div @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.intensifFocus, item)"
                                                class="flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none"
                                                :class="$store.paketPrivat.formData.intensifFocus.includes(item) 
                                                    ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-transparent shadow-md shadow-amber-500/30 scale-[1.01]' 
                                                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-slate-800'">
                                                <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform"
                                                    :class="$store.paketPrivat.formData.intensifFocus.includes(item) 
                                                        ? 'bg-slate-950 text-amber-400 font-black shadow-xs scale-110' 
                                                        : 'border-2 border-slate-300 dark:border-slate-600 bg-transparent text-transparent'">
                                                    <span class="icon-[mdi--check] text-xs"></span>
                                                </span>
                                                <span class="text-xs font-bold leading-snug" x-text="item"></span>
                                            </div>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-2 pt-1">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="icon-[mdi--medal] text-amber-500 text-sm"></span>
                                        <span>Pengalaman Siswa di Bidang Olimpiade / Lomba:</span>
                                        <span class="text-[11px] text-slate-400 font-normal">(Opsional)</span>
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                        <div @click="$store.paketPrivat.formData.intensifExperience = ($store.paketPrivat.formData.intensifExperience === 'Pemula (Mulai dari Nol / Fondasi Konsep)' ? '' : 'Pemula (Mulai dari Nol / Fondasi Konsep)')"
                                            class="flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none"
                                            :class="$store.paketPrivat.formData.intensifExperience === 'Pemula (Mulai dari Nol / Fondasi Konsep)' 
                                                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-transparent shadow-md shadow-amber-500/30 scale-[1.01]' 
                                                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-slate-800'">
                                            <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform"
                                                :class="$store.paketPrivat.formData.intensifExperience === 'Pemula (Mulai dari Nol / Fondasi Konsep)' 
                                                    ? 'bg-slate-950 text-amber-400 font-black scale-110' 
                                                    : 'border-2 border-slate-300 dark:border-slate-600 bg-transparent text-transparent'">
                                                <span class="icon-[mdi--check] text-xs"></span>
                                            </span>
                                            <div>
                                                <div class="font-bold text-xs">Pemula (Mulai dari Nol)</div>
                                                <div class="text-[10px] opacity-80">Fondasi &amp; Konsep Dasar</div>
                                            </div>
                                        </div>
                                        <div @click="$store.paketPrivat.formData.intensifExperience = ($store.paketPrivat.formData.intensifExperience === 'Menengah (Pernah ikut seleksi sekolah / lomba)' ? '' : 'Menengah (Pernah ikut seleksi sekolah / lomba)')"
                                            class="flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none"
                                            :class="$store.paketPrivat.formData.intensifExperience === 'Menengah (Pernah ikut seleksi sekolah / lomba)' 
                                                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-transparent shadow-md shadow-amber-500/30 scale-[1.01]' 
                                                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-slate-800'">
                                            <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform"
                                                :class="$store.paketPrivat.formData.intensifExperience === 'Menengah (Pernah ikut seleksi sekolah / lomba)' 
                                                    ? 'bg-slate-950 text-amber-400 font-black scale-110' 
                                                    : 'border-2 border-slate-300 dark:border-slate-600 bg-transparent text-transparent'">
                                                <span class="icon-[mdi--check] text-xs"></span>
                                            </span>
                                            <div>
                                                <div class="font-bold text-xs">Pernah Ikut Seleksi / Lomba</div>
                                                <div class="text-[10px] opacity-80">Siap Latihan Soal Lanjut</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- ADAPTIVE 3: PAKET JUARA (VIBRANT ROYAL PURPLE CARDS) -->
                            <div x-show="$store.paketPrivat.activePackageKey === 'internasional'" class="space-y-4 pt-1">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="icon-[mdi--earth] text-purple-500 text-sm"></span>
                                        <span>Pilih Target &amp; Kebutuhan Belajar:</span>
                                        <span class="text-[11px] text-slate-400 font-normal">(Klik untuk memilih)</span>
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                                        <template x-for="item in [
                                            'Persiapan OSN Tingkat Semifinal/Final (SD, SMP, SMA)',
                                            'Pendampingan Siswa SMA Kurikulum Internasional',
                                            'Persiapan Kompetisi Internasional seperti AMO, SEAMO dan sebagainya'
                                        ]" :key="item">
                                            <div @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.internasionalFocus, item)"
                                                class="flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none"
                                                :class="$store.paketPrivat.formData.internasionalFocus.includes(item) 
                                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-md shadow-purple-500/25 scale-[1.01]' 
                                                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-slate-800'">
                                                <span class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform"
                                                    :class="$store.paketPrivat.formData.internasionalFocus.includes(item) 
                                                        ? 'bg-white text-purple-600 font-black shadow-xs scale-110' 
                                                        : 'border-2 border-slate-300 dark:border-slate-600 bg-transparent text-transparent'">
                                                    <span class="icon-[mdi--check] text-xs"></span>
                                                </span>
                                                <span class="text-xs font-bold leading-snug" x-text="item"></span>
                                            </div>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <span class="icon-[mdi--school] text-purple-500 text-sm"></span>
                                        <span>Target Universitas Impian (Luar Negeri / Top PTN):</span>
                                        <span class="text-xs text-slate-400 font-normal">(Opsional)</span>
                                    </label>
                                    <input x-model="$store.paketPrivat.formData.internasionalTargetKampus" type="text"
                                        placeholder="Contoh: National University of Singapore (NUS), NTU, Oxford, MIT, ITB, UI"
                                        class="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#7c3aed] text-xs font-medium placeholder:text-slate-400">
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 3: FREKUENSI SESI & WAKTU BELAJAR -->
'@

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldSection2Pattern, $newSection2)

[System.IO.File]::WriteAllText($privatPath, $privatContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Applied vibrant and colorful Section 2 design to privat/index.html!"
