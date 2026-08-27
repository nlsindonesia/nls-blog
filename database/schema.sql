-- ==============================================================================
-- DATABASE SCHEMA: NEXT LEVEL STUDY (NLS)
-- Engine: SQLite 3
-- Description: Master relational schema for Next Level Study CMS, Kalender,
--              Direktori Guru/Mentor, Verifikasi Calon Pengajar, & Produk Edukasi
-- ==============================================================================

PRAGMA foreign_keys = ON;

-- 1. TABLE: articles (Berita, Blog, & Pengumuman Edukasi)
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    categories TEXT NOT NULL DEFAULT '[]', -- JSON array of categories
    date TEXT NOT NULL,
    end_date TEXT,
    author TEXT NOT NULL DEFAULT 'Tim Akademik NLS',
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft', 'archived'
    cover_image TEXT DEFAULT '/nls-logo-300.png',
    focus_keyword TEXT,
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    content TEXT NOT NULL,
    seo_score INTEGER DEFAULT 85,
    is_trashed INTEGER DEFAULT 0, -- 0 = active, 1 = in trash
    deleted_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date);
CREATE INDEX IF NOT EXISTS idx_articles_trashed ON articles(is_trashed);

-- 2. TABLE: events (Kalender Agenda, Try Out, & Jadwal Kegiatan)
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'OSN', 'SNBT', 'TKA', 'Mitra Sekolah', 'Event Dinas'
    jenjang TEXT NOT NULL, -- 'SD', 'SMP', 'SMA', 'Guru / Instansi'
    jenjang_label TEXT,
    date TEXT NOT NULL, -- YYYY-MM-DD
    end_date TEXT,      -- YYYY-MM-DD (for multi-day date interval events)
    time TEXT NOT NULL DEFAULT '08:00 - 11:30 WIB',
    mode TEXT NOT NULL DEFAULT 'Online (CBT NLS)',
    location TEXT DEFAULT 'Platform CBT Next Level Study',
    badge_text TEXT DEFAULT 'Pendaftaran Dibuka',
    whatsapp_message TEXT,
    description TEXT,
    highlights TEXT NOT NULL DEFAULT '[]', -- JSON array of highlights
    is_trashed INTEGER DEFAULT 0,
    deleted_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_jenjang ON events(jenjang);
CREATE INDEX IF NOT EXISTS idx_events_trashed ON events(is_trashed);

-- 3. TABLE: teachers (Direktori Tim Guru & Mentor Ahli NLS)
CREATE TABLE IF NOT EXISTS teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    photo TEXT DEFAULT '/images/pengajar/mentor-1-math.jpg',
    education TEXT NOT NULL,
    categories TEXT NOT NULL DEFAULT '[]', -- JSON array: ['OSN', 'SNBT', etc.]
    jenjang TEXT NOT NULL DEFAULT '[]',    -- JSON array: ['SD', 'SMP', 'SMA']
    jenjang_label TEXT,
    subject TEXT NOT NULL,
    subjects TEXT NOT NULL DEFAULT '[]',   -- JSON array of sub-subjects
    kebutuhan_privat TEXT,
    philosophy TEXT,
    highlights TEXT NOT NULL DEFAULT '[]', -- JSON array of achievement bullets
    rating REAL DEFAULT 4.9,
    review_count INTEGER DEFAULT 24,
    is_trashed INTEGER DEFAULT 0,
    deleted_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_teachers_name ON teachers(name);
CREATE INDEX IF NOT EXISTS idx_teachers_subject ON teachers(subject);
CREATE INDEX IF NOT EXISTS idx_teachers_trashed ON teachers(is_trashed);

-- 4. TABLE: teacher_applications (Antrean Verifikasi Calon Pengajar / Teacher Verification)
CREATE TABLE IF NOT EXISTS teacher_applications (
    id TEXT PRIMARY KEY,
    submitted_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    nama TEXT NOT NULL,
    panggilan TEXT,
    wa TEXT NOT NULL,
    email TEXT NOT NULL,
    pendidikan TEXT NOT NULL,
    photo TEXT DEFAULT '/images/pengajar/mentor-1-math.jpg',
    categories TEXT NOT NULL DEFAULT '[]',
    jenjang TEXT NOT NULL DEFAULT '[]',
    jenjang_label TEXT,
    subject TEXT NOT NULL,
    kebutuhan_privat TEXT,
    philosophy TEXT,
    highlights TEXT NOT NULL DEFAULT '[]',
    portfolio TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_teacher_applications_status ON teacher_applications(status);
CREATE INDEX IF NOT EXISTS idx_teacher_applications_submitted ON teacher_applications(submitted_at);

-- 5. TABLE: programs (Katalog Program Pembinaan & Layanan NLS)
CREATE TABLE IF NOT EXISTS programs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- 'Bimbel OSN', 'Bimbel SNBT', 'Bimbel TKA', 'Nexgen Academy', 'Privat', 'Mitra Sekolah', 'Mitra Dinas'
    jenjang TEXT,
    description TEXT NOT NULL,
    features TEXT NOT NULL DEFAULT '[]',
    link_url TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);

-- 6. TABLE: system_settings (Pengaturan Sistem, Konfigurasi Metadata, & Cache)
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
);
