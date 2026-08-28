-- ==============================================================================
-- MIGRATION: create_articles_table
-- Standard: roadmap.sh/sql & roadmap.sh/laravel
-- Database Engine: SQLite / MySQL / PostgreSQL Compatible
-- ==============================================================================

CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    categories JSON NOT NULL DEFAULT ('[]'), -- JSON Array of categories
    date DATE NOT NULL,
    end_date DATE NULL,
    author VARCHAR(120) NOT NULL DEFAULT 'Tim Akademik NLS',
    author_id VARCHAR(64) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'published', -- 'published', 'draft', 'archived', 'trashed'
    cover_image VARCHAR(255) DEFAULT '/nls-logo-300.png',
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    focus_keyword VARCHAR(150),
    meta_title VARCHAR(255),
    meta_description TEXT,
    canonical_url VARCHAR(255),
    seo_score INT UNSIGNED DEFAULT 85,
    view_count INT UNSIGNED DEFAULT 0,
    is_trashed TINYINT(1) DEFAULT 0,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Optimization Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date);
CREATE INDEX IF NOT EXISTS idx_articles_is_trashed ON articles(is_trashed);
CREATE INDEX IF NOT EXISTS idx_articles_deleted_at ON articles(deleted_at);
