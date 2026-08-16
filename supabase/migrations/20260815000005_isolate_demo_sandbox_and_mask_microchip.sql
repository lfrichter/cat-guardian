-- Migration: Isolate Demo Guardian Sandbox and Mask Public Microchip
-- Problem: Demo Guardian must own ONLY its 3 dedicated demo cats. Inserting into public.cats requires a valid owner_id in auth.users to satisfy cats_owner_id_fkey constraint.
-- Solution: Seed demo user in auth.users if missing, and seed 3 dedicated demo cats linked to the demo user's auth ID.

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
-- 2. SEED DEMO GUARDIAN USER AND 3 DEDICATED DEMO CATS
-- ============================================================================
DO $$
DECLARE
  v_demo_user_id UUID;
BEGIN
  -- 2.1 Fetch existing demo user ID if present in auth.users
  SELECT id INTO v_demo_user_id FROM auth.users WHERE email = 'demo@catguardian.dev';

  -- 2.2 If user does not exist in auth.users yet, seed demo user to satisfy FK constraint
  IF v_demo_user_id IS NULL THEN
    v_demo_user_id := 'd3000000-0000-4000-a000-000000000001';
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      v_demo_user_id,
      '00000000-0000-0000-0000-000000000000',
      'demo@catguardian.dev',
      crypt('DemoGuardian2026!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Demo Guardian Tutor","phone":"+55 11 98888-7771"}',
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
  END IF;

  -- 2.3 Insert 3 dedicated demo cats linked to valid v_demo_user_id
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
    'd300ca71-0000-4000-a000-000000000001',
    v_demo_user_id,
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
    'd300ca72-0000-4000-a000-000000000002',
    v_demo_user_id,
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
    'd300ca73-0000-4000-a000-000000000003',
    v_demo_user_id,
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
    owner_id = EXCLUDED.owner_id,
    is_lost = EXCLUDED.is_lost,
    lost_notes = EXCLUDED.lost_notes;
END $$;
