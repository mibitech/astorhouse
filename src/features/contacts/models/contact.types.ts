// Entidade de contato (tabela `contacts`)
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  contact_type: string;
  status: string;
  created_at: string;
}

// Rótulos dos tipos de contato (exibição no admin)
export const contactTypeLabels: Record<string, string> = {
  general: 'Informações Gerais',
  adoption: 'Adoção de Filhotes',
  training: 'Adestramento',
  breeding: 'Reprodução',
  consultation: 'Consultoria',
};

type BadgeVariant = 'default' | 'secondary' | 'outline';

// Configuração de status do funil de contato
export const contactStatusConfig: Record<string, { variant: BadgeVariant; label: string }> = {
  new: { variant: 'default', label: 'Novo' },
  in_progress: { variant: 'secondary', label: 'Em Andamento' },
  resolved: { variant: 'outline', label: 'Resolvido' },
};
