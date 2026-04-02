# 🐾 AstorHouse — Documentação Técnica e Funcional

> **Plataforma web oficial do canil AstorHouse**, especializado na criação responsável de Pastor Australiano com pedigree, serviços de adestramento e hotel canino.

---

## Sumário

- [Visão Geral do Produto](#visão-geral-do-produto)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Stack Tecnológica](#stack-tecnológica)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [Autenticação e Segurança](#autenticação-e-segurança)
- [Infraestrutura e Deploy](#infraestrutura-e-deploy)
- [Epics e User Stories](#epics-e-user-stories)
  - [Epic 1 — Presença Digital e Identidade da Marca](#epic-1--presença-digital-e-identidade-da-marca)
  - [Epic 2 — Catálogo de Cães Reprodutores](#epic-2--catálogo-de-cães-reprodutores)
  - [Epic 3 — Venda de Filhotes](#epic-3--venda-de-filhotes)
  - [Epic 4 — Hotel Canino](#epic-4--hotel-canino)
  - [Epic 5 — Adestramento](#epic-5--adestramento)
  - [Epic 6 — Comunicação e Relacionamento com o Cliente](#epic-6--comunicação-e-relacionamento-com-o-cliente)
  - [Epic 7 — Painel Administrativo (Backoffice)](#epic-7--painel-administrativo-backoffice)
  - [Epic 8 — Autenticação e Controle de Acesso](#epic-8--autenticação-e-controle-de-acesso)
  - [Epic 9 — Conteúdo Editorial](#epic-9--conteúdo-editorial)
- [Fluxos de Usuário](#fluxos-de-usuário)
- [Convenções de Desenvolvimento](#convenções-de-desenvolvimento)
- [Guia de Instalação e Execução Local](#guia-de-instalação-e-execução-local)

---

## Visão Geral do Produto

O **AstorHouse** é uma aplicação web Single Page Application (SPA) que serve como canal oficial do canil de mesmo nome, com mais de 20 anos de experiência na criação de Pastor Australiano. A plataforma cumpre duas funções essenciais:

1. **Vitrine pública** — apresenta os cães reprodutores, filhotes disponíveis, serviços de hotel canino, adestramento e informações institucionais para visitantes não autenticados.
2. **Backoffice administrativo** — permite que administradores autenticados gerenciem todo o conteúdo do site de forma dinâmica, sem necessidade de alterações no código.

### Objetivos de Negócio

| Objetivo | Descrição |
|---|---|
| Geração de leads | Capturar contatos de clientes interessados em filhotes, hotel e adestramento |
| Transparência | Apresentar pedigree, saúde e características dos cães de forma detalhada |
| Conversão via WhatsApp | Direcionar contatos qualificados para o canal de atendimento direto |
| Autonomia operacional | Permitir que a equipe atualize conteúdo sem dependência técnica |

---

## Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                   │
│                React 18 SPA (Vite + TypeScript)          │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│              REVERSE PROXY (Traefik + TLS)               │
│        www.astorhouse.com.br  →  Container Docker        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│            SERVIDOR WEB (nginx:alpine)                   │
│         Serve arquivos estáticos compilados              │
│              Container: astorhouse:latest                │
└────────────────────────┬────────────────────────────────┘
                         │ API REST / Realtime
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  SUPABASE (BaaS)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  PostgreSQL  │  │     Auth     │  │    Storage    │  │
│  │  (Database)  │  │  (JWT/Email) │  │  (Imagens)    │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Padrões Arquiteturais Adotados

- **SPA (Single Page Application)**: toda a navegação ocorre no cliente via React Router DOM v6, sem recarregamento de página.
- **BFF via Supabase**: o Supabase atua como Backend-for-Frontend, eliminando a necessidade de um servidor de API customizado.
- **React Query (TanStack Query v5)**: gerenciamento de estado do servidor com cache, revalidação e mutations declarativas.
- **Context API**: utilizado para estado global de autenticação (`AuthContext`).
- **Custom Hooks**: cada domínio de negócio é encapsulado em um hook dedicado (`useDogs`, `usePuppies`, `useFAQ`, `useHotelPackages`, `useCompanyInfo`, `useContacts`).
- **Soft Delete**: a exclusão de cães (`dogs`) usa `is_active = false` para preservar histórico.

---

## Stack Tecnológica

### Frontend

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 18.3.1 | Biblioteca UI principal |
| TypeScript | 5.8.3 | Tipagem estática |
| Vite | 5.4.19 | Bundler e servidor de desenvolvimento |
| React Router DOM | 6.30.1 | Roteamento SPA |
| TanStack React Query | 5.83.0 | Cache e gerenciamento de estado do servidor |
| Tailwind CSS | 3.4.17 | Estilização utilitária |
| shadcn/ui + Radix UI | — | Componentes acessíveis e headless |
| React Hook Form | 7.61.1 | Gerenciamento de formulários |
| Zod | 3.25.76 | Validação de schemas |
| Lucide React | 0.462.0 | Ícones SVG |
| Embla Carousel | 8.6.0 | Carrossel de imagens |
| Sonner | 1.7.4 | Notificações toast |
| date-fns | 3.6.0 | Manipulação de datas |

### Backend / Infraestrutura

| Tecnologia | Finalidade |
|---|---|
| Supabase | Banco de dados PostgreSQL, autenticação, storage |
| Docker (node:20-alpine + nginx:alpine) | Containerização e servição de arquivos estáticos |
| Traefik | Reverse proxy com certificado TLS automático (Let's Encrypt) |
| nginx | Servidor web para a SPA compilada |

---

## Estrutura do Projeto

```
astorhouse/
├── public/                     # Arquivos estáticos públicos
├── src/
│   ├── assets/                 # Imagens estáticas (logo, hero, hotel)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Navegação principal + menu admin
│   │   │   └── Footer.tsx      # Rodapé com links e informações
│   │   └── ui/                 # Componentes shadcn/ui + customizados
│   │       ├── whatsapp-bubble.tsx  # Botão flutuante do WhatsApp
│   │       └── image-uploader.tsx   # Upload de imagens via Supabase Storage
│   ├── contexts/
│   │   └── AuthContext.tsx     # Contexto global de autenticação
│   ├── hooks/                  # Custom hooks por domínio
│   │   ├── useDogs.ts
│   │   ├── usePuppies.ts
│   │   ├── useHotelPackages.ts
│   │   ├── useFAQ.ts
│   │   ├── useContacts.ts
│   │   ├── useCompanyInfo.ts
│   │   └── useImageUpload.ts
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts       # Instância do cliente Supabase
│   │       └── types.ts        # Tipos gerados automaticamente do schema
│   ├── lib/
│   │   └── utils.ts            # Utilitários (cn, clsx)
│   ├── pages/                  # Páginas públicas e administrativas
│   │   ├── Index.tsx           # Homepage
│   │   ├── About.tsx           # Sobre o canil
│   │   ├── Dogs.tsx            # Catálogo de reprodutores
│   │   ├── DogDetail.tsx       # Detalhes de um cão específico
│   │   ├── Puppies.tsx         # Filhotes disponíveis
│   │   ├── Hotel.tsx           # Hotel canino
│   │   ├── Training.tsx        # Adestramento
│   │   ├── Articles.tsx        # Artigos e notícias
│   │   ├── FAQ.tsx             # Perguntas frequentes
│   │   ├── Contact.tsx         # Formulário de contato
│   │   ├── Login.tsx           # Autenticação
│   │   ├── NotFound.tsx        # 404
│   │   ├── DogManagement.tsx       # Admin: gestão de cães
│   │   ├── PuppyManagement.tsx     # Admin: gestão de filhotes
│   │   ├── HotelManagement.tsx     # Admin: pacotes do hotel
│   │   ├── FAQManagement.tsx       # Admin: FAQ
│   │   ├── ContactManagement.tsx   # Admin: contatos recebidos
│   │   └── CompanyInfoManagement.tsx # Admin: informações da empresa
│   ├── types/
│   │   ├── dog.ts              # Interface Dog e DogFormData
│   │   └── puppy.ts            # Interface Puppy e PuppyFormData
│   ├── App.tsx                 # Configuração de rotas e providers
│   └── main.tsx                # Entry point
├── supabase/
│   ├── config.toml             # Configuração do projeto Supabase local
│   └── migrations/             # Histórico de migrações SQL
├── Dockerfile                  # Build multi-stage: Node → nginx
├── docker-compose.yml          # Configuração de deploy com Traefik
├── nginx.conf                  # Configuração do nginx para SPA
└── vite.config.ts              # Configuração do Vite
```

---

## Banco de Dados

O banco de dados é PostgreSQL gerenciado pelo Supabase. Abaixo o diagrama conceitual das entidades principais:

### Entidades e Relacionamentos

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│    dogs     │     │   puppies    │     │  hotel_packages │
├─────────────┤     ├──────────────┤     ├─────────────────┤
│ id (uuid)   │     │ id (uuid)    │     │ id (uuid)       │
│ name        │     │ name         │     │ name            │
│ breed       │     │ breed        │     │ price           │
│ gender      │     │ gender       │     │ description     │
│ status      │     │ status       │     │ features (json) │
│ birth_date  │     │ birth_date   │     │ is_popular      │
│ weight      │     │ weight       │     │ is_active       │
│ height      │     │ height       │     │ display_order   │
│ color       │     │ color        │     └─────────────────┘
│ temperament │     │ temperament  │
│ description │     │ description  │     ┌──────────────────┐
│ pedigree    │     │ pedigree     │     │   company_info   │
│ microchip   │     │ microchip    │     ├──────────────────┤
│ image_url   │     │ image_url    │     │ id (uuid)        │
│ images[]    │     │ images[]     │     │ name             │
│ parents     │     │ parents      │     │ slogan           │
│ offspring[] │     │ price        │     │ mission          │
│ achievements│     │ achievements │     │ vision           │
│ medical_rec │     │ medical_rec  │     │ values           │
│ is_active   │     │ is_active    │     │ address          │
│ is_avail_br │     │ is_avail_sale│     │ phone            │
│ price       │     └──────────────┘     │ email            │
└─────────────┘                          │ logo_url         │
                                         │ social_media     │
┌─────────────┐     ┌──────────────┐     └──────────────────┘
│  contacts   │     │     faq      │
├─────────────┤     ├──────────────┤     ┌──────────────────┐
│ id (uuid)   │     │ id (uuid)    │     │    profiles      │
│ name        │     │ question     │     ├──────────────────┤
│ email       │     │ answer       │     │ id (uuid)        │
│ phone       │     │ category     │     │ full_name        │
│ message     │     │ is_published │     │ email            │
│ subject     │     │ order_index  │     │ role             │
│ contact_type│     │ source       │     │ avatar_url       │
│ status      │     └──────────────┘     └──────────────────┘
└─────────────┘
```

### Tabelas Auxiliares

| Tabela | Descrição |
|---|---|
| `articles` | Artigos e notícias do blog |
| `events` | Eventos e exposições do canil |
| `documents` | Documentos e arquivos para download |
| `glossary` | Glossário de termos técnicos |
| `team_members` | Membros da equipe para a página Sobre |
| `Leads` | Leads capturados via chatbot (n8n) |
| `n8n_chat_histories` | Histórico de conversas do chatbot |

### Funções SQL Customizadas

| Função | Descrição |
|---|---|
| `get_current_user_role()` | Retorna o papel (role) do usuário autenticado atual |
| `is_admin(user_id?)` | Verifica se um usuário possui perfil de administrador |

---

## Autenticação e Segurança

### Fluxo de Autenticação

```
Usuário → Login (email + senha)
    → supabase.auth.signInWithPassword()
    → JWT Token armazenado no localStorage
    → AuthContext atualiza estado global (user, session)
    → Redirecionamento para área admin
```

### Contexto de Autenticação ([`AuthContext`](src/contexts/AuthContext.tsx))

O [`AuthProvider`](src/contexts/AuthContext.tsx:25) expõe:

| Método/Propriedade | Tipo | Descrição |
|---|---|---|
| `user` | `User \| null` | Usuário autenticado atual |
| `session` | `Session \| null` | Sessão JWT ativa |
| `loading` | `boolean` | Estado de carregamento inicial |
| `signIn(email, password)` | `Promise` | Login com email/senha |
| `signUp(email, password, fullName)` | `Promise` | Cadastro de novo usuário |
| `signOut()` | `Promise` | Encerramento da sessão |

### Controle de Acesso

- **Área Pública**: todas as rotas sem prefixo `/admin/` são acessíveis sem autenticação.
- **Área Administrativa**: rotas com prefixo `/admin/` exigem usuário autenticado.
- **Row Level Security (RLS)**: políticas de segurança em nível de linha no PostgreSQL controlam o acesso às tabelas via Supabase.
- **Roles**: a função `is_admin()` no banco de dados verifica o campo `role` na tabela `profiles` para distinguir administradores de usuários comuns.

---

## Infraestrutura e Deploy

### Build Multi-Stage ([`Dockerfile`](Dockerfile))

```
Stage 1 (build): node:20-alpine
  └── npm ci → npm run build → /app/dist

Stage 2 (serve): nginx:alpine
  └── /app/dist → /usr/share/nginx/html
  └── nginx.conf customizado (SPA routing)
  └── EXPOSE 80
```

### Deploy em Produção ([`docker-compose.yml`](docker-compose.yml))

| Configuração | Valor |
|---|---|
| Domínio | `www.astorhouse.com.br` |
| TLS | Let's Encrypt via Traefik (`letsencryptresolver`) |
| Entrypoint | `websecure` (HTTPS) |
| Rede Docker | `rede_mibi` (externa, compartilhada) |
| Restart policy | `unless-stopped` |

### Comandos de Desenvolvimento

```sh
# Instalar dependências
npm install

# Servidor de desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Linting
npm run lint
```

---

## Epics e User Stories

---

### Epic 1 — Presença Digital e Identidade da Marca

**Objetivo:** Apresentar o canil AstorHouse com credibilidade, transmitindo os valores da empresa e convertendo visitantes em leads.

**Páginas relacionadas:** [`Index.tsx`](src/pages/Index.tsx), [`About.tsx`](src/pages/About.tsx)

---

#### US-1.1 — Homepage com Identidade Visual

**Como** visitante do site,  
**Quero** ver uma homepage profissional com informações sobre o canil,  
**Para** entender rapidamente o que é o AstorHouse e decidir se tenho interesse.

**Critérios de Aceitação:**
- [ ] Exibir seção hero com imagem de fundo, nome e slogan do canil
- [ ] Exibir quatro diferenciais do canil em cards (Criação Responsável, Pedigree Certificado, Amor e Dedicação, Adestramento Especializado)
- [ ] Exibir seção de números/conquistas (20+ anos, 600+ cães, 300+ avaliações, 1000+ filhotes)
- [ ] Exibir CTA (Call to Action) com links para "Conheça Nossos Cães" e "Fale Conosco"
- [ ] Nome e slogan exibidos devem ser carregados dinamicamente da tabela `company_info`
- [ ] Página deve ser totalmente responsiva (mobile, tablet, desktop)

**Notas Técnicas:**
- Dados carregados via [`useCompanyInfo()`](src/hooks/useCompanyInfo.ts:6) (React Query)
- Fallback para valores estáticos caso `company_info` esteja vazia

---

#### US-1.2 — Página Sobre o Canil

**Como** visitante interessado,  
**Quero** conhecer a história, missão e equipe do AstorHouse,  
**Para** criar confiança antes de entrar em contato.

**Critérios de Aceitação:**
- [ ] Exibir história do canil e informações institucionais
- [ ] Exibir missão, visão e valores do canil
- [ ] Exibir membros da equipe (nome, cargo, bio, foto) da tabela `team_members`
- [ ] Exibir informações de contato (telefone, e-mail, endereço)

---

#### US-1.3 — Botão Flutuante do WhatsApp

**Como** visitante em qualquer página do site,  
**Quero** ter acesso rápido ao WhatsApp do canil,  
**Para** iniciar uma conversa de forma imediata.

**Critérios de Aceitação:**
- [ ] Botão do WhatsApp visível em todas as páginas (componente [`WhatsAppBubble`](src/components/ui/whatsapp-bubble.tsx))
- [ ] Ao clicar, abrir conversa no WhatsApp com o número `+55 11 4035-4243`
- [ ] Botão deve ser fixo no canto inferior da tela e não obstruir o conteúdo principal

---

### Epic 2 — Catálogo de Cães Reprodutores

**Objetivo:** Apresentar o plantel de cães reprodutores do canil com informações detalhadas para interessados em reprodução ou aquisição.

**Páginas relacionadas:** [`Dogs.tsx`](src/pages/Dogs.tsx), [`DogDetail.tsx`](src/pages/DogDetail.tsx)

---

#### US-2.1 — Listagem do Plantel de Cães

**Como** visitante interessado em reprodução,  
**Quero** ver todos os cães reprodutores do canil,  
**Para** conhecer o plantel disponível e suas características.

**Critérios de Aceitação:**
- [ ] Listar todos os cães com `is_active = true` da tabela `dogs`
- [ ] Exibir foto principal, nome, raça, gênero, cor e status de cada cão
- [ ] Permitir filtrar por raça (Pastor Australiano, Pomerânia, Rottweiler) e gênero
- [ ] Exibir badge de status: Garanhão, Reprodutora, Jovem Promessa, Aposentado, Disponível
- [ ] Clicar em um cão deve navegar para a página de detalhes (`/caes/:id`)
- [ ] Exibir estado de carregamento durante fetch dos dados

**Notas Técnicas:**
- Hook [`useDogs()`](src/hooks/useDogs.ts:16) e [`useDogsByBreed()`](src/hooks/useDogs.ts:144)
- Filtro `is_active = true` aplicado na query

---

#### US-2.2 — Detalhes Completos de um Cão

**Como** visitante interessado,  
**Quero** ver todas as informações de um cão específico,  
**Para** avaliar seu potencial genético e condições de saúde.

**Critérios de Aceitação:**
- [ ] Exibir galeria de fotos (imagem principal + galeria `images[]`)
- [ ] Exibir informações completas: nome, raça, data de nascimento, peso, altura, cor, temperamento
- [ ] Exibir status de saúde e vacinação
- [ ] Exibir pedigree e microchip quando disponíveis
- [ ] Exibir conquistas/títulos do cão (`achievements[]`)
- [ ] Exibir informações dos pais (pai e mãe) quando disponíveis
- [ ] Exibir prontuário médico (exames, vacinações, tratamentos) para usuários admin
- [ ] Exibir CTA para contato via WhatsApp

---

### Epic 3 — Venda de Filhotes

**Objetivo:** Apresentar filhotes disponíveis para venda com informações completas para facilitar a decisão de compra.

**Páginas relacionadas:** [`Puppies.tsx`](src/pages/Puppies.tsx)

---

#### US-3.1 — Listagem de Filhotes Disponíveis

**Como** pessoa interessada em adquirir um filhote,  
**Quero** ver os filhotes disponíveis do canil,  
**Para** conhecer as opções e entrar em contato para reserva.

**Critérios de Aceitação:**
- [ ] Listar filhotes com `is_active = true` da tabela `puppies`
- [ ] Exibir foto, nome, raça, gênero, cor, idade e status de disponibilidade
- [ ] Exibir badge de status: Disponível, Reservado, Vendido, Não Disponível
- [ ] Exibir preço quando `is_available_for_sale = true` e `price` for preenchido
- [ ] Filhotes "Reservado" e "Vendido" devem aparecer com indicação visual diferenciada
- [ ] Exibir botão de contato via WhatsApp para filhotes disponíveis

**Status de Filhotes:**
| Status | Descrição |
|---|---|
| `disponivel` | Filhote disponível para venda |
| `reservado` | Reserva confirmada, aguardando pagamento |
| `vendido` | Filhote já vendido |
| `nao_disponivel` | Não disponível por outros motivos |

---

#### US-3.2 — Informações Detalhadas do Filhote

**Como** comprador em potencial,  
**Quero** ver todas as informações de um filhote,  
**Para** tomar uma decisão de compra informada.

**Critérios de Aceitação:**
- [ ] Exibir galeria de fotos do filhote
- [ ] Exibir dados completos: data de nascimento, peso, altura, temperamento
- [ ] Exibir status de saúde, vacinação e microchip
- [ ] Exibir informações dos pais (genealogia)
- [ ] Exibir informações de pedigree quando disponível
- [ ] Exibir histórico médico (exames e vacinações)

---

### Epic 4 — Hotel Canino

**Objetivo:** Apresentar o serviço de hotel canino, sua infraestrutura, pacotes e preços para captação de reservas.

**Páginas relacionadas:** [`Hotel.tsx`](src/pages/Hotel.tsx)

---

#### US-4.1 — Apresentação do Hotel Canino

**Como** tutor de cachorro que precisa viajar,  
**Quero** conhecer o hotel canino do AstorHouse,  
**Para** avaliar se é o lugar certo para deixar meu pet.

**Critérios de Aceitação:**
- [ ] Exibir hero com nome do hotel, badge "5 Estrelas" e "Segurança 24h"
- [ ] Exibir carrossel de fotos da infraestrutura (mínimo 5 imagens)
- [ ] Exibir diferenciais do serviço: Segurança 24h, Cuidado Veterinário, Socialização
- [ ] Exibir seção com depoimentos de hóspedes anteriores em carrossel

---

#### US-4.2 — Pacotes e Preços do Hotel

**Como** tutor interessado em hospedar meu pet,  
**Quero** ver os pacotes disponíveis e seus preços,  
**Para** escolher a opção que melhor atende minhas necessidades.

**Critérios de Aceitação:**
- [ ] Listar pacotes ativos (`is_active = true`) da tabela `hotel_packages` ordenados por `display_order`
- [ ] Exibir nome, descrição, preço por dia e lista de recursos inclusos de cada pacote
- [ ] Destacar visualmente o pacote marcado como `is_popular`
- [ ] Exibir tabela de descontos por período (10+ dias: 5%, 15+ dias: 10%, 30+ dias: 15%)
- [ ] Exibir informações de check-in/check-out e taxa de reserva
- [ ] Exibir CTA para reserva via WhatsApp

**Notas Técnicas:**
- Hook [`useHotelPackages()`](src/hooks/useHotelPackages.ts:18) com React Query

---

### Epic 5 — Adestramento

**Objetivo:** Apresentar os serviços de adestramento do canil, metodologias e como contratar.

**Páginas relacionadas:** [`Training.tsx`](src/pages/Training.tsx)

---

#### US-5.1 — Página de Adestramento

**Como** tutor interessado em treinar meu cão,  
**Quero** conhecer os serviços de adestramento oferecidos,  
**Para** entender as modalidades, metodologia e como contratar.

**Critérios de Aceitação:**
- [ ] Apresentar as modalidades de adestramento disponíveis
- [ ] Descrever a metodologia utilizada
- [ ] Exibir informações sobre o treinador (Robson)
- [ ] Exibir CTA para contato via WhatsApp

---

### Epic 6 — Comunicação e Relacionamento com o Cliente

**Objetivo:** Facilitar o contato entre visitantes e o canil, capturando leads qualificados e respondendo dúvidas.

**Páginas relacionadas:** [`Contact.tsx`](src/pages/Contact.tsx), [`FAQ.tsx`](src/pages/FAQ.tsx)

---

#### US-6.1 — Formulário de Contato

**Como** visitante interessado em algum serviço,  
**Quero** enviar uma mensagem para o canil,  
**Para** receber informações personalizadas sobre o que preciso.

**Critérios de Aceitação:**
- [ ] Formulário com campos: nome (obrigatório), e-mail (obrigatório), telefone (opcional), assunto, tipo de contato e mensagem (obrigatório)
- [ ] Validação de campos obrigatórios antes do envio
- [ ] Validação de formato de e-mail
- [ ] Salvar contato na tabela `contacts` com `status = 'novo'`
- [ ] Exibir confirmação de envio após sucesso
- [ ] Exibir mensagem de erro em caso de falha

**Tipos de Contato:**
| Tipo | Descrição |
|---|---|
| `filhote` | Interesse em adquirir filhote |
| `reproducao` | Interesse em reprodução |
| `hotel` | Interesse no hotel canino |
| `adestramento` | Interesse em adestramento |
| `outro` | Outros assuntos |

---

#### US-6.2 — Perguntas Frequentes (FAQ)

**Como** visitante com dúvidas,  
**Quero** consultar perguntas e respostas frequentes,  
**Para** obter informações sem precisar entrar em contato.

**Critérios de Aceitação:**
- [ ] Exibir apenas FAQs com `is_published = true`, ordenados por `order_index`
- [ ] Agrupar FAQs por categoria
- [ ] Utilizar componente de accordion para expandir/recolher respostas
- [ ] Exibir campo de busca para filtrar perguntas

**Notas Técnicas:**
- Hook [`useFAQ()`](src/hooks/useFAQ.ts:17) — filtragem de `is_published` feita no cliente

---

### Epic 7 — Painel Administrativo (Backoffice)

**Objetivo:** Permitir que administradores autenticados gerenciem todo o conteúdo do site de forma autônoma.

**Páginas relacionadas:** [`DogManagement.tsx`](src/pages/DogManagement.tsx), [`PuppyManagement.tsx`](src/pages/PuppyManagement.tsx), [`HotelManagement.tsx`](src/pages/HotelManagement.tsx), [`FAQManagement.tsx`](src/pages/FAQManagement.tsx), [`ContactManagement.tsx`](src/pages/ContactManagement.tsx), [`CompanyInfoManagement.tsx`](src/pages/CompanyInfoManagement.tsx)

---

#### US-7.1 — Gestão de Cães Reprodutores

**Como** administrador,  
**Quero** cadastrar, editar e gerenciar os cães do plantel,  
**Para** manter o catálogo público sempre atualizado.

**Critérios de Aceitação:**
- [ ] Listar todos os cães (ativos e inativos) com paginação
- [ ] Formulário de cadastro com todos os campos da interface [`Dog`](src/types/dog.ts:1)
- [ ] Upload de foto principal e galeria de fotos via Supabase Storage
- [ ] Editar qualquer campo de um cão existente
- [ ] Desativar (soft delete) um cão — `is_active = false`
- [ ] Exibir feedback de sucesso/erro após cada operação

**Raças Suportadas:**
| Valor | Label |
|---|---|
| `australian_shepherd` | Pastor Australiano |
| `pomeranian` | Lulu da Pomerânia |
| `rottweiler` | Rottweiler |

**Status dos Cães Adultos:**
| Valor | Label |
|---|---|
| `garanhao` | Garanhão |
| `reprodutora` | Reprodutora |
| `jovem_promessa` | Jovem Promessa |
| `aposentado` | Aposentado |
| `disponivel` | Disponível |

---

#### US-7.2 — Gestão de Filhotes

**Como** administrador,  
**Quero** cadastrar e gerenciar os filhotes disponíveis para venda,  
**Para** manter a vitrine de filhotes atualizada com disponibilidade e preços corretos.

**Critérios de Aceitação:**
- [ ] CRUD completo de filhotes (tabela `puppies`)
- [ ] Upload de fotos e galeria via Supabase Storage
- [ ] Atualizar status de disponibilidade (Disponível → Reservado → Vendido)
- [ ] Definir preço de venda quando aplicável
- [ ] Vincular filhote aos pais (campos `parents.father` e `parents.mother`)

---

#### US-7.3 — Gestão de Pacotes do Hotel

**Como** administrador,  
**Quero** criar e gerenciar os pacotes de hospedagem canina,  
**Para** manter os preços e features sempre atualizados na página do hotel.

**Critérios de Aceitação:**
- [ ] Listar todos os pacotes (ativos e inativos)
- [ ] Criar novo pacote com nome, descrição, preço, lista de features e ordem de exibição
- [ ] Marcar um pacote como "Mais Popular" (`is_popular`)
- [ ] Ativar/desativar pacotes sem excluí-los
- [ ] Reordenar pacotes via `display_order`
- [ ] Excluir pacotes permanentemente

**Notas Técnicas:**
- Hooks: [`useCreateHotelPackage`](src/hooks/useHotelPackages.ts:49), [`useUpdateHotelPackage`](src/hooks/useHotelPackages.ts:74), [`useDeleteHotelPackage`](src/hooks/useHotelPackages.ts:100)

---

#### US-7.4 — Gestão de FAQ

**Como** administrador,  
**Quero** criar e gerenciar perguntas e respostas frequentes,  
**Para** reduzir o volume de contatos com dúvidas comuns.

**Critérios de Aceitação:**
- [ ] CRUD completo de FAQs (tabela `faq`)
- [ ] Publicar/despublicar FAQs (`is_published`)
- [ ] Definir categoria e ordem de exibição
- [ ] Contador de rascunhos (FAQs não publicados) visível no menu admin com badge de notificação
- [ ] Ao acessar `/admin/faq`, exibir contagem de rascunhos pendentes

**Notas Técnicas:**
- [`getDraftCount()`](src/hooks/useFAQ.ts:122) usado no [`Header.tsx`](src/components/layout/Header.tsx) para badge de notificação

---

#### US-7.5 — Gestão de Contatos Recebidos

**Como** administrador,  
**Quero** visualizar e gerenciar os contatos enviados pelo formulário do site,  
**Para** acompanhar e responder leads de forma organizada.

**Critérios de Aceitação:**
- [ ] Listar todos os contatos da tabela `contacts` em ordem cronológica decrescente
- [ ] Exibir nome, e-mail, telefone, tipo de contato, assunto e data
- [ ] Filtrar contatos por status (Novo, Em atendimento, Finalizado)
- [ ] Atualizar status de um contato
- [ ] Visualizar a mensagem completa de cada contato

---

#### US-7.6 — Gestão de Informações da Empresa

**Como** administrador,  
**Quero** editar as informações institucionais do canil,  
**Para** manter o site atualizado sem precisar alterar o código-fonte.

**Critérios de Aceitação:**
- [ ] Formulário de edição para todos os campos da tabela `company_info`
- [ ] Campos: nome, slogan, missão, visão, valores, endereço, telefone, e-mail, redes sociais
- [ ] Upload de logo via Supabase Storage
- [ ] Operação de upsert (cria se não existir, atualiza se existir)
- [ ] Dados refletidos imediatamente no header e homepage após atualização

**Notas Técnicas:**
- Hook [`useUpdateCompanyInfo()`](src/hooks/useCompanyInfo.ts:20) usa `useMutation` com `queryClient.invalidateQueries`

---

### Epic 8 — Autenticação e Controle de Acesso

**Objetivo:** Garantir que apenas usuários autorizados acessem o painel administrativo.

**Páginas relacionadas:** [`Login.tsx`](src/pages/Login.tsx)

---

#### US-8.1 — Login de Administrador

**Como** administrador do canil,  
**Quero** fazer login com meu e-mail e senha,  
**Para** acessar o painel de gerenciamento do site.

**Critérios de Aceitação:**
- [ ] Formulário de login com campos e-mail e senha
- [ ] Validação de campos obrigatórios
- [ ] Exibir mensagem de erro em caso de credenciais inválidas
- [ ] Redirecionar para a área inicial após login bem-sucedido
- [ ] Exibir toast de boas-vindas após login
- [ ] Sessão persistida via JWT (Supabase Auth)

**Mensagens de Erro Tratadas:**
| Erro Supabase | Mensagem ao Usuário |
|---|---|
| `Invalid login credentials` | "E-mail ou senha incorretos" |
| `Email not confirmed` | "Confirme seu e-mail antes de fazer login" |
| Genérico | "Erro ao fazer login" |

---

#### US-8.2 — Logout

**Como** administrador autenticado,  
**Quero** sair do sistema de forma segura,  
**Para** proteger o acesso ao painel em dispositivos compartilhados.

**Critérios de Aceitação:**
- [ ] Botão de logout disponível no menu dropdown da área restrita
- [ ] Encerrar sessão via `supabase.auth.signOut()`
- [ ] Redirecionar para a homepage após logout
- [ ] Exibir toast de confirmação de logout

---

#### US-8.3 — Proteção de Rotas Administrativas

**Como** sistema,  
**Quero** bloquear acesso às rotas `/admin/*` para usuários não autenticados,  
**Para** garantir a segurança do painel administrativo.

**Critérios de Aceitação:**
- [ ] Menu "Área Restrita" visível no header apenas para usuários autenticados
- [ ] Usuários não autenticados que acessem `/admin/*` devem ser redirecionados para `/login`
- [ ] Estado de autenticação carregado antes de renderizar conteúdo protegido (`loading` state)

---

### Epic 9 — Conteúdo Editorial

**Objetivo:** Fornecer conteúdo informativo e educativo para o público alvo, fortalecendo a autoridade do canil.

**Páginas relacionadas:** [`Articles.tsx`](src/pages/Articles.tsx)

---

#### US-9.1 — Página de Artigos

**Como** visitante interessado em raças caninas,  
**Quero** ler artigos sobre Pastor Australiano e cuidados com cães,  
**Para** me informar e conhecer melhor a expertise do AstorHouse.

**Critérios de Aceitação:**
- [ ] Listar artigos com `is_published = true` da tabela `articles`
- [ ] Exibir título, imagem de capa, categoria, tags e excerpt
- [ ] Ordenar por data de criação decrescente (mais recentes primeiro)
- [ ] Filtrar por categoria

---

## Fluxos de Usuário

### Fluxo 1: Visitante → Compra de Filhote

```
Homepage → Filhotes → Ver filhote disponível
    → Clicar "Entrar em Contato via WhatsApp"
    → Conversa no WhatsApp com a equipe
    → Reserva e finalização da compra (offline)
```

### Fluxo 2: Visitante → Reserva Hotel Canino

```
Homepage → Hotel → Ver pacotes e preços
    → Clicar "Ligar Agora" (WhatsApp)
    → Confirmar disponibilidade e datas
    → Pagamento da taxa de reserva (offline)
```

### Fluxo 3: Visitante → Envio de Contato

```
Qualquer página → Formulário de Contato
    → Preencher dados e mensagem
    → Enviar → Salvo em `contacts` (status: "novo")
    → Admin recebe notificação e responde
```

### Fluxo 4: Administrador → Publicar Filhote

```
/login → Autenticação → Menu "Área Restrita"
    → /admin/filhotes → "+ Novo Filhote"
    → Preencher formulário + upload de fotos
    → Salvar → Filhote visível em /filhotes
```

### Fluxo 5: Administrador → Publicar FAQ

```
/admin/faq → "+ Nova Pergunta"
    → Preencher pergunta, resposta e categoria
    → Salvar como rascunho (is_published = false)
    → Revisar → Publicar (is_published = true)
    → FAQ visível em /faq
```

---

## Convenções de Desenvolvimento

### Organização de Componentes

- **Componentes de UI** (`src/components/ui/`): componentes atômicos e reutilizáveis, majoritariamente do shadcn/ui
- **Componentes de Layout** (`src/components/layout/`): Header e Footer presentes em todas as páginas
- **Páginas** (`src/pages/`): componentes de nível de rota; cada arquivo = uma rota

### Nomenclatura

| Tipo | Convenção | Exemplo |
|---|---|---|
| Componentes React | PascalCase | `DogManagement.tsx` |
| Hooks customizados | camelCase com prefixo `use` | `useDogs.ts` |
| Tipos/Interfaces | PascalCase | `Dog`, `HotelPackage` |
| Tabelas Supabase | snake_case | `hotel_packages`, `company_info` |
| Rotas públicas | kebab-case em pt-BR | `/adestramento`, `/filhotes` |
| Rotas admin | `/admin/` + kebab-case | `/admin/caes`, `/admin/hotel` |

### Gerenciamento de Estado

| Tipo de Estado | Solução |
|---|---|
| Estado do servidor (dados remotos) | TanStack React Query |
| Estado de autenticação | Context API (`AuthContext`) |
| Estado de formulários | React Hook Form + Zod |
| Estado local de UI | `useState` do React |

### Tratamento de Erros

- Erros de API exibidos via `toast` (Sonner ou shadcn/ui Toaster)
- Erros de autenticação com mensagens em português humanizadas
- Soft delete para entidades `dogs` (preservação de histórico)
- Hard delete para `hotel_packages` e `faq`

---

## Guia de Instalação e Execução Local

### Pré-requisitos

- Node.js >= 20
- npm >= 10
- Conta no [Supabase](https://supabase.com)

### Configuração

```sh
# 1. Clonar o repositório
git clone <YOUR_GIT_URL>
cd astorhouse

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
# Copiar .env.example para .env e preencher:
# VITE_SUPABASE_URL=https://seu-projeto.supabase.co
# VITE_SUPABASE_ANON_KEY=sua-chave-anonima

# 4. Aplicar migrações no Supabase
# Via Supabase CLI ou pelo dashboard

# 5. Iniciar servidor de desenvolvimento
npm run dev
# Acesse: http://localhost:5173
```

### Deploy via Docker

```sh
# Build da imagem
docker build -t astorhouse:latest .

# Executar localmente
docker run -p 8080:80 astorhouse:latest

# Deploy em produção (com Traefik)
docker-compose up -d
```

---

*Documentação gerada em: Abril/2026 — AstorHouse Canil Especializado em Pastor Australiano*
