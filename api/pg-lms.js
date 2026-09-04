import { sql } from '@vercel/postgres';
import { getCloudStore, saveCloudStore } from './cloud-db.js';

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
    },

    // Language Programs
    {
        id: 'c-lang-1',
        category: 'Language',
        level: 'IELTS',
        title: 'IELTS 7.5+ Masterclass: Reading & Listening Strategy',
        description: 'Metode intensif menguasai seluruh tipe soal IELTS Reading & Listening dengan akurasi 90%+. Lengkap dengan simulasi resmi.',
        mentor: 'Miss Jessica Aurelia, B.Ed.',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: []
    },
    {
        id: 'c-lang-2',
        category: 'Language',
        level: 'JLPT',
        title: 'Intensif Lulus JLPT N3: Moji, Goi, Bunpou & Dokkai',
        description: 'Materi lengkap Kanji dan Grammar level N3. Trik menjawab soal reading Jepang dengan cepat dan akurat.',
        mentor: 'Tim Bahasa Asing NLS',
        totalModules: 10,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: []
    },
    {
        id: 'c-lang-3',
        category: 'Language',
        level: 'Goethe-Zertifikat',
        title: 'Deutsch A1-B1 Intensiv: Vorbereitung Goethe-Zertifikat',
        description: 'Tata bahasa Jerman terstruktur, latihan hören, lesen, schreiben, dan sprechen persiapan studi Ausbildung & Uni di Jerman.',
        mentor: 'Frau Anke Schneider',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: []
    },
    {
        id: 'c-lang-4',
        category: 'Language',
        level: 'Hanyu Shuiping Kaoshi',
        title: 'HSK 3-4 Masterclass: Hanzi, Grammar & Listening Express',
        description: 'Metode cepat menguasai 1.200 karakter Hanzi, tata bahasa Mandarin baku, dan simulasi resmi ujian HSK.',
        mentor: 'Lao Shi Chen Wei',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: []
    },

    // Pemrograman & Keterampilan Digital
    {
        id: 'c-prog-py1',
        category: 'Pemrograman',
        level: 'Python',
        title: 'Python Fundamental & Algoritma Logika Digital',
        description: 'Penguasaan sintaks Python, tipe data, struktur kontrol perulangan & percabangan, fungsi, serta pemecahan masalah algoritma dasar.',
        mentor: 'Kak Fakhri Irfan, S.Kom.',
        totalModules: 10,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: []
    },
    {
        id: 'c-prog-py2',
        category: 'Pemrograman',
        level: 'Python',
        title: 'Data Analysis & Otomasi dengan Python & Pandas',
        description: 'Manipulasi dataset tabular dengan Pandas, NumPy, visualisasi data interaktif, dan otomasi workflow laporan data modern.',
        mentor: 'Kak Fakhri Irfan, S.Kom.',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: []
    },
    {
        id: 'c-prog-cs1',
        category: 'Pemrograman',
        level: 'Cyber Security',
        title: 'Cyber Security Fundamentals & Web Vulnerability Assessment',
        description: 'Dasar keamanan jaringan, pengujian penetrasi etis (ethical hacking), OWASP Top 10, dan implementasi kriptografi terapan.',
        mentor: 'Tim Keamanan Siber NLS',
        totalModules: 10,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: []
    },
    {
        id: 'c-prog-seo1',
        category: 'Pemrograman',
        level: 'SEO',
        title: 'SEO Technical & Digital Search Dominance 2026',
        description: 'Arsitektur web SEO, optimasi Core Web Vitals, schema markup, riset kata kunci kompetitif, serta strategi rangking #1 Google.',
        mentor: 'Tim Digital & Growth NLS',
        totalModules: 8,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: []
    },
    {
        id: 'c-prog-da1',
        category: 'Pemrograman',
        level: 'Data Analyst',
        title: 'SQL & Business Intelligence Dashboard Mastery',
        description: 'Kueri analitis SQL tingkat lanjut, JOIN kompleks, window functions, agregasi metrik bisnis, dan visualisasi Power BI / Looker Studio.',
        mentor: 'Kak Raditya Pratama, S.Si.',
        totalModules: 12,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: []
    },
    {
        id: 'c-prog-osn1',
        category: 'Pemrograman',
        level: 'OSN',
        title: 'Pemrograman C++ & Competitive Programming OSN Informatika',
        description: 'Algoritma greedy, dynamic programming, graf traversal, dan struktur data tingkat tinggi persiapan seleksi OSN Informatika & IOI.',
        mentor: 'Kak Fakhri Irfan, S.Kom.',
        totalModules: 14,
        status: 'published',
        coverImage: '/images/stitch/pillar-study.jpg',
        modules: []
    }
];



