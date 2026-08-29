import { getCloudStore, saveCloudStore } from './cloud-db.js';

const defaultCourses = [
    // School SD (Kelas 1-6)
    {
        id: 'c-sch-1',
        category: 'School',
        level: 'SD',
        title: 'Matematika Dasar & Logika Sains SD',
        description: 'Penguasaan konsep bilangan bulat, pecahan, geometri, dan penalaran logika untuk siswa SD kelas 4-6.',
        mentor: 'Kak Raditya Pratama, S.Si.',
        mentor_id: 't-1',
        totalModules: 8,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [
            {
                id: 'm-1',
                title: 'Bilangan Bulat & Pecahan Lanjut',
                type: 'materi',
                duration: '25 Menit',
                summary: 'Operasi hitung campuran, FPB, KPK, dan pemecahan masalah pecahan cerita.',
                pdfUrl: 'https://next-level-study.com/materials/sd-math-bab1.pdf'
            },
            {
                id: 'm-2',
                title: 'Kuis Latihan: Bilangan & Pecahan SD',
                type: 'kuis',
                duration: '15 Menit',
                questions: [
                    {
                        question: 'Hasil dari 3/4 + 2/5 - 1/2 adalah...',
                        options: ['13/20', '11/20', '7/10', '9/20'],
                        correctAnswer: '13/20',
                        explanation: 'Samakan penyebut ke 20: 15/20 + 8/20 - 10/20 = 13/20.'
                    }
                ]
            },
            {
                id: 'm-3',
                title: 'Video Pembelajaran: Geometri Bangun Ruang',
                type: 'video',
                duration: '30 Menit',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                summary: 'Menghitung luas permukaan dan volume balok, kubus, prisma, dan tabung.'
            }
        ],
        created_at: '2026-08-01T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-sch-1b',
        category: 'School',
        level: 'SD',
        title: 'IPA & Eksplorasi Sains Alam SD',
        description: 'Pemahaman sains tematik, makhluk hidup, energi, lingkungan hidup, dan metode eksperimen sederhana.',
        mentor: 'Dr. Sarah Kartika, M.Sc.',
        mentor_id: 't-2',
        totalModules: 8,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-02T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-sch-1c',
        category: 'School',
        level: 'SD',
        title: 'Bahasa Inggris Dasar & Literasi Membaca SD',
        description: 'Vocabulary harian, reading comprehension cerita anak, dan tata bahasa dasar komunikatif.',
        mentor: 'Miss Jessica Aurelia, B.Ed.',
        mentor_id: 't-4',
        totalModules: 6,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-03T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // School SMP (Kelas 7-9)
    {
        id: 'c-sch-2',
        category: 'School',
        level: 'SMP',
        title: 'Fisika & IPA Terpadu SMP',
        description: 'Pemahaman mendalam konsep gaya, energi, getaran gelombang, serta persiapan ujian sumatif SMP.',
        mentor: 'Dr. Sarah Kartika, M.Sc.',
        mentor_id: 't-2',
        totalModules: 10,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [
            {
                id: 'm-1',
                title: 'Hukum Newton & Dinamika Gerak',
                type: 'materi',
                duration: '35 Menit',
                summary: 'Analisis gaya gesek, percepatan, dan gaya aksi-reaksi pada bidang miring.',
                pdfUrl: 'https://next-level-study.com/materials/smp-fisika-bab1.pdf'
            },
            {
                id: 'm-2',
                title: 'Kuis Evaluasi: Hukum Newton',
                type: 'kuis',
                duration: '20 Menit',
                questions: [
                    {
                        question: 'Benda bermassa 5 kg ditarik dengan gaya 20 N pada lantai licin. Berapakah percepatan benda?',
                        options: ['2 m/s²', '4 m/s²', '5 m/s²', '10 m/s²'],
                        correctAnswer: '4 m/s²',
                        explanation: 'a = F / m = 20 N / 5 kg = 4 m/s².'
                    }
                ]
            }
        ],
        created_at: '2026-08-05T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-sch-2b',
        category: 'School',
        level: 'SMP',
        title: 'Matematika Aljabar & Geometri Bangun Ruang SMP',
        description: 'Persamaan linear, phytagoras, lingkaran, transformasi geometri, dan statistik data SMP.',
        mentor: 'Kak Raditya Pratama, S.Si.',
        mentor_id: 't-1',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-06T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-sch-2c',
        category: 'School',
        level: 'SMP',
        title: 'Bahasa Inggris & Reading Comprehension SMP',
        description: 'Grammar structure, narrative text, report text, dan latihan soal ujian sekolah SMP.',
        mentor: 'Miss Jessica Aurelia, B.Ed.',
        mentor_id: 't-4',
        totalModules: 8,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-07T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // School SMA (Kelas 10-12)
    {
        id: 'c-sch-3',
        category: 'School',
        level: 'SMA',
        title: 'Matematika Lanjut & Kalkulus SMA',
        description: 'Trigonometri analitik, limit fungsi, turunan, dan integral untuk persiapan nilai rapor unggul.',
        mentor: 'Kak Raditya Pratama, S.Si.',
        mentor_id: 't-1',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [
            {
                id: 'm-1',
                title: 'Teorema Limit & Asimtot Fungsi Aljabar',
                type: 'materi',
                duration: '40 Menit',
                summary: 'Metode faktorisasi, perkalian sekawan, dan dalil L\'Hopital untuk limit bentuk tak tentu.',
                pdfUrl: 'https://next-level-study.com/materials/sma-limit-kalkulus.pdf'
            },
            {
                id: 'm-2',
                title: 'Kuis Bab Limit & Turunan',
                type: 'kuis',
                duration: '20 Menit',
                questions: [
                    {
                        question: 'Turunan pertama dari f(x) = (3x² - 2)³ adalah...',
                        options: ['18x(3x² - 2)²', '9x(3x² - 2)²', '6x(3x² - 2)²', '18x²(3x² - 2)²'],
                        correctAnswer: '18x(3x² - 2)²',
                        explanation: 'Gunakan aturan rantai: f\'(x) = 3(3x² - 2)² . (6x) = 18x(3x² - 2)².'
                    }
                ]
            }
        ],
        created_at: '2026-08-10T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-sch-3b',
        category: 'School',
        level: 'SMA',
        title: 'Fisika Mekanika & Elektromagnetika SMA',
        description: 'Dinamika gerak, fluida, termodinamika, medan listrik, dan rangkaian arus bolak-balik.',
        mentor: 'Dr. Sarah Kartika, M.Sc.',
        mentor_id: 't-2',
        totalModules: 14,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-11T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-sch-3c',
        category: 'School',
        level: 'SMA',
        title: 'Kimia Struktur Atom & Stoikiometri Larutan SMA',
        description: 'Ikatan kimia, termokimia, kesetimbangan reaksi, asam-basa, dan elektrokimia SMA.',
        mentor: 'Kak Dimas Arya, S.Si.',
        mentor_id: 't-3',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-11T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-sch-3d',
        category: 'School',
        level: 'SMA',
        title: 'Biologi Sel, Genetika & Evolusi SMA',
        description: 'Metabolisme enzim, sintesis protein, hukum mendel, bioteknologi modern, dan fisiologi tubuh.',
        mentor: 'dr. Amanda Putri',
        mentor_id: 't-5',
        totalModules: 10,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-11T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // Olimpiade OSN SD
    {
        id: 'c-oly-1',
        category: 'Olimpiade',
        level: 'OSN SD',
        title: 'Pembinaan Intensif OSN Matematika SD',
        description: 'Latihan soal teori bilangan, geometri olimpiade, dan kombinatorika tingkat kabupaten hingga nasional.',
        mentor: 'Kak Rifki Pratama, S.Si.',
        mentor_id: 't-3',
        totalModules: 10,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-12T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-oly-1b',
        category: 'Olimpiade',
        level: 'OSN SD',
        title: 'Klinik Juara OSN IPA & Sains Eksplorasi SD',
        description: 'Mekanika dasar, astronomi tata surya, ekosistem lingkungan, dan eksperimen olimpiade SD.',
        mentor: 'Dr. Sarah Kartika, M.Sc.',
        mentor_id: 't-2',
        totalModules: 8,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-13T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // Olimpiade OSN SMP
    {
        id: 'c-oly-2',
        category: 'Olimpiade',
        level: 'OSN SMP',
        title: 'Klinik Soal OSN IPA & Fisika SMP',
        description: 'Bedah soal mekanika fluida, optik, dan astronomi dasar olimpiade sains SMP.',
        mentor: 'Dr. Sarah Kartika, M.Sc.',
        mentor_id: 't-2',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-15T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-oly-2b',
        category: 'Olimpiade',
        level: 'OSN SMP',
        title: 'Pembinaan Juara OSN Matematika SMP',
        description: 'Aljabar olimpiade, teori bilangan lanjut, geometri euclid, dan trik pigeonhole principle.',
        mentor: 'Kak Rifki Pratama, S.Si.',
        mentor_id: 't-3',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-16T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-oly-2c',
        category: 'Olimpiade',
        level: 'OSN SMP',
        title: 'Masterclass OSN IPS Terpadu SMP',
        description: 'Geografi keruangan, sejarah peradaban, ekonomi mikro-makro, dan sosiologi kompetisi.',
        mentor: 'Drs. Hendra Gunawan, M.Pd.',
        mentor_id: 't-6',
        totalModules: 10,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-17T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // Olimpiade OSN SMA
    {
        id: 'c-oly-3',
        category: 'Olimpiade',
        level: 'OSN SMA',
        title: 'Masterclass OSN Fisika Teori & Kalkulus',
        description: 'Mekanika analitik Lagrangian, elektromagnetika lanjut, dan termodinamika olimpiade nasional & IPhO.',
        mentor: 'Dr. Sarah Kartika, M.Sc.',
        mentor_id: 't-2',
        totalModules: 14,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-18T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-oly-3b',
        category: 'Olimpiade',
        level: 'OSN SMA',
        title: 'OSN Matematika Kombinatorika & Teori Bilangan SMA',
        description: 'Persamaan diophantine, fungsi pembangkit, ketidaksamaan Cauchy-Schwarz, dan geometri projektif.',
        mentor: 'Kak Raditya Pratama, S.Si.',
        mentor_id: 't-1',
        totalModules: 14,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-19T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-oly-3c',
        category: 'Olimpiade',
        level: 'OSN SMA',
        title: 'OSN Kimia Organik & Termodinamika Kimia SMA',
        description: 'Mekanisme reaksi organik, spektroskopi NMR/IR, kinetika reaksi, dan kimia koordinasi IChO.',
        mentor: 'Kak Dimas Arya, S.Si.',
        mentor_id: 't-3',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-19T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-oly-3d',
        category: 'Olimpiade',
        level: 'OSN SMA',
        title: 'OSN Informatika Algoritma & Pemrograman C++',
        description: 'Dynamic programming, graph theory, segment tree, dan teknik problem solving standar IOI.',
        mentor: 'Kak Fakhri Irfan, S.Kom.',
        mentor_id: 't-7',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-19T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // Olimpiade ONMIPA
    {
        id: 'c-oly-4',
        category: 'Olimpiade',
        level: 'ONMIPA',
        title: 'ONMIPA Matematika Analisis Real & Aljabar Linear',
        description: 'Pelatihan mahasiswa untuk seleksi ONMIPA wilayah & nasional mata uji Analisis Real & Aljabar Abstrak.',
        mentor: 'Prof. Tim Akademik NLS',
        mentor_id: 't-1',
        totalModules: 8,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-20T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-oly-4b',
        category: 'Olimpiade',
        level: 'ONMIPA',
        title: 'ONMIPA Fisika Kuantum & Elektrodinamika Klasik',
        description: 'Persamaan Schrödinger, operator mekanika kuantum, dan persamaan Maxwell pada medium dielektrik.',
        mentor: 'Dr. Sarah Kartika, M.Sc.',
        mentor_id: 't-2',
        totalModules: 10,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-20T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // Olimpiade Internasional
    {
        id: 'c-oly-5',
        category: 'Olimpiade',
        level: 'Internasional',
        title: 'International Physics Olympiad (IPhO) Preparation',
        description: 'Advanced problem-solving for IMO/IPhO candidate camp and Asian Physics Olympiad (APhO).',
        mentor: 'Dr. Sarah Kartika, M.Sc.',
        mentor_id: 't-2',
        totalModules: 15,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-21T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-oly-5b',
        category: 'Olimpiade',
        level: 'Internasional',
        title: 'International Mathematical Olympiad (IMO) Shortlist Problems',
        description: 'Bedah soal shortlist IMO bidang Functional Equation, Number Theory, and Combinatorics.',
        mentor: 'Kak Raditya Pratama, S.Si.',
        mentor_id: 't-1',
        totalModules: 15,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-21T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // TKA SD
    {
        id: 'c-tka-1',
        category: 'TKA',
        level: 'TKA SD',
        title: 'Penguatan TKA & Asesmen Standar SD',
        description: 'Persiapan asesmen kompetensi minimum, penalaran numerasi, dan seleksi masuk SMP unggulan.',
        mentor: 'Tim Kurikulum NLS',
        mentor_id: 't-1',
        totalModules: 6,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-22T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-tka-1b',
        category: 'TKA',
        level: 'TKA SD',
        title: 'Simulasi Tes Potensi Akademik Masuk SMP Unggulan',
        description: 'Latihan soal logika spasial, verbal analogi, dan aritmatika cepat untuk ujian seleksi SMP favorit.',
        mentor: 'Kak Raditya Pratama, S.Si.',
        mentor_id: 't-1',
        totalModules: 8,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-22T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // TKA SMP
    {
        id: 'c-tka-2',
        category: 'TKA',
        level: 'TKA SMP',
        title: 'Persiapan ASPD & Tes Masuk SMA Favorit (Taruna/Thamrin)',
        description: 'Simulasi tes skolastik dan akademik intensif masuk SMA Unggulan Nasional.',
        mentor: 'Kak Raditya Pratama, S.Si.',
        mentor_id: 't-1',
        totalModules: 10,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-23T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-tka-2b',
        category: 'TKA',
        level: 'TKA SMP',
        title: 'Drilling Soal Skolastik & Literasi Masuk SMA Unggulan',
        description: 'Bedah tipe soal Tes Potensi Akademik (TPA), Bahasa Inggris Akademik, dan Sains terpadu.',
        mentor: 'Dr. Sarah Kartika, M.Sc.',
        mentor_id: 't-2',
        totalModules: 10,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-23T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // TKA SMA
    {
        id: 'c-tka-3',
        category: 'TKA',
        level: 'TKA SMA',
        title: 'Tes Kemampuan Akademik Saintek SMA',
        description: 'Standarisasi pemahaman konsep Fisika, Kimia, Matematika Lanjut, dan Biologi.',
        mentor: 'Tim Sains NLS',
        mentor_id: 't-2',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-24T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-tka-3b',
        category: 'TKA',
        level: 'TKA SMA',
        title: 'Tes Kemampuan Akademik Soshum SMA',
        description: 'Pemantapan materi Sejarah Kritis, Geografi Terpadu, Sosiologi, dan Ekonomi Analitik.',
        mentor: 'Drs. Hendra Gunawan, M.Pd.',
        mentor_id: 't-6',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-24T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // College Prep SNBT
    {
        id: 'c-clg-1',
        category: 'Collage Preparation',
        level: 'SNBT',
        title: 'UTBK SNBT 2026: TPS Penalaran Matematika & Kuantitatif',
        description: 'Trik cepat 30 detik pengerjaan soal TPS Penalaran Matematika, Pengetahuan Kuantitatif, & Penalaran Umum.',
        mentor: 'Kak Raditya Pratama, S.Si.',
        mentor_id: 't-1',
        totalModules: 16,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-25T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-clg-1b',
        category: 'Collage Preparation',
        level: 'SNBT',
        title: 'UTBK SNBT 2026: Literasi Bahasa Indonesia & Bahasa Inggris',
        description: 'Teknik skimming & scanning, inferensi teks kompleks, dan analisis wacana kritis UTBK.',
        mentor: 'Miss Jessica Aurelia, B.Ed.',
        mentor_id: 't-4',
        totalModules: 14,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-25T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-clg-1c',
        category: 'Collage Preparation',
        level: 'SNBT',
        title: 'UTBK SNBT 2026: Pemahaman Bacaan & Penalaran Deduktif-Induktif',
        description: 'Strategi menjawab soal PBM, PPU, penalaran logis analitis, dan silogisme skolastik.',
        mentor: 'Tim Kurikulum NLS',
        mentor_id: 't-1',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-25T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // College Prep Mandiri
    {
        id: 'c-clg-2',
        category: 'Collage Preparation',
        level: 'Mandiri',
        title: 'Spesialis Seleksi Mandiri SIMAK UI & CBT UGM',
        description: 'Bedah tuntas tipe soal Matematika Dasar, IPA Terpadu, dan TPA Mandiri PTN Top 3.',
        mentor: 'Tim Mentor Alumni UI-ITB-UGM',
        mentor_id: 't-1',
        totalModules: 14,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-26T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },
    {
        id: 'c-clg-2b',
        category: 'Collage Preparation',
        level: 'Mandiri',
        title: 'Masterclass SM ITB & SMUP Unpad Saintek',
        description: 'Penguasaan soal level tinggi Matematika, Fisika, dan Kimia Ujian Mandiri Kampus Favorit.',
        mentor: 'Dr. Sarah Kartika, M.Sc.',
        mentor_id: 't-2',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-26T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    },

    // College Prep Kedinasan
    {
        id: 'c-clg-3',
        category: 'Collage Preparation',
        level: 'Kedinasan',
        title: 'Bimbel SKD Kedinasan (TIU, TWK, TKP)',
        description: 'Strategi lolos passing grade SKD IPDN, STAN, STIS, STIN, dan Poltekip.',
        mentor: 'Tim Spesialis Kedinasan',
        mentor_id: 't-1',
        totalModules: 10,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: [],
        created_at: '2026-08-27T00:00:00.000Z',
        updated_at: '2026-08-28T00:00:00.000Z'
    }
];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const store = await getCloudStore();
    let coursesCache = Array.isArray(store.courses) && store.courses.length > 0 ? store.courses : defaultCourses;

    // Ensure all default courses exist in coursesCache
    if (Array.isArray(coursesCache)) {
        defaultCourses.forEach(def => {
            if (!coursesCache.some(c => c && c.id === def.id)) {
                coursesCache.push(def);
            }
        });
    }

    // GET /api/courses
    if (req.method === 'GET') {
        const category = req.query && req.query.category;
        const level = req.query && req.query.level;
        let data = coursesCache;

        if (category) {
            data = data.filter(c => c.category && c.category.toLowerCase() === category.toLowerCase());
        }
        if (level) {
            data = data.filter(c => c.level && c.level.toLowerCase() === level.toLowerCase());
        }

        const activeCount = data.filter(c => c.status !== 'trashed').length;
        const trashCount = data.filter(c => c.status === 'trashed').length;

        return res.status(200).json({
            success: true,
            total: data.length,
            activeCount: activeCount,
            trashCount: trashCount,
            data: data,
            timestamp: new Date().toISOString()
        });
    }

    // POST /api/courses (Create or Upsert)
    if (req.method === 'POST') {
        try {
            const courseData = req.body;
            if (!courseData || !courseData.title) {
                return res.status(400).json({ success: false, message: 'Judul kursus wajib diisi.' });
            }

            const newCourse = {
                id: courseData.id || ('c-' + Date.now()),
                category: courseData.category || 'School',
                level: courseData.level || 'SMA',
                title: courseData.title.trim(),
                description: courseData.description ? courseData.description.trim() : '',
                mentor: courseData.mentor || 'Tim Akademik NLS',
                mentor_id: courseData.mentor_id || '',
                totalModules: Array.isArray(courseData.modules) ? courseData.modules.length : (courseData.totalModules || 0),
                status: courseData.status || 'published',
                coverImage: courseData.coverImage || '/images/stitch/pillar-study.jpg',
                modules: Array.isArray(courseData.modules) ? courseData.modules : [],
                created_at: courseData.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const idx = coursesCache.findIndex(c => c.id === newCourse.id);
            if (idx !== -1) {
                coursesCache[idx] = { ...coursesCache[idx], ...newCourse };
            } else {
                coursesCache.unshift(newCourse);
            }

            store.courses = coursesCache;
            await saveCloudStore(store);

            return res.status(200).json({
                success: true,
                message: 'Kursus berhasil disimpan!',
                data: newCourse
            });
        } catch(e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    // PUT /api/courses (Update status or module)
    if (req.method === 'PUT') {
        try {
            const { id, status, deletedAt, module, modules } = req.body || {};
            if (!id) return res.status(400).json({ success: false, message: 'Course ID is required.' });

            const idx = coursesCache.findIndex(c => c.id === id);
            if (idx !== -1) {
                if (status) coursesCache[idx].status = status;
                if (deletedAt) coursesCache[idx].deletedAt = deletedAt;
                if (modules) {
                    coursesCache[idx].modules = modules;
                    coursesCache[idx].totalModules = modules.length;
                }
                if (module) {
                    if (!Array.isArray(coursesCache[idx].modules)) coursesCache[idx].modules = [];
                    coursesCache[idx].modules.push(module);
                    coursesCache[idx].totalModules = coursesCache[idx].modules.length;
                }
                coursesCache[idx].updated_at = new Date().toISOString();

                store.courses = coursesCache;
                await saveCloudStore(store);

                return res.status(200).json({ success: true, message: 'Status kursus diperbarui.', data: coursesCache[idx] });
            }
            return res.status(404).json({ success: false, message: 'Kursus tidak ditemukan.' });
        } catch(e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    // DELETE /api/courses (Permanent deletion)
    if (req.method === 'DELETE') {
        try {
            const id = req.query && req.query.id;
            if (!id) return res.status(400).json({ success: false, message: 'Course ID is required.' });

            coursesCache = coursesCache.filter(c => c.id !== id);
            store.courses = coursesCache;
            await saveCloudStore(store);

            return res.status(200).json({ success: true, message: 'Kursus berhasil dihapus secara permanen.' });
        } catch(e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
