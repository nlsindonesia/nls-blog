# 🌐 Next Level Study — Public Static Site (`nls-blog-hame`)

Repository ini adalah versi **Pure Static HTML / Frontend Standalone** dari situs publik **Next Level Study**.

## 🚀 Menjalankan Secara Lokal

Repository ini tidak membutuhkan PHP atau MySQL untuk dijalankan. Anda hanya memerlukan Node.js:

```bash
# Menjalankan static web server lokal di http://localhost:3000
npm run dev
```

Atau menggunakan web server statis favorit Anda (Python, Live Server, Nginx, Caddy, dsb):
```bash
python3 -m http.server 3000
```

## 📦 Cara Export Ulang dari `nls-blog-laravel`

Jika ada artikel, event, atau kursus baru yang ditambahkan di CMS `nls-blog-laravel`, Anda dapat memperbarui seluruh halaman statis di repo ini dengan menjalankan satu perintah di folder `nls-blog-laravel`:

```bash
cd /path/to/nls-blog-laravel
php artisan export:static
```

## 🌍 Panduan Deploy ke Static Hosting

Repository ini siap di-deploy langsung (Zero Config) ke:
- **Vercel**: Import repository → Framework preset `Other` → Deploy.
- **Netlify**: Drag & drop folder atau hubungkan repository Git.
- **Cloudflare Pages**: Hubungkan repo Git → Output directory `.` → Deploy.
- **GitHub Pages**: Settings → Pages → Deploy from branch `main` / `root`.
- **Nginx / Apache Server**: Arahkan `root` web server langsung ke folder ini.

## 📂 Struktur Halaman

- `/` (`index.html`) — Halaman Beranda
- `/tentang/` — Tentang Kami
- `/mitra/` — Kemitraan Sekolah
- `/privat/` — Program Les Privat
- `/belajar/` — Katalog Kursus Online & Kategori (OSN, UTBK, TKA)
- `/belajar/{slug}/` — Halaman Detail Kursus
- `/products/` — Katalog Produk Edukasi
- `/products/{slug}/` — Halaman Detail Produk
- `/programs/` — Katalog Program Pelatihan
- `/programs/{slug}/` — Halaman Detail Program
- `/blog/` — Berita & Edukasi (dilengkapi pagination & filter kategori)
- `/blog/{slug}/` — Halaman Baca Artikel
- `/achievements/` — Galeri Prestasi Siswa
- `/terms/` & `/privacy/` — Legalitas & Kebijakan Privasi
- `/sitemap.xml` & `/robots.txt` — SEO & Search Engine indexing
