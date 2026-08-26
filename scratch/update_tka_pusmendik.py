import os
import re

def update_tka_page():
    tka_path = r"c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\tka\index.html"
    bimbel_tka_path = r"c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\bimbel-tka\index.html"

    with open(tka_path, "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Update Title and Meta Descriptions
    html = re.sub(
        r'<title>.*?</title>',
        '<title>Bimbel TKA - Persiapan Tes Kemampuan Akademik Pusmendik Kemendikdasmen | Next Level Study</title>',
        html,
        count=1
    )
    
    html = re.sub(
        r'<meta name="description" content=".*?">',
        '<meta name="description" content="Bimbingan belajar resmi persiapan Tes Kemampuan Akademik (TKA) mengacu pada standar Pusat Asesmen Pendidikan (Pusmendik) Kemendikdasmen RI. Mencakup Mata Pelajaran Wajib (Bahasa Indonesia, Matematika, Bahasa Inggris) dan Mata Pelajaran Pilihan Saintek, Soshum, Bahasa, & Vokasi untuk seleksi SNBP & sekolah lanjutan.">',
        html,
        count=1
    )

    html = re.sub(
        r'<meta property="og:title" content=".*?">',
        '<meta property="og:title" content="Bimbel TKA - Persiapan Tes Kemampuan Akademik Pusmendik Kemendikdasmen | Next Level Study">',
        html,
        count=1
    )

    html = re.sub(
        r'<meta property="og:description" content=".*?">',
        '<meta property="og:description" content="Bimbingan belajar resmi persiapan Tes Kemampuan Akademik (TKA) mengacu pada standar Pusat Asesmen Pendidikan (Pusmendik) Kemendikdasmen RI. Mencakup Mata Pelajaran Wajib dan Pilihan untuk seleksi SNBP & pemetaan akademik terstandar.">',
        html,
        count=1
    )

    # 2. Update Hero Section
    new_hero = '''<!-- Hero Section -->
<section class="relative min-h-[85vh] flex items-center overflow-hidden bg-surface-container py-12 md:py-20">
<div class="absolute inset-0 z-0">
<img class="w-full h-full object-cover opacity-30 mix-blend-overlay" data-alt="Indonesian high school students studying in academic setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfyGswPvg92KH9eUq6RDcan9jpFB2NPPopShzbvj7A1Z2lZvTqNv6WgSVL6Src1Uf8GFJww9ja30m8LKNujEkg3QueUvl1oRavU990Z3HJe2-SrAFdpWBmoe6QEvawWqcj1S45s-GZxIhIz9-LxJXkwM3I3PqKj8OqGlrnMSATyJtqMnz75mNGy94UkZW4AhgjDgC-o9SnO-VUTicCY5fGRnthJiYZe_C9lT5oHBdZwOiDcf6Hm-lIdQ">
<div class="absolute inset-0 bg-gradient-to-r from-surface-bright via-surface-bright/80 to-transparent"></div>
</div>
<div class="relative z-10 px-container-margin-mobile md:px-container-margin-desktop max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
<div class="space-y-6">
<div class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full font-label-sm text-xs font-extrabold tracking-wider uppercase shadow-xs">
    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
    <span>Standar Resmi Pusmendik Kemendikdasmen RI</span>
</div>
<h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight font-black">
    Kuasai Tes Kemampuan Akademik (TKA) Terstandar Nasional
</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
    Bimbingan belajar spesialis TKA yang mengacu langsung pada kerangka asesmen <strong>Pusat Asesmen Pendidikan (Pusmendik) Kemendikdasmen</strong>. Dirancang untuk memberikan laporan capaian akademik murid yang terstandar, objektif, dan akurat sebagai penentu utama seleksi SNBP, kedinasan, dan sekolah lanjutan.
</p>
<div class="flex flex-col sm:flex-row gap-4 pt-2">
    <a href="https://wa.me/6285163070002?text=Halo%20Next%20Level%20Study,%20saya%20tertarik%20dengan%20Program%20Bimbel%20TKA%20Pusmendik" target="_blank" class="bg-primary text-on-primary px-8 py-4 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 group hover:shadow-lg hover:scale-105 active:scale-95 transition-all inline-flex font-bold shadow-md">
        <span>Mulai Belajar TKA</span>
        <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
    </a>
    <a href="#kerangka-asesmen" class="glass-card text-primary border border-primary/20 px-8 py-4 rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary/5 hover:scale-105 active:scale-95 transition-all inline-flex font-bold shadow-sm">
        <span class="material-symbols-outlined text-lg">menu_book</span>
        <span>Kerangka Asesmen Resmi</span>
    </a>
</div>
</div>
<div class="hidden md:block">
<div class="glass-card p-8 rounded-3xl relative overflow-hidden transition-all duration-700 translate-y-0 opacity-100 border border-white/60 shadow-2xl">
<div class="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 blur-3xl -z-10 rounded-full"></div>
<div class="flex items-center justify-between mb-6 pb-4 border-b border-surface-container">
    <div>
        <span class="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 font-bold text-xs">Pusmendik Aligned</span>
        <h4 class="font-headline-sm text-headline-sm text-primary font-bold mt-1">Live Coaching TKA Mapel Wajib</h4>
    </div>
    <span class="flex items-center gap-1.5 font-label-sm text-label-sm text-error font-bold animate-pulse">
        <span class="w-2 h-2 rounded-full bg-error"></span> INTERAKTIF
    </span>
</div>
<div class="space-y-5">
    <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
            <span class="material-symbols-outlined text-2xl">school</span>
        </div>
        <div>
            <div class="font-label-md text-label-md text-on-surface font-black">Tim Master Mentor NLS</div>
            <div class="font-label-sm text-label-sm text-on-surface-variant">Spesialis Literasi & Numerasi Pusmendik</div>
        </div>
    </div>
    <div class="bg-surface-bright/70 p-4 rounded-2xl border border-white/60 space-y-2">
        <div class="flex justify-between text-xs font-bold text-slate-700">
            <span>Struktur Soal TKA Pusmendik</span>
            <span class="text-primary font-black">4 Tipe Soal Resmi</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium pt-1">
            <div class="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-100">
                <span class="text-primary font-bold">1.</span> PG Sederhana (5 Opsi)
            </div>
            <div class="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-100">
                <span class="text-primary font-bold">2.</span> PG Kompleks (>1 Jawaban)
            </div>
            <div class="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-100">
                <span class="text-primary font-bold">3.</span> PG Majemuk (Benar/Salah)
            </div>
            <div class="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-slate-100">
                <span class="text-primary font-bold">4.</span> Soal Menjodohkan
            </div>
        </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
        <div class="bg-primary/5 p-3.5 rounded-xl border border-primary/10">
            <div class="font-label-sm text-xs text-on-surface-variant font-medium">Fokus Mapel</div>
            <div class="font-headline-sm text-sm font-bold text-primary">Wajib &amp; Pilihan</div>
        </div>
        <div class="bg-secondary-container/10 p-3.5 rounded-xl border border-secondary-container/20">
            <div class="font-label-sm text-xs text-secondary-container font-medium">Metode Ujian</div>
            <div class="font-headline-sm text-sm font-bold text-secondary-container">CBT IRT Terstandar</div>
        </div>
    </div>
</div>
</div>
</div>
</div>
</section>'''

    # Replace hero section
    html = re.sub(
        r'<!-- Hero Section -->.*?<!-- Pillars Section -->',
        new_hero + '\n<!-- Pillars Section -->',
        html,
        flags=re.DOTALL
    )

    # 3. Insert Dedicated Kerangka Asesmen Section
    kerangka_section = '''<!-- Kerangka Asesmen Pusmendik Section -->
<section id="kerangka-asesmen" class="py-20 px-container-margin-mobile md:px-container-margin-desktop max-w-7xl mx-auto scroll-mt-16">
    <div class="text-center max-w-3xl mx-auto mb-14 space-y-4">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-[#0284c7] text-xs font-black uppercase tracking-wider">
            <span class="material-symbols-outlined text-sm">verified</span>
            <span>Rujukan Resmi Kemendikdasmen RI</span>
        </div>
        <h2 class="font-display-lg text-display-lg-mobile md:text-headline-md text-primary font-black">
            Kerangka Asesmen Tes Kemampuan Akademik (TKA)
        </h2>
        <p class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Berdasarkan regulasi resmi <strong>Pusat Asesmen Pendidikan (Pusmendik) Kemendikdasmen</strong>, TKA diselenggarakan untuk menyediakan pelaporan capaian akademik terstandar nasional yang objektif dan adil untuk seluruh murid di Indonesia.
        </p>
    </div>

    <!-- Official Portal Banner Link -->
    <div class="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#004b70] via-[#0284c7] to-[#0369a1] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 max-w-2xl">
            <div class="flex items-center gap-2 text-sky-200 text-xs font-bold uppercase tracking-wider">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Website Resmi Pemerintah: Pusmendik Kemendikdasmen</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-white">Lihat Panduan &amp; Silabus Lengkap di Portal Resmi TKA</h3>
            <p class="text-sm text-sky-100/90 leading-relaxed">
                Pelajari rincian domain, sub-domain materi, dan format asesmen resmi langsung dari Kementerian Pendidikan Dasar dan Menengah.
            </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <a href="https://pusmendik.kemendikdasmen.go.id/tka/tka/view/mata-pelajaran-wajib/sma" target="_blank" rel="noopener noreferrer"
                class="px-5 py-3 rounded-xl bg-white text-[#004b70] font-black text-xs uppercase tracking-wider hover:bg-sky-50 transition-all text-center flex items-center justify-center gap-2 shadow-md">
                <span>Mapel Wajib SMA</span>
                <span class="material-symbols-outlined text-base">open_in_new</span>
            </a>
            <a href="https://pusmendik.kemendikdasmen.go.id/tka/" target="_blank" rel="noopener noreferrer"
                class="px-5 py-3 rounded-xl bg-sky-900/60 border border-white/30 text-white font-bold text-xs uppercase tracking-wider hover:bg-sky-900 transition-all text-center flex items-center justify-center gap-2">
                <span>Beranda Pusmendik</span>
                <span class="material-symbols-outlined text-base">open_in_new</span>
            </a>
        </div>
    </div>

    <!-- 2 Column Breakdown: Mapel Wajib vs Mapel Pilihan -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        <!-- CARD 1: MATA PELAJARAN WAJIB -->
        <div class="bg-white rounded-3xl p-8 border-2 border-sky-100 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div class="absolute top-0 right-0 w-40 h-40 bg-sky-50 rounded-full blur-2xl -z-10"></div>
            <div>
                <div class="flex items-center justify-between mb-4">
                    <span class="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-black text-xs uppercase tracking-wider">Bagian A</span>
                    <span class="text-xs font-semibold text-slate-500">SMA / MA / SMK / MAK</span>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-2">Mata Pelajaran Wajib</h3>
                <p class="text-sm text-slate-600 mb-6 leading-relaxed">
                    Instrumen standar nasional untuk mengukur kompetensi dasar akademik esensial pada 3 mata pelajaran utama yang wajib diikuti seluruh peserta:
                </p>

                <div class="space-y-4">
                    <!-- Mapel 1 -->
                    <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                            <span class="material-symbols-outlined text-xl">menu_book</span>
                        </div>
                        <div class="space-y-1">
                            <h4 class="font-extrabold text-slate-900 text-base">1. Bahasa Indonesia</h4>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Literasi membaca teks informasi dan teks fiksi, pemahaman ide pokok, penarikan inferensi, evaluasi format teks, serta penguasaan struktur dan kaidah bahasa Indonesia terstandar.
                            </p>
                        </div>
                    </div>

                    <!-- Mapel 2 -->
                    <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                            <span class="material-symbols-outlined text-xl">calculate</span>
                        </div>
                        <div class="space-y-1">
                            <h4 class="font-extrabold text-slate-900 text-base">2. Matematika</h4>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Penalaran kuantitatif, aljabar, geometri dan pengukuran, trigonometri, statistika dan peluang, serta pemodelan matematika untuk pemecahan masalah nyata.
                            </p>
                        </div>
                    </div>

                    <!-- Mapel 3 -->
                    <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                            <span class="material-symbols-outlined text-xl">language</span>
                        </div>
                        <div class="space-y-1">
                            <h4 class="font-extrabold text-slate-900 text-base">3. Bahasa Inggris</h4>
                            <p class="text-xs text-slate-600 leading-relaxed">
                                Reading comprehension pada teks ekspositori dan naratif, analisis tujuan komunikatif, penarikan kesimpulan kontekstual, serta pemahaman kosakata akademik (academic vocabulary).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>✔ Standar Soal: Pusmendik</span>
                <span>✔ Tipe: Literasi &amp; Numerasi</span>
            </div>
        </div>

        <!-- CARD 2: MATA PELAJARAN PILIHAN -->
        <div class="bg-white rounded-3xl p-8 border-2 border-amber-100 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div class="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-full blur-2xl -z-10"></div>
            <div>
                <div class="flex items-center justify-between mb-4">
                    <span class="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs uppercase tracking-wider">Bagian B</span>
                    <span class="text-xs font-semibold text-slate-500">Sesuai Jurusan / Prodi Target</span>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-2">Mata Pelajaran Pilihan</h3>
                <p class="text-sm text-slate-600 mb-6 leading-relaxed">
                    Instrumen untuk mengukur kompetensi spesifik murid pada 2 (dua) mata pelajaran pilihan sesuai dengan program studi tujuan di perguruan tinggi atau pilihan karir masa depan:
                </p>

                <div class="space-y-4">
                    <!-- Klaster 1: Saintek -->
                    <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                        <div class="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                            <span class="material-symbols-outlined text-base">science</span>
                            <span>Klaster Sains &amp; Eksakta (Saintek)</span>
                        </div>
                        <div class="flex flex-wrap gap-1.5 text-xs font-semibold text-slate-700">
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">Matematika Tingkat Lanjut</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">Fisika</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">Kimia</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">Biologi</span>
                        </div>
                    </div>

                    <!-- Klaster 2: Soshum -->
                    <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                        <div class="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                            <span class="material-symbols-outlined text-base">account_balance</span>
                            <span>Klaster Sosial Humaniora (Soshum)</span>
                        </div>
                        <div class="flex flex-wrap gap-1.5 text-xs font-semibold text-slate-700">
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">Ekonomi</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">Geografi</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">Sosiologi</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">Sejarah</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">Antropologi</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">Pendidikan Pancasila (PPKn)</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">B. Indonesia Lanjut</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">B. Inggris Lanjut</span>
                        </div>
                    </div>

                    <!-- Klaster 3: Bahasa Asing & Kejuruan SMK -->
                    <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                        <div class="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                            <span class="material-symbols-outlined text-base">translate</span>
                            <span>Bahasa Asing &amp; Kejuruan SMK/MAK</span>
                        </div>
                        <div class="flex flex-wrap gap-1.5 text-xs font-semibold text-slate-700">
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">B. Prancis</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">B. Jerman</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">B. Jepang</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">B. Mandarin</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">B. Korea</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">B. Arab</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">SMK - Produk Kreatif</span>
                            <span class="px-2.5 py-1 rounded-lg bg-white border border-amber-200">SMK - Teknik &amp; Bangunan</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>✔ Penentu Bobot Prodi PTN</span>
                <span>✔ 2 Mapel Pilihan</span>
            </div>
        </div>

    </div>

    <!-- JENJANG SMP & SD INFORMATION -->
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black shrink-0">
                <span class="material-symbols-outlined">auto_stories</span>
            </div>
            <div class="space-y-1">
                <h4 class="font-extrabold text-slate-900 text-sm">TKA Jenjang SMP / MTs / Sederajat</h4>
                <p class="text-xs text-slate-600 leading-relaxed">
                    Kerangka asesmen terstandar untuk pemetaan penguasaan literasi membaca, penalaran matematika, dan sains dasar sebagai persiapan masuk SMA/SMK favorit.
                </p>
            </div>
        </div>

        <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black shrink-0">
                <span class="material-symbols-outlined">child_care</span>
            </div>
            <div class="space-y-1">
                <h4 class="font-extrabold text-slate-900 text-sm">TKA Jenjang SD / MI / Sederajat</h4>
                <p class="text-xs text-slate-600 leading-relaxed">
                    Pengukuran fondasi numerasi dan literasi dasar anak usia sekolah dasar untuk evaluasi objektif dan persiapan jenjang menengah pertama.
                </p>
            </div>
        </div>
    </div>
</section>
'''

    # Insert kerangka section right before Programs Bento Grid
    html = re.sub(
        r'<!-- Programs Bento Grid -->',
        kerangka_section + '\n<!-- Programs Bento Grid -->',
        html,
        count=1
    )

    with open(tka_path, "w", encoding="utf-8") as f:
        f.write(html)
    
    with open(bimbel_tka_path, "w", encoding="utf-8") as f:
        f.write(html)

    print("SUCCESS: Updated tka/index.html and bimbel-tka/index.html with Pusmendik Kemendikdasmen standards!")

if __name__ == "__main__":
    update_tka_page()
