/**
 * src/csesSubmitter.js
 * Core engine berbasis Playwright untuk melakukan submisi kode ke CSES (cses.fi)
 * menggunakan akun bot (@nls_bot) dan memantau status penilaian (verdict) realtime.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');
const config = require('./config');

/**
 * Normalisasi Task ID dari URL atau input string CSES
 * Contoh input: "1068", "https://cses.fi/problemset/task/1068", "https://cses.fi/problemset/submit/1068/"
 */
function normalizeCsesTaskId(input) {
  if (!input) return null;
  const str = String(input).trim();
  const match = str.match(/task\/(\d+)/i) || str.match(/submit\/(\d+)/i) || str.match(/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Dapatkan ekstensi file berdasarkan bahasa
 */
function getFileExtension(langKey) {
  const key = (langKey || '').toLowerCase();
  if (key.includes('cpp') || key.includes('c++')) return '.cpp';
  if (key === 'c') return '.c';
  if (key.includes('py')) return '.py';
  if (key.includes('java')) return '.java';
  if (key.includes('pas')) return '.pas';
  if (key.includes('rust')) return '.rs';
  if (key.includes('js') || key.includes('node')) return '.js';
  if (key.includes('hs') || key.includes('haskell')) return '.hs';
  if (key.includes('rb') || key.includes('ruby')) return '.rb';
  return '.txt';
}

/**
 * Dapatkan opsi dropdown bahasa resmi CSES
 */
function getCsesLanguage(langKey) {
  const key = (langKey || '').toLowerCase();
  if (config.CSES_LANGUAGE_MAP[key]) {
    return config.CSES_LANGUAGE_MAP[key];
  }
  if (key.includes('cpp') || key.includes('c++')) return 'C++';
  if (key.includes('py')) return 'Python3';
  if (key.includes('java')) return 'Java';
  if (key.includes('pas')) return 'Pascal';
  if (key === 'c') return 'C';
  if (key.includes('rust')) return 'Rust';
  if (key.includes('js') || key.includes('node')) return 'Node.js';
  return 'C++';
}

/**
 * Pastikan sesi login bot CSES aktif
 */
async function ensureCsesAuth(context, page) {
  try {
    await page.goto('https://cses.fi/login', { waitUntil: 'networkidle', timeout: 30000 });
    const isLoginPage = await page.locator('input[name="nick"]').count() > 0;
    
    if (isLoginPage) {
      console.log(`   🔑 [CSES Auth] Melakukan login otomatis sebagai ${config.CSES_USERNAME}...`);
      await page.fill('input[name="nick"]', config.CSES_USERNAME);
      await page.fill('input[name="pass"]', config.CSES_PASSWORD);
      await page.click('input[type="submit"]');
      await page.waitForTimeout(2000);
      
      // Simpan session baru
      await context.storageState({ path: config.CSES_SESSION_PATH });
      console.log(`   ✅ [CSES Auth] Sesi baru berhasil disimpan di ${config.CSES_SESSION_PATH}`);
    } else {
      console.log(`   ℹ️ [CSES Auth] Sesi aktif terdeteksi untuk @${config.CSES_USERNAME}`);
    }
  } catch (err) {
    console.warn(`   ⚠️ [CSES Auth] Peringatan saat verifikasi login:`, err.message);
  }
}

/**
 * Submisi kode ke CSES dan polling hasil penilaian resmi
 */
async function submitToCSES({ problemUrl, language = 'cpp20', sourceCode, studentId }) {
  const taskId = normalizeCsesTaskId(problemUrl);
  if (!taskId) {
    throw new Error(`Task ID CSES tidak valid dari URL/input: "${problemUrl}". Contoh valid: "1068" atau "https://cses.fi/problemset/task/1068"`);
  }

  if (!sourceCode || !sourceCode.trim()) {
    throw new Error('Source code tidak boleh kosong!');
  }

  const submitPageUrl = `https://cses.fi/problemset/submit/${taskId}/`;
  const taskPageUrl = `https://cses.fi/problemset/task/${taskId}`;
  console.log(`\n🚀 [CSES Submitter] Memulai submisi...`);
  console.log(`   Task ID  : ${taskId}`);
  console.log(`   URL Soal : ${taskPageUrl}`);
  console.log(`   Bahasa   : ${language}`);
  if (studentId) console.log(`   Siswa ID : ${studentId}`);

  const browser = await chromium.launch({
    headless: config.HEADLESS,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const sessionExists = fs.existsSync(config.CSES_SESSION_PATH);
  const context = await browser.newContext({
    storageState: sessionExists ? config.CSES_SESSION_PATH : undefined,
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  // Buat file temporary untuk source code
  const tempExt = getFileExtension(language);
  const tempFilePath = path.join(os.tmpdir(), `cses_sol_${Date.now()}${tempExt}`);
  fs.writeFileSync(tempFilePath, sourceCode, 'utf8');

  try {
    // 1. Kunjungi submit page & verifikasi auth
    console.log(`   🌐 Membuka halaman submit CSES (${submitPageUrl})...`);
    await page.goto(submitPageUrl, { waitUntil: 'networkidle', timeout: 45000 });

    if (page.url().includes('/login') || await page.locator('input[name="nick"]').count() > 0) {
      console.log(`   ⚠️ Sesi kadaluarsa / belum login. Memperbarui sesi CSES...`);
      await ensureCsesAuth(context, page);
      await page.goto(submitPageUrl, { waitUntil: 'networkidle', timeout: 45000 });
    }

    // Periksa apakah form submit tersedia
    const langSelect = page.locator('select[name="lang"]');
    if (await langSelect.count() === 0) {
      throw new Error(`Tidak dapat menemukan form submit CSES di ${submitPageUrl}. Pastikan task ID ${taskId} aktif.`);
    }

    // 2. Pilih Bahasa di dropdown
    const csesLangValue = getCsesLanguage(language);
    console.log(`   ⚙️ Memilih bahasa CSES: ${csesLangValue}...`);
    await page.selectOption('select[name="lang"]', csesLangValue);
    await page.waitForTimeout(400);

    // 3. Masukkan file solusi kodingan ke input form
    console.log(`   📄 Mengunggah file solusi kodingan (${tempExt})...`);
    const fileInput = page.locator('input[type="file"][name="file"]');
    if (await fileInput.count() === 0) {
      throw new Error('Kolom upload file tidak ditemukan di halaman submit CSES.');
    }
    await fileInput.setInputFiles(tempFilePath);
    await page.waitForTimeout(500);

    // 4. Submit form
    console.log(`   📤 Menekan tombol Submit resmi CSES...`);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
      page.click('input[type="submit"]')
    ]);

    const resultUrl = page.url();
    console.log(`   ⏳ Form terkirim! Halaman hasil: ${resultUrl}`);

    const subIdMatch = resultUrl.match(/result\/(\d+)/);
    const submissionId = subIdMatch ? subIdMatch[1] : `cses-${Date.now()}`;

    // 5. Polling hasil penilaian di halaman result CSES
    const startTime = Date.now();
    let finalVerdict = 'Pending';
    let finalStatus = 'PENDING';
    let finalScore = 0;
    let maxTimeNumber = 0;
    let testCases = [];
    let taskName = `CSES #${taskId}`;

    while (Date.now() - startTime < config.JUDGING_TIMEOUT_MS) {
      const pageInfo = await page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table'));
        let meta = {};
        let tests = [];

        // Parse meta info table (Task, Sender, Status, Result)
        for (const t of tables) {
          const rows = Array.from(t.querySelectorAll('tr'));
          for (const r of rows) {
            const cells = Array.from(r.querySelectorAll('th, td')).map(c => c.innerText.trim());
            if (cells.length === 2) {
              const k = cells[0].replace(/:$/, '').toLowerCase();
              meta[k] = cells[1];
            }
          }
        }

        // Parse test cases table
        for (const t of tables) {
          const header = Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim().toLowerCase());
          if (header.includes('test') && header.includes('verdict')) {
            const rows = Array.from(t.querySelectorAll('tbody tr, tr')).slice(1);
            for (const r of rows) {
              const cols = Array.from(r.querySelectorAll('td')).map(c => c.innerText.trim());
              if (cols.length >= 3) {
                tests.push({
                  test: cols[0],
                  verdict: cols[1],
                  time: cols[2]
                });
              }
            }
          }
        }

        return { meta, tests };
      });

      if (pageInfo.meta && pageInfo.meta.task) {
        taskName = pageInfo.meta.task;
      }

      finalStatus = (pageInfo.meta.status || '').toUpperCase();
      const rawResult = (pageInfo.meta.result || '').toUpperCase();

      console.log(`   📊 Status saat ini [ID: ${submissionId}]: Status=${finalStatus}, Result=${rawResult || 'N/A'}, Tests=${pageInfo.tests.length}`);

      if (finalStatus === 'READY' || rawResult) {
        // Grading selesai
        testCases = pageInfo.tests || [];
        const totalTests = testCases.length;
        const passedTests = testCases.filter(t => t.verdict === 'ACCEPTED').length;

        // Tentukan Verdict umum
        if (rawResult === 'ACCEPTED' || (totalTests > 0 && passedTests === totalTests)) {
          finalVerdict = 'Accepted';
          finalScore = 100;
        } else if (rawResult === 'WRONG ANSWER') {
          finalVerdict = 'Wrong Answer';
          finalScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
        } else if (rawResult === 'TIME LIMIT EXCEEDED') {
          finalVerdict = 'Time Limit Exceeded';
          finalScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
        } else if (rawResult.includes('COMPILE')) {
          finalVerdict = 'Compilation Error';
          finalScore = 0;
        } else if (rawResult.includes('RUNTIME')) {
          finalVerdict = 'Runtime Error';
          finalScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
        } else if (rawResult) {
          finalVerdict = rawResult;
          finalScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
        }

        // Cari max time dari rincian kasus uji
        for (const tc of testCases) {
          const m = tc.time.match(/([\d.]+)/);
          if (m) {
            const val = parseFloat(m[1]);
            // Jika satuan s (detik), konversi ke ms
            const ms = tc.time.includes('s') ? Math.round(val * 1000) : Math.round(val);
            if (ms > maxTimeNumber) maxTimeNumber = ms;
          }
        }

        break;
      }

      await page.waitForTimeout(2000);
      await page.reload({ waitUntil: 'networkidle' }).catch(() => {});
    }

    console.log(`   🏁 Penilaian CSES selesai!`);
    console.log(`   Submission ID : ${submissionId}`);
    console.log(`   Verdict       : ${finalVerdict}`);
    console.log(`   Skor          : ${finalScore} / 100`);
    console.log(`   Kasus Uji     : ${testCases.length} kasus`);

    // Format tests menjadi struktur standar NLS LMS
    const formattedTests = testCases.map((tc, idx) => {
      const isAc = tc.verdict === 'ACCEPTED';
      let vCode = 'WA';
      if (isAc) vCode = 'AC';
      else if (tc.verdict.includes('TIME')) vCode = 'TLE';
      else if (tc.verdict.includes('RUNTIME')) vCode = 'RTE';
      else if (tc.verdict.includes('COMPILE')) vCode = 'CE';

      const timeM = tc.time.match(/([\d.]+)/);
      const timeMs = timeM ? Math.round(parseFloat(timeM[1]) * 1000) : 0;
      const pts = testCases.length > 0 ? Math.round(100 / testCases.length) : 0;

      return {
        index: idx + 1,
        label: `Kasus Uji ${tc.test} CSES`,
        verdict: vCode,
        verdictCode: vCode,
        verdictName: tc.verdict,
        passed: isAc,
        points: isAc ? pts : 0,
        maxPoints: pts,
        timeMs: timeMs,
        executionTimeMs: timeMs,
        rawTime: tc.time
      };
    });

    return {
      success: true,
      platform: 'CSES',
      taskName: taskName,
      taskId: taskId,
      submissionId: submissionId,
      verdict: finalVerdict,
      score: finalScore,
      time: `${maxTimeNumber} ms`,
      memory: 'N/A',
      maxTimeMs: maxTimeNumber,
      tests: formattedTests,
      testResults: formattedTests,
      problemUrl: taskPageUrl,
      language: language,
      studentId: studentId || null,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`   ❌ Gagal submisi ke CSES:`, error.message);
    return {
      success: false,
      platform: 'CSES',
      error: error.message,
      problemUrl: taskPageUrl,
      language: language,
      studentId: studentId || null,
      timestamp: new Date().toISOString()
    };
  } finally {
    if (fs.existsSync(tempFilePath)) {
      try { fs.unlinkSync(tempFilePath); } catch (e) {}
    }
    await browser.close();
  }
}

module.exports = {
  submitToCSES,
  normalizeCsesTaskId,
  ensureCsesAuth
};
