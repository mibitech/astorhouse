# PRD Reverso — Site & Painel do Canil AstorHouse 🐕

> Documento de requisitos **reconstruído a partir do código** (reverse PRD).
> Descreve o que a aplicação faz hoje, sua arquitetura e regras, derivado dos
> artefatos versionados neste repositório (`c:\Projetos\astorhouse`).

---

## 1. Visão Geral

Aplicação web do **Canil AstorHouse** com duas faces:

1. **Site institucional público** — apresenta o canil, raças, filhotes à venda, cães
   reprodutores, hotel canino, adestramento, FAQ, artigos e canais de contato.
2. **Painel administrativo** (`/admin/*`) — CRUD de filhotes, cães, pacotes de hotel,
   FAQ, contatos recebidos e dados institucionais da empresa, com autenticação.

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
| **Administrador / equipe** | Funcionário do canil. | Cadastrar/editar filhotes, cães, pacotes, FAQ; ver contatos. |
| **Sistema irmão (Léssie)** | Agente de WhatsApp. | Consumir os mesmos dados (somente leitura) e registrar leads. |

---

## 3. Escopo Funcional

### 3.1 Páginas públicas (RF-01)
Rotas em [src/App.tsx](src/App.tsx):

| Rota | Página | Conteúdo |
|---|---|---|
| `/` | [Index](src/pages/Index.tsx) | Home / landing. |
| `/sobre` | About | História, missão, equipe. |
| `/caes` · `/caes/:id` | Dogs · DogDetail | Cães reprodutores e ficha individual. |
| `/filhotes` | Puppies | Filhotes à venda. |
| `/adestramento` | Training | Serviço de adestramento (Robson). |
| `/hotel` | Hotel | Pacotes do hotel canino. |
| `/faq` | FAQ | Perguntas frequentes publicadas. |
| `/artigos` | Articles | Conteúdo educativo. |
| `/contato` | Contact | Formulário de contato. |
| `/login` | Login | Autenticação (Supabase Auth). |
| `*` | NotFound | 404. |

Bolha flutuante de **WhatsApp** global ([whatsapp-bubble.tsx](src/components/ui/whatsapp-bubble.tsx)), número `551140354243`.

### 3.2 Painel administrativo (RF-02)
Rotas `/admin/*`, cada uma com CRUD completo via hooks + Supabase:

| Rota | Página | Entidade |
|---|---|---|
| `/admin/filhotes` | PuppyManagement | `puppies` |
| `/admin/caes` | DogManagement | `dogs` |
| `/admin/hotel` | HotelManagement | `hotel_packages` |
| `/admin/faq` | FAQManagement | `faq` |
| `/admin/contatos` | ContactManagement | `contacts` |
| `/admin/empresa` | CompanyInfoManagement | `company_info` |

- Formulários validados com **react-hook-form + zod** (ex.: schema de filhote em [PuppyManagement.tsx](src/pages/PuppyManagement.tsx)).
- Upload de imagens via [image-uploader.tsx](src/components/ui/image-uploader.tsx) / [useImageUpload.ts](src/hooks/useImageUpload.ts) (Supabase Storage).
- **Exclusão é soft delete** (`is_active = false`), não remoção física — ver [usePuppies.ts](src/hooks/usePuppies.ts).

### 3.3 Autenticação (RF-03)
- Supabase Auth (e-mail/senha) via [AuthContext.tsx](src/contexts/AuthContext.tsx): `signUp`, `signIn`, `signOut`, listener de sessão, toasts em PT-BR.
- Perfis em `profiles` com `role` (`user`/admin); funções no banco `is_admin()` e `get_current_user_role()` para autorização via RLS.

### 3.4 Dados e domínio (RF-04)
Hooks de acesso a dados (um por entidade): [usePuppies](src/hooks/usePuppies.ts), [useDogs](src/hooks/useDogs.ts), [useHotelPackages](src/hooks/useHotelPackages.ts), [useFAQ](src/hooks/useFAQ.ts), [useContacts](src/hooks/useContacts.ts), [useCompanyInfo](src/hooks/useCompanyInfo.ts).

