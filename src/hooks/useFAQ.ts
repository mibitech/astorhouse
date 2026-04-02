import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
  order_index: number;
  source?: string;
  created_at: string;
  updated_at: string;
}

export function useFAQ() {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFAQs(data || []);
    } catch (error: any) {
      // Silently fail - don't show error toast to users
      console.error('Error fetching FAQs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const createFAQ = async (faqData: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('faq')
        .insert(faqData)
        .select()
        .single();

      if (error) throw error;

      setFAQs(prev => [...prev, data]);
      toast({
        title: "Sucesso",
        description: "FAQ criado com sucesso!"
      });
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar FAQ",
        description: error.message
      });
      throw error;
    }
  };

  const updateFAQ = async (id: string, faqData: Partial<FAQ>) => {
    try {
      const { data, error } = await supabase
        .from('faq')
        .update(faqData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setFAQs(prev => prev.map(faq => 
        faq.id === id ? data : faq
      ));
      toast({
        title: "Sucesso",
        description: "FAQ atualizado com sucesso!"
      });
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar FAQ",
        description: error.message
      });
      throw error;
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faq')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFAQs(prev => prev.filter(faq => faq.id !== id));
      toast({
        title: "Sucesso",
        description: "FAQ excluído com sucesso!"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir FAQ",
        description: error.message
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const getDraftCount = async (): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('faq')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', false);

      if (error) throw error;
      return count || 0;
    } catch (error: any) {
      console.error('Error fetching draft count:', error.message);
      return 0;
    }
  };

  return {
    faqs,
    loading,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    refetch: fetchFAQs,
    getDraftCount
  };
}