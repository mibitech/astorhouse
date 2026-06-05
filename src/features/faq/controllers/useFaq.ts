import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as faqService from '../services/faq.service';
import type { FAQ, FAQFormData } from '../models/faq.types';

// Controller: orquestra estado + service, expõe dados e handlers à View. Sem JSX.
export function useFaq() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchFaqs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await faqService.getFaqs();
      setFaqs(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar FAQs';
      setError(message);
      console.error('Error fetching FAQs:', message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFaq = useCallback(
    async (input: FAQFormData) => {
      try {
        const created = await faqService.createFaq(input);
        setFaqs((prev) => [...prev, created]);
        toast({ title: 'Sucesso', description: 'FAQ criado com sucesso!' });
        return created;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        toast({ variant: 'destructive', title: 'Erro ao criar FAQ', description: message });
        throw err;
      }
    },
    [toast],
  );

  const updateFaq = useCallback(
    async (id: string, input: Partial<FAQFormData>) => {
      try {
        const updated = await faqService.updateFaq(id, input);
        setFaqs((prev) => prev.map((faq) => (faq.id === id ? updated : faq)));
        toast({ title: 'Sucesso', description: 'FAQ atualizado com sucesso!' });
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        toast({ variant: 'destructive', title: 'Erro ao atualizar FAQ', description: message });
        throw err;
      }
    },
    [toast],
  );

  const deleteFaq = useCallback(
    async (id: string) => {
      try {
        await faqService.deleteFaq(id);
        setFaqs((prev) => prev.filter((faq) => faq.id !== id));
        toast({ title: 'Sucesso', description: 'FAQ excluído com sucesso!' });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        toast({ variant: 'destructive', title: 'Erro ao excluir FAQ', description: message });
        throw err;
      }
    },
    [toast],
  );

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  return {
    faqs,
    isLoading,
    error,
    createFaq,
    updateFaq,
    deleteFaq,
    refetch: fetchFaqs,
    getDraftCount: faqService.getDraftCount,
  };
}
