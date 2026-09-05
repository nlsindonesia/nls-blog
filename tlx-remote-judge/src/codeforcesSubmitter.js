/**
 * src/codeforcesSubmitter.js
 * Core engine berbasis Playwright Chrome untuk melakukan submisi kode ke Codeforces (codeforces.com)
 * menggunakan akun bot (@nls_bot) dan memantau status penilaian (verdict) realtime.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');
const config = require('./config');

/**
 * Ekstraksi Problem Code dari URL atau format string Codeforces.
 * Contoh input:
 * - "4A", "1700B", "1A"
 * - "https://codeforces.com/problemset/problem/4/A" -> "4A"
 * - "https://codeforces.com/contest/4/problem/A" -> "4A"
 */
function parseCodeforcesTarget(input) {
  if (!input) return null;
  const str = String(input).trim();

  // Pattern problemset URL: /problemset/problem/1234/A
  const psetUrlMatch = str.match(/problemset\/problem\/(\d+)\/([a-zA-Z0-9]+)/i);
  if (psetUrlMatch) {
    const contestId = psetUrlMatch[1];
    const index = psetUrlMatch[2].toUpperCase();
    return {
      problemCode: `${contestId}${index}`,
      contestId,
      index,
      url: `https://codeforces.com/problemset/problem/${contestId}/${index}`
    };
  }

  // Pattern contest URL: /contest/1234/problem/A
  const contestUrlMatch = str.match(/contest\/(\d+)\/problem\/([a-zA-Z0-9]+)/i);
  if (contestUrlMatch) {
    const contestId = contestUrlMatch[1];
    const index = contestUrlMatch[2].toUpperCase();
    return {
      problemCode: `${contestId}${index}`,
      contestId,
      index,
      url: `https://codeforces.com/contest/${contestId}/problem/${index}`
    };
  }

  // Pattern code string langsung: 4A, 1700B, 1A
  const codeMatch = str.match(/^(\d+)([a-zA-Z][a-zA-Z0-9]*)$/i);
  if (codeMatch) {
    const contestId = codeMatch[1];
    const index = codeMatch[2].toUpperCase();
    return {
      problemCode: `${contestId}${index}`,
      contestId,
      index,
      url: `https://codeforces.com/problemset/problem/${contestId}/${index}`
    };
  }

  // Fallback
  return {
    problemCode: str.toUpperCase(),
    contestId: '',
    index: str.toUpperCase(),
    url: str
  };
}

/**
 * Ekstensi file kodingan berdasarkan bahasa
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
  return '.txt';
}

/**
 * Submisi kode ke Codeforces dan polling hasil penilaian
 */
