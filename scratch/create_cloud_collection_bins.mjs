import fs from 'fs';
import https from 'https';

console.log('====================================================');
console.log('CREATING DEDICATED CLOUD DB BINS FOR ALL COLLECTIONS');
console.log('====================================================');

function httpsRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        req.on('error', reject);
        if (data) {
            req.write(typeof data === 'string' ? data : JSON.stringify(data));
        }
        req.end();
    });
}

async function createBin(initialData) {
    const res = await httpsRequest({
        hostname: 'extendsclass.com',
        path: '/api/json-storage/bin',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, initialData);
    if (res.status === 201 && res.data && res.data.id) {
        return { id: res.data.id, uri: res.data.uri };
    }
    throw new Error(`Failed to create bin: ${res.status} ${JSON.stringify(res.data)}`);
}

// 1. EXTRACT DATASETS
const mockWindow = {};
new Function('window', fs.readFileSync('kalender/default-events.js', 'utf8'))(mockWindow);
new Function('window', fs.readFileSync('blog/default-articles.js', 'utf8'))(mockWindow);
new Function('window', fs.readFileSync('pengajar/default-teachers.js', 'utf8'))(mockWindow);

// Users
const usersMap = new Map();
usersMap.set('usr-admin-1', {
    id: 'usr-admin-1',
    name: 'Super Administrator NLS',
    username: 'nlsindonesia',
    email: 'admin@next-level-study.com',
    phone: '085163070002',
    nisn: 'NIP: 198501012010011001',
    school: 'Next Level Study Headquarter',
    level: 'Staff',
    grade: 'Pimpinan & Tim IT',
    targetProgram: 'Manajemen Sistem NLS',
    role: 'super_admin',
    roleLabel: 'Super Admin',
    role_id: 'super_admin',
    status: 'Active',
    department: 'Direksi & Eksekutif',
    avatar: '/nls-logo-300.png',
    password: '@Maman123$',
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: new Date().toISOString(),
    lastLoginAt: '2026-08-29T21:00:00.000Z',
    lastLogin: '2026-08-29 21:00',
    permissions: ['all']
});

const staffUsers = [
    { id: 'usr-1', name: 'Handaka Lumu', username: 'handaka.superadmin', email: 'handaka@next-level-study.com', phone: '085163070002', role: 'super_admin', roleLabel: 'Super Admin', role_id: 'super_admin', status: 'Active', department: 'Direksi & Eksekutif', avatar: '/nls-logo-300.png', notes: 'Penanggung Jawab Utama Sistem Next Level Study', password: '@Maman123$', created_at: '2026-01-01T00:00:00.000Z' },
    { id: 'usr-2', name: 'Kak Raditya Pratama, M.Sc.', username: 'raditya.akademik', email: 'raditya@next-level-study.com', phone: '081286096600', role: 'staff', roleLabel: 'Admin Akademik', role_id: 'admin_akademik', status: 'Active', department: 'Divisi Kurikulum & Olimpiade', avatar: '/images/pengajar/mentor-1-math.jpg', notes: 'Koordinator Kalender Pembinaan OSN dan Simulasi UTBK', password: '@Maman123$', created_at: '2026-02-15T00:00:00.000Z' },
    { id: 'usr-3', name: 'Kak Dimas (Koordinator Pengajar)', username: 'dimas.tutor', email: 'dimas@next-level-study.com', phone: '08170100788', role: 'teacher', roleLabel: 'Koordinator Pengajar', role_id: 'koordinator_pengajar', status: 'Active', department: 'Divisi Pengajar & Mutu Pendidik', avatar: '/images/pengajar/mentor-6-senior-math.jpg', notes: 'Verifikator Seleksi Berkas dan Microteaching Guru', password: '@Maman123$', created_at: '2026-03-10T00:00:00.000Z' },
    { id: 'usr-4', name: 'Tim EduTech & Penulis CMS', username: 'edutech.editor', email: 'edutech@next-level-study.com', phone: '085810464960', role: 'staff', roleLabel: 'Content Editor', role_id: 'content_editor', status: 'Active', department: 'Divisi Media & Konten Edukasi', avatar: '/images/stitch/pillar-study.jpg', notes: 'Penyusun Artikel Berita, Silabus, dan Panduan Belajar', password: '@Maman123$', created_at: '2026-04-01T00:00:00.000Z' },
    { id: 'usr-5', name: 'Admin Pusat Layanan NLS', username: 'cs.pusat', email: 'cs@next-level-study.com', phone: '085163070002', role: 'staff', roleLabel: 'Customer Service', role_id: 'customer_service', status: 'Active', department: 'Layanan & Pendaftaran Siswa', avatar: '/nls-logo-300.png', notes: 'Pusat Informasi Hotline WhatsApp dan Konsultasi Bimbel', password: '@Maman123$', created_at: '2026-05-01T00:00:00.000Z' },
    { id: 'usr-student-1', name: 'Muhammad Faiz Al-Fatih', username: 'faiz.student', email: 'faiz.student@gmail.com', phone: '081234567890', nisn: '0081293412', school: 'SMA Negeri 1 Bekasi', level: 'SMA', grade: '12 SMA - IPA', targetProgram: 'Persiapan OSN & SNBT', role: 'student', roleLabel: 'Siswa', role_id: 'student', status: 'Active', department: 'Siswa Reguler', avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8' style='background-color:%23f1f5f9;padding:10%25'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E", password: '@Maman123$', created_at: '2026-02-15T10:30:00.000Z' },
    { id: 'usr-teacher-1', name: 'Dr. Hendra Wijaya, M.Sc.', username: 'hendra.wijaya', email: 'hendra.guru@next-level-study.com', phone: '081298765432', nisn: 'NIP: 198904122015021003', school: 'SMA Negeri 8 Jakarta & Tutor NLS', level: 'Guru', grade: 'Master Tutor OSN Fisika', targetProgram: 'Pelatihan Olimpiade Sains Nasional', role: 'teacher', roleLabel: 'Guru / Pengajar', role_id: 'teacher', status: 'Active', department: 'Divisi Kurikulum OSN', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', password: '@Maman123$', created_at: '2026-01-20T09:00:00.000Z' }
];

staffUsers.forEach(u => {
    usersMap.set(u.id, {
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        phone: u.phone,
        nisn: u.nisn || `NIP: 19900101${Math.floor(1000000000 + Math.random()*9000000000)}`,
        school: u.school || u.department || 'Next Level Study',
        level: u.level || 'Staff',
        grade: u.grade || u.department || 'Staff NLS',
        targetProgram: u.targetProgram || u.notes || 'Operasional NLS',
        role: u.role,
        roleLabel: u.roleLabel,
        role_id: u.role_id,
        status: u.status,
        department: u.department,
        avatar: u.avatar,
        password: u.password,
        createdAt: u.created_at,
        updatedAt: new Date().toISOString(),
        lastLoginAt: u.created_at,
        lastLogin: '2026-08-28 10:30',
        permissions: u.role === 'super_admin' ? ['all'] : [u.role_id]
    });
});

const rolePriority = { 'super_admin': 1, 'staff': 2, 'teacher': 3, 'student': 4 };
const sortedUsers = Array.from(usersMap.values()).sort((a, b) => {
    const rA = rolePriority[a.role] || 99;
    const rB = rolePriority[b.role] || 99;
    if (rA !== rB) return rA - rB;
    return (a.name || '').localeCompare(b.name || '');
});

// Events
const rawEvents = mockWindow.NLS_DEFAULT_EVENTS || [];
const sortedEvents = rawEvents.map(e => ({
    id: e.id,
    date: e.date,
    title: e.title,
    category: e.category,
    jenjang: e.jenjang,
    jenjangLabel: e.jenjangLabel,
    time: e.time,
    mode: e.mode,
    location: e.location,
    badgeText: e.badgeText,
    description: e.description,
    highlights: e.highlights || [],
    whatsappMessage: e.whatsappMessage || '',
    isTrashed: 0,
    createdAt: e.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
})).sort((a, b) => new Date(a.date) - new Date(b.date));

// Articles
const rawArticles = mockWindow.NLS_DEFAULT_ARTICLES || [];
const sortedArticles = rawArticles.map(a => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    category: a.category,
    categories: a.categories || [a.category],
    date: a.date,
    author: a.author,
    status: a.status || 'published',
    coverImage: a.coverImage,
    focusKeyword: a.focusKeyword || '',
    metaTitle: a.metaTitle || a.title,
    metaDescription: a.metaDescription || a.title,
    excerpt: a.metaDescription || a.title,
    content: a.content || '<p>' + (a.metaDescription || a.title) + '</p>',
    seoScore: a.seoScore || 90,
    isTrashed: 0,
    createdAt: a.createdAt || (a.date ? new Date(a.date).toISOString() : new Date().toISOString()),
    updatedAt: new Date().toISOString()
})).sort((a, b) => new Date(b.date) - new Date(a.date));

// Teachers
const rawTeachers = mockWindow.NLS_DEFAULT_TEACHERS || [];
const sortedTeachers = rawTeachers.map((t, idx) => ({
    id: t.id,
    name: t.name,
    shortName: t.shortName,
    photo: t.photo,
    education: t.education,
    categories: t.categories || [],
    jenjang: t.jenjang || [],
    jenjangLabel: t.jenjangLabel || '',
    subject: t.subject || '',
    subjects: t.subjects || [],
    kebutuhanPrivat: t.kebutuhanPrivat || '',
    philosophy: t.philosophy || '',
    highlights: t.highlights || [],
    sortOrder: idx + 1,
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
})).sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));

