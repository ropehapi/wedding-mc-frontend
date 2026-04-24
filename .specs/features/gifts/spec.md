# Gifts — Especificação (Frontend)

## Problem Statement

O casal precisa gerenciar a lista de presentes: adicionar itens com link para loja externa, acompanhar quais foram reservados por convidados, e cancelar reservas quando necessário.

## Goals

- [ ] Casal gerencia lista de presentes completa via interface
- [ ] Visualização clara do status de cada presente (disponível/reservado)
- [ ] Cancelamento de reserva com um clique

## Out of Scope

| Feature                          | Razão             |
|----------------------------------|-------------------|
| Pagamento integrado na plataforma | Planejado para v2 |
| Vaquinha / contribuição parcial  | Planejado para v2 |
| Categorias de presentes          | Fora do escopo v1 |

---

## User Stories

### P1: Listar presentes ⭐ MVP

**User Story:** Como casal, quero ver a lista de presentes com status de reserva.

**Acceptance Criteria:**

1. WHEN casal acessa `/gifts` THEN sistema SHALL chamar `GET /v1/gifts` e exibir lista de presentes
2. WHEN lista está vazia THEN sistema SHALL exibir estado vazio com CTA para adicionar primeiro presente
3. WHEN presente está reservado THEN sistema SHALL exibir nome de quem reservou (`reserved_by_name`) e data
4. WHEN casal filtra por status THEN sistema SHALL chamar `GET /v1/gifts?status=<status>` e atualizar lista

**Colunas da tabela:**
- Imagem (thumbnail se `image_url` disponível)
- Nome
- Preço (formatado em BRL)
- Status (badge: disponível/reservado)
- Reservado por (nome do convidado, quando reservado)
- Ações (editar, remover, cancelar reserva)

---

### P1: Adicionar presente ⭐ MVP

**User Story:** Como casal, quero adicionar presentes à lista com link para a loja.

**Acceptance Criteria:**

1. WHEN casal clica em "Adicionar presente" THEN sistema SHALL abrir modal com formulário
2. WHEN casal submete formulário válido THEN sistema SHALL chamar `POST /v1/gifts` e adicionar à lista
3. WHEN nome está vazio THEN sistema SHALL exibir erro de validação

**Campos do formulário:**
- Nome (`name`) — obrigatório
- Descrição (`description`) — opcional
- Preço (`price`) — opcional, numérico
- URL da imagem (`image_url`) — opcional
- URL da loja (`store_url`) — opcional

---

### P1: Editar presente ⭐ MVP

**User Story:** Como casal, quero editar os dados de um presente.

**Acceptance Criteria:**

1. WHEN casal clica em editar presente THEN sistema SHALL abrir modal com formulário pré-preenchido
2. WHEN casal salva THEN sistema SHALL chamar `PATCH /v1/gifts/:giftID` e atualizar lista
3. WHEN presente está reservado THEN sistema SHALL permitir edição mas exibir aviso

---

### P1: Remover presente ⭐ MVP

**User Story:** Como casal, quero remover um presente da lista.

**Acceptance Criteria:**

1. WHEN casal clica em remover presente THEN sistema SHALL exibir diálogo de confirmação
2. WHEN casal confirma THEN sistema SHALL chamar `DELETE /v1/gifts/:giftID` e remover da lista
3. WHEN presente está reservado THEN sistema SHALL exibir aviso extra antes de confirmar remoção

---

### P1: Cancelar reserva ⭐ MVP

**User Story:** Como casal, quero cancelar a reserva de um presente quando necessário.

**Acceptance Criteria:**

1. WHEN casal clica em "Cancelar reserva" em presente reservado THEN sistema SHALL exibir diálogo de confirmação
2. WHEN casal confirma THEN sistema SHALL chamar `DELETE /v1/gifts/:giftID/reserve` e atualizar status para "disponível"
3. WHEN cancelamento é bem-sucedido THEN sistema SHALL exibir toast de sucesso e atualizar lista

---

### P1: Resumo por status ⭐ MVP

**User Story:** Como casal, quero ver rapidamente quantos presentes estão disponíveis e quantos foram reservados.

**Acceptance Criteria:**

1. WHEN casal acessa `/gifts` THEN sistema SHALL chamar `GET /v1/gifts/summary` e exibir contadores (disponível, reservado)

---

## Requirement Traceability

| Requirement ID | Story                   | Status  |
|----------------|-------------------------|---------|
| GIFT-FE-01     | P1: Listar presentes    | Pending |
| GIFT-FE-02     | P1: Adicionar presente  | Pending |
| GIFT-FE-03     | P1: Editar presente     | Pending |
| GIFT-FE-04     | P1: Remover presente    | Pending |
| GIFT-FE-05     | P1: Cancelar reserva    | Pending |
| GIFT-FE-06     | P1: Resumo por status   | Pending |
