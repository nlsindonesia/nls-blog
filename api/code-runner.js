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
            // Wandbox requires newline-separated compiler options in compiler-option-raw
            bodyObj['compiler-option-raw'] = options.split(/\s+/).filter(Boolean).join('\n');
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
            supportedLanguages: ['cpp17', 'cpp20', 'python', 'pascal', 'c', 'java']
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    try {
        const body = req.body || {};
        const rawAction = body.action || '';
        const mode = body.mode || '';
        let action = 'run_custom';
        if (rawAction) {
            action = rawAction;
        } else if (mode === 'custom') {
            action = 'run_custom';
        } else if (mode === 'samples') {
            action = 'run_samples';
        } else if (mode === 'submit') {
            action = 'submit';
        }

        const language = body.language || 'cpp17';
        const code = body.code || '';
        const stdin = body.stdin !== undefined ? body.stdin : (body.customInput !== undefined ? body.customInput : '');
        const samples = Array.isArray(body.samples) && body.samples.length > 0 ? body.samples : (Array.isArray(body.sampleCases) ? body.sampleCases : []);
        const testCases = Array.isArray(body.testCases) ? body.testCases : [];
        const timeLimit = body.timeLimit || 1.0;
        const memoryLimit = body.memoryLimit || 256;
        const userId = body.userId;
        const courseId = body.courseId;
        const moduleId = body.moduleId || body.problemId;
        const problemTitle = body.problemTitle || body.title || 'Soal Pemrograman';

        if (!code || !code.trim()) {
            return res.status(400).json({ success: false, message: 'Source code tidak boleh kosong.' });
        }

        const langKey = language.toLowerCase().trim();
        const compiler = COMPILERS[langKey] || COMPILERS['cpp17'] || COMPILERS['cpp'];

        let compilerOptions = '';
        if (langKey === 'cpp17' || langKey === 'cpp') {
            compilerOptions = '-std=c++17 -O2';
        } else if (langKey === 'cpp20') {
            compilerOptions = '-std=c++20 -O2';
        } else if (langKey === 'c') {
            compilerOptions = '-std=c17 -O2';
        } else if (langKey === 'pascal') {
            compilerOptions = '-O2';
        }

        // -------------------------------------------------------------
        // MODE 1: RUN CUSTOM INPUT (Siswa menguji kode dengan input sendiri)
        // -------------------------------------------------------------
        if (action === 'run_custom') {
            const startT = Date.now();
            const result = await executeOnWandbox(compiler, code, stdin, compilerOptions);
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
                    verdictName: 'Compilation Error',
                    compilerError: compErr,
                    compileError: compErr,
                    errorOutput: compErr,
                    stderr: compErr,
                    output: '',
                    timeMs: execMs,
                    executionTimeMs: execMs
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
                stderr: rawErr,
                timeMs: execMs,
                executionTimeMs: execMs,
                compilerError: '',
                compileError: ''
            });
        }

        // -------------------------------------------------------------
        // MODE 2: RUN SAMPLES (Menguji kode terhadap seluruh Contoh Masukan)
        // -------------------------------------------------------------
        if (action === 'run_samples') {
            const sampleList = samples.length > 0 ? samples : [{ input: stdin, output: '' }];
            const sampleResults = [];
            let allPassed = true;

            for (let i = 0; i < sampleList.length; i++) {
                const s = sampleList[i];
                const startT = Date.now();
                const resW = await executeOnWandbox(compiler, code, s.input || '', compilerOptions);
                const execMs = Date.now() - startT;

                if (!resW.ok) {
                    sampleResults.push({
                        index: i + 1,
                        label: `Contoh #${i + 1}`,
                        passed: false,
                        error: resW.error,
                        errorOutput: resW.error,
                        stderr: resW.error,
                        timeMs: execMs,
                        executionTimeMs: execMs,
                        verdict: 'SE',
                        verdictCode: 'SE'
                    });
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
                        verdictName: 'Compilation Error',
                        compilerError: compErr,
                        compileError: compErr,
                        samples: [],
                        sampleResults: []
                    });
                }

                const actualOut = d.program_output || '';
                const normActual = normalizeOutput(actualOut);
                const normExpected = normalizeOutput(s.output || '');
                const passed = normExpected ? normActual === normExpected : true;

                if (!passed) allPassed = false;

                const isTLE = Boolean(d.isTLE || d.status === '124' || (d.signal && d.signal.includes('KILL')));
                const isRTE = d.status !== '0' && !isTLE;
                const sampleVerdict = isTLE ? 'TLE' : (isRTE ? 'RTE' : (passed ? 'AC' : 'WA'));

                sampleResults.push({
                    index: i + 1,
                    label: `Contoh #${i + 1}`,
                    passed: passed,
                    input: s.input || '',
                    expectedOutput: s.output || '',
                    actualOutput: actualOut,
                    errorOutput: d.program_error || '',
                    stderr: d.program_error || '',
                    timeMs: execMs,
                    executionTimeMs: execMs,
                    verdict: sampleVerdict,
                    verdictCode: sampleVerdict
                });
            }

            return res.status(200).json({
                success: true,
                verdict: allPassed ? 'AC' : 'WA',
                verdictCode: allPassed ? 'AC' : 'WA',
                verdictName: allPassed ? 'Sample Passed' : 'Sample Failed',
                samples: sampleResults,
                sampleResults: sampleResults
            });
        }

        // -------------------------------------------------------------
        // MODE 3: SUBMIT SOLUTION (Grading resmi)
        // -------------------------------------------------------------
        if (action === 'submit') {
            const cpMode = body.cpMode || '';
            const judgeProvider = (body.judgeProvider || '').toLowerCase();
            const sourcePlatform = (body.sourcePlatform || '').toLowerCase();
            const sourceUrl = body.sourceUrl || body.remoteJudgeUrl || body.problemUrl || '';

            // Cek apakah soal ini menggunakan Opsi 2: Mode VJudge menuju TLX TOKI
            const isTlxVJudge = cpMode === 'vjudge' && (
                judgeProvider === 'tlx' ||
                sourcePlatform === 'tlx' ||
                sourceUrl.toLowerCase().includes('tlx.toki.id') ||
                body.isVJudge ||
                body.remoteJudge
            );

            if (isTlxVJudge) {
                console.log(`[CodeRunner] Meneruskan submisi ke TLX Remote Judge Service...`);
                console.log(`[CodeRunner] URL Soal: ${sourceUrl || problemTitle}`);

                const remoteJudgeServiceUrl = process.env.TLX_JUDGE_URL || 'http://localhost:3500';
                const targetUrl = sourceUrl || problemTitle;

                try {
                    // 1. Kirim kodingan ke antrean TLX Remote Judge
                    const submitRes = await fetch(`${remoteJudgeServiceUrl}/api/judge/submit`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            problemUrl: targetUrl,
                            language: langKey,
                            sourceCode: code,
                            studentId: userId || body.userName || 'siswa'
                        })
                    });

                    const submitData = await submitRes.json();
                    if (!submitData.success) {
                        return res.status(502).json({
                            success: false,
                            message: submitData.error || 'Layanan TLX Remote Judge menolak submisi.'
                        });
                    }

                    const jobId = submitData.jobId;
                    console.log(`[CodeRunner] Job TLX diterima: ${jobId}. Mulai polling status grading...`);

                    // 2. Polling status hasil penilaian TLX
                    const startTime = Date.now();
                    let finalJob = null;

                    while (Date.now() - startTime < 65000) {
                        await new Promise(r => setTimeout(r, 2000));

                        const statusRes = await fetch(`${remoteJudgeServiceUrl}/api/judge/status/${jobId}`);
                        const statusData = await statusRes.json();

                        if (statusData.success && statusData.job) {
                            if (statusData.job.status === 'completed' || statusData.job.status === 'failed') {
                                finalJob = statusData.job;
                                break;
                            }
                        }
                    }

                    if (!finalJob) {
                        return res.status(504).json({
                            success: false,
                            message: 'Penilaian di TLX TOKI membutuhkan waktu terlalu lama (timeout 60 detik). Silakan coba submit ulang beberapa saat lagi.'
                        });
                    }

                    if (finalJob.status === 'failed') {
                        return res.status(502).json({
                            success: false,
                            message: finalJob.error || 'Submisi gagal dinilai di server TLX.'
                        });
                    }

                    // 3. Ekstrak verdict dan format untuk LMS Player
                    const r = finalJob.result || {};
                    const rawVerdict = r.verdict || 'Accepted';

                    let vCode = 'WA';
                    let vName = rawVerdict;
                    if (/Accepted|Diterima/i.test(rawVerdict)) { vCode = 'AC'; vName = 'Accepted'; }
                    else if (/Wrong Answer|Jawaban Salah/i.test(rawVerdict)) { vCode = 'WA'; vName = 'Wrong Answer'; }
                    else if (/Time Limit Exceeded|Batas Waktu/i.test(rawVerdict)) { vCode = 'TLE'; vName = 'Time Limit Exceeded'; }
                    else if (/Memory Limit Exceeded|Batas Memori/i.test(rawVerdict)) { vCode = 'MLE'; vName = 'Memory Limit Exceeded'; }
                    else if (/Compilation Error|Kesalahan Kompilasi/i.test(rawVerdict)) { vCode = 'CE'; vName = 'Compilation Error'; }
                    else if (/Runtime Error|Kesalahan/i.test(rawVerdict)) { vCode = 'RTE'; vName = 'Runtime Error'; }

                    const score = Number(r.score) !== undefined ? Number(r.score) : (vCode === 'AC' ? 100 : 0);

                    // Parse waktu ke angka ms jika memungkinkan
                    let timeNumber = 0;
                    if (typeof r.time === 'string') {
                        const m = r.time.match(/(\d+(\.\d+)?)/);
                        if (m) timeNumber = parseFloat(m[1]);
                    }

                    return res.status(200).json({
                        success: true,
                        score: score,
                        totalScore: 100,
                        totalPoints: 100,
                        verdict: vCode,
                        verdictCode: vCode,
                        verdictName: `${vName} (TLX TOKI Official)`,
                        passedCount: vCode === 'AC' ? 1 : 0,
                        totalCount: 1,
                        timeMs: r.time || `${timeNumber} ms`,
                        memoryKb: r.memory || 'N/A',
                        maxTimeMs: timeNumber,
                        maxMemoryKb: 256 * 1024,
                        executionTimeMs: timeNumber,
                        isRemoteJudge: true,
                        remotePlatform: 'TLX TOKI',
                        submissionId: jobId,
                        tests: [
                            {
                                index: 1,
                                label: 'Evaluasi Resmi TLX TOKI Grader',
                                verdict: vCode,
                                verdictCode: vCode,
                                verdictName: vName,
                                passed: vCode === 'AC',
                                points: score,
                                maxPoints: 100,
                                timeMs: timeNumber,
                                executionTimeMs: timeNumber
                            }
                        ],
                        testResults: [
                            {
                                index: 1,
                                label: 'Evaluasi Resmi TLX TOKI Grader',
                                verdict: vCode,
                                verdictCode: vCode,
                                verdictName: vName,
                                passed: vCode === 'AC',
                                points: score,
                                maxPoints: 100,
                                timeMs: timeNumber,
                                executionTimeMs: timeNumber
                            }
                        ]
                    });
                } catch (err) {
                    console.error('[CodeRunner] Error saat menghubungkan ke TLX Remote Judge:', err.message);
                    return res.status(503).json({
                        success: false,
                        message: `Gagal terhubung ke Layanan TLX Remote Judge (port 3500). Pastikan server remote judge aktif dengan menjalankan 'npm start' di folder tlx-remote-judge. Detail error: ${err.message}`
                    });
                }
            }

            // Fallback: Mode 1 (Manual) atau Soal dengan Kasus Uji Lokal
            let tests = testCases.length > 0 ? testCases : samples;
            if (!tests || tests.length === 0) {
                tests = [{ input: stdin || '', output: '', points: 100 }];
            }

            const totalPointsConfig = tests.reduce((acc, t) => acc + (Number(t.points) || 0), 0);
            const defaultWeight = Math.max(1, Math.floor(100 / tests.length));

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
                const resW = await executeOnWandbox(compiler, code, t.input || '', compilerOptions);
                const execMs = Date.now() - startT;
                if (execMs > maxTimeMs) maxTimeMs = execMs;

                if (!resW.ok) {
                    testResults.push({
                        index: i + 1,
                        label: t.label || `Kasus Uji #${i + 1}`,
                        verdict: 'SE',
                        verdictCode: 'SE',
                        verdictName: 'Server Error',
                        passed: false,
                        points: 0,
                        maxPoints: pts,
                        timeMs: execMs,
                        executionTimeMs: execMs
                    });
                    if (finalVerdictCode === 'AC') { finalVerdict = 'Server Error'; finalVerdictCode = 'SE'; }
                    continue;
                }

                const d = resW.data || {};
                const compErr = d.compiler_error || d.compiler_message || '';
                
                if (d.status !== '0' && compErr && !d.program_output) {
                    return res.status(200).json({
                        success: true,
                        score: 0,
                        totalScore: 100,
                        totalPoints: 100,
                        verdict: 'CE',
                        verdictCode: 'CE',
                        verdictName: 'Compilation Error',
                        compilerError: compErr,
                        compileError: compErr,
                        passedCount: 0,
                        totalCount: tests.length,
                        tests: [],
                        testResults: []
                    });
                }

                const isTLE = Boolean(d.isTLE || d.status === '124' || (d.signal && d.signal.includes('KILL')) || (d.program_error && d.program_error.toLowerCase().includes('time limit')));
                const isRTE = d.status !== '0' && !isTLE;

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
                    label: t.label || `Kasus Uji #${i + 1}`,
                    passed: isCorrect,
                    verdict: testCode,
                    verdictCode: testCode,
                    verdictName: testVerdict,
                    points: isCorrect ? pts : 0,
                    maxPoints: pts,
                    timeMs: execMs,
                    executionTimeMs: execMs,
                    input: t.isHidden ? '(Kasus Uji Rahasia)' : (t.input || ''),
                    expectedOutput: t.isHidden ? '(Kasus Uji Rahasia)' : (t.output || ''),
                    actualOutput: t.isHidden && !isCorrect ? '(Output Tersembunyi)' : actualOut
                });
            }

            const normalizedScore = totalMaxPoints > 0 ? Math.min(100, Math.round((earnedPoints / totalMaxPoints) * 100)) : (finalVerdictCode === 'AC' ? 100 : 0);
            const passedCount = testResults.filter(t => t.passed).length;
            const totalCount = testResults.length;
            const submissionId = `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

            const submissionRecord = {
                id: submissionId,
                userId: userId || 'anonymous',
                courseId: courseId || '',
                moduleId: moduleId || '',
                problemTitle: problemTitle || 'Competitive Programming Problem',
                language: language,
                code: code,
                score: normalizedScore,
                totalScore: 100,
                passedCount: passedCount,
                totalCount: totalCount,
                verdict: finalVerdictCode,
                verdictName: finalVerdict,
                verdictCode: finalVerdictCode,
                maxTimeMs: maxTimeMs,
                testsCount: testResults.length,
                submittedAt: new Date().toISOString()
            };

            if (userId && userId !== 'anonymous' && userId !== 'guest') {
                try {
                    const store = await getCloudStore();
                    const submissions = Array.isArray(store.quizSubmissions) ? store.quizSubmissions : [];
                    submissions.unshift(submissionRecord);
                    await saveCloudStore({ quizSubmissions: submissions.slice(0, 200) });
                } catch(saveErr) {
                    console.warn('[NLS Judge] Gagal menyimpan riwayat submisi ke Cloud DB:', saveErr.message);
                }
            }

            return res.status(200).json({
                success: true,
                score: normalizedScore,
                totalScore: 100,
                earnedPoints: earnedPoints,
                totalPoints: totalMaxPoints,
                verdict: finalVerdictCode,
                verdictCode: finalVerdictCode,
                verdictName: finalVerdict,
                passedCount: passedCount,
                totalCount: totalCount,
                maxTimeMs: maxTimeMs,
                maxMemoryKb: 256 * 1024,
                tests: testResults,
                testResults: testResults,
                submissionId: submissionId,
                submission: submissionRecord
            });
        }

        return res.status(400).json({ success: false, message: 'Action atau mode tidak valid.' });

    } catch (err) {
        console.error('Error in code-runner:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
