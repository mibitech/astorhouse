-- Create storage buckets for dog and puppy images
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('dog-images', 'dog-images', true),
  ('puppy-images', 'puppy-images', true);

-- Create RLS policies for dog images bucket
CREATE POLICY "Public access to dog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'dog-images');

CREATE POLICY "Admins can upload dog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'dog-images' AND is_admin());

CREATE POLICY "Admins can update dog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'dog-images' AND is_admin());

CREATE POLICY "Admins can delete dog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'dog-images' AND is_admin());

-- Create RLS policies for puppy images bucket
CREATE POLICY "Public access to puppy images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'puppy-images');

CREATE POLICY "Admins can upload puppy images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'puppy-images' AND is_admin());

CREATE POLICY "Admins can update puppy images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'puppy-images' AND is_admin());

CREATE POLICY "Admins can delete puppy images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'puppy-images' AND is_admin());