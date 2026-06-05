# CLAUDE.md

Orientações para o Claude Code (e outros agentes) ao trabalhar **neste repositório**
(`c:\Projetos\astorhouse`). Para o panorama funcional completo, ver [docs/PRD.md](docs/PRD.md).

## O que é este projeto

Site institucional **+ painel administrativo** do **Canil AstorHouse**: vitrine pública
(filhotes, cães, hotel, adestramento, FAQ, artigos, contato) e área `/admin/*` para
CRUD do conteúdo. SPA em **Vite + React + TypeScript + shadcn/ui (Radix) + Tailwind**,
com backend **Supabase** (Postgres + Auth + Storage). Projeto originado no **Lovable**.

O mesmo banco Supabase é consumido pela assistente de WhatsApp **Léssie** (repo irmão
`workspace-lessie-astorhouse`), que lê `puppies`/`faq`/`hotel_packages` e grava `Leads`.
Mudanças de schema aqui podem afetar a Léssie — veja "Cuidados" abaixo.

## Arquitetura: MVC feature-based (migração concluída)

O código segue a arquitetura **MVC feature-based** definida em
[.claude/rules/architecture.md](.claude/rules/architecture.md):

```
View → Controller (hook) → Service → Supabase     em  src/features/{feature}/
```

A migração do protótipo Lovable (`src/pages` + `src/hooks`) foi **concluída em 2026-06-05**
(ver [docs/migration-checklist.md](docs/migration-checklist.md)). Features em `src/features/*`:
`auth`, `marketing`, `dogs`, `puppies`, `hotel`, `faq`, `contacts`, `company`. Cada uma tem
`models/` (tipos + zod) · `services/` (Supabase) · `controllers/` (hooks) · `views/` (páginas) · `index.ts` (barrel).

- **Código novo** segue esse modelo MVC; use `/feature <nome>` para o esqueleto.
- Só restam fora de `features/`: `components/ui` + `components/layout` (shadcn/layout),
  `integrations/supabase`, hooks utilitários (`use-mobile`, `use-toast`, `useImageUpload`) e `pages/NotFound.tsx`.
- A pasta **`.claude/`** (rules, commands, memory) é a fonte da verdade de processo e arquitetura.
- Baseline pré-migração: tag git **`prototype-lovable`**.

## Stack e comandos

- **Dev (estado atual)**: `npm run dev` (Vite, porta **8080**). Build: `npm run build`. Lint: `npm run lint`. Preview: `npm run preview`.
- **Pacotes**: há lockfiles de bun, npm **e** pnpm no repo. O modelo-alvo (`.claude`) padroniza **`pnpm`** — ao migrar, consolide nele e remova os lockfiles legados; não gere um quarto. Confirme com o usuário antes de instalar deps.
- **TypeScript** + ESLint (flat config em [eslint.config.js](eslint.config.js)).

## Estrutura (MVC feature-based)

| Caminho | Conteúdo |
|---|---|
| [src/App.tsx](src/App.tsx) | Rotas (público + `/admin/*`) importando views de `@/features/*`; providers (Query, Auth, Tooltip); bolha WhatsApp. |
| [src/features/](src/features/) | Uma pasta por feature: `models/` · `services/` · `controllers/` · `views/` · `index.ts`. |
| [src/integrations/supabase/](src/integrations/supabase/) | `client.ts` (cliente) e `types.ts` (schema gerado — **não editar à mão**). |
| [src/components/ui/](src/components/ui/) | Componentes shadcn/ui (Radix). |
| [src/components/layout/](src/components/layout/) | Header/Footer globais. |
| [src/hooks/](src/hooks/) | Apenas utilitários globais (`use-mobile`, `use-toast`, `useImageUpload`). |
| [src/pages/](src/pages/) | Apenas `NotFound.tsx` (catch-all). |
| [supabase/migrations/](supabase/migrations/) | Migrations SQL (schema + RLS). |
| Docker | [Dockerfile](Dockerfile), [docker-compose.yml](docker-compose.yml), [nginx.conf](nginx.conf), [README-docker.md](README-docker.md). |

## Convenções

> A referência de arquitetura é [.claude/rules/architecture.md](.claude/rules/architecture.md) (MVC).
> As convenções abaixo valem para todo o código em `src/features/*`.

- **Alias de import**: use `@/...` para `src/...` (configurado em [vite.config.ts](vite.config.ts) e tsconfig).
- **UI**: componha com shadcn/ui já presente em `src/components/ui/`; **não** traga outra lib de componentes. Estilo via Tailwind (`cn()` de [src/lib/utils.ts](src/lib/utils.ts)).
- **Formulários**: `react-hook-form` + `zod` (schema no topo da página de management; siga o padrão de [PuppyManagement.tsx](src/pages/PuppyManagement.tsx)).
- **Dados**: um hook por entidade (`usePuppies`, `useDogs`, ...). Padrão: `fetch*`, `create*`, `update*`, `delete*`, `refetch`; feedback com `toast` (sonner) em sucesso e erro.
- **Exclusão é soft delete** (`is_active = false`) — **não** delete fisicamente; siga [usePuppies.ts](src/hooks/usePuppies.ts).
- **Idioma**: toda string de UI em **português brasileiro**.
- **Imagens**: upload via [useImageUpload.ts](src/hooks/useImageUpload.ts) / [image-uploader.tsx](src/components/ui/image-uploader.tsx) (Supabase Storage), guardando URL em `image_url`/`images[]`.

## Banco de dados / Supabase

- Schema TS em [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts) é **gerado** — ao mudar o banco, atualize via migration **e** regenere os types; não edite à mão.
- Novas mudanças de schema → criar migration em [supabase/migrations/](supabase/migrations/) (idempotente quando possível, padrão das existentes). **Habilite RLS** em toda tabela nova.
- Autorização real vive no **RLS** + funções `is_admin()` / `get_current_user_role()`. A chave `anon` é pública por design.

## Cuidados importantes

- **Rotas admin não têm guard client-side hoje**: `/admin/*` em [src/App.tsx](src/App.tsx) não usa `ProtectedRoute`/redirect — a segurança depende do RLS. Se for proteger, adicione guard por sessão/role; não enfraqueça o RLS para "facilitar".
- **Tabela `Leads` é compartilhada com a Léssie**: PK textual `id_conversa` é a chave de **dedup** usada pelo bot. Não altere essa semântica sem coordenar com o repo `workspace-lessie-astorhouse`. Cuidado: a tabela é `"Leads"` (L maiúsculo, sempre entre aspas no SQL).
- **`.claude/` é a fonte da verdade de arquitetura/processo**: rules (MVC, segurança, workflow), commands (`/feature`, `/migration`, `/migration-audit`, `/review`, ...) e memory (regras de negócio do canil) já adaptados ao AstorHouse. Consulte antes de implementar.
- **Resíduos de template**: [README-docker.md](README-docker.md) menciona "Dr. Stanley" e `portal.mibitech.com.br`, herdados de outro deploy — confirme o domínio real antes de usar.

## Ao concluir tarefas

- Rode `npm run lint` (e `npm run build` quando mexer em algo amplo) antes de finalizar.
- Commit/push **apenas quando solicitado**.
- Se alterar comportamento, schema ou regras, mantenha [docs/PRD.md](docs/PRD.md) e este arquivo coerentes.
