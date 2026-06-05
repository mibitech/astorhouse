import { supabase } from '@/integrations/supabase/client';
import { hotelPackageSchema, type HotelPackage, type HotelPackageInput } from '../models/hotel.types';

const HOTEL_COLUMNS =
  'id, name, description, price, is_popular, features, is_active, display_order, created_at, updated_at';

// Pacotes ativos (vitrine pública), ordenados por display_order.
export async function getActivePackages(): Promise<HotelPackage[]> {
  const { data, error } = await supabase
    .from('hotel_packages')
    .select(HOTEL_COLUMNS)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data ?? []) as HotelPackage[];
}

// Todos os pacotes (painel admin).
export async function getAllPackages(): Promise<HotelPackage[]> {
  const { data, error } = await supabase
    .from('hotel_packages')
    .select(HOTEL_COLUMNS)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data ?? []) as HotelPackage[];
}

export async function createPackage(input: HotelPackageInput): Promise<HotelPackage> {
  const payload = hotelPackageSchema.parse(input);
  const { data, error } = await supabase
    .from('hotel_packages')
    .insert([payload])
    .select(HOTEL_COLUMNS)
    .single();

  if (error) throw error;
  return data as HotelPackage;
}

export async function updatePackage(
  id: string,
  input: Partial<HotelPackageInput>,
): Promise<HotelPackage> {
  const payload = hotelPackageSchema.partial().parse(input);
  const { data, error } = await supabase
    .from('hotel_packages')
    .update(payload)
    .eq('id', id)
    .select(HOTEL_COLUMNS)
    .single();

  if (error) throw error;
  return data as HotelPackage;
}

export async function deletePackage(id: string): Promise<void> {
  const { error } = await supabase.from('hotel_packages').delete().eq('id', id);
  if (error) throw error;
}
