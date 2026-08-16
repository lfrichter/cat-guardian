-- Migration: Clean Up Obsolete Demo Cats and Enforce Oliver, Simba, Luna for Demo Account
-- Problem: Migration 20260815000005 seeded temporary demo cats named 'Kiara (Demo)', 'Golia (Demo)', and 'Meias (Demo)' which duplicate names and conflict with the official demo cats ('Oliver (Demo)', 'Simba (Demo)', 'Luna (Demo)').
-- Solution: Delete the 3 obsolete demo cats from public.cats table, leaving strictly the 3 official demo cats for demo@catguardian.dev.

DO $$
BEGIN
  -- Delete obsolete demo cats by ID or name pattern
  DELETE FROM public.cats
  WHERE id IN (
    'd3000000-0000-4000-a000-000000000001',
    'd3000000-0000-4000-a000-000000000002',
    'd3000000-0000-4000-a000-000000000003'
  ) OR name IN ('Kiara (Demo)', 'Golia (Demo)', 'Meias (Demo)');

  -- Ensure official 3 demo cats exist and are properly owned by demo account
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
    'd300ca71-0000-4000-a000-000000000001', 'd3000000-0000-4000-a000-000000000001', 'Oliver (Demo)', 'Siamês Mix', '2022-03-10', 'macho',
    'Bege com extremidades marrom-escuras e olhos azuis', '982000999000001', false, NULL,
    'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=600&q=80',
    'Demo Guardian Tutor', '+55 11 98888-7771', 'demo@catguardian.dev', 'Gato siamês dócil e miau característico de demonstração.'
  ),
  (
    'd300ca72-0000-4000-a000-000000000002', 'd3000000-0000-4000-a000-000000000001', 'Simba (Demo)', 'SRD / Amarelo Tigrado', '2021-07-15', 'macho',
    'Laranja tigrado com listras brancas no peito', '982000999000002', true, 'Visto perto do parque municipal usando coleira vermelha.',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80',
    'Demo Guardian Tutor', '+55 11 98888-7771', 'demo@catguardian.dev', 'Felino laranja tigrado ativo em modo de resgate emergencial.'
  ),
  (
    'd300ca73-0000-4000-a000-000000000003', 'd3000000-0000-4000-a000-000000000001', 'Luna (Demo)', 'Escama de Tartaruga (Tortoiseshell)', '2023-01-20', 'fêmea',
    'Preto e alaranjado mesclado estilo tartaruga', '982000999000003', false, NULL,
    'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=600&q=80',
    'Demo Guardian Tutor', '+55 11 98888-7771', 'demo@catguardian.dev', 'Gata carinhosa e quieta para ambiente de teste.'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    owner_id = EXCLUDED.owner_id,
    owner_name = EXCLUDED.owner_name,
    owner_email = EXCLUDED.owner_email,
    owner_phone = EXCLUDED.owner_phone;
END $$;
