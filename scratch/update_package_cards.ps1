$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$themeJsPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\theme.js"

# 1. Update theme.js
$themeContent = [System.IO.File]::ReadAllText($themeJsPath, [System.Text.Encoding]::UTF8)

$oldStorePattern = '(?s)if \(!window\.Alpine\.store\(\x27paketPrivat\x27\)\) \{.*?\}\);?\s*\}'
$newStore = @'
    if (!window.Alpine.store('paketPrivat')) {
        window.Alpine.store('paketPrivat', {
            showModal: false,
            activePackageKey: 'reguler',
            packageDetails: {
                reguler: {
                    key: 'reguler',
                    title: 'Paket Reguler',
                    tagline: 'Pendampingan Kurikulum Nasional & Persiapan TKA (SD, SMP, SMA)',
                    badge: 'Kurikulum Nasional & TKA',
                    price: 'Rp 120.000',
                    priceUnit: '/ Jam',
                    sessions: 'Ideal 8 sesi per bulan',
                    themeColor: '#0284c7'
                },
                intensif: {
                    key: 'intensif',
                    title: 'Paket Exclusive',
                    tagline: 'OSN Kota/Provinsi, Siswa SD/SMP Internasional & SNBT/Mandiri',
                    badge: 'OSN Kota/Provinsi & SNBT',
                    price: 'Rp 160.000',
                    priceUnit: '/ Jam',
                    sessions: 'Ideal 10 sesi per bulan (Paling Diminati)',
                    themeColor: '#f59e0b'
                },
                internasional: {
                    key: 'internasional',
                    title: 'Paket Juara',
                    tagline: 'OSN Semifinal/Final, SMA Internasional & Kompetisi Global (AMO, SEAMO)',
                    badge: 'OSN Final & Global (AMO, SEAMO)',
                    price: 'Rp 200.000',
                    priceUnit: '/ Jam',
                    sessions: 'Bimbingan Champion Level Dunia',
                    themeColor: '#7c3aed'
                }
            },
            get activePackage() {
                return this.packageDetails[this.activePackageKey] || this.packageDetails.reguler;
            },
            formData: {
                namaSiswa: '',
                namaOrtu: '',
                noWa: '',
                asalSekolah: '',
                tingkatKelas: 'SMA Kelas 12',
                metodeBelajar: 'Online (Zoom 1-on-1)',
                mataPelajaran: '',
                
                // Reguler Specifics
                regulerFocus: ['Pendampingan Siswa Kurikulum Nasional', 'Persiapan TKA SD, SMP, SMA'],
                regulerTargetKampus: '',

                // Intensif (Exclusive) Specifics
                intensifFocus: ['Persiapan OSN Tingkat Kota/Provinsi (SD, SMP, SMA)', 'Pendampingan Siswa SD/SMP Kurikulum Internasional', 'Persiapan SNBT / Mandiri'],
                intensifExperience: 'Pemula (Mulai dari Nol / Fondasi Konsep)',

                // Internasional (Juara) Specifics
                internasionalFocus: ['Persiapan OSN Tingkat Semifinal/Final (SD, SMP, SMA)', 'Pendampingan Siswa SMA Kurikulum Internasional', 'Persiapan Kompetisi Internasional (AMO, SEAMO, TIMO, dll.)'],
                internasionalTargetKampus: '',

                // Scheduling
                sesiPerBulan: '8 Sesi / Bulan (2x seminggu - Standar)',
                waktuBelajar: 'Sore / Malam (18.30 - 21.00 WIB)',
                hariPreferensi: ['Hari Kerja (Senin - Jumat)'],
                catatanKhusus: ''
            },
            open: function(pkgKey) {
                this.activePackageKey = pkgKey || 'reguler';
                if (pkgKey === 'reguler') {
                    this.formData.tingkatKelas = 'SMA Kelas 12';
                } else if (pkgKey === 'intensif') {
                    this.formData.tingkatKelas = 'SMP Kelas 8';
                } else if (pkgKey === 'internasional') {
                    this.formData.tingkatKelas = 'SMA Kelas 11';
                }
                this.showModal = true;
                try { document.body.style.overflow = 'hidden'; } catch (e) {}
            },
            setPackage: function(pkgKey) {
                this.activePackageKey = pkgKey;
            },
            close: function() {
                this.showModal = false;
                try { document.body.style.overflow = ''; } catch (e) {}
            },
            toggleArrayItem: function(arr, item) {
                const idx = arr.indexOf(item);
                if (idx > -1) {
                    arr.splice(idx, 1);
                } else {
                    arr.push(item);
                }
            },
            submitForm: function() {
                if (!this.formData.namaSiswa.trim()) {
                    alert('Mohon masukkan Nama Lengkap Siswa.');
                    return;
                }
                if (!this.formData.noWa.trim()) {
                    alert('Mohon masukkan Nomor WhatsApp aktif.');
                    return;
                }
                if (!this.formData.mataPelajaran.trim()) {
                    alert('Mohon tuliskan Mata Pelajaran yang ingin dipelajari.');
                    return;
                }

                const pkg = this.activePackage;
                let text = '*FORMULIR PENDAFTARAN LES PRIVAT NLS*\n';
                text += '--------------------------------------------\n';
                text += '📌 *PILIHAN PAKET:* ' + pkg.title.toUpperCase() + '\n';
                text += '💰 *Tarif:* ' + pkg.price + ' ' + pkg.priceUnit + ' (' + pkg.tagline + ')\n\n';

                text += '👤 *DATA SISWA & ORANG TUA:*\n';
                text += '• Nama Siswa: ' + this.formData.namaSiswa + '\n';
                if (this.formData.namaOrtu.trim()) {
                    text += '• Nama Orang Tua/Wali: ' + this.formData.namaOrtu + '\n';
                }
                text += '• WhatsApp: ' + this.formData.noWa + '\n';
                text += '• Asal Sekolah: ' + (this.formData.asalSekolah || '-') + '\n';
                text += '• Tingkat/Kelas: ' + this.formData.tingkatKelas + '\n';
                text += '• Metode Belajar: ' + this.formData.metodeBelajar;
                if (this.formData.metodeBelajar.includes('Offline')) {
                    text += ' (+ Transport Guru Rp 50.000/sesi)';
                }
                text += '\n\n';

                text += '🎯 *PENYESUAIAN KEBUTUHAN (' + pkg.title + '):*\n';
                text += '• Mata Pelajaran: ' + this.formData.mataPelajaran + '\n';
                
                if (this.activePackageKey === 'reguler') {
                    text += '• Diperuntukkan Untuk: ' + (this.formData.regulerFocus.join(', ') || '-') + '\n';
                    if (this.formData.regulerTargetKampus.trim()) {
                        text += '• Target Kampus/Sekolah: ' + this.formData.regulerTargetKampus + '\n';
                    }
                } else if (this.activePackageKey === 'intensif') {
                    text += '• Diperuntukkan Untuk: ' + (this.formData.intensifFocus.join(', ') || '-') + '\n';
                    text += '• Pengalaman Olimpiade: ' + this.formData.intensifExperience + '\n';
                } else if (this.activePackageKey === 'internasional') {
                    text += '• Diperuntukkan Untuk: ' + (this.formData.internasionalFocus.join(', ') || '-') + '\n';
                    if (this.formData.internasionalTargetKampus.trim()) {
                        text += '• Target Kampus Dunia/PTN: ' + this.formData.internasionalTargetKampus + '\n';
                    }
                }

                text += '\n⏰ *RENCANA JADWAL & FREKUENSI:*\n';
                text += '• Estimasi Sesi: ' + this.formData.sesiPerBulan + '\n';
                text += '• Waktu Luang: ' + this.formData.waktuBelajar + '\n';
                text += '• Hari Belajar: ' + (this.formData.hariPreferensi.join(', ') || '-') + '\n';

                if (this.formData.catatanKhusus.trim()) {
                    text += '\n📝 *Catatan Khusus:*\n' + this.formData.catatanKhusus + '\n';
                }

                text += '\n--------------------------------------------\n';
                text += 'Halo Admin Next Level Study, mohon info ketersediaan mentor dan jadwalnya. Terima kasih!';

                const adminWa = '6285163070002';
                const waUrl = 'https://wa.me/' + adminWa + '?text=' + encodeURIComponent(text);
                window.open(waUrl, '_blank');

                this.showModal = false;
            }
        });
    }
