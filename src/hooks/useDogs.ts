import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dog } from '@/types/dog';
import { toast } from 'sonner';

interface UseDogsReturn {
  dogs: Dog[];
  loading: boolean;
  error: string | null;
  createDog: (dog: Omit<Dog, 'id' | 'created_at' | 'updated_at'>) => Promise<Dog | null>;
  updateDog: (id: string, updates: Partial<Dog>) => Promise<Dog | null>;
  deleteDog: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export const useDogs = (): UseDogsReturn => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('dogs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setDogs((data || []) as Dog[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar cães';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createDog = async (dogData: Omit<Dog, 'id' | 'created_at' | 'updated_at'>): Promise<Dog | null> => {
    try {
      const { data, error: createError } = await supabase
        .from('dogs')
        .insert([dogData])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      if (data) {
        setDogs(prev => [data as Dog, ...prev]);
        toast.success('Cão cadastrado com sucesso!');
        return data as Dog;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar cão';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  const updateDog = async (id: string, updates: Partial<Dog>): Promise<Dog | null> => {
    try {
      const { data, error: updateError } = await supabase
        .from('dogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (data) {
        setDogs(prev => prev.map(dog => dog.id === id ? data as Dog : dog));
        toast.success('Cão atualizado com sucesso!');
        return data as Dog;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar cão';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  const deleteDog = async (id: string): Promise<boolean> => {
    try {
      // Soft delete - mark as inactive instead of actual deletion
      const { error: deleteError } = await supabase
        .from('dogs')
        .update({ is_active: false })
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setDogs(prev => prev.filter(dog => dog.id !== id));
      toast.success('Cão removido com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover cão';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const refetch = async () => {
    await fetchDogs();
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  return {
    dogs,
    loading,
    error,
    createDog,
    updateDog,
    deleteDog,
    refetch
  };
};

// Hook for filtering dogs by breed
export const useDogsByBreed = (breed?: string) => {
  const { dogs, loading, error, refetch } = useDogs();
  
  const filteredDogs = breed 
    ? dogs.filter(dog => dog.breed === breed)
    : dogs;

  return {
    dogs: filteredDogs,
    loading,
    error,
    refetch
  };
};