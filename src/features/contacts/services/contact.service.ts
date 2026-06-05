import { supabase } from '@/integrations/supabase/client';
import type { Contact } from '../models/contact.types';

const CONTACT_COLUMNS =
  'id, name, email, phone, subject, message, contact_type, status, created_at';

export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select(CONTACT_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Contact[];
}

export async function updateContactStatus(id: string, status: string): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .update({ status })
    .eq('id', id)
    .select(CONTACT_COLUMNS)
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw error;
}
