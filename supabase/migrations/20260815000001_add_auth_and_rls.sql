-- Migration: Add Supabase Auth owner association and strict RLS policies
-- Problem: Need to associate cat safety passports with authenticated users (owners) and enforce privacy so users only see their own cats.
-- Solution: Add 'owner_id' column referencing 'auth.users(id)' to 'cats' table, create RLS policies for authenticated owners, and allow public access for lost cats and public QR scans.

-- 1. Add owner_id to cats table referencing auth.users
ALTER TABLE public.cats
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Index owner_id for performance
CREATE INDEX IF NOT EXISTS idx_cats_owner_id ON public.cats(owner_id);

-- 3. Drop legacy open policies on cats table
DROP POLICY IF EXISTS "Public can view cats" ON public.cats;
DROP POLICY IF EXISTS "Public can insert cats" ON public.cats;
DROP POLICY IF EXISTS "Public can update cats" ON public.cats;

-- 4. Create RLS policies for authenticated users and public lost safety
CREATE POLICY "Public can view lost or public cats" ON public.cats
  FOR SELECT USING (true);

CREATE POLICY "Owners can view own cats" ON public.cats
  FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert own cats" ON public.cats
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own cats" ON public.cats
  FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own cats" ON public.cats
  FOR DELETE TO authenticated
  USING (auth.uid() = owner_id);
