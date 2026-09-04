// ==============================================================================
// Next Level Study (NLS) - Universal Online Judge & Code Execution Engine
// Supports C++ (17/20), Python 3, Free Pascal, C, Java with automated test grading
// ==============================================================================

import https from 'https';
import { getCloudStore, saveCloudStore } from './cloud-db.js';

const COMPILERS = {
    'cpp': 'gcc-13.2.0',
    'cpp17': 'gcc-13.2.0',
    'cpp20': 'gcc-head',
    'c': 'gcc-13.2.0-c',
    'python': 'cpython-3.12.7',
    'python3': 'cpython-3.12.7',
    'pascal': 'fpc-3.2.2',
    'java': 'openjdk-jdk-21+35'
};

function executeOnWandbox(compiler, code, stdin = '', options = '') {
    return new Promise((resolve) => {
        const bodyObj = {
            compiler: compiler,
            code: code,
            stdin: stdin || ''
        };
        if (options) {
            bodyObj['compiler-option-raw'] = options;
        }
        const payload = JSON.stringify(bodyObj);

        const req = https.request('https://wandbox.org/api/compile.json', {
            method: 'POST',
            timeout: 12000,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ ok: true, status: res.statusCode, data: json });
                } catch(e) {
                    resolve({ ok: false, error: 'Gagal memproses respon compiler: ' + body.slice(0, 100) });
                }
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ ok: true, data: { status: '124', program_error: 'Time Limit Exceeded (> 10s)', isTLE: true } });
        });

        req.on('error', (err) => {
            resolve({ ok: false, error: err.message });
        });

        req.write(payload);
        req.end();
    });
}

