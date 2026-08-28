-- ==============================================================================
-- MIGRATION: create_teacher_applications_table
-- Standard: roadmap.sh/sql & roadmap.sh/laravel
-- Database Engine: SQLite / MySQL / PostgreSQL Compatible
-- ==============================================================================

CREATE TABLE IF NOT EXISTS teacher_applications (
    id VARCHAR(64) PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    panggilan VARCHAR(60),
    wa VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    pendidikan VARCHAR(255) NOT NULL,
    photo VARCHAR(255) DEFAULT '/images/pengajar/mentor-1-math.jpg',
    categories JSON NOT NULL DEFAULT ('[]'),
    jenjang JSON NOT NULL DEFAULT ('[]'),
    jenjang_label VARCHAR(100),
    subject VARCHAR(150) NOT NULL,
    kebutuhan_privat TEXT,
    philosophy TEXT,
    highlights JSON NOT NULL DEFAULT ('[]'),
    portfolio VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'trashed'
    is_trashed TINYINT(1) DEFAULT 0,
    review_notes TEXT,
    reviewed_by VARCHAR(64) NULL,
    reviewed_at TIMESTAMP NULL,
    accepted_teacher_id VARCHAR(64) NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    CONSTRAINT fk_app_teacher FOREIGN KEY (accepted_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_teacher_app_status ON teacher_applications(status);
CREATE INDEX IF NOT EXISTS idx_teacher_app_is_trashed ON teacher_applications(is_trashed);
CREATE INDEX IF NOT EXISTS idx_teacher_app_email ON teacher_applications(email);
CREATE INDEX IF NOT EXISTS idx_teacher_app_submitted_at ON teacher_applications(submitted_at);
CREATE INDEX IF NOT EXISTS idx_teacher_app_deleted_at ON teacher_applications(deleted_at);
