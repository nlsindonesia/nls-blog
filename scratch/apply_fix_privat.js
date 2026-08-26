const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'privat', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Card 1 button
content = content.replace(
    /@click="openPackageModal\('reguler'\)"/g,
    '@click="$store.paketPrivat.open(\'reguler\')"'
);

// 2. Update Card 2 button
content = content.replace(
    /@click="openPackageModal\('intensif'\)"/g,
    '@click="$store.paketPrivat.open(\'intensif\')"'
);

// 3. Update Card 3 button
content = content.replace(
    /@click="openPackageModal\('internasional'\)"/g,
    '@click="$store.paketPrivat.open(\'internasional\')"'
);

// 4. Clean modal replacement from `<!-- ===== POP-UP MODAL FORM KEBUTUHAN PRIVAT SESUAI PAKET ===== -->` to `<!-- Event Calendar Modal -->`
const newModal = `    <!-- ===== POP-UP MODAL FORM KEBUTUHAN PRIVAT SESUAI PAKET ===== -->
    <template x-teleport="body">
        <div x-data x-show="$store.paketPrivat.showModal" x-cloak
            x-effect="document.body.style.overflow = $store.paketPrivat.showModal ? 'hidden' : ''"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0"
            x-transition:enter-end="opacity-100"
            x-transition:leave="transition ease-in duration-200"
            x-transition:leave-start="opacity-100"
            x-transition:leave-end="opacity-0"
            class="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            @keydown.escape.window="$store.paketPrivat.close()">

            <!-- Backdrop -->
            <div class="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity" @click="$store.paketPrivat.close()"></div>

            <!-- Modal Window -->
            <div x-show="$store.paketPrivat.showModal" x-cloak
                x-transition:enter="transition ease-out duration-300"
                x-transition:enter-start="opacity-0 scale-95 translate-y-6"
                x-transition:enter-end="opacity-100 scale-100 translate-y-0"
                x-transition:leave="transition ease-in duration-200"
                x-transition:leave-start="opacity-100 scale-100"
                x-transition:leave-end="opacity-0 scale-95 translate-y-4"
                @click.stop
                class="relative bg-white dark:bg-[#0f182e] border border-slate-200 dark:border-slate-800 rounded-[28px] sm:rounded-[36px] shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col z-10 overflow-hidden my-auto">

                <!-- Sticky Header with Dynamic Package Banner -->
                <div class="relative px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800/80 shrink-0"
                    :class="{
                        'bg-gradient-to-r from-sky-50 via-white to-blue-50/50 dark:from-sky-950/40 dark:via-[#0f182e] dark:to-slate-900': $store.paketPrivat.activePackageKey === 'reguler',
                        'bg-gradient-to-r from-amber-50 via-white to-orange-50/50 dark:from-amber-950/40 dark:via-[#0f182e] dark:to-slate-900': $store.paketPrivat.activePackageKey === 'intensif',
                        'bg-gradient-to-r from-purple-50 via-white to-indigo-50/50 dark:from-purple-950/40 dark:via-[#0f182e] dark:to-slate-900': $store.paketPrivat.activePackageKey === 'internasional'
                    }">
                    
                    <!-- Close Button -->
                    <button type="button" @click="$store.paketPrivat.close()"
                        class="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-sm z-10 border border-slate-200 dark:border-slate-700"
                        aria-label="Tutup Formulir">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>

                    <!-- Title & Badge -->
                    <div class="pr-12 space-y-1.5">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-2xs border"
                            :class="{
                                'bg-sky-100 text-[#0284c7] border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800': $store.paketPrivat.activePackageKey === 'reguler',
                                'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800': $store.paketPrivat.activePackageKey === 'intensif',
                                'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800': $store.paketPrivat.activePackageKey === 'internasional'
                            }">
                            <span class="w-2 h-2 rounded-full animate-pulse"
                                :class="{
                                    'bg-sky-500': $store.paketPrivat.activePackageKey === 'reguler',
                                    'bg-amber-500': $store.paketPrivat.activePackageKey === 'intensif',
                                    'bg-purple-500': $store.paketPrivat.activePackageKey === 'internasional'
                                }"></span>
                            <span x-text="$store.paketPrivat.activePackage.badge"></span>
                        </div>

                        <div class="flex flex-wrap items-baseline gap-2 pt-0.5">
                            <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white" x-text="$store.paketPrivat.activePackage.title"></h3>
                            <span class="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400" x-text="$store.paketPrivat.activePackage.price + ' ' + $store.paketPrivat.activePackage.priceUnit"></span>
                        </div>
                        <p class="text-xs text-slate-600 dark:text-slate-300" x-text="'Penyesuaian kebutuhan belajar: ' + $store.paketPrivat.activePackage.tagline"></p>
                    </div>

                    <!-- Package Switcher Tabs -->
                    <div class="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                        <button type="button" @click="$store.paketPrivat.setPackage('reguler')"
                            class="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border"
                            :class="$store.paketPrivat.activePackageKey === 'reguler' ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-sm ring-1 ring-sky-300' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'">
                            Reguler (120rb)
                        </button>
                        <button type="button" @click="$store.paketPrivat.setPackage('intensif')"
                            class="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border"
                            :class="$store.paketPrivat.activePackageKey === 'intensif' ? 'bg-[#f59e0b] text-slate-950 font-black border-[#f59e0b] shadow-sm ring-1 ring-amber-300' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'">
                            Intensif OSN (160rb)
                        </button>
                        <button type="button" @click="$store.paketPrivat.setPackage('internasional')"
                            class="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border"
                            :class="$store.paketPrivat.activePackageKey === 'internasional' ? 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-sm ring-1 ring-purple-300' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'">
                            Internasional (200rb)
                        </button>
                    </div>
                </div>

                <!-- Scrollable Form Body -->
                <div class="px-6 py-6 overflow-y-auto space-y-7 flex-1">
                    <form @submit.prevent="$store.paketPrivat.submitForm()" id="privatPackageForm" class="space-y-6">

                        <!-- SECTION 1: DATA UMUM SISWA -->
                        <div class="space-y-4">
                            <div class="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                                <div class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs">1</div>
                                <h4 class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Data Siswa &amp; Kontak</h4>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <!-- Nama Siswa -->
                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Nama Lengkap Siswa <span class="text-red-500">*</span>
                                    </label>
                                    <input x-model="$store.paketPrivat.formData.namaSiswa" required type="text"
                                        placeholder="Contoh: Muhammad Farhan"
                                        class="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-xs font-medium">
                                </div>

                                <!-- Nama Orang Tua -->
                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Nama Orang Tua / Wali <span class="text-xs text-slate-400 font-normal">(Opsional)</span>
                                    </label>
                                    <input x-model="$store.paketPrivat.formData.namaOrtu" type="text"
                                        placeholder="Contoh: Ibu Rina / Bpk. Hendra"
                                        class="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-xs font-medium">
                                </div>

                                <!-- Nomor WhatsApp -->
                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                                        <span>Nomor WhatsApp Aktif <span class="text-red-500">*</span></span>
                                        <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Untuk konfirmasi jadwal</span>
                                    </label>
                                    <div class="relative">
                                        <input x-model="$store.paketPrivat.formData.noWa" required type="tel"
                                            placeholder="Contoh: 081234567890"
                                            class="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-xs font-medium">
                                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-xs">WA</span>
                                    </div>
                                </div>

                                <!-- Asal Sekolah -->
                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Asal Sekolah Siswa
                                    </label>
                                    <input x-model="$store.paketPrivat.formData.asalSekolah" type="text"
                                        placeholder="Contoh: SMA Negeri 1 Bekasi / Labschool"
                                        class="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-xs font-medium">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <!-- Tingkat / Kelas -->
                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Jenjang &amp; Tingkat Kelas <span class="text-red-500">*</span>
                                    </label>
                                    <select x-model="$store.paketPrivat.formData.tingkatKelas" required
                                        class="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary text-xs font-medium cursor-pointer">
                                        <optgroup label="Tingkat SD (Sekolah Dasar)">
                                            <option value="SD Kelas 4">SD Kelas 4</option>
                                            <option value="SD Kelas 5">SD Kelas 5</option>
                                            <option value="SD Kelas 6">SD Kelas 6</option>
                                        </optgroup>
                                        <optgroup label="Tingkat SMP (Menengah Pertama)">
                                            <option value="SMP Kelas 7">SMP Kelas 7</option>
                                            <option value="SMP Kelas 8">SMP Kelas 8</option>
                                            <option value="SMP Kelas 9">SMP Kelas 9</option>
                                        </optgroup>
                                        <optgroup label="Tingkat SMA / SMK / Sederajat">
                                            <option value="SMA Kelas 10">SMA Kelas 10</option>
                                            <option value="SMA Kelas 11">SMA Kelas 11</option>
                                            <option value="SMA Kelas 12">SMA Kelas 12 (Persiapan SNBT/Ujian)</option>
                                            <option value="Gap Year / Alumni">Gap Year / Alumni / Pejuang PTN</option>
                                        </optgroup>
                                        <optgroup label="Lainnya">
                                            <option value="Mahasiswa / Umum">Mahasiswa / Umum</option>
                                        </optgroup>
                                    </select>
                                </div>

                                <!-- Metode Belajar (Online vs Offline) -->
                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Metode Belajar yang Diinginkan
                                    </label>
                                    <div class="grid grid-cols-2 gap-2">
                                        <button type="button" @click="$store.paketPrivat.formData.metodeBelajar = 'Online (Zoom 1-on-1)'"
                                            class="p-2 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                                            :class="$store.paketPrivat.formData.metodeBelajar === 'Online (Zoom 1-on-1)' ? 'bg-primary text-white border-primary shadow-xs' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'">
                                            <span>🌐 Online 1-on-1</span>
                                        </button>
                                        <button type="button" @click="$store.paketPrivat.formData.metodeBelajar = 'Offline / Tatap Muka (Bekasi & Sekitarnya)'"
                                            class="p-2 rounded-xl border text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                                            :class="$store.paketPrivat.formData.metodeBelajar === 'Offline / Tatap Muka (Bekasi & Sekitarnya)' ? 'bg-primary text-white border-primary shadow-xs' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'">
                                            <span>🏫 Offline / Home</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 2: PENYESUAIAN KHUSUS SESUAI PAKET (ADAPTIVE) -->
                        <div class="p-4 sm:p-5 rounded-2xl border space-y-4 transition-all"
                            :class="{
                                'bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900': $store.paketPrivat.activePackageKey === 'reguler',
                                'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900': $store.paketPrivat.activePackageKey === 'intensif',
                                'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900': $store.paketPrivat.activePackageKey === 'internasional'
                            }">
                            
                            <div class="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800">
                                <div class="flex items-center gap-2">
                                    <div class="w-7 h-7 rounded-lg text-white flex items-center justify-center font-black text-xs"
                                        :class="{
                                            'bg-[#0284c7]': $store.paketPrivat.activePackageKey === 'reguler',
                                            'bg-[#f59e0b] text-slate-950': $store.paketPrivat.activePackageKey === 'intensif',
                                            'bg-[#7c3aed]': $store.paketPrivat.activePackageKey === 'internasional'
                                        }">2</div>
                                    <div>
                                        <h4 class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider" x-text="'Penyesuaian ' + $store.paketPrivat.activePackage.title"></h4>
                                        <p class="text-[11px] text-slate-500 dark:text-slate-400">Pilih target materi dan subjek spesifik yang ingin difokuskan.</p>
                                    </div>
                                </div>
                            </div>

                            <!-- ADAPTIVE 1: PAKET REGULER -->
                            <div x-show="$store.paketPrivat.activePackageKey === 'reguler'" class="space-y-4">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Fokus &amp; Target Belajar Utama:
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <template x-for="item in [
                                            'Persiapan Ulangan Harian & Ujian Semester (PAS/PAT)',
                                            'Pemantapan Konsep & Peningkatan Nilai Rapor',
                                            'Tes Kemampuan Akademik (TKA Saintek/Soshum)',
                                            'Intensif Persiapan UTBK-SNBT 2026'
                                        ]" :key="item">
                                            <label @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.regulerFocus, item)"
                                                class="flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none"
                                                :class="$store.paketPrivat.formData.regulerFocus.includes(item) ? 'bg-[#0284c7] text-white border-[#0284c7] font-bold shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'">
                                                <span class="w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 mt-0.5"
                                                    :class="$store.paketPrivat.formData.regulerFocus.includes(item) ? 'bg-white text-[#0284c7] border-white font-black' : 'border-slate-400'">
                                                    <span x-show="$store.paketPrivat.formData.regulerFocus.includes(item)">✓</span>
                                                </span>
                                                <span x-text="item"></span>
                                            </label>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Mata Pelajaran yang Dibutuhkan (Pilih Mata Pelajaran):
                                    </label>
                                    <div class="flex flex-wrap gap-2 text-xs font-semibold">
                                        <template x-for="subj in ['Matematika Wajib', 'Matematika Peminatan', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Inggris', 'Bahasa Indonesia', 'Ekonomi / Akuntansi', 'Sosiologi / Geografi']" :key="subj">
                                            <button type="button" @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.regulerSubjects, subj)"
                                                class="px-3 py-1.5 rounded-xl border transition-all cursor-pointer"
                                                :class="$store.paketPrivat.formData.regulerSubjects.includes(subj) ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'">
                                                <span x-show="$store.paketPrivat.formData.regulerSubjects.includes(subj)" class="mr-1">✓</span>
                                                <span x-text="subj"></span>
                                            </button>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Target Jurusan &amp; Universitas Impian <span class="text-xs text-slate-400 font-normal">(Khusus pejuang SNBT/PTN)</span>:
                                    </label>
                                    <input x-model="$store.paketPrivat.formData.regulerTargetKampus" type="text"
                                        placeholder="Contoh: FK UI, STEI ITB, Kedokteran UNAIR, Manajemen UGM"
                                        class="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#0284c7] text-xs font-medium">
                                </div>
                            </div>

                            <!-- ADAPTIVE 2: PAKET INTENSIF OSN & IB (SD & SMP) -->
                            <div x-show="$store.paketPrivat.activePackageKey === 'intensif'" class="space-y-4">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Fokus Kurikulum &amp; Tingkat Kompetisi:
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <template x-for="item in [
                                            'Persiapan Olimpiade Sains Nasional (OSN-K / Kota / Kabupaten)',
                                            'Kurikulum Internasional IB (PYP / MYP)',
                                            'Kurikulum Cambridge (Primary / Lower Secondary / Checkpoint)',
                                            'Kurikulum Cambridge IGCSE (SMP/Tingkat Lanjut)'
                                        ]" :key="item">
                                            <label @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.intensifFocus, item)"
                                                class="flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none"
                                                :class="$store.paketPrivat.formData.intensifFocus.includes(item) ? 'bg-[#f59e0b] text-slate-950 border-[#f59e0b] font-bold shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'">
                                                <span class="w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 mt-0.5"
                                                    :class="$store.paketPrivat.formData.intensifFocus.includes(item) ? 'bg-slate-950 text-amber-400 border-slate-950 font-black' : 'border-slate-400'">
                                                    <span x-show="$store.paketPrivat.formData.intensifFocus.includes(item)">✓</span>
                                                </span>
                                                <span x-text="item"></span>
                                            </label>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Bidang Olimpiade / Subjek Fokus:
                                    </label>
                                    <div class="flex flex-wrap gap-2 text-xs font-semibold">
                                        <template x-for="bidang in ['Matematika SD/SMP', 'IPA Fisika SD/SMP', 'IPA Biologi SD/SMP', 'Kimia Dasar', 'Informatika / Logika Koding', 'IPS / Social Studies']" :key="bidang">
                                            <button type="button" @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.intensifBidang, bidang)"
                                                class="px-3 py-1.5 rounded-xl border transition-all cursor-pointer"
                                                :class="$store.paketPrivat.formData.intensifBidang.includes(bidang) ? 'bg-[#f59e0b] text-slate-950 font-bold border-[#f59e0b] shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'">
                                                <span x-show="$store.paketPrivat.formData.intensifBidang.includes(bidang)" class="mr-1">✓</span>
                                                <span x-text="bidang"></span>
                                            </button>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Pengalaman Siswa di Bidang Olimpiade / Lomba:
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <label @click="$store.paketPrivat.formData.intensifExperience = 'Pemula (Mulai dari Nol / Fondasi Konsep)'"
                                            class="flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none"
                                            :class="$store.paketPrivat.formData.intensifExperience === 'Pemula (Mulai dari Nol / Fondasi Konsep)' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 font-bold' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'">
                                            <input type="radio" name="intensifExp" :checked="$store.paketPrivat.formData.intensifExperience === 'Pemula (Mulai dari Nol / Fondasi Konsep)'" class="text-amber-500">
                                            <span>🟢 Pemula (Mulai dari Nol)</span>
                                        </label>
                                        <label @click="$store.paketPrivat.formData.intensifExperience = 'Menengah (Pernah ikut seleksi sekolah / lomba)'"
                                            class="flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none"
                                            :class="$store.paketPrivat.formData.intensifExperience === 'Menengah (Pernah ikut seleksi sekolah / lomba)' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 font-bold' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'">
                                            <input type="radio" name="intensifExp" :checked="$store.paketPrivat.formData.intensifExperience === 'Menengah (Pernah ikut seleksi sekolah / lomba)'" class="text-amber-500">
                                            <span>🔵 Pernah Ikut Seleksi / Lomba</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- ADAPTIVE 3: PAKET INTERNASIONAL & OSN+ (SMA & GLOBAL) -->
                            <div x-show="$store.paketPrivat.activePackageKey === 'internasional'" class="space-y-4">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Target Kompetisi &amp; Kurikulum Global:
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <template x-for="item in [
                                            'OSN Tingkat Provinsi & Nasional (OSN-P / OSNAS)',
                                            'Kompetisi Matematika Global (AMO, SEAMO, TIMO, SASMO)',
                                            'Kurikulum IB Diploma Programme (IB DP HL/SL)',
                                            'Kurikulum Cambridge International A-Level / AP',
                                            'Portofolio Prestasi Menuju Universitas Top Dunia'
                                        ]" :key="item">
                                            <label @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.internasionalFocus, item)"
                                                class="flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none"
                                                :class="$store.paketPrivat.formData.internasionalFocus.includes(item) ? 'bg-[#7c3aed] text-white border-[#7c3aed] font-bold shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'">
                                                <span class="w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 mt-0.5"
                                                    :class="$store.paketPrivat.formData.internasionalFocus.includes(item) ? 'bg-white text-[#7c3aed] border-white font-black' : 'border-slate-400'">
                                                    <span x-show="$store.paketPrivat.formData.internasionalFocus.includes(item)">✓</span>
                                                </span>
                                                <span x-text="item"></span>
                                            </label>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Bidang Spesialisasi OSN 9 Bidang / Sains Lanjut:
                                    </label>
                                    <div class="flex flex-wrap gap-2 text-xs font-semibold">
                                        <template x-for="bidang in ['Matematika SMA', 'Fisika SMA', 'Kimia SMA', 'Biologi SMA', 'Astronomi & Astrofisika', 'Kebumian & Geosains', 'Informatika / Algoritma CP', 'Geografi', 'Ekonomi']" :key="bidang">
                                            <button type="button" @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.internasionalBidang, bidang)"
                                                class="px-3 py-1.5 rounded-xl border transition-all cursor-pointer"
                                                :class="$store.paketPrivat.formData.internasionalBidang.includes(bidang) ? 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-xs' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'">
                                                <span x-show="$store.paketPrivat.formData.internasionalBidang.includes(bidang)" class="mr-1">✓</span>
                                                <span x-text="bidang"></span>
                                            </button>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Target Universitas Impian (Luar Negeri / Top PTN):
                                    </label>
                                    <input x-model="$store.paketPrivat.formData.internasionalTargetKampus" type="text"
                                        placeholder="Contoh: National University of Singapore (NUS), NTU, Oxford, MIT, ITB, UI"
                                        class="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-[#7c3aed] text-xs font-medium">
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 3: FREKUENSI SESI & WAKTU BELAJAR -->
                        <div class="space-y-4">
                            <div class="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                                <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xs">3</div>
                                <h4 class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Rencana Sesi &amp; Waktu</h4>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <!-- Frekuensi Sesi -->
                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Estimasi Sesi Belajar per Bulan:
                                    </label>
                                    <select x-model="$store.paketPrivat.formData.sesiPerBulan"
                                        class="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary text-xs font-medium cursor-pointer">
                                        <option value="8 Sesi / Bulan (2x seminggu - Standar)">8 Sesi / Bulan (2x seminggu - Standar)</option>
                                        <option value="10 Sesi / Bulan (Ideal & Paling Diminati)">10 Sesi / Bulan (Ideal & Paling Diminati)</option>
                                        <option value="12-16 Sesi / Bulan (Intensif Harian / Menjelang Ujian)">12-16 Sesi / Bulan (Intensif Harian / Menjelang Ujian)</option>
                                        <option value="Fleksibel (Disesuaikan bertahap)">Fleksibel (Disesuaikan bertahap)</option>
                                    </select>
                                </div>

                                <!-- Waktu Belajar -->
                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-700 dark:text-slate-200">
                                        Pilihan Waktu Luang Siswa:
                                    </label>
                                    <select x-model="$store.paketPrivat.formData.waktuBelajar"
                                        class="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary text-xs font-medium cursor-pointer">
                                        <option value="Sore / Malam (18.30 - 21.00 WIB)">Sore / Malam (18.30 - 21.00 WIB) • Paling Populer</option>
                                        <option value="Siang (13.00 - 17.00 WIB)">Siang (13.00 - 17.00 WIB)</option>
                                        <option value="Pagi (08.00 - 12.00 WIB)">Pagi (08.00 - 12.00 WIB)</option>
                                        <option value="Fleksibel / Sesuai Kesepakatan Mentor">Fleksibel / Sesuai Kesepakatan Mentor</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Preferensi Hari -->
                            <div class="space-y-1.5 pt-1">
                                <label class="text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Preferensi Hari Belajar:
                                </label>
                                <div class="flex flex-wrap gap-2 text-xs font-medium">
                                    <button type="button" @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.hariPreferensi, 'Hari Kerja (Senin - Jumat)')"
                                        class="px-3 py-1.5 rounded-xl border transition-all cursor-pointer"
                                        :class="$store.paketPrivat.formData.hariPreferensi.includes('Hari Kerja (Senin - Jumat)') ? 'bg-primary text-white border-primary shadow-xs font-bold' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'">
                                        <span x-show="$store.paketPrivat.formData.hariPreferensi.includes('Hari Kerja (Senin - Jumat)')" class="mr-1">✓</span>
                                        <span>Hari Kerja (Senin - Jumat)</span>
                                    </button>
                                    <button type="button" @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.hariPreferensi, 'Akhir Pekan (Sabtu - Minggu)')"
                                        class="px-3 py-1.5 rounded-xl border transition-all cursor-pointer"
                                        :class="$store.paketPrivat.formData.hariPreferensi.includes('Akhir Pekan (Sabtu - Minggu)') ? 'bg-primary text-white border-primary shadow-xs font-bold' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'">
                                        <span x-show="$store.paketPrivat.formData.hariPreferensi.includes('Akhir Pekan (Sabtu - Minggu)')" class="mr-1">✓</span>
                                        <span>Akhir Pekan (Sabtu - Minggu)</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Catatan Tambahan -->
                            <div class="space-y-1.5 pt-1">
                                <label class="text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Catatan Tambahan / Kebutuhan Khusus Siswa <span class="text-xs text-slate-400 font-normal">(Opsional)</span>:
                                </label>
                                <textarea x-model="$store.paketPrivat.formData.catatanKhusus" rows="2"
                                    placeholder="Ceritakan kendala belajar, karakter mentor yang diinginkan, atau materi spesifik yang ingin dipelajari..."
                                    class="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary text-xs font-medium"></textarea>
                            </div>
                        </div>

                    </form>
                </div>

                <!-- Sticky Footer Actions -->
                <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span>Respon Cepat Tim Admin NLS 1-on-1 via WhatsApp</span>
                    </div>

                    <div class="flex items-center gap-2.5 w-full sm:w-auto">
                        <button type="button" @click="$store.paketPrivat.close()"
                            class="py-3 px-5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 dark:border-slate-700 cursor-pointer w-1/3 sm:w-auto text-center">
                            Batal
                        </button>
                        <button type="button" @click="$store.paketPrivat.submitForm()"
                            style="background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important; color: #ffffff !important;"
                            class="flex-1 sm:flex-none py-3 px-6 rounded-xl font-black text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg flex items-center justify-center gap-2 text-white">
                            <span class="icon-[mdi--whatsapp] text-xl"></span>
                            <span>Kirim Form ke WhatsApp</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </template>

    <!-- Floating Action Button -->
    <button type="button" x-data @click="$store.paketPrivat.open('reguler')"
        class="fixed bottom-6 right-6 z-40 bg-[#FF8A00] text-white px-5 py-4 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm animate-bounce hover:scale-110 active:scale-95 transition-transform cursor-pointer">
        <span class="icon-[mdi--pencil-plus] text-xl"></span>
        Daftar Program
    </button>`;

const pattern = /<!-- ===== POP-UP MODAL FORM KEBUTUHAN PRIVAT SESUAI PAKET ===== -->[\s\S]*?<!-- Event Calendar Modal -->/;
if (pattern.test(content)) {
    content = content.replace(pattern, newModal + '\n    <!-- Event Calendar Modal -->');
    console.log('SUCCESS: Modal updated with $store.paketPrivat bindings!');
} else {
    console.log('ERROR: Modal pattern not matched!');
}

// 5. Remove redundant privatApp script at bottom if present
const scriptPattern = /<!-- ===== PRIVAT APP STATE MACHINE & DYNAMIC PACKAGE LOGIC ===== -->[\s\S]*?<\/script>/;
if (scriptPattern.test(content)) {
    content = content.replace(scriptPattern, '');
    console.log('SUCCESS: Redundant bottom script cleaned up!');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('SUCCESS: privat/index.html updated perfectly!');
