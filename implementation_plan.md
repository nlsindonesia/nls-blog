# Penambahan 5 Tipe Soal Interaktif di LMS Player

Saat ini `lms-player.html` belum mengenali 5 tipe soal baru yang dibuat di `lms-builder.html`, sehingga sistem me-render mereka sebagai "Essay" tanpa antarmuka input yang sesuai.

## User Review Required
> [!IMPORTANT]
> Terdapat 5 tipe soal kompleks yang harus diimplementasikan dari awal di LMS Player. Saya membutuhkan persetujuan Anda mengenai pendekatan desain dan UI yang akan saya gunakan, terutama untuk **Interactive Graph** dan **Jigsaw Puzzle**.

## Open Questions
> [!CAUTION]
> 1. Untuk **Jigsaw Puzzle**, apakah Anda ingin sistem *drag-and-drop* murni atau sistem "klik petak A, klik petak B untuk menukar" (karena lebih ramah mobile)? 
> 2. Untuk **Interactive Graph**, saya berencana membuat grid SVG Cartesian (sumbu X dan Y dari -10 sampai 10). Siswa dapat mengklik grid untuk menempatkan titik(titik) tebakan. Apakah ini sesuai ekspektasi Anda?

## Proposed Changes

### `belajar/lms-player.html`
#### [MODIFY] `lms-player.html`
- **Labeling Update**: Memperbarui ternary operator pada label tipe soal untuk mengenali `blank`, `osn_biologi`, `range`, `graph`, dan `puzzle`.
- **UI Templates Tambahan**:
  1. **Fill in the Blanks (`blank`)**: Menampilkan paragraf di mana teks `{dash}` diganti dengan kotak input `<input type="text">`.
  2. **OSN Biologi (`osn_biologi`)**: Menampilkan tabel dengan 4 pernyataan dan opsi pilihan radio B/S.
  3. **Range Slider (`range`)**: Menampilkan input `<input type="range">` dengan label angka dinamis.
  4. **Interactive Graph (`graph`)**: Menggunakan elemen SVG untuk membuat diagram kartesius yang interaktif, bisa diklik untuk menandai koordinat.
  5. **Jigsaw Puzzle (`puzzle`)**: Membuat grid berbasis CSS Grid berdasarkan tingkat kesulitan (2x2, 3x3, 4x4, 7x7) yang memotong gambar `puzzleImage`. Menambahkan logika *swap* (tukar) menggunakan Alpine.js.
- **Auto-Grading Logic**:
  - `blank`: Mencocokkan jawaban input (case-insensitive) dengan daftar jawaban (dipisahkan koma).
  - `osn_biologi`: Menghitung jumlah pernyataan yang benar. 4 Benar = 100%, 3 Benar = 60%, 2 Benar = 20%, 0-1 Benar = 0% poin.
  - `range`: Nilai tepat (atau mendekati toleransi jika diperlukan) = 100%.
  - `graph`: Mencocokkan ketepatan semua titik koordinat yang ditebak.
  - `puzzle`: Jika urutan kotak (array indeks) sama persis dengan urutan solusi = 100%.

## Verification Plan

### Manual Verification
- Masuk ke salah satu kursus yang memiliki 5 tipe soal ini.
- Uji coba berinteraksi dengan Puzzle, Graph, Range, Titik-titik, dan OSN Biologi.
- Submit kuis untuk melihat apakah sistem **Auto-Grading** berhasil menilai dengan akurat.
