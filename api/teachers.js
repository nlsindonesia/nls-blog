import { getCloudStore, saveCloudStore } from './cloud-db.js';

const defaultTeachers = [
    {
        id: 't-1',
        name: 'Raditya Pratama, S.Si.',
        shortName: 'Kak Radit',
        photo: '/images/pengajar/mentor-1-math.jpg',
        education: 'Matematika ITB (Medalis Emas OSN & IMO Participant)',
        categories: ['OSN', 'TKA', 'Kurikulum Internasional'],
        jenjang: ['SMP', 'SMA'],
        jenjangLabel: 'SMP, SMA & SPK School',
        subject: 'Matematika Lanjut (OSN, TKA, & IB / Cambridge)',
        subjects: ['Matematika (SMA)', 'Matematika (SMP)', 'Cambridge / IB Mathematics (HL/SL)', 'Penalaran Matematika'],
        kebutuhanPrivat: 'Bimbingan intensif persiapan OSN Matematika, Ujian Mandiri PTN (SIMAK UI & UTUL UGM), serta persiapan ujian Cambridge AS/A-Level & IB Math HL.',
        philosophy: 'Matematika bukan tentang menghafal rumus, melainkan melatih kejujuran logika dan daya nalar terstruktur.',
        highlights: [
            'Membimbing 20+ siswa peraih medali OSN & KSN Nasional',
            'Tutor privat intensif Cambridge A-Level Math & IB DP HL',
            'Alumni bimbingan diterima di STEI ITB, Fasilkom UI, & NTU Singapura'
        ],
        status: 'active'
    },
    {
        id: 't-2',
        name: 'Dr. Nurul Azizah, M.Biotech.',
        shortName: 'Kak Nurul',
        photo: '/images/pengajar/mentor-2-bio.jpg',
        education: 'Bioteknologi UI & Univ. of Melbourne (Peraih IBO Award)',
        categories: ['OSN', 'SNBT', 'Kurikulum Nasional', 'Kurikulum Internasional', 'TKA'],
        jenjang: ['SMA'],
        jenjangLabel: 'SMA Kelas 10-12 & Gap Year',
        subject: 'Biologi Kedokteran, Sains Terapan & Literasi IPA',
        subjects: ['Biologi (SMA)', 'Cambridge / IB Biology (IGCSE & A-Level)', 'TPS - Kemampuan Penalaran Umum (KPU)'],
        kebutuhanPrivat: 'Les privat masuk Fakultas Kedokteran (IUP & Reguler UI/UGM), OSN Biologi, dan IB DP Biology HL.',
        philosophy: 'Mengajar dengan hati nurani dan kejujuran ilmiah melahirkan calon dokter dan saintis yang berintegritas.',
        highlights: [
            'Mentor tim olimpiade biologi Puspresnas & IUP Medicine',
            'Berhasil meloloskan 65+ siswa ke FK UI, FK UGM, & FK Unair',
            'Spesialis genetika molekuler, fisiologi manusia, dan biokimia'
        ],
        status: 'active'
    },
    {
        id: 't-3',
        name: 'Bima Wicaksono, M.Eng.',
        shortName: 'Kak Bima',
        photo: '/images/pengajar/mentor-3-physics.jpg',
        education: 'Teknik Mesin UGM & Tokyo Tech (Medalis Perak IPhO)',
        categories: ['OSN', 'SNBT', 'TKA', 'Kurikulum Internasional'],
        jenjang: ['SMA'],
        jenjangLabel: 'SMA & Alumni',
        subject: 'Fisika Kuantum, Mekanika Analitik & Fisika UTBK',
        subjects: ['Fisika (SMA)', 'Cambridge / IB Physics', 'Penalaran Matematika'],
        kebutuhanPrivat: 'Persiapan OSN Fisika, UTBK SNBT Saintek, dan ujian Cambridge A-Level Physics.',
        philosophy: 'Fisika adalah seni memahami cara kerja alam semesta secara matematis dan logis.',
        highlights: [
            'Medalis Perak Olimpiade Fisika Internasional (IPhO)',
            'Membimbing 30+ siswa lolos seleksi OSN-P dan OSN Nasional',
            'Tutor berpengalaman kurikulum IB DP Physics HL & SL'
        ],
        status: 'active'
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
    let teachersCache = Array.isArray(store.teachers) && store.teachers.length > 0 ? store.teachers : defaultTeachers;

    // GET /api/teachers
    if (req.method === 'GET') {
        const status = req.query && req.query.status;
        let data = teachersCache;
        if (status) {
            data = teachersCache.filter(t => t.status === status);
        }
        return res.status(200).json({
            success: true,
            total: teachersCache.length,
            activeCount: teachersCache.filter(t => t.status !== 'trashed').length,
            trashCount: teachersCache.filter(t => t.status === 'trashed').length,
            data: data
        });
    }

    // POST /api/teachers (Create)
    if (req.method === 'POST') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }

        if (!body || !body.name) {
            return res.status(400).json({ success: false, message: 'Nama pengajar wajib diisi.' });
        }

        const newTeacher = {
            id: body.id || `t-${Date.now()}`,
            name: body.name,
            shortName: body.shortName || body.name.split(' ')[0],
            photo: body.photo || '/images/pengajar/mentor-1-math.jpg',
            education: body.education || '',
            categories: Array.isArray(body.categories) && body.categories.length > 0 ? body.categories : ['OSN'],
            jenjang: Array.isArray(body.jenjang) && body.jenjang.length > 0 ? body.jenjang : ['SMA'],
            jenjangLabel: body.jenjangLabel || (Array.isArray(body.jenjang) ? body.jenjang.join(' & ') : 'Semua Jenjang'),
            subject: body.subject || '',
            subjects: Array.isArray(body.subjects) ? body.subjects : [body.subject || ''],
            kebutuhanPrivat: body.kebutuhanPrivat || '',
            philosophy: body.philosophy || '',
            highlights: Array.isArray(body.highlights) ? body.highlights : (
                typeof body.highlightsRaw === 'string' ? body.highlightsRaw.split('\n').map(s => s.trim()).filter(Boolean) : []
            ),
            status: body.status || 'active'
        };

        const idx = teachersCache.findIndex(t => t.id === newTeacher.id);
        if (idx !== -1) {
            teachersCache[idx] = newTeacher;
        } else {
            teachersCache.unshift(newTeacher);
        }

        await saveCloudStore({ teachers: teachersCache });

        return res.status(201).json({
            success: true,
            message: 'Data pengajar berhasil disimpan ke cloud.',
            data: newTeacher
        });
    }

    // PUT /api/teachers (Update / Trash / Restore)
    if (req.method === 'PUT') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const { id, status, deletedAt } = body || {};
        if (!id) return res.status(400).json({ success: false, message: 'ID pengajar diperlukan.' });

        let teacher = teachersCache.find(t => t.id === id);
        if (!teacher) {
            teacher = { id, name: body.name || 'Pengajar', status: status || 'active' };
            teachersCache.unshift(teacher);
        }

        Object.assign(teacher, body);
        if (status) {
            teacher.status = status;
            if (status === 'trashed') {
                teacher.deletedAt = deletedAt || new Date().toISOString();
            } else {
                delete teacher.deletedAt;
            }
        }

        await saveCloudStore({ teachers: teachersCache });

        return res.status(200).json({
            success: true,
            message: 'Data pengajar berhasil diperbarui di cloud.',
            data: teacher
        });
    }

    // DELETE /api/teachers (Permanent Delete / Empty Trash)
    if (req.method === 'DELETE') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const action = (req.query && req.query.action) || (body && body.action);
        if (action === 'empty_trash') {
            teachersCache = teachersCache.filter(t => t.status !== 'trashed');
            await saveCloudStore({ teachers: teachersCache });
            return res.status(200).json({
                success: true,
                message: 'Semua data pengajar di tempat sampah berhasil dibersihkan.'
            });
        }

        const id = (req.query && req.query.id) || (body && body.id);
        if (!id) return res.status(400).json({ success: false, message: 'ID pengajar diperlukan.' });

        teachersCache = teachersCache.filter(t => t.id !== id);
        await saveCloudStore({ teachers: teachersCache });
        return res.status(200).json({
            success: true,
            message: 'Data pengajar telah dihapus secara permanen dari server cloud.'
        });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
