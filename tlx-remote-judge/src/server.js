/**
 * src/server.js
 * REST API Server untuk layanan TLX Remote Judge
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const queue = require('./submissionQueue');

// Pulihkan sesi login dari Environment Variables jika tersedia di Cloud
function restoreSessionsFromEnv() {
  const sessionDir = path.dirname(config.SESSION_PATH);
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }
  const sessions = [
    { env: 'TLX_SESSION_JSON', path: config.SESSION_PATH },
    { env: 'CSES_SESSION_JSON', path: config.CSES_SESSION_PATH },
    { env: 'ATCODER_SESSION_JSON', path: config.ATCODER_SESSION_PATH },
    { env: 'CODEFORCES_SESSION_JSON', path: config.CODEFORCES_SESSION_PATH }
  ];
  for (const s of sessions) {
    if (process.env[s.env] && !fs.existsSync(s.path)) {
      try {
        let content = process.env[s.env].trim();
        if (content.startsWith('ey') || (!content.startsWith('{') && !content.startsWith('['))) {
          content = Buffer.from(content, 'base64').toString('utf8');
        }
        fs.writeFileSync(s.path, content, 'utf8');
        console.log(`[Server] Sesi login berhasil dimuat dari environment variable ${s.env}`);
      } catch (err) {
        console.warn(`[Server] Gagal memuat sesi dari ${s.env}:`, err.message);
      }
    }
  }
}
restoreSessionsFromEnv();

const app = express();

// Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Serve static files untuk Test UI Playground
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Health check & status sesi bot TLX, CSES & AtCoder
 */
app.get('/api/health', (req, res) => {
  const tlxSessionExists = fs.existsSync(config.SESSION_PATH);
  const csesSessionExists = fs.existsSync(config.CSES_SESSION_PATH);
  const atcoderSessionExists = fs.existsSync(config.ATCODER_SESSION_PATH);
  const codeforcesSessionExists = fs.existsSync(config.CODEFORCES_SESSION_PATH);
  let tlxBotUsername = null;

  if (tlxSessionExists) {
    try {
      const sessionData = JSON.parse(fs.readFileSync(config.SESSION_PATH, 'utf8'));
      for (const origin of sessionData.origins || []) {
        for (const item of origin.localStorage || []) {
          if (item.name === 'persist:session') {
            const parsed = JSON.parse(item.value);
            const user = typeof parsed.user === 'string' ? JSON.parse(parsed.user) : parsed.user;
            if (user && user.username) tlxBotUsername = user.username;
          }
        }
      }
    } catch (e) {}
  }

  const csesBotUsername = config.CSES_USERNAME || 'nls_bot';
  const atcoderBotUsername = config.ATCODER_USERNAME || 'nls_bot';
  const codeforcesBotUsername = config.CODEFORCES_HANDLE || 'nls_bot';

  res.json({
    status: 'ok',
    service: 'NLS Universal Remote Judge Service (TLX, CSES, AtCoder & Codeforces)',
    sessionExists: tlxSessionExists || csesSessionExists || atcoderSessionExists || codeforcesSessionExists,
    botUser: tlxBotUsername || csesBotUsername,
    bots: {
      tlx: {
        online: tlxSessionExists,
        botUser: tlxBotUsername || 'nls_bot',
        sessionPath: config.SESSION_PATH
      },
      cses: {
        online: csesSessionExists,
        botUser: csesBotUsername,
        sessionPath: config.CSES_SESSION_PATH
      },
      atcoder: {
        online: atcoderSessionExists,
        botUser: atcoderBotUsername,
        sessionPath: config.ATCODER_SESSION_PATH
      },
      codeforces: {
        online: codeforcesSessionExists,
        botUser: codeforcesBotUsername,
        sessionPath: config.CODEFORCES_SESSION_PATH
      }
    },
    headless: config.HEADLESS,
    queueLength: queue.getQueueLength(),
    isProcessing: queue.isProcessing,
    timestamp: new Date().toISOString()
  });
});

/**
 * Endpoint sinkronisasi sesi bot dari developer (dilindungi token)
 */