Regras de domínio observadas no schema:
- **Raças** (enum no form de filhote): `australian_shepherd`, `pomeranian`, `rottweiler`.
- **Status de filhote**: `disponivel`, `reservado`, `vendido`, `nao_disponivel`.
- **Filhotes** (`puppies`) vs **cães reprodutores** (`dogs`): tabelas separadas; `dogs` tem `is_available_for_breeding`, `puppies` tem `is_available_for_sale`.
- Cada filhote/cão guarda pedigree, vacinação, microchip, exames, pais (`parents` JSON), peso/altura, fotos (`image_url` + `images[]`).

---

## 4. Arquitetura

> **Atual (legado) × alvo.** O diagrama e a estrutura abaixo descrevem o **estado atual**,
> que é o **legado do Lovable** (`src/pages` + `src/hooks`). A **arquitetura-alvo**, que
> **prevalece** para todo código novo, é o **MVC feature-based** (`src/features/{feature}` →
> View → Controller (hook) → Service → Supabase), definido em
> [.claude/rules/architecture.md](../.claude/rules/architecture.md). A migração do legado é
> acompanhada via `/migration-audit`.

```
Browser (SPA React)
   │  React Router (público + /admin)
   │  TanStack Query + hooks (use*.ts)
   ▼
Supabase JS client (src/integrations/supabase/client.ts)
   │  Auth (sessão em localStorage) + PostgREST + Storage
   ▼
Supabase (projeto iikontpccomtgytcmwnn)
   Tabelas: puppies, dogs, hotel_packages, faq, articles, news, events,
            contacts, company_info, team_members, documents, glossary,
            profiles, Leads, n8n_chat_histories
   RLS + funções is_admin() / get_current_user_role()
```

### Stack
- **Build/Runtime**: Vite 5 + React 18 + TypeScript, plugin SWC. Origem **Lovable** (`lovable-tagger` em dev).
- **UI**: shadcn/ui (Radix) + Tailwind CSS + `tailwindcss-animate`; ícones `lucide-react`; toasts `sonner` + toaster próprio.
- **Estado servidor**: `@tanstack/react-query` (provider em App) + hooks locais com `useState`/`useEffect`.
- **Formulários**: `react-hook-form` + `zod`.
- **Backend**: Supabase (Postgres + Auth + Storage + PostgREST).
- **Gerenciador de pacotes**: há lockfiles de `bun`, `npm` e `pnpm` no repo (ver §8 Riscos).

### Configuração
- `@` → `./src` (alias em [vite.config.ts](vite.config.ts)); dev server porta **8080**.
- Credenciais Supabase em `.env` (`VITE_SUPABASE_*`) **e** hardcoded em [client.ts](src/integrations/supabase/client.ts) (chave `anon`/publishable — pública por design, protegida por RLS).

### Deploy
- **Docker** multi-stage (Node 20 build → Nginx Alpine) servindo a SPA; orquestração com **Traefik** + Let's Encrypt na rede `rede_mibi`. Ver [README-docker.md](README-docker.md), [Dockerfile](Dockerfile), [docker-compose.yml](docker-compose.yml), [nginx.conf](nginx.conf).
- SPA fallback via `try_files` no Nginx.

---

## 5. Modelo de Dados (resumo)

Tabelas principais (schema completo em [src/integrations/supabase/types.ts](src/integrations/supabase/types.ts) e [supabase/migrations/](supabase/migrations/)):

