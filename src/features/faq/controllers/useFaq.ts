import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as faqService from '../services/faq.service';
import type { FAQ, FAQFormData } from '../models/faq.types';

const FAQS_KEY = ['faqs'];

export function useFaq() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: faqs = [], isLoading, error: queryError } = useQuery({
    queryKey: FAQS_KEY,
    queryFn: faqService.getFaqs,
  });

  const error = queryError instanceof Error ? queryError.message : null;

  const createMutation = useMutation({
    mutationFn: (input: FAQFormData) => faqService.createFaq(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAQS_KEY });
      toast({ title: 'Sucesso', description: 'FAQ criado com sucesso!' });
    },
    onError: (err: Error) =>
      toast({ variant: 'destructive', title: 'Erro ao criar FAQ', description: err.message }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<FAQFormData>) =>
      faqService.updateFaq(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAQS_KEY });
      toast({ title: 'Sucesso', description: 'FAQ atualizado com sucesso!' });
    },
    onError: (err: Error) =>
      toast({ variant: 'destructive', title: 'Erro ao atualizar FAQ', description: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => faqService.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAQS_KEY });
      toast({ title: 'Sucesso', description: 'FAQ excluído com sucesso!' });
    },
    onError: (err: Error) =>
      toast({ variant: 'destructive', title: 'Erro ao excluir FAQ', description: err.message }),
  });

  const createFaq = (input: FAQFormData): Promise<FAQ> =>
    createMutation.mutateAsync(input);

  const updateFaq = (id: string, input: Partial<FAQFormData>): Promise<FAQ> =>
    updateMutation.mutateAsync({ id, ...input });

  const deleteFaq = (id: string): Promise<void> =>
    deleteMutation.mutateAsync(id);

  const refetch = () => queryClient.invalidateQueries({ queryKey: FAQS_KEY });

  return {
    faqs,
    isLoading,
    error,
    createFaq,
    updateFaq,
    deleteFaq,
    refetch,
    getDraftCount: faqService.getDraftCount,
  };
}
