-- Migration: estrutura a tabela "Leads" (funil de leads / vendas)
-- Aditiva e idempotente. A tabela "Leads" tem L maiúsculo (criada com aspas),
-- então TODA referência precisa ser entre aspas: "Leads".
--
-- Mantém id_conversa (PK atual) e nome para não quebrar o writer existente
-- (registrar-lead.sh, que insere com a chave anon).

-- Reset-safe: garante a tabela base se rodar em um banco limpo.
CREATE TABLE IF NOT EXISTS "Leads" (
  id_conversa  text PRIMARY KEY,
  nome         text NOT NULL,
  created_at   timestamptz DEFAULT now()
);

-- Novas colunas (aditivas)
ALTER TABLE "Leads" ADD COLUMN IF NOT EXISTS id             uuid DEFAULT gen_random_uuid();
ALTER TABLE "Leads" ADD COLUMN IF NOT EXISTS telefone       text;
ALTER TABLE "Leads" ADD COLUMN IF NOT EXISTS email          text;
ALTER TABLE "Leads" ADD COLUMN IF NOT EXISTS origem         text;          -- whatsapp, site, instagram, indicacao...
ALTER TABLE "Leads" ADD COLUMN IF NOT EXISTS tipo_interesse text;          -- filhote, nova_ninhada, reserva, lista_espera, adestramento, hotel, reproducao, outro
ALTER TABLE "Leads" ADD COLUMN IF NOT EXISTS status         text DEFAULT 'novo';
ALTER TABLE "Leads" ADD COLUMN IF NOT EXISTS puppy_id       uuid REFERENCES puppies(id) ON DELETE SET NULL;
ALTER TABLE "Leads" ADD COLUMN IF NOT EXISTS convertido_em  timestamptz;
ALTER TABLE "Leads" ADD COLUMN IF NOT EXISTS observacao     text;
ALTER TABLE "Leads" ADD COLUMN IF NOT EXISTS updated_at     timestamptz DEFAULT now();

-- Garante id único mesmo sem ser PK (a PK segue sendo id_conversa)
CREATE UNIQUE INDEX IF NOT EXISTS uq_leads_id ON "Leads"(id);

-- Enum de status do funil
ALTER TABLE "Leads" DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE "Leads" ADD CONSTRAINT leads_status_check
  CHECK (status IN ('novo','em_andamento','convertido','perdido','cancelado'));

-- Índices de consulta
CREATE INDEX IF NOT EXISTS idx_leads_status ON "Leads"(status);
CREATE INDEX IF NOT EXISTS idx_leads_puppy  ON "Leads"(puppy_id);

-- Observação: as policies de RLS da tabela "Leads" (insert via anon, etc.) são
-- gerenciadas separadamente e não são alteradas por esta migration.
