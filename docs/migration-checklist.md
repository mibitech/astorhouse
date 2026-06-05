# Migration Checklist — Lovable (page+hook) → MVC feature-based

> Acompanha a migração da estrutura legada (`src/pages` + `src/hooks`) para a arquitetura
> **MVC feature-based** (`src/features/{feature}/{models,services,controllers,views}`),
> definida em [.claude/rules/architecture.md](../.claude/rules/architecture.md).
> Baseline do protótipo: tag git **`prototype-lovable`**. Auditoria: `/migration-audit`.

## Princípios da migração

- **Behavior-preserving**: o markup e o comportamento das telas são preservados; muda a organização (View → Controller → Service → Supabase).
- **Cliente Supabase**: permanece em `src/integrations/supabase/client.ts` (gerado pelo Lovable); os services importam dele.
- **Por fatia vertical**: cada feature migra inteira (model → service → controller → views → index), com `App.tsx` repontado e build verde, antes da próxima.
- **Soft delete** mantido para entidades com `is_active` (puppies/dogs). FAQ não tem `is_active` → exclusão física preservada.

## Status por feature

| Feature | Legado (pages/hooks) | Destino (`src/features/*`) | Status |
| ------- | -------------------- | -------------------------- | ------ |
| **faq** | `pages/FAQ.tsx`, `pages/FAQManagement.tsx`, `hooks/useFAQ.ts` | `features/faq/` (models/services/controllers/views) | ✅ Migrado |
| **hotel** | `pages/Hotel.tsx`, `pages/HotelManagement.tsx`, `hooks/useHotelPackages.ts` | `features/hotel/` | ✅ Migrado |
| **puppies** | `pages/Puppies.tsx`, `pages/PuppyManagement.tsx`, `hooks/usePuppies.ts`, `types/puppy.ts` | `features/puppies/` | ✅ Migrado |
| dogs | `pages/Dogs.tsx`, `pages/DogDetail.tsx`, `pages/DogManagement.tsx`, `hooks/useDogs.ts`, `types/dog.ts` | `features/dogs/` | ⬜ Pendente |
| **contacts** | `pages/Contact.tsx`, `pages/ContactManagement.tsx`, `hooks/useContacts.ts` | `features/contacts/` | ✅ Migrado |
| **company** | `pages/CompanyInfoManagement.tsx`, `hooks/useCompanyInfo.ts` | `features/company/` | ✅ Migrado |
| **auth** | `pages/Login.tsx`, `contexts/AuthContext.tsx` | `features/auth/` | ✅ Migrado |
| home/marketing | `pages/Index.tsx`, `pages/About.tsx`, `pages/Training.tsx`, `pages/Articles.tsx` | `features/marketing/` (a definir) | ⬜ Pendente |
| _NotFound_ | `pages/NotFound.tsx` | mantém em `pages/` (catch-all) | ➖ Mantém |

## Compartilhados (permanecem fora de `features/`)

- `components/ui/*` (shadcn), `components/layout/*` (Header/Footer) — primitivos/layout globais.
- `integrations/supabase/*` — cliente + types gerados.
- `hooks/use-mobile`, `hooks/use-toast` — utilitários globais.
- `hooks/useImageUpload.ts` — usado por features de mídia; avaliar mover para `features/_shared` quando 2+ features dependerem.

## Definition of Done (DoD) da migração

- [ ] Zero `⬜ Pendente` nesta tabela.
- [ ] Zero pages legadas em `src/pages/` (exceto `NotFound.tsx`).
- [ ] `App.tsx` importa as views de `@/features/*`.
- [ ] `npm run lint` limpo · `npm run build` sem erros.
- [ ] Hooks legados em `src/hooks/` removidos (exceto utilitários globais).

## Log

- **2026-06-05** — Feature **faq** migrada (primeira fatia/referência de padrão). Build e lint verdes. `App.tsx` e `Header.tsx` repontados; legado removido.
- **2026-06-05** — Feature **hotel** migrada (controller mantém TanStack Query; services isolam o Supabase). Build e lint verdes. `App.tsx` repontado; legado removido.
- **2026-06-05** — Feature **company** migrada. Consumidores (Header, Footer, Index, About, Contact) repontados para `@/features/company`; tipados os `any` de `social_media` no Footer com `SocialMedia`. Build e lint verdes; legado removido.
- **2026-06-05** — Feature **contacts** migrada. Formulário público do protótipo (não renderizado / código morto) removido; `ContactPage` vira informativa usando `@/features/company`. Tipado o `any` do badge de status. Build e lint verdes; legado removido.
- **2026-06-05** — Feature **auth** migrada. `AuthContext` vira controller usando `auth.service` (wrappers `supabase.auth`); consumidores (App, Header, Hotel/Contacts admin) repontados para `@/features/auth`. `src/contexts/` removido. Build verde (warning pré-existente de react-refresh por exportar provider+hook no mesmo arquivo).
- **2026-06-05** — Feature **puppies** migrada. Views grandes movidas com `git mv` + edições pontuais (preserva histórico). Service isola Supabase; controller mantém `usePuppies`/`usePuppiesByBreed` (soft delete). `renderPuppyCard(any)` tipado com `Puppy`. `types/puppy.ts` e `hooks/usePuppies.ts` removidos. Build e lint verdes.
