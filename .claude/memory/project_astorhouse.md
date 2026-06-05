---
name: project-astorhouse
description: Projeto AstorHouse — site institucional + painel admin do Canil AstorHouse. Stack, integrações e arquitetura-alvo.
metadata:
  type: project
---

**AstorHouse** é a aplicação web do **Canil AstorHouse**: um site institucional público
(filhotes à venda, cães reprodutores, hotel canino, adestramento, FAQ, artigos, contato)
**+ painel administrativo** (`/admin/*`) para CRUD do conteúdo. Stack: React + Vite + TS +
shadcn/ui (Radix) + Tailwind, backend Supabase (Postgres + Auth + Storage).

**Backend compartilhado**: o mesmo projeto Supabase (`iikontpccomtgytcmwnn`) alimenta a
assistente de WhatsApp **Léssie** (repo irmão `workspace-lessie-astorhouse`), que lê
`puppies`/`faq`/`hotel_packages` e grava na tabela `Leads`. Mudanças de schema aqui podem
impactar a Léssie — coordenar.

**Arquitetura-alvo**: o projeto nasceu no **Lovable** (estrutura legada `src/pages` +
`src/hooks`). O destino é a arquitetura **MVC feature-based** (`src/features/*`) definida em
[[stack-astorhouse]] e nas rules — esse modelo **prevalece** sobre a estrutura atual.

**How to apply**: ao implementar algo novo, seguir o modelo MVC das rules (não replicar o
padrão page+hook legado). Consultar [[regras-negocio-astorhouse]] para o domínio do canil e
[[stack-astorhouse]] para decisões técnicas. Fonte da verdade: `PRD.md`.
