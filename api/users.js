import { getCloudStore, saveCloudStore } from './cloud-db.js';

const defaultUsers = [
    {
        id: 'usr-1',
        name: 'Super Administrator NLS',
        username: 'nlsindonesia',
        email: 'admin@next-level-study.com',
        role: 'Super Admin',
        status: 'Active',
        lastLogin: '2026-08-28 21:00',
        permissions: ['all']
    },
    {
        id: 'usr-2',
        name: 'Akademik & Kurikulum',
        username: 'akademik.nls',
        email: 'akademik@next-level-study.com',
        role: 'Editor',
        status: 'Active',
        lastLogin: '2026-08-28 14:30',
        permissions: ['kalender', 'berita', 'pengajar']
    },
    {
        id: 'usr-3',
        name: 'Tutor Koordinator OSN',
        username: 'tutor.osn',
        email: 'tutor.osn@next-level-study.com',
        role: 'Mentor',
        status: 'Active',
        lastLogin: '2026-08-27 19:15',
        permissions: ['pengajar']
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
    let usersCache = Array.isArray(store.users) && store.users.length > 0 ? store.users : defaultUsers;

    // GET /api/users
    if (req.method === 'GET') {
        const status = req.query && req.query.status;
        let data = usersCache;
        if (status) {
            data = usersCache.filter(u => u.status === status);
        }
        // Exclude raw passwords from response list for enterprise security standard
        const sanitizedData = data.map(u => {
            const { password, passwordHash, ...safe } = u;
            return safe;
        });

        return res.status(200).json({
            success: true,
            meta: {
                total: usersCache.length,
                activeCount: usersCache.filter(u => u.status !== 'trashed').length,
                trashCount: usersCache.filter(u => u.status === 'trashed').length,
                timestamp: new Date().toISOString()
            },
            total: usersCache.length,
            activeCount: usersCache.filter(u => u.status !== 'trashed').length,
            trashCount: usersCache.filter(u => u.status === 'trashed').length,
            data: sanitizedData
        });
    }

    // POST /api/users (Create)
    if (req.method === 'POST') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }

        if (!body || !body.name || !body.username) {
            return res.status(400).json({ success: false, message: 'Nama dan Username wajib diisi.' });
        }

        const nowIso = new Date().toISOString();
        const safeUsername = body.username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');

        const newUser = {
            id: body.id || `usr-${Date.now()}`,
            name: body.name.trim(),
            username: safeUsername,
            email: (body.email || `${safeUsername}@next-level-study.com`).trim().toLowerCase(),
            role: body.role || 'Staff',
            avatar: body.avatar || '/nls-logo-300.png',
            status: body.status || 'Active',
            isTrashed: body.status === 'trashed' ? 1 : 0,
            lastLogin: body.lastLogin || 'Belum Pernah',
            permissions: Array.isArray(body.permissions) ? body.permissions : ['kalender', 'berita'],
            notes: body.notes ? body.notes.trim() : '',
            createdAt: body.createdAt || nowIso,
            updatedAt: nowIso,
            deletedAt: body.status === 'trashed' ? (body.deletedAt || nowIso) : null
        };

        const idx = usersCache.findIndex(u => u.id === newUser.id || u.username === newUser.username);
        if (idx !== -1) {
            usersCache[idx] = { ...usersCache[idx], ...newUser, updatedAt: nowIso };
        } else {
            usersCache.unshift(newUser);
        }

        await saveCloudStore({ users: usersCache });

        const { password, passwordHash, ...safeUser } = newUser;
        return res.status(201).json({
            success: true,
            message: 'Akun pengguna berhasil disimpan ke database terstruktur.',
            data: safeUser
        });
    }

    // PUT /api/users (Update / Trash / Restore)
    if (req.method === 'PUT') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const { id, status, deletedAt } = body || {};
        if (!id) return res.status(400).json({ success: false, message: 'ID pengguna diperlukan.' });

        const nowIso = new Date().toISOString();
        let user = usersCache.find(u => u.id === id);
        if (!user) {
            user = { id, name: body.name || 'User', username: body.username || 'user', status: status || 'Active', createdAt: nowIso };
            usersCache.unshift(user);
        }

        Object.assign(user, body);
        user.updatedAt = nowIso;
        if (status) {
            user.status = status;
            if (status === 'trashed') {
                user.isTrashed = 1;
                user.deletedAt = deletedAt || nowIso;
            } else {
                user.isTrashed = 0;
                user.deletedAt = null;
                delete user.deletedAt;
            }
        }

        await saveCloudStore({ users: usersCache });

        const { password, passwordHash, ...safeUser } = user;
        return res.status(200).json({
            success: true,
            message: 'Akun pengguna berhasil diperbarui.',
            data: safeUser
        });
    }

    // DELETE /api/users (Permanent Delete / Empty Trash)
    if (req.method === 'DELETE') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const action = (req.query && req.query.action) || (body && body.action);
        if (action === 'empty_trash') {
            usersCache = usersCache.filter(u => u.status !== 'trashed');
            await saveCloudStore({ users: usersCache });
            return res.status(200).json({
                success: true,
                message: 'Semua akun di tempat sampah berhasil dibersihkan.'
            });
        }

        const id = (req.query && req.query.id) || (body && body.id);
        if (!id) return res.status(400).json({ success: false, message: 'ID pengguna diperlukan.' });

        usersCache = usersCache.filter(u => u.id !== id);
        await saveCloudStore({ users: usersCache });
        return res.status(200).json({
            success: true,
            message: 'Akun admin telah dihapus secara permanen dari server cloud.'
        });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
