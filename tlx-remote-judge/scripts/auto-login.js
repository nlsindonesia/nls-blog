/**
 * scripts/auto-login.js
 * Skrip otomatis untuk mengisi username & password ke TLX dan menyimpan sesi.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SESSION_DIR = path.resolve(__dirname, '../session');
const SESSION_FILE = path.join(SESSION_DIR, 'tlx_session.json');

const USERNAME = process.argv[2] || 'nls_bot';
const PASSWORD = process.argv[3] || 'maman123';

async function autoLogin() {
  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
  }

  console.log('\n======================================================');
  console.log('🤖 TLX AUTO LOGIN');
  console.log('======================================================\n');
  console.log(`Username : ${USERNAME}`);
  console.log(`Password : ${'*'.repeat(PASSWORD.length)}`);
  console.log('\n🌐 Membuka browser...');

  const browser = await chromium.launch({
    headless: false, // Buka jendela agar jika ada captcha terlihat
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: null
  });

  const page = await context.newPage();

  try {
    console.log('🔗 Mengunjungi https://tlx.toki.id/login ...');
    await page.goto('https://tlx.toki.id/login', { waitUntil: 'networkidle', timeout: 45000 });

    console.log('🔍 Mencari kolom input username dan password...');

    // Tunggu form render
    await page.waitForSelector('input[name="username"], input[name="login"], input[type="text"]', { timeout: 15000 });

    // Isi Username
    const usernameInput = page.locator('input[name="username"], input[name="login"], input[type="text"]').first();
    await usernameInput.click();
    await usernameInput.fill('');
    await usernameInput.fill(USERNAME);
    console.log('✅ Username diisi');

    // Isi Password
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    await passwordInput.click();
    await passwordInput.fill('');
    await passwordInput.fill(PASSWORD);
    console.log('✅ Password diisi');

    await page.waitForTimeout(1000);

    // Cek apakah ada captcha di halaman
    const hasCaptcha = await page.locator('iframe[src*="recaptcha"], iframe[src*="turnstile"], .g-recaptcha').count();
    if (hasCaptcha > 0) {
      console.log('⚠️ Terdeteksi CAPTCHA di halaman.');
    }

    // Klik tombol submit / login
    console.log('🚀 Menekan tombol Masuk/Login...');
    const submitButton = page.locator('button[type="submit"], button:has-text("Log in"), button:has-text("Masuk")').first();
    await submitButton.click();

    console.log('⏳ Menunggu respons server TLX...');

    // Pantau URL dan perubahan halaman hingga 30 detik
    let isLoggedIn = false;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(1500);
      const currentUrl = page.url();

      const cookies = await context.cookies();
      const hasSessionCookie = cookies.some(c =>
        c.name.toLowerCase().includes('session') ||
        c.name.toLowerCase().includes('jophiel') ||
        c.name.toLowerCase().includes('play')
      );

      // Cek apakah ada pesan error di halaman
      const errorMsg = await page.locator('.alert-danger, .error, [role="alert"]').allInnerTexts().catch(() => []);
      if (errorMsg.length > 0 && errorMsg.some(m => m.trim().length > 0)) {
        console.log('⚠️ Pesan dari server TLX:', errorMsg.join(' | '));
      }

      // Jika URL sudah tidak lagi di /login dan ada cookie sesi atau avatar
      if (!currentUrl.includes('/login') || (hasSessionCookie && !currentUrl.includes('/login'))) {
        isLoggedIn = true;
        break;
      }
    }

    if (isLoggedIn) {
      console.log('\n🎉 Berhasil login!');
      await page.waitForTimeout(2000); // Pastikan cookies tersimpan penuh
      await context.storageState({ path: SESSION_FILE });
      console.log(`💾 Sesi berhasil disimpan ke: ${SESSION_FILE}`);
      console.log('✅ Akun bot siap digunakan untuk submisi otomatis!\n');
    } else {
      console.log('\n⚠️ Belum berpindah dari halaman login.');
      console.log('Kemungkinan:');
      console.log('1. Akun/Password salah.');
      console.log('2. Terdapat CAPTCHA yang perlu diklik.');
      console.log('\nJendela browser dibiarkan terbuka sebentar agar Anda bisa melihat...');
      await page.waitForTimeout(10000);
    }
  } catch (err) {
    console.error('\n❌ Terjadi kendala saat proses auto login:', err.message);
  } finally {
    await browser.close();
  }
}

autoLogin();
