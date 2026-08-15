-- Migration: Add lost_incidents and sightings tables with RLS policies
-- Problem: Need dedicated models and privacy controls for lost cat incidents and finder sightings.
-- Solution: Create forward-only 'lost_incidents' and 'sightings' tables, add indexes and RLS policies for public sighting submissions and owner management.

-- 1. LOST INCIDENTS TABLE
CREATE TABLE IF NOT EXISTS public.lost_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id UUID NOT NULL REFERENCES public.cats(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_seen_at TIMESTAMPTZ,
  last_seen_location TEXT,
  notes TEXT,
  status TEXT DEFAULT 'ACTIVE' NOT NULL,
  resolved_at TIMESTAMPTZ
);

-- 2. SIGHTINGS TABLE
CREATE TABLE IF NOT EXISTS public.sightings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lost_incident_id UUID REFERENCES public.lost_incidents(id) ON DELETE CASCADE,
  cat_id UUID NOT NULL REFERENCES public.cats(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  message TEXT,
  finder_name TEXT,
  finder_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_lost_incidents_cat_id ON public.lost_incidents(cat_id);
CREATE INDEX IF NOT EXISTS idx_sightings_cat_id ON public.sightings(cat_id);
CREATE INDEX IF NOT EXISTS idx_sightings_created_at ON public.sightings(created_at DESC);

-- RLS POLICIES
ALTER TABLE public.lost_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sightings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active lost incidents" ON public.lost_incidents
  FOR SELECT USING (true);

CREATE POLICY "Public can insert sightings" ON public.sightings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view sightings for lost cats" ON public.sightings
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage lost incidents" ON public.lost_incidents
  FOR ALL USING (true);
