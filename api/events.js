import { getCloudStore, saveCloudStore } from './cloud-db.js';

const defaultEvents = [
    {
        id: 'evt-jan-1',
        date: '2026-01-11',
        title: 'Kick-Off & Diagnostic Test OSN 9 Bidang Sains',
        category: 'OSN',
        jenjang: 'SMA',
        jenjangLabel: 'SMA / MA / Sederajat',
        time: '08:30 - 11:30 WIB',
        mode: 'Online (CBT & Zoom)',
        location: 'Platform CBT LMS Next Level Study',
        badgeText: 'Pendaftaran Dibuka',
        description: 'Tes diagnostik awal pemetaan kompetensi calon peserta OSN 9 bidang sains untuk menentukan strategi bimbingan tingkat kota/kabupaten.',
        highlights: [
            'Pemetaan 9 bidang OSN (Matematika, Fisika, Kimia, Biologi, Informatika, Astronomi, Kebumian, Ekonomi, Geografi)',
            'Laporan analisis kekuatan & kelemahan materi siswa',
            'Rekomendasi modul belajar bertahap dari mentor medalis'
        ],
        whatsappMessage: 'Halo Tim NLS, saya ingin mendaftar Kick-Off & Diagnostic Test OSN (11 Januari 2026).',
        status: 'active'
    },
    {
        id: 'evt-jan-2',
        date: '2026-01-18',
        title: 'Webinar Strategi & Roadmap Lolos SNBT PTN Top 2026',
        category: 'SNBT',
        jenjang: 'SMA',
        jenjangLabel: 'SMA / MA / SMK & Gap Year',
        time: '19:00 - 21:00 WIB',
        mode: 'Online (Live Zoom Interactive)',
        location: 'Live Zoom Room NLS Indonesia',
        badgeText: 'Terbuka Umum',
        description: 'Kupas tuntas strategi pemilihan program studi, analisis rasionalisasi nilai rapor vs skor UTBK, dan jadwal tahapan resmi SNPMB.',
        highlights: [
            'Strategi memilih jurusan & universitas target',
            'Analisis passing grade riil & bobot subtes SNBT',
            'Sesi tanya jawab langsung bersama konsultan pendidikan NLS'
        ],
        whatsappMessage: 'Halo Tim NLS, saya ingin info Webinar Strategi SNBT 2026 (18 Januari 2026).',
        status: 'active'
    },
    {
        id: 'evt-jan-3',
        date: '2026-01-25',
        title: 'In-House Training (IHT) Modul Ajar Guru Mitra',
        category: 'Mitra Sekolah',
        jenjang: 'Guru / Instansi',
        jenjangLabel: 'Guru & Tenaga Pendidik',
        time: '08:00 - 15:30 WIB',
        mode: 'Tatap Muka (Onsite)',
        location: 'Aula SMAN 14 Jakarta & Sekolah Mitra',
        badgeText: 'Kemitraan Eksklusif',
        description: 'Pelatihan pembuatan perangkat ajar interaktif, asesmen diagnostik, dan integrasi soal HOTS bagi dewan guru sekolah mitra NLS.',
        highlights: [
            'Penyusunan modul ajar Kurikulum Merdeka berbasis diferensiasi',
            'Pelatihan asesmen formatif & diagnostik cepat',
            'Sertifikat pelatihan 32 JP bernomor resmi'
        ],
        whatsappMessage: 'Halo Tim NLS, kami tertarik dengan program In-House Training (IHT) Guru Mitra.',
        status: 'active'
    },
    {
        id: 'evt-feb-1',
        date: '2026-02-08',
        title: 'Simulasi Akbar UTBK SNBT Nasional Seri 1',
        category: 'SNBT',
        jenjang: 'SMA',
        jenjangLabel: 'Kelas 12 & Alumni',
        time: '08:00 - 12:00 WIB',
        mode: 'Online (Platform CBT NLS)',
        location: 'Platform CBT LMS Next Level Study',
        badgeText: 'Nasional',
        description: 'Try out berskala nasional dengan sistem IRT (Item Response Theory) presisi tinggi, pemeringkatan nasional, dan video pembahasan lengkap.',
        highlights: [
            'Sistem IRT termutakhir standar BP3 Kemdikbudristek',
            'Grafik analisis kelemahan 7 subtes SNBT',
            'Video pembahasan mendalam oleh tim master tutor NLS'
        ],
        whatsappMessage: 'Halo Tim NLS, saya ingin mendaftar Simulasi Akbar UTBK Nasional Seri 1 (8 Februari 2026).',
        status: 'active'
    },
    {
        id: 'evt-feb-2',
        date: '2026-02-22',
        title: 'Klinik Bedah Soal HOTS TKA Saintek & Soshum',
        category: 'TKA',
        jenjang: 'SMA',
        jenjangLabel: 'SMA Kelas 11-12',
        time: '13:30 - 16:30 WIB',
        mode: 'Online (Zoom Interactive)',
        location: 'Live Class Zoom NLS',
        badgeText: 'Workshop Intensif',
        description: 'Sesi kupas tuntas soal-soal tingkat kesulitan tinggi (HOTS) mata pelajaran sains dan sosial humaniora bersama pakar kurikulum.',
        highlights: [
            'Bedah pola soal analitik dan pemecahan masalah kompleks',
            'Tips eliminasi jawaban jebakan dalam hitungan detik',
            'Bank latihan soal HOTS terbitan eksklusif NLS'
        ],
        whatsappMessage: 'Halo Tim NLS, saya ingin info Klinik Bedah Soal HOTS TKA (22 Februari 2026).',
        status: 'active'
    },
    {
        id: 'evt-mar-1',
        date: '2026-03-07',
        endDate: '2026-03-08',
        title: 'National Science Olympiad Prep Camp (NSOPC) 2026',
        category: 'OSN',
        jenjang: 'SMA',
        jenjangLabel: 'SMP & SMA (Calon Peserta OSN-K)',
        time: '08:00 - 17:00 WIB',
        mode: 'Hybrid (Onsite & Zoom)',
        location: 'Auditorium NLS Training Center & Zoom',
        badgeText: 'Bootcamp 2 Hari',
        description: 'Pembinaan maraton 2 hari penuh mencakup pendalaman teori fundamental, simulasi bertaraf provinsi, dan bedah silabus BPTI terbaru.',
        highlights: [
            '16 Jam sesi materi intensif & 4 sesi simulasi bertarget medali',
            'Mentoring 1-on-1 bersama peraih Medali Emas OSN Nasional',
            'Modul eksklusif "Kunci Sukses Lolos OSN-P 2026"'
        ],
        whatsappMessage: 'Halo Tim NLS, saya ingin mendaftar NSOPC 2026 (7-8 Maret 2026).',
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
    let eventsCache = Array.isArray(store.events) && store.events.length > 0 ? store.events : defaultEvents;

    // GET /api/events
    if (req.method === 'GET') {
        const status = req.query && req.query.status;
        let data = eventsCache;
        if (status) {
            data = eventsCache.filter(e => e.status === status);
        }
        return res.status(200).json({
            success: true,
            meta: {
                total: eventsCache.length,
                activeCount: eventsCache.filter(e => e.status !== 'trashed').length,
                trashCount: eventsCache.filter(e => e.status === 'trashed').length,
                timestamp: new Date().toISOString()
            },
            total: eventsCache.length,
            activeCount: eventsCache.filter(e => e.status !== 'trashed').length,
            trashCount: eventsCache.filter(e => e.status === 'trashed').length,
            data: data
        });
    }

    // POST /api/events (Create)
    if (req.method === 'POST') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }

        if (!body || !body.title) {
            return res.status(400).json({ success: false, message: 'Judul event wajib diisi.' });
        }

        const nowIso = new Date().toISOString();
        const newEvent = {
            id: body.id || `evt-${Date.now()}`,
            title: body.title.trim(),
            category: body.category || 'OSN',
            jenjang: body.jenjang || 'SMA',
            jenjangLabel: body.jenjangLabel || (body.jenjang === 'SMA' ? 'SMA / MA / Sederajat' : 'Semua Jenjang'),
            date: body.date || nowIso.split('T')[0],
            endDate: body.endDate || '',
            time: body.time || '08:00 - 11:30 WIB',
            mode: body.mode || 'Online (CBT NLS)',
            location: body.location || 'Platform CBT Next Level Study',
            badgeText: body.badgeText || 'Pendaftaran Dibuka',
            whatsappMessage: body.whatsappMessage || `Halo Tim NLS, saya ingin info terkait event ${body.title}`,
            description: body.description ? body.description.trim() : '',
            highlights: Array.isArray(body.highlights) ? body.highlights : (
                typeof body.highlightsRaw === 'string' ? body.highlightsRaw.split('\n').map(s => s.trim()).filter(Boolean) : []
            ),
            status: body.status || 'active',
            isTrashed: body.status === 'trashed' ? 1 : 0,
            createdAt: body.createdAt || nowIso,
            updatedAt: nowIso,
            deletedAt: body.status === 'trashed' ? (body.deletedAt || nowIso) : null
        };

        const idx = eventsCache.findIndex(e => e.id === newEvent.id);
        if (idx !== -1) {
            eventsCache[idx] = { ...eventsCache[idx], ...newEvent, updatedAt: nowIso };
        } else {
            eventsCache.unshift(newEvent);
        }

        await saveCloudStore({ events: eventsCache });

        return res.status(201).json({
            success: true,
            message: 'Event kalender berhasil disimpan ke database terstruktur.',
            data: newEvent
        });
    }

    // PUT /api/events (Update / Trash / Restore)
    if (req.method === 'PUT') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const { id, status, deletedAt } = body || {};
        if (!id) return res.status(400).json({ success: false, message: 'ID event diperlukan.' });

        const nowIso = new Date().toISOString();
        let event = eventsCache.find(e => e.id === id);
        if (!event) {
            event = { id, title: body.title || 'Event', status: status || 'active', createdAt: nowIso };
            eventsCache.unshift(event);
        }

        Object.assign(event, body);
        event.updatedAt = nowIso;
        if (status) {
            event.status = status;
            if (status === 'trashed') {
                event.isTrashed = 1;
                event.deletedAt = deletedAt || nowIso;
            } else {
                event.isTrashed = 0;
                event.deletedAt = null;
                delete event.deletedAt;
            }
        }

        await saveCloudStore({ events: eventsCache });

        return res.status(200).json({
            success: true,
            message: 'Event berhasil diperbarui.',
            data: event
        });
    }

    // DELETE /api/events (Permanent Delete / Empty Trash)
    if (req.method === 'DELETE') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const action = (req.query && req.query.action) || (body && body.action);
        if (action === 'empty_trash') {
            eventsCache = eventsCache.filter(e => e.status !== 'trashed');
            await saveCloudStore({ events: eventsCache });
            return res.status(200).json({
                success: true,
                message: 'Semua event di tempat sampah berhasil dibersihkan.'
            });
        }

        const id = (req.query && req.query.id) || (body && body.id);
        if (!id) return res.status(400).json({ success: false, message: 'ID event diperlukan.' });

        eventsCache = eventsCache.filter(e => e.id !== id);
        await saveCloudStore({ events: eventsCache });
        return res.status(200).json({
            success: true,
            message: 'Event telah dihapus secara permanen dari server cloud.'
        });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
