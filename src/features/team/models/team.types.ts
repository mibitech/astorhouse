import * as z from 'zod';

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  photo_url: string | null;
  is_active: boolean | null;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

export const teamMemberSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  position: z.string().min(1, 'Cargo é obrigatório'),
  bio: z.string().nullable().optional(),
  photo_url: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  order_index: z.number().nullable().optional(),
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
