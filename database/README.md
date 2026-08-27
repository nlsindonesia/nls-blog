# 🗄️ Database Relasional SQLite — Next Level Study (NLS)

Dokumentasi ini menjelaskan arsitektur basis data relasional **SQLite 3** untuk seluruh ekosistem **Next Level Study** (CMS Berita, Kalender Agenda Kegiatan, Direktori Tim Pengajar, Antrean Verifikasi Guru, dan Katalog Program).

---

## 1. 📁 Struktur File Database

```
database/
├── nls_database.sqlite              # File database SQLite utama (Binary Database)
├── schema.sql                       # DDL Schema Relasional lengkap & Indeks
├── seed_data.sql                    # SQL Dump lengkap data awal (INSERT statements)
├── init_database.ps1                # Script inisialisasi, migrasi & seeding otomatis
├── export_from_sqlite.ps1           # Script ekspor tabel SQLite ke format JSON/JS
├── articles_export.json             # Ekspor data Berita & Artikel
├── events_export.json               # Ekspor data Agenda Kalender
├── teachers_export.json             # Ekspor data Tim Pengajar
└── teacher_applications_export.json # Ekspor antrean verifikasi guru
```

---

## 2. 🏛️ Tabel Relasional & Schema

### A. Tabel `articles` (Berita & Artikel Edukasi)
Menyimpan konten blog, artikel bimbingan OSN/SNBT, pengumuman, dan artikel SEO.

| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Identifier unik artikel (contoh: `art-osn-matematika`) |
| `title` | `TEXT NOT NULL` | Judul artikel lengkap |
| `slug` | `TEXT NOT NULL UNIQUE` | URL-friendly slug artikel |
| `category` | `TEXT NOT NULL` | Kategori utama |
| `categories` | `TEXT` | Array JSON multi-kategori (`['OSN & Sains', 'Tips']`) |
| `date` | `TEXT NOT NULL` | Tanggal publikasi (`YYYY-MM-DD`) |
| `end_date` | `TEXT` | Tanggal berakhir kegiatan (opsional) |
| `author` | `TEXT NOT NULL` | Nama penulis / tutor |
| `status` | `TEXT DEFAULT 'published'` | Status (`published`, `draft`, `archived`) |
| `cover_image` | `TEXT` | Path/URL foto sampul artikel |
| `focus_keyword` | `TEXT` | Kata kunci fokus SEO |
| `meta_title` | `TEXT` | Judul meta untuk search engine |
| `meta_description` | `TEXT` | Ringkasan deskripsi meta SEO |
| `canonical_url` | `TEXT` | URL kanonikal |
| `content` | `TEXT NOT NULL` | Konten artikel HTML lengkap |
| `seo_score` | `INTEGER DEFAULT 85` | Skor audit SEO (0 - 100) |
| `is_trashed` | `INTEGER DEFAULT 0` | `0` = aktif, `1` = di tempat sampah (trash) |
| `deleted_at` | `TEXT` | Timestamp saat dihapus ke trash |
| `created_at` / `updated_at` | `TEXT` | Timestamp pembuatan dan pembaruan |

---

### B. Tabel `events` (Kalender Kegiatan & Agenda Try Out)
Menyimpan jadwal pembinaan olimpiade, try out akbar, webinar, dan karantina.

| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Identifier agenda (contoh: `evt-jan-1`) |
| `title` | `TEXT NOT NULL` | Nama kegiatan / event |
| `category` | `TEXT NOT NULL` | `OSN`, `SNBT`, `TKA`, `Mitra Sekolah`, `Event Dinas` |
| `jenjang` | `TEXT NOT NULL` | `SD`, `SMP`, `SMA`, `Guru / Instansi` |
| `jenjang_label` | `TEXT` | Label jenjang ramah pembaca |
| `date` | `TEXT NOT NULL` | Tanggal mulai (`YYYY-MM-DD`) |
| `end_date` | `TEXT` | Tanggal selesai untuk event rentang waktu / multi-hari |
| `time` | `TEXT` | Waktu pelaksanaan (contoh: `08:00 - 11:30 WIB`) |
| `mode` | `TEXT` | `Online (CBT NLS)`, `Offline`, `Hybrid` |
| `location` | `TEXT` | Lokasi / platform pelaksanaan |
| `badge_text` | `TEXT` | Lencana status (contoh: `Pendaftaran Dibuka`) |
| `whatsapp_message` | `TEXT` | Pesan prefilled registrasi WhatsApp |
| `description` | `TEXT` | Deskripsi detail kegiatan |
| `highlights` | `TEXT` | Array JSON poin keunggulan kegiatan |
| `is_trashed` | `INTEGER DEFAULT 0` | Status trash |

