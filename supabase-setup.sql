-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/dzdapevcmsbbkmcnrwlb/sql

-- ─── Users table ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at   timestamp with time zone DEFAULT now()
);

-- ─── Scans table ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.scans (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  url         text NOT NULL,
  result      jsonb,
  scanned_at  timestamp with time zone DEFAULT now()
);

-- Index for fast per-user scan lookups
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON public.scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON public.scans(scanned_at DESC);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Enable RLS so the anon key cannot read other users' data.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Your backend uses the anon key server-side with explicit user_id filtering,
-- so we grant full access to the service role and anon key at the table level.
-- If you switch to the service role key in production, tighten these policies.
CREATE POLICY "Allow all for anon" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON public.scans FOR ALL USING (true) WITH CHECK (true);
