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

-- 7. TABLE: lms_courses (Katalog Kursus, Modul Pembelajaran, & Silabus)
CREATE TABLE IF NOT EXISTS lms_courses (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,          -- 'School', 'Olimpiade', 'TKA', 'Collage Preparation', 'Language', 'Pemrograman'
    level TEXT NOT NULL,             -- 'SD', 'SMP', 'SMA', 'TKA SMP', 'OSN', 'Python', etc.
    subject TEXT,                   -- 'Matematika Wajib', 'IPA SMP', 'Bahasa Jepang', etc.
    grade TEXT,                     -- 'Kelas 10', 'Kelas 7', 'Kelas 1' (for School)
    title TEXT NOT NULL,
    description TEXT,
    content_json TEXT NOT NULL,     -- Detailed modules, lessons, quizzes, videos & metadata (JSON)
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_lms_courses_cat_lvl ON lms_courses(category, level);
CREATE INDEX IF NOT EXISTS idx_lms_courses_subject ON lms_courses(subject);
CREATE INDEX IF NOT EXISTS idx_lms_courses_grade ON lms_courses(grade);
CREATE INDEX IF NOT EXISTS idx_lms_courses_created_desc ON lms_courses(created_at DESC);

-- 8. TABLE: lms_enrollments (Siswa Terdaftar & Progres Belajar)
CREATE TABLE IF NOT EXISTS lms_enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed_modules TEXT DEFAULT '[]',
    enrolled_at TEXT DEFAULT (datetime('now')),
    last_accessed TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_lms_enrollments_user ON lms_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_course ON lms_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_user_course ON lms_enrollments(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_last_accessed ON lms_enrollments(last_accessed DESC);

-- 9. TABLE: lms_quiz_results (Hasil Evaluasi & Pengerjaan Kuis Siswa)
CREATE TABLE IF NOT EXISTS lms_quiz_results (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    module_index TEXT,
    score REAL,
    paket INTEGER DEFAULT 1,
    answers_json TEXT DEFAULT '{}',
    submitted_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_user ON lms_quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_course ON lms_quiz_results(course_id);
CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_user_date ON lms_quiz_results(user_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_course_mod ON lms_quiz_results(course_id, module_index);

-- 10. TABLE: lms_quiz_attempts (Progres Kuis Realtime Siswa)
CREATE TABLE IF NOT EXISTS lms_quiz_attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    status TEXT DEFAULT 'in_progress',
    started_at TEXT DEFAULT (datetime('now')),
    last_saved_at TEXT DEFAULT (datetime('now')),
    elapsed_seconds INTEGER DEFAULT 0,
    answers_json TEXT DEFAULT '{}',
    UNIQUE(user_id, course_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_lms_quiz_attempts_lookup ON lms_quiz_attempts(user_id, course_id, module_id);
CREATE INDEX IF NOT EXISTS idx_lms_quiz_attempts_status ON lms_quiz_attempts(status);

-- 11. TABLE: lms_schools (Database Master Sekolah Indonesia)
CREATE TABLE IF NOT EXISTS lms_schools (
    id TEXT PRIMARY KEY,
    npsn TEXT,
    name TEXT NOT NULL,
    level TEXT,
    city TEXT,
    province TEXT,
    country TEXT DEFAULT 'Indonesia',
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_lms_schools_name ON lms_schools(name);
CREATE INDEX IF NOT EXISTS idx_lms_schools_npsn ON lms_schools(npsn);
CREATE INDEX IF NOT EXISTS idx_lms_schools_level ON lms_schools(level);


