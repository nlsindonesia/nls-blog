-- ==============================================================================
-- MIGRATION: 2026_09_04_000008_optimize_lms_and_sql_performance
-- Standard: roadmap.sh/sql & roadmap.sh/laravel
-- Database Engine: PostgreSQL / SQLite Compatible
-- Description: High-performance composite, functional, and GIN indexes for LMS
--              courses, progress tracking, quiz submissions, and school search
-- ==============================================================================

-- ==============================================================================
-- UP: Apply Optimization Indexes & Performance Structures
-- ==============================================================================

-- 1. Table: lms_courses (Functional & GIN Indexes for Lightning-Fast Catalog Queries)
CREATE INDEX IF NOT EXISTS idx_lms_courses_cat_lvl ON lms_courses(category, level);
CREATE INDEX IF NOT EXISTS idx_lms_courses_subject ON lms_courses(subject);
CREATE INDEX IF NOT EXISTS idx_lms_courses_grade ON lms_courses(grade);
CREATE INDEX IF NOT EXISTS idx_lms_courses_status ON lms_courses((content_json->>'status'));
CREATE INDEX IF NOT EXISTS idx_lms_courses_visibility ON lms_courses((content_json->>'visibility'));
CREATE INDEX IF NOT EXISTS idx_lms_courses_created_desc ON lms_courses(created_at DESC);

-- GIN Index for PostgreSQL JSONB deep search (optional/ignored in pure SQLite)
-- CREATE INDEX IF NOT EXISTS idx_lms_courses_content_json_gin ON lms_courses USING gin (content_json);

-- 2. Table: lms_enrollments (Compound Index for User & Course Access)
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_user ON lms_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_course ON lms_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_user_course ON lms_enrollments(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_lms_enrollments_last_accessed ON lms_enrollments(last_accessed DESC);

-- 3. Table: lms_quiz_results (Indexed Querying for Student Portfolios & Admin Grading)
CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_user ON lms_quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_course ON lms_quiz_results(course_id);
CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_user_date ON lms_quiz_results(user_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_course_mod ON lms_quiz_results(course_id, module_index);

-- 4. Table: lms_quiz_attempts (Realtime Progress In-flight Lookup)
CREATE INDEX IF NOT EXISTS idx_lms_quiz_attempts_lookup ON lms_quiz_attempts(user_id, course_id, module_id);
CREATE INDEX IF NOT EXISTS idx_lms_quiz_attempts_status ON lms_quiz_attempts(status);

-- 5. Table: lms_schools (Fast Autocomplete & NPSN Exact Match)
CREATE INDEX IF NOT EXISTS idx_lms_schools_name ON lms_schools(name);
CREATE INDEX IF NOT EXISTS idx_lms_schools_npsn ON lms_schools(npsn);
CREATE INDEX IF NOT EXISTS idx_lms_schools_level ON lms_schools(level);

-- 6. Table: users (Role & School Filtering Optimization)
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_school ON users(school);


-- ==============================================================================
-- DOWN (ROLLBACK): Revert Optimization Indexes
-- ==============================================================================
-- DROP INDEX IF EXISTS idx_users_school;
-- DROP INDEX IF EXISTS idx_users_role;
-- DROP INDEX IF EXISTS idx_lms_schools_level;
-- DROP INDEX IF EXISTS idx_lms_schools_npsn;
-- DROP INDEX IF EXISTS idx_lms_schools_name;
-- DROP INDEX IF EXISTS idx_lms_quiz_attempts_status;
-- DROP INDEX IF EXISTS idx_lms_quiz_attempts_lookup;
-- DROP INDEX IF EXISTS idx_lms_quiz_results_course_mod;
-- DROP INDEX IF EXISTS idx_lms_quiz_results_user_date;
-- DROP INDEX IF EXISTS idx_lms_quiz_results_course;
-- DROP INDEX IF EXISTS idx_lms_quiz_results_user;
-- DROP INDEX IF EXISTS idx_lms_enrollments_last_accessed;
-- DROP INDEX IF EXISTS idx_lms_enrollments_user_course;
-- DROP INDEX IF EXISTS idx_lms_enrollments_course;
-- DROP INDEX IF EXISTS idx_lms_enrollments_user;
-- DROP INDEX IF EXISTS idx_lms_courses_created_desc;
-- DROP INDEX IF EXISTS idx_lms_courses_visibility;
-- DROP INDEX IF EXISTS idx_lms_courses_status;
-- DROP INDEX IF EXISTS idx_lms_courses_grade;
-- DROP INDEX IF EXISTS idx_lms_courses_subject;
-- DROP INDEX IF EXISTS idx_lms_courses_cat_lvl;
