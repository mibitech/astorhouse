import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import * as puppyService from '../services/puppy.service';
import type { Puppy, PuppyFormData } from '../models/puppy.types';

export const usePuppies = () => {
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPuppies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await puppyService.getActivePuppies();
      setPuppies(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar filhotes';
      setError(message);
      toast.error('Erro ao carregar filhotes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPuppy = useCallback(async (puppy: PuppyFormData): Promise<Puppy | null> => {
    try {
      const created = await puppyService.createPuppy(puppy);
      setPuppies((prev) => [created, ...prev]);
      toast.success('Filhote criado com sucesso!');
      return created;
    } catch {
      toast.error('Erro ao criar filhote');
      return null;
    }
  }, []);

  const updatePuppy = useCallback(
    async (id: string, updates: Partial<Puppy>): Promise<Puppy | null> => {
      try {
        const updated = await puppyService.updatePuppy(id, updates);
        if (!updated) {
          toast.error('Filhote não encontrado ou sem permissão para atualizar');
          return null;
        }
        setPuppies((prev) => prev.map((puppy) => (puppy.id === id ? updated : puppy)));
        toast.success('Filhote atualizado com sucesso!');
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'erro inesperado';
        toast.error('Erro ao atualizar filhote: ' + message);
        return null;
      }
    },
    [],
  );

  const deletePuppy = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await puppyService.deactivatePuppy(id);
        await fetchPuppies(); // refetch garante consistência
        toast.success('Filhote excluído com sucesso!');
        return true;
      } catch {
        toast.error('Erro ao excluir filhote');
        return false;
      }
    },
    [fetchPuppies],
  );

  useEffect(() => {
    fetchPuppies();
  }, [fetchPuppies]);

  return { puppies, loading, error, createPuppy, updatePuppy, deletePuppy, refetch: fetchPuppies };
};

export const usePuppiesByBreed = (breed?: string) => {
  const { puppies, loading, error, refetch } = usePuppies();
  const filteredPuppies = breed ? puppies.filter((puppy) => puppy.breed === breed) : puppies;
  return { puppies: filteredPuppies, loading, error, refetch };
};
