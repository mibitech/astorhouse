import { supabase } from '@/integrations/supabase/client';
import { faqSchema, type FAQ, type FAQFormData } from '../models/faq.types';

// Colunas explícitas — evita select('*') (ver rules/security.md)
const FAQ_COLUMNS =
  'id, question, answer, category, is_published, order_index, source, created_at, updated_at';

export async function getFaqs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from('faq')
    .select(FAQ_COLUMNS)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return (data ?? []) as FAQ[];
}

export async function createFaq(input: FAQFormData): Promise<FAQ> {
  const payload = faqSchema.parse(input); // valida antes de persistir
  const { data, error } = await supabase
    .from('faq')
    .insert(payload)
    .select(FAQ_COLUMNS)
    .single();

  if (error) throw error;
  return data as FAQ;
}

export async function updateFaq(id: string, input: Partial<FAQFormData>): Promise<FAQ> {
  const payload = faqSchema.partial().parse(input);
  const { data, error } = await supabase
    .from('faq')
    .update(payload)
    .eq('id', id)
    .select(FAQ_COLUMNS)
    .single();

  if (error) throw error;
  return data as FAQ;
}

// FAQ não possui coluna is_active — exclusão é física (comportamento preservado do legado).
export async function deleteFaq(id: string): Promise<void> {
  const { error } = await supabase.from('faq').delete().eq('id', id);
  if (error) throw error;
}

export async function getDraftCount(): Promise<number> {
  const { count, error } = await supabase
    .from('faq')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', false);

  if (error) {
    console.error('Error fetching draft count:', error.message);
    return 0;
  }
  return count ?? 0;
}
