// ==============================================================================
// Next Level Study (NLS) - Universal PostgreSQL Migration Script Exporter
// Generates a complete, ready-to-run .sql dump for VPS / Dedicated PostgreSQL
// ==============================================================================

import { getCloudStore } from './cloud-db.js';

function sqlEscape(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return isNaN(val) ? '0' : String(val);
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (typeof val === 'object') {
        return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
    }
    const str = String(val).replace(/'/g, "''");
    return `'${str}'`;
}

export async function generateVpsSqlDump() {
    const store = await getCloudStore();
    const timestamp = new Date().toISOString();

    let sql = `-- ==============================================================================
-- Next Level Study (NLS) - PostgreSQL VPS Migration Dump
-- Generated at: ${timestamp}
-- Description: Complete schema and data dump for migration from Cloud DB to VPS
-- Compatible with: PostgreSQL 14+, Supabase, Neon, Railway, or Linux VPS
-- ==============================================================================

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'siswa',
    name VARCHAR(100),
    nisn VARCHAR(50),
    phone VARCHAR(50),
    school VARCHAR(150),
    level VARCHAR(100),
    grade VARCHAR(255),
    lms_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. LMS COURSES TABLE
CREATE TABLE IF NOT EXISTS lms_courses (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50),
    level VARCHAR(50),
    subject VARCHAR(100),
    grade VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    content_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_lms_courses_cat_lvl ON lms_courses(category, level);

-- 4. LMS ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS lms_enrollments (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    course_id VARCHAR(100),
    progress INTEGER DEFAULT 0,
    completed_modules JSONB DEFAULT '[]'::jsonb,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- 5. LMS QUIZ RESULTS TABLE
CREATE TABLE IF NOT EXISTS lms_quiz_results (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    course_id VARCHAR(100),
    module_index VARCHAR(100),
    score NUMERIC(5,2),
    paket INTEGER DEFAULT 1,
    answers_json JSONB,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_lms_quiz_results_user ON lms_quiz_results(user_id, submitted_at DESC);

-- 6. LMS QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS lms_quiz_attempts (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    course_id VARCHAR(100),
    module_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'in_progress',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    elapsed_seconds INTEGER DEFAULT 0,
    answers_json JSONB DEFAULT '{}'::jsonb,
    UNIQUE(user_id, course_id, module_id)
);

-- 7. LMS SCHOOLS TABLE
CREATE TABLE IF NOT EXISTS lms_schools (
    id VARCHAR(100) PRIMARY KEY,
    npsn VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50),
    city VARCHAR(150),
    province VARCHAR(150),
    country VARCHAR(150) DEFAULT 'Indonesia',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    author VARCHAR(100),
    status VARCHAR(50) DEFAULT 'published',
    content_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    event_date VARCHAR(50),
    status VARCHAR(50) DEFAULT 'published',
    content_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    title VARCHAR(150),
    subject VARCHAR(150),
    status VARCHAR(50) DEFAULT 'published',
    content_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DATA INSERTS
-- ==============================================================================
\n`;

    // 1. Users
    const users = Array.isArray(store.users) ? store.users : [];
    sql += `-- USERS (${users.length} records)\n`;
    for (const u of users) {
        if (!u || !u.email) continue;
        const uid = u.id || `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const username = u.username || u.email.split('@')[0];
        const pwd = u.password || u.password_hash || '@Maman123$';
        const role = u.role || 'siswa';
        const name = u.name || username;
        const nisn = u.nisn || '';
        const phone = u.phone || '';
        const school = u.school || '';
        const level = u.level || '';
        const grade = u.grade || u.targetProgram || '';
        const lmsData = u.lmsData || {};

        sql += `INSERT INTO users (id, username, email, password_hash, role, name, nisn, phone, school, level, grade, lms_data)
VALUES (${sqlEscape(uid)}, ${sqlEscape(username)}, ${sqlEscape(u.email)}, ${sqlEscape(pwd)}, ${sqlEscape(role)}, ${sqlEscape(name)}, ${sqlEscape(nisn)}, ${sqlEscape(phone)}, ${sqlEscape(school)}, ${sqlEscape(level)}, ${sqlEscape(grade)}, ${sqlEscape(lmsData)})
ON CONFLICT (id) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    school = EXCLUDED.school,
    level = EXCLUDED.level,
    grade = EXCLUDED.grade,
    lms_data = EXCLUDED.lms_data;\n`;
    }
    sql += `\n`;

    // 2. Courses
    const courses = Array.isArray(store.courses) ? store.courses : [];
    sql += `-- LMS COURSES (${courses.length} records)\n`;
    for (const c of courses) {
        if (!c || !c.id) continue;
        const cat = c.category || 'School';
        const lvl = c.level || 'SD';
        const subj = c.subject || '';
        const grd = c.grade || '';
        const title = c.title || '';
        const desc = c.description || '';

        sql += `INSERT INTO lms_courses (id, category, level, subject, grade, title, description, content_json)
VALUES (${sqlEscape(c.id)}, ${sqlEscape(cat)}, ${sqlEscape(lvl)}, ${sqlEscape(subj)}, ${sqlEscape(grd)}, ${sqlEscape(title)}, ${sqlEscape(desc)}, ${sqlEscape(c)})
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    level = EXCLUDED.level,
    subject = EXCLUDED.subject,
    grade = EXCLUDED.grade,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content_json = EXCLUDED.content_json;\n`;
    }
    sql += `\n`;

    // 3. Quiz Submissions
    const quizSubmissions = Array.isArray(store.quizSubmissions) ? store.quizSubmissions : [];
    // Also gather quiz results inside users' lmsData
    const allQuizResults = [...quizSubmissions];
    users.forEach(u => {
        if (u.lmsData && Array.isArray(u.lmsData.quizResults)) {
            u.lmsData.quizResults.forEach(qr => {
                if (!allQuizResults.some(ex => ex.id === qr.id || (ex.courseId === qr.courseId && String(ex.moduleIndex) === String(qr.moduleIndex) && ex.userId === u.id))) {
                    allQuizResults.push({
                        ...qr,
                        id: qr.id || `qr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        userId: u.id || u.email
                    });
                }
            });
        }
    });

    sql += `-- LMS QUIZ RESULTS (${allQuizResults.length} records)\n`;
    for (const q of allQuizResults) {
        if (!q || !q.courseId) continue;
        const qid = q.id || `qr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const uid = q.userId || q.studentEmail || 'usr-default';
        const cid = q.courseId;
        const modIdx = String(q.moduleIndex || '0');
        const score = Number(q.score || 0);
        const paket = q.paket || 1;
        const answers = q.answers || {};

        sql += `INSERT INTO lms_quiz_results (id, user_id, course_id, module_index, score, paket, answers_json)
VALUES (${sqlEscape(qid)}, ${sqlEscape(uid)}, ${sqlEscape(cid)}, ${sqlEscape(modIdx)}, ${score}, ${paket}, ${sqlEscape(answers)})
ON CONFLICT (id) DO NOTHING;\n`;
    }
    sql += `\n`;

    // 4. Articles
    const articles = Array.isArray(store.articles) ? store.articles : [];
    sql += `-- ARTICLES (${articles.length} records)\n`;
    for (const a of articles) {
        if (!a || !a.id) continue;
        sql += `INSERT INTO articles (id, title, category, author, status, content_json)
VALUES (${sqlEscape(a.id)}, ${sqlEscape(a.title || '')}, ${sqlEscape(a.category || '')}, ${sqlEscape(a.author || 'Tim Akademik NLS')}, ${sqlEscape(a.status || 'published')}, ${sqlEscape(a)})
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    author = EXCLUDED.author,
    status = EXCLUDED.status,
    content_json = EXCLUDED.content_json;\n`;
    }
    sql += `\n`;

    // 5. Events
    const events = Array.isArray(store.events) ? store.events : [];
    sql += `-- EVENTS & CALENDAR (${events.length} records)\n`;
    for (const e of events) {
        if (!e || !e.id) continue;
        const evDate = e.date || e.startDate || '';
        sql += `INSERT INTO events (id, title, category, event_date, status, content_json)
VALUES (${sqlEscape(e.id)}, ${sqlEscape(e.title || '')}, ${sqlEscape(e.category || '')}, ${sqlEscape(evDate)}, ${sqlEscape(e.status || 'published')}, ${sqlEscape(e)})
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    event_date = EXCLUDED.event_date,
    status = EXCLUDED.status,
    content_json = EXCLUDED.content_json;\n`;
    }
    sql += `\n`;

    // 6. Teachers
    const teachers = Array.isArray(store.teachers) ? store.teachers : [];
    sql += `-- TEACHERS & MENTORS (${teachers.length} records)\n`;
    for (const t of teachers) {
        if (!t || !t.id) continue;
        sql += `INSERT INTO teachers (id, name, title, subject, status, content_json)
VALUES (${sqlEscape(t.id)}, ${sqlEscape(t.name || '')}, ${sqlEscape(t.title || '')}, ${sqlEscape(t.subject || '')}, ${sqlEscape(t.status || 'published')}, ${sqlEscape(t)})
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    subject = EXCLUDED.subject,
    status = EXCLUDED.status,
    content_json = EXCLUDED.content_json;\n`;
    }
    sql += `\n`;

    sql += `-- ==============================================================================
-- MIGRATION DUMP COMPLETED SUCCESSFULLY
-- Total records exported: ${users.length} Users, ${courses.length} Courses, ${allQuizResults.length} Quiz Results, ${articles.length} Articles, ${events.length} Events, ${teachers.length} Teachers.
-- ==============================================================================\n`;

    return sql;
}
