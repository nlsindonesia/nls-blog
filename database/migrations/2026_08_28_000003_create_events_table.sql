-- ==============================================================================
-- MIGRATION: create_events_table
-- Standard: roadmap.sh/sql & roadmap.sh/laravel
-- Database Engine: SQLite / MySQL / PostgreSQL Compatible
-- ==============================================================================

CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(80) NOT NULL, -- 'OSN', 'SNBT', 'TKA', 'Mitra Sekolah', 'Event Dinas'
    jenjang VARCHAR(80) NOT NULL,  -- 'SD', 'SMP', 'SMA', 'Guru / Instansi'
    jenjang_label VARCHAR(100),
    date DATE NOT NULL,            -- YYYY-MM-DD
    end_date DATE NULL,            -- YYYY-MM-DD (for date intervals)
    time VARCHAR(60) NOT NULL DEFAULT '08:00 - 11:30 WIB',
    mode VARCHAR(80) NOT NULL DEFAULT 'Online (CBT NLS)',
    location VARCHAR(200) DEFAULT 'Platform CBT Next Level Study',
    badge_text VARCHAR(60) DEFAULT 'Pendaftaran Dibuka',
    whatsapp_message TEXT,
    description TEXT,
    highlights JSON NOT NULL DEFAULT ('[]'), -- Array of event bullet points
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'trashed'
    is_trashed TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_jenjang ON events(jenjang);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_is_trashed ON events(is_trashed);
CREATE INDEX IF NOT EXISTS idx_events_deleted_at ON events(deleted_at);
