-- ==============================================================================
-- MIGRATION: create_audit_logs_table
-- Standard: roadmap.sh/sql & roadmap.sh/laravel
-- Database Engine: SQLite / MySQL / PostgreSQL Compatible
-- ==============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NULL,
    user_name VARCHAR(150),
    action VARCHAR(80) NOT NULL,    -- 'CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'LOGIN', 'SYNC'
    module VARCHAR(80) NOT NULL,    -- 'kalender', 'berita', 'pengajar', 'users', 'system'
    target_id VARCHAR(64) NULL,     -- ID of the entity modified
    description TEXT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    payload JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_audit_module ON audit_logs(module);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at);
