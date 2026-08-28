// ==============================================================================
// VERCEL SERVERLESS API: BERITA & ARTIKEL CMS NLS
// File: /api/articles.js
// ==============================================================================

let articlesCache = [
    {
        id: 'art-osn-matematika',
        title: 'Tips Belajar OSN Matematika SMA: Strategi Penguasaan 4 Pilar & Problem Solving Heuristik',
        slug: 'tips-belajar-osn-matematika-sma',
        category: 'OSN & Sains',
        categories: ['OSN & Sains', 'Tips Belajar & Prestasi'],
        date: '2026-08-25',
        author: 'Kak Radit (Medalis OSN Matematika)',
        status: 'published',
        coverImage: '/images/blog/cover-osn-matematika.jpg',
        focusKeyword: 'tips belajar osn matematika sma',
        metaTitle: 'Tips Belajar OSN Matematika SMA: Strategi Juara 4 Pilar | NLS',
        metaDescription: 'Panduan lengkap tips belajar OSN Matematika SMA: bedah 4 pilar aljabar, geometri, teori bilangan, kombinatorika, dan metode problem solving medalis NLS.',
        canonicalUrl: 'https://next-level-study.com/blog/tips-belajar-osn-matematika-sma',
        content: '<h2>Mengapa OSN Matematika Membutuhkan Pola Pikir Pembuktian Logis?</h2><p>Olimpiade Sains Nasional (OSN) Matematika jenjang SMA bukanlah sekadar tes kecepatan berhitung, melainkan uji ketajaman logika berpikir deduktif dan seni pembuktian matematis yang elegan.</p>',
        seoScore: 96
    },
    {
        id: 'art-osn-fisika',
        title: 'Tips Belajar OSN Fisika SMA: Metode Pemodelan Matematis, Analisis Kalkulus & Bedah Soal IPhO',
        slug: 'tips-belajar-osn-fisika-sma',
        category: 'OSN & Sains',
        categories: ['OSN & Sains', 'Tips Belajar & Prestasi'],
        date: '2026-08-24',
        author: 'Kak Alvin (Medalis OSN Fisika)',
        status: 'published',
        coverImage: '/images/blog/cover-osn-fisika.jpg',
        focusKeyword: 'tips belajar osn fisika sma',
        metaTitle: 'Tips Belajar OSN Fisika SMA: Pemodelan & Kalkulus Medalis | NLS',
        metaDescription: 'Pelajari tips belajar OSN Fisika SMA dari pemodelan diagram benda bebas, kalkulus diferensial-integral, termodinamika hingga strategi bedah soal IPhO.',
        canonicalUrl: 'https://next-level-study.com/blog/tips-belajar-osn-fisika-sma',
        content: '<h2>Transformasi Pemahaman Fisika: Dari Hafalan Rumus Menuju Hukum Fundamental</h2><p>Banyak siswa menganggap fisika sebagai kumpulan rumus rumit yang harus dihafal. Namun, dalam ajang bergengsi OSN Fisika SMA, pendekatan hafalan dipastikan gagal total.</p>',
        seoScore: 95
    },
    {
        id: 'art-osn-kimia',
        title: 'Tips Belajar OSN Kimia SMA: Kuasai Mekanisme Reaksi Organik, Termodinamika & Spektroskopi',
        slug: 'tips-belajar-osn-kimia-sma',
        category: 'OSN & Sains',
        categories: ['OSN & Sains', 'Tips Belajar & Prestasi'],
        date: '2026-08-23',
        author: 'Kak Nadia (Tutor Spesialis OSN Kimia)',
        status: 'published',
        coverImage: '/images/blog/cover-osn-kimia.jpg',
        focusKeyword: 'tips belajar osn kimia sma',
        metaTitle: 'Tips Belajar OSN Kimia SMA: Reaksi Organik & Termodinamika | NLS',
        metaDescription: 'Panduan tips belajar OSN Kimia SMA: strategi mendalam kimia fisik, reaksi organik, stoikiometri analitik, dan analisis spektroskopi NMR bersama NLS.',
        canonicalUrl: 'https://next-level-study.com/blog/tips-belajar-osn-kimia-sma',
        content: '<h2>Kunci Menguasai Kimia Kompetisi: Keseimbangan Antara Teori dan Logika Reaksi</h2><p>Olimpiade Sains Nasional Kimia SMA terkenal dengan cakupan materinya yang sangat luas, menjangkau level perkuliahan kimia tingkat dua dan tiga.</p>',
        seoScore: 94
    },
    {
        id: 'art-snbt-tps',
        title: 'Strategi Tembus Skor 700+ UTBK SNBT 2026: Bedah Subtes TPS, Literasi & Penalaran Matematika',
        slug: 'strategi-tembus-skor-700-utbk-snbt-2026',
        category: 'SNBT & UTBK',
        categories: ['SNBT & UTBK', 'Tips Belajar & Prestasi'],
        date: '2026-08-22',
        author: 'Tim Akademik NLS',
        status: 'published',
        coverImage: '/images/blog/cover-snbt-tps.jpg',
        focusKeyword: 'strategi tembus skor 700 utbk snbt 2026',
        metaTitle: 'Strategi Tembus Skor 700+ UTBK SNBT 2026: Bedah TPS & Literasi | NLS',
        metaDescription: 'Tips & strategi ampuh raih skor 700+ UTBK SNBT: pembobotan IRT, manajemen waktu subtes TPS, penalaran matematika, dan literasi bersama NLS.',
        canonicalUrl: 'https://next-level-study.com/blog/strategi-tembus-skor-700-utbk-snbt-2026',
        content: '<h2>Mengapa Skor 700+ Menjadi Kunci Lolos Program Studi Favorit?</h2><p>Persaingan masuk perguruan tinggi negeri impian seperti FK UI, STEI ITB, atau FEB UGM selalu membutuhkan skor UTBK yang kompetitif di atas 700.</p>',
        seoScore: 98
    }
];

