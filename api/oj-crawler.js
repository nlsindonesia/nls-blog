// ==============================================================================
// NLS LMS - Virtual Judge (VJudge) Style Online Judge Crawler & Parser
// Supports CSES, AtCoder, Codeforces (API + Presets), and Smart Raw Parser
// ==============================================================================

import https from 'https';
import http from 'http';

/**
 * Robust HTTP/HTTPS GET with automatic redirect following and custom headers
 */
function fetchUrl(url, maxRedirects = 3) {
    return new Promise((resolve, reject) => {
        if (maxRedirects < 0) return reject(new Error('Too many redirects'));
        const u = new URL(url);
        const isHttps = u.protocol === 'https:';
        const client = isHttps ? https : http;

        const options = {
            hostname: u.hostname,
            port: u.port || (isHttps ? 443 : 80),
            path: u.pathname + u.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,id;q=0.8'
            }
        };

        const req = client.request(options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                const nextUrl = new URL(res.headers.location, url).toString();
                return resolve(fetchUrl(nextUrl, maxRedirects - 1));
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
        });

        req.on('error', reject);
        req.setTimeout(12000, () => {
            req.destroy();
            reject(new Error('Connection timeout to ' + u.hostname));
        });
        req.end();
    });
}

function cleanHtmlText(str) {
    if (!str) return '';
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<li[^>]*>/gi, '• ')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// ------------------------------------------------------------------------------
// 1. CSES PROBLEM PARSER (cses.fi)
// ------------------------------------------------------------------------------
export async function parseCsesProblem(query) {
    let taskId = '';
    const match = query.match(/task\/(\d+)/i) || query.match(/(\d{3,5})/);
    if (match) taskId = match[1];
    if (!taskId) throw new Error('ID tugas CSES tidak valid (contoh: 1068 atau link cses.fi/problemset/task/1068)');

    const targetUrl = `https://cses.fi/problemset/task/${taskId}`;
    const res = await fetchUrl(targetUrl);
    if (res.status !== 200) throw new Error(`Gagal mengambil soal CSES #${taskId} (HTTP ${res.status})`);
    const html = res.data;

    // Title
    const titleMatch = html.match(/<div class="title-block">[\s\S]*?<h1>([^<]+)<\/h1>/);
    const title = titleMatch ? titleMatch[1].trim() : `CSES ${taskId}`;

    // Time & memory limits
    const timeMatch = html.match(/Time limit:<\/b>\s*([0-9.]+)\s*s/i);
    const memMatch = html.match(/Memory limit:<\/b>\s*([0-9.]+)\s*MB/i);
    const timeLimit = timeMatch ? parseFloat(timeMatch[1]) : 1.0;
    const memoryLimit = memMatch ? parseInt(memMatch[1]) : 512;

    // Sections
    const inputMatch = html.match(/<h1 id="input">Input<\/h1>([\s\S]*?)<h1/);
    const outputMatch = html.match(/<h1 id="output">Output<\/h1>([\s\S]*?)<h1/);
    const constrMatch = html.match(/<h1 id="constraints">Constraints<\/h1>([\s\S]*?)<h1/);
    const exampleMatch = html.match(/<h1 id="example(?:s)?">Example(?:s)?<\/h1>([\s\S]*?)(?:<\/div>|$)/);

    // Problem Description (content before <h1 id="input">)
    const contentBeforeInput = html.match(/<div class="content">([\s\S]*?)<h1 id="input">/);
    let rawDesc = contentBeforeInput ? contentBeforeInput[1] : '';
    // Strip out script/style/katex preamble and time/memory blocks
    rawDesc = rawDesc
        .replace(/Time limit:[\s\S]*?MB/i, '')
        .replace(/addEventListener\("DOMContentLoaded"[\s\S]*?\}\);/g, '')
        .replace(/\.katex[\s\S]*?\}/g, '');
    const problemDescription = cleanHtmlText(rawDesc);

    const inputFormat = cleanHtmlText(inputMatch ? inputMatch[1] : '');
    const outputFormat = cleanHtmlText(outputMatch ? outputMatch[1] : '');
    const constraints = cleanHtmlText(constrMatch ? constrMatch[1] : '');

    // Parse samples
    const samples = [];
    if (exampleMatch) {
        const exampleSection = exampleMatch[1];
        // Match all Input and Output pairs (<p>Input:</p> or <b>Input:</b> followed by <pre>)
        const inRegex = /(?:<p>|<b>)?\s*Input:\s*(?:<\/p>|<\/b>)?\s*<pre>([\s\S]*?)<\/pre>/gi;
        const outRegex = /(?:<p>|<b>)?\s*Output:\s*(?:<\/p>|<\/b>)?\s*<pre>([\s\S]*?)<\/pre>/gi;
        const inBlocks = [...exampleSection.matchAll(inRegex)].map(m => m[1].trim());
        const outBlocks = [...exampleSection.matchAll(outRegex)].map(m => m[1].trim());

        for (let i = 0; i < Math.max(inBlocks.length, outBlocks.length); i++) {
            samples.push({
                input: inBlocks[i] || '',
                output: outBlocks[i] || '',
                explanation: `Contoh #${i + 1} CSES`
            });
        }
    }

    // Category from sidebar
    const catMatch = html.match(/<div class="nav sidebar">[\s\S]*?<h4>([^<]+)<\/h4>/i);
    const category = catMatch ? catMatch[1].trim() : 'Introductory Problems';

    let topicTags = 'implementation';
    let difficulty = 'Mudah';
    const catLower = category.toLowerCase();
    if (catLower.includes('introductory')) {
        topicTags = 'implementation, math';
        difficulty = 'Mudah';
    } else if (catLower.includes('sorting')) {
        topicTags = 'searching: binary search, two pointers, greedy';
        difficulty = 'Sedang';
    } else if (catLower.includes('dynamic')) {
        topicTags = 'dynamic programming';
        difficulty = 'Sedang';
    } else if (catLower.includes('graph')) {
        topicTags = 'graph: traversal, graph: shortest path';
        difficulty = 'Sulit';
    } else if (catLower.includes('range')) {
        topicTags = 'data structure: segment tree, data structure: fenwick tree';
        difficulty = 'Sulit';
    } else if (catLower.includes('tree')) {
        topicTags = 'tree: lowest common ancestor, tree: flattening';
        difficulty = 'Sulit';
    } else if (catLower.includes('math')) {
        topicTags = 'math: number theory, math: combinatorics';
        difficulty = 'Sedang';
    } else if (catLower.includes('string')) {
        topicTags = 'string: hashing, string: knuth-morris-pratt';
        difficulty = 'Sulit';
    } else if (catLower.includes('geometry')) {
        topicTags = 'geometry: convex hull';
        difficulty = 'Sulit';
    } else {
        topicTags = 'implementation, advanced';
        difficulty = 'OSN / KSN';
    }

    return {
        platform: 'CSES',
        sourceId: taskId,
        sourceUrl: targetUrl,
        title: `${title} (CSES ${taskId})`,
        timeLimit,
        memoryLimit,
        difficulty,
        topicTags,
        tags: topicTags,
        problemDescription,
        inputFormat,
        outputFormat,
        constraints,
        samples,
        testCases: samples.map((s, idx) => ({
            input: s.input,
            output: s.output,
            points: Math.round(100 / Math.max(1, samples.length)),
            isHidden: idx > 0
        }))
    };
}

