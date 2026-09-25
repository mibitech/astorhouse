import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert } from '@/integrations/supabase/types';
import type { TeamMember, TeamMemberFormData } from '../models/team.types';

const COLUMNS = 'id, name, position, bio, photo_url, is_active, order_index, created_at, updated_at';

export async function getActiveTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select(COLUMNS)
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return (data ?? []) as TeamMember[];
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select(COLUMNS)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return (data ?? []) as TeamMember[];
}

export async function createTeamMember(input: TeamMemberFormData): Promise<TeamMember> {
  const { data, error } = await supabase
    .from('team_members')
    .insert(input as TablesInsert<'team_members'>)
    .select(COLUMNS)
    .single();

  if (error) throw error;
  return data as TeamMember;
}

export async function updateTeamMember(id: string, input: Partial<TeamMemberFormData>): Promise<TeamMember> {
  const { data, error } = await supabase
    .from('team_members')
    .update(input)
    .eq('id', id)
    .select(COLUMNS)
    .single();

  if (error) throw error;
  return data as TeamMember;
}

// Soft delete — mantém histórico (is_active = false).
export async function deactivateTeamMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}
