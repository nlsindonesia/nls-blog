/**
 * scripts/login.js
 * Skrip satu kali untuk membuka browser, login secara manual ke TLX TOKI,
 * dan menyimpan sesi (cookies & storage) ke session/tlx_session.json.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
require('dotenv').config();

const SESSION_DIR = path.resolve(__dirname, '../session');
const SESSION_FILE = process.env.SESSION_PATH
  ? path.resolve(__dirname, '..', process.env.SESSION_PATH)
  : path.join(SESSION_DIR, 'tlx_session.json');

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

async function runLogin() {
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
  }

  console.log('\n======================================================');
  console.log('🤖 TLX REMOTE JUDGE - SETUP LOGIN SESI');
  console.log('======================================================\n');
  console.log('Browser Chromium akan dibuka dalam mode terlihat (GUI).');
  console.log('Silakan masukkan username/password TLX Anda dan selesaikan CAPTCHA.');
  console.log('Setelah berhasil masuk ke dashboard TLX, sesi akan otomatis disimpan.\n');

  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: null // Gunakan ukuran jendela sebenarnya
  });

  const page = await context.newPage();

  try {
    console.log('🌐 Membuka https://tlx.toki.id/login ...');
    await page.goto('https://tlx.toki.id/login', { waitUntil: 'domcontentloaded' });

    console.log('\n⏳ Menunggu Anda login di jendela browser...');
    console.log('💡 TIP: Begitu Anda sudah berhasil login dan melihat beranda TLX,');
    console.log('   skrip akan mendeteksinya otomatis, atau Anda bisa menekan tombol ENTER di terminal ini jika sudah selesai.\n');

    // Buat race condition: tunggu auto-detect URL / elemen ATAU user menekan ENTER di terminal
    const autoDetectPromise = (async () => {
      // Loop cek apakah sudah tidak di /login dan ada indikator login
      for (let i = 0; i < 180; i++) { // Max 3 menit
        await new Promise((r) => setTimeout(r, 1500));
        const url = page.url();
        const cookies = await context.cookies();
        const hasSessionCookie = cookies.some((c) =>
          c.name.toLowerCase().includes('session') ||
          c.name.toLowerCase().includes('jophiel') ||
          c.name.toLowerCase().includes('play')
        );

        const isNotOnLoginPage = !url.includes('/login');
        if (isNotOnLoginPage && hasSessionCookie) {
          // Tunggu 2 detik tambahan agar storage state tersinkronisasi penuh
          await page.waitForTimeout(2000);
          return true;
        }
      }
      return false;
    })();

    const manualEnterPromise = promptEnter('👉 Tekan [ENTER] di sini setelah Anda selesai login di browser...');

    // Tunggu salah satu terpenuhi
    await Promise.race([autoDetectPromise, manualEnterPromise]);

    console.log('\n💾 Menyimpan sesi ke file...');
    await context.storageState({ path: SESSION_FILE });

    console.log(`\n✅ BERHASIL! Sesi login disimpan di: ${SESSION_FILE}`);
    console.log('Sekarang bot dapat menjalankan submisi di background tanpa login ulang.\n');
  } catch (err) {
    console.error('\n❌ Terjadi kesalahan saat proses login:', err.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

runLogin();
