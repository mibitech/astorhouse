import { supabase } from '@/integrations/supabase/client';
import { articleSchema, type Article, type ArticleFormData } from '../models/article.types';

const ARTICLE_COLUMNS = 'id, title, content, excerpt, category, image_url, is_published, tags, created_at, updated_at';

export async function getPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_COLUMNS)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Article[];
}

export async function getAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Article[];
}

export async function createArticle(input: ArticleFormData): Promise<Article> {
  const payload = articleSchema.parse(input);
  const { data, error } = await supabase
    .from('articles')
    .insert(payload)
    .select(ARTICLE_COLUMNS)
    .single();

  if (error) throw error;
  return data as Article;
}

export async function updateArticle(id: string, input: Partial<ArticleFormData>): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .update(input)
    .eq('id', id)
    .select(ARTICLE_COLUMNS)
    .single();

  if (error) throw error;
  return data as Article;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
}