'@

$themeContent = [System.Text.RegularExpressions.Regex]::Replace($themeContent, $oldStorePattern, $newStore)
[System.IO.File]::WriteAllText($themeJsPath, $themeContent, [System.Text.Encoding]::UTF8)
Write-Host "Updated theme.js!"

# 2. Update privat/index.html pricing section & modal
$privatContent = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

# Replace Pricing Section Cards
$oldPricingCardsPattern = '(?s)<div x-data class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">.*?<!-- 1\. Paket Reguler -->.*?</div>\s*</div>\s*</section>'

$newPricingCards = @'
<div x-data class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">

                        <!-- 1. Paket Reguler -->
                        <div
                            class="bg-white dark:bg-[#131D38] p-8 md:p-9 rounded-[32px] border-2 border-sky-100 dark:border-sky-900/60 shadow-lg hover:shadow-2xl hover:border-sky-400 transition-all duration-300 flex flex-col justify-between relative group">
                            <div>
                                <div class="mb-5">
                                    <span
                                        style="background: #e0f2fe !important; color: #0284c7 !important; border: 1px solid #bae6fd !important; padding: 6px 16px !important; border-radius: 9999px !important; font-size: 0.8rem !important; font-weight: 800 !important; display: inline-flex !important; align-items: center !important; gap: 8px !important; white-space: nowrap !important;"
                                        class="shadow-sm">
                                        <span class="icon-[mdi--school] text-base"></span>
                                        Kurikulum Nasional &amp; TKA
                                    </span>
                                </div>

                                <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-3">Paket Reguler</h3>
                                
                                <!-- Diperuntukan Untuk (Reguler) -->
                                <div class="mb-5 space-y-2 p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50">
                                    <div class="text-[11px] font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                                        <span class="icon-[mdi--target] text-sm"></span>
                                        <span>Diperuntukkan Untuk:</span>
                                    </div>
                                    <ul class="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
                                        <li class="flex items-start gap-2">
                                            <span class="w-4 h-4 rounded-full bg-sky-200/80 dark:bg-sky-800 text-sky-800 dark:text-sky-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                                            <span>Pendampingan siswa Kurikulum Nasional</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="w-4 h-4 rounded-full bg-sky-200/80 dark:bg-sky-800 text-sky-800 dark:text-sky-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                                            <span>Persiapan TKA SD, SMP, SMA</span>
                                        </li>
                                    </ul>
                                </div>

                                <div class="my-6 pt-5 pb-2 border-t border-slate-100 dark:border-slate-800">
                                    <div class="flex items-baseline gap-1.5">
                                        <span style="color: #0284c7 !important;"
                                            class="text-3xl sm:text-4xl font-black tracking-tight">Rp 120.000</span>
                                        <span class="text-sm font-semibold text-slate-500 dark:text-slate-400">/
                                             Jam</span>
                                    </div>
                                    <span style="color: #0284c7 !important;"
                                        class="text-xs font-bold mt-1 inline-block">Bimbingan 1-on-1 Intensif</span>
                                </div>

                                <div class="space-y-3.5 mb-8">
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-emerald-500 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Ideal 8 sesi per bulan</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-emerald-500 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Kurikulum Nasional Terpadu</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-emerald-500 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Mentor Kampus Top Terverifikasi</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-emerald-500 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Support LMS &amp; Try Out Bulanan</span>
                                    </div>
                                </div>
                            </div>

                            <button type="button" @click="$store.paketPrivat.open('reguler')" onclick="openPrivatPackage('reguler')"
                                style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important; box-shadow: 0 8px 20px rgba(2, 132, 199, 0.35) !important;"
                                class="w-full py-4 px-6 rounded-2xl font-black text-base transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg">
                                <span class="icon-[mdi--pencil-plus] text-xl"></span>
                                Pilih Paket Reguler
                            </button>
                        </div>

                        <!-- 2. Paket Exclusive (Sebelumnya: Paket Intensif OSN & IB) -->
                        <div style="background: linear-gradient(165deg, #0b224d 0%, #061530 100%) !important; color: #ffffff !important; border: 2.5px solid #f59e0b !important; box-shadow: 0 20px 45px -10px rgba(11, 34, 77, 0.6), 0 0 25px rgba(245, 158, 11, 0.3) !important;"
                            class="p-8 md:p-9 rounded-[32px] relative transform lg:-translate-y-4 flex flex-col justify-between group z-20">

                            <div style="background: linear-gradient(90deg, #f59e0b, #ea580c) !important; color: #ffffff !important; box-shadow: 0 6px 18px rgba(234, 88, 12, 0.4) !important; padding: 6px 20px !important; border-radius: 9999px !important; font-size: 0.75rem !important; font-weight: 900 !important; letter-spacing: 0.05em !important; display: inline-flex !important; align-items: center !important; gap: 8px !important; white-space: nowrap !important; border: 1px solid rgba(255, 255, 255, 0.3) !important;"
                                class="absolute -top-4 left-1/2 -translate-x-1/2 uppercase tracking-wider">
                                <span class="icon-[mdi--fire] text-base animate-bounce"></span>
                                PALING DIMINATI &bull; REKOMENDASI
                            </div>

                            <div>
                                <div class="mb-5 mt-2">
                                    <span
                                        style="background: rgba(245, 158, 11, 0.2) !important; border: 1px solid rgba(245, 158, 11, 0.5) !important; color: #fde047 !important; padding: 6px 16px !important; border-radius: 9999px !important; font-size: 0.8rem !important; font-weight: 800 !important; display: inline-flex !important; align-items: center !important; gap: 8px !important; white-space: nowrap !important;">
                                        <span class="icon-[mdi--trophy] text-base"></span>
                                        OSN Kota/Provinsi &amp; SNBT
                                    </span>
                                </div>

                                <h3 style="color: #ffffff !important;" class="text-2xl font-black mb-3">Paket Exclusive</h3>
                                
                                <!-- Diperuntukan Untuk (Exclusive) -->
                                <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35);" class="mb-5 space-y-2 p-3.5 rounded-2xl">
                                    <div class="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                                        <span class="icon-[mdi--target] text-sm"></span>
                                        <span>Diperuntukkan Untuk:</span>
                                    </div>
                                    <ul class="space-y-1.5 text-xs text-slate-200 font-medium">
                                        <li class="flex items-start gap-2">
                                            <span style="background: rgba(245, 158, 11, 0.3); color: #fde047;" class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                                            <span>Persiapan OSN Tingkat Kota/Provinsi (SD, SMP, SMA)</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span style="background: rgba(245, 158, 11, 0.3); color: #fde047;" class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                                            <span>Pendampingan siswa SD/SMP Kurikulum Internasional</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span style="background: rgba(245, 158, 11, 0.3); color: #fde047;" class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                                            <span>Persiapan SNBT / Mandiri</span>
                                        </li>
                                    </ul>
                                </div>

                                <div style="border-color: rgba(255, 255, 255, 0.15);" class="my-6 pt-5 pb-2 border-t">
                                    <div class="flex items-baseline gap-1.5">
                                        <span style="color: #fbbf24 !important;"
                                            class="text-3xl sm:text-4xl font-black tracking-tight">Rp 160.000</span>
                                        <span style="color: #94a3b8 !important;" class="text-sm font-semibold">/
                                             Jam</span>
                                    </div>
                                    <span style="color: #fde68a !important;"
                                        class="text-xs font-bold mt-1 inline-flex items-center gap-1.5">
                                        <span class="icon-[mdi--star] text-amber-300 text-sm"></span>
                                        Paket Terfavorit Siswa Berprestasi
                                    </span>
                                </div>

                                <div class="space-y-3.5 mb-8">
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-amber-400 text-xl shrink-0 mt-0.5"></span>
                                        <span style="color: #f8fafc !important;" class="text-sm font-semibold">Ideal 10 sesi per bulan</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-amber-400 text-xl shrink-0 mt-0.5"></span>
                                        <span style="color: #f8fafc !important;" class="text-sm font-semibold">Bank Soal Eksklusif &amp; Modul Bedah Tipe</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-amber-400 text-xl shrink-0 mt-0.5"></span>
                                        <span style="color: #f8fafc !important;" class="text-sm font-semibold">Simulasi Ujian Rutin &amp; Analisis IRT</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-amber-400 text-xl shrink-0 mt-0.5"></span>
                                        <span style="color: #f8fafc !important;" class="text-sm font-semibold">Laporan Progres Detail ke Orang Tua</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-amber-400 text-xl shrink-0 mt-0.5"></span>
                                        <span style="color: #fef08a !important;" class="text-sm font-black">Mentor Medalis &amp; Expert Berpengalaman</span>
                                    </div>
                                </div>
                            </div>

                            <button type="button" @click="$store.paketPrivat.open('intensif')" onclick="openPrivatPackage('intensif')"
                                style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%) !important; color: #0b1727 !important; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4) !important;"
                                class="w-full py-4 px-6 rounded-2xl font-black text-base transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg">
                                <span class="icon-[mdi--pencil-plus] text-xl"></span>
                                Pilih Paket Exclusive
                            </button>
                        </div>

                        <!-- 3. Paket Juara (Sebelumnya: Paket Internasional & OSN+) -->
                        <div
                            class="bg-white dark:bg-[#131D38] p-8 md:p-9 rounded-[32px] border-2 border-purple-100 dark:border-purple-900/60 shadow-lg hover:shadow-2xl hover:border-purple-400 transition-all duration-300 flex flex-col justify-between relative group">
                            <div>
                                <div class="mb-5">
                                    <span
                                        style="background: #f3e8ff !important; color: #7c3aed !important; border: 1px solid #ddd6fe !important; padding: 6px 16px !important; border-radius: 9999px !important; font-size: 0.8rem !important; font-weight: 800 !important; display: inline-flex !important; align-items: center !important; gap: 8px !important; white-space: nowrap !important;"
                                        class="shadow-sm">
                                        <span class="icon-[mdi--earth] text-base"></span>
                                        OSN Final &amp; Global (AMO, SEAMO)
                                    </span>
                                </div>

                                <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-3">Paket Juara</h3>
                                
                                <!-- Diperuntukan Untuk (Juara) -->
                                <div class="mb-5 space-y-2 p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
                                    <div class="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                                        <span class="icon-[mdi--target] text-sm"></span>
                                        <span>Diperuntukkan Untuk:</span>
                                    </div>
                                    <ul class="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
                                        <li class="flex items-start gap-2">
                                            <span class="w-4 h-4 rounded-full bg-purple-200/80 dark:bg-purple-800 text-purple-800 dark:text-purple-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                                            <span>Persiapan OSN Tingkat Semifinal/Final (SD, SMP, SMA)</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="w-4 h-4 rounded-full bg-purple-200/80 dark:bg-purple-800 text-purple-800 dark:text-purple-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                                            <span>Pendampingan siswa SMA Kurikulum Internasional</span>
                                        </li>
                                        <li class="flex items-start gap-2">
                                            <span class="w-4 h-4 rounded-full bg-purple-200/80 dark:bg-purple-800 text-purple-800 dark:text-purple-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                                            <span>Persiapan Kompetisi Internasional seperti AMO, SEAMO dan sebagainya</span>
                                        </li>
                                    </ul>
                                </div>

                                <div class="my-6 pt-5 pb-2 border-t border-slate-100 dark:border-slate-800">
                                    <div class="flex items-baseline gap-1.5">
                                        <span style="color: #7c3aed !important;"
                                            class="text-3xl sm:text-4xl font-black tracking-tight">Rp 200.000</span>
                                        <span class="text-sm font-semibold text-slate-500 dark:text-slate-400">/
                                             Jam</span>
                                    </div>
                                    <span style="color: #7c3aed !important;"
                                        class="text-xs font-bold mt-1 inline-block">Bimbingan Champion Level Dunia</span>
                                </div>

                                <div class="space-y-3.5 mb-8">
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-purple-600 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Ideal 8 sesi per bulan</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-purple-600 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Mentor Pakar Olimpiade Internasional</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-purple-600 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Standar Kurikulum Internasional (IB/AP)</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-purple-600 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Portofolio Masuk Universitas Top Dunia</span>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <span
                                            class="icon-[mdi--check-circle] text-purple-600 text-xl shrink-0 mt-0.5"></span>
                                        <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">Pendampingan Penuh Kompetisi Global</span>
                                    </div>
                                </div>
                            </div>

                            <button type="button" @click="$store.paketPrivat.open('internasional')" onclick="openPrivatPackage('internasional')"
                                style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important; color: #ffffff !important; box-shadow: 0 8px 20px rgba(124, 58, 237, 0.35) !important;"
                                class="w-full py-4 px-6 rounded-2xl font-black text-base transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-lg">
                                <span class="icon-[mdi--pencil-plus] text-xl"></span>
                                Pilih Paket Juara
                            </button>
                        </div>
                    </div>
                </div>
            </section>
