// Immediate theme initialization to prevent flash & mobile viewport lock
(function() {
    try {
        if (typeof document !== 'undefined' && document.documentElement) {
            document.documentElement.style.overflowX = 'hidden';
            document.documentElement.style.maxWidth = '100%';
        }
        const savedTheme = localStorage.getItem('nls_theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } catch (e) {
        console.error('Error initializing theme', e);
    }
})();

function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.theme-toggle-dark-icon').forEach(function(icon) {
        if (isDark) {
            icon.classList.add('hidden');
        } else {
            icon.classList.remove('hidden');
        }
    });
    document.querySelectorAll('.theme-toggle-light-icon').forEach(function(icon) {
        if (isDark) {
            icon.classList.remove('hidden');
        } else {
            icon.classList.add('hidden');
        }
    });
    
    // Update tooltips / titles
    document.querySelectorAll('.theme-toggle-btn').forEach(function(btn) {
        btn.setAttribute('title', isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap');
        btn.setAttribute('aria-label', isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap');
    });
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    try {
        localStorage.setItem('nls_theme', isDark ? 'dark' : 'light');
    } catch (e) {}
    updateThemeIcons();
}

// Attach event listeners when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeButtons);
} else {
    initThemeButtons();
}

function initThemeButtons() {
    updateThemeIcons();
    document.querySelectorAll('.theme-toggle-btn').forEach(function(btn) {
        btn.removeEventListener('click', toggleTheme);
        btn.addEventListener('click', toggleTheme);
    });
}

