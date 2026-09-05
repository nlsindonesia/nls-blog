import { getCloudStore, saveCloudStore } from './cloud-db.js';
import { generateVpsSqlDump } from '../lib/vps-exporter.js';
import { fetchExternalProblem } from '../lib/oj-crawler.js';
import { translateTextPreservingMath } from '../lib/translate.js';

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
    // Enable CORS for all origins
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
        let body = request.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const action = request.method === 'POST' ? (body?.action || request.query?.action) : request.query?.action;

        // --- 0. EXPORT VPS SQL (1-Click Database Dump for Migration) ---
        if (action === 'export_vps_sql') {
            const sqlDump = await generateVpsSqlDump();
            if (request.query?.format === 'json') {
                return response.status(200).json({ success: true, sql: sqlDump });
            }
            response.setHeader('Content-Type', 'text/plain; charset=utf-8');
            response.setHeader('Content-Disposition', 'attachment; filename="vps_migration.sql"');
            return response.status(200).send(sqlDump);
        }

        // --- 0.5. VJUDGE ONLINE JUDGE PROBLEM FETCHER & PARSER ---
        if (action === 'fetch_external_problem') {
            try {
                const params = body || request.query || {};
                const result = await fetchExternalProblem(params);
                return response.status(200).json({ success: true, problem: result });
            } catch (err) {
                return response.status(400).json({ success: false, message: err.message || 'Gagal mengambil soal dari Online Judge.' });
            }
        }

        // --- 0.6. VJUDGE / CP PROBLEM TRANSLATOR (EN -> ID) ---
        if (action === 'translate_problem' || (!action && (body?.segments || body?.description || body?.text))) {
            try {
                const params = body || request.query || {};
                const sourceLang = params.sourceLang || 'en';
                const targetLang = params.targetLang || 'id';

                const segs = params.segments || (params.description ? {
                    title: params.title,
                    description: params.description,
                    inputFormat: params.inputFormat,
                    outputFormat: params.outputFormat,
                    constraints: params.constraints,
                    editorial: params.editorial
                } : null);

                if (segs && typeof segs === 'object') {
                    const { title, description, inputFormat, outputFormat, constraints, editorial } = segs;
                    const [
                        transTitle,
                        transDesc,
                        transInput,
                        transOutput,
                        transConstraints,
                        transEditorial
                    ] = await Promise.all([
                        title ? translateTextPreservingMath(title, sourceLang, targetLang) : Promise.resolve(''),
                        description ? translateTextPreservingMath(description, sourceLang, targetLang) : Promise.resolve(''),
                        inputFormat ? translateTextPreservingMath(inputFormat, sourceLang, targetLang) : Promise.resolve(''),
                        outputFormat ? translateTextPreservingMath(outputFormat, sourceLang, targetLang) : Promise.resolve(''),
                        constraints ? translateTextPreservingMath(constraints, sourceLang, targetLang) : Promise.resolve(''),
                        editorial ? translateTextPreservingMath(editorial, sourceLang, targetLang) : Promise.resolve('')
                    ]);

                    const resultSegments = {
                        title: transTitle || title || '',
                        description: transDesc || description || '',
                        inputFormat: transInput || inputFormat || '',
                        outputFormat: transOutput || outputFormat || '',
                        constraints: transConstraints || constraints || '',
                        editorial: transEditorial || editorial || ''
                    };

                    return response.status(200).json({
                        success: true,
                        sourceLang,
                        targetLang,
                        segments: resultSegments,
                        ...resultSegments
                    });
                }

                if (params.text) {
                    const translated = await translateTextPreservingMath(params.text, sourceLang, targetLang);
                    return response.status(200).json({ success: true, sourceLang, targetLang, translated });
                }

                return response.status(400).json({ success: false, message: 'Parameter teks terjemahan tidak valid.' });
            } catch (err) {
                return response.status(500).json({ success: false, message: err.message || 'Gagal menerjemahkan teks soal.' });
            }
        }

        // --- 1. SETUP LMS TABLES / STATUS ---
        if (action === 'setup_lms') {
            return response.status(200).json({ 
                success: true, 
                mode: 'Universal Cloud DB',
                message: 'LMS Cloud Database active. Vercel Postgres completely decoupled.' 
            });
        }

        // --- 2. IMPORT DEFAULT COURSES ---
        if (action === 'import_courses') {
            const store = await getCloudStore();
            let courses = Array.isArray(store.courses) ? store.courses : [];
            let importedCount = 0;
            for (const course of defaultCourses) {
                if (!courses.some(c => c.id === course.id)) {
                    courses.push(course);
                    importedCount++;
                }
            }
            if (importedCount > 0) {
                await saveCloudStore({ courses });
            }
            return response.status(200).json({ success: true, message: `Successfully verified/imported ${defaultCourses.length} courses. (${importedCount} new)` });
        }

        // --- 3. GET COURSES CATALOG (100% Cloud DB) ---
        if (action === 'get_courses') {
            const { category, level, targetCourseId, targetPassword, full } = request.body || request.query || {};

            // A. Single course requested (e.g. LMS player)
            if (targetCourseId) {
                response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                response.setHeader('Pragma', 'no-cache');
                response.setHeader('Expires', '0');

                let course = null;
                
                // 1. Check Cloud Store (newest custom courses and edits)
                try {
                    const store = await getCloudStore();
                    if (Array.isArray(store.courses)) {
                        course = store.courses.find(c => c && c.id === targetCourseId);
                    }
                } catch(e) {}

                // 2. Check defaultCourses
                if (!course) {
                    course = defaultCourses.find(c => c.id === targetCourseId);
                }

                if (!course) {
                    return response.status(404).json({ success: false, message: 'Course not found.' });
                }

                // Deep copy so we don't mutate cache
                course = JSON.parse(JSON.stringify(course));

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

            // B. Public Catalog Listing
            if (request.method === 'GET') {
                response.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
                response.setHeader('Vary', 'Accept-Encoding');
            }

            const wantFull = full === true || full === 'true';
            const store = await getCloudStore();
            const cloudCourses = Array.isArray(store.courses) ? store.courses : [];

            // Combine defaultCourses with cloudCourses (cloudCourses takes priority)
            const courseMap = new Map();
            defaultCourses.forEach(c => { if (c && c.id) courseMap.set(c.id, c); });
            cloudCourses.forEach(c => {
                if (c && c.id) {
                    courseMap.set(c.id, c);
                }
            });

            let list = Array.from(courseMap.values())
                .filter(c => c && c.status !== 'draft' && c.status !== 'trashed' && c.visibility !== 'private');

            if (category && level) {
                list = list.filter(c => c.category && c.category.toLowerCase() === category.toLowerCase() && c.level && c.level.toLowerCase() === level.toLowerCase());
            } else if (category) {
                list = list.filter(c => c.category && c.category.toLowerCase() === category.toLowerCase());
            } else if (level) {
                list = list.filter(c => c.level && c.level.toLowerCase() === level.toLowerCase());
            }

            const processedList = list.map(c => {
                let copy = { ...c };
                delete copy.password;
                if (copy.visibility === 'password_protected') {
                    copy.isLocked = true;
                    copy.modules = [];
                    copy.babs = [];
                    copy.content = [];
                }
                if (!wantFull) {
                    const { modules, babs, content, ...summary } = copy;
                    return summary;
                }
                return copy;
            });

            return response.status(200).json({ success: true, data: processedList });
        }

        // --- 4. GET LMS DATA (User Progress & Quiz History) ---
        if (action === 'get_lms_data') {
            const { userId, email, username, name } = request.body || request.query || {};
            const uid = userId || request.body?.userId || request.query?.userId || email || username || name || '';
            if (!uid) return response.status(400).json({ success: false, message: 'User ID is required.' });

            const userList = [String(uid).trim()];
            if (email && !userList.includes(String(email).trim())) userList.push(String(email).trim());
            if (username && !userList.includes(String(username).trim())) userList.push(String(username).trim());
            if (name && !userList.includes(String(name).trim())) userList.push(String(name).trim());

            // Resilience alias expansion
            const lowerList = userList.map(u => u.toLowerCase());
            if (lowerList.some(u => u.includes('mama') || u.includes('maman'))) {
                ['mama', 'maman', 'maman5', 'maman@gmail.com', 'usr-1788068718590'].forEach(alias => {
                    if (!userList.includes(alias)) userList.push(alias);
                });
            }

            const store = await getCloudStore();
            const users = Array.isArray(store.users) ? store.users : [];
            const searchKeys = userList.map(k => String(k).toLowerCase());

            const targetUser = users.find(u => {
                if (!u) return false;
                const uId = String(u.id || '').toLowerCase();
                const uEmail = String(u.email || '').toLowerCase();
                const uName = String(u.name || '').toLowerCase();
                const uUsername = String(u.username || '').toLowerCase();
                return searchKeys.includes(uId) || searchKeys.includes(uEmail) || searchKeys.includes(uName) || searchKeys.includes(uUsername);
            });

            let enrolledIds = [];
            let quizResults = [];
            let progressMap = {};
            let cpSubmissions = [];
            let cpDrafts = {};

            if (targetUser && targetUser.lmsData) {
                enrolledIds = Array.isArray(targetUser.lmsData.enrolledIds) ? [...targetUser.lmsData.enrolledIds] : [];
                progressMap = targetUser.lmsData.progressMap || {};
                cpSubmissions = Array.isArray(targetUser.lmsData.cpSubmissions) ? [...targetUser.lmsData.cpSubmissions] : [];
                cpDrafts = targetUser.lmsData.cpDrafts || {};
                if (Array.isArray(targetUser.lmsData.quizResults)) {
                    quizResults = targetUser.lmsData.quizResults.map(q => ({
                        ...q,
                        isGraded: !!(q.answers && q.answers._meta && q.answers._meta.gradedScores),
                        date: q.date ? new Date(q.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
                        datetime: q.date ? new Date(q.date).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
                    }));
                }
            }

            // Also check direct submissions in Cloud DB
            const directSubmissions = Array.isArray(store.quizSubmissions) ? store.quizSubmissions : [];
            directSubmissions.forEach(ds => {
                const isMatch = searchKeys.includes(String(ds.userId || '').toLowerCase()) || 
                                searchKeys.includes(String(ds.studentEmail || '').toLowerCase());
                if (isMatch && !quizResults.some(q => q.id === ds.id)) {
                    quizResults.push({
                        ...ds,
                        isGraded: !!(ds.answers && ds.answers._meta && ds.answers._meta.gradedScores),
                        date: ds.date ? new Date(ds.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
                        datetime: ds.date ? new Date(ds.date).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
                    });
                }
            });

            return response.status(200).json({ 
                success: true, 
                lmsData: {
                    enrolledIds: Array.from(new Set(enrolledIds)),
                    quizResults,
                    progressMap,
                    cpSubmissions,
                    cpDrafts
                }
            });
        }

        // --- 5. ENROLL COURSE (100% Cloud DB) ---
        if (action === 'enroll') {
            const { userId, email, username, courseId } = request.body || {};
            const finalUserId = userId || email || username;
            if (!finalUserId || !courseId) return response.status(400).json({ success: false, message: 'Missing userId or courseId.' });

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
                if (!targetUser.lmsData) targetUser.lmsData = { enrolledIds: [], quizResults: [], progressMap: {} };
                if (!Array.isArray(targetUser.lmsData.enrolledIds)) targetUser.lmsData.enrolledIds = [];
                if (!targetUser.lmsData.enrolledIds.includes(courseId)) {
                    targetUser.lmsData.enrolledIds.push(courseId);
                    targetUser.updatedAt = new Date().toISOString();
                    await saveCloudStore({ users });
                }
            }
            
            return response.status(200).json({ success: true, message: 'Enrolled successfully.' });
        }

        // --- 6. UPDATE PROGRESS (100% Cloud DB) ---
        if (action === 'update_progress') {
            const { userId, courseId, progress, completedModules } = request.body;
            if (!userId || !courseId) return response.status(400).json({ success: false, message: 'Missing userId or courseId.' });

            const store = await getCloudStore();
            const users = Array.isArray(store.users) ? store.users : [];
            const uid = String(userId).toLowerCase();
            const targetUser = users.find(u => 
                (u.id && String(u.id).toLowerCase() === uid) ||
                (u.email && u.email.toLowerCase() === uid) ||
                (u.username && u.username.toLowerCase() === uid)
            );

            if (targetUser) {
                if (!targetUser.lmsData) targetUser.lmsData = { enrolledIds: [], quizResults: [], progressMap: {} };
                if (!targetUser.lmsData.progressMap) targetUser.lmsData.progressMap = {};
                targetUser.lmsData.progressMap[courseId] = {
                    progress: progress || 0,
                    completedModules: completedModules || [],
                    lastAccessed: new Date().toISOString()
                };
                targetUser.updatedAt = new Date().toISOString();
                await saveCloudStore({ users });
            }
            
            return response.status(200).json({ success: true, message: 'Progress updated.' });
        }

        // --- 6B. SAVE PROGRAMMING SUBMISSION (100% Cloud DB per Student) ---
        if (action === 'save_cp_submission') {
            const { userId, courseId, moduleId, submission, code, language } = request.body || {};
            const uid = userId || request.body?.studentId || '';
            if (!uid || !submission) {
                return response.status(400).json({ success: false, message: 'Missing userId or submission data.' });
            }

            const store = await getCloudStore();
            const users = Array.isArray(store.users) ? store.users : [];
            const searchKey = String(uid).toLowerCase();

            let targetUser = users.find(u => {
                if (!u) return false;
                return (u.id && String(u.id).toLowerCase() === searchKey) ||
                       (u.email && u.email.toLowerCase() === searchKey) ||
                       (u.username && u.username.toLowerCase() === searchKey);
            });

            if (targetUser) {
                if (!targetUser.lmsData) targetUser.lmsData = { enrolledIds: [], quizResults: [], progressMap: {} };
                if (!Array.isArray(targetUser.lmsData.cpSubmissions)) targetUser.lmsData.cpSubmissions = [];
                if (!targetUser.lmsData.cpDrafts) targetUser.lmsData.cpDrafts = {};

                // Simpan ke riwayat submisi unik akun siswa
                // Simpan ke riwayat submisi unik akun siswa (hemat kuota cloud bin: max 30 item)
                targetUser.lmsData.cpSubmissions.unshift(submission);
                if (targetUser.lmsData.cpSubmissions.length > 30) {
                    targetUser.lmsData.cpSubmissions = targetUser.lmsData.cpSubmissions.slice(0, 30);
                }

                // Update draft kodingan terakhir jika ada
                if (code && moduleId && language) {
                    const draftKey = `${courseId || 'course'}_${moduleId}_${language}`;
                    targetUser.lmsData.cpDrafts[draftKey] = {
                        code: code,
                        language: language,
                        updatedAt: new Date().toISOString()
                    };
                }

                targetUser.updatedAt = new Date().toISOString();
                await saveCloudStore({ users });
                return response.status(200).json({ success: true, message: 'Submisi berhasil tersimpan di akun siswa.' });
            }

            return response.status(200).json({ success: true, message: 'Submisi diproses lokal.' });
        }

        // --- 6C. SAVE PROGRAMMING DRAFT CODE (100% Cloud DB per Student) ---
        if (action === 'save_cp_draft') {
            const { userId, courseId, moduleId, language, code } = request.body || {};
            const uid = userId || '';
            if (!uid || !moduleId || !code) {
                return response.status(400).json({ success: false, message: 'Missing required draft fields.' });
            }

            const store = await getCloudStore();
            const users = Array.isArray(store.users) ? store.users : [];
            const searchKey = String(uid).toLowerCase();

            let targetUser = users.find(u => {
                if (!u) return false;
                return (u.id && String(u.id).toLowerCase() === searchKey) ||
                       (u.email && u.email.toLowerCase() === searchKey) ||
                       (u.username && u.username.toLowerCase() === searchKey);
            });

            if (targetUser) {
                if (!targetUser.lmsData) targetUser.lmsData = { enrolledIds: [], quizResults: [], progressMap: {} };
                if (!targetUser.lmsData.cpDrafts) targetUser.lmsData.cpDrafts = {};

                const draftKey = `${courseId || 'course'}_${moduleId}_${language || 'cpp'}`;
                
                // Hemat Kuota: Jangan panggil saveCloudStore jika kodingan tidak berubah sama sekali!
                if (targetUser.lmsData.cpDrafts[draftKey] && targetUser.lmsData.cpDrafts[draftKey].code === code) {
                    return response.status(200).json({ success: true, unchanged: true });
                }

                targetUser.lmsData.cpDrafts[draftKey] = {
                    code: code,
                    language: language,
                    updatedAt: new Date().toISOString()
                };

                targetUser.updatedAt = new Date().toISOString();
                await saveCloudStore({ users });
                return response.status(200).json({ success: true });
            }

            return response.status(200).json({ success: true });
        }

        // --- 7. SUBMIT QUIZ (100% Cloud DB) ---
        if (action === 'submit_quiz') {
            const { userId, courseId, moduleIndex, moduleId, score, answers, paket } = request.body;
            if (!userId || !courseId || score === undefined) return response.status(400).json({ success: false, message: 'Missing required quiz data.' });

            const store = await getCloudStore();
            const users = Array.isArray(store.users) ? store.users : [];
            const courses = Array.isArray(store.courses) ? store.courses : [];
            const u = users.find(user => String(user.id) === String(userId) || String(user.email) === String(userId) || String(user.username) === String(userId));
            const c = courses.find(crs => crs.id === courseId) || defaultCourses.find(crs => crs.id === courseId);

            const submissionId = `qr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            const newSubmission = {
                id: submissionId,
                userId: userId,
                studentName: u ? u.name : 'Siswa NLS',
                studentEmail: u ? u.email : '',
                nisn: u ? u.nisn : '',
                school: u ? u.school : '',
                courseId: courseId,
                courseTitle: c ? c.title : 'Program NLS',
                moduleIndex: moduleIndex,
                score: Number(score),
                paket: paket || 1,
                answers: answers || {},
                date: new Date().toISOString()
            };

            let quizSubmissions = Array.isArray(store.quizSubmissions) ? store.quizSubmissions : [];
            quizSubmissions.unshift(newSubmission);

            if (u) {
                if (!u.lmsData) u.lmsData = { enrolledIds: [], quizResults: [] };
                if (!Array.isArray(u.lmsData.quizResults)) u.lmsData.quizResults = [];
                u.lmsData.quizResults.unshift({
                    id: submissionId,
                    courseId: courseId,
                    moduleIndex: moduleIndex,
                    score: Number(score),
                    paket: paket || 1,
                    answers: answers || {},
                    date: new Date().toISOString()
                });
            }

            let quizAttempts = Array.isArray(store.quizAttempts) ? store.quizAttempts : [];
            if (moduleId) {
                const att = quizAttempts.find(a => a.user_id === userId && a.course_id === courseId && a.module_id === moduleId);
                if (att) {
                    att.status = 'submitted';
                    att.last_saved_at = new Date().toISOString();
                }
            }

            await saveCloudStore({ quizSubmissions, users, quizAttempts });

            return response.status(200).json({ success: true, message: 'Quiz submitted.', id: submissionId });
        }

        // --- 7.a. GET QUIZ PROGRESS (100% Cloud DB) ---
        if (action === 'get_quiz_progress') {
            const { userId, courseId, moduleId } = request.body || request.query || {};
            if (!userId || !courseId || !moduleId) return response.status(400).json({ success: false, message: 'Missing parameters.' });

            const store = await getCloudStore();
            const attempts = Array.isArray(store.quizAttempts) ? store.quizAttempts : [];
            const attempt = attempts.find(a => a.user_id === userId && a.course_id === courseId && a.module_id === moduleId) || null;

            return response.status(200).json({ success: true, attempt: attempt, server_now: new Date().toISOString() });
        }

        // --- 7.b. START OR SAVE QUIZ PROGRESS (100% Cloud DB) ---
        if (action === 'save_quiz_progress') {
            const { userId, courseId, moduleId, elapsedSeconds, answers, isReset } = request.body;
            if (!userId || !courseId || !moduleId) return response.status(400).json({ success: false, message: 'Missing parameters.' });

            const store = await getCloudStore();
            let attempts = Array.isArray(store.quizAttempts) ? store.quizAttempts : [];
            let attempt = attempts.find(a => a.user_id === userId && a.course_id === courseId && a.module_id === moduleId);
            const now = new Date().toISOString();

            if (!attempt) {
                attempt = {
                    id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                    user_id: userId,
                    course_id: courseId,
                    module_id: moduleId,
                    elapsed_seconds: elapsedSeconds || 0,
                    answers_json: answers || {},
                    status: 'in_progress',
                    started_at: now,
                    last_saved_at: now
                };
                attempts.push(attempt);
            } else {
                attempt.elapsed_seconds = elapsedSeconds || 0;
                attempt.answers_json = answers || {};
                attempt.last_saved_at = now;
                attempt.status = 'in_progress';
                if (isReset) attempt.started_at = now;
            }

            await saveCloudStore({ quizAttempts: attempts });

            return response.status(200).json({ success: true, message: 'Progress saved.' });
        }

        // --- 8. ADMIN: GET ALL COURSES (100% Cloud DB) ---
        if (action === 'admin_get_courses' || (!action && request.method === 'GET' && request.url.includes('/api/pg-lms'))) {
            response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            response.setHeader('Pragma', 'no-cache');
            response.setHeader('Expires', '0');

            const store = await getCloudStore();
            const cloudCourses = Array.isArray(store.courses) ? store.courses : [];

            const courseMap = new Map();
            // 1. Default boilerplate courses
            defaultCourses.forEach(c => { if (c && c.id) courseMap.set(c.id, c); });
            // 2. Cloud Store courses (custom user courses and newest updates take priority)
            cloudCourses.forEach(c => { 
                if (c && c.id) {
                    const existing = courseMap.get(c.id);
                    if (!existing) {
                        courseMap.set(c.id, c);
                    } else {
                        const dateC = new Date(c.updated_at || c.created_at || 0).getTime();
                        const dateEx = new Date(existing.updated_at || existing.created_at || 0).getTime();
                        const cHasBabs = (c.babs && c.babs.length > 0) || (c.modules && c.modules.length > 0);
                        const exHasBabs = (existing.babs && existing.babs.length > 0) || (existing.modules && existing.modules.length > 0);
                        if (dateC >= dateEx || (cHasBabs && !exHasBabs)) {
                            courseMap.set(c.id, c);
                        }
                    }
                }
            });

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

        // --- 9. ADMIN: SAVE COURSE (100% Cloud DB) ---
        if (action === 'admin_save_course' || request.method === 'PUT') {
            let course = request.body.course || request.body;
            if (!course || !course.id) return response.status(400).json({ success: false, message: 'Invalid course data.' });

            if (!course.updated_at) {
                course.updated_at = new Date().toISOString();
            }

            // Clean up duplicate trees to prevent 413 Payload Too Large
            if (course.babs) {
                delete course.content;
                delete course.modules;
            }

            // Persist to Universal Cloud Store directly
            const store = await getCloudStore();
            const courses = Array.isArray(store.courses) ? store.courses : [];
            const idx = courses.findIndex(c => c.id === course.id);
            if (idx >= 0) courses[idx] = course;
            else courses.unshift(course);
            
            const saved = await saveCloudStore({ courses });
            if (!saved) {
                return response.status(500).json({ success: false, message: 'Gagal menyimpan ke Cloud Database.' });
            }

            return response.status(200).json({ success: true, message: 'Course saved successfully.', updated_at: course.updated_at });
        }

        // --- 10. ADMIN: DELETE COURSE ---
        if (action === 'admin_delete_course' || (request.method === 'DELETE' && !action)) {
            const courseId = request.query.id || request.body.id;
            if (!courseId) return response.status(400).json({ success: false, message: 'Missing course id.' });
            
            const store = await getCloudStore();
            const courses = Array.isArray(store.courses) ? store.courses : [];
            const target = courses.find(c => c.id === courseId);
            if (target) {
                target.status = 'trashed';
                target.deletedAt = new Date().toISOString();
                await saveCloudStore({ courses });
            }

            return response.status(200).json({ success: true, message: 'Course moved to trash.' });
        }

        // --- 10a. ADMIN: PERMANENT DELETE COURSE ---
        if (action === 'admin_permanent_delete_course') {
            const courseId = request.query.id || request.body.id;
            if (!courseId) return response.status(400).json({ success: false, message: 'Missing course id.' });

            const store = await getCloudStore();
            let courses = Array.isArray(store.courses) ? store.courses : [];
            courses = courses.filter(c => c.id !== courseId);
            await saveCloudStore({ courses });

            return response.status(200).json({ success: true, message: 'Course permanently deleted.' });
        }

        // --- 10b. ADMIN: EMPTY TRASH ---
        if (action === 'admin_empty_trash') {
            const cat = request.query.category || request.body?.category;

            const store = await getCloudStore();
            let courses = Array.isArray(store.courses) ? store.courses : [];
            if (cat) {
                courses = courses.filter(c => !(c.status === 'trashed' && (c.category === cat || !c.category)));
            } else {
                courses = courses.filter(c => c.status !== 'trashed');
            }
            await saveCloudStore({ courses });

            return response.status(200).json({ success: true, message: 'Trash emptied.' });
        }

        // --- 10c. ADMIN: RESTORE COURSE ---
        if (action === 'admin_restore_course') {
            const courseId = request.query.id || request.body.id;
            if (!courseId) return response.status(400).json({ success: false, message: 'Missing course id.' });

            const store = await getCloudStore();
            const courses = Array.isArray(store.courses) ? store.courses : [];
            const target = courses.find(c => c.id === courseId);
            if (target) {
                target.status = 'published';
                delete target.deletedAt;
                await saveCloudStore({ courses });
            }

            return response.status(200).json({ success: true, message: 'Course restored.' });
        }

        // --- 11. ADMIN: GET QUIZ RESULTS & UPDATE QUIZ RESULT (GRADING) ---
        if (action === 'admin_update_quiz_result') {
            const { resultId, newScore, updatedAnswers } = request.body;
            if (!resultId || newScore === undefined) return response.status(400).json({ success: false, message: 'Missing parameters.' });
            
            const store = await getCloudStore();
            const quizSubmissions = Array.isArray(store.quizSubmissions) ? store.quizSubmissions : [];
            const target = quizSubmissions.find(q => q.id === resultId);
            if (target) {
                target.score = Number(newScore);
                if (updatedAnswers) target.answers = updatedAnswers;
                target.updatedAt = new Date().toISOString();
            }

            // Also check users lmsData
            const users = Array.isArray(store.users) ? store.users : [];
            users.forEach(u => {
                if (u.lmsData && Array.isArray(u.lmsData.quizResults)) {
                    const uTarget = u.lmsData.quizResults.find(q => q.id === resultId);
                    if (uTarget) {
                        uTarget.score = Number(newScore);
                        if (updatedAnswers) uTarget.answers = updatedAnswers;
                        uTarget.updatedAt = new Date().toISOString();
                    }
                }
            });

            await saveCloudStore({ quizSubmissions, users });

            return response.status(200).json({ success: true, message: 'Result updated successfully.' });
        }
        
        if (action === 'admin_get_quiz_results') {
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

            const results = allSubmissions.map(s => {
                const matchedCourse = courses.find(c => c.id === s.courseId) || defaultCourses.find(c => c.id === s.courseId) || {};
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
            
            return response.status(200).json({ success: true, data: results });
        }

        return response.status(400).json({ success: false, message: 'Invalid action specified.' });

    } catch (error) {
        console.error('Error in pg-lms:', error);
        return response.status(500).json({ success: false, message: error.message });
    }
}