'@

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldPricingCardsPattern, $newPricingCards)

# 3. Update Modal Header Switcher Buttons in privat/index.html
$oldSwitcherTabs = '(?s)<!-- Package Switcher Tabs: Strictly in 1 Single Horizontal Row with Distinct Selected Colors -->.*?</div>\s*</div>\s*<!-- Scrollable Form Body -->'

$newSwitcherTabs = @'
<!-- Package Switcher Tabs: Strictly in 1 Single Horizontal Row with Distinct Selected Colors -->
                    <div class="flex flex-row items-center gap-1.5 sm:gap-2.5 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 w-full">
                        <button type="button" @click="$store.paketPrivat.setPackage('reguler')"
                            class="flex-1 min-w-0 py-2.5 px-2 sm:px-4 rounded-xl text-xs font-black transition-all cursor-pointer text-center truncate border shadow-xs"
                            :class="$store.paketPrivat.activePackageKey === 'reguler' ? 'ring-2 ring-sky-300 dark:ring-sky-700 shadow-md font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'"
                            :style="$store.paketPrivat.activePackageKey === 'reguler' ? 'background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important; border-color: #0284c7 !important;' : ''">
                            <span>Reguler (120rb)</span>
                        </button>
                        <button type="button" @click="$store.paketPrivat.setPackage('intensif')"
                            class="flex-1 min-w-0 py-2.5 px-2 sm:px-4 rounded-xl text-xs font-black transition-all cursor-pointer text-center truncate border shadow-xs"
                            :class="$store.paketPrivat.activePackageKey === 'intensif' ? 'ring-2 ring-amber-300 dark:ring-amber-700 shadow-md font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'"
                            :style="$store.paketPrivat.activePackageKey === 'intensif' ? 'background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important; color: #0f172a !important; border-color: #f59e0b !important;' : ''">
                            <span>Exclusive (160rb)</span>
                        </button>
                        <button type="button" @click="$store.paketPrivat.setPackage('internasional')"
                            class="flex-1 min-w-0 py-2.5 px-2 sm:px-4 rounded-xl text-xs font-black transition-all cursor-pointer text-center truncate border shadow-xs"
                            :class="$store.paketPrivat.activePackageKey === 'internasional' ? 'ring-2 ring-purple-300 dark:ring-purple-700 shadow-md font-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'"
                            :style="$store.paketPrivat.activePackageKey === 'internasional' ? 'background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%) !important; color: #ffffff !important; border-color: #7c3aed !important;' : ''">
                            <span>Juara (200rb)</span>
                        </button>
                    </div>
                </div>

                <!-- Scrollable Form Body -->
