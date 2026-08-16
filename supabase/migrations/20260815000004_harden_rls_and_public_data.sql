-- Migration: Harden RLS Policies, Public Rescue View, and Secure Sighting RPC
-- Problem: Legacy RLS policies allow anonymous clients to modify health records, lost incidents, view private sightings, and query owner PII (email/phone).
-- Solution:
-- 1. Create 'public_cat_profiles' view excluding owner PII and raw microchip number.
-- 2. Enforce strict owner-only RLS policies on 'cats', 'health_records', 'lost_incidents', and 'sightings'.
-- 3. Create hardened 'submit_sighting' RPC function with input validation, is_lost check, and SECURITY DEFINER search_path isolation.

-- ============================================================================
-- 1. CREATE PUBLIC RESCUE VIEW (Zero Owner PII, Zero Microchip Exposure)
-- ============================================================================
CREATE OR REPLACE VIEW public.public_cat_profiles WITH (security_barrier = true) AS
  SELECT
    id,
    name,
    breed,
    color_pattern,
    photo_url,
    is_lost,
    lost_notes,
    ai_profile_summary,
    ai_profile_localized,
    created_at,
    updated_at
  FROM public.cats;

GRANT SELECT ON public.public_cat_profiles TO anon, authenticated;

-- ============================================================================
-- 2. HARDEN CATS TABLE RLS (Strict Owner Authorization)
-- ============================================================================
DROP POLICY IF EXISTS "Public can view lost or public cats" ON public.cats;
DROP POLICY IF EXISTS "Public can view cats" ON public.cats;
DROP POLICY IF EXISTS "Public can insert cats" ON public.cats;
DROP POLICY IF EXISTS "Public can update cats" ON public.cats;
DROP POLICY IF EXISTS "Owners can view own cats" ON public.cats;
DROP POLICY IF EXISTS "Owners can insert own cats" ON public.cats;
DROP POLICY IF EXISTS "Owners can update own cats" ON public.cats;
DROP POLICY IF EXISTS "Owners can delete own cats" ON public.cats;

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

-- ============================================================================
-- 3. HARDEN HEALTH RECORDS TABLE RLS (Owner Private Only)
-- ============================================================================
DROP POLICY IF EXISTS "Public can manage health records" ON public.health_records;
DROP POLICY IF EXISTS "Public can view health records" ON public.health_records;
DROP POLICY IF EXISTS "Owners can view health records" ON public.health_records;
DROP POLICY IF EXISTS "Owners can insert health records" ON public.health_records;
DROP POLICY IF EXISTS "Owners can update health records" ON public.health_records;
DROP POLICY IF EXISTS "Owners can delete health records" ON public.health_records;

CREATE POLICY "Owners can view health records" ON public.health_records
  FOR SELECT TO authenticated
  USING (cat_id IN (SELECT id FROM public.cats WHERE owner_id = auth.uid()));

CREATE POLICY "Owners can insert health records" ON public.health_records
  FOR INSERT TO authenticated
  WITH CHECK (cat_id IN (SELECT id FROM public.cats WHERE owner_id = auth.uid()));

CREATE POLICY "Owners can update health records" ON public.health_records
  FOR UPDATE TO authenticated
  USING (cat_id IN (SELECT id FROM public.cats WHERE owner_id = auth.uid()));

CREATE POLICY "Owners can delete health records" ON public.health_records
  FOR DELETE TO authenticated
  USING (cat_id IN (SELECT id FROM public.cats WHERE owner_id = auth.uid()));

-- ============================================================================
-- 4. HARDEN LOST INCIDENTS TABLE RLS (Owner Only)
-- ============================================================================
DROP POLICY IF EXISTS "Owners can manage lost incidents" ON public.lost_incidents;
DROP POLICY IF EXISTS "Public can view active lost incidents" ON public.lost_incidents;
DROP POLICY IF EXISTS "Owners can view lost incidents" ON public.lost_incidents;
DROP POLICY IF EXISTS "Owners can insert lost incidents" ON public.lost_incidents;
DROP POLICY IF EXISTS "Owners can update lost incidents" ON public.lost_incidents;
DROP POLICY IF EXISTS "Owners can delete lost incidents" ON public.lost_incidents;

