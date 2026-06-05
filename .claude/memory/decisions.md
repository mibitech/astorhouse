# Log de Decisões — AstorHouse

> Registro cronológico de decisões tomadas no projeto. Para decisões arquiteturais formais com contexto profundo, criar um ADR em `docs/adr/`.

---

## 2026-06-05

### D-001 — Arquitetura-alvo: MVC feature-based (o modelo `.claude` prevalece)

- **Contexto**: o projeto nasceu no Lovable com estrutura `src/pages` + `src/hooks` (legada). O conjunto `.claude` (rules/commands) foi adotado como blueprint da arquitetura-alvo.
- **Decisão**: a arquitetura **MVC em `src/features/*`** ([rules/architecture.md](architecture.md)) **prevalece** sobre a estrutura atual. Código novo segue MVC; o legado migra gradualmente. Usar `/migration-audit` para acompanhar a cobertura (tag `prototype-lovable` + `docs/migration-checklist.md` quando criados).
- **Implicação**: `.claude` descreve o destino, não o estado atual. Tooling do modelo: `pnpm`, shadcn, RHF+Zod.

### D-002 — `.claude` adaptado do template Vet1Minuto

- **Contexto**: a pasta `.claude` foi copiada de outro projeto (Vet1Minuto).
- **Decisão**: manter a arquitetura/processo do template e substituir apenas as **características funcionais**: identidade do produto (AstorHouse), regras de negócio do canil, integrações reais (Supabase + WhatsApp/Léssie) e memória. Removidos arquivos específicos do Vet1Minuto (doses, multi-tenant, Stripe/Brevo) e a permissão de `settings.json` que apontava para `c:/Projetos/vet1minuto`.

### D-003 — Tabela `Leads` é compartilhada com a assistente Léssie

- **Contexto**: o backend Supabase serve o site **e** o bot de WhatsApp Léssie (repo `workspace-lessie-astorhouse`).
- **Decisão**: tratar `"Leads"` como contrato compartilhado — PK textual `id_conversa` (dedup), escrita via chave anon. Mudanças no schema/policies dessa tabela exigem coordenação com o repo da Léssie.
