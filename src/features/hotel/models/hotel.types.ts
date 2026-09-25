import * as z from 'zod';

// Entidade de pacote do hotel (tabela `hotel_packages`)
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

// Validação do payload de escrita (service)
export const hotelPackageSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().nullable().optional(),
  price: z.number(),
  is_popular: z.boolean(),
  features: z.array(z.string()),
  is_active: z.boolean(),
  display_order: z.number(),
});

export type HotelPackageInput = z.infer<typeof hotelPackageSchema>;