CREATE POLICY "Owners can view lost incidents" ON public.lost_incidents
  FOR SELECT TO authenticated
  USING (cat_id IN (SELECT id FROM public.cats WHERE owner_id = auth.uid()));

CREATE POLICY "Owners can insert lost incidents" ON public.lost_incidents
  FOR INSERT TO authenticated
  WITH CHECK (cat_id IN (SELECT id FROM public.cats WHERE owner_id = auth.uid()));

CREATE POLICY "Owners can update lost incidents" ON public.lost_incidents
  FOR UPDATE TO authenticated
  USING (cat_id IN (SELECT id FROM public.cats WHERE owner_id = auth.uid()));

CREATE POLICY "Owners can delete lost incidents" ON public.lost_incidents
  FOR DELETE TO authenticated
  USING (cat_id IN (SELECT id FROM public.cats WHERE owner_id = auth.uid()));

-- ============================================================================
-- 5. HARDEN SIGHTINGS TABLE RLS (Public Insert, Owner Private Select)
-- ============================================================================
DROP POLICY IF EXISTS "Public can view sightings for lost cats" ON public.sightings;
DROP POLICY IF EXISTS "Public can insert sightings" ON public.sightings;
DROP POLICY IF EXISTS "Owners can view sightings for own cats" ON public.sightings;
DROP POLICY IF EXISTS "Owners can delete sightings for own cats" ON public.sightings;

CREATE POLICY "Public can insert sightings" ON public.sightings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners can view sightings for own cats" ON public.sightings
  FOR SELECT TO authenticated
  USING (cat_id IN (SELECT id FROM public.cats WHERE owner_id = auth.uid()));

CREATE POLICY "Owners can delete sightings for own cats" ON public.sightings
  FOR DELETE TO authenticated
  USING (cat_id IN (SELECT id FROM public.cats WHERE owner_id = auth.uid()));

-- ============================================================================
-- 6. SECURE SIGHTING SUBMISSION RPC FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION public.submit_sighting(
  p_cat_id UUID,
  p_location TEXT,
  p_message TEXT DEFAULT NULL,
  p_finder_name TEXT DEFAULT NULL,
  p_finder_phone TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_cat RECORD;
  v_sighting_id UUID;
BEGIN
  -- 1. Validate required fields
  IF p_cat_id IS NULL THEN
    RAISE EXCEPTION 'cat_id is required';
  END IF;

  IF p_location IS NULL OR length(trim(p_location)) = 0 THEN
    RAISE EXCEPTION 'location is required';
  END IF;

  IF p_finder_phone IS NULL OR length(trim(p_finder_phone)) = 0 THEN
    RAISE EXCEPTION 'finder_phone is required';
  END IF;

  -- 2. Validate maximum length constraints
  IF length(p_location) > 500 THEN
    RAISE EXCEPTION 'location length exceeds maximum allowed limit';
  END IF;

  IF length(coalesce(p_message, '')) > 2000 THEN
    RAISE EXCEPTION 'message length exceeds maximum allowed limit';
  END IF;

  IF length(coalesce(p_finder_name, '')) > 150 THEN
    RAISE EXCEPTION 'finder_name length exceeds maximum allowed limit';
  END IF;

  IF length(p_finder_phone) > 50 THEN
    RAISE EXCEPTION 'finder_phone length exceeds maximum allowed limit';
  END IF;

  -- 3. Validate cat existence
  SELECT id, is_lost INTO v_cat FROM public.cats WHERE id = p_cat_id;
  IF v_cat.id IS NULL THEN
    RAISE EXCEPTION 'cat not found';
  END IF;

  -- 4. Validate cat is currently reported lost
  IF NOT v_cat.is_lost THEN
    RAISE EXCEPTION 'cat is not currently reported lost';
  END IF;

  -- 5. Insert sighting
  INSERT INTO public.sightings (cat_id, location, message, finder_name, finder_phone)
  VALUES (p_cat_id, trim(p_location), NULLIF(trim(p_message), ''), NULLIF(trim(p_finder_name), ''), trim(p_finder_phone))
  RETURNING id INTO v_sighting_id;

  -- 6. Return safe acknowledgement without exposing owner PII
  RETURN jsonb_build_object(
    'success', true,
    'sighting_id', v_sighting_id,
    'message', 'Sighting submitted successfully'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_sighting TO anon, authenticated;
