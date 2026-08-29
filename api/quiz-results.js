import { getCloudStore, saveCloudStore } from './cloud-db.js';

let submissionsCache = [];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const store = await getCloudStore();
    if (Array.isArray(store.quizSubmissions)) {
        submissionsCache = store.quizSubmissions;
    } else {
        submissionsCache = [];
    }

    // GET /api/quiz-results
    if (req.method === 'GET') {
        try {
            const { courseId, email, limit } = req.query || {};
            let result = [...submissionsCache];

            if (courseId) {
                result = result.filter(s => s.courseId === courseId);
            }
            if (email) {
                result = result.filter(s => (s.studentEmail || '').toLowerCase() === email.toLowerCase());
            }

            // Sort newest first
            result.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));

            if (limit && !isNaN(parseInt(limit))) {
                result = result.slice(0, parseInt(limit));
            }

            return res.status(200).json({
                success: true,
                total: result.length,
                data: result
            });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    // POST /api/quiz-results
    if (req.method === 'POST') {
        try {
            const body = req.body || {};
            const newSubmission = {
                id: body.id || ('sub-' + Date.now()),
                studentName: body.studentName || 'Siswa NLS',
                studentEmail: body.studentEmail || '',
                nisn: body.nisn || '',
                school: body.school || '',
                courseId: body.courseId || '',
                courseTitle: body.courseTitle || 'Kelas NLS',
                moduleTitle: body.moduleTitle || 'Kuis Bab',
                category: body.category || 'School',
                score: typeof body.score === 'number' ? body.score : 0,
                passed: typeof body.score === 'number' ? body.score >= 75 : false,
                totalQuestions: body.totalQuestions || 0,
                correctCount: body.correctCount || 0,
                answers: body.answers || {},
                submittedAt: new Date().toISOString()
            };

            submissionsCache.unshift(newSubmission);
            store.quizSubmissions = submissionsCache;
            await saveCloudStore(store);

            return res.status(200).json({
                success: true,
                message: 'Hasil kuis berhasil dicatat di server!',
                data: newSubmission
            });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    // DELETE /api/quiz-results
    if (req.method === 'DELETE') {
        try {
            const id = req.query && req.query.id;
            if (!id) return res.status(400).json({ success: false, message: 'Submission ID is required.' });

            submissionsCache = submissionsCache.filter(s => s.id !== id);
            store.quizSubmissions = submissionsCache;
            await saveCloudStore(store);

            return res.status(200).json({ success: true, message: 'Hasil kuis berhasil dihapus.' });
        } catch (e) {
            return res.status(500).json({ success: false, message: e.message });
        }
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
