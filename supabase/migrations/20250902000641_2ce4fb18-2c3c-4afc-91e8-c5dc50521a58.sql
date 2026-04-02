-- Add sample images to existing puppies
UPDATE public.puppies 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=400&fit=crop&crop=face'
]
WHERE breed = 'australian_shepherd' AND (images IS NULL OR images = '{}');

UPDATE public.puppies 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400&h=400&fit=crop&crop=face'
]
WHERE breed = 'pomeranian' AND (images IS NULL OR images = '{}');

UPDATE public.puppies 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face'
]
WHERE breed = 'rottweiler' AND (images IS NULL OR images = '{}');