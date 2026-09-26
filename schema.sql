-- ====================================================================
-- Cloudflare D1 Database Schema for ExamScan OMR System
-- Run: npx wrangler d1 execute omr_d1 --file=./schema.sql
-- ====================================================================

-- 1. App Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'app_settings',
  app_name TEXT NOT NULL,
  app_logo_url TEXT,
  organization_name TEXT NOT NULL,
  last_updated TEXT NOT NULL,
  updated_by TEXT NOT NULL
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'teacher', -- 'admin' | 'teacher'
  status TEXT NOT NULL DEFAULT 'approved', -- 'approved' | 'pending' | 'rejected'
  created_at TEXT NOT NULL,
  last_login_at TEXT NOT NULL,
  storage_bytes INTEGER DEFAULT 0
);

-- 3. Exams Table
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT,
  grade_level TEXT,
  description TEXT,
  question_count INTEGER NOT NULL,
  choice_count INTEGER NOT NULL DEFAULT 4,
  choice_label_type TEXT DEFAULT 'thai', -- 'thai' | 'latin'
  pass_percentage INTEGER NOT NULL DEFAULT 50,
  created_by TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  answer_key_json TEXT NOT NULL -- JSON string of { [questionNumber]: choiceIndex }
);

-- 4. Scan Results Table
CREATE TABLE IF NOT EXISTS scan_results (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  exam_title TEXT NOT NULL,
  student_name TEXT,
  student_id TEXT,
  student_class TEXT,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  score_percentage INTEGER NOT NULL,
  passed INTEGER NOT NULL DEFAULT 0, -- 1 for true, 0 for false
  answers_json TEXT NOT NULL, -- JSON array of QuestionAnswer
  annotated_image_url TEXT,
  scanned_at TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (exam_id) REFERENCES exams (id) ON DELETE CASCADE
);

-- Initial default settings
INSERT OR IGNORE INTO settings (id, app_name, app_logo_url, organization_name, last_updated, updated_by)
VALUES ('app_settings', 'ExamScan OMR Pro', '', 'ศูนย์ทดสอบวัดผลทางการศึกษา', datetime('now'), 'Admin (System)');

-- Initial default admin user
INSERT OR IGNORE INTO users (id, email, display_name, role, status, created_at, last_login_at, storage_bytes)
VALUES ('admin_root', 'admin@system.local', 'ผู้ดูแลระบบ (Admin)', 'admin', 'approved', datetime('now'), datetime('now'), 0);
