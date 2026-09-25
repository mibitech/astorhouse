import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as companyService from '../services/company.service';
import type { CompanyInfoInput } from '../models/company.types';

const COMPANY_KEY = ['company-info'];

export const useCompanyInfo = () =>
  useQuery({ queryKey: COMPANY_KEY, queryFn: companyService.getCompanyInfo });

export const useUpdateCompanyInfo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (companyInfo: CompanyInfoInput) => companyService.upsertCompanyInfo(companyInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_KEY });
      toast({
        title: 'Sucesso',
        description: 'Informações da empresa atualizadas com sucesso',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
