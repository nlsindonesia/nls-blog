/**
 * scripts/codeforces-login.js
 * Skrip satu kali untuk login ke Codeforces (handle: @nls_bot)
 * dan menyimpan sesi (cookies & storage) ke session/codeforces_session.json.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const SESSION_DIR = path.resolve(__dirname, '../session');
const SESSION_FILE = process.env.CODEFORCES_SESSION_PATH
  ? path.resolve(__dirname, '..', process.env.CODEFORCES_SESSION_PATH)
  : path.join(SESSION_DIR, 'codeforces_session.json');

const CF_HANDLE = process.env.CODEFORCES_HANDLE || 'nls_bot';
const CF_PASSWORD = process.env.CODEFORCES_PASSWORD || '@NLSIndonesia1$';

async function runCodeforcesLogin() {
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
  }

  console.log('\n======================================================');
  console.log('🤖 CODEFORCES REMOTE JUDGE - AUTO LOGIN SESI');
  console.log(`   Akun Bot : @${CF_HANDLE}`);
  console.log('======================================================\n');

  console.log('1. Membuka browser Chromium...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    console.log('2. Membuka halaman login: https://codeforces.com/enter ...');
    await page.goto('https://codeforces.com/enter', { waitUntil: 'domcontentloaded', timeout: 35000 });

    console.log(`3. Memasukkan kredensial bot (@${CF_HANDLE})...`);
    await page.waitForSelector('#handleOrEmail', { timeout: 10000 });
    await page.fill('#handleOrEmail', CF_HANDLE);
    await page.fill('#password', CF_PASSWORD);
    await page.check('#remember').catch(() => {});

    console.log('4. Mengirim form login...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('Nav:', e.message)),
      page.click('.submit, input[type="submit"]')
    ]);

    // Cek apakah login berhasil
    const loggedInUser = await page.evaluate(() => {
      const link = document.querySelector('a[href*="/profile/"]');
      return link ? link.innerText.trim() : null;
    });

    if (loggedInUser) {
      console.log(`\n🎉 LOGIN BERHASIL! Terdeteksi sebagai user: @${loggedInUser}`);
      console.log('💾 Menyimpan sesi ke file...');
      await context.storageState({ path: SESSION_FILE });

      // Duplikasi ke nested directory jika ada
      const nestedSessionDir = path.resolve(__dirname, '../../nls-blog-hame/tlx-remote-judge/session');
      if (fs.existsSync(nestedSessionDir)) {
        await context.storageState({ path: path.join(nestedSessionDir, 'codeforces_session.json') });
      }

      console.log(`   👉 File sesi tersimpan: ${SESSION_FILE}`);
      console.log('Sekarang bot siap melakukan submisi otomatis ke Codeforces!\n');
    } else {
      const errorText = await page.evaluate(() => {
        const err = document.querySelector('.error.for__password, .error.for__handleOrEmail, .error');
        return err ? err.innerText.trim() : 'Gagal login';
      });
      throw new Error(`Login gagal: ${errorText}`);
    }
  } catch (err) {
    console.error('\n❌ Terjadi kesalahan saat login Codeforces:', err.message);
  } finally {
    await browser.close();
  }
}

runCodeforcesLogin();
