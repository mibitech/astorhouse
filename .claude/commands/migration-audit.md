# /migration-audit

Audita a cobertura da migração do protótipo Lovable (tag `prototype-lovable`) para a arquitetura MVC em `src/features/*`. Gera relatório markdown com 3 seções: ✅ Migrado · ❌ Faltando · 🗑️ Descartado conscientemente.

## Quando usar

- Depois de cada US entregue, para confirmar que os símbolos esperados aparecem em `src/features/`.
- Antes de fechar uma fase (ex.: encerrar Fase 1 do PRD) para garantir que nada do protótipo foi esquecido sem decisão.
- Quando suspeitar que um componente do protótipo "sumiu" sem virar feature.

## Pré-requisitos

- Tag git `prototype-lovable` existe (checar com `git tag -l prototype-lovable`).
- Arquivo [docs/migration-checklist.md](../../docs/migration-checklist.md) existe e está atualizado.
- Working tree limpo ou com mudanças stashadas (não obrigatório, mas evita confusão no relatório).

## O que executar (passo a passo)

### 1. Validar pré-requisitos

```bash
git tag -l prototype-lovable
test -f docs/migration-checklist.md && echo "checklist ok"
```

Se a tag não existir ou o checklist faltar, **pare** e reporte ao usuário antes de continuar.

### 2. Inventário de rotas

```bash
# Rotas do protótipo
git show prototype-lovable:src/App.tsx | grep -E "Route path"

# Rotas atuais
grep -E "Route path" src/App.tsx
```

Comparar lado a lado. Para cada rota antiga:

- **Existe hoje apontando para `features/`?** → ✅ Migrado.
- **Foi descartada com nota no checklist?** → 🗑️ Descartado.
- **Sumiu sem nota?** → ❌ Faltando (bug de migração).

### 3. Inventário de símbolos exportados pelo protótipo

```bash
# Símbolos exportados em cada arquivo deletado
for f in $(git show --stat prototype-lovable | grep -oE "src/(pages|hooks|lib)/[^ ]+"); do
  echo "=== $f ==="
  git show "prototype-lovable:$f" 2>/dev/null | \
    grep -oE "^export (const|function|type|interface) [A-Z][a-zA-Z]+" | \
    sort -u
done
```

Gera lista canônica de símbolos que existiam no protótipo.

### 4. Buscar cada símbolo em `src/features/`

Para cada símbolo da lista acima:

```bash
grep -rn "export.*<SIMBOLO>" src/features/ 2>/dev/null
grep -rn "import.*<SIMBOLO>.*from" src/features/ 2>/dev/null
```

Critérios:

- **Achou export equivalente em `src/features/`** → ✅ Migrado (anotar caminho).
- **Achou só import (mas não export)** → 🟡 Parcial — provavelmente vem de outra fonte. Investigar.
- **Não achou nada e está marcado `Descartado` no checklist** → 🗑️ Descartado intencional.
- **Não achou nada e está como `Pendente` ou `?` no checklist** → ❌ Faltando.

### 5. Cruzar com `docs/migration-checklist.md`

```bash
# Linhas ainda pendentes
grep "| Pendente |" docs/migration-checklist.md

# Linhas com status indefinido
grep "| ? |" docs/migration-checklist.md
```

Toda linha desses dois grupos vira item de "ação necessária".

### 6. Verificar DoD da migração

```bash
# DoD-1: zero Pendente
PEND=$(grep -c "| Pendente |" docs/migration-checklist.md)
echo "DoD-1 (zero Pendente): $PEND"

# DoD-2: zero pages legadas (só NotFound)
LEG=$(ls src/pages/ 2>/dev/null | grep -v "NotFound.tsx" | wc -l)
echo "DoD-2 (zero pages legadas): $LEG"

# DoD-3: App.tsx importa de features/
FEAT=$(grep -c "from \"@/features/" src/App.tsx)
echo "DoD-3 (App usa features): $FEAT"

# DoD-4: lint estrito limpo
pnpm lint 2>&1 | tail -3

# DoD-5: build limpo
pnpm build 2>&1 | tail -3
```

### 7. Gerar relatório

Formato obrigatório de saída (escrever no chat ao usuário, **não** salvar em arquivo a menos que ele peça):

```markdown
# Migration Audit — <YYYY-MM-DD HH:MM>

## Resumo

- Símbolos do protótipo: <N>
- ✅ Migrados: <X> (<X/N>%)
- ❌ Faltando: <Y>
- 🗑️ Descartados conscientemente: <Z>

## ✅ Migrado (<X>)

| Símbolo | Origem | Destino atual |
| ------- | ------ | ------------- |
| ...     | ...    | ...           |

## ❌ Faltando (<Y>)

| Símbolo | Origem | US esperada | Bloqueia? |
| ------- | ------ | ----------- | --------- |
| ...     | ...    | ...         | sim/não   |

## 🗑️ Descartado (<Z>)

| Símbolo | Origem | Justificativa |
| ------- | ------ | ------------- |
| ...     | ...    | ...           |

## DoD da migração

- [ ] Zero Pendente no checklist (atual: <PEND>)
- [ ] Zero pages legadas (atual: <LEG>)
- [ ] App.tsx usa features/ (atual: <FEAT> imports)
- [ ] Lint estrito limpo (resultado: ✅/❌)
- [ ] Build limpo (resultado: ✅/❌)

## Ações recomendadas

<lista priorizada — itens ❌ Faltando primeiro, depois melhorias>
```

## Regras de comportamento

- **NÃO** modificar o `docs/migration-checklist.md` sem confirmação do usuário. Apenas reportar discrepâncias.
- **NÃO** rodar `pnpm build` ou `pnpm lint` se já houver evidência recente neste turno (evitar lentidão).
- **NÃO** deletar a tag `prototype-lovable` sob nenhuma circunstância — ela é a referência permanente do estado original.
- Se um símbolo aparece em `src/features/` mas o checklist diz `Pendente`, **avisar** o usuário para atualizar o checklist (não atualizar sozinho).
- Se um símbolo está como `Descartado` no checklist mas existe em `src/features/`, **avisar** — pode ser inconsistência semântica.

## Limites

Este comando **não**:

- Migra código automaticamente.
- Deleta arquivos.
- Edita o checklist.
- Faz commits.

É um auditor read-only. Toda ação corretiva é decisão do usuário.
