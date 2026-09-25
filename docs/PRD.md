# PRD Reverso — Site & Painel do Canil AstorHouse 🐕

> Documento de requisitos **reconstruído a partir do código** (reverse PRD).
> Descreve o que a aplicação faz hoje, sua arquitetura e regras, derivado dos
> artefatos versionados neste repositório (`c:\Projetos\astorhouse`).
> Última atualização: **2026-06-15** (pós-auditoria UI/UX e melhorias de qualidade).

---

## 1. Visão Geral

Aplicação web do **Canil AstorHouse** com duas faces:

1. **Site institucional público** — apresenta o canil, raças, filhotes à venda, cães
   reprodutores, hotel canino, adestramento, FAQ, artigos e canais de contato.
2. **Painel administrativo** (`/admin/*`) — CRUD de filhotes, cães, pacotes de hotel,
   FAQ, artigos, equipe, contatos recebidos e dados institucionais da empresa, com autenticação.

O mesmo banco **Supabase** (`iikontpccomtgytcmwnn`) que alimenta este site também
serve a assistente de WhatsApp **Léssie** (projeto irmão `workspace-lessie-astorhouse`),
que lê `puppies`, `faq`, `hotel_packages` e grava em `Leads`. Este site é o **sistema
de gestão de conteúdo** por trás daqueles dados.

### Proposta de valor
- Vitrine online de filhotes com pedigree e serviços do canil.
- Geração de contato/lead (formulário + bolha de WhatsApp).
- Painel para a equipe manter o conteúdo sem depender de desenvolvedor.

---

## 2. Personas

| Persona | Descrição | Necessidade |
|---|---|---|
| **Visitante / comprador** | Interessado em filhote, hotel ou adestramento. | Ver filhotes disponíveis, preços, infos das raças e falar pelo WhatsApp. |
| **Administrador / equipe** | Funcionário do canil. | Cadastrar/editar filhotes, cães, pacotes, FAQ, artigos, equipe; ver contatos. |
| **Sistema irmão (Léssie)** | Agente de WhatsApp. | Consumir os mesmos dados (somente leitura) e registrar leads. |

---

## 3. Escopo Funcional

### 3.1 Páginas públicas (RF-01)
Rotas em [src/App.tsx](src/App.tsx):

| Rota | View | Conteúdo |
|---|---|---|
| `/` | [HomePage](src/features/marketing/views/HomePage.tsx) | Home / landing. |
| `/sobre` | [AboutPage](src/features/marketing/views/AboutPage.tsx) | História, missão, equipe. |
| `/caes` · `/caes/:id` | [DogsPage](src/features/dogs/views/DogsPage.tsx) · [DogDetailPage](src/features/dogs/views/DogDetailPage.tsx) | Cães reprodutores e ficha individual. |
| `/filhotes` | [PuppiesPage](src/features/puppies/views/PuppiesPage.tsx) | Filhotes à venda. |
| `/adestramento` | [TrainingPage](src/features/marketing/views/TrainingPage.tsx) | Serviço de adestramento (Robson). |
| `/hotel` | [HotelPage](src/features/hotel/views/HotelPage.tsx) | Pacotes do hotel canino. |
| `/faq` | [FaqPage](src/features/faq/views/FaqPage.tsx) | Perguntas frequentes publicadas. |
| `/artigos` | [ArticlesPage](src/features/articles/views/ArticlesPage.tsx) | Artigos dinâmicos do banco (`articles`). |
| `/contato` | [ContactPage](src/features/contacts/views/ContactPage.tsx) | Informações de contato. |
| `/login` | [LoginPage](src/features/auth/views/LoginPage.tsx) | Autenticação (Supabase Auth). |
| `*` | [NotFound](src/pages/NotFound.tsx) | 404 em PT-BR. |

Bolha flutuante de **WhatsApp** global ([whatsapp-bubble.tsx](src/components/ui/whatsapp-bubble.tsx)), número `551140354243`.

### 3.2 Painel administrativo (RF-02)
Rotas `/admin/*`, todas protegidas por [`ProtectedRoute`](src/features/auth/views/ProtectedRoute.tsx) — redireciona para `/login` se não autenticado:

