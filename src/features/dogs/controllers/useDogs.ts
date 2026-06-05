import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import * as dogService from '../services/dog.service';
import type { Dog, DogFormData } from '../models/dog.types';

export const useDogs = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dogService.getActiveDogs();
      setDogs(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar cães';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDog = useCallback(async (dogData: DogFormData): Promise<Dog | null> => {
    try {
      const created = await dogService.createDog(dogData);
      setDogs((prev) => [created, ...prev]);
      toast.success('Cão cadastrado com sucesso!');
      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar cão';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  const updateDog = useCallback(async (id: string, updates: Partial<Dog>): Promise<Dog | null> => {
    try {
      const updated = await dogService.updateDog(id, updates);
      setDogs((prev) => prev.map((dog) => (dog.id === id ? updated : dog)));
      toast.success('Cão atualizado com sucesso!');
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar cão';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  const deleteDog = useCallback(async (id: string): Promise<boolean> => {
    try {
      await dogService.deactivateDog(id);
      setDogs((prev) => prev.filter((dog) => dog.id !== id));
      toast.success('Cão removido com sucesso!');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover cão';
      setError(message);
      toast.error(message);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  return { dogs, loading, error, createDog, updateDog, deleteDog, refetch: fetchDogs };
};

export const useDogsByBreed = (breed?: string) => {
  const { dogs, loading, error, refetch } = useDogs();
  const filteredDogs = breed ? dogs.filter((dog) => dog.breed === breed) : dogs;
  return { dogs: filteredDogs, loading, error, refetch };
};
