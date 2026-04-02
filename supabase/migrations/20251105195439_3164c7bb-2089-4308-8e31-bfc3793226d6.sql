-- Create hotel_packages table for managing hotel accommodation packages
CREATE TABLE public.hotel_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hotel_packages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Hotel packages are publicly readable when active"
ON public.hotel_packages
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage hotel packages"
ON public.hotel_packages
FOR ALL
USING (is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_hotel_packages_updated_at
BEFORE UPDATE ON public.hotel_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data based on current hotel page
INSERT INTO public.hotel_packages (name, description, price, is_popular, features, display_order) VALUES
('Hospedagem Básica', 'Ideal para estadias curtas', 90, true, 
'["Suíte individual", "3 refeições balanceadas", "1 passeios supervisionados", "Acima de 10 dias (R$ 80,00)"]'::jsonb, 1),
('Hospedagem Feriados', 'Ideial para uma viagem despreocupada', 120, false, 
'["3 refeições", "1 passeios diario", "Socialização canina", "Controle de comportamento"]'::jsonb, 2);