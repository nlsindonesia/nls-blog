/**
 * scripts/cses-login.js
 * Script utilitas untuk login akun CSES (@nls_bot) dan menyimpan session state.
 */

const { chromium } = require('playwright');
const path = require('path');
const config = require('../src/config');

async function loginCses() {
  console.log('======================================================');
  console.log('🔑 CSES Bot Auto-Login Utility');
  console.log(`   Username : ${config.CSES_USERNAME}`);
  console.log(`   Session  : ${config.CSES_SESSION_PATH}`);
  console.log('======================================================\n');

  const browser = await chromium.launch({
    headless: config.HEADLESS,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🌐 Membuka https://cses.fi/login...');
    await page.goto('https://cses.fi/login', { waitUntil: 'networkidle', timeout: 30000 });

    console.log(`✍️ Mengisi credentials untuk @${config.CSES_USERNAME}...`);
    await page.fill('input[name="nick"]', config.CSES_USERNAME);
    await page.fill('input[name="pass"]', config.CSES_PASSWORD);

    console.log('🚀 Mengirim form login...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
      page.click('input[type="submit"]')
    ]);

    const currentUrl = page.url();
    console.log(`📍 URL setelah login: ${currentUrl}`);

    // Simpan storage state
    await context.storageState({ path: config.CSES_SESSION_PATH });
    console.log(`\n🎉 BERHASIL! Session CSES tersimpan di:`);
    console.log(`   👉 ${config.CSES_SESSION_PATH}\n`);

  } catch (err) {
    console.error('❌ Gagal login CSES:', err.message);
  } finally {
    await browser.close();
  }
}

loginCses();
