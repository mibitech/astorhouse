import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as articleService from '../services/article.service';
import type { ArticleFormData } from '../models/article.types';

const PUBLISHED_KEY = ['articles', 'published'];
const ALL_KEY = ['articles', 'all'];

export const usePublishedArticles = () =>
  useQuery({ queryKey: PUBLISHED_KEY, queryFn: articleService.getPublishedArticles });

export const useAllArticles = () =>
  useQuery({ queryKey: ALL_KEY, queryFn: articleService.getAllArticles });

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: ArticleFormData) => articleService.createArticle(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLISHED_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_KEY });
      toast({ title: 'Sucesso', description: 'Artigo criado com sucesso!' });
    },
    onError: (err: Error) =>
      toast({ variant: 'destructive', title: 'Erro ao criar artigo', description: err.message }),
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<ArticleFormData>) =>
      articleService.updateArticle(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLISHED_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_KEY });
      toast({ title: 'Sucesso', description: 'Artigo atualizado com sucesso!' });
    },
    onError: (err: Error) =>
      toast({ variant: 'destructive', title: 'Erro ao atualizar artigo', description: err.message }),
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => articleService.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLISHED_KEY });
      queryClient.invalidateQueries({ queryKey: ALL_KEY });
      toast({ title: 'Sucesso', description: 'Artigo excluído com sucesso!' });
    },
    onError: (err: Error) =>
      toast({ variant: 'destructive', title: 'Erro ao excluir artigo', description: err.message }),
  });
};
