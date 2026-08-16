-- Migration: Associate 7 Original Cats to User Account and Seed 3 Demo Cats
-- Problem: public.cats.id column requires strictly valid hexadecimal 36-character UUIDs.
-- Solution: Use valid hex UUIDs (a100ca71-0000-4000-a000-000000000001 through a100ca77-0000-4000-a000-000000000007) for user cats and d300ca71-... to d300ca73-... for demo cats.

DO $$
DECLARE
  v_user_id UUID := '43e0057d-7a22-4734-9a44-005ea42bf00f';
  v_demo_id UUID := 'd3000000-0000-4000-a000-000000000001';
BEGIN
  -- ==========================================================================
  -- 1. ASSOCIATE 7 ORIGINAL CATS TO USER ACCOUNT (macacoharmonico@gmail.com)
  -- ==========================================================================
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
    'a100ca71-0000-4000-a000-000000000001', v_user_id, 'Kiara', 'SRD / Vira-lata', '2021-04-12', 'fêmea',
    'Tricolor / Calico com manchas alaranjadas e pretas', '982000341829012', false, NULL,
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    'Luis Richter', '+55 11 98888-7771', 'macacoharmonico@gmail.com', 'Gata curiosa e dócil. Pelagem tricolor vibrante com queixo branco salpicado.'
  ),
  (
    'a100ca72-0000-4000-a000-000000000002', v_user_id, 'Golia', 'Maine Coon Mix', '2020-08-20', 'macho',
    'Cinza prateado / Tabby maciço', '982000341829013', false, NULL,
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80',
    'Luis Richter', '+55 11 98888-7771', 'macacoharmonico@gmail.com', 'Felino de grande porte com tufo de pelos nas orelhas e cauda pomposa.'
  ),
  (
    'a100ca73-0000-4000-a000-000000000003', v_user_id, 'Meias (Socks)', 'Tuxedo / SRD', '2022-01-15', 'macho',
    'Preto com peito e patinhas brancas ("Meias")', '982000341829014', false, NULL,
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
    'Luis Richter', '+55 11 98888-7771', 'macacoharmonico@gmail.com', 'Gato tuxedo preto e branco com 4 patinhas brancas.'
  ),
  (
    'a100ca74-0000-4000-a000-000000000004', v_user_id, 'Vaquinha', 'SRD', '2019-11-03', 'fêmea',
    'Branco com grandes manchas pretas arredondadas', '982000341829015', false, NULL,
    'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=600&q=80',
    'Luis Richter', '+55 11 98888-7771', 'macacoharmonico@gmail.com', 'Manchas padrão pele de vaca no dorso e focinho rosado.'
  ),
  (
    'a100ca75-0000-4000-a000-000000000005', v_user_id, 'Tigrinha', 'Tabby / Tigrado', '2021-09-28', 'fêmea',
    'Tigrado dourado e marrom com riscos pretos em M na testa', '982000341829016', false, NULL,
    'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=600&q=80',
    'Luis Richter', '+55 11 98888-7771', 'macacoharmonico@gmail.com', 'Gata agilíssima com padrão clássico tigrado em tons de âmbar.'
  ),
  (
    'a100ca76-0000-4000-a000-000000000006', v_user_id, 'Peluda', 'Persa / Angorá Mix', '2018-06-14', 'fêmea',
    'Branco neve com pelagem longa e densa', '982000341829017', false, NULL,
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
    'Luis Richter', '+55 11 98888-7771', 'macacoharmonico@gmail.com', 'Pelagem extremamente longa e sedosa, olhos azuis intensos.'
  ),
  (
    'a100ca77-0000-4000-a000-000000000007', v_user_id, 'Gamora', 'Bombaim / Preto', '2023-02-10', 'fêmea',
    'Pelagem preta reluzente com olhos amarelo-cobre', '982000341829018', false, NULL,
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    'Luis Richter', '+55 11 98888-7771', 'macacoharmonico@gmail.com', 'Gatinha jovem com pelagem preta brilhante semelhante a uma pantera em miniatura.'
  )
  ON CONFLICT (id) DO UPDATE SET
    owner_id = EXCLUDED.owner_id,
    owner_name = EXCLUDED.owner_name,
    owner_email = EXCLUDED.owner_email,
    owner_phone = EXCLUDED.owner_phone;

  -- ==========================================================================
  -- 2. SEED 3 GENERIC DEMO CATS FOR DEMO ACCOUNT (demo@catguardian.dev)
  -- ==========================================================================
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
    'd300ca71-0000-4000-a000-000000000001', v_demo_id, 'Oliver (Demo)', 'Siamês Mix', '2022-03-10', 'macho',
    'Bege com extremidades marrom-escuras e olhos azuis', '982000999000001', false, NULL,
    'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=600&q=80',
    'Demo Guardian Tutor', '+55 11 98888-7771', 'demo@catguardian.dev', 'Gato siamês dócil e miau característico de demonstração.'
  ),
  (
    'd300ca72-0000-4000-a000-000000000002', v_demo_id, 'Simba (Demo)', 'SRD / Amarelo Tigrado', '2021-07-15', 'macho',
    'Laranja tigrado com listras brancas no peito', '982000999000002', true, 'Visto perto do parque municipal usando coleira vermelha.',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80',
    'Demo Guardian Tutor', '+55 11 98888-7771', 'demo@catguardian.dev', 'Felino laranja tigrado ativo em modo de resgate emergencial.'
  ),
  (
    'd300ca73-0000-4000-a000-000000000003', v_demo_id, 'Luna (Demo)', 'Escama de Tartaruga (Tortoiseshell)', '2023-01-20', 'fêmea',
    'Preto e alaranjado mesclado estilo tartaruga', '982000999000003', false, NULL,
    'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=600&q=80',
    'Demo Guardian Tutor', '+55 11 98888-7771', 'demo@catguardian.dev', 'Gata carinhosa e quieta para ambiente de teste.'
  )
  ON CONFLICT (id) DO UPDATE SET
    owner_id = EXCLUDED.owner_id,
    is_lost = EXCLUDED.is_lost,
    lost_notes = EXCLUDED.lost_notes,
    owner_name = EXCLUDED.owner_name,
    owner_email = EXCLUDED.owner_email;
END $$;
