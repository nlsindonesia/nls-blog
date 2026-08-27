const fs = require('fs');
const path = require('path');

const osnArticles = [
  {
    id: 'art-osn-matematika',
    title: 'Tips Belajar OSN Matematika SMA: Strategi Penguasaan 4 Pilar & Problem Solving Heuristik',
    slug: 'tips-belajar-osn-matematika-sma',
    category: 'OSN & Sains',
    categories: ['OSN & Sains', 'Tips Belajar & Prestasi'],
    date: '2026-08-25',
    author: 'Kak Radit (Medalis OSN Matematika)',
    status: 'published',
    coverImage: '/images/blog/cover-osn-matematika.jpg',
    focusKeyword: 'tips belajar osn matematika sma',
    metaTitle: 'Tips Belajar OSN Matematika SMA: Strategi Juara 4 Pilar | NLS',
    metaDescription: 'Panduan lengkap tips belajar OSN Matematika SMA: bedah 4 pilar aljabar, geometri, teori bilangan, kombinatorika, dan metode problem solving medalis NLS.',
    canonicalUrl: 'https://next-level-study.com/blog/tips-belajar-osn-matematika-sma',
    content: `<h2>Mengapa OSN Matematika Membutuhkan Pola Pikir Pembuktian Logis?</h2>
<p>Olimpiade Sains Nasional (OSN) Matematika jenjang SMA bukanlah sekadar tes kecepatan berhitung, melainkan uji ketajaman logika berpikir deduktif dan seni pembuktian matematis yang elegan. Berbeda dengan soal ujian sekolah standar yang bersifat algoritmik, soal olimpiade dirancang non-rutin, menantang peserta untuk menemukan jalan keluar kreatif dari permasalahan abstrak.</p>

<h3>1. Menguasai 4 Pilar Utama Materi OSN Matematika</h3>
<p>Silabus resmi Balai Pengembangan Talenta Indonesia (BPTI) membagi materi olimpiade matematika ke dalam empat cabang fundamental yang saling beririsan:</p>
<ul>
  <li><strong>Aljabar:</strong> Polinomial lanjutan, sistem persamaan tak linear, teori fungsi, serta pertidaksamaan klasik seperti Cauchy-Schwarz, AM-GM, dan Jensen.</li>
  <li><strong>Geometri:</strong> Sifat lingkaran, kesebangunan & kongruensi segitiga, titik istimewa segitiga (Orthocenter, Incenter, Circumcenter), teorema Ceva, Menelaus, Ptolemy, hingga Power of a Point.</li>
  <li><strong>Teori Bilangan:</strong> Modulo aritmatika, keterbagian, teorema sisa Tiongkok (CRT), Teorema Kecil Fermat, Teorema Wilson, dan persamaan Diophantine.</li>
  <li><strong>Kombinatorika:</strong> Prinsip Sarang Burung (Pigeonhole Principle), Prinsip Inklusi-Eksklusi, Double Counting, Teori Graf dasar, dan relasi rekurensi.</li>
</ul>

<h3>2. Menerapkan Metode Heuristik Polya dalam Memecahkan Soal</h3>
<p>Ketika berhadapan dengan soal sulit berbobot kompetisi, jangan langsung terburu-buru menulis rumus. Terapkan empat langkah heuristik George Polya: (1) Pahami kondisi dan batasan masalah secara mendalam, (2) Rancang rencana pembuktian (misal: induksi matematika, kontradiksi, atau konstruksi aljabar), (3) Jalankan rencana dengan ketelitian logika tingkat tinggi, dan (4) Tinjau kembali (Look Back) untuk memverifikasi apakah ada celah dalam argumen Anda.</p>

<h3>3. Rekomendasi Buku Rujukan & Sumber Latihan Teruji</h3>
<p>Gunakan buku standar olimpiade internasional seperti <em>Problem-Solving Strategies</em> karya Arthur Engel, <em>Euclidean Geometry in Mathematical Olympiads (EGMO)</em> karya Evan Chen, dan modul pembinaan resmi pelatnas NLS. Analisis juga arsip soal OSN-K, OSN-P, OSN Nasional, hingga soal seleksi IMO (International Mathematical Olympiad).</p>

<h3>4. Manajemen Jadwal Belajar dan Siklus Evaluasi Mandiri</h3>
<p>Disiplin adalah pembeda utama antara peserta biasa dan peraih medali. Alokasikan waktu minimal 2–3 jam setiap hari secara konsisten. Fokuslah pada kedalaman pemahaman daripada kuantitas soal semata. Mengerjakan 3 soal pembuktian yang rumit dan merefleksikan solusinya jauh lebih efektif dibanding menjawab 30 soal pilihan ganda sederhana.</p>

<h3>5. Membangun Daya Tahan Mental dan Resiliensi Kompetisi</h3>
<p>Waktu pengerjaan OSN tingkat provinsi dan nasional sangat panjang (biasanya 4 jam untuk 4–5 soal uraian). Daya tahan konsentrasi, ketenangan saat menemukan jalan buntu, dan manajemen waktu per soal harus dilatih melalui simulasi ujian berkala di platform CBT Next Level Study.</p>

<blockquote>"Dalam olimpiade matematika, keindahan solusi tidak terletak pada seberapa cepat Anda menemukan jawaban, melainkan seberapa kokoh dan elegan logika yang menopang argumen Anda."</blockquote>`,
    seoScore: 96
  },
  {
    id: 'art-osn-fisika',
    title: 'Tips Belajar OSN Fisika SMA: Metode Pemodelan Matematis, Analisis Kalkulus & Bedah Soal IPhO',
    slug: 'tips-belajar-osn-fisika-sma',
    category: 'OSN & Sains',
    categories: ['OSN & Sains', 'Tips Belajar & Prestasi'],
    date: '2026-08-24',
    author: 'Kak Alvin (Medalis OSN Fisika)',
    status: 'published',
    coverImage: '/images/blog/cover-osn-fisika.jpg',
    focusKeyword: 'tips belajar osn fisika sma',
    metaTitle: 'Tips Belajar OSN Fisika SMA: Pemodelan & Kalkulus Medalis | NLS',
    metaDescription: 'Pelajari tips belajar OSN Fisika SMA dari pemodelan diagram benda bebas, kalkulus diferensial-integral, termodinamika hingga strategi bedah soal IPhO.',
    canonicalUrl: 'https://next-level-study.com/blog/tips-belajar-osn-fisika-sma',
    content: `<h2>Transformasi Pemahaman Fisika: Dari Hafalan Rumus Menuju Hukum Fundamental</h2>
<p>Banyak siswa menganggap fisika sebagai kumpulan rumus rumit yang harus dihafal. Namun, dalam ajang bergengsi OSN Fisika SMA, pendekatan hafalan dipastikan gagal total. Fisika olimpiade menuntut kemampuan menerjemahkan fenomena fisis nyata ke dalam bahasa matematika melalui pemodelan hukum-hukum alam fundamental.</p>

<h3>1. Integrasi Kalkulus Diferensial dan Integral Tingkat Lanjut</h3>
<p>Kalkulus adalah bahasa alami fisika. Peserta OSN Fisika wajib fasih menggunakan turunan parsial, integral lipat, persamaan diferensial sederhana, dan ekspansi deret Taylor. Konsep seperti kecepatan sebagai turunan posisi, gaya sebagai gradien potensial, dan hukum Gauss dalam medan listrik tidak dapat dipahami utuh tanpa kalkulus.</p>

<h3>2. Kuasai Domain Materi Utama Silabus OSN Fisika</h3>
<ul>
  <li><strong>Mekanika Klasik:</strong> Kinematika analitik, dinamika rotasi benda tegar, momen inersia variabel, osilasi harmonik teredam, pusat massa, dan hukum gravitasi orbit elips Kepler.</li>
  <li><strong>Elektrodinamika & Magnetisme:</strong> Hukum Coulomb, Hukum Gauss, potensial elektrostatik, rangkaian RLC transien, hukum Biot-Savart, gaya Lorentz, dan induksi Faraday-Lenz.</li>
  <li><strong>Termodinamika & Fisika Statistik:</strong> Teori kinetik gas ideal, hukum I & II termodinamika, siklus mesin kalor Carnot & Otto, perubahan entropi, dan kapasitas kalor molar.</li>
  <li><strong>Gelombang, Optik & Fisika Modern:</strong> Interferensi celah ganda, difraksi kisi, polarisasi, efek Doppler relativistik, dualisme gelombang-partikel, dan model atom kuantum Bohr.</li>
</ul>

<h3>3. Teknik Visualisasi Melalui Free Body Diagram (FBD) Presisi</h3>
<p>Kunci keberhasilan memecahkan soal mekanika adalah keakuratan membuat Free Body Diagram (FBD). Gambarkan semua vektor gaya yang bekerja pada tiap komponen sistem secara terpisah, pilih sistem koordinat kartesius atau polar yang menyederhanakan perhitungan, lalu terapkan hukum II Newton atau prinsip kekekalan energi mekanik.</p>

<h3>4. Buku Panduan Wajib Rekomendasi Mentor Medalis</h3>
<p>Mulailah dari literatur standar universitas seperti <em>Physics for Scientists and Engineers</em> oleh Serway-Jewett atau Halliday-Resnick. Untuk latihan soal tantangan tingkat tinggi, pelajari buku legendaris <em>200 Puzzling Physics Problems</em> (Gnädig) dan bank soal IPhO/APhO terbitan TOFI.</p>

<h3>5. Memaksimalkan Nilai pada Ujian Praktikum Eksperimen</h3>
<p>Pada tingkat nasional, 30–40% total nilai berasal dari tes praktikum. Latihlah keterampilan merangkai alat laboratorium, membaca jangka sorong & mikroskop, mengoperasikan osiloskop digital, serta menyusun tabel data dengan analisis regresi linier dan perambatan ketidakpastian (uncertainty analysis).</p>

<blockquote>"Fisika bukanlah sekadar angka dan persamaan, melainkan seni melihat pola harmoni alam semesta melalui kacamata matematika presisi."</blockquote>`,
    seoScore: 95
  },
  {
    id: 'art-osn-kimia',
    title: 'Tips Belajar OSN Kimia SMA: Kuasai Mekanisme Reaksi Organik, Termodinamika & Spektroskopi',
    slug: 'tips-belajar-osn-kimia-sma',
    category: 'OSN & Sains',
    categories: ['OSN & Sains', 'Tips Belajar & Prestasi'],
    date: '2026-08-23',
    author: 'Kak Nadia (Tutor Spesialis OSN Kimia)',
    status: 'published',
    coverImage: '/images/blog/cover-osn-kimia.jpg',
    focusKeyword: 'tips belajar osn kimia sma',
    metaTitle: 'Tips Belajar OSN Kimia SMA: Reaksi Organik & Termodinamika | NLS',
    metaDescription: 'Panduan tips belajar OSN Kimia SMA: strategi mendalam kimia fisik, reaksi organik, stoikiometri analitik, dan analisis spektroskopi NMR bersama NLS.',
    canonicalUrl: 'https://next-level-study.com/blog/tips-belajar-osn-kimia-sma',
    content: `<h2>Kunci Menguasai Kimia Kompetisi: Keseimbangan Antara Teori dan Logika Reaksi</h2>
<p>Olimpiade Sains Nasional Kimia SMA terkenal dengan cakupan materinya yang sangat luas, menjangkau level perkuliahan kimia tingkat dua dan tiga. Untuk meraih medali juara, siswa harus mampu menggabungkan kalkulasi kuantitatif yang presisi pada kimia fisik dengan penalaran kualitatif pada mekanisme reaksi organik dan struktur anorganik.</p>

<h3>1. Fondasi Kimia Fisik: Termodinamika & Kinetika Reaksi</h3>
<p>Kimia fisik menjadi tulang punggung dari 40% soal olimpiade. Pelajari secara mendalam konsep Entalpi ($\Delta H$), Entropi ($\Delta S$), dan Energi Bebas Gibbs ($\Delta G$). Pahami hubungan kesetimbangan kimia dengan konstanta Van 't Hoff, elektrokimia persamaan Nernst, serta hukum laju reaksi terintegrasi orde 0, 1, dan 2.</p>

<h3>2. Memahami Logika Mekanisme Reaksi Kimia Organik</h3>
<p>Alih-alih menghafal ratusan reaksi organik, pahamilah perpindahan elektron melalui notasi panah lengkung (curved arrow mechanism). Kuasai konsep nukleofil-elektrofil, efek induksi, resonansi, sterik, serta mekanisme reaksi penting seperti substitusi nukleofilik ($S_N1, S_N2$), eliminasi ($E1, E2$), adisi elektrofilik alkena, hingga reaksi kondensasi karbonil (Aldol, Claisen).</p>

<h3>3. Analisis Spektroskopi Molekuler Modern</h3>
<p>Soal OSN tingkat provinsi dan nasional rutin menghadirkan soal penentuan struktur molekul tak dikenal melalui kombinasi data spektrum: $^1H$-NMR, $^{13}C$-NMR, Spektroskopi Inframerah (FT-IR), Spektrometri Massa (MS), dan Spektroskopi UV-Vis. Latihlah kepekaan membaca chemical shift, splitting pattern, dan indeks defisiensi hidrogen (IDH).</p>

<h3>4. Kimia Anorganik & Kompleks Logam Transisi</h3>
<p>Kuasai konfigurasi elektron ion transisi, geometri molekul VSEPR, teori ikatan valensi, serta Teori Medan Kristal (Crystal Field Theory). Pahami pembagian orbital d ($t_{2g}$ dan $e_g$), faktor penentu high-spin/low-spin, efek Jahn-Teller, dan deret spektrokimia ligan.</p>

<h3>5. Referensi Belajar Standar Internasional</h3>
<p>Buku rujukan utama yang wajib dipelajari meliputi <em>Chemistry</em> karya Zumdahl atau Raymond Chang untuk kimia umum, <em>Physical Chemistry</em> karya Peter Atkins, dan <em>Organic Chemistry</em> karya Paula Yurkanis Bruice atau Jonathan Clayden. Bedah soal-soal IChO (International Chemistry Olympiad) untuk melatih daya nalar tingkat tinggi.</p>

<blockquote>"Di balik setiap tabung reaksi dan perubahan warna larutan, tersimpan hukum-hukum termodinamika dan pergerakan elektron yang menanti untuk dipecahkan secara matematis."</blockquote>`,
    seoScore: 94
  },
  {
    id: 'art-osn-biologi',
    title: 'Tips Belajar OSN Biologi SMA: Pemahaman Konseptual Terpadu Campbell & Analisis Data Eksperimen IBO',
    slug: 'tips-belajar-osn-biologi-sma',
    category: 'OSN & Sains',
    categories: ['OSN & Sains', 'Tips Belajar & Prestasi'],
    date: '2026-08-22',
    author: 'Kak Zahra (Medalis OSN Biologi)',
    status: 'published',
    coverImage: '/images/blog/cover-osn-biologi.jpg',
    focusKeyword: 'tips belajar osn biologi sma',
    metaTitle: 'Tips Belajar OSN Biologi SMA: Analisis Konsep & Data IBO | NLS',
    metaDescription: 'Tips belajar OSN Biologi SMA terstruktur: kuasai biologi sel, genetika molekuler, fisiologi komparatif, dan analisis data eksperimen sains IBO.',
    canonicalUrl: 'https://next-level-study.com/blog/tips-belajar-osn-biologi-sma',
    content: `<h2>Membongkar Mitos: OSN Biologi Bukan Sekadar Hafalan Istilah Latin</h2>
<p>Banyak calon peserta olimpiade gugur di tahap awal karena mengira belajar biologi hanya sebatas menghafal nama ilmiah dan deskripsi morfologi. Pada kenyataannya, OSN Biologi jenjang SMA berfokus penuh pada pemikiran analitis berbasis data eksperimental, pemahaman mekanisme molekuler kaskade seluler, dan deduksi logis diagram genetik.</p>

<h3>1. Menuntaskan 'Kitab Suci' Campbell Biology</h3>
<p>Buku <em>Campbell Biology</em> (edisi 11 atau 12) adalah fondasi mutlak yang harus dikuasai bab per bab. Jangan hanya membaca teks, perhatikan secara cermat setiap diagram jalur sinyal sel, skema siklus biokimia, grafik respon fisiologis, serta penjelasan eksperimen ilmiah yang ada di setiap akhir subbab.</p>

<h3>2. Pemetaan 7 Cabang Materi Silabus OSN Biologi</h3>
<ul>
  <li><strong>Biologi Sel & Molekuler (20%):</strong> Struktur membran, transport vesikel, respirasi seluler, fotosintesis C3/C4/CAM, replikasi DNA, ekspresi gen operon, CRISPR, dan PCR.</li>
  <li><strong>Anatomi & Fisiologi Tumbuhan (15%):</strong> Jaringan xilem-floem, mekanisme stomata, fitohormon (auksin, giberelin, asam absisat), dan fotoperiodisme.</li>
  <li><strong>Anatomi & Fisiologi Hewan/Manusia (25%):</strong> Sistem saraf & potensial aksi, endokrinologi, sistem sirkulasi, ekskresi nefron ginjal, serta imunologi sel T dan antibodi.</li>
  <li><strong>Genetika & Evolusi (20%):</strong> Persilangan Mendel, linkage & rekombinasi, peta genetik kuantitatif, genetika populasi Hardy-Weinberg, dan kladogram filogeni.</li>
  <li><strong>Ekologi & Etologi (15%):</strong> Aliran energi trofik, siklus biogeokimia, dinamika populasi r/K-seleksi, dan perilaku hewan bawaan versus belajar.</li>
  <li><strong>Biosistematika (5%):</strong> Taksonomi kladistik domain Archaea, Bakteri, Protista, Fungi, Plantae, dan Animalia.</li>
</ul>

<h3>3. Strategi Analisis Soal True/False Format IBO</h3>
<p>Format soal OSN Biologi terkini mengadopsi standar International Biology Olympiad (IBO), di mana 1 narasi eksperimen disertai grafik kompleks memuat 4 pernyataan (A, B, C, D) yang harus dinilai Benar atau Salah secara independen. Latihlah kebiasaan membaca label sumbu grafik, memahami kontrol positif/negatif, dan menghindari asumsi di luar data yang disajikan.</p>

<h3>4. Penguasaan Keterampilan Praktikum Laboratorium</h3>
<p>Bagi peserta yang lolos ke tingkat nasional, tes praktikum mencakup 4 laboratorium: Biologi Sel Molekuler (elektroforesis gel), Anatomi Fisiologi Tumbuhan (sayatan preparat melintang), Anatomi Hewan (diseksi invertebrata/vertebrata), serta Biosistematika & Ekologi.</p>

<blockquote>"Biologi adalah studi tentang keajaiban kehidupan yang bekerja secara presisi di level molekuler hingga keseimbangan biosfer global."</blockquote>`,
    seoScore: 95
  },
  {
    id: 'art-osn-informatika',
    title: 'Tips Belajar OSN Informatika SMA: Competitive Programming C++, Optimasi Algoritma & Dynamic Programming',
    slug: 'tips-belajar-osn-informatika-sma',
    category: 'OSN & Sains',
    categories: ['OSN & Sains', 'Tips Belajar & Prestasi'],
    date: '2026-08-21',
    author: 'Kak Kevin (Medalis OSN Informatika)',
    status: 'published',
    coverImage: '/images/blog/cover-osn-informatika.jpg',
    focusKeyword: 'tips belajar osn informatika sma',
    metaTitle: 'Tips Belajar OSN Informatika SMA: Algoritma C++ & DP | NLS',
    metaDescription: 'Kupas tuntas tips belajar OSN Informatika SMA: competitive programming C++, struktur data lanjut, graph theory, dan optimasi waktu O(N log N).',
    canonicalUrl: 'https://next-level-study.com/blog/tips-belajar-osn-informatika-sma',
    content: `<h2>Mengapa OSN Informatika Adalah Ajang Competitive Programming Terbaik?</h2>
<p>OSN Informatika (Komputer) merupakan salah satu bidang paling dinamis dan menantang di era digital. Kompetisi ini menguji kemampuan logika komputasi murni, perancangan algoritma efisien, dan penerjemahan ide pemecahan masalah ke dalam kode program C++ yang mampu mengeksekusi jutaan data dalam batas waktu kurang dari satu detik (Time Limit 1.0s).</p>

<h3>1. Kuasai Bahasa Pemrograman C++ dan STL (Standard Template Library)</h3>
<p>Bahasa C++ adalah standar mutlak dalam ajang OSN dan International Olympiad in Informatics (IOI). Kuasai penggunaan struktur data bawaan STL seperti <code>std::vector</code>, <code>std::set</code>, <code>std::map</code>, <code>std::priority_queue</code>, dan algoritma bawaan seperti <code>std::sort</code>, <code>std::lower_bound</code>, serta manipulasi bitwise.</p>

<h3>2. Pemahaman Analisis Kompleksitas Waktu dan Memori (Big-O Notation)</h3>
<p>Sebelum menulis sebaris kode pun, hitunglah batasan input $N$. Jika $N \le 10^5$, algoritma $O(N^2)$ dipastikan akan mendapatkan Time Limit Exceeded (TLE). Anda wajib merancang solusi efisien berorde $O(N \log N)$ atau $O(N)$ menggunakan teknik struktur data lanjutan.</p>

<h3>3. Kuasai Paradigma Algoritma Fundamental</h3>
<ul>
  <li><strong>Brute Force & Complete Search:</strong> Rekursi, backtracking, dan pemangkasan cabang (pruning).</li>
  <li><strong>Greedy Algorithms:</strong> Pemilihan langkah optimal lokal yang menghasilkan optimal global (contoh: Activity Selection, Fractional Knapsack).</li>
  <li><strong>Divide and Conquer:</strong> Binary Search on Answer, Merge Sort, dan Exponentiation by Squaring.</li>
  <li><strong>Dynamic Programming (DP):</strong> Knapsack 0/1, Longest Increasing Subsequence (LIS), DP on Trees, DP Bitmask, dan Digit DP.</li>
  <li><strong>Graph Theory:</strong> Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Shortest Path, Minimum Spanning Tree (Kruskal/Prim), dan Disjoint Set Union (DSU).</li>
</ul>

<h3>4. Roadmap Latihan Rutin di Platform Online Judge</h3>
<p>Bergabunglah dan selesaikan tantangan secara rutin di platform <em>TLX Toki (TOKI Learning Center)</em>, <em>Codeforces</em>, <em>AtCoder</em>, dan <em>CSES Problem Set</em>. Mulailah dari menyelesaikan seluruh bab kursus pemrograman dasar dan kompetitif TLX sebelum mengikuti kontes rutin divisi 2 atau 3 di Codeforces.</p>

<h3>5. Manajemen Waktu 5 Jam Kontes Pemrograman</h3>
<p>Ujian OSN Informatika tingkat nasional berlangsung selama 5 jam untuk 3–4 soal bernilai 100 poin tiap soal. Terapkan strategi subtask hunting: amankan poin-poin subtask mudah terlebih dahulu sebelum menghabiskan waktu merancang algoritma full-score.</p>

<blockquote>"Kode program yang hebat bukan diukur dari panjang barisnya, melainkan dari keindahan struktur data dan keanggunan efisiensi kompleksitas algoritmanya."</blockquote>`,
    seoScore: 95
  },
  {
    id: 'art-osn-astronomi',
    title: 'Tips Belajar OSN Astronomi SMA: Visualisasi Trigonometri Bola Langit, Astrofisika & Mekanika Benda Langit',
    slug: 'tips-belajar-osn-astronomi-sma',
    category: 'OSN & Sains',
    categories: ['OSN & Sains', 'Tips Belajar & Prestasi'],
    date: '2026-08-20',
    author: 'Kak Dimas (Medalis OSN Astronomi)',
    status: 'published',
    coverImage: '/images/blog/cover-osn-astronomi.jpg',
    focusKeyword: 'tips belajar osn astronomi sma',
    metaTitle: 'Tips Belajar OSN Astronomi SMA: Bola Langit & Astrofisika | NLS',
    metaDescription: 'Panduan lengkap tips belajar OSN Astronomi SMA: kuasai tata koordinat bola langit, hukum Kepler, fotometri bintang, dan pengolahan data teleskop.',
    canonicalUrl: 'https://next-level-study.com/blog/tips-belajar-osn-astronomi-sma',
    content: `<h2>Mengapa Astronomi Menjadi Kombinasi Sempurna Fisika dan Matematika Ruang Angkasa?</h2>
<p>Olimpiade Sains Nasional Astronomi SMA adalah salah satu cabang ilmu paling memikat. Di bidang ini, siswa ditantang menelaah misteri alam semesta melalui perpaduan harmonis antara mekanika fisika klasik, termodinamika radiasi, geometri bola langit 3 dimensi, dan analisis data pengamatan teleskop.</p>

<h3>1. Menguasai Sistem Tata Koordinat Bola Langit</h3>
<p>Fondasi terpenting astronomi posisi adalah visualisasi tata koordinat bola langit. Kuasai tiga sistem koordinat utama:</p>
<ul>
  <li><strong>Sistem Koordinat Horizon:</strong> Azimuth ($A$) dan Ketinggian ($h$) yang bergantung pada posisi geografis pengamat dan waktu lokal.</li>
  <li><strong>Sistem Koordinat Ekuatorial:</strong> Asensio Rekta ($\alpha$) dan Deklinasi ($\delta$) yang terikat pada ekuator langit dan titik Aries ($\gamma$).</li>
  <li><strong>Sistem Koordinat Ekliptika:</strong> Garis edar tahunan Matahari dan bidang orbit planet-planet tata surya.</li>
</ul>

<h3>2. Aplikasi Trigonometri Bola (Spherical Trigonometry)</h3>
<p>Perhitungan segitiga bola navigasi astronomi membutuhkan rumus sinus dan cosinus bola: $\cos a = \cos b \cos c + \sin b \sin c \cos A$. Kuasai transformasi koordinat untuk menghitung waktu terbit/terbenam benda langit, sudut jam ($HA$), serta posisi Matahari pada waktu solstis dan ekuinoks.</p>

<h3>3. Mekanika Benda Langit & Astrofisika Bintang</h3>
<p>Pelajari secara komprehensif hukum-hukum gravitasi Newton, hukum I, II, III Kepler untuk orbit elips, kecepatan lepas, serta energi potensial gravitasi orbit. Pada cabang astrofisika, kuasai hukum radiasi benda hitam Planck, hukum pergeseran Wien, hukum Stefan-Boltzmann, magnitudo semu/mutlak, fotometri bintang, dan interpretasi Diagram Hertzsprung-Russell (HR-Diagram).</p>

<h3>4. Rekomendasi Buku Rujukan Utama</h3>
<p>Pelajari buku teks universitas seperti <em>Fundamental Astronomy</em> (Karttunen et al.), <em>An Introduction to Modern Astrophysics</em> (Carroll & Ostlie), serta modul pelatihan resmi pembinaan tim olimpiade astronomi Indonesia terbitan NLS.</p>

<h3>5. Keterampilan Analisis Data Pengamatan & Ronde Praktikum</h3>
<p>Pada tingkat nasional dan internasional (IOAA), peserta menghadapi ronde pengamatan malam menggunakan teleskop reflektor/refraktor, identifikasi rasi bintang pada peta langit (planetarium), serta ronde analisis data pengamatan menggunakan software astronomi.</p>

<blockquote>"Menatap langit malam bukan hanya tentang menikmati keindahan bintang, tetapi tentang memahami persamaan matematika yang mengatur orbit dan evolusi miliaran galaksi di alam semesta."</blockquote>`,
    seoScore: 94
  },
  {
    id: 'art-osn-kebumian',
    title: 'Tips Belajar OSN Kebumian SMA: Integrasi Geologi, Meteorologi, Oseanografi & Sistem Bumi Global',
    slug: 'tips-belajar-osn-kebumian-sma',
    category: 'OSN & Sains',
    categories: ['OSN & Sains', 'Tips Belajar & Prestasi'],
    date: '2026-08-19',
    author: 'Kak Fajar (Medalis OSN Kebumian)',
    status: 'published',
    coverImage: '/images/blog/cover-osn-kebumian.jpg',
    focusKeyword: 'tips belajar osn kebumian sma',
    metaTitle: 'Tips Belajar OSN Kebumian SMA: Geologi & Sistem Atmosfer | NLS',
    metaDescription: 'Pelajari tips belajar OSN Kebumian SMA: identifikasi mineral batuan, dinamika atmosfer cuaca, oseanografi fisik, dan persiapan praktikum lapangan.',
    canonicalUrl: 'https://next-level-study.com/blog/tips-belajar-osn-kebumian-sma',
    content: `<h2>Memahami Bumi Sebagai Satu Kesatuan Sistem Dinamis Terpadu</h2>
<p>Ilmu Kebumian (Earth Science) adalah studi holistik yang meneliti interaksi kompleks antara Geosfer (litosfer & mantel), Atmosfer, Hidrosfer, dan pengaruh Astronomi Tata Surya terhadap dinamika planet Bumi. Dalam OSN Kebumian SMA, peserta diuji kemampuannya mengintegrasikan hukum fisika dan kimia untuk menjelaskan fenomena alam global.</p>

<h3>1. Geologi: Petrologi, Mineralogi, dan Tektonik Lempeng</h3>
<p>Kuasai pembentukan batuan beku, sedimen, dan metamorf melalui siklus batuan. Pelajari identifikasi sifat fisik mineral (kekerasan skala Mohs, kilap, gores, belahan), struktur geologi (sesar, lipatan, ketidakselarasan), stratigrafi hukum Steno, serta mekanisme pergerakan lempeng konvergen, divergen, dan transform.</p>

<h3>2. Meteorologi: Dinamika Cuaca dan Sirkulasi Atmosfer</h3>
<p>Pahami struktur lapisan atmosfer, radiasi matahari, kelembapan udara (spesifik & relatif), proses pembentukan awan, gaya Coriolis, angin geostrofik, serta fenomena iklim global seperti El Niño, La Niña, Dipole Mode, dan sirkulasi monsun di kepulauan Indonesia.</p>

<h3>3. Oseanografi: Fisika dan Kimia Samudra</h3>
<p>Pelajari profil suhu, salinitas, dan densitas kolom air laut (termoklin, haloklin, piknoklin). Kuasai mekanisme arus laut permukaan akibat angin (Spiral Ekman), sirkulasi termohalin laut dalam (Great Ocean Conveyor Belt), gelombang laut, dan dinamika pasang surut gravitasi Bulan-Matahari.</p>

<h3>4. Astronomi Planetologi & Geofisika</h3>
<p>Pahami struktur internal Bumi melalui rambatan gelombang seismik P dan S, medan magnet geomagnetik, proses diferensiasi planet kebumian (Terrestrial Planets), asteroid, komet, serta dampak tumbukan meteorik terhadap kepunahan massal dalam skala waktu geologi.</p>

<h3>5. Persiapan Ujian Praktikum Identifikasi Lapangan</h3>
<p>Di tahap nasional (dan seleksi IESO), peserta akan menghadapi tes praktikum identifikasi 20+ sampel mineral dan batuan asli, interpretasi peta topografi kontur & peta geologi regional, analisis peta sinoptik cuaca, serta pengukuran lapangan menggunakan kompas geologi Brunton.</p>

<blockquote>"Membaca lapisan batuan dan dinamika samudra adalah cara terbaik mendengarkan kisah sejarah perjalanan planet Bumi selama 4,5 miliar tahun terakhir."</blockquote>`,
    seoScore: 93
  },
  {
    id: 'art-osn-ekonomi',
    title: 'Tips Belajar OSN Ekonomi SMA: Logika Mikro-Makroekonomi, Jurnal Akuntansi & Analisis Isu Fiskal Global',
    slug: 'tips-belajar-osn-ekonomi-sma',
    category: 'OSN & Sains',
    categories: ['OSN & Sains', 'Tips Belajar & Prestasi'],
    date: '2026-08-18',
    author: 'Kak Bima (Statistika & Ekonomi UGM)',
    status: 'published',
    coverImage: '/images/blog/cover-osn-ekonomi.jpg',
    focusKeyword: 'tips belajar osn ekonomi sma',
    metaTitle: 'Tips Belajar OSN Ekonomi SMA: Mikro-Makro & Akuntansi | NLS',
    metaDescription: 'Tips belajar OSN Ekonomi SMA terlengkap: bedah elastisitas pasar, pergeseran kurva makro, siklus jurnal akuntansi, dan studi kasus moneter IEO.',
    canonicalUrl: 'https://next-level-study.com/blog/tips-belajar-osn-ekonomi-sma',
    content: `<h2>Membangun Ketajaman Analisis Ekonomi: Dari Teori Pasar Hingga Kebijakan Publik</h2>
<p>Olimpiade Sains Nasional Bidang Ekonomi jenjang SMA menguji kematangan berpikir kritis dalam memecahkan masalah kelangkaan sumber daya, efisiensi alokasi pasar, stabilitas makroekonomi nasional, serta keterampilan teknis akuntansi keuangan perusahaan.</p>

<h3>1. Mikroekonomi: Teori Perilaku Konsumen, Produsen, dan Struktur Pasar</h3>
<p>Pahami fondasi kurva permintaan-penawaran, elastisitas harga/pendapatan/silang, surplus konsumen dan produsen, teori utilitas kardinal & ordinal (kurva indiferen dan budget line), fungsi produksi hukum kenaikan hasil yang makin berkurang (law of diminishing returns), serta perbandingan struktur pasar persaingan sempurna, monopoli, oligopoli, dan monopolistik.</p>

<h3>2. Makroekonomi: Pertumbuhan, Kebijakan Moneter dan Fiskal</h3>
<p>Kuasai perhitungan Pendapatan Nasional (PDB, PNB, NNI, Pendapatan Disposabel), teori inflasi dan indeks harga konsumen (IHK), pengangguran, fungsi konsumsi Keynes, kurva IS-LM, kebijakan moneter bank sentral (operasi pasar terbuka, suku bunga diskonto, rasio cadangan wajib), serta kebijakan anggaran fiskal pemerintah.</p>

<h3>3. Keterampilan Akuntansi Keuangan (Financial Accounting Mastery)</h3>
<p>Akuntansi menyumbang porsi nilai signifikan dalam OSN Ekonomi. Kuasai siklus akuntansi lengkap perusahaan jasa dan dagang: analisis transaksi debit-kredit, jurnal umum & khusus, buku besar, neraca saldo, jurnal penyesuaian (adjusting entries) untuk beban dibayar di muka & pendapatan diterima di muka, kertas kerja (worksheet), laporan laba rugi, laporan perubahan ekuitas, neraca, dan jurnal penutup.</p>

<h3>4. Ekonomi Internasional & Finansial Global</h3>
<p>Pelajari teori keunggulan mutlak Adam Smith & keunggulan komparatif David Ricardo, perdagangan internasional, tarif & kuota impor, pasar valuta asing (kurs mengambang bebas versus tetap), serta struktur Neraca Pembayaran Internasional (Current Account, Capital Account, Financial Account).</p>

<h3>5. Bedah Studi Kasus & Persiapan Kompetisi Internasional (IEO)</h3>
<p>Tingkat nasional dan International Economics Olympiad (IEO) menguji kemampuan <em>Financial Literacy Simulation</em> dan <em>Business Case Presentation</em>. Latihlah kemampuan membaca data statistik ekonomi terkini, menyusun esai analisis kebijakan moneter, dan mempresentasikannya secara percaya diri dalam bahasa Inggris.</p>

<blockquote>"Ekonomi bukan sekadar ilmu mencari keuntungan moneter, melainkan seni mengambil keputusan rasional terbaik demi kesejahteraan masyarakat secara berkelanjutan."</blockquote>`,
    seoScore: 94
  },
  {
    id: 'art-osn-geografi',
    title: 'Tips Belajar OSN Geografi SMA: Analisis Spasial Keruangan, SIG, Geomorfologi & Studi Lapangan Mandiri',
    slug: 'tips-belajar-osn-geografi-sma',
    category: 'OSN & Sains',
    categories: ['OSN & Sains', 'Tips Belajar & Prestasi'],
    date: '2026-08-17',
    author: 'Kak Rian (Medalis OSN Geografi)',
    status: 'published',
    coverImage: '/images/blog/cover-osn-geografi.jpg',
    focusKeyword: 'tips belajar osn geografi sma',
    metaTitle: 'Tips Belajar OSN Geografi SMA: Analisis Spasial & SIG | NLS',
    metaDescription: 'Panduan tips belajar OSN Geografi SMA: interpretasi citra satelit, analisis SIG keruangan, geomorfologi wilayah, dan teknik esai argumentatif iGeo.',
    canonicalUrl: 'https://next-level-study.com/blog/tips-belajar-osn-geografi-sma',
    content: `<h2>Geografi Modern: Sintesis Sains Fisik, Sosial Keruangan, dan Teknologi Geospasial</h2>
<p>OSN Geografi SMA merupakan kompetisi multidisipliner yang menuntut pemahaman mendalam mengenai bentang alam bumi, interaksi manusia dengan lingkungan, tata ruang wilayah perkotaan, serta pemanfaatan teknologi mutakhir Sistem Informasi Geografis (SIG) dan Penginderaan Jauh.</p>

<h3>1. Geografi Fisik: Geomorfologi, Hidrologi, dan Biogeografi</h3>
<p>Pahami proses endogen (tektonisme, vulkanisme, seisme) dan proses eksogen (pelapukan, erosi, sedimentasi, mass wasting) yang membentuk bentang alam karst, glasial, aeolian, dan fluvial. Kuasai siklus hidrologi DAS (Daerah Aliran Sungai), debit air permukaan, serta sebaran bioma flora-fauna dunia berdasarkan garis Wallace-Weber.</p>

<h3>2. Geografi Manusia, Urbanisasi, dan Tata Ruang Kota</h3>
<p>Pelajari dinamika kependudukan (natalitas, mortalitas, migrasi, bonus demografi), model struktur ruang kota (Konsentris Burgess, Sektoral Hoyt, Inti Berganda Harris-Ullman), interaksi desa-kota model gravitasi Reilly, serta tantangan pembangunan berkelanjutan (SDGs).</p>

<h3>3. Penginderaan Jauh & Sistem Informasi Geografis (SIG)</h3>
<p>Kuasai prinsip interpretasi citra satelit dan foto udara melalui 8 unsur interpretasi (rona, warna, bentuk, ukuran, tekstur, pola, bayangan, situs, asosiasi). Pahami komponen data spasial vektor-raster, analisis tumpang-susun peta (overlay buffer), dan sistem proyeksi peta (Mercator, UTM).</p>

<h3>4. Mitigasi Kebencanaan dan Manajemen Lingkungan Hidup</h3>
<p>Sebagai negara di kawasan Cincin Api Pasifik (Ring of Fire), peserta OSN Geografi Indonesia wajib memahami siklus manajemen bencana: pra-bencana (mitigasi struktural/non-struktural & peringatan dini), tanggap darurat, serta pasca-bencana (rehabilitasi & rekonstruksi).</p>

<h3>5. Keterampilan Ujian Esai Terbuka & Fieldwork Test (iGeo Standard)</h3>
<p>Format ujian OSN Geografi nasional mengadopsi standar International Geography Olympiad (iGeo) yang terdiri dari 3 ronde: <em>Written Response Test (WRT)</em> berupa esai analisis analitis, <em>Multimedia Test (MMT)</em> dengan durasi singkat berbasis visual, serta <em>Fieldwork Exercise</em> observasi lapangan dan pembuatan peta tata guna lahan rekomendasi.</p>

<blockquote>"Melalui kacamata geografi, setiap jengkal permukaan bumi adalah kanvas interaksi dinamis antara kekuatan alam dan peradaban manusia."</blockquote>`,
    seoScore: 93
  }
];

