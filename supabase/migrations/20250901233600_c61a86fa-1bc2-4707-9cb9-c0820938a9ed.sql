-- Update the current logged in user to be admin
-- First, make sure the profiles table has the user
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '346d5626-afc3-40f1-921d-dc27ab1471d5',
  'rlcunha@gmail.com',
  'Ricardo Lopes',
  'admin'
)
ON CONFLICT (id) 
DO UPDATE SET role = 'admin', updated_at = now();