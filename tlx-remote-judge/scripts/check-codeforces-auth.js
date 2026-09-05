/**
 * scripts/check-codeforces-auth.js
 * Memeriksa status sesi login Codeforces (@nls_bot) secara headless.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const config = require('../src/config');

async function checkCodeforcesAuth() {
  const sessionPath = config.CODEFORCES_SESSION_PATH || path.resolve(__dirname, '../session/codeforces_session.json');
  console.log('======================================================');
  console.log('🔍 CODEFORCES AUTH STATUS CHECK');
  console.log(`   Session Path : ${sessionPath}`);
  console.log('======================================================\n');

  if (!fs.existsSync(sessionPath)) {
    console.log('❌ File session/codeforces_session.json BELUM DITEMUKAN.');
    console.log('   Jalankan "npm run codeforces-login" untuk membuat sesi pertama kali.\n');
    return { loggedIn: false };
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    storageState: sessionPath,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    console.log('🌐 Memeriksa akun di https://codeforces.com ...');
    await page.goto('https://codeforces.com/', { waitUntil: 'domcontentloaded', timeout: 25000 });

    const userLink = await page.evaluate(() => {
      const link = document.querySelector('a[href*="/profile/"]');
      return link ? link.innerText.trim() : null;
    });

    if (userLink) {
      console.log(`✅ SESI AKTIF & VALID!`);
      console.log(`   Logged In User : @${userLink}\n`);
      return { loggedIn: true, user: userLink };
    } else {
      console.log('⚠️ Sesi tidak valid atau telah kadaluarsa.');
      console.log('   Jalankan "npm run codeforces-login" untuk memperbarui sesi.\n');
      return { loggedIn: false };
    }
  } catch (err) {
    console.error('❌ Terjadi kesalahan saat memeriksa sesi:', err.message);
    return { loggedIn: false, error: err.message };
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  checkCodeforcesAuth().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { checkCodeforcesAuth };