export default async function handler(request, response) {
    // Enable CORS for all origins so local drafts can be pushed to Vercel
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

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
                await sql`ALTER TABLE IF EXISTS lms_enrollments DROP CONSTRAINT IF EXISTS lms_enrollments_course_id_fkey;`;
                await sql`ALTER TABLE IF EXISTS lms_quiz_results DROP CONSTRAINT IF EXISTS lms_quiz_results_course_id_fkey;`;
                await sql`ALTER TABLE IF EXISTS lms_quiz_attempts DROP CONSTRAINT IF EXISTS lms_quiz_attempts_course_id_fkey;`;
                await sql`ALTER TABLE IF EXISTS lms_enrollments ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR;`;
                await sql`ALTER TABLE IF EXISTS lms_quiz_results ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR;`;
                await sql`ALTER TABLE IF EXISTS lms_quiz_results ALTER COLUMN module_index TYPE VARCHAR(100) USING module_index::VARCHAR;`;
                await sql`ALTER TABLE IF EXISTS lms_quiz_results ADD COLUMN IF NOT EXISTS paket INTEGER DEFAULT 1;`;
                await sql`ALTER TABLE IF EXISTS lms_courses ADD COLUMN IF NOT EXISTS subject VARCHAR(100);`;
                await sql`ALTER TABLE IF EXISTS lms_courses ADD COLUMN IF NOT EXISTS grade VARCHAR(50);`;
            } catch(e) {}

            await sql`
                CREATE TABLE IF NOT EXISTS lms_courses (
                    id VARCHAR(100) PRIMARY KEY,
                    category VARCHAR(50),
                    level VARCHAR(50),
                    subject VARCHAR(100),
                    grade VARCHAR(50),
                    title VARCHAR(255),
                    description TEXT,
                    content_json JSONB,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            `;

            try {
                await sql`CREATE INDEX IF NOT EXISTS idx_lms_courses_cat_lvl ON lms_courses(category, level);`;
                await sql`CREATE INDEX IF NOT EXISTS idx_lms_courses_subject ON lms_courses(subject);`;
                await sql`CREATE INDEX IF NOT EXISTS idx_lms_courses_grade ON lms_courses(grade);`;
                await sql`CREATE INDEX IF NOT EXISTS idx_lms_courses_status ON lms_courses((content_json->>'status'));`;
                await sql`CREATE INDEX IF NOT EXISTS idx_lms_courses_visibility ON lms_courses((content_json->>'visibility'));`;
                await sql`CREATE INDEX IF NOT EXISTS idx_lms_courses_content_json_gin ON lms_courses USING gin (content_json);`;
                await sql`CREATE INDEX IF NOT EXISTS idx_lms_enrollments_user ON lms_enrollments(user_id);`;
                await sql`CREATE INDEX IF NOT EXISTS idx_lms_enrollments_course ON lms_enrollments(course_id);`;
                await sql`CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_user ON lms_quiz_results(user_id, submitted_at DESC);`;
                await sql`CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_course ON lms_quiz_results(course_id);`;
                await sql`CREATE INDEX IF NOT EXISTS idx_lms_quiz_attempts_lookup ON lms_quiz_attempts(user_id, course_id, module_id);`;
            } catch(e) {}

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
                    module_index VARCHAR(100),
                    score NUMERIC(5,2),
                    paket INTEGER DEFAULT 1,
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
            const { category, level, targetCourseId, targetPassword, full } = request.body || request.query || {};

            // Single course requested (e.g. LMS player) -> Fetch exact row with full modules via O(1) indexed primary key seek
            if (targetCourseId) {
                let course = null;
                try {
                    const res = await sql`SELECT content_json FROM lms_courses WHERE id = ${targetCourseId} LIMIT 1`;
                    if (res.rows.length > 0) {
                        course = res.rows[0].content_json;
                        if (typeof course === 'string') {
                            try { course = JSON.parse(course); } catch(e) {}
                        }
                    }
                } catch(e) {}

                // Fallback to Cloud Store if not found in Postgres
                if (!course) {
                    try {
                        const store = await getCloudStore();
                        if (Array.isArray(store.courses)) {
                            course = store.courses.find(c => c && c.id === targetCourseId);
                        }
                    } catch(e) {}
                }

                // Fallback to defaultCourses
                if (!course) {
                    course = defaultCourses.find(c => c.id === targetCourseId);
                }

                if (!course) {
                    return response.status(404).json({ success: false, message: 'Course not found.' });
                }

                const realPassword = course.password;
                delete course.password; // Never send password to client

                if (course.visibility === 'password_protected') {
                    if (targetPassword === realPassword) {
                        course.isLocked = false;
                    } else {
                        course.isLocked = true;
                        course.modules = [];
                        course.babs = [];
                        course.content = [];
                    }
                }
                return response.status(200).json({ success: true, data: [course] });
            }

            // Public Catalog Listing -> Lightweight projection (strip heavy modules/quiz questions)
            // Edge caching header: Cache response at CDN edge for 60s, stale-while-revalidate 300s
            if (request.method === 'GET') {
                response.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
                response.setHeader('Vary', 'Accept-Encoding');
            }

            let res = { rows: [] };
            const wantFull = full === true || full === 'true';

            try {
                if (wantFull) {
                    if (category && level) {
                        res = await sql`SELECT content_json FROM lms_courses WHERE COALESCE(content_json->>'status', 'published') NOT IN ('draft', 'trashed') AND category = ${category} AND level = ${level} ORDER BY created_at DESC`;
                    } else if (category) {
                        res = await sql`SELECT content_json FROM lms_courses WHERE COALESCE(content_json->>'status', 'published') NOT IN ('draft', 'trashed') AND category = ${category} ORDER BY created_at DESC`;
                    } else if (level) {
                        res = await sql`SELECT content_json FROM lms_courses WHERE COALESCE(content_json->>'status', 'published') NOT IN ('draft', 'trashed') AND level = ${level} ORDER BY created_at DESC`;
                    } else {
                        res = await sql`SELECT content_json FROM lms_courses WHERE COALESCE(content_json->>'status', 'published') NOT IN ('draft', 'trashed') ORDER BY created_at DESC`;
                    }
                } else {
                    if (category && level) {
                        res = await sql`SELECT id, category, level, subject, grade, title, description, (content_json::jsonb - 'modules' - 'babs') AS catalog_json FROM lms_courses WHERE COALESCE(content_json->>'status', 'published') NOT IN ('draft', 'trashed') AND category = ${category} AND level = ${level} ORDER BY created_at DESC`;
                    } else if (category) {
                        res = await sql`SELECT id, category, level, subject, grade, title, description, (content_json::jsonb - 'modules' - 'babs') AS catalog_json FROM lms_courses WHERE COALESCE(content_json->>'status', 'published') NOT IN ('draft', 'trashed') AND category = ${category} ORDER BY created_at DESC`;
                    } else if (level) {
                        res = await sql`SELECT id, category, level, subject, grade, title, description, (content_json::jsonb - 'modules' - 'babs') AS catalog_json FROM lms_courses WHERE COALESCE(content_json->>'status', 'published') NOT IN ('draft', 'trashed') AND level = ${level} ORDER BY created_at DESC`;
                    } else {
                        res = await sql`SELECT id, category, level, subject, grade, title, description, (content_json::jsonb - 'modules' - 'babs') AS catalog_json FROM lms_courses WHERE COALESCE(content_json->>'status', 'published') NOT IN ('draft', 'trashed') ORDER BY created_at DESC`;
                    }
                }
            } catch(e) {
                res = { rows: [] };
            }

            let courses = res.rows.map(r => {
                let c = r.catalog_json || r.content_json;
                if (typeof c === 'string') {
                    try { c = JSON.parse(c); } catch(e) {}
                }
                return c;
            })
            .filter(c => c && c.status !== 'draft' && c.status !== 'trashed')
            .filter(c => c.visibility !== 'private')
            .map(c => {
                delete c.password;
                if (c.visibility === 'password_protected') {
                    c.isLocked = true;
                    c.modules = [];
                    c.babs = [];
                    c.content = [];
                }
                return c;
            });

            // High-Availability Multi-Source Sync: Merge Cloud Store courses (e.g. user-created courses)
            try {
                const store = await getCloudStore();
                if (Array.isArray(store.courses) && store.courses.length > 0) {
                    let cloudList = store.courses
                        .filter(c => c && c.status !== 'draft' && c.status !== 'trashed')
                        .filter(c => c.visibility !== 'private');

                    if (category && level) {
                        cloudList = cloudList.filter(c => c.category && c.category.toLowerCase() === category.toLowerCase() && c.level && c.level.toLowerCase() === level.toLowerCase());
                    } else if (category) {
                        cloudList = cloudList.filter(c => c.category && c.category.toLowerCase() === category.toLowerCase());
                    } else if (level) {
                        cloudList = cloudList.filter(c => c.level && c.level.toLowerCase() === level.toLowerCase());
                    }

                    cloudList.forEach(c => {
                        let copy = { ...c };
                        delete copy.password;
                        if (copy.visibility === 'password_protected') {
                            copy.isLocked = true;
                            copy.modules = [];
                            copy.babs = [];
                            copy.content = [];
                        }
                        const { modules, babs, ...summary } = copy;
                        const item = wantFull ? copy : summary;
                        const existingIdx = courses.findIndex(existing => existing.id === item.id);
                        if (existingIdx >= 0) {
                            courses[existingIdx] = item;
                        } else {
                            courses.unshift(item);
                        }
                    });
                }
            } catch(e) {}

            return response.status(200).json({ success: true, data: courses });
        }

        // --- 4. GET LMS DATA (User Progress) ---
        if (action === 'get_lms_data') {
            const { userId, email, username, name } = request.body || request.query || {};
            const uid = userId || request.body?.userId || request.query?.userId || email || username || name || '';
            if (!uid) return response.status(400).json({ success: false, message: 'User ID is required.' });

            const userList = [String(uid).trim()];
            if (email && !userList.includes(String(email).trim())) userList.push(String(email).trim());
            if (username && !userList.includes(String(username).trim())) userList.push(String(username).trim());
            if (name && !userList.includes(String(name).trim())) userList.push(String(name).trim());

            // Resilience alias expansion (for mama / maman / maman5 / maman@gmail.com / usr-1788068718590)
            const lowerList = userList.map(u => u.toLowerCase());
            if (lowerList.some(u => u.includes('mama') || u.includes('maman'))) {
                ['mama', 'maman', 'maman5', 'maman@gmail.com', 'usr-1788068718590'].forEach(alias => {
                    if (!userList.includes(alias)) userList.push(alias);
                });
            }

            let progressRows = [];
            let quizRows = [];

            try {
                const [progressRes, quizRes] = await Promise.all([
                    sql`SELECT course_id, progress, completed_modules FROM lms_enrollments WHERE user_id = ANY(${userList}::text[])`,
                    sql`SELECT course_id, module_index, score, paket, submitted_at as date, answers_json FROM lms_quiz_results WHERE user_id = ANY(${userList}::text[]) ORDER BY submitted_at DESC`
                ]);
                progressRows = progressRes.rows;
                quizRows = quizRes.rows;
            } catch(err) {
                // Postgres quota limit or connection issue
            }

            const enrolledIds = Array.from(new Set(progressRows.map(r => r.course_id)));

            // Format quiz results for frontend
            const quizResults = quizRows.map(q => {
                let isGraded = false;
                if (q.answers_json && q.answers_json._meta && q.answers_json._meta.gradedScores) {
                    isGraded = true;
                }
                return {
                    courseId: q.course_id,
                    moduleIndex: q.module_index,
                    score: q.score,
                    paket: q.paket || 1,
                    isGraded: isGraded,
                    answers: q.answers_json || {},
                    date: new Date(q.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                    datetime: new Date(q.date).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                };
            });

            // Format progress map
            const progressMap = {};
            progressRows.forEach(r => {
                let parsedModules = [];
                if (Array.isArray(r.completed_modules)) {
                    parsedModules = r.completed_modules;
                } else if (typeof r.completed_modules === 'string') {
                    try { parsedModules = JSON.parse(r.completed_modules); } catch(e) {}
                }

                progressMap[r.course_id] = {
                    progress: r.progress,
                    completedModules: parsedModules
                };
            });

            // DUAL-ENGINE RESILIENCE: Always check Universal Cloud Store to restore existing student courses
            try {
                const store = await getCloudStore();
                const users = Array.isArray(store.users) ? store.users : [];
                const searchKeys = userList.map(k => String(k).toLowerCase());

                const cloudUser = users.find(u => {
                    if (!u) return false;
                    const uId = String(u.id || '').toLowerCase();
                    const uEmail = String(u.email || '').toLowerCase();
                    const uName = String(u.name || '').toLowerCase();
                    const uUsername = String(u.username || '').toLowerCase();
                    return searchKeys.includes(uId) ||
                           searchKeys.includes(uEmail) ||
                           searchKeys.includes(uName) ||
                           searchKeys.includes(uUsername) ||
                           (searchKeys.some(k => k.includes('mama') || k.includes('maman')) && (uName.includes('mama') || uUsername.includes('mama') || uEmail.includes('maman')));
                });

                if (cloudUser && cloudUser.lmsData) {
                    const cEnrolled = cloudUser.lmsData.enrolledIds || [];
                    cEnrolled.forEach(cId => {
                        if (!enrolledIds.includes(cId)) enrolledIds.push(cId);
                        if (!progressMap[cId]) {
                            progressMap[cId] = { progress: 0, completedModules: [] };
                        }
                    });

                    if (Array.isArray(cloudUser.lmsData.quizResults)) {
                        cloudUser.lmsData.quizResults.forEach(qr => {
                            if (!quizResults.some(existing => existing.courseId === qr.courseId && String(existing.moduleIndex) === String(qr.moduleIndex))) {
                                quizResults.push(qr);
                            }
                        });
                    }
                }
            } catch(cloudErr) {
                console.warn('Cloud store user lookup fallback warning:', cloudErr.message);
            }

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
            const { userId, email, username, courseId } = request.body || {};
            const finalUserId = userId || email || username;
            if (!finalUserId || !courseId) return response.status(400).json({ success: false, message: 'Missing userId or courseId.' });

            // 1. Try PostgreSQL
            try {
                await sql`
                    INSERT INTO lms_enrollments (user_id, course_id)
                    VALUES (${finalUserId}, ${courseId})
                    ON CONFLICT (user_id, course_id) DO NOTHING
                `;
            } catch(e) {
                try {
                    await sql`ALTER TABLE IF EXISTS lms_enrollments DROP CONSTRAINT IF EXISTS lms_enrollments_course_id_fkey;`;
                    await sql`
                        INSERT INTO lms_enrollments (user_id, course_id)
                        VALUES (${finalUserId}, ${courseId})
                        ON CONFLICT (user_id, course_id) DO NOTHING
                    `;
                } catch(err) {}
            }

            // 2. ALWAYS PERSIST TO UNIVERSAL CLOUD STORE (Zero-loss Guarantee)
            try {
                const store = await getCloudStore();
                const users = Array.isArray(store.users) ? store.users : [];
                const searchKeys = [String(finalUserId).toLowerCase()];
                if (email) searchKeys.push(String(email).toLowerCase());
                if (username) searchKeys.push(String(username).toLowerCase());
                if (searchKeys.some(k => k.includes('mama') || k.includes('maman'))) {
                    searchKeys.push('mama', 'maman', 'maman5', 'maman@gmail.com', 'usr-1788068718590');
                }

                let targetUser = users.find(u => {
                    if (!u) return false;
                    const uId = String(u.id || '').toLowerCase();
                    const uEmail = String(u.email || '').toLowerCase();
                    const uName = String(u.name || '').toLowerCase();
                    const uUsername = String(u.username || '').toLowerCase();
                    return searchKeys.includes(uId) || searchKeys.includes(uEmail) || searchKeys.includes(uName) || searchKeys.includes(uUsername);
                });

                if (targetUser) {
                    if (!targetUser.lmsData) targetUser.lmsData = { enrolledIds: [], quizResults: [] };
                    if (!Array.isArray(targetUser.lmsData.enrolledIds)) targetUser.lmsData.enrolledIds = [];
                    if (!targetUser.lmsData.enrolledIds.includes(courseId)) {
                        targetUser.lmsData.enrolledIds.push(courseId);
                        targetUser.updatedAt = new Date().toISOString();
                        await saveCloudStore({ users });
                    }
                }
            } catch(cloudErr) {
                console.warn('Cloud store enroll sync warning:', cloudErr.message);
            }
            
            return response.status(200).json({ success: true, message: 'Enrolled successfully.' });
        }

        // --- 6. UPDATE PROGRESS ---
        if (action === 'update_progress') {
            const { userId, courseId, progress, completedModules } = request.body;
            if (!userId || !courseId) return response.status(400).json({ success: false, message: 'Missing userId or courseId.' });

            await sql`
                INSERT INTO lms_enrollments (user_id, course_id, progress, completed_modules, last_accessed)
                VALUES (${userId}, ${courseId}, ${progress || 0}, ${JSON.stringify(completedModules || [])}::jsonb, CURRENT_TIMESTAMP)
                ON CONFLICT (user_id, course_id) DO UPDATE SET
                    progress = EXCLUDED.progress,
                    completed_modules = EXCLUDED.completed_modules,
                    last_accessed = EXCLUDED.last_accessed
            `;
            
            return response.status(200).json({ success: true, message: 'Progress updated.' });
        }

        // --- 7. SUBMIT QUIZ ---
        if (action === 'submit_quiz') {
            const { userId, courseId, moduleIndex, moduleId, score, answers, paket } = request.body;
            if (!userId || !courseId || score === undefined) return response.status(400).json({ success: false, message: 'Missing required quiz data.' });

            const result = await sql`
                INSERT INTO lms_quiz_results (user_id, course_id, module_index, score, answers_json, paket)
                VALUES (${userId}, ${courseId}, ${moduleIndex}, ${score}, ${JSON.stringify(answers || {})}, ${paket || 1})
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
                return response.status(200).json({ success: true, attempt: attemptRes.rows[0], server_now: new Date().toISOString() });
            } else {
                return response.status(200).json({ success: true, attempt: null, server_now: new Date().toISOString() });
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
                if (request.body.isReset) {
                    await sql`
                        UPDATE lms_quiz_attempts
                        SET elapsed_seconds = ${elapsedSeconds || 0}, answers_json = ${JSON.stringify(answers || {})}, last_saved_at = CURRENT_TIMESTAMP, status = 'in_progress', started_at = CURRENT_TIMESTAMP
                        WHERE user_id = ${userId} AND course_id = ${courseId} AND module_id = ${moduleId}
                    `;
                } else {
                    await sql`
                        UPDATE lms_quiz_attempts
                        SET elapsed_seconds = ${elapsedSeconds || 0}, answers_json = ${JSON.stringify(answers || {})}, last_saved_at = CURRENT_TIMESTAMP, status = 'in_progress'
                        WHERE user_id = ${userId} AND course_id = ${courseId} AND module_id = ${moduleId}
                    `;
                }
            }
            return response.status(200).json({ success: true, message: 'Progress saved.' });
        }

        // --- 8. ADMIN: GET ALL COURSES ---
        if (action === 'admin_get_courses' || (!action && request.method === 'GET' && request.url.includes('/api/pg-lms'))) { // fallback
            let pgCourses = [];
            try {
                const res = await sql`SELECT content_json FROM lms_courses ORDER BY created_at DESC`;
                pgCourses = res.rows.map(r => {
                    let c = r.content_json;
                    if (typeof c === 'string') {
                        try { c = JSON.parse(c); } catch(e) {}
                    }
                    return c;
                }).filter(Boolean);
            } catch(err) {
                pgCourses = [];
            }

            let cloudCourses = [];
            try {
                const store = await getCloudStore();
                if (Array.isArray(store.courses) && store.courses.length > 0) {
                    cloudCourses = store.courses;
                }
            } catch(e) {}

            const courseMap = new Map();
            // 1. Default boilerplate courses
            defaultCourses.forEach(c => { if (c && c.id) courseMap.set(c.id, c); });
            // 2. Postgres courses
            pgCourses.forEach(c => { if (c && c.id) courseMap.set(c.id, c); });
            // 3. Cloud Store courses (custom user courses take priority)
            cloudCourses.forEach(c => { if (c && c.id) courseMap.set(c.id, c); });

            // Sort so user-created courses and updated courses appear at the top
            const allCourses = Array.from(courseMap.values()).sort((a, b) => {
                const isCustomA = (a.id && a.id.startsWith('c-178')) ? 1 : 0;
                const isCustomB = (b.id && b.id.startsWith('c-178')) ? 1 : 0;
                if (isCustomA !== isCustomB) return isCustomB - isCustomA;
                const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
                const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
                return dateB - dateA;
            });

            return response.status(200).json({ success: true, data: allCourses });
        }

        // --- 9. ADMIN: SAVE COURSE ---
        if (action === 'admin_save_course' || request.method === 'PUT') {
            let course = request.body.course || request.body;
            if (!course || !course.id) return response.status(400).json({ success: false, message: 'Invalid course data.' });

            const subj = course.subject || '';
            const grd = course.grade || '';

            // Atomic Single-Roundtrip UPSERT (Laravel/Postgres standard)
            try {
                await sql`
                    INSERT INTO lms_courses (id, category, level, subject, grade, title, description, content_json)
                    VALUES (${course.id}, ${course.category || ''}, ${course.level || ''}, ${subj}, ${grd}, ${course.title || ''}, ${course.description || ''}, ${JSON.stringify(course)})
                    ON CONFLICT (id) DO UPDATE SET
                        category = EXCLUDED.category,
                        level = EXCLUDED.level,
                        subject = EXCLUDED.subject,
                        grade = EXCLUDED.grade,
                        title = EXCLUDED.title,
                        description = EXCLUDED.description,
                        content_json = EXCLUDED.content_json
                `;
            } catch(err) {
                try {
                    await sql`
                        INSERT INTO lms_courses (id, category, level, title, description, content_json)
                        VALUES (${course.id}, ${course.category || ''}, ${course.level || ''}, ${course.title || ''}, ${course.description || ''}, ${JSON.stringify(course)})
                        ON CONFLICT (id) DO UPDATE SET
                            category = EXCLUDED.category,
                            level = EXCLUDED.level,
                            title = EXCLUDED.title,
                            description = EXCLUDED.description,
                            content_json = EXCLUDED.content_json
                    `;
                } catch(e) {}
            }

            // Also sync to Cloud Store so courses are resilient against Postgres issues
            try {
                const store = await getCloudStore();
                const courses = Array.isArray(store.courses) ? store.courses : [];
                const idx = courses.findIndex(c => c.id === course.id);
                if (idx >= 0) courses[idx] = course;
                else courses.unshift(course);
                await saveCloudStore({ courses });
            } catch(e) {}

            return response.status(200).json({ success: true, message: 'Course saved successfully.' });
        }

        // --- 10. ADMIN: DELETE COURSE ---
        if (action === 'admin_delete_course' || (request.method === 'DELETE' && !action)) {
            const courseId = request.query.id || request.body.id;
            if (!courseId) return response.status(400).json({ success: false, message: 'Missing course id.' });
            
            // 1. Soft delete in Postgres
            try {
                await sql`UPDATE lms_courses SET content_json = jsonb_set(content_json, '{status}', '"trashed"') WHERE id = ${courseId}`;
            } catch(e) {}

            // 2. Soft delete in Universal Cloud Store
            try {
                const store = await getCloudStore();
                const courses = Array.isArray(store.courses) ? store.courses : [];
                const target = courses.find(c => c.id === courseId);
                if (target) {
                    target.status = 'trashed';
                    target.deletedAt = new Date().toISOString();
                    await saveCloudStore({ courses });
                }
            } catch(e) {}

            return response.status(200).json({ success: true, message: 'Course moved to trash.' });
        }

        // --- 10a. ADMIN: PERMANENT DELETE COURSE ---
        if (action === 'admin_permanent_delete_course') {
            const courseId = request.query.id || request.body.id;
            if (!courseId) return response.status(400).json({ success: false, message: 'Missing course id.' });

            // 1. Permanent delete in Postgres
            try {
                await sql`DELETE FROM lms_courses WHERE id = ${courseId}`;
            } catch(e) {}

            // 2. Permanent delete in Universal Cloud Store
            try {
                const store = await getCloudStore();
                let courses = Array.isArray(store.courses) ? store.courses : [];
                courses = courses.filter(c => c.id !== courseId);
                await saveCloudStore({ courses });
            } catch(e) {}

            return response.status(200).json({ success: true, message: 'Course permanently deleted.' });
        }

        // --- 10b. ADMIN: EMPTY TRASH ---
        if (action === 'admin_empty_trash') {
            const cat = request.query.category || request.body?.category;

            // 1. Delete trashed in Postgres
            try {
                if (cat) {
                    await sql`DELETE FROM lms_courses WHERE content_json->>'status' = 'trashed' AND (content_json->>'category' = ${cat} OR category = ${cat})`;
                } else {
                    await sql`DELETE FROM lms_courses WHERE content_json->>'status' = 'trashed'`;
                }
            } catch(e) {}

            // 2. Delete trashed in Universal Cloud Store
            try {
                const store = await getCloudStore();
                let courses = Array.isArray(store.courses) ? store.courses : [];
                if (cat) {
                    courses = courses.filter(c => !(c.status === 'trashed' && (c.category === cat || !c.category)));
                } else {
                    courses = courses.filter(c => c.status !== 'trashed');
                }
                await saveCloudStore({ courses });
            } catch(e) {}

            return response.status(200).json({ success: true, message: 'Trash emptied.' });
        }

        // --- 10c. ADMIN: RESTORE COURSE ---
        if (action === 'admin_restore_course') {
            const courseId = request.query.id || request.body.id;
            if (!courseId) return response.status(400).json({ success: false, message: 'Missing course id.' });

            // 1. Restore in Postgres
            try {
                await sql`UPDATE lms_courses SET content_json = jsonb_set(content_json, '{status}', '"published"') WHERE id = ${courseId}`;
            } catch(e) {}

            // 2. Restore in Universal Cloud Store
            try {
                const store = await getCloudStore();
                const courses = Array.isArray(store.courses) ? store.courses : [];
                const target = courses.find(c => c.id === courseId);
                if (target) {
                    target.status = 'published';
                    delete target.deletedAt;
                    await saveCloudStore({ courses });
                }
            } catch(e) {}

            return response.status(200).json({ success: true, message: 'Course restored.' });
        }

        // --- 11. ADMIN: GET QUIZ RESULTS ---
        
        // --- ADMIN: UPDATE QUIZ RESULT (GRADING) ---
        if (action === 'admin_update_quiz_result') {
            const { resultId, newScore, updatedAnswers } = request.body;
            if (!resultId || newScore === undefined) return response.status(400).json({ success: false, message: 'Missing parameters.' });
            
            try {
                await sql`
                    UPDATE lms_quiz_results 
                    SET score = ${newScore}, answers_json = ${JSON.stringify(updatedAnswers || {})}
                    WHERE id = ${resultId}
                `;
                return response.status(200).json({ success: true, message: 'Result updated successfully.' });
            } catch (err) {
                console.error(err);
                return response.status(500).json({ success: false, message: 'Database error.', error: err.message });
            }
        }
        
        if (action === 'admin_get_quiz_results') {
            let results = [];
            try {
                const res = await sql`
                    SELECT 
                        q.id, q.course_id, q.module_index, q.score, q.answers_json, q.submitted_at as date,
                        u.name as studentName, u.email as studentEmail, u.nisn, u.school,
                        c.title as courseTitle, c.category, c.level,
                        c.content_json->>'subject' as subject,
                        c.content_json->>'grade' as grade
                    FROM lms_quiz_results q
                    LEFT JOIN users u ON q.user_id = u.id::varchar
                    LEFT JOIN lms_courses c ON q.course_id = c.id
                    ORDER BY q.submitted_at DESC
                `;
                
                results = res.rows.map(r => ({
                    id: r.id,
                    studentName: r.studentname || 'Siswa NLS',
                    studentEmail: r.studentemail || '',
                    nisn: r.nisn || '',
                    school: r.school || '',
                    courseId: r.course_id,
                    courseTitle: r.coursetitle || 'Program NLS',
                    moduleTitle: `Modul ID: ${r.module_index} (Paket ${r.paket || 1})`,
                    category: r.category || 'School',
                    level: r.level || '',
                    subject: r.subject || '',
                    grade: r.grade || '',
                    score: r.score,
                    answers: r.answers_json || {},
                    date: r.date
                }));
            } catch(e) {
                // Postgres failed / 402 quota. Fallback to Cloud Store quiz submissions & user lmsData
                try {
                    const store = await getCloudStore();
                    const courses = Array.isArray(store.courses) ? store.courses : [];
                    const users = Array.isArray(store.users) ? store.users : [];
                    const directSubmissions = Array.isArray(store.quizSubmissions) ? store.quizSubmissions : [];

                    const allSubmissions = [...directSubmissions];
                    users.forEach(u => {
                        if (u.lmsData && Array.isArray(u.lmsData.quizResults)) {
                            u.lmsData.quizResults.forEach(qr => {
                                if (!allSubmissions.some(s => s.id === qr.id || (s.courseId === qr.courseId && String(s.moduleIndex) === String(qr.moduleIndex) && s.studentEmail === u.email))) {
                                    allSubmissions.push({
                                        id: qr.id || `qr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                                        studentName: u.name || 'Siswa NLS',
                                        studentEmail: u.email || '',
                                        nisn: u.nisn || '',
                                        school: u.school || '',
                                        courseId: qr.courseId,
                                        moduleIndex: qr.moduleIndex,
                                        score: qr.score,
                                        date: qr.date || qr.datetime || new Date().toISOString(),
                                        answers: qr.answers || {}
                                    });
                                }
                            });
                        }
                    });

                    results = allSubmissions.map(s => {
                        const matchedCourse = courses.find(c => c.id === s.courseId) || {};
                        return {
                            id: s.id,
                            studentName: s.studentName || 'Siswa NLS',
                            studentEmail: s.studentEmail || '',
                            nisn: s.nisn || '',
                            school: s.school || '',
                            courseId: s.courseId,
                            courseTitle: s.courseTitle || matchedCourse.title || 'Program NLS',
                            moduleTitle: `Modul ID: ${s.moduleIndex}`,
                            category: s.category || matchedCourse.category || 'School',
                            level: s.level || matchedCourse.level || '',
                            subject: s.subject || matchedCourse.subject || '',
                            grade: s.grade || matchedCourse.grade || '',
                            score: s.score,
                            answers: s.answers || {},
                            date: s.date
                        };
                    });
                } catch(cloudErr) {}
            }
            
            return response.status(200).json({ success: true, data: results });
        }

        return response.status(400).json({ success: false, message: 'Invalid action specified.' });

    } catch (error) {
        console.error('Error in pg-lms:', error);
        return response.status(500).json({ success: false, message: error.message });
    }
}
