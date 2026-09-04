-- ==============================================================================
-- MIGRATION: create_lms_tables
-- Standard: roadmap.sh/sql & roadmap.sh/laravel
-- Database Engine: SQLite / PostgreSQL Compatible
-- Description: Master schema for LMS Courses, Curriculum, Enrollments & Quiz Results
-- ==============================================================================

-- 1. Table: lms_courses
CREATE TABLE IF NOT EXISTS lms_courses (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,          -- 'School', 'Olimpiade', 'TKA', 'Collage Preparation', 'Language', 'Pemrograman'
    level VARCHAR(50) NOT NULL,             -- 'SD', 'SMP', 'SMA', 'TKA SMP', 'OSN', 'Python', etc.
    subject VARCHAR(100),                   -- 'Matematika Wajib', 'IPA SMP', 'Bahasa Jepang', etc.
    grade VARCHAR(50),                     -- 'Kelas 10', 'Kelas 7', 'Kelas 1' (for School)
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_json JSON NOT NULL,            -- Detailed modules, lessons, quizzes, videos & metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course Search & Filtering Indexes
CREATE INDEX IF NOT EXISTS idx_lms_courses_cat_lvl ON lms_courses(category, level);
CREATE INDEX IF NOT EXISTS idx_lms_courses_subject ON lms_courses(subject);
CREATE INDEX IF NOT EXISTS idx_lms_courses_grade ON lms_courses(grade);
CREATE INDEX IF NOT EXISTS idx_lms_courses_created_at ON lms_courses(created_at);

-- 2. Table: lms_enrollments (Siswa Terdaftar & Progres Belajar)
CREATE TABLE IF NOT EXISTS lms_enrollments (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(100) NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    completed_modules JSON DEFAULT '[]',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_lms_enrollments_user ON lms_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_course ON lms_enrollments(course_id);

-- 3. Table: lms_quiz_results (Hasil Evaluasi & Pengerjaan Kuis)
CREATE TABLE IF NOT EXISTS lms_quiz_results (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(100) NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
    module_index VARCHAR(100),
    score NUMERIC(5,2),
    paket INTEGER DEFAULT 1,
    answers_json JSON DEFAULT '{}',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_user ON lms_quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_course ON lms_quiz_results(course_id);
