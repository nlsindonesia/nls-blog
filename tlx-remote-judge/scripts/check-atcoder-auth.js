/**
 * scripts/check-atcoder-auth.js
 * Memeriksa status sesi login AtCoder secara headless.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const config = require('../src/config');

async function checkAtcoderAuth() {
  const sessionPath = config.ATCODER_SESSION_PATH || path.resolve(__dirname, '../session/atcoder_session.json');
  console.log('======================================================');
  console.log('🔍 ATCODER AUTH STATUS CHECK');
  console.log(`   Session Path : ${sessionPath}`);
  console.log('======================================================\n');

  if (!fs.existsSync(sessionPath)) {
    console.log('❌ File session/atcoder_session.json BELUM DITEMUKAN.');
    console.log('   Jalankan "npm run atcoder-login" untuk membuat sesi pertama kali.\n');
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
    console.log('🌐 Memeriksa dashboard AtCoder...');
    await page.goto('https://atcoder.jp/home', { waitUntil: 'domcontentloaded', timeout: 25000 });

    const userLink = await page.evaluate(() => {
      const link = document.querySelector('a[href*="/users/"]');
      return link ? link.innerText.trim() : null;
    });

    if (userLink && !userLink.toLowerCase().includes('sign')) {
      console.log(`✅ SESI AKTIF & VALID!`);
      console.log(`   Logged In User : @${userLink}\n`);
      return { loggedIn: true, user: userLink };
    } else {
      console.log('⚠️ Sesi tidak valid atau telah kadaluarsa.');
      console.log('   Jalankan "npm run atcoder-login" untuk memperbarui sesi.\n');
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
  checkAtcoderAuth();
}

module.exports = { checkAtcoderAuth };
