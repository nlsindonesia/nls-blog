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

export function autoFormatLatex(str) {
    if (!str) return '';
    let text = String(str);

    // 1. Convert KaTeX / MathJax HTML tags if any HTML is passed
    text = text.replace(/<span[^>]*class=["'][^"']*math-display[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi, (m, c) => `\n\n$$${c.trim()}$$\n\n`);
    text = text.replace(/<div[^>]*class=["'][^"']*math-display[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi, (m, c) => `\n\n$$${c.trim()}$$\n\n`);
    text = text.replace(/<span[^>]*class=["'][^"']*(?:math-inline|math|tex-span)[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi, (m, c) => `$${c.trim()}$`);
    text = text.replace(/<var\b[^>]*>([\s\S]*?)<\/var>/gi, (m, c) => `$${c.trim()}$`);

    // 2. Normalize Codeforces triple dollars: $$$x$$$ -> $x$
    text = text.replace(/\$\$\$\s*([\s\S]*?)\s*\$\$\$/g, (m, c) => `$${c.trim()}$`);

    // 3. Normalize LaTeX bracket delimiters \( ... \) and \[ ... \]
    text = text.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (m, c) => `$${c.trim()}$`);
    text = text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (m, c) => `\n\n$$${c.trim()}$$\n\n`);

    // 4. Split by existing $ blocks to protect already delimited formulas
    const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);

    for (let i = 0; i < parts.length; i += 2) {
        let seg = parts[i];
        if (!seg) continue;

        const lines = seg.split('\n');
        const processedLines = lines.map(line => {
            let l = line;
            const hasLatexCmd = /\\(?:le|ge|cdot|dots|times|sim|approx|neq|to|sum|prod|frac|sqrt|binom|mathcal|mathbf|pmod|gcd|alpha|beta|gamma|delta|pi|theta|infty|in|notin)\b/.test(l);
            
            if (hasLatexCmd) {
                // Bullet lines (constraints), e.g. "• 1 \le n \le 2 \cdot 10^5"
                const bulletMatch = l.match(/^(\s*[•\-\*]\s*)(.+)$/);
                if (bulletMatch) {
                    const bullet = bulletMatch[1];
                    const rest = bulletMatch[2].trim();
                    if (!rest.includes('$') && /\\(?:le|ge|cdot|dots|times|neq|<|>|=|10\^)/.test(rest)) {
                        return `${bullet}$${rest}$`;
                    }
                }

                // Bare constraint line without bullet: "1 \le n \le 2 \cdot 10^5"
                const trimmed = l.trim();
                if (!trimmed.includes('$') && /^([0-9a-zA-Z\\_^{}\s,.<>=+\-*\/|~:()]+?\\(?:le|ge|cdot|times|sim|neq)[0-9a-zA-Z\\_^{}\s,.<>=+\-*\/|~:()]*)$/.test(trimmed)) {
                    return l.replace(trimmed, `$${trimmed}$`);
                }

                // Subscript sequences in sentences: "x_1,x_2,\dots,x_n" or "a_1, a_2, \dots, a_n"
                l = l.replace(/\b([a-zA-Z][0-9a-zA-Z_^{}]*(?:,\s*[a-zA-Z0-9_^{}]*)*,\s*\\dots\s*,\s*[a-zA-Z0-9_^{}]+)\b/g, (m) => `$${m.trim()}$`);

                // Named macros: \mathcal{O}(N), etc.
                l = l.replace(/(\\(?:mathcal|mathbf|operatorname)\{[a-zA-Z0-9]+\}(?:\([^\)]+\))?)/g, (m) => `$${m}$`);
                l = l.replace(/(\\(?:sum|prod|int)(?:_[a-zA-Z0-9{}=]+)?(?:\^[a-zA-Z0-9{}]+)?)/g, (m) => `$${m}$`);
                l = l.replace(/(\\(?:frac|binom)\{[^{}]*\}\{[^{}]*\})/g, (m) => `$${m}$`);

                // In-sentence comparisons with \le, \ge: "1 \le n \le 10^5"
                l = l.replace(/(?<!\$)\b([0-9a-zA-Z_^{}]+\s*\\(?:le|ge|cdot|times|neq)\s*[0-9a-zA-Z\\_^{}\s,.<>=+\-*\/^]+?)(?=[.,;:\s]?(?:\s+[a-zA-Z]{3,}|$|\.\s))/g, (m) => {
                    const tr = m.trim();
                    if (tr.includes('$')) return m;
                    return `$${tr}$`;
                });
            }
            return l;
        });
        parts[i] = processedLines.join('\n');
    }

    return parts.join('');
}

function cleanHtmlText(str, baseUrl = 'https://codeforces.com') {
    if (!str) return '';
    let res = str;

    // 1. Preserve math formulas from HTML tags BEFORE stripping any tags
    res = res.replace(/<span[^>]*class=["'][^"']*math-display[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi, (m, c) => `\n\n$$${c.trim()}$$\n\n`);
    res = res.replace(/<div[^>]*class=["'][^"']*math-display[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi, (m, c) => `\n\n$$${c.trim()}$$\n\n`);
    res = res.replace(/<span[^>]*class=["'][^"']*(?:math-inline|math|tex-span)[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi, (m, c) => `$${c.trim()}$`);
    res = res.replace(/<var\b[^>]*>([\s\S]*?)<\/var>/gi, (m, c) => `$${c.trim()}$`);
    res = res.replace(/\$\$\$\s*([\s\S]*?)\s*\$\$\$/g, (m, c) => `$${c.trim()}$`);
    res = res.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (m, c) => `$${c.trim()}$`);
    res = res.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (m, c) => `\n\n$$${c.trim()}$$\n\n`);

    // 2. Preserve images with absolute URLs before stripping other tags
    res = res.replace(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi, (m, src) => {
        let fullSrc = src.trim();
        if (fullSrc.startsWith('//')) fullSrc = 'https:' + fullSrc;
        else if (fullSrc.startsWith('/') && baseUrl) fullSrc = baseUrl.replace(/\/+$/, '') + fullSrc;
        return `___IMG_START___${fullSrc}___IMG_END___`;
    });

    // 3. Standard HTML cleanup
    res = res
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

    // 4. Restore images as styled HTML img tags
    res = res.replace(/___IMG_START___([\s\S]*?)___IMG_END___/g, (m, src) => {
        return `<img src="${src}" alt="Ilustrasi" style="max-width:100%; height:auto; display:block; margin:12px auto; border-radius:8px;" />`;
    });

    // 5. Guarantee any bare LaTeX is properly wrapped
    return autoFormatLatex(res);
}

/**
 * Automatically calculates test cases from samples and guarantees exactly 100 points
 */
function make100PointTestCases(samples) {
    if (!Array.isArray(samples) || samples.length === 0) {
        return [{ input: '1\n', output: '1\n', points: 100, isHidden: false }];
    }
    const count = samples.length;
    const base = Math.floor(100 / count);
    const rem = 100 % count;
    return samples.map((s, idx) => ({
        input: s.input || '',
        output: s.output || '',
        points: base + (idx === 0 ? rem : 0),
        isHidden: idx > 0
    }));
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
        testCases: make100PointTestCases(samples)
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
        testCases: make100PointTestCases(samples)
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
    // Format: 4A, 71A, 2258F, https://codeforces.com/problemset/problem/2258/F, https://codeforces.com/contest/2258/problem/F, etc.
    let contestId = '';
    let index = '';

    const urlMatch = query.match(/problemset\/problem\/(\d+)\/([a-zA-Z0-9]+)/i) || 
                     query.match(/contest\/(\d+)\/problem\/([a-zA-Z0-9]+)/i) ||
                     query.match(/gym\/(\d+)\/problem\/([a-zA-Z0-9]+)/i);
    if (urlMatch) {
        contestId = urlMatch[1];
        index = urlMatch[2].toUpperCase();
    } else {
        const cleanQ = query.trim().replace(/^(?:codeforces|cf)\s*/i, '');
        const idMatch = cleanQ.match(/^(\d+)\s*([a-zA-Z][a-zA-Z0-9]*)$/);
        if (idMatch) {
            contestId = idMatch[1];
            index = idMatch[2].toUpperCase();
        }
    }

    if (!contestId || !index) throw new Error('Format Codeforces tidak valid (contoh: 4A, 71A, 2258F, atau link https://codeforces.com/problemset/problem/2258/F)');

    const key = `${contestId}${index}`;
    const targetUrl = `https://codeforces.com/problemset/problem/${contestId}/${index}`;

    // 1. Jika query berupa kode singkat dan ada di preset lokal, gunakan preset kurasi
    const isUrl = /^https?:\/\//i.test(query.trim());
    if (!isUrl && POPULAR_CF_PROBLEMS[key]) {
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
            testCases: make100PointTestCases(p.samples || [])
        };
    }

    // 2. Ambil halaman HTML soal langsung dari Codeforces secara live
    let html = '';
    let fetchedUrl = targetUrl;
    try {
        const res = await fetchUrl(targetUrl);
        if (res.status === 200 && res.data.includes('problem-statement')) {
            html = res.data;
        } else {
            // Coba alternatif URL berbasis contest
            const contestUrl = `https://codeforces.com/contest/${contestId}/problem/${index}`;
            const resContest = await fetchUrl(contestUrl);
            if (resContest.status === 200 && resContest.data.includes('problem-statement')) {
                html = resContest.data;
                fetchedUrl = contestUrl;
            }
        }
    } catch (e) {
        console.warn('Codeforces live fetch warning:', e.message);
    }

    // 3. Jika berhasil mengambil HTML langsung dari Codeforces, ekstrak seluruh statement
    if (html && html.includes('problem-statement')) {
        const psIdx = html.indexOf('class="problem-statement"');
        let ps = html.substring(psIdx);
        const scriptIdx = ps.indexOf('<script');
        if (scriptIdx !== -1) {
            ps = ps.substring(0, scriptIdx);
        }

        // A. Title
        const titleMatch = ps.match(/<div class="title">\s*([^<]+)\s*<\/div>/);
        let title = titleMatch ? titleMatch[1].trim() : `${index}. Codeforces ${key}`;

        // B. Time limit & Memory limit
        const timeMatch = ps.match(/<div class="time-limit">[\s\S]*?<\/div>\s*([0-9.]+)\s*seconds?/i);
        const memMatch = ps.match(/<div class="memory-limit">[\s\S]*?<\/div>\s*(\d+)\s*(?:megabytes?|mb)/i);
        const timeLimit = timeMatch ? parseFloat(timeMatch[1]) : 1.0;
        const memoryLimit = memMatch ? parseInt(memMatch[1], 10) : 256;

        // C. Problem Description
        let rawDesc = '';
        const headerMatch = ps.match(/<div class="header">[\s\S]*?<\/div>\s*<\/div>/);
        const inputSpecIdx = ps.indexOf('<div class="input-specification">');
        const sampleTestsIdx = ps.indexOf('<div class="sample-tests">');

        let descEndIdx = inputSpecIdx !== -1 ? inputSpecIdx : (sampleTestsIdx !== -1 ? sampleTestsIdx : ps.length);
        if (headerMatch) {
            const descStart = headerMatch.index + headerMatch[0].length;
            rawDesc = ps.substring(descStart, descEndIdx);
        }

        // D. Input Format
        let rawInput = '';
        const outputSpecIdx = ps.indexOf('<div class="output-specification">');
        if (inputSpecIdx !== -1) {
            const inputEnd = outputSpecIdx !== -1 ? outputSpecIdx : (sampleTestsIdx !== -1 ? sampleTestsIdx : ps.length);
            rawInput = ps.substring(inputSpecIdx, inputEnd);
            rawInput = rawInput.replace(/<div class="section-title">[\s\S]*?<\/div>/i, '');
        }

        // E. Output Format
        let rawOutput = '';
        if (outputSpecIdx !== -1) {
            const outputEnd = sampleTestsIdx !== -1 ? sampleTestsIdx : ps.length;
            rawOutput = ps.substring(outputSpecIdx, outputEnd);
            rawOutput = rawOutput.replace(/<div class="section-title">[\s\S]*?<\/div>/i, '');
        }

        // F. Note / Catatan Penjelasan Kasus Uji
        let rawNote = '';
        const noteIdx = ps.indexOf('<div class="note">');
        if (noteIdx !== -1) {
            rawNote = ps.substring(noteIdx);
            rawNote = rawNote.replace(/<div class="section-title">[\s\S]*?<\/div>/i, '');
        }

        // G. Sample Cases (Mendukung multi-blok contoh & pemisahan sub-kasus uji test-example-line-N)
        const samples = [];
        const sampleTestRegex = /<div class="input">\s*(?:<div class="title">Input<\/div>\s*)?<pre>([\s\S]*?)<\/pre>\s*<\/div>\s*<div class="output">\s*(?:<div class="title">Output<\/div>\s*)?<pre>([\s\S]*?)<\/pre>\s*<\/div>/gi;
        let stMatch;
        let sIdx = 1;
        while ((stMatch = sampleTestRegex.exec(ps)) !== null) {
            const inPre = stMatch[1];
            const outPre = stMatch[2];

            // Deteksi apakah masukan memiliki sub-testcase per baris (test-example-line-1, test-example-line-2, ...)
            const inLineRegex = /<div[^>]*class=["'][^"']*test-example-line-(\d+)[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
            const outLineRegex = /<div[^>]*class=["'][^"']*test-example-line-(\d+)[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;

            const inGroups = new Map();
            const outGroups = new Map();

            let m;
            while ((m = inLineRegex.exec(inPre)) !== null) {
                const idx = parseInt(m[1], 10);
                const lineText = m[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
                if (!inGroups.has(idx)) inGroups.set(idx, []);
                inGroups.get(idx).push(lineText);
            }

            while ((m = outLineRegex.exec(outPre)) !== null) {
                const idx = parseInt(m[1], 10);
                const lineText = m[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
                if (!outGroups.has(idx)) outGroups.set(idx, []);
                outGroups.get(idx).push(lineText);
            }

            const subIndices = [...inGroups.keys()].filter(k => k > 0).sort((a, b) => a - b);

            // Jika terdapat sub-kasus uji berganda (misal k=1, k=2...) dengan pasangan output masing-masing
            if (subIndices.length > 1 && subIndices.some(k => outGroups.has(k))) {
                for (const k of subIndices) {
                    const inLines = inGroups.get(k) || [];
                    const outLines = outGroups.get(k) || [];
                    samples.push({
                        input: inLines.join('\n'),
                        output: outLines.join('\n'),
                        explanation: `Contoh #${sIdx} Codeforces`
                    });
                    sIdx++;
                }
            } else {
                const cleanSamplePre = (preHtml) => {
                    let t = preHtml;
                    t = t.replace(/<div[^>]*class=["'][^"']*test-example-line[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi, '$1\n');
                    t = t.replace(/<br\s*[\/]?>/gi, '\n');
                    t = t.replace(/<[^>]+>/g, '');
                    t = t.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
                    return t.trim();
                };

                samples.push({
                    input: cleanSamplePre(inPre),
                    output: cleanSamplePre(outPre),
                    explanation: `Contoh #${sIdx} Codeforces`
                });
                sIdx++;
            }
        }

        // H. Tags & Rating dari HTML
        const allTagBoxes = [...html.matchAll(/<span class="tag-box"[^>]*>([\s\S]*?)<\/span>/gi)].map(m => m[1].trim());
        let rating = 1200;
        let foundRating = false;
        const cleanTags = [];
        for (const tag of allTagBoxes) {
            if (tag.startsWith('*')) {
                const r = parseInt(tag.substring(1), 10);
                if (!isNaN(r)) {
                    rating = r;
                    foundRating = true;
                }
            } else {
                cleanTags.push(tag);
            }
        }

        // Jika rating belum ditemukan di tag HTML, coba periksa API Codeforces
        if (!foundRating || cleanTags.length === 0) {
            try {
                const apiRes = await fetchUrl('https://codeforces.com/api/problemset.problems');
                if (apiRes.status === 200) {
                    const apiJson = JSON.parse(apiRes.data);
                    if (apiJson && apiJson.result && Array.isArray(apiJson.result.problems)) {
                        const official = apiJson.result.problems.find(p => p.contestId == contestId && p.index.toUpperCase() === index);
                        if (official) {
                            if (official.rating) rating = official.rating;
                            if (cleanTags.length === 0 && official.tags) {
                                cleanTags.push(...official.tags);
                            }
                        }
                    }
                }
            } catch (e) {
                // Abaikan kesalahan API
            }
        }

        let difficulty = 'Sedang';
        if (rating <= 1000) difficulty = 'Mudah';
        else if (rating <= 1500) difficulty = 'Sedang';
        else if (rating <= 2100) difficulty = 'Sulit';
        else difficulty = 'ICPC';

        const topicTags = cleanTags.join(', ') || 'implementation, math';

        const problemDescription = cleanHtmlText(rawDesc);
        const inputFormat = cleanHtmlText(rawInput);
        const outputFormat = cleanHtmlText(rawOutput);
        const note = cleanHtmlText(rawNote);

        let fullDescription = problemDescription;
        if (note) {
            fullDescription += `\n\n### Catatan / Penjelasan Kasus Uji:\n${note}`;
        }

        const testCases = make100PointTestCases(samples);

        return {
            platform: 'Codeforces',
            sourceId: key,
            sourceUrl: fetchedUrl,
            title: `${title} (Codeforces ${key})`,
            timeLimit,
            memoryLimit,
            difficulty,
            rating,
            topicTags,
            tags: topicTags,
            problemDescription: fullDescription,
            inputFormat: inputFormat || 'Sesuai spesifikasi resmi pada halaman soal Codeforces.',
            outputFormat: outputFormat || 'Sesuai spesifikasi resmi pada halaman soal Codeforces.',
            constraints: `Rating Codeforces: ${rating} | Kategori: ${topicTags}`,
            samples: samples.length > 0 ? samples : [
                { input: 'Contoh input', output: 'Contoh output', explanation: 'Kasus uji Codeforces' }
            ],
            editorial: note ? `### Catatan / Penjelasan Soal (Official Note):\n\n${note}` : '',
            testCases
        };
    }

    // 4. Fallback jika live scraping gagal tapi ada di preset lokal
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
            testCases: make100PointTestCases(p.samples || [])
        };
    }

    // 5. Fallback terakhir: Ambil metadata dari API resmi jika tersedia
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
        testCases: make100PointTestCases(samples)
    };
}

// ------------------------------------------------------------------------------
// 4.5. TLX TOKI PROBLEM PARSER & PRESETS (tlx.toki.id)
// ------------------------------------------------------------------------------
const POPULAR_TLX_PROBLEMS = {
    'osn-2014-2c': {
        title: 'A - Sang Pelompat',
        platform: 'TLX',
        sourceId: 'osn-2014-2c',
        sourceUrl: 'https://tlx.toki.id/problems/osn-2014-2c',
        sourceContest: 'OSN Informatika 2014',
        timeLimit: 1.0,
        memoryLimit: 64,
        difficulty: 'Sulit',
        topicTags: 'dynamic programming, graph: shortest path',
        problemDescription: 'Kwik adalah bebek Pak Dengklek yang senang menonton TV. Salah satu film favoritnya adalah serial "The Indiana Duck". Serial ini mengisahkan seekor bebek yang bekerja sebagai arkeologi dan menemukan harta karun historis di seluruh dunia. Indiana Duck terkenal dengan atribut legendarisnya berupa topi koboi dan cambuk untuk membela diri dari serangan musuh.\n\nPada suatu hari, Kwik menemukan peta harta karun dalam kotak kecil di salah satu sudut gudang Pak Dengklek. Dalam peta itu tertulis jika seseorang mendaki turun melalui sumur tua di belakang gudang, maka ia akan menemui gua raksasa berukuran $R \\times C$ dengan lautan magma di bawahnya. Dari dasar lautan magma tersebut menyembul beberapa bongkahan batu keras yang dapat digunakan sebagai pijakan. Pada salah satu bongkahan batu terdapat harta karun yang sudah dijaga selama beberapa generasi keluarga Dengklek. Kwik sangat senang karena dia bisa berlagak meniru Indiana Duck tokoh idolanya.\n\nSatu-satunya cara untuk berpindah dari suatu bongkahan batu ke bongkahan batu lainnya adalah dengan melompat (Kwik tidak boleh menyentuh lautan magma jika ingin kembali hidup-hidup). Selama berada dalam suatu bongkahan batu, Kwik dapat menjelajahi bongkahan batu tersebut tanpa perlu melompat (misalnya, untuk berpindah ke sisi lain kemudian baru melompat). 2 petak batu akan membentuk sebuah bongkahan batu besar jika kedua petak batu tersebut berbagi sisi.\n\nKarena Kwik masih kecil, dia tidak dapat melakukan gerakan yang sulit. Kwik hanya bisa melompat untuk menyeberangi lautan magma secara garis lurus (tidak dapat berbelok di udara). Kwik juga hanya dapat melompat ke arah utara, selatan, timur, atau barat (searah mata angin). Tentunya ia harus mendarat tepat pada bongkahan batu yang lain.\n\nTugas Anda adalah membantu Kwik menentukan jumlah lompatan minimum yang harus dilakukan untuk mencapai harta karun tersebut dari posisi awal!',
        inputFormat: 'Baris pertama berisi dua buah bilangan bulat $R$ dan $C$ ($1 \\le R, C \\le 1000$).\n$R$ baris berikutnya masing-masing berisi string sepanjang $C$ karakter yang menggambarkan gua. Karakter \'.\' menyatakan lautan magma, \'#\' menyatakan bongkahan batu, \'S\' menyatakan posisi awal Kwik, dan \'T\' menyatakan posisi harta karun.',
        outputFormat: 'Sebuah baris berisi sebuah bilangan bulat yang menyatakan jumlah lompatan minimum dari \'S\' ke \'T\'. Jika tidak mungkin mencapai harta karun, cetak -1.',
        constraints: '$1 \\le R, C \\le 1000$\nWaktu: 1.0 detik, Memori: 64 MB',
        samples: [
            {
                input: '5 5\nS....\n#####\n....#\n.####\n....T',
                output: '2',
                explanation: 'Kwik melompat dari petak S ke baris kedua (lompatan 1), berjalan menelusuri batuan, lalu melompat ke baris kelima menuju T (lompatan 2).'
            }
        ],
        editorial: 'Gunakan BFS (Breadth-First Search) atau Dijkstra pada setiap komponen bongkahan batu. Karena berpindah di dalam bongkahan batu yang sama membutuhkan 0 lompatan (bebas berjalan), dan melompat ke bongkahan batu lain membutuhkan 1 lompatan, permasalahan ini dapat dimodelkan sebagai 0-1 BFS.'
    },
    'osn-2019-1a': {
        title: 'A - Mengumpulkan Peserta',
        platform: 'TLX',
        sourceId: 'osn-2019-1a',
        sourceUrl: 'https://tlx.toki.id/problems/osn-2019-1a',
        sourceContest: 'OSN Informatika 2019',
        timeLimit: 1.0,
        memoryLimit: 64,
        difficulty: 'Mudah',
        topicTags: 'greedy, two pointers',
        problemDescription: 'Terdapat $N$ peserta OSN yang berbaris dalam satu barisan lurus, dinomori dari 1 hingga $N$ dari kiri ke kanan. Masing-masing peserta berasal dari salah satu dari dua tim: Tim Merah atau Tim Putih.\n\nPanitia ingin mengumpulkan semua peserta Tim Merah agar berdiri bersebelahan tanpa ada peserta Tim Putih di antara mereka. Untuk itu, panitia dapat menukar posisi dua peserta yang berdiri bersebelahan.\n\nTentukan banyaknya pertukaran minimum yang diperlukan panitia!',
        inputFormat: 'Baris pertama berisi bilangan bulat $N$ ($1 \\le N \\le 100\\,000$). Baris kedua berisi string sepanjang $N$ karakter yang hanya berisi \'M\' (Merah) dan \'P\' (Putih).',
        outputFormat: 'Cetak satu bilangan bulat yang menyatakan banyaknya pertukaran minimum.',
        constraints: '$1 \\le N \\le 100\\,000$',
        samples: [
            { input: '6\nMPMPMP', output: '3', explanation: 'Tukar peserta berurutan hingga semua \'M\' berkumpul.' }
        ]
    },
    'troc-30-a': {
        title: 'A. Membagi Permen',
        platform: 'TLX',
        sourceId: 'troc-30-a',
        sourceUrl: 'https://tlx.toki.id/problems/troc-30-a',
        sourceContest: 'TOKI Regular Open Contest 30',
        timeLimit: 1.0,
        memoryLimit: 64,
        difficulty: 'Mudah',
        topicTags: 'math, implementation',
        problemDescription: 'Pak Dengklek memiliki $N$ buah permen yang ingin dibagikan secara merata kepada $M$ ekor bebeknya. Jika permen dapat dibagi rata tanpa sisa, cetak "BISA". Jika ada permen yang bersisa, cetak "TIDAK".',
        inputFormat: 'Baris pertama berisi dua buah bilangan bulat $N$ dan $M$ ($1 \\le N, M \\le 1000$).',
        outputFormat: 'Cetak "BISA" jika $N$ habis dibagi $M$, cetak "TIDAK" jika sebaliknya.',
        constraints: '$1 \\le N, M \\le 1000$',
        samples: [
            { input: '12 4', output: 'BISA', explanation: '12 permen dibagikan ke 4 bebek masing-masing mendapat 3 permen tanpa sisa.' },
            { input: '10 3', output: 'TIDAK', explanation: '10 dibagi 3 menghasilkan 3 sisa 1 permen.' }
        ]
    },
    'ksn-2020-1a': {
        title: 'A - Pertahanan Bogor',
        platform: 'TLX',
        sourceId: 'ksn-2020-1a',
        sourceUrl: 'https://tlx.toki.id/problems/ksn-2020-1a',
        sourceContest: 'KSN Informatika 2020',
        timeLimit: 1.0,
        memoryLimit: 256,
        difficulty: 'Sedang',
        topicTags: 'dynamic programming, data structure',
        problemDescription: 'Kota Bogor memiliki $N$ pos pertahanan yang dinomori dari 1 sampai $N$. Pos-pos tersebut dihubungkan oleh jalan satu arah. Pasukan penjaga ingin memastikan tidak ada penyusup yang dapat melewati benteng pertahanan tanpa terdeteksi.\n\nTentukan rute pertahanan terbaik yang meminimalkan risiko keamanan!',
        inputFormat: 'Baris pertama berisi dua bilangan bulat $N$ dan $M$.\n$M$ baris berikutnya berisi pasangan pos yang terhubung.',
        outputFormat: 'Cetak skor keamanan minimum yang dapat dicapai.',
        constraints: '$1 \\le N \\le 100\\,000, 1 \\le M \\le 200\\,000$',
        samples: [
            { input: '4 4\n1 2\n2 3\n3 4\n4 1', output: '0', explanation: 'Jaringan pos membentuk siklus tertutup.' }
        ]
    }
};

function parseTlxStatementHtml(html) {
    if (!html) return { problemDescription: '', inputFormat: '', outputFormat: '', constraints: '', samples: [] };

    const clean = (str) => {
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
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    };

    const cleanHtmlSnippet = (str) => {
        if (!str) return '';
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<h[1-6][^>]*>Deskripsi.*?<\/h[1-6]>/gi, '')
            .trim();
    };

    // Extract samples from <h3 id="contoh-masukan..."> or <h3>Contoh Masukan...</h3> followed by <pre>
    const inRegex = /<h3[^>]*>(?:Contoh Masukan|Sample Input).*?<\/h3>[\s\S]*?<pre[^>]*>([\s\S]*?)<\/pre>/gi;
    const outRegex = /<h3[^>]*>(?:Contoh Keluaran|Sample Output).*?<\/h3>[\s\S]*?<pre[^>]*>([\s\S]*?)<\/pre>/gi;

    const inMatches = [...html.matchAll(inRegex)].map(m => clean(m[1]));
    const outMatches = [...html.matchAll(outRegex)].map(m => clean(m[1]));

    const samples = [];
    for (let i = 0; i < Math.max(inMatches.length, outMatches.length); i++) {
        samples.push({
            input: inMatches[i] || '',
            output: outMatches[i] || '',
            explanation: `Contoh Kasus Uji #${i + 1} TLX TOKI`
        });
    }

    // Extract sections
    function extractSection(startRegex, nextRegex, asHtml = false) {
        const start = html.search(startRegex);
        if (start === -1) return '';
        const slice = html.substring(start).replace(startRegex, '');
        const end = slice.search(nextRegex);
        const content = end !== -1 ? slice.substring(0, end) : slice;
        return asHtml ? cleanHtmlSnippet(content) : clean(content);
    }

    const problemDescription = extractSection(/<h3[^>]*>Deskripsi.*?<\/h3>/i, /<h3[^>]*>(?:Batasan|Format Masukan|Masukan).*?<\/h3>/i, true) 
        || cleanHtmlSnippet(html.split(/<h3[^>]*>(?:Batasan|Format Masukan|Masukan)/i)[0]);
    const constraints = extractSection(/<h3[^>]*>Batasan.*?<\/h3>/i, /<h3[^>]*>(?:Format Masukan|Masukan).*?<\/h3>/i);
    const inputFormat = extractSection(/<h3[^>]*>(?:Format Masukan|Masukan).*?<\/h3>/i, /<h3[^>]*>(?:Format Keluaran|Keluaran).*?<\/h3>/i);
    const outputFormat = extractSection(/<h3[^>]*>(?:Format Keluaran|Keluaran).*?<\/h3>/i, /<h3[^>]*>(?:Contoh Masukan|Sample Input|Contoh).*?<\/h3>/i);

    return {
        problemDescription: problemDescription || cleanHtmlSnippet(html).slice(0, 1000),
        constraints,
        inputFormat,
        outputFormat,
        samples
    };
}

export async function parseTlxProblem(query) {
    let clean = query.trim()
        .replace(/^https?:\/\/tlx\.toki\.id\/problems\//i, '')
        .replace(/^https?:\/\/tlx\.toki\.id\/contests\//i, '')
        .replace(/\/$/, '');
    clean = clean.replace(/^tlx[\s-_:]+/i, '').trim();

    let contestSlug = '';
    let alias = '';

    if (clean.includes('/')) {
        const parts = clean.split('/');
        contestSlug = parts[0];
        alias = parts[1];
    } else {
        const m = clean.match(/^([a-zA-Z0-9_\-]+)-((\d)?[a-zA-Z0-9]+)$/i);
        if (m) {
            contestSlug = m[1];
            alias = m[2];
        } else {
            const parts = clean.split('-');
            if (parts.length >= 2) {
                alias = parts.pop();
                contestSlug = parts.join('-');
            } else {
                contestSlug = clean;
                alias = 'A';
            }
        }
    }

    contestSlug = contestSlug.toLowerCase();
    alias = alias.toUpperCase();

    // 1. LIVE TLX TOKI OFFICIAL API CRAWLER
    try {
        const psetRes = await fetchUrl(`https://api.tlx.toki.id/v2/problemsets/slug/${contestSlug}`);
        if (psetRes.status === 200) {
            const pset = JSON.parse(psetRes.data);
            if (pset && pset.jid) {
                let matchedAlias = alias;
                try {
                    const probListRes = await fetchUrl(`https://api.tlx.toki.id/v2/problemsets/${pset.jid}/problems`);
                    if (probListRes.status === 200) {
                        const probList = JSON.parse(probListRes.data);
                        if (probList && Array.isArray(probList.data)) {
                            const found = probList.data.find(p => p.alias.toLowerCase() === alias.toLowerCase());
                            if (found) matchedAlias = found.alias;
                            else if (probList.data.length > 0 && (!alias || alias === 'A')) {
                                matchedAlias = probList.data[0].alias;
                            }
                        }
                    }
                } catch(e) {}

                const wsRes = await fetchUrl(`https://api.tlx.toki.id/v2/problemsets/${pset.jid}/problems/${matchedAlias}/worksheet?language=id`);
                if (wsRes.status === 200) {
                    const ws = JSON.parse(wsRes.data);
                    if (ws && ws.worksheet && ws.worksheet.statement) {
                        const st = ws.worksheet.statement;
                        const limits = ws.worksheet.limits || {};
                        const parsed = parseTlxStatementHtml(st.text || '');

                        const timeLimit = limits.timeLimit ? +(limits.timeLimit / 1000).toFixed(1) : 1.0;
                        const memoryLimit = limits.memoryLimit ? Math.round(limits.memoryLimit / 1024) : 64;

                        const samples = parsed.samples && parsed.samples.length > 0 ? parsed.samples : [
                            { input: '1\n', output: '1\n', explanation: 'Kasus uji standar TLX' }
                        ];

                        // Untuk Mode VJudge TLX, contoh kasus adalah public samples untuk panduan siswa & run_samples
                        const testCases = samples.map((s, idx) => ({
                            input: s.input,
                            output: s.output,
                            points: 0,
                            isHidden: false,
                            isSample: true,
                            label: `Contoh #${idx + 1}`
                        }));

                        let difficulty = 'OSN / KSN';
                        if (contestSlug.includes('troc')) difficulty = (alias === 'A' || alias === 'B') ? 'Mudah' : 'Sedang';
                        else if (contestSlug.includes('osn')) difficulty = (alias.includes('1') || alias === 'A') ? 'Sedang' : 'Sulit';

                        return {
                            platform: 'TLX',
                            sourceId: `${contestSlug}/${matchedAlias}`,
                            sourceUrl: `https://tlx.toki.id/problems/${contestSlug}/${matchedAlias}`,
                            sourceContest: pset.name || 'TLX TOKI',
                            title: `${st.title} (${matchedAlias})`,
                            timeLimit,
                            memoryLimit,
                            difficulty,
                            topicTags: 'competitive programming, toki',
                            tags: 'competitive programming, toki',
                            problemDescription: parsed.problemDescription,
                            inputFormat: parsed.inputFormat,
                            outputFormat: parsed.outputFormat,
                            constraints: parsed.constraints,
                            samples,
                            testCases
                        };
                    }
                }
            }
        }
    } catch (apiErr) {
        console.warn('Live TLX API failed, checking local preset:', apiErr.message);
    }

    // 2. Curated Preset Fallback
    const localKey = `${contestSlug}-${alias}`.toLowerCase();
    for (const key of Object.keys(POPULAR_TLX_PROBLEMS)) {
        if (key === localKey || key.replace(/-/g, '').includes(localKey.replace(/-/g, '')) || localKey.replace(/-/g, '').includes(key.replace(/-/g, ''))) {
            const item = POPULAR_TLX_PROBLEMS[key];
            return {
                ...item,
                tags: item.topicTags,
                testCases: item.samples.map((s, idx) => ({
                    input: s.input,
                    output: s.output,
                    points: Math.round(100 / Math.max(1, item.samples.length)),
                    isHidden: idx > 0
                }))
            };
        }
    }

    throw new Error(`Soal TLX tidak ditemukan untuk "${query}". Pastikan format benar (contoh: troc-30-a, osn-2014-2c, osn-2019-1a, atau link https://tlx.toki.id/problems/troc-30/A)`);
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

    const lower = targetQuery.toLowerCase();
    const platLower = (platform || '').toLowerCase();

    // 1. CEK PLATFORM YANG BELUM DIDUKUNG (TOLAK SECARA EKSPLISIT!)
    const UNSUPPORTED_DOMAINS = [
        'leetcode.com',
        'hackerrank.com',
        'hackerearth.com',
        'spoj.com',
        'kattis.com',
        'open.kattis.com',
        'codechef.com',
        'topcoder.com',
        'geeksforgeeks.org',
        'vjudge.net',
        'beecrowd.com',
        'urionlinejudge.com.br',
        'uva.onlinejudge.org',
        'onlinejudge.org',
        'luogu.com.cn',
        'dmoj.ca',
        'codewars.com',
        'lintcode.com'
    ];

    for (const domain of UNSUPPORTED_DOMAINS) {
        if (lower.includes(domain) || platLower.includes(domain)) {
            throw new Error(`Platform "${domain}" belum didukung. Mode VJudge saat ini hanya menerima 4 Online Judge resmi: TLX TOKI, CSES, AtCoder, dan Codeforces. Platform lain sementara ditolak.`);
        }
    }

    if (platLower && !['tlx', 'cses', 'atcoder', 'codeforces', 'auto', 'smart'].includes(platLower)) {
        throw new Error(`Platform "${platform}" belum didukung. Mode VJudge saat ini hanya menerima 4 Online Judge resmi: TLX TOKI, CSES, AtCoder, dan Codeforces. Platform lain sementara ditolak.`);
    }

    // 2. Auto-detect & Parse 4 Platform Resmi
    if (platLower === 'tlx' || lower.includes('tlx.toki.id') || lower.startsWith('tlx') || /^(osn|ksn|troc|toki)-/i.test(targetQuery)) {
        return parseTlxProblem(targetQuery);
    }
    if (platLower === 'cses' || lower.includes('cses.fi') || lower.startsWith('cses')) {
        return parseCsesProblem(targetQuery);
    }
    if (platLower === 'atcoder' || lower.includes('atcoder.jp') || lower.startsWith('atcoder') || /^(abc|arc|agc|practice)\d*_/i.test(targetQuery)) {
        return parseAtCoderProblem(targetQuery);
    }
    if (platLower === 'codeforces' || lower.includes('codeforces.com') || /^\d+[a-zA-Z]/i.test(targetQuery)) {
        return parseCodeforcesProblem(targetQuery);
    }

    // Default heuristics untuk kode ringkas:
    if (/^\d{3,5}$/.test(targetQuery)) {
        // purely numbers like 1068 -> CSES
        return parseCsesProblem(targetQuery);
    }
    if (/^\d+[a-zA-Z]\d?$/i.test(targetQuery)) {
        // like 4A or 71A -> Codeforces
        return parseCodeforcesProblem(targetQuery);
    }
    if (/^(abc|arc|agc|practice)\d*_[a-zA-Z0-9]+/i.test(targetQuery)) {
        // like abc300_a -> AtCoder
        return parseAtCoderProblem(targetQuery);
    }

    // Jika input berupa URL HTTP/HTTPS namun bukan salah satu dari 4 platform resmi -> TOLAK!
    if (/^https?:\/\//i.test(targetQuery)) {
        throw new Error(`URL "${targetQuery}" bukan bagian dari 4 Online Judge resmi yang didukung (TLX TOKI, CSES, AtCoder, Codeforces). Sementara ditolak.`);
    }

    // Fallback: Hanya coba TLX, CSES, Codeforces jika format query mirip kode soal
    try {
        return await parseTlxProblem(targetQuery);
    } catch(e) {
        try {
            return await parseCsesProblem(targetQuery);
        } catch(e2) {
            try {
                return await parseCodeforcesProblem(targetQuery);
            } catch(e3) {
                throw new Error(`Soal "${targetQuery}" tidak dikenali pada 4 Online Judge resmi (TLX TOKI, CSES, AtCoder, Codeforces). Sementara ditolak.`);
            }
        }
    }
}

/**
 * Vercel Serverless Function Handler
 */
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        let params = req.body || req.query || {};
        if (typeof params === 'string') {
            try { params = JSON.parse(params); } catch(e) {}
        }
        const problem = await fetchExternalProblem(params);
        return res.status(200).json({ success: true, problem });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message || 'Gagal mengambil soal.' });
    }
}

