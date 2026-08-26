$themeJsPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\theme.js"
$content = [System.IO.File]::ReadAllText($themeJsPath, [System.Text.Encoding]::UTF8)

# Replace paketPrivat store in theme.js
$newStore = @'
    if (!window.Alpine.store('paketPrivat')) {
        window.Alpine.store('paketPrivat', {
            showModal: false,
            activePackageKey: 'reguler',
            packageDetails: {
                reguler: {
                    key: 'reguler',
                    title: 'Paket Reguler',
                    tagline: 'Akademik Harian, TKA Pusmendik & Persiapan SNBT/Kedinasan',
                    badge: 'Akademik & SNBT / Kedinasan',
                    price: 'Rp 120.000',
                    priceUnit: '/ Jam',
                    sessions: 'Ideal 8 sesi per bulan',
                    themeColor: '#0284c7'
                },
                intensif: {
                    key: 'intensif',
                    title: 'Paket Intensif OSN & IB',
                    tagline: 'OSN Kota/Kabupaten & Kurikulum IB/Cambridge (SD & SMP)',
                    badge: 'OSN Kota & IB/Cambridge (SD & SMP)',
                    price: 'Rp 160.000',
                    priceUnit: '/ Jam',
                    sessions: 'Ideal 10 sesi per bulan (Paling Diminati)',
                    themeColor: '#f59e0b'
                },
                internasional: {
                    key: 'internasional',
                    title: 'Paket Internasional & OSN+',
                    tagline: 'OSN Provinsi/Nasional, Olimpiade Global & SMA+',
                    badge: 'Olimpiade Dunia & Global (Tingkat SMA)',
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
                regulerFocus: ['Persiapan SNBT / Tes Mandiri PTN / Kedinasan', 'Pemantapan Konsep & Peningkatan Nilai Rapor'],
                regulerTargetKampus: '',

                // Intensif Specifics
                intensifFocus: ['Persiapan Olimpiade Sains Nasional (OSN-K / Kota / Kabupaten)', 'Kurikulum Cambridge (Primary / Lower Secondary / Checkpoint)'],
                intensifExperience: 'Pemula (Mulai dari Nol / Fondasi Konsep)',

                // Internasional Specifics
                internasionalFocus: ['OSN Tingkat Provinsi & Nasional (OSN-P / OSNAS)', 'Kompetisi Matematika & Sains Global (AMO, SEAMO, TIMO, SASMO)'],
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
                    text += '• Target Fokus: ' + (this.formData.regulerFocus.join(', ') || '-') + '\n';
                    if (this.formData.regulerTargetKampus.trim()) {
                        text += '• Target PTN/Kedinasan/Prodi: ' + this.formData.regulerTargetKampus + '\n';
                    }
                } else if (this.activePackageKey === 'intensif') {
                    text += '• Fokus Kurikulum/Lomba: ' + (this.formData.intensifFocus.join(', ') || '-') + '\n';
                    text += '• Pengalaman Olimpiade: ' + this.formData.intensifExperience + '\n';
                } else if (this.activePackageKey === 'internasional') {
                    text += '• Target Kompetisi/Kurikulum: ' + (this.formData.internasionalFocus.join(', ') || '-') + '\n';
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

$pattern = '(?s)if \(!window\.Alpine\.store\(\x27paketPrivat\x27\)\) \{.*?\}\);?\s*\}'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, $newStore)

[System.IO.File]::WriteAllText($themeJsPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Updated theme.js store!"
