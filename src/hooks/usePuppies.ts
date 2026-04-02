import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Puppy } from '@/types/puppy';
import { toast } from 'sonner';

interface UsePuppiesReturn {
  puppies: Puppy[];
  loading: boolean;
  error: string | null;
  createPuppy: (puppy: Omit<Puppy, 'id' | 'created_at' | 'updated_at'>) => Promise<Puppy | null>;
  updatePuppy: (id: string, updates: Partial<Puppy>) => Promise<Puppy | null>;
  deletePuppy: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export const usePuppies = (): UsePuppiesReturn => {
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPuppies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('puppies')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching puppies:', error);
        setError(error.message);
        toast.error('Erro ao carregar filhotes');
        return;
      }

      console.log('Filhotes carregados:', data); // Debug log
      setPuppies((data || []) as Puppy[]);
      setError(null);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Erro inesperado ao carregar filhotes');
      toast.error('Erro inesperado ao carregar filhotes');
    } finally {
      setLoading(false);
    }
  };

  const createPuppy = async (puppy: Omit<Puppy, 'id' | 'created_at' | 'updated_at'>): Promise<Puppy | null> => {
    try {
      const { data, error } = await supabase
        .from('puppies')
        .insert([puppy])
        .select()
        .single();

      if (error) {
        console.error('Error creating puppy:', error);
        toast.error('Erro ao criar filhote');
        return null;
      }

      setPuppies(prev => [data as Puppy, ...prev]);
      toast.success('Filhote criado com sucesso!');
      return data as Puppy;
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Erro inesperado ao criar filhote');
      return null;
    }
  };

  const updatePuppy = async (id: string, updates: Partial<Puppy>): Promise<Puppy | null> => {
    try {
      console.log('Hook updatePuppy chamado com ID:', id);
      console.log('Dados para atualizar:', updates);
      
      const { data, error } = await supabase
        .from('puppies')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating puppy:', error);
        toast.error('Erro ao atualizar filhote: ' + error.message);
        return null;
      }

      if (!data) {
        console.error('Nenhum filhote encontrado com ID:', id);
        toast.error('Filhote não encontrado ou sem permissão para atualizar');
        return null;
      }

      console.log('Filhote atualizado com sucesso:', data);
      setPuppies(prev => prev.map(puppy => puppy.id === id ? data as Puppy : puppy));
      toast.success('Filhote atualizado com sucesso!');
      return data as Puppy;
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Erro inesperado ao atualizar filhote');
      return null;
    }
  };

  const deletePuppy = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('puppies')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting puppy:', error);
        toast.error('Erro ao excluir filhote');
        return false;
      }

      // Refetch data instead of filtering locally to ensure consistency
      await fetchPuppies();
      toast.success('Filhote excluído com sucesso!');
      return true;
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Erro inesperado ao excluir filhote');
      return false;
    }
  };

  const refetch = async () => {
    await fetchPuppies();
  };

  useEffect(() => {
    fetchPuppies();
  }, []);

  return {
    puppies,
    loading,
    error,
    createPuppy,
    updatePuppy,
    deletePuppy,
    refetch,
  };
};

export const usePuppiesByBreed = (breed?: string) => {
  const { puppies, loading, error, refetch } = usePuppies();

  const filteredPuppies = breed 
    ? puppies.filter(puppy => puppy.breed === breed)
    : puppies;

  console.log(`Filhotes filtrados para ${breed}:`, filteredPuppies); // Debug log

  return {
    puppies: filteredPuppies,
    loading,
    error,
    refetch,
  };
};