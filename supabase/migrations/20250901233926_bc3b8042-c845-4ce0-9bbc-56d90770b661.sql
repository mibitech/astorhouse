-- Create puppies table with similar structure to dogs but specific for puppy management
CREATE TABLE public.puppies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  breed TEXT NOT NULL CHECK (breed IN ('australian_shepherd', 'pomeranian', 'rottweiler')),
  age TEXT NOT NULL,
  birth_date DATE NOT NULL,
  color TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  status TEXT NOT NULL CHECK (status IN ('disponivel', 'reservado', 'vendido', 'nao_disponivel')),
  weight NUMERIC NOT NULL CHECK (weight > 0),
  height NUMERIC NOT NULL CHECK (height > 0),
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  temperament TEXT NOT NULL,
  health_status TEXT NOT NULL,
  vaccination_status TEXT NOT NULL,
  microchip TEXT,
  pedigree TEXT,
  achievements TEXT[] DEFAULT '{}',
  parents JSONB DEFAULT '{}',
  medical_records JSONB DEFAULT '{}',
  price NUMERIC,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_available_for_sale BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.puppies ENABLE ROW LEVEL SECURITY;

-- Create policies for puppies
CREATE POLICY "Puppies are publicly readable"
ON public.puppies
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage puppies"
ON public.puppies
FOR ALL
USING (is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_puppies_updated_at
  BEFORE UPDATE ON public.puppies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();