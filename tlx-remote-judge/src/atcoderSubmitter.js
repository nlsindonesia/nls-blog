/**
 * src/atcoderSubmitter.js
 * Core engine berbasis Playwright untuk melakukan submisi kode ke AtCoder (atcoder.jp)
 * menggunakan akun bot (@nls_bot) dan memantau status penilaian (verdict) realtime.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');
const config = require('./config');

/**
 * Normalisasi Contest ID & Task ID dari URL atau string AtCoder
 * Contoh input: "abc300_a", "https://atcoder.jp/contests/abc300/tasks/abc300_a"
 */
function parseAtcoderTarget(input) {
  if (!input) return null;
  const str = String(input).trim();

  // Pattern URL: https://atcoder.jp/contests/abc300/tasks/abc300_a
  const urlMatch = str.match(/contests\/([a-zA-Z0-9_\-]+)\/tasks\/([a-zA-Z0-9_\-]+)/i);
  if (urlMatch) {
    return {
      contestId: urlMatch[1].toLowerCase(),
      taskId: urlMatch[2].toLowerCase(),
      url: `https://atcoder.jp/contests/${urlMatch[1].toLowerCase()}/tasks/${urlMatch[2].toLowerCase()}`
    };
  }

  // Pattern Code: abc300_a, arc150_b, practice_1
  const codeMatch = str.match(/^([a-zA-Z0-9]+)_([a-zA-Z0-9_]+)$/);
  if (codeMatch) {
    const contestId = codeMatch[1].toLowerCase();
    const taskId = str.toLowerCase();
    return {
      contestId,
      taskId,
      url: `https://atcoder.jp/contests/${contestId}/tasks/${taskId}`
    };
  }

  // Fallback jika hanya contestId
  return {
    contestId: str.toLowerCase(),
    taskId: str.toLowerCase(),
    url: `https://atcoder.jp/contests/${str.toLowerCase()}`
  };
}

/**
 * Dapatkan ekstensi file kodingan
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
 * Submisi kode ke AtCoder dan polling hasil penilaian
 */
