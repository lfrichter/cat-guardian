-- Migration: Update Gamora Photo URL to Black Cat Image
-- Problem: Gamora (Bombay / Black cat) had a duplicate photo_url pointing to Kiara's tricolor cat image (photo-1514888286974-6c03e2ca1dba).
-- Solution: Update Gamora's photo_url in public.cats to a high-quality black cat Unsplash image.

UPDATE public.cats
SET photo_url = 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=600&q=80',
    updated_at = NOW()
WHERE id = 'a100ca77-0000-4000-a000-000000000007' OR name = 'Gamora';
