/**
 * src/submissionQueue.js
 * In-memory FIFO queue processor dengan jeda cooldown antar submisi
 * untuk melindungi akun bot dari rate-limit dan spam detection TLX.
 */

const { submitToTLX } = require('./tlxSubmitter');
const { submitToCSES } = require('./csesSubmitter');
const { submitToAtCoder } = require('./atcoderSubmitter');
const { submitToCodeforces } = require('./codeforcesSubmitter');
const config = require('./config');

class SubmissionQueue {
  constructor() {
    this.queue = [];
    this.jobs = new Map();
    this.isProcessing = false;
    this.delayMs = config.SUBMISSION_DELAY_MS;
  }

  /**
   * Tambahkan pekerjaan submisi baru ke dalam antrean
   */
  addJob({ problemUrl, language, sourceCode, studentId, platform }) {
    const jobId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    // Auto-detect platform jika tidak dispesifikasikan secara eksplisit
    let targetPlatform = (platform || '').toLowerCase();
    if (!targetPlatform) {
      if (problemUrl.includes('codeforces.com') || /^\d+[a-zA-Z][a-zA-Z0-9]*$/.test(problemUrl.trim()) || problemUrl.toLowerCase().includes('codeforce')) {
        targetPlatform = 'codeforces';
      } else if (problemUrl.includes('atcoder.jp') || /^(abc|arc|agc|practice)\d*_[a-zA-Z0-9]+/i.test(problemUrl.trim())) {
        targetPlatform = 'atcoder';
      } else if (problemUrl.includes('cses.fi') || /^\d+$/.test(problemUrl.trim()) || problemUrl.toLowerCase().includes('cses')) {
        targetPlatform = 'cses';
      } else {
        targetPlatform = 'tlx';
      }
    }

    const jobData = {
      jobId,
      platform: targetPlatform,
      problemUrl,
      language,
      sourceCode,
      studentId: studentId || null,
      status: 'queued', // queued | processing | completed | failed
      queuedAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      result: null,
      error: null
    };

    this.jobs.set(jobId, jobData);
    this.queue.push(jobId);

    console.log(`📥 [Queue] Job ditambahkan: ${jobId} [Platform: ${targetPlatform.toUpperCase()}] (Antrean: ${this.queue.length})`);

    // Picu prosesor jika belum aktif
    this.processNext();

    return jobData;
  }

  /**
   * Dapatkan detail status pekerjaan berdasarkan jobId
   */
  getJob(jobId) {
    return this.jobs.get(jobId) || null;
  }

  /**
   * Dapatkan semua pekerjaan yang tersimpan (maksimal 50 terbaru)
   */
  getAllJobs() {
    return Array.from(this.jobs.values())
      .sort((a, b) => new Date(b.queuedAt) - new Date(a.queuedAt))
      .slice(0, 50);
  }

  /**
   * Pemrosesan antrean secara sekuensial (FIFO)
   */
  async processNext() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const currentJobId = this.queue.shift();
    const job = this.jobs.get(currentJobId);

    if (!job) {
      this.isProcessing = false;
      this.processNext();
      return;
    }

    job.status = 'processing';
    job.startedAt = new Date().toISOString();
    console.log(`⚙️ [Queue] Memproses ${currentJobId} [${(job.platform || 'tlx').toUpperCase()}]... Sisa di antrean: ${this.queue.length}`);

    try {
      let result;
      if (job.platform === 'codeforces') {
        result = await submitToCodeforces({
          problemUrl: job.problemUrl,
          language: job.language,
          sourceCode: job.sourceCode,
          studentId: job.studentId
        });
      } else if (job.platform === 'atcoder') {
        result = await submitToAtCoder({
          problemUrl: job.problemUrl,
          language: job.language,
          sourceCode: job.sourceCode,
          studentId: job.studentId
        });
      } else if (job.platform === 'cses') {
        result = await submitToCSES({
          problemUrl: job.problemUrl,
          language: job.language,
          sourceCode: job.sourceCode,
          studentId: job.studentId
        });
      } else {
        result = await submitToTLX({
          problemUrl: job.problemUrl,
          language: job.language,
          sourceCode: job.sourceCode,
          studentId: job.studentId
        });
      }

      job.completedAt = new Date().toISOString();
      if (result.success) {
        job.status = 'completed';
        job.result = result;
      } else {
        job.status = 'failed';
        job.error = result.error || 'Submisi gagal dieksekusi';
      }
    } catch (err) {
      job.status = 'failed';
      job.completedAt = new Date().toISOString();
      job.error = err.message;
    }

    console.log(`🏁 [Queue] Selesai memproses ${currentJobId}. Menunggu jeda cooldown ${this.delayMs / 1000}s...`);

    // Jeda pengamanan (cooldown) sebelum memproses submisi berikutnya
    setTimeout(() => {
      this.isProcessing = false;
      this.processNext();
    }, this.delayMs);
  }
}

// Export singleton instance
module.exports = new SubmissionQueue();
