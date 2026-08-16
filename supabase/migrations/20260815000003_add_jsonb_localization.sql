-- Migration: Add JSONB localization support to cats table
-- Problem: Cat AI descriptions and notes were single-language text strings instead of localized JSONB payloads.
-- Solution: Add 'ai_profile_localized' JSONB column to 'cats' table, with forward-only fallback migration.

-- 1. Add ai_profile_localized JSONB column to cats table
ALTER TABLE public.cats
  ADD COLUMN IF NOT EXISTS ai_profile_localized JSONB DEFAULT '{}'::jsonb;

-- 2. Index for JSONB queries
CREATE INDEX IF NOT EXISTS idx_cats_ai_profile_localized ON public.cats USING gin (ai_profile_localized);
