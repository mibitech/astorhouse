import { supabase } from '@/integrations/supabase/client';
import type { Puppy, PuppyFormData } from '../models/puppy.types';

const PUPPY_COLUMNS =
  'id, name, breed, age, birth_date, color, gender, status, weight, height, image_url, images, ' +
  'description, temperament, health_status, vaccination_status, microchip, pedigree, achievements, ' +
  'parents, medical_records, created_at, updated_at, is_active, is_available_for_sale, price, notes';

export async function getActivePuppies(): Promise<Puppy[]> {
  const { data, error } = await supabase
    .from('puppies')
    .select(PUPPY_COLUMNS)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Puppy[];
}

export async function createPuppy(input: PuppyFormData): Promise<Puppy> {
  const { data, error } = await supabase
    .from('puppies')
    .insert([input])
    .select(PUPPY_COLUMNS)
    .single();

  if (error) throw error;
  return data as Puppy;
}

export async function updatePuppy(id: string, updates: Partial<Puppy>): Promise<Puppy | null> {
  const { data, error } = await supabase
    .from('puppies')
    .update(updates)
    .eq('id', id)
    .select(PUPPY_COLUMNS)
    .maybeSingle();

  if (error) throw error;
  return (data as Puppy | null) ?? null;
}

// Exclusão é soft delete (is_active = false) — regra de negócio do projeto.
export async function deactivatePuppy(id: string): Promise<void> {
  const { error } = await supabase.from('puppies').update({ is_active: false }).eq('id', id);
  if (error) throw error;
}
