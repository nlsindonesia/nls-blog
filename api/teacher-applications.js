import { getCloudStore, saveCloudStore } from './cloud-db.js';

export default async function handler(req, res) {
    // Enable CORS for all origins
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
    let applicationsCache = Array.isArray(store.teacherApplications) ? store.teacherApplications : [];

    if (req.method === 'GET') {
        const status = req.query && req.query.status;
        let data = applicationsCache;
        if (status) {
            data = applicationsCache.filter(a => a.status === status);
        }
        return res.status(200).json({
            success: true,
            meta: {
                total: applicationsCache.length,
                pendingCount: applicationsCache.filter(a => a.status === 'pending').length,
                acceptedCount: applicationsCache.filter(a => a.status === 'accepted').length,
                rejectedCount: applicationsCache.filter(a => a.status === 'rejected').length,
                trashCount: applicationsCache.filter(a => a.status === 'trashed').length,
                timestamp: new Date().toISOString()
            },
            total: applicationsCache.length,
            data: data
        });
    }

    if (req.method === 'POST') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }

        if (!body || (!body.nama && !body.name)) {
            return res.status(400).json({ success: false, message: 'Nama lengkap wajib diisi.' });
        }

        const nowIso = new Date().toISOString();
        const fullName = (body.nama || body.name || 'Calon Guru').trim();
        const nickName = (body.panggilan || body.shortName || fullName.split(' ')[0]).trim();

        const newApp = {
            id: body.id || `app-${Date.now()}`,
            submittedAt: body.submittedAt || nowIso,
            applied_at: body.applied_at || nowIso,
            status: body.status || 'pending',
            isTrashed: body.status === 'trashed' ? 1 : 0,
            nama: fullName,
            name: fullName,
            panggilan: nickName,
            shortName: nickName,
            wa: (body.wa || body.phone || '').trim(),
            phone: (body.wa || body.phone || '').trim(),
            email: (body.email || '').trim().toLowerCase(),
            pendidikan: (body.pendidikan || body.education || '').trim(),
            education: (body.pendidikan || body.education || '').trim(),
            photo: body.photo || '/images/pengajar/mentor-1-math.jpg',
            categories: Array.isArray(body.categories) && body.categories.length > 0 ? body.categories : ['OSN'],
            jenjang: Array.isArray(body.jenjang) && body.jenjang.length > 0 ? body.jenjang : ['SMA'],
            jenjangLabel: body.jenjangLabel || (Array.isArray(body.jenjang) ? body.jenjang.join(' & ') : 'Semua Jenjang'),
            subject: (body.subject || 'Mata Pelajaran').trim(),
            subjects: Array.isArray(body.subjects) ? body.subjects : [body.subject || 'Mata Pelajaran'],
            kebutuhanPrivat: (body.kebutuhanPrivat || body.fokusPrivat || '').trim(),
            fokusPrivat: (body.fokusPrivat || body.kebutuhanPrivat || '').trim(),
            philosophy: (body.philosophy || body.filosofi || '').trim(),
            filosofi: (body.filosofi || body.philosophy || '').trim(),
            highlights: Array.isArray(body.highlights) ? body.highlights : (
                [body.prestasi1, body.prestasi2, body.prestasi3].filter(Boolean)
            ),
            portfolio: (body.portfolio || body.cv_link || '').trim(),
            cv_link: (body.portfolio || body.cv_link || '').trim(),
            notes: body.notes || '',
            reviewNotes: body.reviewNotes || '',
            reviewedBy: body.reviewedBy || null,
            reviewedAt: body.reviewedAt || null,
            acceptedTeacherId: body.acceptedTeacherId || null,
            createdAt: body.createdAt || nowIso,
            updatedAt: nowIso,
            deletedAt: body.status === 'trashed' ? (body.deletedAt || nowIso) : null
        };

        const existsIndex = applicationsCache.findIndex(a => a.id === newApp.id);
        if (existsIndex !== -1) {
            applicationsCache[existsIndex] = { ...applicationsCache[existsIndex], ...newApp, updatedAt: nowIso };
        } else {
            applicationsCache.unshift(newApp);
        }

        await saveCloudStore({ teacherApplications: applicationsCache });

        return res.status(201).json({
            success: true,
            message: 'Pendaftaran calon pengajar berhasil disimpan ke database terstruktur.',
            data: newApp
        });
    }

    if (req.method === 'PUT') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const { id, status, deletedAt } = body || {};
        if (!id) return res.status(400).json({ success: false, message: 'ID aplikasi diperlukan.' });
        
        const nowIso = new Date().toISOString();
        let app = applicationsCache.find(a => a.id === id);
        if (!app) {
            app = {
                id: id,
                ...body,
                status: status || 'pending',
                createdAt: nowIso
            };
            applicationsCache.unshift(app);
        } else {
            Object.assign(app, body);
        }
        
        app.updatedAt = nowIso;
        if (status) {
            app.status = status;
            if (status === 'trashed') {
                app.isTrashed = 1;
                app.deletedAt = deletedAt || nowIso;
            } else if (status === 'pending' || status === 'accepted' || status === 'rejected') {
                app.isTrashed = 0;
                app.deletedAt = null;
                delete app.deletedAt;
            }
        }

        await saveCloudStore({ teacherApplications: applicationsCache });
        return res.status(200).json({ success: true, message: 'Data aplikasi pengajar berhasil diperbarui.', data: app });
    }

    if (req.method === 'DELETE') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const action = (req.query && req.query.action) || (body && body.action);
        if (action === 'empty_trash') {
            applicationsCache = applicationsCache.filter(a => a.status !== 'trashed');
            await saveCloudStore({ teacherApplications: applicationsCache });
            return res.status(200).json({ success: true, message: 'Semua data di trash server berhasil dikosongkan.' });
        }

        const id = (req.query && req.query.id) || (body && body.id);
        if (!id) return res.status(400).json({ success: false, message: 'ID aplikasi diperlukan.' });
        
        applicationsCache = applicationsCache.filter(a => a.id !== id);
        await saveCloudStore({ teacherApplications: applicationsCache });
        return res.status(200).json({ success: true, message: 'Aplikasi berhasil dihapus permanen dari server.' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