async function submitToCodeforces({ problemUrl, language = 'cpp20', sourceCode, studentId }) {
  const target = parseCodeforcesTarget(problemUrl);
  if (!target || !target.problemCode) {
    throw new Error(`Target soal Codeforces tidak valid: "${problemUrl}". Contoh valid: "4A", "1700B", atau "https://codeforces.com/problemset/problem/4/A"`);
  }

  if (!fs.existsSync(config.CODEFORCES_SESSION_PATH)) {
    throw new Error('File session/codeforces_session.json belum ada. Harap jalankan "npm run codeforces-login" di folder tlx-remote-judge untuk membuat sesi bot Codeforces (@nls_bot)!');
  }

  if (!sourceCode || !sourceCode.trim()) {
    throw new Error('Source code tidak boleh kosong!');
  }

  const { problemCode, url: cfUrl } = target;
  const submitPageUrl = 'https://codeforces.com/problemset/submit';

  console.log(`\n🚀 [Codeforces Submitter] Memulai submisi...`);
  console.log(`   Problem Code : ${problemCode}`);
  console.log(`   URL Soal     : ${cfUrl}`);
  console.log(`   Bahasa       : ${language}`);
  if (studentId) console.log(`   Siswa ID     : ${studentId}`);

  // Launch browser menggunakan offscreen Chrome agar Cloudflare Turnstile ter-resolve otomatis
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--window-position=-2400,-2400',
      '--window-size=1280,800'
    ]
  });

  const context = await browser.newContext({
    storageState: config.CODEFORCES_SESSION_PATH,
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  // Buat file temporary untuk source code
  const tempExt = getFileExtension(language);
  const tempFilePath = path.join(os.tmpdir(), `cf_sol_${Date.now()}${tempExt}`);
  fs.writeFileSync(tempFilePath, sourceCode, 'utf8');

  try {
    // 1. Kunjungi halaman submit
    console.log(`   🌐 Membuka halaman submit: ${submitPageUrl}...`);
    await page.goto(submitPageUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });

    // Cek apakah diarahkan ke login
    if (page.url().includes('/enter')) {
      throw new Error('Sesi Codeforces kadaluarsa. Harap jalankan "npm run codeforces-login" untuk login ulang!');
    }

    // 2. Isi kode soal
    console.log(`   🎯 Mengisikan kode soal: ${problemCode}...`);
    await page.waitForSelector('input[name="submittedProblemCode"]', { timeout: 10000 });
    await page.fill('input[name="submittedProblemCode"]', problemCode);

    // 3. Pilih Bahasa Pemrograman
    console.log(`   ⚙️ Menyesuaikan bahasa kodingan: ${language}...`);
    const langKey = (language || 'cpp').toLowerCase();
    await page.evaluate((lKey) => {
      const sel = document.querySelector('select[name="programTypeId"]');
      if (!sel) return;

      let matchRegex = /G\+\+20|G\+\+17|C\+\+/i;
      if (lKey.includes('py')) matchRegex = /Python 3|PyPy 3/i;
      else if (lKey.includes('java')) matchRegex = /Java 21|Java 17|Java 8/i;
      else if (lKey.includes('c') && !lKey.includes('+')) matchRegex = /GCC C11|GNU C/i;
      else if (lKey.includes('rust')) matchRegex = /Rust/i;
      else if (lKey.includes('js') || lKey.includes('node')) matchRegex = /Node\.js/i;
      else if (lKey.includes('pas')) matchRegex = /Pascal/i;

      for (const opt of sel.options) {
        if (matchRegex.test(opt.innerText)) {
          sel.value = opt.value;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }, langKey);

    // 4. Masukkan Source Code (File & Textarea)
    console.log(`   📄 Memasukkan source code ke form submit...`);
    const fileInput = page.locator('input[type="file"][name="sourceFile"]');
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(tempFilePath).catch(() => {});
    }

    await page.evaluate((code) => {
      const ta = document.querySelector('textarea[name="source"]');
      if (ta) {
        ta.value = code;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        ta.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (window.ace) {
        const editors = document.querySelectorAll('.ace_editor');
        if (editors.length > 0) {
          const ed = window.ace.edit(editors[0]);
          if (ed) ed.setValue(code);
        }
      }
    }, sourceCode);

    // 5. Tunggu Token Cloudflare Turnstile selesai otomatis
    console.log(`   🛡️ Menunggu verifikasi Cloudflare Turnstile...`);
    let turnstileResolved = false;
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(1000);
      const token = await page.$eval('input[name="turnstileToken"]', el => el.value).catch(() => '');
      if (token) {
        console.log(`   ✓ Turnstile token diperoleh dalam ${i + 1}s!`);
        turnstileResolved = true;
        break;
      }
    }

    if (!turnstileResolved) {
      console.warn(`   ⚠️ Turnstile token belum muncul, mencoba submit langsung...`);
    }

    // 6. Klik Submit
    console.log(`   📤 Menekan tombol Submit resmi Codeforces...`);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}),
      page.click('#singlePageSubmitButton, input[type="submit"].submit')
    ]);

    const afterSubmitUrl = page.url();
    console.log(`   ⏳ Form terkirim! URL saat ini: ${afterSubmitUrl}`);

    // Buka halaman submissions jika belum di sana
    const submissionsUrl = 'https://codeforces.com/submissions/nls_bot';
    if (!afterSubmitUrl.includes('/status') && !afterSubmitUrl.includes('/submissions')) {
      await page.goto(submissionsUrl, { waitUntil: 'domcontentloaded' });
    }

    // 7. Polling Hasil Penilaian
    const startTime = Date.now();
    let finalVerdict = 'Pending';
    let finalSubmissionId = null;
    let finalScore = 0;
    let finalRuntime = '-';
    let finalMemory = '-';
    let finalProblemText = `Codeforces ${problemCode}`;

    while (Date.now() - startTime < config.JUDGING_TIMEOUT_MS) {
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForTimeout(2000);

      const rowData = await page.evaluate(() => {
        const row = document.querySelector('tr[data-submission-id]');
        if (!row) return null;
        const subId = row.getAttribute('data-submission-id');
        const cells = Array.from(row.querySelectorAll('td')).map(c => c.innerText.trim());
        const verdictEl = row.querySelector('span.submissionVerdictWrapper') || row.querySelector('td.status-verdict-cell');
        const verdict = verdictEl ? verdictEl.innerText.trim() : (cells[5] || '');

        return {
          submissionId: subId,
          problemText: cells[3] || '',
          verdict,
          time: cells[6] || '-',
          memory: cells[7] || '-'
        };
      });

      if (rowData) {
        finalSubmissionId = rowData.submissionId || finalSubmissionId;
        finalProblemText = rowData.problemText || finalProblemText;
        finalRuntime = rowData.time || finalRuntime;
        finalMemory = rowData.memory || finalMemory;

        const currentVerdict = rowData.verdict || '';
        console.log(`   📊 Status Codeforces [ID: ${finalSubmissionId}]: ${currentVerdict} | Waktu: ${finalRuntime} | Memori: ${finalMemory}`);

        const isStillGrading = /queue|running|judging|compiling/i.test(currentVerdict);

        if (!isStillGrading && currentVerdict.length > 0) {
          finalVerdict = currentVerdict;
          if (currentVerdict.toLowerCase().includes('accepted')) {
            finalVerdict = 'Accepted';
            finalScore = 100;
          } else if (currentVerdict.toLowerCase().includes('wrong answer')) {
            finalVerdict = currentVerdict; // misal "Wrong answer on test 3"
            finalScore = 0;
          } else if (currentVerdict.toLowerCase().includes('time limit')) {
            finalVerdict = currentVerdict;
            finalScore = 0;
          } else if (currentVerdict.toLowerCase().includes('memory limit')) {
            finalVerdict = currentVerdict;
            finalScore = 0;
          } else if (currentVerdict.toLowerCase().includes('compilation error')) {
            finalVerdict = 'Compilation Error';
            finalScore = 0;
          } else if (currentVerdict.toLowerCase().includes('runtime error')) {
            finalVerdict = currentVerdict;
            finalScore = 0;
          } else {
            finalScore = 0;
          }
          break;
        }
      }

      await page.waitForTimeout(2000);
    }

    console.log(`   🏁 Penilaian Codeforces selesai!`);
    console.log(`   Submission ID : ${finalSubmissionId}`);
    console.log(`   Verdict       : ${finalVerdict}`);
    console.log(`   Skor          : ${finalScore} / 100`);

    // Parse runtime ms
    let timeMsNumber = 0;
    const timeMatch = finalRuntime.match(/(\d+)/);
    if (timeMatch) timeMsNumber = parseInt(timeMatch[1], 10);

    const isAc = finalVerdict === 'Accepted';
    let vCode = 'WA';
    if (isAc) vCode = 'AC';
    else if (finalVerdict.toLowerCase().includes('time limit')) vCode = 'TLE';
    else if (finalVerdict.toLowerCase().includes('compilation error')) vCode = 'CE';
    else if (finalVerdict.toLowerCase().includes('runtime error')) vCode = 'RE';
    else if (finalVerdict.toLowerCase().includes('memory limit')) vCode = 'MLE';

    const testItem = {
      index: 1,
      label: `Evaluasi Resmi Codeforces (${finalProblemText})`,
      verdict: vCode,
      verdictCode: vCode,
      verdictName: finalVerdict,
      passed: isAc,
      points: isAc ? 100 : finalScore,
      maxPoints: 100,
      timeMs: timeMsNumber,
      executionTimeMs: timeMsNumber
    };

    return {
      success: true,
      platform: 'Codeforces',
      problemCode,
      problemUrl: cfUrl,
      submissionId: finalSubmissionId,
      verdict: finalVerdict,
      verdictCode: vCode,
      score: finalScore,
      time: finalRuntime,
      memory: finalMemory,
      testsPassed: isAc ? 1 : 0,
      totalTests: 1,
      testCases: [testItem],
      results: [testItem],
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error(`   ❌ [Codeforces Submitter] Error: ${err.message}`);
    throw err;
  } finally {
    try {
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    } catch (e) {}
    await browser.close();
  }
}

module.exports = {
  submitToCodeforces,
  parseCodeforcesTarget
};
