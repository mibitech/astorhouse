-- Set the current user as admin to access the management features
-- First, ensure the user has a profile record
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '346d5626-afc3-40f1-921d-dc27ab1471d5',
  'rlcunha@gmail.com', 
  'Ricardo Lopes',
  'admin'
)
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';