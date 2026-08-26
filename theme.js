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

// Global Alpine Store for Program Registration & Consultation Modal
document.addEventListener('alpine:init', function() {
    if (window.Alpine) {
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
                this.showToast = true;
                const self = this;
                setTimeout(function() {
                    self.showToast = false;
                }, 4000);
            }
        });
    }
});
