import type { Json } from '@/integrations/supabase/types';

// Redes sociais (estrutura usada no formulário/admin)
export interface SocialMedia {
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
}

// Entidade de informações da empresa (tabela `company_info`)
export interface CompanyInfo {
  id: string;
  name: string;
  slogan: string | null;
  mission: string | null;
  vision: string | null;
  values: string | null;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  social_media: Json | null;
  created_at: string;
  updated_at: string;
}

// Payload aceito no upsert (admin) — campos parciais.
export type CompanyInfoInput = Partial<Omit<CompanyInfo, 'created_at' | 'updated_at'>>;