- **`puppies`** — filhotes à venda (raça, cor, sexo, preço, status, saúde, fotos, `is_available_for_sale`, `is_active`).
- **`dogs`** — cães reprodutores/plantel (semelhante a puppies + `is_available_for_breeding`, `achievements`, `offspring`).
- **`hotel_packages`** — pacotes do hotel (`name`, `price`, `features` JSON, `is_popular`, `display_order`, `is_active`).
- **`faq`** — perguntas/respostas (`is_published`, `order_index`, `category`) — **fonte primária da Léssie**.
- **`contacts`** — submissões do formulário de contato (`status`).
- **`company_info`** — identidade da empresa (nome, slogan, missão, contatos, redes).
- **`Leads`** — funil de leads (PK textual `id_conversa` para dedup; `telefone`, `tipo_interesse`, `status` ∈ {novo, em_andamento, convertido, perdido, cancelado}, `puppy_id`, `observacao`). Escrita pelo bot Léssie via chave anon — ver migration [20260524120000_leads_estruturado.sql](supabase/migrations/20260524120000_leads_estruturado.sql).
- Conteúdo: `articles`, `news`, `events`, `glossary`, `documents`, `team_members`.
- Auth/infra: `profiles`, `n8n_chat_histories` (histórico de chat de automação n8n).

Todas as tabelas têm **RLS habilitado**; leitura pública para conteúdo publicado, escrita restrita a admin.

---

## 6. Requisitos Não-Funcionais

- **SPA client-side** com roteamento via Nginx `try_files`.
- **i18n**: interface 100% em **português brasileiro**.
- **Soft delete** preserva histórico (registros marcados `is_active=false`).
- **Segurança**: a chave `anon` é pública; a proteção real é o **RLS** + funções de role no Postgres. Storage para uploads de imagem.
- **Responsivo**: Tailwind + hook [use-mobile.tsx](src/hooks/use-mobile.tsx).
- **Feedback de UX**: toasts em todas as operações de dados (sucesso/erro).

---

## 7. Integrações

- **Supabase** — Postgres, Auth, Storage, PostgREST (mesmo projeto da Léssie).
- **WhatsApp** — link direto (bolha flutuante, número `551140354243`).
- **n8n** — tabela `n8n_chat_histories` indica automação de chat externa.
- **Léssie (WhatsApp bot)** — consumidor read-only dos dados + writer de `Leads`.

---

## 8. Riscos e Dívidas Técnicas (observados no código)

- **Rotas `/admin/*` sem guard client-side**: em [src/App.tsx](src/App.tsx) as páginas de management **não** estão envolvidas por um `ProtectedRoute`/redirect; qualquer um pode abrir a URL. A proteção efetiva depende **inteiramente do RLS** no Supabase. Recomenda-se adicionar guard de rota por sessão/role.
- **Três lockfiles** (`bun.lock`/`bun.lockb`, `package-lock.json`, `pnpm-lock.yaml`) — risco de divergência de versões; padronizar um gerenciador.
- **Credenciais duplicadas** (`.env` + hardcoded em `client.ts`) — aceitável por ser chave pública, mas idealmente uma só fonte.
- **Migração de arquitetura pendente**: o código está no padrão **legado Lovable** (`src/pages` + `src/hooks`); a arquitetura-alvo é **MVC feature-based** (`src/features/*`), definida em [.claude/rules/architecture.md](../.claude/rules/architecture.md). Migrar gradualmente (ver `/migration-audit`). *(A `.claude` já foi adaptada do template Vet1Minuto para o AstorHouse — resolvido.)*
- **Resquícios de template**: [README-docker.md](README-docker.md) cita "Site Dr. Stanley" e domínio `portal.mibitech.com.br`, herdados de outro projeto.
- **Logs de debug** (`console.log`) em hooks de produção (ex.: usePuppies).
- Mistura de **TanStack Query** (provider) com hooks manuais `useState/useEffect` — padrão de fetch não unificado.

---

## 9. Fora de Escopo (hoje)

- Sem checkout/pagamento online — vendas concluídas off-line/WhatsApp.
- Sem testes automatizados nem CI/CD versionados.
- Gestão da conversa de WhatsApp em si vive no projeto irmão (Léssie/OpenClaw), não aqui.

---

## 10. Métricas de Sucesso (sugeridas — não instrumentadas)

- Filhotes/cães publicados e atualizados pelo painel.
- Contatos recebidos via formulário e cliques no WhatsApp.
- Conversão de `Leads` (status `novo` → `convertido`).
- Tempo de carregamento da SPA / Core Web Vitals.
