import { supabase } from '@/integrations/supabase/client';
import type { CompanyInfo, CompanyInfoInput } from '../models/company.types';

const COMPANY_COLUMNS =
  'id, name, slogan, mission, vision, values, logo_url, phone, email, address, social_media, created_at, updated_at';

export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  const { data, error } = await supabase
    .from('company_info')
    .select(COMPANY_COLUMNS)
    .maybeSingle();

  if (error) throw error;
  return (data as CompanyInfo | null) ?? null;
}

export async function upsertCompanyInfo(input: CompanyInfoInput): Promise<CompanyInfo> {
  const { data, error } = await supabase
    .from('company_info')
    .upsert(input)
    .select(COMPANY_COLUMNS)
    .single();

  if (error) throw error;
  return data as CompanyInfo;
}
