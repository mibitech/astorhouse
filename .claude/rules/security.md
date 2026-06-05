# Segurança

## Regras Absolutas

- **Zero secrets no código** — chaves, tokens e senhas apenas em `.env` / `.env.local`
- **RLS em todas as tabelas** — habilite no momento da criação, nunca depois
- **Validação server-side** — toda lógica sensível em Edge Functions, nunca só no client
- **Nunca confie no client** — dados vindos do browser são suspeitos por definição

## Supabase

- Chave `anon` apenas no client-side; `service_role` somente em Edge Functions
- Políticas RLS usam `auth.uid()` — nunca dados passados pelo client
- `SELECT` retorna apenas colunas necessárias — sem `select('*')` em produção

## OWASP Top 10 — Prevenções Obrigatórias

| Risco                     | Prevenção                                                   |
| ------------------------- | ----------------------------------------------------------- |
| Broken Access Control     | RLS + verificação de `user_id` nas queries                  |
| Injection                 | Sem SQL dinâmico; use o cliente Supabase tipado             |
| XSS                       | Sem `dangerouslySetInnerHTML` sem sanitização; sem `eval()` |
| Security Misconfiguration | `.env` no `.gitignore`; variáveis separadas por ambiente    |
| Sensitive Data Exposure   | HTTPS sempre; sem dados sensíveis em URL ou localStorage    |

## Regra de Negócio — Tabela `Leads` (compartilhada)

A tabela `"Leads"` (L maiúsculo, sempre entre aspas) é **compartilhada com a assistente
de WhatsApp Léssie**. PK textual `id_conversa` é a chave de dedup do bot; a escrita ocorre
via chave `anon`. Não altere essa semântica nem as policies de insert anon sem coordenar
com o repo `workspace-lessie-astorhouse`.

## Checklist Antes de Todo PR

- [ ] Nenhum secret no diff (`git diff | grep -E "sk_|pk_|password\s*="`)
- [ ] Toda nova tabela tem RLS habilitado e policy definida
- [ ] Inputs validados com zod antes de persistir
- [ ] `service_role` não importado em `src/`

Use `/security-check` para auditoria completa.
