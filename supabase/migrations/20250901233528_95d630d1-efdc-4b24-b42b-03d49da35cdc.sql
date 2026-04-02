-- Update function with proper search path to fix security warnings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$function$;

-- Update the other function as well
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Create security definer function to check user roles safely
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = user_id),
    false
  );
$$;

-- Update all policies to use the new function instead of direct queries
-- This prevents infinite recursion

-- Update profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin());

-- Update all other table policies
DROP POLICY IF EXISTS "Admins can manage company info" ON public.company_info;
DROP POLICY IF EXISTS "Admins can manage dogs" ON public.dogs;
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can manage documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage glossary" ON public.glossary;
DROP POLICY IF EXISTS "Admins can manage news" ON public.news;
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can view contacts" ON public.contacts;

CREATE POLICY "Admins can manage company info" 
ON public.company_info 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage dogs" 
ON public.dogs 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage articles" 
ON public.articles 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage documents" 
ON public.documents 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage events" 
ON public.events 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage glossary" 
ON public.glossary 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage news" 
ON public.news 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage team members" 
ON public.team_members 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can view contacts" 
ON public.contacts 
FOR SELECT 
USING (public.is_admin());