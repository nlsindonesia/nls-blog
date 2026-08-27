# 1. Update blog/default-articles.js
$articlesJsPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\blog\default-articles.js"
$articlesContent = @'
/**
 * Master Dataset Berita & Artikel CMS Next Level Study (NLS)
 * Digunakan sebagai baseline data dan sinkronisasi antara /nlsadmin dan /blog.
 */
window.NLS_DEFAULT_ARTICLES = [
    {
        id: 'art-1',
        title: 'Panduan Lengkap Persiapan SNBT 2027: Strategi Lolos PTN Impian dengan Sistem IRT',
        slug: 'panduan-lengkap-persiapan-snbt-2027',
        category: 'SNBT & UTBK',
        categories: ['SNBT & UTBK', 'Tips Belajar & Prestasi'],
        date: '2026-08-20',
        author: 'Tim Akademik NLS',
        status: 'published',
        coverImage: '/images/blog/cover-snbt-2027.jpg',
        focusKeyword: 'persiapan snbt 2027',
        metaTitle: 'Panduan Lengkap Persiapan SNBT 2027 & Strategi Sistem IRT | NLS',
        metaDescription: 'Pelajari strategi jitu menghadapi SNBT 2027 dengan sistem penilaian IRT, pemetaan subtes TPS, dan jadwal tryout intensif bersama Next Level Study.',
        canonicalUrl: 'https://next-level-study.com/blog/snbt-2027',
        content: `<h2>Mengapa Persiapan SNBT Harus Dimulai Lebih Awal?</h2>
<p>Seleksi Nasional Berbasis Tes (SNBT) merupakan gerbang utama bagi ratusan ribu pejuang PTN di seluruh Indonesia. Dengan sistem penilaian <em>Item Response Theory (IRT)</em>, bobot setiap butir soal ditentukan oleh tingkat kesulitan relatif dan akurasi jawaban seluruh peserta nasional.</p>

<h3>1. Pahami Komposisi Subtes UTBK SNBT</h3>
<ul>
  <li><strong>Tes Potensi Skolastik (TPS):</strong> Penalaran Umum, Pengetahuan Kuantitatif, Pemahaman Bacaan & Menulis, serta Pengetahuan & Pemahaman Umum.</li>
  <li><strong>Literasi dalam Bahasa Indonesia & Bahasa Inggris:</strong> Membaca kritis teks ilmiah, analitis, dan argumentatif.</li>
  <li><strong>Penalaran Matematika:</strong> Pemodelan matematika dalam konteks kehidupan nyata dan pemecahan masalah.</li>
</ul>

<h3>2. Strategi Latihan Try Out Berkelanjutan</h3>
<p>Latihan try out berkala di platform CBT NLS membiasakan Anda dengan interface resmi ujian, manajemen waktu yang ketat, serta analisis skor IRT secara presisi.</p>

<blockquote>"Konsistensi dalam mengevaluasi kelemahan soal jauh lebih berharga daripada mengerjakan ribuan soal tanpa refleksi konsep."</blockquote>`,
        seoScore: 92
    },
    {
        id: 'art-2',
        title: 'Bedah Silabus & Pola Soal Olimpiade Sains Nasional (OSN) 2026 Jenjang SMA',
        slug: 'bedah-silabus-osn-2026-sma',
        category: 'OSN & Sains',
        categories: ['OSN & Sains', 'TKA & Akademik'],
        date: '2026-08-15',
        author: 'Kak Radit (Medalis OSN)',
        status: 'published',
        coverImage: '/images/blog/cover-osn-silabus.jpg',
        focusKeyword: 'silabus osn 2026',
        metaTitle: 'Bedah Silabus & Pola Soal OSN 2026 Jenjang SMA | Next Level Study',
        metaDescription: 'Panduan lengkap silabus OSN 2026 bidang Matematika, Fisika, Kimia, Biologi, Informatika, Astronomi, Kebumian, dan Ekonomi bersama mentor medalis NLS.',
        canonicalUrl: 'https://next-level-study.com/blog/osn-2026',
        content: `<h2>Tantangan dan Peluang Meraih Medali OSN 2026</h2>
<p>Olimpiade Sains Nasional (OSN) yang diselenggarakan oleh Balai Pengembangan Talenta Indonesia (BPTI) Kemendikbudristek menuntut pemahaman konsep yang mendalam dan kemampuan problem solving tingkat tinggi.</p>

<h3>Kunci Sukses Pembinaan OSN</h3>
<p>Berikut adalah 3 pilar penting dalam pembinaan OSN bersama Next Level Study:</p>
<ol>
  <li><strong>Mastery of Fundamentals:</strong> Menguasai pondasi teori tingkat lanjut sebelum menyentuh bank soal olimpiade.</li>
  <li><strong>Problem-Solving Heuristics:</strong> Melatih pola pikir heuristik untuk membedah soal-soal non-rutin.</li>
  <li><strong>Mentorship Langsung Medalis:</strong> Pendampingan intensif oleh tutor yang pernah menjuarai olimpiade tingkat nasional maupun internasional.</li>
</ol>`,
        seoScore: 88
    },
    {
        id: 'art-3',
        title: 'Tips Memilih Jurusan Kuliah Sesuai Minat, Bakat, dan Prospek Karier Masa Depan',
        slug: 'tips-memilih-jurusan-kuliah-masa-depan',
        category: 'Tips Belajar & Prestasi',
        categories: ['Tips Belajar & Prestasi', 'Panduan Beasiswa'],
        date: '2026-08-10',
        author: 'Kak Bima (Statistika UGM)',
        status: 'published',
        coverImage: '/images/blog/cover-jurusan-kuliah.jpg',
        focusKeyword: 'tips memilih jurusan kuliah',
        metaTitle: 'Tips Memilih Jurusan Kuliah & Prospek Karier Masa Depan | NLS',
        metaDescription: 'Cara bijak menentukan jurusan kuliah yang tepat di PTN favorit sesuai passion, potensi akademik, dan tren peluang industri global.',
        canonicalUrl: 'https://next-level-study.com/blog/memilih-jurusan',
        content: `<h2>Jangan Sampai Salah Pilih Jurusan!</h2>
<p>Memilih program studi di perguruan tinggi adalah keputusan strategis yang akan membentuk jalur karier dan pengembangan diri Anda di masa depan.</p>
<p>Gunakan formula 3A: <em>Aptitude (Kemampuan), Affinity (Ketertarikan/Minat), dan Application (Peluang Penerapan di Dunia Kerja)</em> saat menyusun pilihan jurusan di SNBP maupun SNBT.</p>`,
        seoScore: 90
    }
];
'@
[System.IO.File]::WriteAllText($articlesJsPath, $articlesContent, [System.Text.Encoding]::UTF8)

