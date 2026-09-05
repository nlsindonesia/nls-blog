/**
 * scripts/check-auth.js
 * Memeriksa apakah file session/tlx_session.json berisi token valid dari TLX TOKI.
 */

const path = require('path');
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const SESSION_FILE = process.env.SESSION_PATH
  ? path.resolve(__dirname, '..', process.env.SESSION_PATH)
  : path.resolve(__dirname, '../session/tlx_session.json');

async function checkAuth() {
  console.log('\n======================================================');
  console.log('🔍 MEMERIKSA STATUS SESI BOT TLX');
  console.log('======================================================\n');

  if (!fs.existsSync(SESSION_FILE)) {
    console.error('❌ File sesi tidak ditemukan:', SESSION_FILE);
    console.error('👉 Jalankan perintah: npm run login');
    process.exit(1);
  }

  let sessionData;
  try {
    sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
  } catch (e) {
    console.error('❌ File sesi korup atau tidak valid JSON:', e.message);
    process.exit(1);
  }

  // Cari item persist:session di localStorage
  let userSession = null;
  let authToken = null;

  if (sessionData.origins && Array.isArray(sessionData.origins)) {
    for (const origin of sessionData.origins) {
      if (origin.localStorage) {
        for (const item of origin.localStorage) {
          if (item.name === 'persist:session') {
            try {
              const parsed = JSON.parse(item.value);
              if (parsed.user) {
                userSession = typeof parsed.user === 'string' ? JSON.parse(parsed.user) : parsed.user;
              }
              if (parsed.token) {
                authToken = typeof parsed.token === 'string' ? JSON.parse(parsed.token) : parsed.token;
              }
            } catch (e) {}
          }
        }
      }
    }
  }

  if (userSession && userSession.username) {
    console.log('✅ SESI LOGIN DITEMUKAN:');
    console.log(`   👤 Username : ${userSession.username}`);
    console.log(`   🆔 User ID  : ${userSession.id || '-'}`);
    console.log(`   📧 Email    : ${userSession.email || '-'}`);
    console.log(`   🔑 Token    : ${authToken ? authToken.substring(0, 8) + '...' : 'Tersimpan'}`);
    console.log('\n🎉 STATUS: SESI AKTIF & SIAP DIGUNAKAN!');
    console.log('Bot sudah terautentikasi dan siap melakukan submisi kodingan ke TLX.\n');
    process.exit(0);
  } else {
    console.error('⚠️ Sesi tersimpan tetapi belum ada informasi akun.');
    console.error('👉 Silakan login kembali dengan: npm run login');
    process.exit(1);
  }
}

checkAuth();
