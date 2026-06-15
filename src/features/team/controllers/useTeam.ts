import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as teamService from '../services/team.service';
import type { TeamMemberFormData } from '../models/team.types';

const ACTIVE_KEY = ['team-members', 'active'];
const ALL_KEY = ['team-members', 'all'];

export const useActiveTeamMembers = () =>
  useQuery({ queryKey: ACTIVE_KEY, queryFn: teamService.getActiveTeamMembers });

export const useAllTeamMembers = () =>
  useQuery({ queryKey: ALL_KEY, queryFn: teamService.getAllTeamMembers });

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: TeamMemberFormData) => teamService.createTeamMember(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_KEY });
      toast({ title: 'Sucesso', description: 'Membro cadastrado com sucesso!' });
    },
    onError: (err: Error) =>
      toast({ variant: 'destructive', title: 'Erro ao cadastrar membro', description: err.message }),
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<TeamMemberFormData>) =>
      teamService.updateTeamMember(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_KEY });
      toast({ title: 'Sucesso', description: 'Membro atualizado com sucesso!' });
    },
    onError: (err: Error) =>
      toast({ variant: 'destructive', title: 'Erro ao atualizar membro', description: err.message }),
  });
};

export const useDeactivateTeamMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => teamService.deactivateTeamMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_KEY });
      toast({ title: 'Sucesso', description: 'Membro desativado com sucesso!' });
    },
    onError: (err: Error) =>
      toast({ variant: 'destructive', title: 'Erro ao desativar membro', description: err.message }),
  });
};
