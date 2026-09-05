/**
 * src/tlxSubmitter.js
 * Core engine berbasis Playwright untuk melakukan submisi kode ke TLX TOKI
 * dan memantau status penilaian (verdict) dari server resmi TLX.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');
const config = require('./config');

/**
 * Normalisasi URL soal TLX
 */
function normalizeProblemUrl(inputUrl) {
  const trimmed = (inputUrl || '').trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://tlx.toki.id/problems/${trimmed.replace(/^\/+/, '')}`;
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
  if (key.includes('go')) return '.go';
  if (key.includes('rust')) return '.rs';
  return '.txt';
}

/**
 * Submisi kode ke TLX dan polling hasil penilaian
 */
async function submitToTLX({ problemUrl, language = 'cpp20', sourceCode, studentId }) {
  if (!fs.existsSync(config.SESSION_PATH)) {
    throw new Error('File session/tlx_session.json belum ada. Harap jalankan "npm run login" terlebih dahulu!');
  }

  if (!sourceCode || !sourceCode.trim()) {
    throw new Error('Source code tidak boleh kosong!');
  }

  const targetUrl = normalizeProblemUrl(problemUrl);
  console.log(`\n🚀 [TLX Submitter] Memulai submisi...`);
  console.log(`   URL Soal : ${targetUrl}`);
  console.log(`   Bahasa   : ${language}`);
  if (studentId) console.log(`   Siswa ID : ${studentId}`);

  const browser = await chromium.launch({
    headless: config.HEADLESS,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    storageState: config.SESSION_PATH,
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  // Buat file temporary untuk source code
  const tempExt = getFileExtension(language);
  const tempFilePath = path.join(os.tmpdir(), `solution_${Date.now()}${tempExt}`);
  fs.writeFileSync(tempFilePath, sourceCode, 'utf8');

  try {
    // 1. Kunjungi halaman soal TLX
    console.log(`   🌐 Membuka halaman soal TLX...`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(3000);

    // 2. Pilih Bahasa di form TLX sesuai opsi yang tersedia
    let langBtn = page.locator('form').filter({ hasText: 'Language' }).locator('.bp6-popover-target button').first();
    if (await langBtn.count() === 0) {
      langBtn = page.locator('.bp6-popover-target button').first();
    }

    if (await langBtn.count() > 0) {
      await langBtn.click();
      await page.waitForTimeout(600);
      const availableItems = await page.locator('.bp6-menu-item').allInnerTexts().catch(() => []);

      let bestOption = null;
      const langLow = (language || 'cpp').toLowerCase();
      if (langLow.includes('cpp') || langLow.includes('c++')) {
        bestOption = availableItems.find(i => /C\+\+20/i.test(i)) ||
                     availableItems.find(i => /C\+\+17/i.test(i)) ||
                     availableItems.find(i => /C\+\+14/i.test(i)) ||
                     availableItems.find(i => /C\+\+11/i.test(i)) ||
                     availableItems.find(i => /C\+\+/i.test(i));
      } else if (langLow.includes('py')) {
        bestOption = availableItems.find(i => /Python\s*3/i.test(i)) ||
                     availableItems.find(i => /Python/i.test(i));
      } else if (langLow.includes('java')) {
        bestOption = availableItems.find(i => /Java\s*21/i.test(i)) ||
                     availableItems.find(i => /Java\s*17/i.test(i)) ||
                     availableItems.find(i => /Java/i.test(i));
      } else if (langLow.includes('pas')) {
        bestOption = availableItems.find(i => /Pascal/i.test(i));
      } else if (langLow === 'c') {
        bestOption = availableItems.find(i => /^C$/i.test(i.trim())) ||
                     availableItems.find(i => /C11/i.test(i)) ||
                     availableItems.find(i => /C99/i.test(i));
      }

      if (bestOption) {
        console.log(`   🔄 Memilih bahasa "${bestOption}" dari daftar compiler TLX...`);
        await page.locator('.bp6-menu-item').filter({ hasText: bestOption }).first().click();
        await page.waitForTimeout(600);
      } else {
        await page.keyboard.press('Escape');
      }
    }

    // 3. Masukkan file kodingan ke input form
    console.log(`   📄 Mengunggah file solusi kodingan...`);
    const fileInput = page.locator('input[name="sourceFiles.source"], input[type="file"]').first();
    if (await fileInput.count() === 0) {
      throw new Error('Tidak dapat menemukan kolom upload file kodingan di halaman soal TLX.');
    }
    await fileInput.setInputFiles(tempFilePath);
    await page.waitForTimeout(1000);

    // 4. Klik tombol Submit resmi TLX
    const submitBtn = page.locator('button[type="submit"]:has-text("Submit"), button[type="submit"]:has-text("Kirim")').first();
    await submitBtn.waitFor({ state: 'visible', timeout: 10000 });

    await page.waitForFunction(() => {
      const btns = Array.from(document.querySelectorAll('button[type="submit"]'));
      const btn = btns.find(b => b.innerText.includes('Submit') || b.innerText.includes('Kirim'));
      return btn && !btn.disabled && !btn.classList.contains('bp6-disabled');
    }, { timeout: 15000 });

    console.log(`   📤 Menekan tombol Submit resmi TLX...`);
    await submitBtn.click();

    // 5. Tunggu redirect ke halaman riwayat submisi
    console.log(`   ⏳ Submisi terkirim! Menunggu halaman submisi TLX...`);
    await page.waitForURL('**/submissions/**', { timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const mineUrl = targetUrl.replace(/\/+$/, '') + '/submissions/mine';
    console.log(`   ℹ️ Membuka riwayat submisi pribadi: ${mineUrl}`);
    await page.goto(mineUrl, { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // 6. Polling hasil penilaian pada tabel submisi TLX
    const startTime = Date.now();
    let finalVerdict = 'Pending';
    let finalSubmissionId = null;
    let finalRuntime = '-';
    let finalMemory = '-';
    let finalScore = 0;
    let finalTests = [];

    while (Date.now() - startTime < config.JUDGING_TIMEOUT_MS) {
      const rowData = await page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table'));
        const subTable = tables.find(t => t.innerText.includes('Verdict') && t.innerText.includes('Lang'));
        if (!subTable) return null;
        const trs = Array.from(subTable.querySelectorAll('tbody tr, tr'));
        for (const tr of trs) {
          const tds = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
          if (tds.length >= 4) {
            return {
              id: tds[0],
              user: tds[1],
              lang: tds[2],
              verdict: tds[3],
              time: tds[4] || '',
              rawText: tr.innerText
            };
          }
        }
        return null;
      });

      if (rowData && rowData.id) {
        finalSubmissionId = rowData.id;
        const vText = rowData.verdict;
        console.log(`   📊 Status saat ini [ID: ${finalSubmissionId}]: ${vText.replace(/\n/g, ' ')}`);

        const isStillGrading = /Pending|Grading|Menunggu|Menilai/i.test(vText);

        if (!isStillGrading && /Accepted|Wrong Answer|Time Limit|Memory Limit|Compilation Error|Runtime Error/i.test(vText)) {
          if (/Accepted|Diterima/i.test(vText)) {
            finalVerdict = 'Accepted';
            finalScore = 100;
          } else if (/Wrong Answer/i.test(vText)) {
            finalVerdict = 'Wrong Answer';
            finalScore = 0;
          } else if (/Time Limit/i.test(vText)) {
            finalVerdict = 'Time Limit Exceeded';
            finalScore = 0;
          } else if (/Memory Limit/i.test(vText)) {
            finalVerdict = 'Memory Limit Exceeded';
            finalScore = 0;
          } else if (/Compilation Error/i.test(vText)) {
            finalVerdict = 'Compilation Error';
            finalScore = 0;
          } else if (/Runtime Error/i.test(vText)) {
            finalVerdict = 'Runtime Error';
            finalScore = 0;
          }

          // Skor jika ada di baris tabel, e.g. "Wrong Answer\n15"
          const scoreMatch = vText.match(/(\d{1,3})\s*\/\s*100/) || vText.match(/(\d{1,3})$/m);
          if (scoreMatch) {
            finalScore = parseInt(scoreMatch[1], 10);
          }

          // Format runtime dan memory jika tersedia
          const timeMatch = rowData.rawText.match(/(\d+(\.\d+)?\s*(ms|s))/i);
          if (timeMatch) finalRuntime = timeMatch[0];

          const memMatch = rowData.rawText.match(/(\d+(\.\d+)?\s*(MB|KB))/i);
          if (memMatch) finalMemory = memMatch[0];

          break;
        }
      }

      await page.waitForTimeout(3000);
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForTimeout(1500);
    }

    // 7. Ambil rincian kasus uji / subsoal autentik jika submissionId tersedia
    if (finalSubmissionId) {
      try {
        console.log(`   🔎 Mengambil rincian kasus uji autentik dari https://tlx.toki.id/submissions/${finalSubmissionId}...`);
        await page.goto(`https://tlx.toki.id/submissions/${finalSubmissionId}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(2000);

        const subtaskResults = await page.evaluate(() => {
          const text = document.body.innerText;
          const items = [];
          const regex = /Subtask\s+(\d+)[\s\n]+([A-Za-z\s]+)[\s\n]+(\d+)/gi;
          let m;
          while ((m = regex.exec(text)) !== null) {
            const pts = parseInt(m[3], 10);
            const vName = m[2].trim();
            const isAc = /Accepted|Diterima/i.test(vName);
            items.push({
              index: parseInt(m[1], 10),
              label: `Subsoal #${m[1]}`,
              verdict: isAc ? 'AC' : 'WA',
              verdictCode: isAc ? 'AC' : 'WA',
              verdictName: vName,
              passed: isAc,
              points: pts,
              maxPoints: 100,
              executionTimeMs: 0
            });
          }
          return items;
        });

        if (subtaskResults && subtaskResults.length > 0) {
          finalTests = subtaskResults;
          const totalEarned = finalTests.reduce((sum, s) => sum + (s.points || 0), 0);
          if (totalEarned > 0 || finalScore === 0) {
            finalScore = totalEarned;
          }
          console.log(`   📋 Terdeteksi ${finalTests.length} subsoal autentik TLX (Total Skor: ${finalScore})`);
        }
      } catch (detailErr) {
        console.warn(`   ⚠️ Tidak dapat memuat detail halaman subtasks:`, detailErr.message);
      }
    }

    console.log(`   🏁 Penilaian TLX selesai!`);
    console.log(`   Submission ID : ${finalSubmissionId}`);
    console.log(`   Verdict       : ${finalVerdict}`);
    console.log(`   Skor          : ${finalScore} / 100`);

    return {
      success: true,
      submissionId: finalSubmissionId,
      verdict: finalVerdict,
      score: finalScore,
      time: finalRuntime,
      memory: finalMemory,
      tests: finalTests,
      problemUrl: targetUrl,
      language,
      studentId: studentId || null,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`   ❌ Gagal submisi ke TLX:`, error.message);
    return {
      success: false,
      error: error.message,
      problemUrl: targetUrl,
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
  submitToTLX,
  normalizeProblemUrl
};
