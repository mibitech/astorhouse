import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HotelPackage {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_popular: boolean;
  features: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useHotelPackages = () => {
  return useQuery({
    queryKey: ['hotel-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotel_packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as HotelPackage[];
    },
  });
};

export const useAllHotelPackages = () => {
  return useQuery({
    queryKey: ['all-hotel-packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotel_packages')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as HotelPackage[];
    },
  });
};

export const useCreateHotelPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (packageData: Omit<HotelPackage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('hotel_packages')
        .insert([packageData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-packages'] });
      queryClient.invalidateQueries({ queryKey: ['all-hotel-packages'] });
      toast.success('Pacote criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar pacote: ' + error.message);
    },
  });
};

export const useUpdateHotelPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...packageData }: Partial<HotelPackage> & { id: string }) => {
      const { data, error } = await supabase
        .from('hotel_packages')
        .update(packageData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-packages'] });
      queryClient.invalidateQueries({ queryKey: ['all-hotel-packages'] });
      toast.success('Pacote atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar pacote: ' + error.message);
    },
  });
};

export const useDeleteHotelPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hotel_packages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotel-packages'] });
      queryClient.invalidateQueries({ queryKey: ['all-hotel-packages'] });
      toast.success('Pacote excluído com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir pacote: ' + error.message);
    },
  });
};