| Rota | View | Entidade |
|---|---|---|
| `/admin/filhotes` | [PuppyManagementPage](src/features/puppies/views/PuppyManagementPage.tsx) | `puppies` |
| `/admin/caes` | [DogManagementPage](src/features/dogs/views/DogManagementPage.tsx) | `dogs` |
| `/admin/hotel` | [HotelManagementPage](src/features/hotel/views/HotelManagementPage.tsx) | `hotel_packages` |
| `/admin/faq` | [FaqManagementPage](src/features/faq/views/FaqManagementPage.tsx) | `faq` |
| `/admin/contatos` | [ContactManagementPage](src/features/contacts/views/ContactManagementPage.tsx) | `contacts` |
| `/admin/empresa` | [CompanyInfoManagementPage](src/features/company/views/CompanyInfoManagementPage.tsx) | `company_info` |
| `/admin/artigos` | [ArticleManagementPage](src/features/articles/views/ArticleManagementPage.tsx) | `articles` |
| `/admin/equipe` | [TeamManagementPage](src/features/team/views/TeamManagementPage.tsx) | `team_members` |

- Formulários validados com **react-hook-form + zod** (schema em `models/{feature}.types.ts`).
- Upload de imagens via [image-uploader.tsx](src/components/ui/image-uploader.tsx) / [useImageUpload.ts](src/hooks/useImageUpload.ts) (Supabase Storage).
- **Exclusão é soft delete** (`is_active = false`) para entidades com esse campo — ver [usePuppies.ts](src/features/puppies/controllers/usePuppies.ts). FAQ e artigos usam exclusão física.

### 3.3 Autenticação (RF-03)
- Supabase Auth (e-mail/senha) via [AuthContext.tsx](src/features/auth/controllers/AuthContext.tsx): `signUp`, `signIn`, `signOut`, listener de sessão, toasts em PT-BR.
- Perfis em `profiles` com `role` (`user`/admin); funções no banco `is_admin()` e `get_current_user_role()` para autorização via RLS.
- Guard client-side: [ProtectedRoute](src/features/auth/views/ProtectedRoute.tsx) envolve todas as rotas `/admin/*` em [App.tsx](src/App.tsx) — redireciona para `/login` preservando `state.from`.

### 3.4 Dados e domínio (RF-04)
Controllers (todos usando **TanStack Query**):

| Feature | Hooks principais |
|---|---|
| puppies | [usePuppies](src/features/puppies/controllers/usePuppies.ts) · `usePuppiesByBreed` |
| dogs | [useDogs](src/features/dogs/controllers/useDogs.ts) · `useDogsByBreed` |
| hotel | [useHotelPackages](src/features/hotel/controllers/useHotelPackages.ts) · `useAllHotelPackages` · mutations separadas |
| faq | [useFaq](src/features/faq/controllers/useFaq.ts) |
| contacts | [useContacts](src/features/contacts/controllers/useContacts.ts) · `useUpdateContactStatus` · `useDeleteContact` |
| company | [useCompanyInfo](src/features/company/controllers/useCompanyInfo.ts) |
| articles | [usePublishedArticles](src/features/articles/controllers/useArticles.ts) · `useAllArticles` · mutations separadas |
| team | [useAllTeamMembers](src/features/team/controllers/useTeam.ts) · `useActiveTeamMembers` · mutations separadas |

Regras de domínio observadas no schema:
- **Raças** (enum no form de filhote): `australian_shepherd`, `pomeranian`, `rottweiler`.
- **Status de filhote**: `disponivel`, `reservado`, `vendido`, `nao_disponivel`.
- **Filhotes** (`puppies`) vs **cães reprodutores** (`dogs`): tabelas separadas; `dogs` tem `is_available_for_breeding`, `puppies` tem `is_available_for_sale`.
- Cada filhote/cão guarda pedigree, vacinação, microchip, exames, pais (`parents` JSON), peso/altura, fotos (`image_url` + `images[]`).

---

## 4. Arquitetura

