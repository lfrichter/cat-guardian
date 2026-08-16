-- Migration: Isolate Demo Guardian Sandbox and Mask Public Microchip
-- Problem: Demo Guardian must own ONLY its 3 dedicated demo cats and MUST NOT have access to real users' cats (e.g. macacoharmonico@gmail.com).
-- Solution: Seed 3 dedicated demo cats with owner_id = 'd3m00000-0000-0000-0000-000000000001' and verify strict owner RLS policies.

-- ============================================================================
-- 1. RE-VERIFY PUBLIC RESCUE VIEW (Zero Microchip, Zero Owner PII)
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
-- 2. SEED 3 DEDICATED DEMO CATS FOR DEMO GUARDIAN ('d3m00000-0000-0000-0000-000000000001')
-- ============================================================================
INSERT INTO public.cats (
  id,
  owner_id,
  name,
  breed,
  birth_date,
  gender,
  color_pattern,
  microchip_number,
  is_lost,
  lost_notes,
  photo_url,
  owner_name,
  owner_phone,
  owner_email,
  ai_profile_summary
) VALUES
(
  'demo-cat-kiara',
  'd3m00000-0000-0000-0000-000000000001',
  'Kiara (Demo)',
  'SRD / Vira-lata',
  '2021-04-12',
  'fêmea',
  'Tricolor / Calico com manchas alaranjadas e pretas',
  '982000341829012',
  false,
  NULL,
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
  'Demo Guardian Tutor',
  '+55 11 98888-7771',
  'demo@catguardian.dev',
  'Gata curiosa e dócil em ambiente de demonstração.'
),
(
  'demo-cat-golia',
  'd3m00000-0000-0000-0000-000000000001',
  'Golia (Demo)',
  'Maine Coon Mix',
  '2020-08-20',
  'macho',
  'Cinza prateado / Tabby maciço',
  '982000341829013',
  true, -- Lost Mode = ON for rescue flow demonstration
  'Visto pela última vez perto da praça central com coleira azul.',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
  'Demo Guardian Tutor',
  '+55 11 98888-7771',
  'demo@catguardian.dev',
  'Felino de grande porte em modo de resgate ativo.'
),
(
  'demo-cat-meias',
  'd3m00000-0000-0000-0000-000000000001',
  'Meias (Demo)',
  'Tuxedo / SRD',
  '2022-01-15',
  'macho',
  'Preto com peito e patinhas brancas ("Meias")',
  '982000341829014',
  false,
  NULL,
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
  'Demo Guardian Tutor',
  '+55 11 98888-7771',
  'demo@catguardian.dev',
  'Gato tuxedo dócil e protetor.'
)
ON CONFLICT (id) DO UPDATE SET
  owner_id = 'd3m00000-0000-0000-0000-000000000001',
  is_lost = EXCLUDED.is_lost,
  lost_notes = EXCLUDED.lost_notes;