// ------------------------------------------------------------------------------
// 2. ATCODER PROBLEM PARSER (atcoder.jp)
// ------------------------------------------------------------------------------
export async function parseAtCoderProblem(query) {
    // Format: https://atcoder.jp/contests/abc300/tasks/abc300_a or abc300_a
    let contest = '';
    let task = '';

    const urlMatch = query.match(/contests\/([a-zA-Z0-9_-]+)\/tasks\/([a-zA-Z0-9_-]+)/i);
    if (urlMatch) {
        contest = urlMatch[1];
        task = urlMatch[2];
    } else {
        const parts = query.trim().split(/[_\s]+/);
        if (parts.length >= 2) {
            contest = parts[0];
            task = query.trim().replace(/\s+/g, '_');
        } else {
            const taskStr = query.trim().toLowerCase();
            const prefix = taskStr.split('_')[0];
            contest = prefix;
            task = taskStr;
        }
    }

    if (!contest || !task) throw new Error('Format AtCoder tidak valid (contoh: https://atcoder.jp/contests/abc300/tasks/abc300_a atau abc300_a)');

    const targetUrl = `https://atcoder.jp/contests/${contest}/tasks/${task}`;
    const res = await fetchUrl(targetUrl);
    if (res.status !== 200) throw new Error(`Gagal mengambil soal AtCoder (${targetUrl}) (HTTP ${res.status})`);
    const html = res.data;

    // Title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    let title = titleMatch ? titleMatch[1].replace(/- AtCoder/i, '').trim() : task.toUpperCase();

    // Time & memory limits
    const timeMatch = html.match(/Time Limit:\s*([0-9.]+)\s*sec/i);
    const memMatch = html.match(/Memory Limit:\s*([0-9.]+)\s*MB/i);
    const timeLimit = timeMatch ? parseFloat(timeMatch[1]) : 2.0;
    const memoryLimit = memMatch ? parseInt(memMatch[1]) : 1024;

    // Prefer English section if available
    let englishBlock = html;
    const enMatch = html.match(/<span class="lang-en">([\s\S]*?)<\/span>/i);
    if (enMatch) englishBlock = enMatch[1];

    // Problem statement
    const statementMatch = englishBlock.match(/<h3>Problem Statement<\/h3>([\s\S]*?)(?:<h3>Constraints<\/h3>|<h3>Input<\/h3>|$)/i);
    const constrMatch = englishBlock.match(/<h3>Constraints<\/h3>([\s\S]*?)<h3>Input<\/h3>/i);
    const inputMatch = englishBlock.match(/<h3>Input<\/h3>([\s\S]*?)<h3>Output<\/h3>/i);
    const outputMatch = englishBlock.match(/<h3>Output<\/h3>([\s\S]*?)(?:<hr\s*\/?>|<h3>Sample Input|$)/i);

    const problemDescription = cleanHtmlText(statementMatch ? statementMatch[1] : '');
    const constraints = cleanHtmlText(constrMatch ? constrMatch[1] : '');
    const inputFormat = cleanHtmlText(inputMatch ? inputMatch[1] : '');
    const outputFormat = cleanHtmlText(outputMatch ? outputMatch[1] : '');

    // Samples extraction (Sample Input 1, Sample Output 1, etc.)
    const samples = [];
    const sampleInputMatches = [...englishBlock.matchAll(/<h3>Sample Input\s*(\d+)<\/h3>[\s\S]*?<pre>([\s\S]*?)<\/pre>/gi)];
    const sampleOutputMatches = [...englishBlock.matchAll(/<h3>Sample Output\s*(\d+)<\/h3>[\s\S]*?<pre>([\s\S]*?)<\/pre>/gi)];

    for (let i = 0; i < Math.min(sampleInputMatches.length, sampleOutputMatches.length); i++) {
        samples.push({
            input: sampleInputMatches[i][2].trim(),
            output: sampleOutputMatches[i][2].trim(),
            explanation: `Contoh Kasus Uji #${i + 1} AtCoder`
        });
    }

    return {
        platform: 'AtCoder',
        sourceId: task,
        sourceUrl: targetUrl,
        title: `${title} (${task.toUpperCase()})`,
        timeLimit,
        memoryLimit,
        difficulty: task.toLowerCase().endsWith('_a') ? 'Mudah' : (task.toLowerCase().endsWith('_b') ? 'Mudah' : (task.toLowerCase().endsWith('_c') ? 'Sedang' : 'Sulit')),
        topicTags: 'implementation, math',
        tags: 'implementation, math',
        problemDescription,
        inputFormat,
        outputFormat,
        constraints,
        samples,
        testCases: samples.map((s, idx) => ({
            input: s.input,
            output: s.output,
            points: Math.round(100 / Math.max(1, samples.length)),
            isHidden: idx > 0
        }))
    };
}

