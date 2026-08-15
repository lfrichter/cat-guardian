-- Migration: Create initial database schema for Cat Guardian
-- Problem: Need database tables to persist cat safety passports, health records, and client runtime error logs.
-- Solution: Create forward-only tables for 'cats', 'health_records', and 'client_errors' with RLS policies and performance indexes.

-- 1. CATS TABLE
CREATE TABLE IF NOT EXISTS public.cats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  breed TEXT,
  birth_date DATE,
  gender TEXT,
  color_pattern TEXT,
  microchip_number TEXT,
  is_lost BOOLEAN DEFAULT false NOT NULL,
  lost_notes TEXT,
  photo_url TEXT,
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  ai_profile_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. HEALTH RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id UUID NOT NULL REFERENCES public.cats(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date_administered DATE,
  next_due_date DATE,
  vet_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. CLIENT ERRORS TABLE
CREATE TABLE IF NOT EXISTS public.client_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  user_email TEXT DEFAULT 'anonymous' NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_cats_is_lost ON public.cats(is_lost);
CREATE INDEX IF NOT EXISTS idx_health_records_cat_id ON public.health_records(cat_id);
CREATE INDEX IF NOT EXISTS idx_client_errors_created_at ON public.client_errors(created_at DESC);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_errors ENABLE ROW LEVEL SECURITY;

-- Allow public read access to missing cats (Lost Mode) & general passport viewing
CREATE POLICY "Public can view cats" ON public.cats
  FOR SELECT USING (true);

-- Allow public write access for cat management in hackathon dev mode
CREATE POLICY "Public can insert cats" ON public.cats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update cats" ON public.cats
  FOR UPDATE USING (true);

-- Allow public read/write access to health records
CREATE POLICY "Public can view health records" ON public.health_records
  FOR SELECT USING (true);

CREATE POLICY "Public can manage health records" ON public.health_records
  FOR ALL USING (true);

-- Allow public client error logging
CREATE POLICY "Public can insert client errors" ON public.client_errors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view client errors" ON public.client_errors
  FOR SELECT USING (true);
