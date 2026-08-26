$privatPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\privat\index.html"
$privatContent = [System.IO.File]::ReadAllText($privatPath, [System.Text.Encoding]::UTF8)

$oldSectionPattern = '(?s)<!-- Pilihan Subjek Privat.*?<!-- Program Fokus Akademik Title -->'

$newSection = @'
<!-- Pilihan Subjek Privat (FLUID & ORGANIC SUBJECT EXPLORER - BULLETPROOF FLEXBOX) -->
            <section x-data="{
                activeSubjek: 'matematika',
                subjekList: {
                    matematika: {
                        id: 'matematika',
                        name: 'Matematika',
                        tagline: 'Dari Dasar Konseptual hingga Strategi Soal Olimpiade & UTBK',
                        desc: 'Bimbingan terstruktur untuk mengatasi kesulitan hitungan, memperkuat logika analisis rumus, serta bedah soal tipe HOTS (Higher Order Thinking Skills) kurikulum nasional maupun internasional.',
                        levels: ['SD / MI', 'SMP / MTs', 'SMA / MA', 'Persiapan SNBT', 'OSN / Kompetisi', 'Cambridge & IB'],
                        themeColor: '#0284c7',
                        btnBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                        iconBg: '#0284c7',
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
                        desc: 'Bimbingan sains aplikatif dan eksperimental yang memudahkan pemahaman fenomena alam, rumus fisika, reaksi kimia, serta mekanisme biologi secara logis dan menyenangkan.',
                        levels: ['IPA Terpadu SD/SMP', 'Fisika SMA/PT', 'Kimia SMA/PT', 'Biologi SMA/PT', 'OSN Kebumian & Astronomi'],
                        themeColor: '#059669',
                        btnBg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        iconBg: '#059669',
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
                        themeColor: '#7c3aed',
                        btnBg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                        iconBg: '#7c3aed',
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
                        desc: 'Bimbingan intensif logika berpikir komputasional, algoritma pemecahan masalah, struktur data, dan penguasaan bahasa pemrograman modern bersama mentor praktisi & medalis.',
                        levels: ['SD (Scratch & Logika)', 'SMP (Python Dasar)', 'SMA (C++ & Algoritma)', 'OSN Informatika / TOKI'],
                        themeColor: '#d97706',
                        btnBg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                        iconBg: '#d97706',
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
                        themeColor: '#e11d48',
                        btnBg: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                        iconBg: '#e11d48',
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
            }" class="py-16 md:py-24 px-4 md:px-8 container-max w-full">

                <!-- Section Header -->
                <div class="text-center mb-10 md:mb-12 max-w-3xl mx-auto">
                    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-[#0284c7] font-extrabold text-xs tracking-wider uppercase mb-3 shadow-2xs">
                        <span class="icon-[mdi--sparkles] text-sm"></span>
                        <span>Bidang Pembelajaran Lengkap &amp; Fleksibel</span>
                    </div>
                    <h2 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                        Pilihan Subjek Les Privat
                    </h2>
                    <p class="text-slate-600 dark:text-slate-300 text-base md:text-lg font-medium leading-relaxed">
                        Pilih mata pelajaran yang ingin difokuskan. Mentor terbaik NLS siap merancang kurikulum belajar yang dipersonalisasi khusus untuk siswa.
                    </p>
                </div>

                <!-- 1. FLUID PILL TABS SELECTOR -->
                <div class="flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-4 pt-1 px-1 mb-8 w-full">
                    <button type="button" @click="activeSubjek = 'matematika'"
                        style="border-radius: 9999px !important;"
                        :style="activeSubjek === 'matematika' 
                            ? 'background: #0284c7 !important; color: #ffffff !important; border: 2px solid #0284c7 !important; box-shadow: 0 4px 16px rgba(2, 132, 199, 0.35);' 
                            : 'background: #ffffff; color: #0f172a; border: 1.5px solid #cbd5e1;'"
                        class="px-5 py-3 font-extrabold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-200 shrink-0 cursor-pointer hover:scale-105">
                        <span class="icon-[mdi--function-variant] text-base"></span>
                        <span>Matematika</span>
                    </button>

                    <button type="button" @click="activeSubjek = 'sains'"
                        style="border-radius: 9999px !important;"
                        :style="activeSubjek === 'sains' 
                            ? 'background: #059669 !important; color: #ffffff !important; border: 2px solid #059669 !important; box-shadow: 0 4px 16px rgba(5, 150, 105, 0.35);' 
                            : 'background: #ffffff; color: #0f172a; border: 1.5px solid #cbd5e1;'"
                        class="px-5 py-3 font-extrabold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-200 shrink-0 cursor-pointer hover:scale-105">
                        <span class="icon-[mdi--flask] text-base"></span>
                        <span>Sains (IPA)</span>
                    </button>

                    <button type="button" @click="activeSubjek = 'bahasa'"
                        style="border-radius: 9999px !important;"
                        :style="activeSubjek === 'bahasa' 
                            ? 'background: #7c3aed !important; color: #ffffff !important; border: 2px solid #7c3aed !important; box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);' 
                            : 'background: #ffffff; color: #0f172a; border: 1.5px solid #cbd5e1;'"
                        class="px-5 py-3 font-extrabold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-200 shrink-0 cursor-pointer hover:scale-105">
                        <span class="icon-[mdi--translate] text-base"></span>
                        <span>Bahasa Asing</span>
                    </button>

                    <button type="button" @click="activeSubjek = 'informatika'"
                        style="border-radius: 9999px !important;"
                        :style="activeSubjek === 'informatika' 
                            ? 'background: #d97706 !important; color: #ffffff !important; border: 2px solid #d97706 !important; box-shadow: 0 4px 16px rgba(217, 119, 6, 0.35);' 
                            : 'background: #ffffff; color: #0f172a; border: 1.5px solid #cbd5e1;'"
                        class="px-5 py-3 font-extrabold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-200 shrink-0 cursor-pointer hover:scale-105">
                        <span class="icon-[mdi--code-tags] text-base"></span>
                        <span>Informatika</span>
                    </button>

                    <button type="button" @click="activeSubjek = 'humaniora'"
                        style="border-radius: 9999px !important;"
                        :style="activeSubjek === 'humaniora' 
                            ? 'background: #e11d48 !important; color: #ffffff !important; border: 2px solid #e11d48 !important; box-shadow: 0 4px 16px rgba(225, 29, 72, 0.35);' 
                            : 'background: #ffffff; color: #0f172a; border: 1.5px solid #cbd5e1;'"
                        class="px-5 py-3 font-extrabold text-xs sm:text-sm flex items-center gap-2.5 transition-all duration-200 shrink-0 cursor-pointer hover:scale-105">
                        <span class="icon-[mdi--book-open-page-variant] text-base"></span>
                        <span>Humaniora (IPS)</span>
                    </button>
                </div>

                <!-- 2. EXPANSIVE UNIFIED SHOWCASE (FLEXBOX LAYOUT - TIDAK KOTAK-KOTAK) -->
                <div style="border-radius: 36px !important; border: 2px solid #e2e8f0;"
                    class="w-full bg-white dark:bg-[#131D38] dark:border-slate-800 p-6 sm:p-10 md:p-12 shadow-xl transition-all duration-300">
                    
                    <div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 36px; align-items: stretch; width: 100%;">
                        
                        <!-- Left Info Column -->
                        <div style="flex: 1 1 380px; min-width: 280px; display: flex; flex-direction: column; justify-content: space-between; gap: 24px;">
                            
                            <div class="space-y-5">
                                <!-- Subject Header -->
                                <div class="flex items-center gap-3.5">
                                    <div style="width: 52px; height: 52px; border-radius: 18px; display: flex; align-items: center; justify-center; color: #ffffff;"
                                        :style="'background: ' + subjekList[activeSubjek].iconBg + ' !important;'"
                                        class="shadow-md text-2xl shrink-0">
                                        <span :class="subjekList[activeSubjek].icon"></span>
                                    </div>
                                    <div>
                                        <span class="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Bidang Pembelajaran</span>
                                        <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight" x-text="subjekList[activeSubjek].name"></h3>
                                    </div>
                                </div>

                                <!-- Tagline & Description -->
                                <div class="space-y-2">
                                    <h4 class="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 leading-snug" x-text="subjekList[activeSubjek].tagline"></h4>
                                    <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium" x-text="subjekList[activeSubjek].desc"></p>
                                </div>

                                <!-- Jenjang yang Dilayani -->
                                <div class="space-y-2 pt-2">
                                    <span class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Jenjang yang Dilayani:</span>
                                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                        <template x-for="lvl in subjekList[activeSubjek].levels" :key="lvl">
                                            <span style="border-radius: 9999px !important; border: 1.5px solid #e2e8f0;"
                                                class="px-3.5 py-1 text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs"
                                                x-text="lvl"></span>
                                        </template>
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div style="display: flex; flex-wrap: wrap; gap: 12px; padding-top: 16px;">
                                <button type="button" 
                                    @click="$store.paketPrivat.formData.mataPelajaran = subjekList[activeSubjek].name; $store.paketPrivat.open(activeSubjek === 'informatika' ? 'intensif' : 'reguler')"
                                    onclick="openPrivatPackage('reguler')"
                                    :style="'background: ' + subjekList[activeSubjek].btnBg + ' !important; color: #ffffff !important; border-radius: 20px !important;'"
                                    class="px-8 py-4 font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer">
                                    <span class="icon-[mdi--pencil-plus] text-lg"></span>
                                    <span>Pilih &amp; Konsultasi Subjek Ini</span>
                                </button>
                                
                                <a href="https://wa.me/628170100788" target="_blank" rel="noopener noreferrer"
                                    style="border-radius: 20px !important; border: 1.5px solid #cbd5e1;"
                                    class="px-6 py-4 font-bold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all">
                                    <span class="icon-[mdi--whatsapp] text-emerald-500 text-lg"></span>
                                    <span>Tanya Mentor</span>
                                </a>
                            </div>
                        </div>

                        <!-- Right Topics Column -->
                        <div style="flex: 1 1 380px; min-width: 280px; border-radius: 28px !important; border: 1.5px solid #e2e8f0;"
                            class="bg-slate-50/80 dark:bg-slate-900/80 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between">
                            
                            <div class="space-y-4">
                                <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                                    <div class="flex items-center gap-2">
                                        <span class="icon-[mdi--book-open-variant] text-[#0284c7] text-lg"></span>
                                        <span class="font-black text-sm text-slate-900 dark:text-white">Topik &amp; Materi Spesifik</span>
                                    </div>
                                    <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">Disesuaikan Permintaan</span>
                                </div>

                                <div class="space-y-2.5">
                                    <template x-for="(t, idx) in subjekList[activeSubjek].topics" :key="idx">
                                        <div @click="$store.paketPrivat.formData.mataPelajaran = subjekList[activeSubjek].name + ' (' + t.name + ')'; $store.paketPrivat.open(activeSubjek === 'informatika' ? 'intensif' : 'reguler')"
                                            style="border-radius: 16px !important; border: 1.5px solid #e2e8f0;"
                                            class="p-3 sm:p-3.5 bg-white dark:bg-slate-800 dark:border-slate-700 hover:border-sky-400 flex items-center justify-between gap-3 transition-all duration-150 cursor-pointer group shadow-2xs hover:shadow-sm">
                                            <div class="flex items-center gap-3">
                                                <span style="width: 24px; height: 24px; border-radius: 9999px; background: #e0f2fe; color: #0284c7;"
                                                    class="flex items-center justify-center text-xs font-black shrink-0"
                                                    x-text="idx + 1"></span>
                                                <span style="color: #0f172a !important;" class="text-xs sm:text-sm font-bold group-hover:text-primary transition-colors" x-text="t.name"></span>
                                            </div>
                                            <span style="border-radius: 9999px !important; border: 1px solid #cbd5e1; color: #475569;"
                                                class="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-slate-50 dark:bg-slate-900 shrink-0"
                                                x-text="t.tag"></span>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </section>

            <!-- Program Fokus Akademik Title -->
'@

$privatContent = [System.Text.RegularExpressions.Regex]::Replace($privatContent, $oldSectionPattern, $newSection)

[System.IO.File]::WriteAllText($privatPath, $privatContent, [System.Text.Encoding]::UTF8)
Write-Host "SUCCESS: Fixed layout with robust flexbox and high contrast styling!"