// ------------------------------------------------------------------------------
// 3. CODEFORCES PROBLEM PARSER & PRESET LIBRARY
// ------------------------------------------------------------------------------
// Pustaka konten siap pakai untuk soal-soal Codeforces paling populer di dunia
const POPULAR_CF_PROBLEMS = {
    '4A': {
        title: 'A. Watermelon',
        timeLimit: 1.0,
        memoryLimit: 64,
        difficulty: 'Mudah',
        rating: 800,
        topicTags: 'brute force, math',
        problemDescription: 'Suatu hari musim panas yang panas, Pete dan temannya Billy memutuskan untuk membeli sebuah semangka. Mereka memilih yang paling besar dan paling matang menurut pendapat mereka. Setelah ditimbang, semangka tersebut memiliki berat $w$ kilo.\n\nMereka bergegas pulang dengan kehausan yang luar biasa dan memutuskan untuk membagi buah tersebut. Namun, mereka menghadapi masalah berat:\n\nPete dan Billy adalah penggemar berat bilangan genap. Oleh karena itu, mereka ingin membagi semangka menjadi dua bagian sedemikian rupa sehingga berat masing-masing bagian bernilai sebuah bilangan bulat genap positif (tidak harus sama besar).\n\nBantu Pete dan Billy mencari tahu apakah mereka dapat membagi semangka tersebut sesuai keinginan mereka.',
        inputFormat: 'Baris pertama dan satu-satunya berisi sebuah bilangan bulat $w$ ($1 \\le w \\le 100$) — berat semangka yang dibeli oleh Pete dan Billy.',
        outputFormat: 'Cetak "YES", jika mereka dapat membagi semangka menjadi dua bagian dengan masing-masing bagian bernilai genap; jika tidak, cetak "NO" (tanpa tanda kutip).',
        constraints: '$1 \\le w \\le 100$\nMemori: 64 MB, Waktu: 1.0 detik',
        samples: [
            { input: '8', output: 'YES', explanation: 'Misalnya, semangka dapat dibagi menjadi dua bagian dengan berat 2 dan 6 kilo (atau 4 dan 4 kilo).' },
            { input: '2', output: 'NO', explanation: 'Semangka seberat 2 kilo hanya bisa dibagi menjadi 1 dan 1 (keduanya ganjil).' }
        ],
        editorial: 'Semangka dengan berat $w$ genap dapat dibagi menjadi 2 dan $w - 2$. Jika $w$ bernilai genap dan lebih besar dari 2 ($w > 2$), maka jawabannya adalah YES. Untuk $w = 2$, hanya dapat dibagi menjadi 1 dan 1 (ganjil), sehingga NO.'
    },
    '71A': {
        title: 'A. Way Too Long Words',
        timeLimit: 1.0,
        memoryLimit: 256,
        difficulty: 'Mudah',
        rating: 800,
        topicTags: 'string, implementation',
        problemDescription: 'Terkadang beberapa kata seperti "localization" atau "internationalization" sangat panjang sehingga menulisnya berulang-ulang dalam sebuah teks menjadi sangat membosankan.\n\nMari kita anggap sebuah kata "terlalu panjang" jika panjang karakternya strictly lebih dari 10 karakter. Semua kata yang terlalu panjang harus diganti dengan singkatan khusus.\n\nSingkatan ini dibuat sebagai berikut: kita menuliskan huruf pertama dan huruf terakhir dari kata tersebut, dan di antara keduanya kita menuliskan jumlah huruf di antara huruf pertama dan huruf terakhir tersebut dalam bentuk angka desimal.\n\nContohnya, "localization" disingkat menjadi "l10n", dan "internationalization" menjadi "i18n".\n\nKata yang panjangnya tidak lebih dari 10 karakter tidak perlu diubah.',
        inputFormat: 'Baris pertama berisi sebuah bilangan bulat $n$ ($1 \\le n \\le 100$). Setiap baris dari $n$ baris berikutnya berisi satu kata berupa huruf kecil latin dengan panjang 1 hingga 100 karakter.',
        outputFormat: 'Cetak $n$ baris. Baris ke-$i$ harus berisi hasil penggantian kata ke-$i$ dari data masukan.',
        constraints: '$1 \\le n \\le 100$\nPanjang setiap kata antara 1 sampai 100 karakter.',
        samples: [
            {
                input: '4\nword\nlocalization\ninternationalization\npneumonoultramicroscopicsilicovolcanoconiosis',
                output: 'word\nl10n\ni18n\np43s',
                explanation: '"word" memiliki panjang 4 (<= 10) sehingga tetap. "localization" panjang 12 -> l + 10 + n.'
            }
        ],
        editorial: 'Periksa panjang string `len = s.length()`. Jika `len > 10`, cetak `s[0] + (len - 2) + s[len - 1]`. Jika tidak, cetak string `s` secara utuh.'
    },
    '1A': {
        title: 'A. Theatre Square',
        timeLimit: 1.0,
        memoryLimit: 256,
        difficulty: 'Mudah',
        rating: 1000,
        topicTags: 'math',
        problemDescription: 'Theatre Square di ibu kota memiliki bentuk persegi panjang dengan ukuran $n \\times m$ meter. Untuk perayaan ulang tahun kota, diputuskan untuk mengaspal alun-alun dengan ubin granit persegi berukuran $a \\times a$.\n\nBerapa jumlah ubin paling sedikit yang diperlukan untuk menutupi seluruh Alun-Alun? Ubin boleh menutupi area yang lebih luas dari Alun-Alun, tetapi Alun-Alun harus tertutup seluruhnya. Ubin tidak boleh dipotong/dipecahkan, dan sisi-sisi ubin harus sejajar dengan sisi-sisi Alun-Alun.',
        inputFormat: 'Baris masukan berisi tiga bilangan bulat positif: $n$, $m$, dan $a$ ($1 \\le n, m, a \\le 10^9$).',
        outputFormat: 'Cetak jumlah ubin yang diperlukan.',
        constraints: '$1 \\le n, m, a \\le 10^9$\nGunakan tipe data 64-bit integer (long long di C++).',
        samples: [
            { input: '6 6 4', output: '4', explanation: 'Diperlukan 2 ubin secara horizontal dan 2 ubin vertikal: $2 \\times 2 = 4$.' }
        ],
        editorial: 'Jumlah ubin di sisi panjang adalah $\\lceil n / a \\rceil = (n + a - 1) / a$. Jumlah di sisi lebar adalah $(m + a - 1) / a$. Total ubin adalah perkalian keduanya. Ingat gunakan bilangan bulat 64-bit (`long long`) karena hasil perkalian bisa mencapai $10^{18}$.'
    },
    '158A': {
        title: 'A. Next Round',
        timeLimit: 3.0,
        memoryLimit: 256,
        difficulty: 'Mudah',
        rating: 800,
        topicTags: 'implementation',
        problemDescription: '"Peserta yang memperoleh skor sama dengan atau lebih besar dari skor peserta di peringkat ke-$k$ akan maju ke babak berikutnya, asalkan peserta tersebut memperoleh skor positif (lebih besar dari 0)..." — demikian aturan resmi kontes.\n\nSebanyak $n$ peserta mengikuti kontes ($n \\ge k$), dan skor mereka telah diurutkan tidak menaik (skor peserta ke-$i$ tidak lebih kecil dari skor peserta ke-$(i+1)$).\n\nTentukan berapa banyak peserta yang akan maju ke babak berikutnya.',
        inputFormat: 'Baris pertama berisi dua bilangan bulat $n$ dan $k$ ($1 \\le k \\le n \\le 50$) dipisahkan oleh spasi.\nBaris kedua berisi $n$ bilangan bulat dipisahkan spasi $a_1, a_2, \\dots, a_n$ ($0 \\le a_i \\le 100$).',
        outputFormat: 'Keluarkan jumlah peserta yang maju ke babak berikutnya.',
        constraints: '$1 \\le k \\le n \\le 50$, $0 \\le a_i \\le 100$',
        samples: [
            { input: '8 5\n10 9 8 7 7 7 5 5', output: '6', explanation: 'Peserta ke-5 memiliki nilai 7. Peserta ke-1 sampai ke-6 memiliki nilai >= 7 dan > 0, jadi ada 6 orang.' },
            { input: '4 2\n0 0 0 0', output: '0', explanation: 'Semua skor bernilai 0, tidak ada yang bernilai positif.' }
        ]
    },
    '231A': {
        title: 'A. Team',
        timeLimit: 2.0,
        memoryLimit: 256,
        difficulty: 'Mudah',
        rating: 800,
        topicTags: 'brute force, greedy',
        problemDescription: 'Tiga orang sahabat, Petya, Vasya, dan Tonya, memutuskan untuk membentuk tim dan berpartisipasi dalam kompetisi pemrograman. Biasanya dalam kontes disajikan beberapa soal. Sahabat-sahabat ini hanya akan menulis solusi untuk sebuah soal jika setidaknya dua di antara mereka merasa yakin dengan solusinya; jika tidak, mereka tidak akan menulis solusi untuk soal tersebut.\n\nKontes ini memiliki $n$ buah soal. Untuk setiap soal, kita mengetahui pendapat ketiga sahabat tersebut.\n\nBantu mereka menghitung berapa banyak soal yang akan mereka selesaikan.',
        inputFormat: 'Baris pertama berisi satu bilangan bulat $n$ ($1 \\le n \\le 1000$) — jumlah soal dalam kontes.\nKemudian $n$ baris berikutnya berisi tiga bilangan bulat (0 atau 1) yang menyatakan apakah Petya, Vasya, dan Tonya yakin dengan solusi soal tersebut.',
        outputFormat: 'Cetak satu bilangan bulat — jumlah soal yang solusinya akan ditulis oleh tim.',
        constraints: '$1 \\le n \\le 1000$',
        samples: [
            { input: '3\n1 1 0\n1 1 1\n1 0 0', output: '2', explanation: 'Pada soal pertama (1+1+0=2) dan soal kedua (1+1+1=3) ada >= 2 orang yakin, jadi 2 soal ditulis.' }
        ]
    },
    '282A': {
        title: 'A. Bit++',
        timeLimit: 1.0,
        memoryLimit: 256,
        difficulty: 'Mudah',
        rating: 800,
        topicTags: 'implementation',
        problemDescription: 'Bahasa pemrograman klasik Bit++ memiliki satu variabel bernama $x$. Nilai awal $x$ adalah 0.\n\nBahasa ini memiliki dua operasi:\n• Operasi penambahan: `++X` atau `X++` menambah nilai $x$ sebesar 1.\n• Operasi pengurangan: `--X` atau `X--` mengurangi nilai $x$ sebesar 1.\n\nSebuah program dalam Bit++ terdiri dari barisan $n$ operasi. Diberikan program Bit++, hitunglah nilai akhir dari variabel $x$.',
        inputFormat: 'Baris pertama berisi bilangan bulat $n$ ($1 \\le n \\le 150$). Setiap baris dari $n$ baris berikutnya berisi satu operasi Bit++.',
        outputFormat: 'Cetak satu bilangan bulat — nilai akhir dari variabel $x$.',
        constraints: '$1 \\le n \\le 150$',
        samples: [
            { input: '1\n++X', output: '1' },
            { input: '2\nX++\n--X', output: '0' }
        ]
    },
    '263A': {
        title: 'A. Beautiful Matrix',
        timeLimit: 2.0,
        memoryLimit: 256,
        difficulty: 'Mudah',
        rating: 800,
        topicTags: 'implementation',
        problemDescription: 'Diberikan sebuah matriks berukuran $5 \\times 5$ yang terdiri dari 24 angka nol dan sebuah angka satu. Baris dan kolom matriks diberi nomor dari 1 sampai 5.\n\nMatriks dikatakan "indah" jika angka satu berada tepat di tengah matriks, yaitu pada perpotongan baris ke-3 dan kolom ke-3.\n\nDalam satu langkah, Anda diperbolehkan menukar dua baris yang bersebelahan atau menukar dua kolom yang bersebelahan.\n\nBerapa jumlah langkah minimum yang diperlukan untuk membuat matriks menjadi indah?',
        inputFormat: 'Masukan terdiri dari 5 baris, masing-masing berisi 5 bilangan bulat dipisahkan spasi (0 atau 1).',
        outputFormat: 'Cetak jumlah langkah minimum yang diperlukan.',
        constraints: 'Matriks berukuran tepat 5 x 5 dengan tepat satu angka 1.',
        samples: [
            {
                input: '0 0 0 0 0\n0 0 0 0 1\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0',
                output: '3',
                explanation: 'Angka 1 berada di baris 2 kolom 5. Jarak Manhattan ke (3, 3) adalah |2 - 3| + |5 - 3| = 1 + 2 = 3.'
            }
        ]
    },
    '50A': {
        title: 'A. Domino piling',
        timeLimit: 2.0,
        memoryLimit: 256,
        difficulty: 'Mudah',
        rating: 800,
        topicTags: 'greedy, math',
        problemDescription: 'Anda diberikan papan persegi panjang berukuran $M \\times N$ kotak. Anda juga memiliki sejumlah domino berukuran $2 \\times 1$ kotak yang tidak terbatas. Anda diizinkan untuk memutar domino.\n\nTempatkan domino sebanyak mungkin di atas papan sedemikian rupa sehingga setiap domino menutupi tepat dua kotak dan tidak ada dua domino yang saling bertumpuk.\n\nTemukan jumlah maksimum domino yang dapat ditempatkan.',
        inputFormat: 'Pada baris tunggal diberikan dua bilangan bulat $M$ dan $N$ ($1 \\le M \\le N \\le 16$).',
        outputFormat: 'Keluarkan satu bilangan bulat — jumlah maksimum domino yang dapat ditempatkan.',
        constraints: '$1 \\le M \\le N \\le 16$',
        samples: [
            { input: '2 4', output: '4', explanation: 'Papan 2x4 memiliki luas 8 kotak, dapat diisi tepat 4 domino.' },
            { input: '3 3', output: '4', explanation: 'Papan 3x3 memiliki luas 9 kotak, maksimum 4 domino (8 kotak).' }
        ]
    },
    '112A': {
        title: 'A. Petya and Strings',
        timeLimit: 2.0,
        memoryLimit: 256,
        difficulty: 'Mudah',
        rating: 800,
        topicTags: 'implementation, string',
        problemDescription: 'Petya menyukai hadiah! Pada hari ulang tahunnya, dia mendapatkan dua buah string dengan panjang yang sama. Huruf-huruf dalam string dapat berupa huruf besar maupun huruf kecil latin.\n\nSekarang Petya ingin membandingkan kedua string tersebut secara leksikografis (seperti urutan di kamus). Huruf besar dan huruf kecil dianggap sama (case-insensitive).\n\nBantu Petya melakukan perbandingan tersebut.',
        inputFormat: 'Dua baris masing-masing berisi sebuah string dengan panjang 1 hingga 100 karakter latin.',
        outputFormat: 'Jika string pertama lebih kecil dari string kedua, cetak "-1". Jika string kedua lebih kecil dari string pertama, cetak "1". Jika kedua string sama, cetak "0".',
        constraints: 'Panjang string antara 1 sampai 100 karakter.',
        samples: [
            { input: 'aaaa\naaaA', output: '0', explanation: 'Keduanya sama besar karena case-insensitive.' },
            { input: 'abs\nAbz', output: '-1', explanation: '"abs" lebih kecil dari "abz".' }
        ]
    },
    '617A': {
        title: 'A. Elephant',
        timeLimit: 1.0,
        memoryLimit: 256,
        difficulty: 'Mudah',
        rating: 800,
        topicTags: 'math',
        problemDescription: 'Seekor gajah ingin mengunjungi temannya. Titik koordinat rumah gajah adalah 0, dan rumah temannya berada di titik koordinat $x$ ($x > 0$) pada garis bilangan.\n\nDalam satu langkah, sang gajah dapat melangkah sejauh 1, 2, 3, 4, atau 5 posisi ke depan.\n\nTentukan jumlah langkah minimum yang harus dilakukan gajah untuk mencapai rumah temannya.',
        inputFormat: 'Satu baris berisi sebuah bilangan bulat $x$ ($1 \\le x \\le 1\\,000\\,000$) — koordinat rumah teman.',
        outputFormat: 'Cetak jumlah langkah minimum yang diperlukan sang gajah.',
        constraints: '$1 \\le x \\le 10^6$',
        samples: [
            { input: '5', output: '1', explanation: 'Gajah bisa melangkah langsung sebesar 5.' },
            { input: '12', output: '3', explanation: 'Langkah: 5 + 5 + 2 = 12 (3 langkah).' }
        ]
    },
    '977A': {
        title: 'A. Wrong Subtraction',
        timeLimit: 1.0,
        memoryLimit: 256,
        difficulty: 'Mudah',
        rating: 800,
        topicTags: 'implementation',
        problemDescription: 'Tanya sedang belajar pengurangan. Namun dia menggunakan algoritma pengurangan yang salah:\n\n• Jika digit terakhir dari bilangan bukan nol, dia mengurangi bilangan tersebut dengan 1.\n• Jika digit terakhir dari bilangan adalah nol, dia membagi bilangan tersebut dengan 10 (menghilangkan digit nol terakhir).\n\nDiberikan bilangan bulat $n$, Tanya akan melakukan pengurangan sebanyak $k$ kali. Tentukan nilai akhir setelah $k$ kali pengurangan.',
        inputFormat: 'Satu baris berisi dua bilangan bulat $n$ dan $k$ ($2 \\le n \\le 10^9$, $1 \\le k \\le 50$).',
        outputFormat: 'Cetak satu bilangan bulat — hasil akhir bilangan setelah $k$ kali pengurangan salah Tanya.',
        constraints: '$2 \\le n \\le 10^9$, $1 \\le k \\le 50$',
        samples: [
            { input: '512 4', output: '49', explanation: 'Langkah: 512 -> 511 -> 510 -> 51 -> 50 (pada k=4, 512->511->510->51->50? 512-1=511, 511-1=510, 510/10=51, 51-1=50, etc).' },
            { input: '1000000000 9', output: '1', explanation: 'Digit nol dipotong berturut-turut sebanyak 9 kali.' }
        ]
    }
};

