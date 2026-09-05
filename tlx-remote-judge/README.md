# 🤖 TLX Remote Judge Service

Modul dan layanan backend otomatis (*Proxy / Remote Judge*) untuk platform **TLX (TOKI)** berbasis **Node.js** dan **Playwright**.

Layanan ini memungkinkan aplikasi website kamu (misal Bimbel OSN / Kontes Pemrograman) untuk menerima jawaban kodingan siswa, mengirimkannya secara otomatis ke server TLX TOKI via bot, dan mengembalikan hasil penilaian (*Verdict*, Skor, Runtime, Memori) secara realtime tanpa perlu membuat testcase sendiri.

---

## ⚡ Fitur Utama

- **Persistent Session Login (`npm run login`)**: Login sekali saja via browser tampak, sesi cookies tersimpan permanen di `session/tlx_session.json` tanpa pusing masalah captcha atau OTP berikutnya.
- **Headless Automated Submitter**: Eksekusi submit di background tanpa membuka jendela browser.
- **Rate-Limit Safe Queue (FIFO)**: Antrean bawaan dengan jeda otomatis (*cooldown*) 8 detik antar submisi agar akun bot aman dari pembatasan (*rate-limiting*) TLX.
- **REST API Siap Pakai**: Endpoint `POST /api/judge/submit` & `GET /api/judge/status/:jobId` yang mudah dikonsumsi oleh backend/frontend mana pun.
- **Live Test Playground**: Tampilan antarmuka visual modern di browser untuk langsung menguji submisi kodingan.

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

### 3. Cek Status Sesi Kapan Saja
Untuk memastikan sesi login masih aktif tanpa membuka browser:
```bash
npm run check-auth
```

### 4. Jalankan Server
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