function normalizeOutput(str) {
    if (!str) return '';
    return str
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map(line => line.trimEnd())
        .join('\n')
        .trim();
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            status: 'online',
            service: 'NLS Online Judge Execution Engine',
            supportedLanguages: ['cpp', 'python', 'pascal', 'c', 'java']
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    try {
        const body = req.body || {};
        const { action = 'run_custom', language = 'cpp', code = '', stdin = '', samples = [], testCases = [], timeLimit = 1.0, userId, courseId, moduleId, problemTitle } = body;

        if (!code || !code.trim()) {
            return res.status(400).json({ success: false, message: 'Source code tidak boleh kosong.' });
        }

        const langKey = language.toLowerCase().trim();
        const compiler = COMPILERS[langKey] || COMPILERS['cpp'];

        // -------------------------------------------------------------
        // MODE 1: RUN CUSTOM INPUT (Siswa menguji kode dengan input sendiri)
        // -------------------------------------------------------------
        if (action === 'run_custom') {
            const startT = Date.now();
            const result = await executeOnWandbox(compiler, code, stdin);
            const execMs = Date.now() - startT;

            if (!result.ok) {
                return res.status(502).json({ success: false, message: result.error });
            }

            const d = result.data || {};
            const compErr = d.compiler_error || d.compiler_message || '';
            const isCompileError = d.status !== '0' && compErr && !d.program_output;

            if (isCompileError) {
                return res.status(200).json({
                    success: true,
                    verdict: 'Compilation Error',
                    verdictCode: 'CE',
                    compilerError: compErr,
                    output: '',
                    timeMs: execMs
                });
            }

            const rawOut = d.program_output || '';
            const rawErr = d.program_error || '';
            const isRTE = d.status !== '0' && (d.signal || rawErr.includes('signal') || rawErr.includes('Error'));

            return res.status(200).json({
                success: true,
                verdict: d.isTLE ? 'Time Limit Exceeded' : (isRTE ? 'Runtime Error' : 'Finished'),
                verdictCode: d.isTLE ? 'TLE' : (isRTE ? 'RTE' : 'OK'),
                output: rawOut,
                errorOutput: rawErr,
                timeMs: execMs
            });
        }

        // -------------------------------------------------------------
        // MODE 2: RUN SAMPLES (Menguji kode terhadap seluruh Contoh Masukan)
        // -------------------------------------------------------------
        if (action === 'run_samples') {
            const sampleList = Array.isArray(samples) && samples.length > 0 ? samples : [{ input: stdin, output: '' }];
            const sampleResults = [];
            let allPassed = true;

            for (let i = 0; i < sampleList.length; i++) {
                const s = sampleList[i];
                const startT = Date.now();
                const resW = await executeOnWandbox(compiler, code, s.input || '');
                const execMs = Date.now() - startT;

                if (!resW.ok) {
                    sampleResults.push({ index: i + 1, passed: false, error: resW.error, timeMs: execMs });
                    allPassed = false;
                    continue;
                }

                const d = resW.data || {};
                const compErr = d.compiler_error || d.compiler_message || '';
                if (d.status !== '0' && compErr && !d.program_output) {
                    return res.status(200).json({
                        success: true,
                        verdict: 'Compilation Error',
                        verdictCode: 'CE',
                        compilerError: compErr,
                        samples: []
                    });
                }

                const actualOut = d.program_output || '';
                const normActual = normalizeOutput(actualOut);
                const normExpected = normalizeOutput(s.output || '');
                const passed = normExpected ? normActual === normExpected : true;

                if (!passed) allPassed = false;

                sampleResults.push({
                    index: i + 1,
                    passed: passed,
                    input: s.input,
                    expectedOutput: s.output,
                    actualOutput: actualOut,
                    errorOutput: d.program_error || '',
                    timeMs: execMs,
                    verdict: d.isTLE ? 'TLE' : (d.status !== '0' ? 'RTE' : (passed ? 'AC' : 'WA'))
                });
            }

            return res.status(200).json({
                success: true,
                verdict: allPassed ? 'Sample Passed' : 'Sample Failed',
                verdictCode: allPassed ? 'AC' : 'WA',
                samples: sampleResults
            });
        }

        // -------------------------------------------------------------
        // MODE 3: SUBMIT SOLUTION (Grading resmi seluruh Kasus Uji Penilaian)
        // -------------------------------------------------------------
        if (action === 'submit') {
            // Gabungkan test cases rahasia dengan contoh jika testCases kosong
            let tests = Array.isArray(testCases) && testCases.length > 0 ? testCases : samples;
            if (!tests || tests.length === 0) {
                // Buat dummy sample jika guru belum memasukkan test case
                tests = [{ input: stdin || '', output: '', points: 100 }];
            }

            // Hitung bobot per test case agar total tepat 100 poin
            const totalPointsConfig = tests.reduce((acc, t) => acc + (Number(t.points) || 0), 0);
            const defaultWeight = Math.floor(100 / tests.length);

            const testResults = [];
            let earnedPoints = 0;
            let totalMaxPoints = 0;
            let finalVerdict = 'Accepted';
            let finalVerdictCode = 'AC';
            let maxTimeMs = 0;

            for (let i = 0; i < tests.length; i++) {
                const t = tests[i];
                const pts = totalPointsConfig > 0 ? (Number(t.points) || defaultWeight) : defaultWeight;
                totalMaxPoints += pts;

                const startT = Date.now();
                const resW = await executeOnWandbox(compiler, code, t.input || '');
                const execMs = Date.now() - startT;
                if (execMs > maxTimeMs) maxTimeMs = execMs;

                if (!resW.ok) {
                    testResults.push({ index: i + 1, verdict: 'Server Error', verdictCode: 'SE', passed: false, points: 0, timeMs: execMs });
                    if (finalVerdictCode === 'AC') { finalVerdict = 'Server Error'; finalVerdictCode = 'SE'; }
                    continue;
                }

                const d = resW.data || {};
                const compErr = d.compiler_error || d.compiler_message || '';
                
                // Jika kompilasi gagal, langsung hentikan dan kembalikan CE
                if (d.status !== '0' && compErr && !d.program_output) {
                    return res.status(200).json({
                        success: true,
                        score: 0,
                        totalPoints: 100,
                        verdict: 'Compilation Error',
                        verdictCode: 'CE',
                        compilerError: compErr,
                        tests: []
                    });
                }

                // Cek Time Limit Exceeded (dari status sandbox compiler)
                const isTLE = Boolean(d.isTLE || d.status === '124' || (d.signal && d.signal.includes('KILL')) || (d.program_error && d.program_error.toLowerCase().includes('time limit')));

                // Cek Runtime Error
                const isRTE = d.status !== '0' && !isTLE;

                // Cek Kesesuaian Output
                const actualOut = d.program_output || '';
                const normActual = normalizeOutput(actualOut);
                const normExpected = normalizeOutput(t.output || '');
                const isCorrect = !isTLE && !isRTE && (normExpected ? normActual === normExpected : true);

                let testVerdict = 'Accepted';
                let testCode = 'AC';

                if (isTLE) {
                    testVerdict = 'Time Limit Exceeded';
                    testCode = 'TLE';
                    if (finalVerdictCode === 'AC') { finalVerdict = 'Time Limit Exceeded'; finalVerdictCode = 'TLE'; }
                } else if (isRTE) {
                    testVerdict = 'Runtime Error';
                    testCode = 'RTE';
                    if (finalVerdictCode === 'AC') { finalVerdict = 'Runtime Error'; finalVerdictCode = 'RTE'; }
                } else if (!isCorrect) {
                    testVerdict = 'Wrong Answer';
                    testCode = 'WA';
                    if (finalVerdictCode === 'AC') { finalVerdict = 'Wrong Answer'; finalVerdictCode = 'WA'; }
                }

                if (isCorrect) {
                    earnedPoints += pts;
                }

                testResults.push({
                    index: i + 1,
                    passed: isCorrect,
                    verdict: testVerdict,
                    verdictCode: testCode,
                    points: isCorrect ? pts : 0,
                    maxPoints: pts,
                    timeMs: execMs,
                    // Sembunyikan detail test case jika bertipe hidden
                    input: t.isHidden ? '(Kasus Uji Rahasia)' : t.input,
                    expectedOutput: t.isHidden ? '(Kasus Uji Rahasia)' : t.output,
                    actualOutput: t.isHidden && !isCorrect ? '(Output Tersembunyi)' : actualOut
                });
            }

            // Normalisasi skor akhir ke skala 100
            const normalizedScore = totalMaxPoints > 0 ? Math.min(100, Math.round((earnedPoints / totalMaxPoints) * 100)) : (finalVerdictCode === 'AC' ? 100 : 0);

            // Simpan riwayat submisi ke Cloud DB jika terdapat userId
            const submissionRecord = {
                id: `sub-${Date.now()}`,
                userId: userId || 'anonymous',
                courseId: courseId || '',
                moduleId: moduleId || '',
                problemTitle: problemTitle || 'Competitive Programming Problem',
                language: language,
                code: code,
                score: normalizedScore,
                verdict: finalVerdict,
                verdictCode: finalVerdictCode,
                maxTimeMs: maxTimeMs,
                testsCount: testResults.length,
                submittedAt: new Date().toISOString()
            };

            if (userId) {
                try {
                    const store = await getCloudStore();
                    const submissions = Array.isArray(store.quizSubmissions) ? store.quizSubmissions : [];
                    submissions.unshift(submissionRecord);
                    await saveCloudStore({ quizSubmissions: submissions });
                } catch(saveErr) {
                    console.warn('[NLS Judge] Gagal menyimpan riwayat submisi ke Cloud DB:', saveErr.message);
                }
            }

            return res.status(200).json({
                success: true,
                score: normalizedScore,
                earnedPoints: earnedPoints,
                totalPoints: totalMaxPoints,
                verdict: finalVerdict,
                verdictCode: finalVerdictCode,
                maxTimeMs: maxTimeMs,
                tests: testResults,
                submission: submissionRecord
            });
        }

        return res.status(400).json({ success: false, message: 'Action tidak valid.' });

    } catch (err) {
        console.error('Error in code-runner:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