'@

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldSwitcherTabs, $newSwitcherTabs)

# 4. Update Focus Options in Section 2 for the 3 packages
$oldSection2Pattern = '(?s)<!-- ADAPTIVE 1: PAKET REGULER -->.*?<!-- SECTION 3: FREKUENSI SESI & WAKTU BELAJAR -->'

$newSection2 = @'
<!-- ADAPTIVE 1: PAKET REGULER -->
                            <div x-show="$store.paketPrivat.activePackageKey === 'reguler'" class="space-y-4 pt-1">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white">
                                        Target &amp; Kebutuhan Belajar:
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <template x-for="item in [
                                            'Pendampingan Siswa Kurikulum Nasional',
                                            'Persiapan TKA SD, SMP, SMA',
                                            'Pemantapan Konsep & Peningkatan Nilai Rapor',
                                            'Persiapan Ulangan Harian & Ujian Semester (PAS/PAT)'
                                        ]" :key="item">
                                            <label @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.regulerFocus, item)"
                                                class="flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none"
                                                :class="$store.paketPrivat.formData.regulerFocus.includes(item) 
                                                    ? 'bg-sky-100/90 dark:bg-sky-950/80 border-sky-500 text-slate-900 dark:text-white font-bold ring-1 ring-sky-400 shadow-2xs' 
                                                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'">
                                                <span class="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5"
                                                    :class="$store.paketPrivat.formData.regulerFocus.includes(item) 
                                                        ? 'bg-[#0284c7] text-white font-bold' 
                                                        : 'border border-slate-400 bg-slate-50 dark:bg-slate-800 text-transparent'">
                                                    <span class="icon-[mdi--check] text-xs"></span>
                                                </span>
                                                <span class="text-xs leading-relaxed" x-text="item"></span>
                                            </label>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white">
                                        Target Sekolah / Universitas Impian <span class="text-xs text-slate-400 font-normal">(Opsional)</span>:
                                    </label>
                                    <input x-model="$store.paketPrivat.formData.regulerTargetKampus" type="text"
                                        placeholder="Contoh: SMA Negeri 1 / SMA Unggulan / PTN Impian"
                                        class="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#0284c7] text-xs font-medium placeholder:text-slate-400">
                                </div>
                            </div>

                            <!-- ADAPTIVE 2: PAKET EXCLUSIVE (OSN KOTA/PROV, SD/SMP INTER, SNBT/MANDIRI) -->
                            <div x-show="$store.paketPrivat.activePackageKey === 'intensif'" class="space-y-4 pt-1">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white">
                                        Target &amp; Kebutuhan Belajar:
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <template x-for="item in [
                                            'Persiapan OSN Tingkat Kota/Provinsi (SD, SMP, SMA)',
                                            'Pendampingan Siswa SD/SMP Kurikulum Internasional',
                                            'Persiapan SNBT / Mandiri'
                                        ]" :key="item">
                                            <label @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.intensifFocus, item)"
                                                class="flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none"
                                                :class="$store.paketPrivat.formData.intensifFocus.includes(item) 
                                                    ? 'bg-amber-100/90 dark:bg-amber-950/80 border-amber-500 text-slate-900 dark:text-white font-bold ring-1 ring-amber-400 shadow-2xs' 
                                                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'">
                                                <span class="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5"
                                                    :class="$store.paketPrivat.formData.intensifFocus.includes(item) 
                                                        ? 'bg-[#f59e0b] text-slate-950 font-black' 
                                                        : 'border border-slate-400 bg-slate-50 dark:bg-slate-800 text-transparent'">
                                                    <span class="icon-[mdi--check] text-xs"></span>
                                                </span>
                                                <span class="text-xs leading-relaxed" x-text="item"></span>
                                            </label>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white">
                                        Pengalaman Siswa di Bidang Olimpiade / Lomba:
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <label @click="$store.paketPrivat.formData.intensifExperience = 'Pemula (Mulai dari Nol / Fondasi Konsep)'"
                                            class="flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none"
                                            :class="$store.paketPrivat.formData.intensifExperience === 'Pemula (Mulai dari Nol / Fondasi Konsep)' 
                                                ? 'bg-amber-100/90 dark:bg-amber-950/80 border-amber-500 text-slate-900 dark:text-white font-bold ring-1 ring-amber-400' 
                                                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'">
                                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                                            <span>Pemula (Mulai dari Nol)</span>
                                        </label>
                                        <label @click="$store.paketPrivat.formData.intensifExperience = 'Menengah (Pernah ikut seleksi sekolah / lomba)'"
                                            class="flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none"
                                            :class="$store.paketPrivat.formData.intensifExperience === 'Menengah (Pernah ikut seleksi sekolah / lomba)' 
                                                ? 'bg-amber-100/90 dark:bg-amber-950/80 border-amber-500 text-slate-900 dark:text-white font-bold ring-1 ring-amber-400' 
                                                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'">
                                            <span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shrink-0"></span>
                                            <span>Pernah Ikut Seleksi / Lomba</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- ADAPTIVE 3: PAKET JUARA (OSN FINAL, SMA INTERNASIONAL & KOMPETISI GLOBAL) -->
                            <div x-show="$store.paketPrivat.activePackageKey === 'internasional'" class="space-y-4 pt-1">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white">
                                        Target &amp; Kebutuhan Belajar:
                                    </label>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        <template x-for="item in [
                                            'Persiapan OSN Tingkat Semifinal/Final (SD, SMP, SMA)',
                                            'Pendampingan Siswa SMA Kurikulum Internasional',
                                            'Persiapan Kompetisi Internasional seperti AMO, SEAMO dan sebagainya'
                                        ]" :key="item">
                                            <label @click="$store.paketPrivat.toggleArrayItem($store.paketPrivat.formData.internasionalFocus, item)"
                                                class="flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none"
                                                :class="$store.paketPrivat.formData.internasionalFocus.includes(item) 
                                                    ? 'bg-purple-100/90 dark:bg-purple-950/80 border-purple-500 text-slate-900 dark:text-white font-bold ring-1 ring-purple-400 shadow-2xs' 
                                                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'">
                                                <span class="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5"
                                                    :class="$store.paketPrivat.formData.internasionalFocus.includes(item) 
                                                        ? 'bg-[#7c3aed] text-white font-bold' 
                                                        : 'border border-slate-400 bg-slate-50 dark:bg-slate-800 text-transparent'">
                                                    <span class="icon-[mdi--check] text-xs"></span>
                                                </span>
                                                <span class="text-xs leading-relaxed" x-text="item"></span>
                                            </label>
                                        </template>
                                    </div>
                                </div>

                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-900 dark:text-white">
                                        Target Universitas Impian (Luar Negeri / Top PTN):
                                    </label>
                                    <input x-model="$store.paketPrivat.formData.internasionalTargetKampus" type="text"
                                        placeholder="Contoh: National University of Singapore (NUS), NTU, Oxford, MIT, ITB, UI"
                                        class="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#7c3aed] text-xs font-medium placeholder:text-slate-400">
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 3: FREKUENSI SESI & WAKTU BELAJAR -->
'@

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldSection2Pattern, $newSection2)

[System.IO.File]::WriteAllText($privatPath, $privatContent, [System.Text.Encoding]::UTF8)
Write-Host "Updated privat/index.html successfully!"