// Global Alpine Store for Program Registration & Teacher Recruitment Modal
function initAlpineStores() {
    if (typeof window === 'undefined' || !window.Alpine) return;

    // 1. Store: daftarPrivat
    if (!window.Alpine.store('daftarPrivat')) {
        const defaultForm = {
            kebutuhan: 'Privat',
            nama: '',
            jenjang: 'SD / Sederajat',
            subjek: '',
            wa: '',
            catatan: ''
        };

        let savedForm = defaultForm;
        try {
            const raw = localStorage.getItem('nls_program_registration_form') || localStorage.getItem('nls_priv_registration_form');
            if (raw) {
                savedForm = Object.assign({}, defaultForm, JSON.parse(raw));
            }
        } catch (e) {}

        window.Alpine.store('daftarPrivat', {
            showRegistrationModal: false,
            modalOpen: false,
            showToast: false,
            toastMessage: 'Formulir berhasil diproses! Mengarahkan ke WhatsApp...',
            form: savedForm,
            submitForm: function() {
                try {
                    localStorage.setItem('nls_program_registration_form', JSON.stringify(this.form));
                } catch (e) {}

                const k = this.form.kebutuhan || 'Privat';
                const n = this.form.nama || '-';
                const j = this.form.jenjang || '-';
                const s = this.form.subjek || '-';
                const w = this.form.wa || '-';
                const c = this.form.catatan || '-';

                const lines = [
                    'Halo Admin Next Level Study!',
                    '',
                    'Saya ingin mendaftar / konsultasi program:',
                    `*Kebutuhan:* ${k}`,
                    `*Nama / Instansi:* ${n}`,
                    `*Jenjang Pendidikan:* ${j}`,
                    `*Subjek yang Diminati:* ${s}`,
                    `*Nomor WhatsApp:* ${w}`,
                    `*Catatan Tambahan:* ${c}`,
                    '',
                    'Mohon informasi dan tindak lanjutnya. Terima kasih!'
                ];

                const waUrl = 'https://wa.me/6285163070002?text=' + encodeURIComponent(lines.join('\n'));
                window.open(waUrl, '_blank');

                this.showRegistrationModal = false;
                this.modalOpen = false;
                this.showToast = true;
                const self = this;
                setTimeout(function() {
                    self.showToast = false;
                }, 4000);
            },
            submit: function() {
                this.submitForm();
            }
        });
    }

    // 1.5. Store: paketPrivat (Adaptive Package Registration Modal)
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
                text += 'ðŸ“Œ *PILIHAN PAKET:* ' + pkg.title.toUpperCase() + '\n';
                text += 'ðŸ’° *Tarif:* ' + pkg.price + ' ' + pkg.priceUnit + ' (' + pkg.tagline + ')\n\n';

                text += 'ðŸ‘¤ *DATA SISWA & ORANG TUA:*\n';
                text += 'â€¢ Nama Siswa: ' + this.formData.namaSiswa + '\n';
                if (this.formData.namaOrtu.trim()) {
                    text += 'â€¢ Nama Orang Tua/Wali: ' + this.formData.namaOrtu + '\n';
                }
                text += 'â€¢ WhatsApp: ' + this.formData.noWa + '\n';
                text += 'â€¢ Asal Sekolah: ' + (this.formData.asalSekolah || '-') + '\n';
                text += 'â€¢ Tingkat/Kelas: ' + this.formData.tingkatKelas + '\n';
                text += 'â€¢ Metode Belajar: ' + this.formData.metodeBelajar;
                if (this.formData.metodeBelajar.includes('Offline')) {
                    text += ' (+ Transport Guru Rp 50.000/sesi)';
                }
                text += '\n\n';

                text += 'ðŸŽ¯ *PENYESUAIAN KEBUTUHAN (' + pkg.title + '):*\n';
                text += 'â€¢ Mata Pelajaran: ' + this.formData.mataPelajaran + '\n';
                
                if (this.activePackageKey === 'reguler') {
                    text += 'â€¢ Diperuntukkan Untuk: ' + (this.formData.regulerFocus.join(', ') || '-') + '\n';
                    if (this.formData.regulerTargetKampus.trim()) {
                        text += 'â€¢ Target Kampus/Sekolah: ' + this.formData.regulerTargetKampus + '\n';
                    }
                } else if (this.activePackageKey === 'intensif') {
                    text += 'â€¢ Diperuntukkan Untuk: ' + (this.formData.intensifFocus.join(', ') || '-') + '\n';
                    text += 'â€¢ Pengalaman Olimpiade: ' + this.formData.intensifExperience + '\n';
                } else if (this.activePackageKey === 'internasional') {
                    text += 'â€¢ Diperuntukkan Untuk: ' + (this.formData.internasionalFocus.join(', ') || '-') + '\n';
                    if (this.formData.internasionalTargetKampus.trim()) {
                        text += 'â€¢ Target Kampus Dunia/PTN: ' + this.formData.internasionalTargetKampus + '\n';
                    }
                }

                text += '\nâ° *RENCANA JADWAL & FREKUENSI:*\n';
                text += 'â€¢ Estimasi Sesi: ' + this.formData.sesiPerBulan + '\n';
                text += 'â€¢ Waktu Luang: ' + this.formData.waktuBelajar + '\n';
                text += 'â€¢ Hari Belajar: ' + (this.formData.hariPreferensi.join(', ') || '-') + '\n';

                if (this.formData.catatanKhusus.trim()) {
                    text += '\nðŸ“ *Catatan Khusus:*\n' + this.formData.catatanKhusus + '\n';
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

    // 2. Store: gabungPengajar
    if (!window.Alpine.store('gabungPengajar')) {
        window.Alpine.store('gabungPengajar', {
            modalOpen: false,
            showRegistrationModal: false,
            showModal: false,
            form: {
                nama: '',
                panggilan: '',
                wa: '',
                email: '',
                pendidikan: '',
                categories: [],
                jenjang: [],
                subject: '',
                fokusPrivat: '',
                filosofi: '',
                prestasi1: '',
                prestasi2: '',
                prestasi3: '',
                portfolio: ''
            },
            submit: function() {
                const catStr = this.form.categories && this.form.categories.length > 0 ? this.form.categories.join(', ') : '-';
                const jnjStr = this.form.jenjang && this.form.jenjang.length > 0 ? this.form.jenjang.join(', ') : '-';
                
                const lines = [
                    '🌟 *PENDAFTARAN PENGAJAR & MENTOR - NEXT LEVEL STUDY* 🌟',
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                    '',
                    '👤 *1. DATA PRIBADI & PENDIDIKAN*',
                    `• *Nama Lengkap & Gelar:* ${this.form.nama || '-'}`,
                    `• *Nama Panggilan / Sapaan:* ${this.form.panggilan || '-'}`,
                    `• *Nomor WhatsApp:* ${this.form.wa || '-'}`,
                    `• *Alamat Email:* ${this.form.email || '-'}`,
                    `• *Latar Belakang Pendidikan / Kampus:* ${this.form.pendidikan || '-'}`,
                    '',
                    '📚 *2. BIDANG KEAHLIAN & SASARAN PROGRAM*',
                    `• *Bidang Keahlian:* ${catStr}`,
                    `• *Sasaran Jenjang:* ${jnjStr}`,
                    `• *Spesialisasi Mata Pelajaran:* ${this.form.subject || '-'}`,
                    '',
                    '🎯 *3. FOKUS KEBUTUHAN LES PRIVAT*',
                    `${this.form.fokusPrivat || '-'}`,
                    '',
                    '💬 *4. FILOSOFI / QUOTE MENGAJAR*',
                    `"${this.form.filosofi || '-'}"`,
                    '',
                    '🏆 *5. REKAM JEJAK & PRESTASI*',
                    `1. ${this.form.prestasi1 || '-'}`,
                    `2. ${this.form.prestasi2 || '-'}`,
                    `3. ${this.form.prestasi3 || '-'}`,
                    '',
                    '🔗 *6. LINK CV / PORTOFOLIO*',
                    `${this.form.portfolio || '-'}`,
                    '',
                    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                    '✅ *Komitmen:* Saya siap mengikuti rangkaian seleksi dan menjunjung tinggi kode etik & integritas pendidik Next Level Study.'
                ];

                const waUrl = 'https://wa.me/6285163070002?text=' + encodeURIComponent(lines.join('\n'));
                window.open(waUrl, '_blank');
                this.modalOpen = false;
                this.showRegistrationModal = false;
                this.showModal = false;
            },
            submitForm: function() {
                this.submit();
            }
        });
    }
}

if (typeof window !== 'undefined') {
    if (window.Alpine) {
        initAlpineStores();
    } else {
        document.addEventListener('alpine:init', initAlpineStores);
        document.addEventListener('DOMContentLoaded', function() {
            if (window.Alpine) initAlpineStores();
        });
    }
}
