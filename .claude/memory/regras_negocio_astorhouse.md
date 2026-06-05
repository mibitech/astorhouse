---
name: regras-negocio-astorhouse
description: Regras de negócio do domínio do Canil AstorHouse — venda de filhotes, raças, hotel, adestramento, preços e restrições.
metadata:
  type: project
---

Regras de negócio do **Canil AstorHouse** (válidas para o site, o painel e a assistente Léssie):

- **Venda, não adoção**: o canil **vende** filhotes com **pedigree**. Nunca usar o termo "adoção".
- **Raças**: Pastor Australiano, Lulu da Pomerânia (Spitz Alemão) e Rottweiler (enum do form de filhote: `australian_shepherd`, `pomeranian`, `rottweiler`).
- **Status de filhote**: `disponivel`, `reservado`, `vendido`, `nao_disponivel`. Nunca afirmar disponibilidade sem confirmar nos dados.
- **Preços**: nunca inventar. Valores vêm do banco/FAQ. Não confundir preço de **adestramento** (R$ 2.350 / R$ 2.650) com preço de **filhote**.
- **Hotel canino**: pacotes em `hotel_packages`. Descontos por estadia: 10–14 dias → 5% · 15–29 → 10% · 30+ → 15%.
- **Adestramento**: método positivo; adestrador Robson (20+ anos).
- **Caudectomia proibida** — cauda natural sempre.
- **Locais**: Bragança Paulista/SP. Hotel/adestramento: R. Artur Guilardi, 114 (Jardim Recreio). Criação: Estr. Mun. Orlando Alfano, 562 (Rio das Pedras).
- **Contato**: WhatsApp (bolha no site, número `551140354243`) + formulário (`contacts`) + captura de leads (`Leads`, funil `novo → em_andamento → convertido/perdido/cancelado`).

**Entidades de domínio** (Supabase): `puppies` (filhotes à venda, `is_available_for_sale`),
`dogs` (cães reprodutores/plantel, `is_available_for_breeding`), `hotel_packages`, `faq`
(fonte primária da Léssie), `contacts`, `company_info`, `articles`/`news`/`events`,
`team_members`, `Leads`.

**Why**: domínio real do canil; a assistente Léssie e o site precisam ser consistentes.

**How to apply**: ao escrever copy, validações ou dados, respeite estes termos e restrições.
Relacionado: [[project-astorhouse]].