const teacherApplications = [
    {
        id: 'app-sample-1',
        nama: 'Aulia Rahma, S.Pd.',
        name: 'Aulia Rahma, S.Pd.',
        email: 'aulia.rahma@gmail.com',
        phone: '081234567891',
        wa: '081234567891',
        bidang: 'Matematika SMA & Olimpiade',
        pendidikan: 'S1 Pendidikan Matematika UI',
        pengalaman: '3 Tahun Guru SMA Unggulan',
        status: 'pending',
        appliedAt: '2026-08-28T14:20:00.000Z',
        createdAt: '2026-08-28T14:20:00.000Z'
    }
];

const courses = [
    { id: 'c-sch-1', category: 'School', level: 'SD', title: 'Matematika Dasar & Logika Sains SD', description: 'Penguasaan konsep bilangan bulat, pecahan, geometri, dan penalaran logika untuk siswa SD kelas 4-6.', mentor: 'Kak Raditya Pratama, S.Si.', totalModules: 8, completedModules: 4, progress: 50, tags: ['SD', 'Matematika', 'Logika'] },
    { id: 'c-sch-1b', category: 'School', level: 'SD', title: 'IPA & Eksplorasi Sains Alam SD', description: 'Pemahaman sains tematik, makhluk hidup, energi, lingkungan hidup, dan metode eksperimen sederhana.', mentor: 'Dr. Sarah Kartika, M.Sc.', totalModules: 8, completedModules: 0, progress: 0, tags: ['SD', 'IPA', 'Sains'] },
    { id: 'c-sch-1c', category: 'School', level: 'SD', title: 'Bahasa Inggris Dasar & Literasi Membaca SD', description: 'Vocabulary harian, reading comprehension cerita anak, dan tata bahasa dasar komunikatif.', mentor: 'Miss Jessica Aurelia, B.Ed.', totalModules: 6, completedModules: 0, progress: 0, tags: ['SD', 'English'] },
    { id: 'c-sch-2', category: 'School', level: 'SMP', title: 'Fisika & IPA Terpadu SMP', description: 'Pemahaman mendalam konsep gaya, energi, getaran gelombang, serta persiapan ujian sumatif SMP.', mentor: 'Dr. Sarah Kartika, M.Sc.', totalModules: 10, completedModules: 2, progress: 20, tags: ['SMP', 'Fisika', 'IPA'] },
    { id: 'c-sch-2b', category: 'School', level: 'SMP', title: 'Matematika Aljabar & Geometri Bangun Ruang SMP', description: 'Persamaan linear, phytagoras, lingkaran, transformasi geometri, dan statistik data SMP.', mentor: 'Kak Raditya Pratama, S.Si.', totalModules: 12, completedModules: 0, progress: 0, tags: ['SMP', 'Matematika'] },
    { id: 'c-sch-3', category: 'School', level: 'SMA', title: 'Matematika Peminatan & Kalkulus Dasar SMA', description: 'Trigonometri analitik, limit, turunan kalkulus, dan integral persiapan ujian sekolah & seleksi PTN.', mentor: 'Kak Raditya Pratama, S.Si.', totalModules: 12, completedModules: 8, progress: 66, tags: ['SMA', 'Matematika', 'Kalkulus'] },
    { id: 'c-sch-3b', category: 'School', level: 'SMA', title: 'Fisika Mekanika & Listrik Magnet SMA', description: 'Dinamika rotasi, fluida, termodinamika, gelombang optik, dan rangkaian listrik arus searah & bolak-balik.', mentor: 'Dr. Sarah Kartika, M.Sc.', totalModules: 14, completedModules: 7, progress: 50, tags: ['SMA', 'Fisika'] },
    { id: 'c-sch-3c', category: 'School', level: 'SMA', title: 'Kimia Larutan, Stoikiometri & Organik SMA', description: 'Ikatan kimia, termokimia, laju reaksi, kesetimbangan larutan, dan reaksi dasar kimia organik.', mentor: 'Kak Nadia Aurelia, S.Si.', totalModules: 10, completedModules: 3, progress: 30, tags: ['SMA', 'Kimia'] },
    { id: 'c-sch-3d', category: 'School', level: 'SMA', title: 'Biologi Sel, Genetika & Ekosistem SMA', description: 'Struktur sel, metabolisme enzim, sintesis protein, hukum mendel hereditas, dan ekologi lingkungan.', mentor: 'Kak Bima Satria, S.Si.', totalModules: 10, completedModules: 0, progress: 0, tags: ['SMA', 'Biologi'] },
    { id: 'c-oli-1', category: 'Olimpiade', level: 'Kota / Kabupaten', title: 'Intensif OSN Matematika Tingkat Kota/Kabupaten (OSN-K)', description: 'Bedah 4 pilar OSN: Teori Bilangan, Aljabar, Geometri, dan Kombinatorika dasar.', mentor: 'Kak Radit (Medalis OSN Matematika)', totalModules: 16, completedModules: 10, progress: 62, tags: ['OSN', 'Matematika', 'OSN-K'] },
    { id: 'c-oli-2', category: 'Olimpiade', level: 'Provinsi', title: 'Mastery OSN Fisika Tingkat Provinsi (OSN-P)', description: 'Pemodelan kalkulus diferensial-integral mekanika, gelombang lanjutan, dan termodinamika kompetisi.', mentor: 'Kak Alvin (Medalis OSN Fisika)', totalModules: 18, completedModules: 9, progress: 50, tags: ['OSN', 'Fisika', 'OSN-P'] },
    { id: 'c-oli-3', category: 'Olimpiade', level: 'Nasional', title: 'Pelatnas OSN Kimia Tingkat Nasional', description: 'Reaksi organik kompleks, spektroskopi NMR/IR, termodinamika kimia tingkat lanjut, dan praktikum virtual.', mentor: 'Kak Nadia (Tutor Spesialis OSN Kimia)', totalModules: 20, completedModules: 4, progress: 20, tags: ['OSN', 'Kimia', 'OSN-Nasional'] },
    { id: 'c-tka-1', category: 'TKA', level: 'SMP', title: 'Pemantapan Tes Masuk SMA Unggulan / Taruna Nusantara', description: 'Latihan soal skolastik, penalaran kuantitatif, verbal logika, dan tes akademik sains terpadu.', mentor: 'Tim Master Tutor NLS', totalModules: 12, completedModules: 6, progress: 50, tags: ['TKA', 'SMA Unggulan'] },
    { id: 'c-tka-2', category: 'TKA', level: 'SMA', title: 'Penguasaan TKA SAINTEK & SOSHUM Tingkat Lanjut', description: 'Penalaran matematika komprehensif, pemahaman literasi ilmiah, dan analisis grafik data.', mentor: 'Tim Master Tutor NLS', totalModules: 14, completedModules: 7, progress: 50, tags: ['TKA', 'Saintek', 'Soshum'] },
    { id: 'c-col-1', category: 'Collage Preparation', level: 'UTBK SNBT', title: 'Master Strategi UTBK SNBT 2026: Target Skor 750+', description: 'Bedah 7 subtes SNBT: Penalaran Umum, Pengetahuan Kuantitatif, Pemahaman Bacaan, Literasi B.Indo & B.Inggris, Penalaran Matematika.', mentor: 'Konsultan & Master Tutor SNBT NLS', totalModules: 24, completedModules: 16, progress: 66, tags: ['SNBT', 'UTBK', 'PTN'] },
    { id: 'c-col-2', category: 'Collage Preparation', level: 'Ujian Mandiri PTN', title: 'Simak UI, UTUL UGM & SM ITB Acceleration', description: 'Strategi penakluk soal level tinggi ujian mandiri PTN Top 3 Indonesia dengan metode trik cepat.', mentor: 'Alumni UI, UGM & ITB', totalModules: 18, completedModules: 6, progress: 33, tags: ['Ujian Mandiri', 'Simak UI', 'UTUL UGM'] },
    { id: 'c-col-3', category: 'Collage Preparation', level: 'Kedinasan', title: 'Intensif SKD CPNS & Sekolah Kedinasan (STAN, STIS, IPDN)', description: 'Tembus passing grade tinggi TWK (Wawasan Kebangsaan), TIU (Intelegensi Umum), dan TKP (Karakteristik Pribadi).', mentor: 'Master Trainer SKD Kedinasan', totalModules: 20, completedModules: 12, progress: 60, tags: ['Kedinasan', 'SKD', 'STAN', 'STIS'] }
];