export async function parseCodeforcesProblem(query) {
    // Format: 4A, 71A, https://codeforces.com/problemset/problem/4/A, etc.
    let contestId = '';
    let index = '';

    const urlMatch = query.match(/problemset\/problem\/(\d+)\/([a-zA-Z0-9]+)/i) || 
                     query.match(/contest\/(\d+)\/problem\/([a-zA-Z0-9]+)/i);
    if (urlMatch) {
        contestId = urlMatch[1];
        index = urlMatch[2].toUpperCase();
    } else {
        const idMatch = query.trim().match(/^(\d+)\s*([a-zA-Z0-9]+)$/);
        if (idMatch) {
            contestId = idMatch[1];
            index = idMatch[2].toUpperCase();
        }
    }

    if (!contestId || !index) throw new Error('Format Codeforces tidak valid (contoh: 4A, 71A, atau link https://codeforces.com/problemset/problem/4/A)');

    const key = `${contestId}${index}`;
    const targetUrl = `https://codeforces.com/problemset/problem/${contestId}/${index}`;

    // 1. Cek apakah ada di pustaka preset populer lokal
    if (POPULAR_CF_PROBLEMS[key]) {
        const p = POPULAR_CF_PROBLEMS[key];
        return {
            platform: 'Codeforces',
            sourceId: key,
            sourceUrl: targetUrl,
            title: `${p.title} (Codeforces ${key})`,
            timeLimit: p.timeLimit,
            memoryLimit: p.memoryLimit,
            difficulty: p.difficulty,
            rating: p.rating,
            topicTags: p.topicTags,
            tags: p.topicTags,
            problemDescription: p.problemDescription,
            inputFormat: p.inputFormat,
            outputFormat: p.outputFormat,
            constraints: p.constraints,
            samples: p.samples || [],
            editorial: p.editorial || '',
            testCases: (p.samples || []).map((s, idx) => ({
                input: s.input,
                output: s.output,
                points: Math.round(100 / Math.max(1, (p.samples || []).length)),
                isHidden: idx > 0
            }))
        };
    }

    // 2. Jika tidak ada di preset lokal, panggil API Resmi Codeforces untuk mengambil data metadata resmi
    let officialProblem = null;
    try {
        const apiRes = await fetchUrl('https://codeforces.com/api/problemset.problems');
        if (apiRes.status === 200) {
            const apiJson = JSON.parse(apiRes.data);
            if (apiJson && apiJson.result && Array.isArray(apiJson.result.problems)) {
                officialProblem = apiJson.result.problems.find(p => p.contestId == contestId && p.index.toUpperCase() === index);
            }
        }
    } catch (e) {
        console.warn('CF API call failed:', e.message);
    }

    const title = officialProblem ? `${officialProblem.index}. ${officialProblem.name}` : `Codeforces ${key}`;
    const rating = officialProblem ? officialProblem.rating : 1200;
    const topicTags = (officialProblem && officialProblem.tags) ? officialProblem.tags.join(', ') : 'implementation, math';

    let difficulty = 'Sedang';
    if (rating <= 1000) difficulty = 'Mudah';
    else if (rating <= 1500) difficulty = 'Sedang';
    else if (rating <= 2100) difficulty = 'Sulit';
    else difficulty = 'ICPC';

    return {
        platform: 'Codeforces',
        sourceId: key,
        sourceUrl: targetUrl,
        title: `${title} (Codeforces ${key})`,
        timeLimit: 1.0,
        memoryLimit: 256,
        difficulty,
        rating,
        topicTags,
        tags: topicTags,
        problemDescription: `Diberikan permasalahan resmi dari Codeforces #${contestId}${index}. Silakan buka link sumber untuk melihat detail lengkap soal dan formula matematika.`,
        inputFormat: 'Sesuai spesifikasi resmi pada halaman soal Codeforces.',
        outputFormat: 'Sesuai spesifikasi resmi pada halaman soal Codeforces.',
        constraints: `Rating Codeforces: ${rating} | Kategori: ${topicTags}`,
        samples: [
            { input: 'Contoh input', output: 'Contoh output', explanation: 'Sesuaikan dengan contoh kasus uji di Codeforces.' }
        ],
        testCases: [
            { input: 'Contoh input', output: 'Contoh output', points: 100, isHidden: false }
        ],
        needsSmartPaste: true
    };
}

