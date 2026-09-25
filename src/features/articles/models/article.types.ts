import * as z from 'zod';

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  category: string | null;
  image_url: string | null;
  is_published: boolean | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export const articleSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  excerpt: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  is_published: z.boolean().default(false),
  tags: z.array(z.string()).nullable().optional(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;

export const articleCategories = [
  { value: 'saude', label: 'Saúde' },
  { value: 'adestramento', label: 'Adestramento' },
  { value: 'comportamento', label: 'Comportamento' },
  { value: 'nutricao', label: 'Nutrição' },
  { value: 'filhotes', label: 'Filhotes' },
  { value: 'racas', label: 'Raças' },
  { value: 'dicas', label: 'Dicas' },
  { value: 'geral', label: 'Geral' },
] as const;
