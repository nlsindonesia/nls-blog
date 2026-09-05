/**
 * scripts/atcoder-login.js
 * Skrip satu kali untuk membuka browser, login ke AtCoder (@nls_bot),
 * dan menyimpan sesi (cookies & storage) ke session/atcoder_session.json.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
require('dotenv').config();

const SESSION_DIR = path.resolve(__dirname, '../session');
const SESSION_FILE = process.env.ATCODER_SESSION_PATH
  ? path.resolve(__dirname, '..', process.env.ATCODER_SESSION_PATH)
  : path.join(SESSION_DIR, 'atcoder_session.json');

const ATCODER_USERNAME = process.env.ATCODER_USERNAME || 'nls_bot';
const ATCODER_PASSWORD = process.env.ATCODER_PASSWORD || 'maman123';

async function promptEnter(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(message, () => {
      rl.close();
      resolve();
    });
  });
}

async function runAtCoderLogin() {
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
  }

  console.log('\n======================================================');
  console.log('🤖 ATCODER REMOTE JUDGE - SETUP LOGIN SESI');
  console.log(`   Akun Bot : @${ATCODER_USERNAME}`);
  console.log('======================================================\n');
  console.log('Browser Chromium akan dibuka dalam mode GUI.');
  console.log(`Form username (${ATCODER_USERNAME}) dan password akan otomatis diisikan.`);
  console.log('Silakan selesaikan Cloudflare Turnstile (jika muncul checkbox) & klik "Sign In".');
  console.log('Setelah login berhasil, sesi akan otomatis disimpan dan aktif selama 6 bulan!\n');

  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--start-maximized'
    ]
  });

  const context = await browser.newContext({
    viewport: null,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    console.log('🌐 Membuka https://atcoder.jp/login ...');
    await page.goto('https://atcoder.jp/login', { waitUntil: 'domcontentloaded' });

    // Pre-fill credentials
    try {
      await page.waitForSelector('#username', { timeout: 8000 });
      await page.fill('#username', ATCODER_USERNAME);
      await page.fill('#password', ATCODER_PASSWORD);
      console.log('✍️ Username & password berhasil diisikan ke form.');
    } catch (e) {}

    console.log('\n⏳ Menunggu verifikasi login di jendela browser...');
    console.log('💡 TIP: Begitu Anda sudah berhasil masuk ke dashboard AtCoder,');
    console.log('   skrip akan mendeteksinya otomatis, atau tekan ENTER di terminal ini jika sudah selesai.\n');

    // Auto-detect loop
    const autoDetectPromise = (async () => {
      for (let i = 0; i < 180; i++) { // Max 3 menit
        await new Promise((r) => setTimeout(r, 1500));
        try {
          const url = page.url();
          const cookies = await context.cookies();
          const hasSessionCookie = cookies.some((c) =>
            c.name.includes('REVEL_SESSION') && c.value && !c.value.startsWith('-%00')
          );
          const hasUserLink = await page.evaluate(() => {
            const link = document.querySelector('a[href*="/users/"]');
            return link && !link.href.includes('/login') && !link.href.includes('/register');
          }).catch(() => false);

          const isNotOnLoginPage = !url.includes('/login');
          if (isNotOnLoginPage && (hasSessionCookie || hasUserLink)) {
            await page.waitForTimeout(2000);
            return true;
          }
        } catch (e) {}
      }
      return false;
    })();

    const manualEnterPromise = promptEnter('👉 Tekan [ENTER] di sini jika Anda sudah berhasil login di browser...');

    await Promise.race([autoDetectPromise, manualEnterPromise]);

    console.log('\n💾 Menyimpan sesi login ke file...');
    await context.storageState({ path: SESSION_FILE });

    // Juga duplikasi ke nls-blog-hame/tlx-remote-judge/session jika ada
    const nestedSessionDir = path.resolve(__dirname, '../../nls-blog-hame/tlx-remote-judge/session');
    if (fs.existsSync(nestedSessionDir)) {
      await context.storageState({ path: path.join(nestedSessionDir, 'atcoder_session.json') });
    }

    console.log(`\n🎉 BERHASIL! Sesi AtCoder tersimpan di:`);
    console.log(`   👉 ${SESSION_FILE}`);
    console.log('Sekarang bot dapat menjalankan submisi di background secara otomatis!\n');
  } catch (err) {
    console.error('\n❌ Terjadi kesalahan saat proses login:', err.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

runAtCoderLogin();
