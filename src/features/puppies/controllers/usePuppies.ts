import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as puppyService from '../services/puppy.service';
import type { Puppy, PuppyFormData } from '../models/puppy.types';

const PUPPIES_KEY = ['puppies'];

export const usePuppies = () => {
  const queryClient = useQueryClient();

  const { data: puppies = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: PUPPIES_KEY,
    queryFn: puppyService.getActivePuppies,
  });

  const error = queryError instanceof Error ? queryError.message : null;

  const createMutation = useMutation({
    mutationFn: (puppy: PuppyFormData) => puppyService.createPuppy(puppy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUPPIES_KEY });
      toast.success('Filhote criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar filhote'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<Puppy>) =>
      puppyService.updatePuppy(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUPPIES_KEY });
      toast.success('Filhote atualizado com sucesso!');
    },
    onError: (err: Error) => toast.error('Erro ao atualizar filhote: ' + err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => puppyService.deactivatePuppy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUPPIES_KEY });
      toast.success('Filhote excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir filhote'),
  });

  const createPuppy = async (puppy: PuppyFormData): Promise<Puppy | null> => {
    try {
      return await createMutation.mutateAsync(puppy);
    } catch {
      return null;
    }
  };

  const updatePuppy = async (id: string, updates: Partial<Puppy>): Promise<Puppy | null> => {
    try {
      const result = await updateMutation.mutateAsync({ id, ...updates });
      if (!result) {
        toast.error('Filhote não encontrado ou sem permissão para atualizar');
      }
      return result;
    } catch {
      return null;
    }
  };

  const deletePuppy = async (id: string): Promise<boolean> => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  const refetch = () => queryClient.invalidateQueries({ queryKey: PUPPIES_KEY });

  return { puppies, loading, error, createPuppy, updatePuppy, deletePuppy, refetch };
};

export const usePuppiesByBreed = (breed?: string) => {
  const { puppies, loading, error, refetch } = usePuppies();
  const filteredPuppies = breed ? puppies.filter((puppy) => puppy.breed === breed) : puppies;
  return { puppies: filteredPuppies, loading, error, refetch };
};
