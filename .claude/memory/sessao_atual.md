# Sessão Atual — AstorHouse

> Estado vivo da sessão de trabalho corrente. Atualizado a cada marco relevante.

**Data**: 2026-06-05
**Marco**: Setup da documentação e do `.claude` para o projeto.

---

## 📌 Sessão 2026-06-05 — Documentação + adaptação do `.claude`

### ✅ O que foi feito

- Gerados `PRD.md` (reverso) e `CLAUDE.md` na raiz do projeto.
- `.claude` adaptado do template Vet1Minuto para o AstorHouse: arquitetura/processo do modelo mantidos; identidade, regras de negócio e memória trocadas para o canil.
- Removidos artefatos do Vet1Minuto (memória de doses/multi-tenant/stack) e corrigida a permissão de `settings.json`.
- Criadas memórias: [[project-astorhouse]], [[regras-negocio-astorhouse]], [[stack-astorhouse]]; decisões D-001…D-003.

### ❌ Pendente / próximos passos

- Definir início da migração legado → MVC (`src/features/*`); criar tag `prototype-lovable` e `docs/migration-checklist.md` antes de usar `/migration-audit`.
- Padronizar package manager em `pnpm` (remover lockfiles legados bun/npm).
- Avaliar guard de rota para `/admin/*` (hoje sem proteção client-side; depende do RLS).
