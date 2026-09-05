# 🤖 Universal Remote Judge Service (TLX, CSES, AtCoder & Codeforces)

Modul dan layanan backend otomatis (*Proxy / Remote Judge*) untuk platform **TLX (TOKI)**, **CSES (cses.fi)**, **AtCoder (atcoder.jp)**, dan **Codeforces (codeforces.com)** berbasis **Node.js** dan **Playwright**.

Layanan ini memungkinkan aplikasi website kamu (misal Bimbel OSN / Kontes Pemrograman) untuk menerima jawaban kodingan siswa, mengirimkannya secara otomatis ke server resmi TLX TOKI, CSES, AtCoder, atau Codeforces via bot (@nls_bot), dan mengembalikan hasil penilaian (*Verdict*, Skor, Rincian Kasus Uji, Runtime, Memori) secara realtime tanpa perlu membuat testcase sendiri.

---

## ⚡ Fitur Utama

- **Multi-Platform Remote Judge**: Mendukung **TLX TOKI**, **CSES (cses.fi)**, **AtCoder (atcoder.jp)**, dan **Codeforces (codeforces.com)**.
- **Persistent Session Login**:
  - TLX TOKI: `npm run login` (login manual sekali + simpan sesi cookies).
  - CSES: `npm run cses-login` (auto-login otomatis menggunakan akun `@nls_bot`).
  - AtCoder: `npm run atcoder-login` (login interaktif satu kali untuk Cloudflare Turnstile, sesi aktif 6 bulan).
  - Codeforces: `npm run codeforces-login` (auto-login otomatis menggunakan akun `@nls_bot`).
- **Automated Submitter dengan Turnstile Auto-Bypass**: Eksekusi submit di background dengan offscreen Chrome yang otomatis menyelesaikan Cloudflare Turnstile tanpa repot.
- **Detail Rincian Test Cases**: Mengembalikan hasil evaluasi tiap kasus uji resmi (misal 14/14 test cases di CSES, atau rincian kegagalan per test case di Codeforces).
- **Rate-Limit Safe Queue (FIFO)**: Antrean bawaan dengan jeda otomatis (*cooldown*) 8 detik antar submisi agar akun bot aman dari pembatasan (*rate-limiting*).
- **REST API Siap Pakai**: Endpoint `POST /api/judge/submit` & `GET /api/judge/status/:jobId` yang mudah dikonsumsi oleh backend/frontend mana pun.
- **Live Test Playground**: Tampilan antarmuka visual modern di browser (`http://localhost:3500`) untuk langsung menguji submisi kodingan ke TLX, CSES, AtCoder, dan Codeforces.

---

## 🚀 Panduan Setup & Penggunaan

### 1. Install Dependensi
Buka terminal di direktori `tlx-remote-judge`:
```bash
cd tlx-remote-judge
npm install
npx playwright install chromium
```

### 2. Login Akun Bot TLX (Sekali Saja)
Jalankan perintah ini:
```bash
npm run login
```
- Jendela browser Chromium akan otomatis terbuka menampilkan halaman login TLX.
- Masukkan username & password akun bot TLX Anda, lalu selesaikan Captcha.
- Setelah berhasil masuk, kembali ke terminal dan tekan **ENTER** (atau bot akan mendeteksinya secara otomatis).
- File sesi akan tersimpan di `session/tlx_session.json`.

### 3. Login Akun Bot CSES (Otomatis)
Jalankan perintah ini:
```bash
npm run cses-login
```
Bot akan login otomatis secara headless menggunakan username `nls_bot` dan password `maman123`, lalu menyimpan sesi di `session/cses_session.json`.

### 4. Login Akun Bot AtCoder (Satu Kali)
Jalankan perintah ini:
```bash
npm run atcoder-login
```
- Browser Chromium akan terbuka secara otomatis dengan form login terisi (`nls_bot` & `maman123`).
- Selesaikan verifikasi Cloudflare Turnstile (jika muncul kotak centang) lalu klik **Sign In**.
- Sesi akan otomatis terdeteksi dan tersimpan di `session/atcoder_session.json` dan aktif selama 6 bulan!

### 5. Login Akun Bot Codeforces (Otomatis)
Jalankan perintah ini:
```bash
npm run codeforces-login
```
Bot akan login otomatis menggunakan username `nls_bot` dan password `@NLSIndonesia1$`, lalu menyimpan sesi di `session/codeforces_session.json`.

### 6. Cek Status Sesi Kapan Saja
Untuk memastikan sesi login masih aktif tanpa membuka browser:
```bash
npm run check-auth         # Untuk TLX
npm run check-atcoder      # Untuk AtCoder
npm run check-codeforces   # Untuk Codeforces
```

### 7. Jalankan Server
```bash
npm start
```
Server akan berjalan di:
- **Web Test Playground:** [http://localhost:3500](http://localhost:3500)
- **Health Check API:** [http://localhost:3500/api/health](http://localhost:3500/api/health)

---

## 📡 Dokumentasi REST API

### 1. Submit Kodingan
- **Method:** `POST`
- **Endpoint:** `/api/judge/submit`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "problemUrl": "https://tlx.toki.id/problems/troc-30/A",
  "language": "cpp20",
  "sourceCode": "#include <iostream>\nusing namespace std;\nint main() { cout << \"YES\\n\"; return 0; }",
  "studentId": "siswa_001"
}
```
- **Response (202 Accepted):**
```json
{
  "success": true,
  "message": "Kodingan berhasil dimasukkan ke dalam antrean penilaian TLX",
  "jobId": "sub_1725508800000_abc123",
  "status": "queued",
  "queuedAt": "2026-09-05T03:00:00.000Z",
  "checkStatusUrl": "/api/judge/status/sub_1725508800000_abc123"
}
```

---

### 2. Cek Status / Hasil Penilaian
- **Method:** `GET`
- **Endpoint:** `/api/judge/status/:jobId`
- **Response (Saat Selesai):**
```json
{
  "success": true,
  "job": {
    "jobId": "sub_1725508800000_abc123",
    "status": "completed",
    "problemUrl": "https://tlx.toki.id/problems/troc-30/A",
    "language": "cpp20",
    "studentId": "siswa_001",
    "queuedAt": "2026-09-05T03:00:00.000Z",
    "startedAt": "2026-09-05T03:00:02.000Z",
    "completedAt": "2026-09-05T03:00:15.000Z",
    "result": {
      "success": true,
      "verdict": "Accepted",
      "score": 100,
      "time": "42 ms",
      "memory": "2.4 MB",
      "timestamp": "2026-09-05T03:00:15.000Z"
    }
  }
}
```

---

## ⚙️ Variabel Lingkungan (`.env`)

| Variabel | Default | Keterangan |
|---|---|---|
| `PORT` | `3500` | Port server REST API |
| `HEADLESS` | `true` | `true` untuk mode background, `false` untuk melihat aksi browser |
| `SUBMISSION_DELAY_MS` | `8000` | Jeda (cooldown) antar submisi dalam milidetik |
| `JUDGING_TIMEOUT_MS` | `60000` | Maksimal waktu tunggu hasil penilaian (ms) |
| `SESSION_PATH` | `./session/tlx_session.json` | Lokasi file sesi login |
