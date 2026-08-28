-- ==============================================================================
-- MIGRATION: create_teachers_table
-- Standard: roadmap.sh/sql & roadmap.sh/laravel
-- Database Engine: SQLite / MySQL / PostgreSQL Compatible
-- ==============================================================================

CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    short_name VARCHAR(60) NOT NULL,
    photo VARCHAR(255) DEFAULT '/images/pengajar/mentor-1-math.jpg',
    education VARCHAR(255) NOT NULL,
    categories JSON NOT NULL DEFAULT ('[]'), -- Array of categories: ["OSN", "SNBT", etc.]
    jenjang JSON NOT NULL DEFAULT ('[]'),    -- Array of jenjang: ["SMP", "SMA", etc.]
    jenjang_label VARCHAR(100),
    subject VARCHAR(150) NOT NULL,
    subjects JSON NOT NULL DEFAULT ('[]'),   -- Array of sub-subjects
    kebutuhan_privat TEXT,
    philosophy TEXT,
    highlights JSON NOT NULL DEFAULT ('[]'), -- Array of achievement bullet points
    rating DECIMAL(2,1) DEFAULT 4.9,
    review_count INT UNSIGNED DEFAULT 24,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'trashed'
    is_trashed TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_teachers_status ON teachers(status);
CREATE INDEX IF NOT EXISTS idx_teachers_is_trashed ON teachers(is_trashed);
CREATE INDEX IF NOT EXISTS idx_teachers_subject ON teachers(subject);
CREATE INDEX IF NOT EXISTS idx_teachers_created_at ON teachers(created_at);
CREATE INDEX IF NOT EXISTS idx_teachers_deleted_at ON teachers(deleted_at);