> **Arquitetura: MVC feature-based.** O código está organizado em `src/features/{feature}`
> (View → Controller (hook) → Service → Supabase), conforme
> [.claude/rules/architecture.md](../.claude/rules/architecture.md). A migração do protótipo
> Lovable (`src/pages` + `src/hooks`) foi **concluída em 2026-06-05** — ver
> [migration-checklist.md](migration-checklist.md).

```
Browser (SPA React)
   │  React Router (público + /admin protegido por ProtectedRoute)
   │  TanStack Query — useQuery + useMutation (todos os controllers)
   ▼
Supabase JS client (src/integrations/supabase/client.ts)
   │  Auth (sessão em localStorage) + PostgREST + Storage
   ▼
Supabase (projeto iikontpccomtgytcmwnn)
   Tabelas: puppies, dogs, hotel_packages, faq, articles, team_members,
            contacts, company_info, news, events, glossary, documents,
            profiles, Leads, n8n_chat_histories
   RLS + funções is_admin() / get_current_user_role()
```

### Stack
- **Build/Runtime**: Vite 5 + React 18 + TypeScript, plugin SWC. Origem **Lovable** (`lovable-tagger` em dev).
- **UI**: shadcn/ui (Radix) + Tailwind CSS + `tailwindcss-animate`; ícones `lucide-react`; toasts `sonner` + toaster próprio.
- **Estado servidor**: `@tanstack/react-query` — todos os controllers usam `useQuery` / `useMutation`. Sem `useState`/`useEffect` para fetch de dados.
- **Formulários**: `react-hook-form` + `zod`.
- **Backend**: Supabase (Postgres + Auth + Storage + PostgREST).
- **Gerenciador de pacotes**: **`pnpm`** (único lockfile: `pnpm-lock.yaml`).

### Configuração
- `@` → `./src` (alias em [vite.config.ts](vite.config.ts)); dev server porta **3000** (`strictPort`).
- Credenciais Supabase em `.env` (`VITE_SUPABASE_*`) **e** hardcoded em [client.ts](src/integrations/supabase/client.ts) (chave `anon`/publishable — pública por design, protegida por RLS).

### Deploy
- **Docker** multi-stage (Node 20 build → Nginx Alpine) servindo a SPA; orquestração com **Traefik** + Let's Encrypt na rede `rede_mibi`. Domínio: `www.astorhouse.com.br`. Ver [README-docker.md](README-docker.md), [Dockerfile](Dockerfile), [docker-compose.yml](docker-compose.yml), [nginx.conf](nginx.conf).
- SPA fallback via `try_files` no Nginx.

---

## 5. Modelo de Dados (resumo)

Tabelas principais (schema completo em [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts) e [supabase/migrations/](supabase/migrations/)):

- **`puppies`** — filhotes à venda (raça, cor, sexo, preço, status, saúde, fotos, `is_available_for_sale`, `is_active`).
- **`dogs`** — cães reprodutores/plantel (semelhante a puppies + `is_available_for_breeding`, `achievements`, `offspring`).
- **`hotel_packages`** — pacotes do hotel (`name`, `price`, `features` JSON, `is_popular`, `display_order`, `is_active`).
- **`faq`** — perguntas/respostas (`is_published`, `order_index`, `category`) — **fonte primária da Léssie**.
- **`articles`** — artigos publicados (`title`, `content`, `excerpt`, `category`, `image_url`, `is_published`, `tags`). Sem soft delete.
- **`team_members`** — equipe do canil (`name`, `position`, `bio`, `photo_url`, `order_index`, `is_active`). Soft delete.
- **`contacts`** — submissões do formulário de contato (`status`).
- **`company_info`** — identidade da empresa (nome, slogan, missão, contatos, redes).
- **`Leads`** — funil de leads (PK textual `id_conversa` para dedup; `telefone`, `tipo_interesse`, `status` ∈ {novo, em_andamento, convertido, perdido, cancelado}, `puppy_id`, `observacao`). Escrita pelo bot Léssie via chave anon — ver migration [20260524120000_leads_estruturado.sql](supabase/migrations/20260524120000_leads_estruturado.sql).
- Conteúdo futuro (banco existe, sem CRUD ainda): `news`, `events`, `glossary`, `documents`.
- Auth/infra: `profiles`, `n8n_chat_histories` (histórico de chat de automação n8n).