# 2. Update nlsadmin/index.html article initialization to migrate /nls-logo-300.png covers to the real blog covers
$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$adminContent = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

$oldAdminInitArticles = @'
                articles: (function() {
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_ARTICLES !== "undefined") ? window.NLS_DEFAULT_ARTICLES : [];
                })(),
'@

$newAdminInitArticles = @'
                articles: (function() {
                    const defaultCovers = {
                        'art-1': '/images/blog/cover-snbt-2027.jpg',
                        'art-2': '/images/blog/cover-osn-silabus.jpg',
                        'art-3': '/images/blog/cover-jurusan-kuliah.jpg'
                    };
                    try {
                        const stored = localStorage.getItem("nls_berita_articles_v1");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                parsed.forEach(a => {
                                    if (defaultCovers[a.id] && (!a.coverImage || a.coverImage.includes('nls-logo-300.png') || a.coverImage.includes('article-placeholder'))) {
                                        a.coverImage = defaultCovers[a.id];
                                    }
                                });
                                return parsed;
                            }
                        }
                    } catch (e) {}
                    return (typeof window.NLS_DEFAULT_ARTICLES !== "undefined") ? window.NLS_DEFAULT_ARTICLES : [];
                })(),
'@

$adminContent = $adminContent.Replace($oldAdminInitArticles, $newAdminInitArticles)

# Also update article cover image fallback & styling in present news table
$oldThumb = '<img :src="art.coverImage || ''/nls-logo-300.png''" alt="Cover" class="w-14 h-14 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">'
$newThumb = '<img :src="art.coverImage || ''/images/blog/cover-snbt-2027.jpg''" alt="Cover" class="w-16 h-16 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border-2 border-slate-200 dark:border-slate-700 shadow-sm">'
$adminContent = $adminContent.Replace($oldThumb, $newThumb)

[System.IO.File]::WriteAllText($adminPath, $adminContent, [System.Text.Encoding]::UTF8)

Write-Host "SUCCESS: Replaced article cover images with high-resolution contextual blog covers!"
