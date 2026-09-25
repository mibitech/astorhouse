import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as dogService from '../services/dog.service';
import type { Dog, DogFormData } from '../models/dog.types';

const DOGS_KEY = ['dogs'];

export const useDogs = () => {
  const queryClient = useQueryClient();

  const { data: dogs = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: DOGS_KEY,
    queryFn: dogService.getActiveDogs,
  });

  const error = queryError instanceof Error ? queryError.message : null;

  const createMutation = useMutation({
    mutationFn: (dogData: DogFormData) => dogService.createDog(dogData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOGS_KEY });
      toast.success('Cão cadastrado com sucesso!');
    },
    onError: (err: Error) => toast.error('Erro ao criar cão: ' + err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<Dog>) =>
      dogService.updateDog(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOGS_KEY });
      toast.success('Cão atualizado com sucesso!');
    },
    onError: (err: Error) => toast.error('Erro ao atualizar cão: ' + err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dogService.deactivateDog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOGS_KEY });
      toast.success('Cão removido com sucesso!');
    },
    onError: (err: Error) => toast.error('Erro ao remover cão: ' + err.message),
  });

  const createDog = async (dogData: DogFormData): Promise<Dog | null> => {
    try {
      return await createMutation.mutateAsync(dogData);
    } catch {
      return null;
    }
  };

  const updateDog = async (id: string, updates: Partial<Dog>): Promise<Dog | null> => {
    try {
      return await updateMutation.mutateAsync({ id, ...updates });
    } catch {
      return null;
    }
  };

  const deleteDog = async (id: string): Promise<boolean> => {
    try {
      await deleteMutation.mutateAsync(id);
      return true;
    } catch {
      return false;
    }
  };

  const refetch = () => queryClient.invalidateQueries({ queryKey: DOGS_KEY });

  return { dogs, loading, error, createDog, updateDog, deleteDog, refetch };
};

export const useDogsByBreed = (breed?: string) => {
  const { dogs, loading, error, refetch } = useDogs();
  const filteredDogs = breed ? dogs.filter((dog) => dog.breed === breed) : dogs;
  return { dogs: filteredDogs, loading, error, refetch };
};