---

### C. Tabel `teachers` (Direktori Tim Guru & Mentor Ahli NLS)
Menyimpan profil mentor medalis olimpiade dan pengajar profesional NLS.

| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Identifier guru (contoh: `t-1`) |
| `name` | `TEXT NOT NULL` | Nama lengkap dan gelar akademis |
| `short_name` | `TEXT NOT NULL` | Nama sapaan / panggilan (contoh: `Kak Radit`) |
| `photo` | `TEXT` | URL / path pasfoto profil |
| `education` | `TEXT NOT NULL` | Almamater kampus & rekam jejak medali |
| `categories` | `TEXT` | Array JSON kategori (`['OSN', 'Kurikulum Internasional']`) |
| `jenjang` | `TEXT` | Array JSON jenjang yang diajar (`['SMP', 'SMA']`) |
| `jenjang_label` | `TEXT` | Ringkasan jenjang ajar |
| `subject` | `TEXT NOT NULL` | Spesialisasi mata pelajaran |
| `subjects` | `TEXT` | Array JSON mata pelajaran detail |
| `kebutuhan_privat` | `TEXT` | Ruang lingkup bimbingan privat |
| `philosophy` | `TEXT` | Kutipan filosofi mendidik |
| `highlights` | `TEXT` | Array JSON 3 poin prestasi utama |
| `rating` | `REAL DEFAULT 4.9` | Skor kepuasan siswa |
| `review_count` | `INTEGER DEFAULT 24` | Jumlah ulasan |
| `is_trashed` | `INTEGER DEFAULT 0` | Status trash |

---

### D. Tabel `teacher_applications` (Antrean Verifikasi Calon Pengajar)
Menampung pendaftaran guru baru yang dikirim melalui formulir `/pengajar`.

| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Identifier pengajuan (contoh: `app-1787820000000`) |
| `submitted_at` | `TEXT NOT NULL` | Waktu pengajuan formulir |
| `status` | `TEXT DEFAULT 'pending'` | `pending` (Menunggu), `accepted` (Diterima), `rejected` (Ditolak) |
| `nama` | `TEXT NOT NULL` | Nama lengkap pelamar |
| `panggilan` | `TEXT` | Nama sapaan |
| `wa` | `TEXT NOT NULL` | Nomor WhatsApp kontak |
| `email` | `TEXT NOT NULL` | Alamat email pelamar |
| `pendidikan` | `TEXT NOT NULL` | Latar belakang universitas / jurusan |
| `photo` | `TEXT` | Foto profil pelamar |
| `categories` | `TEXT` | Array JSON bidang keahlian |
| `jenjang` | `TEXT` | Array JSON sasaran jenjang |
| `subject` | `TEXT NOT NULL` | Bidang mata pelajaran yang diajukan |
| `kebutuhan_privat` | `TEXT` | Fokus les privat |
| `philosophy` | `TEXT` | Filosofi mengajar |
| `highlights` | `TEXT` | Array JSON 3 rekam jejak prestasi |
| `portfolio` | `TEXT` | Tautan URL CV / Portofolio online |

---

### E. Tabel `programs` & `system_settings`
- **`programs`**: Menyimpan katalog layanan NLS (`Bimbel OSN`, `Bimbel SNBT`, `Bimbel TKA`, `Nexgen Academy`, `Privat 1-on-1`, `Mitra Sekolah`, `Mitra Dinas`).
- **`system_settings`**: Menyimpan konfigurasi metadata, nomor WhatsApp resmi, alamat kantor pusat, dan status sinkronisasi.

---

## 3. 🚀 Cara Menjalankan & Menggunakan

### A. Inisialisasi Ulang & Migrasi Database
Untuk memigrasikan skema dan mengimpor seluruh data dari dataset master:
```powershell
powershell -ExecutionPolicy Bypass -File .\database\init_database.ps1
```

### B. Menjalankan Query SQL Langsung (CLI)
Contoh membaca daftar event yang akan datang:
```bash
sqlite3 ./database/nls_database.sqlite "SELECT title, category, date, end_date FROM events ORDER BY date ASC LIMIT 10;"
```

Contoh membaca daftar calon guru di antrean verifikasi:
```bash
sqlite3 ./database/nls_database.sqlite "SELECT nama, wa, subject, status FROM teacher_applications WHERE status = 'pending';"
```

### C. Ekspor Data dari SQLite ke Format JSON
```powershell
powershell -ExecutionPolicy Bypass -File .\database\export_from_sqlite.ps1
```
