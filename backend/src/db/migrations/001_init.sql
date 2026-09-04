-- AI Bureaucracy Navigator — PostgreSQL schema
-- Run with: psql "$DATABASE_URL" -f src/db/migrations/001_init.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  preferred_lang  TEXT NOT NULL DEFAULT 'en' CHECK (preferred_lang IN ('en', 'ta')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Government services knowledge-base entries (seeded from demo data during development,
-- later replaced/augmented by verified official-source content consumed by the RAG pipeline).
CREATE TABLE IF NOT EXISTS gov_services (
  id                    TEXT PRIMARY KEY,             -- slug, e.g. 'pan-card'
  name_en               TEXT NOT NULL,
  name_ta               TEXT NOT NULL,
  category              TEXT NOT NULL,
  department_en         TEXT NOT NULL,
  department_ta         TEXT NOT NULL,
  description_en        TEXT NOT NULL,
  description_ta        TEXT NOT NULL,
  eligibility           JSONB NOT NULL DEFAULT '[]',  -- [{en, ta}]
  documents             JSONB NOT NULL DEFAULT '[]',  -- [{en, ta}]
  steps                 JSONB NOT NULL DEFAULT '[]',  -- [{id, title:{en,ta}, description:{en,ta}}]
  common_mistakes       JSONB NOT NULL DEFAULT '[]',  -- [{en, ta}]
  official_url          TEXT,
  fee_note              JSONB,                        -- {en, ta}
  processing_time_note  JSONB,                         -- {en, ta}
  keywords              TEXT[] NOT NULL DEFAULT '{}',
  is_demo_data          BOOLEAN NOT NULL DEFAULT true,
  source_url            TEXT,                          -- verified official source, once available
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE application_status AS ENUM (
  'not_started', 'documents_pending', 'submitted', 'in_progress', 'completed'
);

CREATE TABLE IF NOT EXISTS applications (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id         TEXT NOT NULL REFERENCES gov_services(id),
  application_ref    TEXT NOT NULL,
  status             application_status NOT NULL DEFAULT 'documents_pending',
  current_step_index INT NOT NULL DEFAULT 0,
  date_started       DATE NOT NULL DEFAULT CURRENT_DATE,
  last_updated       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);

-- Uploaded documents are stored on disk/object storage; this table holds only
-- the OCR/field-check result, never the raw file bytes.
CREATE TABLE IF NOT EXISTS scanned_documents (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id   UUID REFERENCES applications(id) ON DELETE SET NULL,
  file_name        TEXT NOT NULL,
  storage_path     TEXT NOT NULL,          -- path in object storage; never made public
  detected_type    TEXT,
  field_checks     JSONB NOT NULL DEFAULT '[]',
  overall_quality  TEXT NOT NULL DEFAULT 'needs_rescan' CHECK (overall_quality IN ('good', 'needs_rescan')),
  uploaded_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_user ON scanned_documents(user_id);

CREATE TABLE IF NOT EXISTS chat_messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role              TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  text              TEXT NOT NULL,
  matched_service_id TEXT REFERENCES gov_services(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_messages(user_id, created_at);
