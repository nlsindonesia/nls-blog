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

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Serve static files untuk Test UI Playground
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Health check & status sesi bot TLX & CSES
 */
app.get('/api/health', (req, res) => {
  const tlxSessionExists = fs.existsSync(config.SESSION_PATH);
  const csesSessionExists = fs.existsSync(config.CSES_SESSION_PATH);
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

  res.json({
    status: 'ok',
    service: 'NLS Universal Remote Judge Service (TLX & CSES)',
    sessionExists: tlxSessionExists || csesSessionExists,
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
      }
    },
    headless: config.HEADLESS,
    queueLength: queue.queue.length,
    isProcessing: queue.isProcessing,
    timestamp: new Date().toISOString()
  });
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
        error: 'Parameter problemUrl wajib diisi! Contoh: "https://tlx.toki.id/problems/troc-30/A" atau "1068"'
      });
    }

    if (!sourceCode || !sourceCode.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Parameter sourceCode wajib diisi!'
      });
    }

    // Tentukan platform target
    let targetPlatform = (platform || '').toLowerCase();
    if (!targetPlatform) {
      if (problemUrl.includes('cses.fi') || /^\d+$/.test(problemUrl.trim()) || problemUrl.toLowerCase().includes('cses')) {
        targetPlatform = 'cses';
      } else {
        targetPlatform = 'tlx';
      }
    }

    // Periksa apakah sesi bot TLX sudah tersedia jika target adalah TLX
    if (targetPlatform === 'tlx' && !fs.existsSync(config.SESSION_PATH)) {
      return res.status(503).json({
        success: false,
        error: 'Sesi bot TLX belum disiapkan di server. Harap jalankan "npm run login" di folder tlx-remote-judge!'
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
