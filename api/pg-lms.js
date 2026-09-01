import { sql } from '@vercel/postgres';

﻿

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
                        options: ['2 m/sÂ²', '4 m/sÂ²', '5 m/sÂ²', '10 m/sÂ²'],
                        correctAnswer: '4 m/sÂ²',
                        explanation: 'a = F / m = 20 N / 5 kg = 4 m/sÂ².'
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
                        question: 'Turunan pertama dari f(x) = (3xÂ² - 2)Â³ adalah...',
                        options: ['18x(3xÂ² - 2)Â²', '9x(3xÂ² - 2)Â²', '6x(3xÂ² - 2)Â²', '18xÂ²(3xÂ² - 2)Â²'],
                        correctAnswer: '18x(3xÂ² - 2)Â²',
                        explanation: 'Gunakan aturan rantai: f\'(x) = 3(3xÂ² - 2)Â² . (6x) = 18x(3xÂ² - 2)Â².'
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
        description: 'Persamaan SchrÃ¶dinger, operator mekanika kuantum, dan persamaan Maxwell pada medium dielektrik.',
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



export default async function handler(request, response) {
    if (request.method !== 'POST' && request.method !== 'GET' && request.method !== 'DELETE') {
        return response.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    try {
        const action = request.method === 'POST' ? request.body.action : request.query.action;

        // --- 1. SETUP LMS TABLES ---
        if (action === 'setup_lms') {
            try {
                await sql`ALTER TABLE IF EXISTS lms_enrollments DROP CONSTRAINT IF EXISTS lms_enrollments_user_id_fkey;`;
                await sql`ALTER TABLE IF EXISTS lms_quiz_results DROP CONSTRAINT IF EXISTS lms_quiz_results_user_id_fkey;`;
                await sql`ALTER TABLE IF EXISTS lms_enrollments ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR;`;
                await sql`ALTER TABLE IF EXISTS lms_quiz_results ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR;`;
            } catch(e) {}

            await sql`
                CREATE TABLE IF NOT EXISTS lms_courses (
                    id VARCHAR(100) PRIMARY KEY,
                    category VARCHAR(50),
                    level VARCHAR(50),
                    title VARCHAR(255),
                    description TEXT,
                    content_json JSONB,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `;

            await sql`
                CREATE TABLE IF NOT EXISTS lms_enrollments (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id VARCHAR(255),
                    course_id VARCHAR(100) REFERENCES lms_courses(id) ON DELETE CASCADE,
                    progress INTEGER DEFAULT 0,
                    completed_modules JSONB DEFAULT '[]'::jsonb,
                    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(user_id, course_id)
                );
            `;

            await sql`
                CREATE TABLE IF NOT EXISTS lms_quiz_results (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id VARCHAR(255),
                    course_id VARCHAR(100) REFERENCES lms_courses(id) ON DELETE CASCADE,
                    module_index INTEGER,
                    score NUMERIC(5,2),
                    answers_json JSONB,
                    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `;

            await sql`
                CREATE TABLE IF NOT EXISTS lms_quiz_attempts (
                    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                    user_id VARCHAR(255),
                    course_id VARCHAR(100) REFERENCES lms_courses(id) ON DELETE CASCADE,
                    module_id VARCHAR(100),
                    status VARCHAR(50) DEFAULT 'in_progress',
                    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    elapsed_seconds INTEGER DEFAULT 0,
                    answers_json JSONB DEFAULT '{}'::jsonb,
                    UNIQUE(user_id, course_id, module_id)
                );
            `;

            return response.status(200).json({ success: true, message: 'LMS tables created successfully.' });
        }

        // --- 2. IMPORT DEFAULT COURSES ---
        if (action === 'import_courses') {
            let importedCount = 0;
            for (const course of defaultCourses) {
                // Check if exists
                const existing = await sql`SELECT id FROM lms_courses WHERE id = ${course.id}`;
                if (existing.rows.length === 0) {
                    // Insert
                    await sql`
                        INSERT INTO lms_courses (id, category, level, title, description, content_json)
                        VALUES (${course.id}, ${course.category}, ${course.level}, ${course.title}, ${course.description}, ${JSON.stringify(course)})
                    `;
                    importedCount++;
                } else {
                    // Update
                    await sql`
                        UPDATE lms_courses 
                        SET category = ${course.category}, level = ${course.level}, title = ${course.title}, description = ${course.description}, content_json = ${JSON.stringify(course)}
                        WHERE id = ${course.id}
                    `;
                }
            }
            return response.status(200).json({ success: true, message: `Successfully imported/updated ${defaultCourses.length} courses. (${importedCount} new)` });
        }

        // --- 3. GET COURSES CATALOG ---
        if (action === 'get_courses') {
            const { category, level } = request.body || request.query || {};
            let query = sql`SELECT content_json FROM lms_courses`;
            
            if (category && level) {
                query = sql`SELECT content_json FROM lms_courses WHERE category = ${category} AND level = ${level}`;
            } else if (category) {
                query = sql`SELECT content_json FROM lms_courses WHERE category = ${category}`;
            } else if (level) {
                query = sql`SELECT content_json FROM lms_courses WHERE level = ${level}`;
            }
            
            const res = await query;
            // Filter out draft and trashed courses for students
            const courses = res.rows.map(r => r.content_json).filter(c => c.status !== 'draft' && c.status !== 'trashed');
            return response.status(200).json({ success: true, data: courses });
        }

        // --- 4. GET LMS DATA (User Progress) ---
        if (action === 'get_lms_data') {
            const userId = request.body.userId || request.query.userId;
            if (!userId) return response.status(400).json({ success: false, message: 'User ID is required.' });

            const enrollmentsRes = await sql`SELECT course_id FROM lms_enrollments WHERE user_id = ${userId}`;
            const enrolledIds = enrollmentsRes.rows.map(r => r.course_id);

            const progressRes = await sql`SELECT course_id, progress, completed_modules FROM lms_enrollments WHERE user_id = ${userId}`;
            
            const quizRes = await sql`SELECT course_id, module_index, score, submitted_at as date FROM lms_quiz_results WHERE user_id = ${userId} ORDER BY submitted_at DESC`;
            
            // Format quiz results for frontend
            const quizResults = quizRes.rows.map(q => ({
                courseId: q.course_id,
                moduleIndex: q.module_index,
                score: q.score,
                date: new Date(q.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            }));

            // Format progress map
            const progressMap = {};
            progressRes.rows.forEach(r => {
                progressMap[r.course_id] = {
                    progress: r.progress,
                    completedModules: Array.isArray(r.completed_modules) ? r.completed_modules : []
                };
            });

            return response.status(200).json({ 
                success: true, 
                lmsData: {
                    enrolledIds,
                    quizResults,
                    progressMap
                }
            });
        }

        // --- 5. ENROLL COURSE ---
        if (action === 'enroll') {
            const { userId, courseId } = request.body;
            if (!userId || !courseId) return response.status(400).json({ success: false, message: 'Missing userId or courseId.' });

            await sql`
                INSERT INTO lms_enrollments (user_id, course_id)
                VALUES (${userId}, ${courseId})
                ON CONFLICT (user_id, course_id) DO NOTHING
            `;
            
            return response.status(200).json({ success: true, message: 'Enrolled successfully.' });
        }

        // --- 6. UPDATE PROGRESS ---
        if (action === 'update_progress') {
            const { userId, courseId, progress, completedModules } = request.body;
            if (!userId || !courseId) return response.status(400).json({ success: false, message: 'Missing userId or courseId.' });

            await sql`
                UPDATE lms_enrollments 
                SET progress = ${progress || 0}, completed_modules = ${JSON.stringify(completedModules || [])}::jsonb, last_accessed = CURRENT_TIMESTAMP
                WHERE user_id = ${userId} AND course_id = ${courseId}
            `;
            
            return response.status(200).json({ success: true, message: 'Progress updated.' });
        }

        // --- 7. SUBMIT QUIZ ---
        if (action === 'submit_quiz') {
            const { userId, courseId, moduleIndex, moduleId, score, answers } = request.body;
            if (!userId || !courseId || score === undefined) return response.status(400).json({ success: false, message: 'Missing required quiz data.' });

            const result = await sql`
                INSERT INTO lms_quiz_results (user_id, course_id, module_index, score, answers_json)
                VALUES (${userId}, ${courseId}, ${moduleIndex}, ${score}, ${JSON.stringify(answers || {})})
                RETURNING id
            `;
            
            if (moduleId) {
                await sql`
                    UPDATE lms_quiz_attempts
                    SET status = 'submitted', last_saved_at = CURRENT_TIMESTAMP
                    WHERE user_id = ${userId} AND course_id = ${courseId} AND module_id = ${moduleId}
                `;
            }
            
            return response.status(200).json({ success: true, message: 'Quiz submitted.', id: result.rows[0].id });
        }

        // --- 7.a. GET QUIZ PROGRESS ---
        if (action === 'get_quiz_progress') {
            const { userId, courseId, moduleId } = request.body || request.query || {};
            if (!userId || !courseId || !moduleId) return response.status(400).json({ success: false, message: 'Missing parameters.' });

            const attemptRes = await sql`
                SELECT * FROM lms_quiz_attempts 
                WHERE user_id = ${userId} AND course_id = ${courseId} AND module_id = ${moduleId}
            `;
            
            if (attemptRes.rows.length > 0) {
                return response.status(200).json({ success: true, attempt: attemptRes.rows[0] });
            } else {
                return response.status(200).json({ success: true, attempt: null });
            }
        }

        // --- 7.b. START OR SAVE QUIZ PROGRESS ---
        if (action === 'save_quiz_progress') {
            const { userId, courseId, moduleId, elapsedSeconds, answers } = request.body;
            if (!userId || !courseId || !moduleId) return response.status(400).json({ success: false, message: 'Missing parameters.' });

            const existing = await sql`SELECT id, status FROM lms_quiz_attempts WHERE user_id = ${userId} AND course_id = ${courseId} AND module_id = ${moduleId}`;
            
            if (existing.rows.length === 0) {
                // Insert new attempt
                await sql`
                    INSERT INTO lms_quiz_attempts (user_id, course_id, module_id, elapsed_seconds, answers_json, status, started_at, last_saved_at)
                    VALUES (${userId}, ${courseId}, ${moduleId}, ${elapsedSeconds || 0}, ${JSON.stringify(answers || {})}, 'in_progress', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                `;
            } else {
                // Update existing attempt (if not already submitted, or maybe we want to allow overwriting if it's a reset?)
                await sql`
                    UPDATE lms_quiz_attempts
                    SET elapsed_seconds = ${elapsedSeconds || 0}, answers_json = ${JSON.stringify(answers || {})}, last_saved_at = CURRENT_TIMESTAMP, status = 'in_progress'
                    WHERE user_id = ${userId} AND course_id = ${courseId} AND module_id = ${moduleId}
                `;
            }
            return response.status(200).json({ success: true, message: 'Progress saved.' });
        }

        // --- 8. ADMIN: GET ALL COURSES ---
        if (action === 'admin_get_courses' || (!action && request.method === 'GET' && request.url.includes('/api/pg-lms'))) { // fallback
            const res = await sql`SELECT content_json FROM lms_courses ORDER BY created_at DESC`;
            const courses = res.rows.map(r => r.content_json);
            return response.status(200).json({ success: true, data: courses });
        }

        // --- 9. ADMIN: SAVE COURSE ---
        if (action === 'admin_save_course' || request.method === 'PUT') {
            let course = request.body.course || request.body;
            if (!course || !course.id) return response.status(400).json({ success: false, message: 'Invalid course data.' });

            const existing = await sql`SELECT id FROM lms_courses WHERE id = ${course.id}`;
            if (existing.rows.length === 0) {
                await sql`
                    INSERT INTO lms_courses (id, category, level, title, description, content_json)
                    VALUES (${course.id}, ${course.category || ''}, ${course.level || ''}, ${course.title || ''}, ${course.description || ''}, ${JSON.stringify(course)})
                `;
            } else {
                await sql`
                    UPDATE lms_courses 
                    SET category = ${course.category || ''}, level = ${course.level || ''}, title = ${course.title || ''}, description = ${course.description || ''}, content_json = ${JSON.stringify(course)}
                    WHERE id = ${course.id}
                `;
            }
            return response.status(200).json({ success: true, message: 'Course saved successfully.' });
        }

        // --- 10. ADMIN: DELETE COURSE ---
        if (action === 'admin_delete_course' || (request.method === 'DELETE' && !action)) {
            const courseId = request.query.id || request.body.id;
            if (!courseId) return response.status(400).json({ success: false, message: 'Missing course id.' });
            
            // Soft delete by updating content_json status to 'trashed'
            await sql`UPDATE lms_courses SET content_json = jsonb_set(content_json, '{status}', '"trashed"') WHERE id = ${courseId}`;
            return response.status(200).json({ success: true, message: 'Course moved to trash.' });
        }

        // --- 10a. ADMIN: PERMANENT DELETE COURSE ---
        if (action === 'admin_permanent_delete_course') {
            const courseId = request.query.id || request.body.id;
            if (!courseId) return response.status(400).json({ success: false, message: 'Missing course id.' });
            await sql`DELETE FROM lms_courses WHERE id = ${courseId}`;
            return response.status(200).json({ success: true, message: 'Course permanently deleted.' });
        }

        // --- 10b. ADMIN: EMPTY TRASH ---
        if (action === 'admin_empty_trash') {
            const cat = request.query.category || request.body?.category;
            if (cat) {
                await sql`DELETE FROM lms_courses WHERE content_json->>'status' = 'trashed' AND content_json->>'category' = ${cat}`;
            } else {
                await sql`DELETE FROM lms_courses WHERE content_json->>'status' = 'trashed'`;
            }
            return response.status(200).json({ success: true, message: 'Trash emptied.' });
        }

        // --- 10c. ADMIN: RESTORE COURSE ---
        if (action === 'admin_restore_course') {
            const courseId = request.query.id || request.body.id;
            if (!courseId) return response.status(400).json({ success: false, message: 'Missing course id.' });
            // Restore by updating content_json status back to 'published' (or draft)
            await sql`UPDATE lms_courses SET content_json = jsonb_set(content_json, '{status}', '"published"') WHERE id = ${courseId}`;
            return response.status(200).json({ success: true, message: 'Course restored.' });
        }

        // --- 11. ADMIN: GET QUIZ RESULTS ---
        if (action === 'admin_get_quiz_results') {
            const res = await sql`
                SELECT 
                    q.id, q.course_id, q.module_index, q.score, q.answers_json, q.submitted_at as date,
                    u.name as studentName, u.email as studentEmail, u.nisn, u.school,
                    c.title as courseTitle, c.category
                FROM lms_quiz_results q
                LEFT JOIN users u ON q.user_id = u.id
                LEFT JOIN lms_courses c ON q.course_id = c.id
                ORDER BY q.submitted_at DESC
            `;
            
            const results = res.rows.map(r => ({
                id: r.id,
                studentName: r.studentname || 'Siswa NLS',
                studentEmail: r.studentemail || '',
                nisn: r.nisn || '',
                school: r.school || '',
                courseId: r.course_id,
                courseTitle: r.coursetitle || 'Program NLS',
                moduleTitle: `Modul Ke-${r.module_index + 1}`,
                category: r.category || 'School',
                score: r.score,
                answers: r.answers_json || {},
                date: r.date
            }));
            
            return response.status(200).json({ success: true, data: results });
        }

        return response.status(400).json({ success: false, message: 'Invalid action specified.' });

    } catch (error) {
        console.error('Error in pg-lms:', error);
        return response.status(500).json({ success: false, message: error.message });
    }
}
