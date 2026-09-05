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
  const trimmed = inputUrl.trim();
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
 * Dapatkan label bahasa di TLX
 */
function getTlxLanguageLabel(langKey) {
  const key = (langKey || '').toLowerCase();
  if (key.includes('cpp20') || key.includes('c++20')) return 'C++20';
  if (key.includes('cpp17') || key.includes('c++17')) return 'C++17';
  if (key.includes('cpp') || key.includes('c++')) return 'C++20';
  if (key === 'c') return 'C11';
  if (key.includes('py')) return 'Python 3';
  if (key.includes('java')) return 'Java 21';
  if (key.includes('pas')) return 'Free Pascal';
  if (key.includes('go')) return 'Go';
  if (key.includes('rust')) return 'Rust';
  return 'C++20';
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
    // 1. Kunjungi halaman soal
    console.log(`   🌐 Membuka halaman soal TLX...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 45000 });

    // 2. Pilih Bahasa jika berbeda dengan default
    const targetLangLabel = getTlxLanguageLabel(language);
    const langBtn = page.locator('.bp6-popover-target button:has-text("C++"), .bp6-popover-target button:has-text("Python"), .bp6-popover-target button:has-text("Java"), .bp6-popover-target button:has-text("Pascal")');
    if (await langBtn.count() > 0) {
      const currentLang = await langBtn.first().innerText().catch(() => '');
      if (!currentLang.includes(targetLangLabel)) {
        console.log(`   🔄 Mengubah bahasa dari ${currentLang} ke ${targetLangLabel}...`);
        await langBtn.first().click();
        await page.waitForTimeout(500);
        const targetOption = page.locator(`.bp6-menu-item:has-text("${targetLangLabel}")`);
        if (await targetOption.count() > 0) {
          await targetOption.first().click();
          await page.waitForTimeout(500);
        }
      }
    }

    // 3. Masukkan file kodingan ke input form
    console.log(`   📄 Mengunggah file solusi kodingan...`);
    const fileInput = page.locator('input[name="sourceFiles.source"], input[type="file"]');
    if (await fileInput.count() === 0) {
      throw new Error('Tidak dapat menemukan kolom upload file kodingan di halaman soal TLX.');
    }
    await fileInput.first().setInputFiles(tempFilePath);
    await page.waitForTimeout(800);

    // 4. Klik tombol Submit yang telah aktif (enabled)
    const submitBtn = page.locator('button[type="submit"]:has-text("Submit"), button[type="submit"]:has-text("Kirim")').first();
    await submitBtn.waitFor({ state: 'visible', timeout: 10000 });

    // Pastikan tombol Submit (bukan tombol switch bahasa) sudah aktif / tidak disabled
    await page.waitForFunction(() => {
      const btns = Array.from(document.querySelectorAll('button[type="submit"]'));
      const btn = btns.find(b => b.innerText.includes('Submit') || b.innerText.includes('Kirim'));
      return btn && !btn.disabled && !btn.classList.contains('bp6-disabled');
    }, { timeout: 15000 });

    console.log(`   📤 Menekan tombol Submit resmi TLX...`);
    await submitBtn.click();

    // 5. Tunggu redirect ke halaman submisi pengguna
    console.log(`   ⏳ Submisi terkirim! Menunggu halaman submisi TLX...`);
    await page.waitForURL('**/submissions/**', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);

    // Fallback jika belum otomatis redirect ke submissions
    if (!page.url().includes('/submissions')) {
      console.log(`   ℹ️ Mengarahkan ke halaman riwayat submisi: ${targetUrl}/submissions/mine`);
      await page.goto(`${targetUrl}/submissions/mine`, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2000);
    }

    // 6. Polling hasil penilaian pada tabel submisi pengguna
    await page.locator('table:has-text("Verdict")').first().waitFor({ state: 'attached', timeout: 15000 }).catch(() => {});
    const startTime = Date.now();
    let finalVerdict = 'Pending';
    let finalSubmissionId = null;
    let finalRuntime = '-';
    let finalMemory = '-';
    let finalScore = 0;

    while (Date.now() - startTime < config.JUDGING_TIMEOUT_MS) {
      // Cari tabel submissions resmi TLX (menghindari tabel leaderboard top users)
      const rowsData = await page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table'));
        const subTable = tables.find(t => {
          const text = t.innerText;
          return text.includes('Verdict') && (text.includes('Lang') || text.includes('Time') || text.includes('ID'));
        });
        if (!subTable) return null;

        const rows = Array.from(subTable.querySelectorAll('tbody tr, tr'));
        for (const r of rows) {
          const cells = Array.from(r.querySelectorAll('td')).map(c => c.innerText.trim());
          if (cells.length >= 4) {
            return {
              rawText: r.innerText,
              cells: cells
            };
          }
        }
        return null;
      });

      if (rowsData && rowsData.cells && rowsData.cells.length >= 4) {
        const cells = rowsData.cells;
        finalSubmissionId = cells[0] || null;
        // cells format: [ID, User, Lang, Verdict, TimeSubmitted, Action]
        const verdictText = cells[3] || cells.find(c => /Accepted|Wrong Answer|Time Limit|Memory Limit|Compilation Error|Runtime Error|Pending|Grading/i.test(c)) || rowsData.rawText;

        console.log(`   📊 Status saat ini [ID: ${finalSubmissionId}]: ${verdictText}`);

        const isStillGrading = /Pending|Grading|Menunggu|Menilai/i.test(verdictText);

        if (!isStillGrading && /Accepted|Wrong Answer|Time Limit|Memory Limit|Compilation Error|Runtime Error/i.test(verdictText)) {
          if (/Accepted|Diterima/i.test(verdictText)) {
            finalVerdict = 'Accepted';
            finalScore = 100;
          } else if (/Wrong Answer/i.test(verdictText)) {
            finalVerdict = 'Wrong Answer';
            finalScore = 0;
          } else if (/Time Limit/i.test(verdictText)) {
            finalVerdict = 'Time Limit Exceeded';
            finalScore = 0;
          } else if (/Memory Limit/i.test(verdictText)) {
            finalVerdict = 'Memory Limit Exceeded';
            finalScore = 0;
          } else if (/Compilation Error/i.test(verdictText)) {
            finalVerdict = 'Compilation Error';
            finalScore = 0;
          } else if (/Runtime Error/i.test(verdictText)) {
            finalVerdict = 'Runtime Error';
            finalScore = 0;
          }

          // Cek apakah ada skor di baris tersebut
          const scoreMatch = verdictText.match(/(\d{1,3})\s*\/\s*100/) || verdictText.match(/Score:\s*(\d{1,3})/i);
          if (scoreMatch) finalScore = parseInt(scoreMatch[1], 10);

          // Ambil detail waktu dan memori jika ada
          const timeMatch = rowsData.rawText.match(/(\d+(\.\d+)?\s*(ms|s))/i);
          if (timeMatch) finalRuntime = timeMatch[0];

          const memMatch = rowsData.rawText.match(/(\d+(\.\d+)?\s*(MB|KB))/i);
          if (memMatch) finalMemory = memMatch[0];

          break;
        }
      }

      await page.waitForTimeout(3000);
      // Reload halaman submissions agar TLX SPA merender status terbaru dari backend
      if (page.url().includes('/submissions')) {
        await page.reload({ waitUntil: 'networkidle' }).catch(() => {});
        await page.locator('table:has-text("Verdict")').first().waitFor({ state: 'attached', timeout: 8000 }).catch(() => {});
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
