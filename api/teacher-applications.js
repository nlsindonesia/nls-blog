// ==============================================================================
// VERCEL SERVERLESS API: TEACHER APPLICATIONS (REKRUTMEN PENGAJAR NLS)
// File: /api/teacher-applications.js
// ==============================================================================

// In-memory runtime storage for serverless instance
let applicationsCache = [];


export default function handler(req, res) {
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

    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            total: applicationsCache.length,
            data: applicationsCache
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
        const fullName = body.nama || body.name || 'Calon Guru';
        const nickName = body.panggilan || body.shortName || fullName.split(' ')[0];

        const newApp = {
            id: body.id || `app-${Date.now()}`,
            submittedAt: body.submittedAt || nowIso,
            applied_at: body.applied_at || nowIso,
            status: body.status || 'pending',
            nama: fullName,
            name: fullName,
            panggilan: nickName,
            shortName: nickName,
            wa: body.wa || body.phone || '',
            phone: body.wa || body.phone || '',
            email: body.email || '',
            pendidikan: body.pendidikan || body.education || '',
            education: body.pendidikan || body.education || '',
            photo: body.photo || '/images/pengajar/mentor-1-math.jpg',
            categories: Array.isArray(body.categories) && body.categories.length > 0 ? body.categories : ['OSN'],
            jenjang: Array.isArray(body.jenjang) && body.jenjang.length > 0 ? body.jenjang : ['SMA'],
            jenjangLabel: body.jenjangLabel || (Array.isArray(body.jenjang) ? body.jenjang.join(' & ') : 'Semua Jenjang'),
            subject: body.subject || 'Mata Pelajaran',
            subjects: Array.isArray(body.subjects) ? body.subjects : [body.subject || 'Mata Pelajaran'],
            kebutuhanPrivat: body.kebutuhanPrivat || body.fokusPrivat || '',
            fokusPrivat: body.fokusPrivat || body.kebutuhanPrivat || '',
            philosophy: body.philosophy || body.filosofi || '',
            filosofi: body.filosofi || body.philosophy || '',
            highlights: Array.isArray(body.highlights) ? body.highlights : (
                [body.prestasi1, body.prestasi2, body.prestasi3].filter(Boolean)
            ),
            portfolio: body.portfolio || body.cv_link || '',
            cv_link: body.portfolio || body.cv_link || '',
            notes: body.notes || ''
        };

        // Prepend to serverless memory list
        const existsIndex = applicationsCache.findIndex(a => a.id === newApp.id);
        if (existsIndex !== -1) {
            applicationsCache[existsIndex] = newApp;
        } else {
            applicationsCache.unshift(newApp);
        }

        return res.status(201).json({
            success: true,
            message: 'Pendaftaran calon pengajar berhasil diterima oleh server Next Level Study.',
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
        
        const app = applicationsCache.find(a => a.id === id);
        if (!app) return res.status(404).json({ success: false, message: 'Aplikasi tidak ditemukan.' });
        
        if (status) {
            app.status = status;
            if (status === 'trashed') {
                app.deletedAt = deletedAt || new Date().toISOString();
            } else if (status === 'pending' || status === 'accepted' || status === 'rejected') {
                delete app.deletedAt;
            }
        }
        return res.status(200).json({ success: true, data: app });
    }

    if (req.method === 'DELETE') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const action = (req.query && req.query.action) || (body && body.action);
        if (action === 'empty_trash') {
            applicationsCache = applicationsCache.filter(a => a.status !== 'trashed');
            return res.status(200).json({ success: true, message: 'Semua data di trash server berhasil dikosongkan.' });
        }

        const id = (req.query && req.query.id) || (body && body.id);
        if (!id) return res.status(400).json({ success: false, message: 'ID aplikasi diperlukan.' });
        
        applicationsCache = applicationsCache.filter(a => a.id !== id);
        return res.status(200).json({ success: true, message: 'Aplikasi berhasil dihapus permanen dari server.' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
