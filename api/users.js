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
        return res.status(200).json({
            success: true,
            total: usersCache.length,
            activeCount: usersCache.filter(u => u.status !== 'trashed').length,
            trashCount: usersCache.filter(u => u.status === 'trashed').length,
            data: data
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

        const newUser = {
            id: body.id || `usr-${Date.now()}`,
            name: body.name,
            username: body.username,
            email: body.email || `${body.username}@next-level-study.com`,
            role: body.role || 'Staff',
            status: body.status || 'Active',
            lastLogin: body.lastLogin || 'Belum Pernah',
            permissions: Array.isArray(body.permissions) ? body.permissions : ['kalender', 'berita']
        };

        const idx = usersCache.findIndex(u => u.id === newUser.id || u.username === newUser.username);
        if (idx !== -1) {
            usersCache[idx] = newUser;
        } else {
            usersCache.unshift(newUser);
        }

        await saveCloudStore({ users: usersCache });

        return res.status(201).json({
            success: true,
            message: 'Akun admin berhasil dibuat di cloud.',
            data: newUser
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

        let user = usersCache.find(u => u.id === id);
        if (!user) {
            user = { id, name: body.name || 'User', username: body.username || 'user', status: status || 'Active' };
            usersCache.unshift(user);
        }

        Object.assign(user, body);
        if (status) {
            user.status = status;
            if (status === 'trashed') {
                user.deletedAt = deletedAt || new Date().toISOString();
            } else {
                delete user.deletedAt;
            }
        }

        await saveCloudStore({ users: usersCache });

        return res.status(200).json({
            success: true,
            message: 'Akun admin berhasil diperbarui di cloud.',
            data: user
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