app.post('/api/admin/sync-sessions', (req, res) => {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (token !== (process.env.ADMIN_SYNC_TOKEN || 'nls_sync_remote_2026')) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  const { tlxSession, csesSession, atcoderSession, codeforcesSession } = req.body || {};
  const sessionDir = path.dirname(config.SESSION_PATH);
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

  const results = {};
  try {
    if (tlxSession) {
      fs.writeFileSync(config.SESSION_PATH, typeof tlxSession === 'string' ? tlxSession : JSON.stringify(tlxSession, null, 2), 'utf8');
      results.tlx = true;
    }
    if (csesSession) {
      fs.writeFileSync(config.CSES_SESSION_PATH, typeof csesSession === 'string' ? csesSession : JSON.stringify(csesSession, null, 2), 'utf8');
      results.cses = true;
    }
    if (atcoderSession) {
      fs.writeFileSync(config.ATCODER_SESSION_PATH, typeof atcoderSession === 'string' ? atcoderSession : JSON.stringify(atcoderSession, null, 2), 'utf8');
      results.atcoder = true;
    }
    if (codeforcesSession) {
      fs.writeFileSync(config.CODEFORCES_SESSION_PATH, typeof codeforcesSession === 'string' ? codeforcesSession : JSON.stringify(codeforcesSession, null, 2), 'utf8');
      results.codeforces = true;
    }
    return res.json({ success: true, message: 'Sessions synced successfully to cloud', results });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Endpoint untuk menerima submisi kode baru dari siswa
 */
app.post('/api/judge/submit', (req, res) => {
  try {
    const { problemUrl, language, sourceCode, studentId, platform } = req.body;

    if (!problemUrl) {
      return res.status(400).json({
        success: false,
        error: 'Parameter problemUrl wajib diisi! Contoh: "https://tlx.toki.id/problems/troc-30/A", "1068", atau "abc300_a"'
      });
    }

    if (!sourceCode || !sourceCode.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Parameter sourceCode wajib diisi!'
      });
    }

    // Tentukan platform target (HANYA 4 ONLINE JUDGE RESMI YANG DITERIMA)
    let targetPlatform = (platform || '').toLowerCase();
    if (!targetPlatform) {
      if (problemUrl.includes('codeforces.com') || /^\d+[a-zA-Z][a-zA-Z0-9]*$/.test(problemUrl.trim()) || problemUrl.toLowerCase().includes('codeforce')) {
        targetPlatform = 'codeforces';
      } else if (problemUrl.includes('atcoder.jp') || /^(abc|arc|agc|practice)\d*_[a-zA-Z0-9]+/i.test(problemUrl.trim())) {
        targetPlatform = 'atcoder';
      } else if (problemUrl.includes('cses.fi') || (/^\d+$/.test(problemUrl.trim()) && !problemUrl.includes('.')) || problemUrl.toLowerCase().includes('cses')) {
        targetPlatform = 'cses';
      } else if (problemUrl.includes('tlx.toki.id') || /^(troc|osn|ksn|toki)-/i.test(problemUrl.trim()) || problemUrl.toLowerCase().includes('tlx')) {
        targetPlatform = 'tlx';
      } else {
        return res.status(400).json({
          success: false,
          error: 'Platform tidak didukung. Layanan Remote Judge hanya menerima 4 judge resmi: TLX TOKI, CSES, AtCoder, dan Codeforces. Platform lain sementara ditolak.'
        });
      }
    }

    const SUPPORTED_PLATFORMS = ['tlx', 'cses', 'atcoder', 'codeforces'];
    if (!SUPPORTED_PLATFORMS.includes(targetPlatform)) {
      return res.status(400).json({
        success: false,
        error: `Platform "${targetPlatform}" tidak didukung. Layanan Remote Judge hanya menerima 4 judge resmi: TLX TOKI, CSES, AtCoder, dan Codeforces. Platform lain sementara ditolak.`
      });
    }

    // Periksa apakah sesi bot tersedia untuk platform yang membutuhkan login manual
    if (targetPlatform === 'tlx' && !fs.existsSync(config.SESSION_PATH)) {
      return res.status(503).json({
        success: false,
        error: 'Sesi bot TLX belum disiapkan di server. Harap jalankan "npm run login" di folder tlx-remote-judge!'
      });
    }

    if (targetPlatform === 'atcoder' && !fs.existsSync(config.ATCODER_SESSION_PATH)) {
      return res.status(503).json({
        success: false,
        error: 'Sesi bot AtCoder belum disiapkan di server. Harap jalankan "npm run atcoder-login" di folder tlx-remote-judge!'
      });
    }

    if (targetPlatform === 'codeforces' && !fs.existsSync(config.CODEFORCES_SESSION_PATH)) {
      return res.status(503).json({
        success: false,
        error: 'Sesi bot Codeforces belum disiapkan di server. Harap jalankan "npm run codeforces-login" di folder tlx-remote-judge!'
      });
    }

    const job = queue.addJob({
      platform: targetPlatform,
      problemUrl,
      language: language || 'cpp20',
      sourceCode,
      studentId
    });

    return res.status(202).json({
      success: true,
      message: `Kodingan berhasil dimasukkan ke dalam antrean penilaian ${targetPlatform.toUpperCase()}`,
      platform: targetPlatform,
      jobId: job.jobId,
      status: job.status,
      queuedAt: job.queuedAt,
      checkStatusUrl: `/api/judge/status/${job.jobId}`
    });
  } catch (err) {
    console.error('Error saat menerima submisi:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * Endpoint untuk mengecek status & hasil penilaian pekerjaan tertentu
 */
app.get('/api/judge/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = queue.getJob(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: `Pekerjaan dengan jobId "${jobId}" tidak ditemukan.`
    });
  }

  return res.json({
    success: true,
    job
  });
});

/**
 * Endpoint untuk melihat riwayat submisi terbaru
 */
app.get('/api/judge/history', (req, res) => {
  return res.json({
    success: true,
    total: queue.jobs.size,
    history: queue.getAllJobs()
  });
});

// Jalankan server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log('\n======================================================');
  console.log(`🚀 TLX Remote Judge Service berjalan di:`);
  console.log(`   👉 http://localhost:${PORT}`);
  console.log(`   👉 Test UI Playground: http://localhost:${PORT}`);
  console.log(`   👉 Health Status     : http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
