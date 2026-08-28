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
                photo: '',
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
            isPhotoUploading: false,
            handlePhotoUpload: function(event) {
                const file = event.target.files && event.target.files[0];
                if (!file) return;

                if (!file.type.startsWith('image/')) {
                    alert('Mohon pilih file gambar yang valid (JPG, PNG, atau WEBP).');
                    return;
                }

                if (file.size > 10 * 1024 * 1024) {
                    alert('Ukuran foto maksimal adalah 10MB. Mohon gunakan foto yang lebih ringan.');
                    return;
                }

                const self = this;
                self.isPhotoUploading = true;
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        try {
                            const canvas = document.createElement('canvas');
                            let width = img.width;
                            let height = img.height;
                            const maxDimension = 600;

                            if (width > height) {
                                if (width > maxDimension) {
                                    height = Math.round((height * maxDimension) / width);
                                    width = maxDimension;
                                }
                            } else {
                                if (height > maxDimension) {
                                    width = Math.round((width * maxDimension) / height);
                                    height = maxDimension;
                                }
                            }

                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);

                            // Compress into light and crisp 600px JPEG (~35-60KB)
                            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
                            self.form.photo = compressedDataUrl;
                        } catch(err) {
                            // Fallback if canvas context fails
                            self.form.photo = e.target.result;
                        } finally {
                            self.isPhotoUploading = false;
                        }
                    };
                    img.onerror = function() {
                        self.isPhotoUploading = false;
                        alert('Gagal memproses gambar. Mohon coba file gambar lain.');
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            },
            submit: function() {
                // Strict validation for Section 1
                if (!this.form.nama || !this.form.nama.trim()) {
                    alert('Mohon isi Nama Lengkap & Gelar Anda pada Bagian 1.');
                    return;
                }
                if (!this.form.panggilan || !this.form.panggilan.trim()) {
                    alert('Mohon isi Nama Panggilan / Sapaan pada Bagian 1.');
                    return;
                }
                if (!this.form.wa || !this.form.wa.trim()) {
                    alert('Mohon isi Nomor WhatsApp Aktif pada Bagian 1.');
                    return;
                }
                if (!this.form.email || !this.form.email.trim()) {
                    alert('Mohon isi Alamat Email Aktif pada Bagian 1.');
                    return;
                }
                if (!this.form.pendidikan || !this.form.pendidikan.trim()) {
                    alert('Mohon isi Asal Universitas & Prestasi Akademik pada Bagian 1.');
                    return;
                }
                if (!this.form.photo) {
                    alert('Mohon unggah Foto Profil Pengajar pada Bagian 1.');
                    return;
                }

                // Strict validation for Section 2
                if (!Array.isArray(this.form.categories) || this.form.categories.length === 0) {
                    alert('Mohon pilih minimal 1 Bidang Keahlian & Program pada Bagian 2.');
                    return;
                }
                if (!Array.isArray(this.form.jenjang) || this.form.jenjang.length === 0) {
                    alert('Mohon pilih minimal 1 Sasaran Jenjang Mengajar pada Bagian 2.');
                    return;
                }
                if (!this.form.subject || !this.form.subject.trim()) {
                    alert('Mohon isi Spesialisasi Mata Pelajaran Utama pada Bagian 2.');
                    return;
                }

                // Strict validation for Section 3
                if (!this.form.fokusPrivat || !this.form.fokusPrivat.trim()) {
                    alert('Mohon isi Fokus Kebutuhan Les Privat pada Bagian 3.');
                    return;
                }
                if (!this.form.filosofi || !this.form.filosofi.trim()) {
                    alert('Mohon isi Kutipan / Filosofi Mengajar Anda pada Bagian 3.');
                    return;
                }

                const catStr = this.form.categories.join(', ');
                const jnjStr = this.form.jenjang.join(', ');
                
                // 1. Create teacher application record for admin Teacher Verification
                const fullName = this.form.nama.trim();
                const nickName = this.form.panggilan.trim();
                const nowIso = new Date().toISOString();

                const application = {
                    id: 'app-' + Date.now(),
                    submittedAt: nowIso,
                    applied_at: nowIso,
                    status: 'pending',
                    nama: fullName,
                    name: fullName,
                    panggilan: nickName,
                    shortName: nickName,
                    wa: this.form.wa.trim(),
                    phone: this.form.wa.trim(),
                    email: this.form.email.trim(),
                    pendidikan: this.form.pendidikan.trim(),
                    education: this.form.pendidikan.trim(),
                    photo: this.form.photo || '/images/pengajar/mentor-1-math.jpg',
                    categories: [...this.form.categories],
                    jenjang: [...this.form.jenjang],
                    jenjangLabel: this.form.jenjang.join(' & '),
                    subject: this.form.subject.trim(),
                    subjects: [this.form.subject.trim()],
                    kebutuhanPrivat: this.form.fokusPrivat.trim(),
                    fokusPrivat: this.form.fokusPrivat.trim(),
                    philosophy: this.form.filosofi.trim(),
                    filosofi: this.form.filosofi.trim(),
                    highlights: [this.form.prestasi1, this.form.prestasi2, this.form.prestasi3].filter(Boolean),
                    portfolio: (this.form.portfolio || '').trim(),
                    cv_link: (this.form.portfolio || '').trim(),
                    notes: ''
                };

                // 2. Save into serverless database API, localStorage & sync cross-tab
                try {
                    // Send to backend API
                    if (typeof fetch !== 'undefined') {
                        fetch('/api/teacher-applications', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(application)
                        }).catch(function(err) {
                            console.warn('[NLS] API save error:', err);
                        });
                    }

                    let apps = [];
                    const stored = localStorage.getItem("nls_teacher_applications_v1");
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        if (Array.isArray(parsed)) apps = parsed;
                    }
                    apps.unshift(application);
                    localStorage.setItem("nls_teacher_applications_v1", JSON.stringify(apps));
                    
                    if (typeof window !== 'undefined' && window.PengajarDatabase && typeof window.PengajarDatabase.submitApplication === 'function') {
                        try {
                            window.PengajarDatabase.submitApplication(application);
                        } catch (err) {}
                    }

                    if (typeof BroadcastChannel !== 'undefined') {
                        const bc = new BroadcastChannel('nls_sync_channel');
                        bc.postMessage({ type: 'SYNC_ALL' });
                        bc.postMessage({ type: 'TEACHER_APPLICATION_ADDED', data: application });
                        bc.postMessage({ type: 'TEACHER_APPLICATIONS_UPDATED', data: apps });
                    }
                    window.dispatchEvent(new CustomEvent('nls-teacher-application-added', { detail: application }));
                    window.dispatchEvent(new CustomEvent('nls-teacher-applications-updated', { detail: apps }));
                } catch (e) {
                    console.error('Error saving teacher application:', e);
                }

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
                
                alert('Pendaftaran berhasil dikirim! Formulir Anda telah masuk ke antrean Teacher Verification NLS dan diteruskan ke Tim Akademik.');

                this.modalOpen = false;
                this.showRegistrationModal = false;
                this.showModal = false;

                this.form = {
                    nama: '', panggilan: '', wa: '', email: '', pendidikan: '',
                    categories: [], jenjang: [], subject: '', fokusPrivat: '',
                    filosofi: '', prestasi1: '', prestasi2: '', prestasi3: '', portfolio: ''
                };
            },
            submitForm: function() {
                this.submit();
            }
        });
    }
}

if (typeof window !== 'undefined') {
    window.initAlpineStores = initAlpineStores;
    if (window.Alpine) {
        initAlpineStores();
    } else {
        document.addEventListener('alpine:init', initAlpineStores);
        document.addEventListener('DOMContentLoaded', function() {
            if (window.Alpine) initAlpineStores();
        });
    }
}