export default function handler(req, res) {
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

    // GET /api/articles
    if (req.method === 'GET') {
        const status = req.query && req.query.status;
        let data = articlesCache;
        if (status) {
            data = articlesCache.filter(a => a.status === status);
        }
        return res.status(200).json({
            success: true,
            total: articlesCache.length,
            activeCount: articlesCache.filter(a => a.status !== 'trashed').length,
            trashCount: articlesCache.filter(a => a.status === 'trashed').length,
            data: data
        });
    }

    // POST /api/articles (Create)
    if (req.method === 'POST') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }

        if (!body || !body.title) {
            return res.status(400).json({ success: false, message: 'Judul artikel wajib diisi.' });
        }

        const now = new Date().toISOString().split('T')[0];
        const newArticle = {
            id: body.id || `art-${Date.now()}`,
            title: body.title,
            slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            category: body.category || 'SNBT & UTBK',
            categories: Array.isArray(body.categories) && body.categories.length > 0 ? body.categories : [body.category || 'SNBT & UTBK'],
            date: body.date || now,
            endDate: body.endDate || '',
            author: body.author || 'Tim Akademik NLS',
            status: body.status || 'published',
            coverImage: body.coverImage || '/images/blog/cover-snbt-tps.jpg',
            focusKeyword: body.focusKeyword || '',
            metaTitle: body.metaTitle || body.title,
            metaDescription: body.metaDescription || '',
            canonicalUrl: body.canonicalUrl || `https://next-level-study.com/blog/${body.slug || 'artikel'}`,
            content: body.content || '<p>Konten artikel Next Level Study.</p>',
            seoScore: Number(body.seoScore) || 85
        };

        const idx = articlesCache.findIndex(a => a.id === newArticle.id || a.slug === newArticle.slug);
        if (idx !== -1) {
            articlesCache[idx] = newArticle;
        } else {
            articlesCache.unshift(newArticle);
        }

        return res.status(201).json({
            success: true,
            message: 'Artikel berita berhasil dipublikasikan ke cloud.',
            data: newArticle
        });
    }

    // PUT /api/articles (Update / Trash / Restore)
    if (req.method === 'PUT') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const { id, status, deletedAt } = body || {};
        if (!id) return res.status(400).json({ success: false, message: 'ID artikel diperlukan.' });

        let article = articlesCache.find(a => a.id === id);
        if (!article) {
            article = { id, title: body.title || 'Artikel', status: status || 'published' };
            articlesCache.unshift(article);
        }

        Object.assign(article, body);
        if (status) {
            article.status = status;
            if (status === 'trashed') {
                article.deletedAt = deletedAt || new Date().toISOString();
            } else {
                delete article.deletedAt;
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Artikel berhasil diperbarui di cloud.',
            data: article
        });
    }

    // DELETE /api/articles (Permanent Delete / Empty Trash)
    if (req.method === 'DELETE') {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
        }
        const action = (req.query && req.query.action) || (body && body.action);
        if (action === 'empty_trash') {
            articlesCache = articlesCache.filter(a => a.status !== 'trashed');
            return res.status(200).json({
                success: true,
                message: 'Semua artikel di tempat sampah berhasil dibersihkan.'
            });
        }

        const id = (req.query && req.query.id) || (body && body.id);
        if (!id) return res.status(400).json({ success: false, message: 'ID artikel diperlukan.' });

        articlesCache = articlesCache.filter(a => a.id !== id);
        return res.status(200).json({
            success: true,
            message: 'Artikel telah dihapus secara permanen dari server cloud.'
        });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