async function run() {
    console.log('1. Creating Cloud Bin for USERS...');
    const usersBin = await createBin({ items: sortedUsers, lastUpdated: new Date().toISOString() });
    console.log('   ✓ Users Bin:', usersBin.uri);

    console.log('2. Creating Cloud Bin for EVENTS...');
    const eventsBin = await createBin({ items: sortedEvents, lastUpdated: new Date().toISOString() });
    console.log('   ✓ Events Bin:', eventsBin.uri);

    console.log('3. Creating Cloud Bin for ARTICLES...');
    const articlesBin = await createBin({ items: sortedArticles, lastUpdated: new Date().toISOString() });
    console.log('   ✓ Articles Bin:', articlesBin.uri);

    console.log('4. Creating Cloud Bin for TEACHERS & APPLICATIONS...');
    const teachersBin = await createBin({ teachers: sortedTeachers, teacherApplications: teacherApplications, lastUpdated: new Date().toISOString() });
    console.log('   ✓ Teachers Bin:', teachersBin.uri);

    console.log('5. Creating Cloud Bin for COURSES & QUIZZES...');
    const coursesBin = await createBin({ courses: courses, quizSubmissions: [
        { id: 'sub-1', userId: 'usr-student-1', userName: 'Muhammad Faiz Al-Fatih', userNisn: '0081293412', quizId: 'quiz-osn-fisika-1', quizTitle: 'Simulasi Try Out OSN Fisika Mekanika', category: 'Olimpiade', score: 88, totalQuestions: 20, correctCount: 18, wrongCount: 2, submittedAt: '2026-08-28T16:30:00.000Z' },
        { id: 'sub-2', userId: 'usr-student-1', userName: 'Muhammad Faiz Al-Fatih', userNisn: '0081293412', quizId: 'quiz-snbt-tps-1', quizTitle: 'Try Out Akbar Nasional UTBK SNBT 2026 #1', category: 'SNBT', score: 742, totalQuestions: 155, correctCount: 138, wrongCount: 17, submittedAt: '2026-08-29T10:15:00.000Z' }
    ], lastUpdated: new Date().toISOString() });
    console.log('   ✓ Courses Bin:', coursesBin.uri);

    const binConfig = {
        usersBinUrl: usersBin.uri,
        eventsBinUrl: eventsBin.uri,
        articlesBinUrl: articlesBin.uri,
        teachersBinUrl: teachersBin.uri,
        coursesBinUrl: coursesBin.uri
    };

    fs.writeFileSync('scratch/cloud_bins_config.json', JSON.stringify(binConfig, null, 2), 'utf8');
    console.log('✓ Saved configuration to scratch/cloud_bins_config.json');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