// ------------------------------------------------------------------------------
// 4. SMART RAW TEXT / HTML PARSER (UNTUK PLATFORM APA PUN / PASTE INSTAN)
// ------------------------------------------------------------------------------
export function parseRawProblemText(rawContent) {
    if (!rawContent || !rawContent.trim()) throw new Error('Teks soal mentah tidak boleh kosong.');

    let text = rawContent.trim();

    // Check if HTML, convert basic line breaks
    if (text.includes('<div') || text.includes('<p>') || text.includes('<br')) {
        text = cleanHtmlText(text);
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // Heuristic 1: Title (usually line 1)
    let title = lines[0] || 'Soal Pemrograman';
    if (title.length > 80) title = title.substring(0, 80) + '...';

    // Heuristic 2: Time and memory limit
    let timeLimit = 1.0;
    const timeMatch = text.match(/(?:time limit|batas waktu|time)[\s:]*([0-9.]+)\s*(?:s|detik|sec|ms)/i);
    if (timeMatch) {
        let val = parseFloat(timeMatch[1]);
        if (timeMatch[0].toLowerCase().includes('ms')) val = val / 1000;
        timeLimit = Math.max(0.1, val);
    }

    let memoryLimit = 256;
    const memMatch = text.match(/(?:memory limit|batas memori|memory)[\s:]*([0-9]+)\s*(?:mb|megabytes|kb)/i);
    if (memMatch) {
        let val = parseInt(memMatch[1]);
        if (memMatch[0].toLowerCase().includes('kb')) val = Math.round(val / 1024);
        memoryLimit = Math.max(16, val);
    }

    // Heuristic 3: Sections (Deskripsi, Input, Output, Constraints, Samples)
    let desc = '';
    let inputFmt = '';
    let outputFmt = '';
    let constr = '';
    const samples = [];

    // Split by common section markers
    const inputMarkerRegex = /(?:format masukan|input format|input specification|input:)/i;
    const outputMarkerRegex = /(?:format keluaran|output format|output specification|output:)/i;
    const constrMarkerRegex = /(?:batasan|constraints|subsoal|subtasks:)/i;
    const sampleMarkerRegex = /(?:contoh masukan|sample input|example 1|sample 1)/i;

    const lower = text.toLowerCase();
    const idxInput = lower.search(inputMarkerRegex);
    const idxOutput = lower.search(outputMarkerRegex);
    const idxConstr = lower.search(constrMarkerRegex);
    const idxSample = lower.search(sampleMarkerRegex);

    if (idxInput !== -1) {
        desc = text.substring(0, idxInput).trim();
        const endInput = (idxOutput !== -1 && idxOutput > idxInput) ? idxOutput : (idxConstr !== -1 && idxConstr > idxInput ? idxConstr : text.length);
        inputFmt = text.substring(idxInput, endInput).replace(inputMarkerRegex, '').trim();
    } else {
        desc = text.substring(0, Math.min(text.length, 600)).trim();
    }

    if (idxOutput !== -1) {
        const endOutput = (idxConstr !== -1 && idxConstr > idxOutput) ? idxConstr : (idxSample !== -1 && idxSample > idxOutput ? idxSample : text.length);
        outputFmt = text.substring(idxOutput, endOutput).replace(outputMarkerRegex, '').trim();
    }

    if (idxConstr !== -1) {
        const endConstr = (idxSample !== -1 && idxSample > idxConstr) ? idxSample : text.length;
        constr = text.substring(idxConstr, endConstr).replace(constrMarkerRegex, '').trim();
    }

    // Heuristic 4: Sample extraction
    const sampleBlockMatches = [...text.matchAll(/(?:sample input|contoh masukan|input)[^\n]*\n([\s\S]*?)(?:sample output|contoh keluaran|output)[^\n]*\n([\s\S]*?)(?=(?:sample input|contoh masukan|input|$))/gi)];
    if (sampleBlockMatches.length > 0) {
        sampleBlockMatches.slice(0, 5).forEach((m, i) => {
            const inPart = m[1].trim().split('\n\n')[0].trim();
            const outPart = m[2].trim().split('\n\n')[0].trim();
            if (inPart || outPart) {
                samples.push({
                    input: inPart,
                    output: outPart,
                    explanation: `Contoh #${i + 1}`
                });
            }
        });
    }

    if (samples.length === 0) {
        samples.push({ input: '1', output: '1', explanation: '' });
    }

    return {
        platform: 'SmartParser',
        title: title || 'Soal Pemrograman Baru',
        timeLimit,
        memoryLimit,
        difficulty: 'Sedang',
        topicTags: 'implementation',
        tags: 'implementation',
        problemDescription: desc || text,
        inputFormat: inputFmt,
        outputFormat: outputFmt,
        constraints: constr,
        samples,
        testCases: samples.map((s, idx) => ({
            input: s.input,
            output: s.output,
            points: Math.round(100 / Math.max(1, samples.length)),
            isHidden: idx > 0
        }))
    };
}

// ------------------------------------------------------------------------------
// 5. MASTER DISPATCHER
// ------------------------------------------------------------------------------
export async function fetchExternalProblem({ url = '', platform = '', problemId = '', rawContent = '' }) {
    // 1. If raw content is provided, use Smart Parser
    if (rawContent && rawContent.trim()) {
        return parseRawProblemText(rawContent);
    }

    const targetQuery = (url || problemId || '').trim();
    if (!targetQuery) throw new Error('Harap masukkan URL soal atau kode ID soal.');

    // Auto-detect platform from URL or query
    const lower = targetQuery.toLowerCase();
    if (platform === 'cses' || lower.includes('cses.fi') || lower.startsWith('cses')) {
        return parseCsesProblem(targetQuery);
    }
    if (platform === 'atcoder' || lower.includes('atcoder.jp') || lower.startsWith('atcoder') || lower.startsWith('abc') || lower.startsWith('arc')) {
        return parseAtCoderProblem(targetQuery);
    }
    if (platform === 'codeforces' || lower.includes('codeforces.com') || /^\d+[a-zA-Z]/.test(targetQuery)) {
        return parseCodeforcesProblem(targetQuery);
    }

    // Default heuristics:
    if (/^\d{3,5}$/.test(targetQuery)) {
        // purely numbers like 1068 -> CSES
        return parseCsesProblem(targetQuery);
    }
    if (/^\d+[a-zA-Z]\d?$/.test(targetQuery)) {
        // like 4A or 71A -> Codeforces
        return parseCodeforcesProblem(targetQuery);
    }

    // Fallback: Try CSES first, then Codeforces
    try {
        return await parseCsesProblem(targetQuery);
    } catch(e) {
        return await parseCodeforcesProblem(targetQuery);
    }
}
