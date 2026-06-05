import { supabase } from '@/integrations/supabase/client';
import type { Dog, DogFormData } from '../models/dog.types';

const DOG_COLUMNS =
  'id, name, breed, age, birth_date, color, gender, status, weight, height, image_url, images, ' +
  'description, temperament, health_status, vaccination_status, microchip, pedigree, achievements, ' +
  'parents, offspring, medical_records, created_at, updated_at, is_active, is_available_for_breeding, price, notes';

export async function getActiveDogs(): Promise<Dog[]> {
  const { data, error } = await supabase
    .from('dogs')
    .select(DOG_COLUMNS)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Dog[];
}

export async function createDog(input: DogFormData): Promise<Dog> {
  const { data, error } = await supabase
    .from('dogs')
    .insert([input])
    .select(DOG_COLUMNS)
    .single();

  if (error) throw error;
  return data as Dog;
}

export async function updateDog(id: string, updates: Partial<Dog>): Promise<Dog> {
  const { data, error } = await supabase
    .from('dogs')
    .update(updates)
    .eq('id', id)
    .select(DOG_COLUMNS)
    .single();

  if (error) throw error;
  return data as Dog;
}

// Exclusão é soft delete (is_active = false) — regra de negócio do projeto.
export async function deactivateDog(id: string): Promise<void> {
  const { error } = await supabase.from('dogs').update({ is_active: false }).eq('id', id);
  if (error) throw error;
}
