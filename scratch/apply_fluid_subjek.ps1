$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$privatContent = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

$oldSectionPattern = '(?s)<!-- Pilihan Subjek Privat.*?<!-- Program Fokus Akademik Title -->'

$newSection = @'
<!-- Pilihan Subjek Privat (FLUID & ORGANIC SUBJECT EXPLORER - HINDARI KOTAK-KOTAK) -->
            <section x-data="{
                activeSubjek: 'matematika',
                subjekList: {
                    matematika: {
                        id: 'matematika',
                        name: 'Matematika',
                        tagline: 'Dari Dasar Konseptual hingga Strategi Soal Olimpiade & UTBK',
                        desc: 'Bimbingan terstruktur untuk mengatasi kesulitan hitungan, memperkuat logika analisis rumus, serta bedah soal tipe HOTS (Higher Order Thinking Skills).',
                        levels: ['SD / MI', 'SMP / MTs', 'SMA / MA', 'Persiapan SNBT', 'OSN / Kompetisi', 'Cambridge & IB'],
                        theme: 'sky',
                        badgeColor: 'bg-sky-500 text-white',
                        accentColor: '#0284c7',
                        icon: 'icon-[mdi--function-variant]',
                        topics: [
                            { name: 'Aljabar & Persamaan Linear', tag: 'Dasar & Lanjut' },
                            { name: 'Geometri & Trigonometri', tag: 'Visual & Analisis' },
                            { name: 'Kalkulus & Diferensial Integral', tag: 'SMA & Kuliah' },
                            { name: 'Penalaran Matematika UTBK-SNBT', tag: 'Trik Cepat' },
                            { name: 'Kurikulum Internasional (Cambridge / IB)', tag: 'Bilingual' },
                            { name: 'Olimpiade Sains (OSN, AMO, SEAMO)', tag: 'Champion Level' }
                        ]
                    },
                    sains: {
                        id: 'sains',
                        name: 'Sains (IPA)',
                        tagline: 'Fisika, Kimia, Biologi, Astronomi & Kebumian',
                        desc: 'Bimbingan sains aplikatif dan eksperimental yang memudahkan pemahaman fenomena alam, rumus fisika, reaksi kimia, serta mekanisme biologi secara logis.',
                        levels: ['IPA Terpadu SD/SMP', 'Fisika SMA/PT', 'Kimia SMA/PT', 'Biologi SMA/PT', 'OSN Kebumian & Astronomi'],
                        theme: 'emerald',
                        badgeColor: 'bg-emerald-500 text-white',
                        accentColor: '#059669',
                        icon: 'icon-[mdi--flask]',
                        topics: [
                            { name: 'Mekanika, Listrik & Optik (Fisika)', tag: 'Konseptual' },
                            { name: 'Termodinamika & Gelombang', tag: 'Problem Solving' },
                            { name: 'Stoikiometri & Kimia Organik', tag: 'Reaksi & Struktur' },
                            { name: 'Genetika & Biologi Sel', tag: 'Analisis Molekuler' },
                            { name: 'Astronomi & Tata Surya', tag: 'OSN Khusus' },
                            { name: 'Geologi & Atmosfer (Kebumian)', tag: 'OSN Khusus' }
                        ]
                    },
                    bahasa: {
                        id: 'bahasa',
                        name: 'Bahasa Asing',
                        tagline: 'English, Mandarin, Jepang & Bahasa Internasional',
                        desc: 'Program bimbingan bahasa komprehensif mulai dari percakapan aktif (*Speaking*), tata bahasa (*Grammar*), persiapan ujian sekolah, hingga sertifikasi internasional.',
                        levels: ['Kids & Teens', 'SMP & SMA', 'IELTS / TOEFL Prep', 'HSK Mandarin', 'JLPT Jepang'],
                        theme: 'purple',
                        badgeColor: 'bg-purple-600 text-white',
                        accentColor: '#7c3aed',
                        icon: 'icon-[mdi--translate]',
                        topics: [
                            { name: 'Academic & General English', tag: 'Komprehensif' },
                            { name: 'IELTS & TOEFL iBT Preparation', tag: 'Target Skor 7.5+' },
                            { name: 'Mandarin (Pinyin, Hanzi & HSK)', tag: 'Level 1-6' },
                            { name: 'Bahasa Jepang (Hiragana & JLPT)', tag: 'N5 - N2' },
                            { name: 'Bahasa Jerman & Prancis Dasar', tag: 'A1 - B2' },
                            { name: 'English for School Curriculum', tag: 'Nilai Rapor 95+' }
                        ]
                    },
                    informatika: {
                        id: 'informatika',
                        name: 'Informatika & Coding',
                        tagline: 'Competitive Programming, Logika Algoritma & Software Dev',
                        desc: 'Bimbingan intensif logika berpikir komputasional, algoritma pemecahan masalah, struktur data, dan penguasaan bahasa pemrograman modern.',
                        levels: ['SD (Scratch & Logika)', 'SMP (Python Dasar)', 'SMA (C++ & Algoritma)', 'OSN Informatika / TOKI'],
                        theme: 'amber',
                        badgeColor: 'bg-amber-500 text-slate-950 font-black',
                        accentColor: '#d97706',
                        icon: 'icon-[mdi--code-tags]',
                        topics: [
                            { name: 'OSN Informatika (C++ / Struktur Data)', tag: 'Medalis Mentor' },
                            { name: 'Python Programming & Data Science', tag: 'Praktis & Interaktif' },
                            { name: 'Algoritma & Pemecahan Masalah', tag: 'Fondasi Kuat' },
                            { name: 'Web Development (HTML, CSS, JS)', tag: 'Project Base' },
                            { name: 'Logika Pemrograman Pemula', tag: 'Anak & Remaja' }
                        ]
                    },
                    humaniora: {
                        id: 'humaniora',
                        name: 'Humaniora (IPS)',
                        tagline: 'Ekonomi, Akuntansi, Geografi, Sosiologi & Sejarah',
                        desc: 'Pendampingan studi sosial berbasis pemikiran kritis, penalaran grafik, pembukuan akuntansi, serta penguasaan materi UTBK-SNBT rumpun sosial humaniora.',
                        levels: ['IPS Terpadu SMP', 'Ekonomi & Akuntansi SMA', 'Sosiologi & Geografi', 'UTBK-SNBT Soshum'],
                        theme: 'rose',
                        badgeColor: 'bg-rose-500 text-white',
                        accentColor: '#e11d48',
                        icon: 'icon-[mdi--book-open-page-variant]',
                        topics: [
                            { name: 'Ekonomi Makro/Mikro & Akuntansi', tag: 'Kuantitatif & Teori' },
                            { name: 'Geografi & Penginderaan Jauh', tag: 'Peta & Analisis' },
                            { name: 'Sosiologi & Fenomena Sosial', tag: 'Kritis & Konseptual' },
                            { name: 'Sejarah Indonesia & Dunia', tag: 'Kronologis' },
                            { name: 'Tes Penalaran & Literasi SNBT', tag: 'Bank Soal' }
                        ]
                    }
                }
            }" class="py-20 px-4 md:px-8 container-max relative">

                <!-- Section Header -->
                <div class="text-center mb-12">
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-primary dark:text-sky-400 font-extrabold text-xs tracking-wider uppercase mb-3 shadow-xs">
                        <span class="icon-[mdi--sparkles] text-sm"></span>
                        <span>Bidang Pembelajaran Lengkap &amp; Fleksibel</span>
                    </div>
                    <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Pilihan Subjek Les Privat
                    </h2>
                    <p class="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
                        Pilih mata pelajaran yang ingin difokuskan. Mentor terbaik NLS siap merancang kurikulum belajar yang dipersonalisasi khusus untuk siswa.
                    </p>
                </div>

                <!-- 1. FLUID INTERACTIVE SUBJEK PILLS (TAB SELECTOR) -->
                <div class="flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar pb-3 pt-1 px-1 mb-8">
                    <button type="button" @click="activeSubjek = 'matematika'"
                        class="px-5 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-200 shrink-0 cursor-pointer shadow-sm"
                        :class="activeSubjek === 'matematika' 
                            ? 'bg-[#0284c7] text-white shadow-lg shadow-sky-500/30 scale-105 ring-2 ring-sky-300' 
                            : 'bg-white dark:bg-[#131D38] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-sky-300'">
                        <span class="icon-[mdi--function-variant] text-base"></span>
                        <span>Matematika</span>
                    </button>

                    <button type="button" @click="activeSubjek = 'sains'"
                        class="px-5 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-200 shrink-0 cursor-pointer shadow-sm"
                        :class="activeSubjek === 'sains' 
                            ? 'bg-[#059669] text-white shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-300' 
                            : 'bg-white dark:bg-[#131D38] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-300'">
                        <span class="icon-[mdi--flask] text-base"></span>
                        <span>Sains (IPA)</span>
                    </button>

                    <button type="button" @click="activeSubjek = 'bahasa'"
                        class="px-5 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-200 shrink-0 cursor-pointer shadow-sm"
                        :class="activeSubjek === 'bahasa' 
                            ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-500/30 scale-105 ring-2 ring-purple-300' 
                            : 'bg-white dark:bg-[#131D38] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-purple-300'">
                        <span class="icon-[mdi--translate] text-base"></span>
                        <span>Bahasa Asing</span>
                    </button>

                    <button type="button" @click="activeSubjek = 'informatika'"
                        class="px-5 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-200 shrink-0 cursor-pointer shadow-sm"
                        :class="activeSubjek === 'informatika' 
                            ? 'bg-[#d97706] text-white shadow-lg shadow-amber-500/30 scale-105 ring-2 ring-amber-300' 
                            : 'bg-white dark:bg-[#131D38] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-amber-300'">
                        <span class="icon-[mdi--code-tags] text-base"></span>
                        <span>Informatika</span>
                    </button>

                    <button type="button" @click="activeSubjek = 'humaniora'"
                        class="px-5 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-200 shrink-0 cursor-pointer shadow-sm"
                        :class="activeSubjek === 'humaniora' 
                            ? 'bg-[#e11d48] text-white shadow-lg shadow-rose-500/30 scale-105 ring-2 ring-rose-300' 
                            : 'bg-white dark:bg-[#131D38] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-rose-300'">
                        <span class="icon-[mdi--book-open-page-variant] text-base"></span>
                        <span>Humaniora (IPS)</span>
                    </button>
                </div>

                <!-- 2. EXPANSIVE ORGANIC SHOWCASE BANNER (SATU WADAH MEWAH & TIDAK KOTAK-KOTAK) -->
                <div style="border-radius: 36px !important;"
                    class="relative bg-gradient-to-br from-white via-slate-50/70 to-sky-50/30 dark:from-[#131D38] dark:via-[#0f182e] dark:to-slate-900 border-2 border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xl overflow-hidden transition-all duration-300">
                    
                    <!-- Ambient Subject Gradient Aura -->
                    <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
                        :class="{
                            'bg-sky-500': activeSubjek === 'matematika',
                            'bg-emerald-500': activeSubjek === 'sains',
                            'bg-purple-500': activeSubjek === 'bahasa',
                            'bg-amber-500': activeSubjek === 'informatika',
                            'bg-rose-500': activeSubjek === 'humaniora'
                        }"></div>

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                        
                        <!-- Left Info Column -->
                        <div class="lg:col-span-6 space-y-6">
                            
                            <!-- Subject Header Badge -->
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md transition-all duration-300"
                                    :class="subjekList[activeSubjek].badgeColor">
                                    <span :class="subjekList[activeSubjek].icon"></span>
                                </div>
                                <div>
                                    <span class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Bidang Pembelajaran</span>
                                    <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight" x-text="subjekList[activeSubjek].name"></h3>
                                </div>
                            </div>

                            <!-- Tagline & Description -->
                            <div>
                                <h4 class="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-2 leading-snug" x-text="subjekList[activeSubjek].tagline"></h4>
                                <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium" x-text="subjekList[activeSubjek].desc"></p>
                            </div>

                            <!-- Jenjang Yang Dicakup (Pills) -->
                            <div class="space-y-2">
                                <span class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Jenjang yang Dilayani:</span>
                                <div class="flex flex-wrap gap-2">
                                    <template x-for="lvl in subjekList[activeSubjek].levels" :key="lvl">
                                        <span class="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs" x-text="lvl"></span>
                                    </template>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="pt-4 flex flex-col sm:flex-row items-center gap-3.5">
                                <button type="button" 
                                    @click="$store.paketPrivat.formData.mataPelajaran = subjekList[activeSubjek].name; $store.paketPrivat.open(activeSubjek === 'informatika' ? 'intensif' : 'reguler')"
                                    onclick="openPrivatPackage('reguler')"
                                    style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important; color: #ffffff !important;"
                                    class="w-full sm:w-auto px-7 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                                    <span class="icon-[mdi--pencil-plus] text-lg"></span>
                                    <span>Pilih &amp; Konsultasi Subjek Ini</span>
                                </button>
                                
                                <a href="https://wa.me/628170100788" target="_blank" rel="noopener noreferrer"
                                    class="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all">
                                    <span class="icon-[mdi--whatsapp] text-emerald-500 text-lg"></span>
                                    <span>Tanya Mentor</span>
                                </a>
                            </div>
                        </div>

                        <!-- Right Topics Cloud Column -->
                        <div class="lg:col-span-6 space-y-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div class="flex items-center gap-2">
                                    <span class="icon-[mdi--book-open-outline] text-primary text-lg"></span>
                                    <span class="font-extrabold text-sm text-slate-900 dark:text-white">Topik &amp; Materi Spesifik</span>
                                </div>
                                <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">Disesuaikan Permintaan</span>
                            </div>

                            <div class="space-y-2.5">
                                <template x-for="(t, idx) in subjekList[activeSubjek].topics" :key="idx">
                                    <div @click="$store.paketPrivat.formData.mataPelajaran = subjekList[activeSubjek].name + ' (' + t.name + ')'; $store.paketPrivat.open(activeSubjek === 'informatika' ? 'intensif' : 'reguler')"
                                        class="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50/80 dark:hover:bg-sky-950/40 border border-slate-200/70 dark:border-slate-700/60 hover:border-sky-300 flex items-center justify-between gap-3 transition-all duration-150 cursor-pointer group">
                                        <div class="flex items-center gap-3">
                                            <span class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0" x-text="idx + 1"></span>
                                            <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors" x-text="t.name"></span>
                                        </div>
                                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0" x-text="t.tag"></span>
                                    </div>
                                </template>
                            </div>
                        </div>

                    </div>
                </div>

            </section>

            <!-- Program Fokus Akademik Title -->
'@

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldSectionPattern, $newSection)

[System.IO.File]::WriteAllText($privatPath, $privatContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Replaced rigid boxy grid with sleek interactive Fluid Subject Explorer!"
