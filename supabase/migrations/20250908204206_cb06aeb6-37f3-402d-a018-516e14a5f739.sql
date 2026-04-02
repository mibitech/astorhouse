-- Create FAQ table for P&R (Perguntas e Respostas)
CREATE TABLE public.faq (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'geral'::text,
  is_published BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "FAQ are publicly readable when published" 
ON public.faq 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage FAQ" 
ON public.faq 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_faq_updated_at
BEFORE UPDATE ON public.faq
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();