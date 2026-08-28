-- ==============================================================================
-- MIGRATION: create_users_table
-- Standard: roadmap.sh/sql & roadmap.sh/laravel
-- Database Engine: SQLite / MySQL / PostgreSQL Compatible
-- ==============================================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'staff', -- 'superadmin', 'editor', 'teacher', 'staff'
    avatar VARCHAR(255) DEFAULT '/nls-logo-300.png',
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'suspended', 'trashed'
    permissions JSON NOT NULL DEFAULT ('[]'), -- Array of permissions: ['manage_events', 'manage_news', etc.]
    notes TEXT,
    last_login_at TIMESTAMP NULL,
    is_trashed TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Optimization Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_is_trashed ON users(is_trashed);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);