// Baseline initial articles (SNBT 2027 and Tips Jurusan)
const baseArticles = [
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
    id: 'art-3',
    title: 'Tips Memilih Jurusan Kuliah Sesuai Minat, Bakat, dan Prospek Karier Masa Depan',
    slug: 'tips-memilih-jurusan-kuliah-masa-depan',
    category: 'Tips Belajar & Prestasi',
    categories: ['Tips Belajar & Prestasi', 'Informasi NLS'],
    date: '2026-08-10',
    author: 'Kak Bima (Statistika UGM)',
    status: 'published',
    coverImage: '/images/blog/cover-jurusan-kuliah.jpg',
    focusKeyword: 'tips memilih jurusan kuliah',
    metaTitle: 'Tips Memilih Jurusan Kuliah Sesuai Minat & Prospek Karier | NLS',
    metaDescription: 'Panduan komprehensif cara memilih jurusan kuliah yang tepat di PTN favorit sesuai minat, bakat, potensi akademik, dan prospek karier masa depan.',
    canonicalUrl: 'https://next-level-study.com/blog/memilih-jurusan',
    content: `<h2>Salah Jurusan: Masalah Klasik yang Harus Dihindari</h2>
<p>Riset menunjukkan lebih dari 80% mahasiswa di Indonesia merasa salah memilih program studi. Memilih jurusan kuliah adalah keputusan strategis yang akan membentuk lintasan karier dan pengembangan profesional Anda di masa depan.</p>

<h3>Formula 3A dalam Memilih Jurusan</h3>
<ol>
  <li><strong>Aptitude (Bakat & Kemampuan Akademik):</strong> Ukur performa nilai rapor dan skor try out pada mata pelajaran kunci.</li>
  <li><strong>Affinity (Minat & Gairah Belajar):</strong> Bidang apa yang membuat Anda bersemangat untuk belajar secara mandiri tanpa paksaan?</li>
  <li><strong>Application (Peluang Kerja & Tren Industri):</strong> Analisis kebutuhan industri 5–10 tahun ke depan, seperti Data Science, Artificial Intelligence, Green Energy, dan Bioteknologi.</li>
</ol>`,
    seoScore: 90
  }
];

// Combine all articles: 9 OSN articles first + baseline articles
const allArticles = [...osnArticles, ...baseArticles];

// 1. Write updated blog/default-articles.js
const defaultArticlesJsContent = `/**
 * Master Dataset Berita & Artikel CMS Next Level Study (NLS)
 * Baseline data tersinkronisasi untuk /nlsadmin, /blog, dan homepage.
 */
window.NLS_DEFAULT_ARTICLES = ${JSON.stringify(allArticles, null, 4)};
`;

fs.writeFileSync(path.join(__dirname, '../blog/default-articles.js'), defaultArticlesJsContent, 'utf8');
console.log('SUCCESS: Written updated blog/default-articles.js with 9 OSN tips belajar articles!');