async function submitToAtCoder({ problemUrl, language = 'cpp20', sourceCode, studentId }) {
  const target = parseAtcoderTarget(problemUrl);
  if (!target || !target.contestId) {
    throw new Error(`Target soal AtCoder tidak valid: "${problemUrl}". Contoh valid: "abc300_a" atau "https://atcoder.jp/contests/abc300/tasks/abc300_a"`);
  }

  if (!fs.existsSync(config.ATCODER_SESSION_PATH)) {
    throw new Error('File session/atcoder_session.json belum ada. Harap jalankan "npm run atcoder-login" di folder tlx-remote-judge untuk login akun bot AtCoder (@nls_bot)!');
  }

  if (!sourceCode || !sourceCode.trim()) {
    throw new Error('Source code tidak boleh kosong!');
  }

  const { contestId, taskId, url: taskUrl } = target;
  const submitPageUrl = `https://atcoder.jp/contests/${contestId}/submit`;

  console.log(`\n🚀 [AtCoder Submitter] Memulai submisi...`);
  console.log(`   Contest ID : ${contestId}`);
  console.log(`   Task ID    : ${taskId}`);
  console.log(`   URL Soal   : ${taskUrl}`);
  console.log(`   Bahasa     : ${language}`);
  if (studentId) console.log(`   Siswa ID   : ${studentId}`);

  const browser = await chromium.launch({
    headless: config.HEADLESS,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    storageState: config.ATCODER_SESSION_PATH,
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  // Buat file temporary untuk source code
  const tempExt = getFileExtension(language);
  const tempFilePath = path.join(os.tmpdir(), `atcoder_sol_${Date.now()}${tempExt}`);
  fs.writeFileSync(tempFilePath, sourceCode, 'utf8');

  try {
    // 1. Kunjungi halaman submit kontes
    console.log(`   🌐 Membuka halaman submit kontes AtCoder: ${submitPageUrl}...`);
    await page.goto(submitPageUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });

    // Cek apakah terlempar ke login
    if (page.url().includes('/login')) {
      throw new Error('Sesi AtCoder telah kadaluarsa. Harap jalankan "npm run atcoder-login" untuk memperbarui login bot!');
    }

    // 2. Pilih Soal (Task) di Dropdown
    console.log(`   🎯 Memilih task: ${taskId}...`);
    const taskSelect = page.locator('select[name="data.TaskScreenName"]');
    if (await taskSelect.count() > 0) {
      // Cari opsi yang sesuai dengan taskId
      const selectedValue = await page.evaluate((tId) => {
        const sel = document.querySelector('select[name="data.TaskScreenName"]');
        if (!sel) return null;
        for (const opt of sel.options) {
          if (opt.value.toLowerCase() === tId || opt.innerText.toLowerCase().includes(tId)) {
            sel.value = opt.value;
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            return opt.value;
          }
        }
        return null;
      }, taskId);

      if (selectedValue) {
        console.log(`   ✓ Task terpilih: ${selectedValue}`);
      } else {
        console.warn(`   ⚠️ Tidak menemukan opsi persis untuk task ${taskId}, menggunakan opsi aktif.`);
      }
    }

    // 3. Pilih Bahasa Pemrograman
    console.log(`   ⚙️ Menyesuaikan bahasa kodingan: ${language}...`);
    const langKey = (language || 'cpp').toLowerCase();
    await page.evaluate((lKey) => {
      const sel = document.querySelector('select[name="data.LanguageId"]');
      if (!sel) return null;
      
      let targetPattern = /C\+\+/i;
      if (lKey.includes('py')) targetPattern = /Python|PyPy/i;
      else if (lKey.includes('java')) targetPattern = /Java/i;
      else if (lKey.includes('pas')) targetPattern = /Pascal/i;
      else if (lKey === 'c') targetPattern = /C\s*\(/i;
      else if (lKey.includes('rust')) targetPattern = /Rust/i;
      else if (lKey.includes('js') || lKey.includes('node')) targetPattern = /Node\.js|JavaScript/i;

      for (const opt of sel.options) {
        if (targetPattern.test(opt.innerText)) {
          sel.value = opt.value;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          return opt.innerText;
        }
      }
      return null;
    }, langKey);
    await page.waitForTimeout(400);

    // 4. Masukkan Kode Kodingan
    console.log(`   📄 Memasukkan source code ke form submit...`);
    const fileInput = page.locator('input[type="file"][name="sourceFile"]');
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(tempFilePath).catch(() => {});
    }

    await page.evaluate((code) => {
      const ta = document.querySelector('textarea[name="sourceCode"]');
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
    await page.waitForTimeout(600);

    // 5. Submit Form
    console.log(`   📤 Menekan tombol Submit resmi AtCoder...`);
    const submitBtn = page.locator('button[type="submit"], input[type="submit"], #submit').first();
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 25000 }).catch(() => {}),
      submitBtn.click()
    ]);

    const afterSubmitUrl = page.url();
    console.log(`   ⏳ Form terkirim! URL saat ini: ${afterSubmitUrl}`);

    // Pastikan berada di halaman riwayat submisi (/submissions/me)
    if (!afterSubmitUrl.includes('/submissions')) {
      console.log(`   ℹ️ Membuka halaman riwayat submisi pengguna: https://atcoder.jp/contests/${contestId}/submissions/me`);
      await page.goto(`https://atcoder.jp/contests/${contestId}/submissions/me`, { waitUntil: 'domcontentloaded' });
    }

    // 6. Polling Hasil Penilaian
    const startTime = Date.now();
    let finalVerdict = 'Pending';
    let finalSubmissionId = null;
    let finalScore = 0;
    let finalRuntime = '-';
    let finalMemory = '-';
    let finalTaskName = `AtCoder ${taskId.toUpperCase()}`;

    while (Date.now() - startTime < config.JUDGING_TIMEOUT_MS) {
      const rowData = await page.evaluate(() => {
        const table = document.querySelector('.table-responsive table, table.table');
        if (!table) return null;
        const row = table.querySelector('tbody tr');
        if (!row) return null;

        const cells = Array.from(row.querySelectorAll('td')).map(c => c.innerText.trim());
        const links = Array.from(row.querySelectorAll('a')).map(a => a.href);
        const detailLink = links.find(h => h.includes('/submissions/')) || null;
        const subIdMatch = detailLink ? detailLink.match(/submissions\/(\d+)/) : null;

        return {
          cells,
          rawText: row.innerText,
          detailLink,
          submissionId: subIdMatch ? subIdMatch[1] : null
        };
      });

      if (rowData && rowData.cells && rowData.cells.length >= 6) {
        finalSubmissionId = rowData.submissionId || finalSubmissionId;
        const c = rowData.cells;
        // Format tabel AtCoder:
        // [0: Time, 1: Task, 2: User, 3: Language, 4: Score, 5: Code Size, 6: Status, 7: Exec Time, 8: Memory]
        const taskText = c[1] || '';
        if (taskText) finalTaskName = taskText;

        const statusText = c[6] || rowData.rawText;
        const scoreText = c[4] || '0';
        finalRuntime = c[7] || finalRuntime;
        finalMemory = c[8] || finalMemory;

        console.log(`   📊 Status AtCoder [ID: ${finalSubmissionId}]: ${statusText} | Skor: ${scoreText} | Waktu: ${finalRuntime}`);

        const isGrading = /WJ|\d+\s*\/\s*\d+|Judging/i.test(statusText);

        if (!isGrading && /AC|WA|TLE|MLE|CE|RE/i.test(statusText)) {
          if (statusText.includes('AC')) {
            finalVerdict = 'Accepted';
            finalScore = 100;
          } else if (statusText.includes('WA')) {
            finalVerdict = 'Wrong Answer';
            finalScore = parseInt(scoreText, 10) || 0;
          } else if (statusText.includes('TLE')) {
            finalVerdict = 'Time Limit Exceeded';
            finalScore = parseInt(scoreText, 10) || 0;
          } else if (statusText.includes('MLE')) {
            finalVerdict = 'Memory Limit Exceeded';
            finalScore = 0;
          } else if (statusText.includes('CE')) {
            finalVerdict = 'Compilation Error';
            finalScore = 0;
          } else if (statusText.includes('RE')) {
            finalVerdict = 'Runtime Error';
            finalScore = 0;
          } else {
            finalVerdict = statusText;
            finalScore = parseInt(scoreText, 10) || 0;
          }
          break;
        }
      }

      await page.waitForTimeout(2500);
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    }

    console.log(`   🏁 Penilaian AtCoder selesai!`);
    console.log(`   Submission ID : ${finalSubmissionId}`);
    console.log(`   Verdict       : ${finalVerdict}`);
    console.log(`   Skor          : ${finalScore} / 100`);

    // Parse runtime ke integer ms
    let timeMsNumber = 0;
    const timeMatch = finalRuntime.match(/(\d+)/);
    if (timeMatch) timeMsNumber = parseInt(timeMatch[1], 10);

    const isAc = finalVerdict === 'Accepted';
    const vCode = isAc ? 'AC' : (finalVerdict.includes('Time') ? 'TLE' : (finalVerdict.includes('Compile') ? 'CE' : 'WA'));

    const testItem = {
      index: 1,
      label: `Evaluasi Resmi AtCoder (${finalTaskName})`,
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
      platform: 'AtCoder',
      contestId,
      taskId,
      taskName: finalTaskName,
      submissionId: finalSubmissionId || `atcoder-${Date.now()}`,
      verdict: finalVerdict,
      score: finalScore,
      time: finalRuntime,
      memory: finalMemory,
      maxTimeMs: timeMsNumber,
      tests: [testItem],
      testResults: [testItem],
      problemUrl: taskUrl,
      language,
      studentId: studentId || null,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`   ❌ Gagal submisi ke AtCoder:`, error.message);
    return {
      success: false,
      platform: 'AtCoder',
      error: error.message,
      problemUrl: taskUrl,
      language,
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
  submitToAtCoder,
  parseAtcoderTarget
};