Todas as tabelas têm **RLS habilitado**; leitura pública para conteúdo publicado, escrita restrita a admin.

---

## 6. Requisitos Não-Funcionais

- **SPA client-side** com roteamento via Nginx `try_files`.
- **i18n**: interface 100% em **português brasileiro** (incluindo página 404).
- **Soft delete** preserva histórico (registros marcados `is_active=false`) onde aplicável.
- **Segurança**: chave `anon` pública; proteção real via RLS + guard client-side `ProtectedRoute`.
- **Responsivo**: Tailwind + hook [use-mobile.tsx](src/hooks/use-mobile.tsx). Verificado com Playwright: sem overflow horizontal em mobile 390 px.
- **Feedback de UX**: toasts em todas as operações de dados (sucesso/erro); erros de formulário inline (sem `alert()`).
- **Acessibilidade**: botões ícone-only têm `aria-label`; ícones Lucide em vez de emojis.

---

## 7. Integrações

- **Supabase** — Postgres, Auth, Storage, PostgREST (mesmo projeto da Léssie).
- **WhatsApp** — link direto (bolha flutuante, número `551140354243`).
- **n8n** — tabela `n8n_chat_histories` indica automação de chat externa.
- **Léssie (WhatsApp bot)** — consumidor read-only dos dados + writer de `Leads`.

---

## 8. Riscos e Dívidas Técnicas

- ~~**Rotas `/admin/*` sem guard client-side**~~ — **Resolvido (2026-06-15)**: `ProtectedRoute` implementado em todas as rotas admin; redireciona para `/login` preservando `state.from`.
- ~~**Três lockfiles**~~ — **Resolvido (2026-06-15)**: `bun.lock`, `bun.lockb` e `package-lock.json` removidos; apenas `pnpm-lock.yaml`.
- ~~**Resquícios de template**~~ — **Resolvido (2026-06-15)**: `README-docker.md` corrigido com domínio e nome reais do AstorHouse.
- ~~**Logs de debug**~~ — **Resolvido (2026-06-15)**: todos os `console.log` de debug removidos de `PuppyManagementPage`, `useImageUpload` e `image-uploader`.
- ~~**Mistura de TanStack Query com hooks manuais**~~ — **Resolvido (2026-06-15)**: `useDogs`, `usePuppies` e `useFaq` migrados para `useQuery`/`useMutation`; 100% dos controllers usam TanStack Query.
- ~~**Migração de arquitetura pendente**~~ — **Resolvido (2026-06-05)**: migração para **MVC feature-based** (`src/features/*`) concluída; ver [migration-checklist.md](migration-checklist.md).
- **Credenciais duplicadas** (`.env` + hardcoded em `client.ts`) — aceitável por ser chave pública, mas idealmente uma só fonte.
- **Bundle único de ~930 kB** — Vite avisa sobre chunk size. Implementar `React.lazy` + `Suspense` nas rotas admin.
- **Paginação no FAQ** — `FaqPage` exibe todos os itens sem paginação; longa com dados reais. Pendente.
- **Redirect pós-login** — `LoginPage` redireciona sempre para `/` após login; deveria usar `state.from` preservado pelo `ProtectedRoute`.

---

## 9. Fora de Escopo (hoje)

- Sem checkout/pagamento online — vendas concluídas off-line/WhatsApp.
- Sem testes automatizados nem CI/CD versionados.
- Gestão da conversa de WhatsApp em si vive no projeto irmão (Léssie/OpenClaw), não aqui.
- CRUD para `news`, `events`, `glossary`, `documents` — tabelas existem no banco, sem páginas ainda.

---

## 10. Métricas de Sucesso (sugeridas — não instrumentadas)

- Filhotes/cães publicados e atualizados pelo painel.
- Contatos recebidos via formulário e cliques no WhatsApp.
- Conversão de `Leads` (status `novo` → `convertido`).
- Tempo de carregamento da SPA / Core Web Vitals.
