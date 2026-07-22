-- ─── TEMTECH Dashboard — Supabase Migration ──────────────────────────────────
-- Run this in your Supabase SQL Editor to create all tables and RLS policies.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  full_name  TEXT,
  role       TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin','manager','developer','viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles access" ON profiles;
CREATE POLICY "Public profiles access" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- ─── leads ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  service    TEXT,
  message    TEXT,
  status     TEXT NOT NULL DEFAULT 'nuevo' CHECK (status IN ('nuevo','contactado','propuesta_enviada','negociacion','ganado','perdido')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public leads access" ON leads;
CREATE POLICY "Public leads access" ON leads FOR ALL USING (true) WITH CHECK (true);

-- ─── clients ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  company    TEXT,
  email      TEXT,
  phone      TEXT,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public clients access" ON clients;
CREATE POLICY "Public clients access" ON clients FOR ALL USING (true) WITH CHECK (true);

-- ─── projects ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID REFERENCES clients(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Pendiente','En Desarrollo','En Revisión','Entregado')),
  budget      NUMERIC,
  start_date  DATE,
  end_date    DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public projects access" ON projects;
CREATE POLICY "Public projects access" ON projects FOR ALL USING (true) WITH CHECK (true);

-- ─── tasks ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID REFERENCES projects(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Pendiente','En progreso','Bloqueada','Completada')),
  priority    TEXT NOT NULL DEFAULT 'media' CHECK (priority IN ('baja','media','alta','urgente')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public tasks access" ON tasks;
CREATE POLICY "Public tasks access" ON tasks FOR ALL USING (true) WITH CHECK (true);

-- ─── quotes ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id  UUID REFERENCES clients(id) ON DELETE SET NULL,
  title      TEXT NOT NULL,
  amount     NUMERIC NOT NULL DEFAULT 0,
  status     TEXT NOT NULL DEFAULT 'Borrador' CHECK (status IN ('Borrador','Enviado','Aceptado','Rechazado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public quotes access" ON quotes;
CREATE POLICY "Public quotes access" ON quotes FOR ALL USING (true) WITH CHECK (true);

-- ─── files ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS files (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID REFERENCES projects(id) ON DELETE SET NULL,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public files access" ON files;
CREATE POLICY "Public files access" ON files FOR ALL USING (true) WITH CHECK (true);

-- ─── Storage Bucket ───────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Storage Files Access" ON storage.objects;
CREATE POLICY "Public Storage Files Access" ON storage.objects
FOR ALL USING (bucket_id = 'files') WITH CHECK (bucket_id = 'files');
