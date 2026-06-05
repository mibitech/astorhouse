import * as z from 'zod';

// Entidade FAQ (tabela `faq` no Supabase)
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

// Schema de validação compartilhado entre form (View) e service (Model)
export const faqSchema = z.object({
  question: z.string().min(1, 'Pergunta é obrigatória'),
  answer: z.string().min(1, 'Resposta é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  is_published: z.boolean().default(true),
  order_index: z.number().min(0).default(0),
});

export type FAQFormData = z.infer<typeof faqSchema>;

// Payload de criação aceito pelo service
export type FAQInput = Omit<FAQ, 'id' | 'created_at' | 'updated_at'>;

// Categorias exibidas na vitrine pública (inclui o filtro "Todas")
export const publicFaqCategories = [
  { value: 'all', label: 'Todas as Categorias' },
  { value: 'filhotes', label: 'Filhotes' },
  { value: 'caes', label: 'Cães Adultos' },
  { value: 'adestramento', label: 'Adestramento' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'criacao', label: 'Criação' },
  { value: 'saude', label: 'Saúde' },
  { value: 'geral', label: 'Geral' },
] as const;

// Categorias disponíveis no cadastro (painel admin)
export const faqManagementCategories = [
  { value: 'filhotes', label: 'Filhotes' },
  { value: 'adestramento', label: 'Adestramento' },
  { value: 'hospedagem', label: 'Hospedagem' },
  { value: 'geral', label: 'Geral' },
] as const;
