-- Create a security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Update all policies to use the security definer function
-- Update profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

-- Update company_info policies
DROP POLICY IF EXISTS "Admins can manage company info" ON public.company_info;

CREATE POLICY "Admins can manage company info" 
ON public.company_info 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Update dogs policies  
DROP POLICY IF EXISTS "Admins can manage dogs" ON public.dogs;

CREATE POLICY "Admins can manage dogs" 
ON public.dogs 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Update other tables
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can manage documents" ON public.documents; 
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage glossary" ON public.glossary;
DROP POLICY IF EXISTS "Admins can manage news" ON public.news;
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can view contacts" ON public.contacts;

CREATE POLICY "Admins can manage articles" 
ON public.articles 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage documents" 
ON public.documents 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage events" 
ON public.events 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage glossary" 
ON public.glossary 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage news" 
ON public.news 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage team members" 
ON public.team_members 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can view contacts" 
ON public.contacts 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');