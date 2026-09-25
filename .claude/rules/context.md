# Contexto do Projeto — Canil AstorHouse

> Leia `docs/prd.md` (ou `PRD.md` na raiz) antes de qualquer decisão de arquitetura
> ou negócio. Regras de negócio do canil em [memory/regras_negocio_astorhouse.md](../memory/regras_negocio_astorhouse.md).

## O Produto

Site institucional **+ painel administrativo** do **Canil AstorHouse**: vitrine pública
(filhotes à venda com pedigree, cães reprodutores, hotel canino, adestramento, FAQ,
artigos, contato) e área `/admin/*` para CRUD do conteúdo.

O mesmo banco Supabase é consumido pela assistente de WhatsApp **Léssie** (repo irmão
`workspace-lessie-astorhouse`), que lê `puppies`/`faq`/`hotel_packages` e grava na tabela
`Leads`. **Mudanças de schema aqui podem afetar a Léssie.**

> **Arquitetura-alvo**: este projeto nasceu no **Lovable** (estrutura legada `src/pages` +
> `src/hooks`). O destino é a arquitetura **MVC feature-based** descrita em
> [architecture.md](architecture.md) — ela **prevalece**. Migração nova deve seguir o
> modelo MVC; use `/migration-audit` para acompanhar a cobertura.

## Stack e Comandos

| Camada          | Tecnologia                             |
| --------------- | -------------------------------------- |
| Runtime         | Node.js LTS                            |
| Package manager | `pnpm` — nunca `npm` ou `yarn`         |
| Frontend        | React + TypeScript + Vite              |
| Backend         | Supabase (PostgreSQL + Auth + Storage) |
| Estilo          | Tailwind CSS + Shadcn UI (Radix UI)    |
| Estado          | TanStack Query (servidor) + hooks      |
| Forms           | React Hook Form + Zod                  |
| Canal externo   | WhatsApp (link + assistente Léssie)    |
| Deploy          | Docker (Nginx) + Traefik (`rede_mibi`) |

```bash
pnpm install        # instalar dependências
pnpm dev            # dev server (Vite)
pnpm build          # build de produção
pnpm tsc --noEmit   # checar tipos sem build
pnpm lint           # ESLint
pnpm test --run     # rodar testes uma vez (quando existirem)
```

## MCPs Disponíveis

Consulte via MCP antes de escrever código de integração:

- `context7` — documentação atualizada de qualquer lib
- `supabase` — Auth, RLS, Storage, Edge Functions, Realtime

## Regras Globais

- Commits com **Conventional Commits** (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`)
- Zero secrets no código — apenas `.env` / `.env.local` (nunca commitar). A chave `anon`/publishable do Supabase é pública por design.
- Strings de UI sempre em **português brasileiro**
- Não instale novos pacotes sem solicitação explícita
- A tabela `Leads` é **compartilhada com a Léssie** — coordenar antes de alterar (ver [security.md](security.md))
