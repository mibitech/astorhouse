import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as hotelService from '../services/hotel.service';
import type { HotelPackage, HotelPackageInput } from '../models/hotel.types';

const ACTIVE_KEY = ['hotel-packages'];
const ALL_KEY = ['all-hotel-packages'];

// Pacotes ativos (vitrine pública)
export const useHotelPackages = () =>
  useQuery({ queryKey: ACTIVE_KEY, queryFn: hotelService.getActivePackages });

// Todos os pacotes (painel admin)
export const useAllHotelPackages = () =>
  useQuery({ queryKey: ALL_KEY, queryFn: hotelService.getAllPackages });

export const useCreateHotelPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (packageData: HotelPackageInput) => hotelService.createPackage(packageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_KEY });
      toast.success('Pacote criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar pacote: ' + error.message);
    },
  });
};

export const useUpdateHotelPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...packageData }: Partial<HotelPackage> & { id: string }) =>
      hotelService.updatePackage(id, packageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_KEY });
      toast.success('Pacote atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar pacote: ' + error.message);
    },
  });
};

export const useDeleteHotelPackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hotelService.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_KEY });
      toast.success('Pacote excluído com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao excluir pacote: ' + error.message);
    },
  });
};
