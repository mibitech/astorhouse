---
name: stack-astorhouse
description: Decisões de stack e estado de migração do AstorHouse — origem Lovable, arquitetura-alvo MVC, deploy e dados compartilhados.
metadata:
  type: feedback
---

Stack e decisões do **AstorHouse**:

- **Origem Lovable**: protótipo gerado no Lovable (`lovable-tagger` em dev). Estrutura legada `src/pages` + `src/hooks` + `src/components/ui` (shadcn). **Arquitetura-alvo = MVC feature-based** (`src/features/*`) das rules — esse modelo **prevalece**; código novo segue MVC.
- **Package manager**: o **modelo manda `pnpm`**. O repo ainda carrega lockfiles legados (bun/npm/pnpm) — **não criar um quarto**; padronizar em pnpm ao migrar.
- **UI**: shadcn/ui (Radix) + Tailwind. **Forms**: React Hook Form + Zod. **Estado servidor**: TanStack Query + hooks.
- **Backend**: Supabase (Postgres + Auth + Storage), projeto `iikontpccomtgytcmwnn`. Schema TS gerado em `src/integrations/supabase/types.ts` (não editar à mão; regenerar após migration).
- **Deploy**: Docker multi-stage (Node build → Nginx alpine) atrás do Traefik (rede `rede_mibi`), TLS Let's Encrypt. Variáveis `VITE_*` são bakedas no build.
- **Dado compartilhado**: tabela `"Leads"` (L maiúsculo) é escrita pela assistente **Léssie** via chave anon; PK textual `id_conversa` = dedup. Não quebrar essa semântica.

**Why**: protótipo Lovable em migração para arquitetura sustentável; backend único serve site + bot.

**How to apply**: ao implementar, seguir MVC + pnpm do modelo (não o padrão legado). Antes de mexer em schema/`Leads`, avaliar impacto na Léssie. Relacionado: [[project-astorhouse]], [[regras-negocio-astorhouse]].
