# Guests — Especificação (Frontend)

## Problem Statement

O casal precisa gerenciar a lista de convidados do seu casamento: adicionar, editar, remover e acompanhar o status de confirmação de presença (RSVP) de cada convidado.

## Goals

- [ ] Casal gerencia 100% da lista de convidados via interface
- [ ] Visualização clara do status de cada convidado (pendente/confirmado/recusou)
- [ ] Filtros por status para facilitar acompanhamento

## Out of Scope

| Feature                              | Razão             |
|--------------------------------------|-------------------|
| Importar lista via CSV               | Planejado para v2 |
| Grupos de convidados (família)       | Fora do escopo v1 |
| Envio de convite por email/WhatsApp  | Planejado para v2 |

---

## User Stories

### P1: Listar convidados ⭐ MVP

**User Story:** Como casal, quero ver a lista completa de convidados com status de confirmação.

**Acceptance Criteria:**

1. WHEN casal acessa `/guests` THEN sistema SHALL chamar `GET /v1/guests` e exibir lista de convidados
2. WHEN lista está vazia THEN sistema SHALL exibir estado vazio com CTA para adicionar primeiro convidado
3. WHEN dados carregam THEN sistema SHALL exibir skeleton loader
4. WHEN casal filtra por status THEN sistema SHALL chamar `GET /v1/guests?status=<status>` e atualizar lista
5. WHEN lista tem muitos itens THEN sistema SHALL exibir todos (sem paginação no v1)

**Colunas da tabela:**
- Nome
- Status (badge colorido: pendente/confirmado/recusou)
- Data do RSVP (`rsvp_at`) — quando confirmou/recusou

---

### P1: Adicionar convidado ⭐ MVP

**User Story:** Como casal, quero adicionar convidados à lista um por um.

**Acceptance Criteria:**

1. WHEN casal clica em "Adicionar convidado" THEN sistema SHALL abrir modal/drawer com campo de nome
2. WHEN casal submete nome válido THEN sistema SHALL chamar `POST /v1/guests` e adicionar à lista
3. WHEN nome está vazio THEN sistema SHALL exibir erro de validação
4. WHEN convidado é adicionado com sucesso THEN sistema SHALL fechar modal e exibir toast de sucesso

---

### P1: Editar convidado ⭐ MVP

**User Story:** Como casal, quero corrigir o nome de um convidado.

**Acceptance Criteria:**

1. WHEN casal clica em editar convidado THEN sistema SHALL abrir modal com campo pré-preenchido
2. WHEN casal salva alteração THEN sistema SHALL chamar `PATCH /v1/guests/:guestID` e atualizar lista
3. WHEN nome está vazio THEN sistema SHALL exibir erro de validação

---

### P1: Remover convidado ⭐ MVP

**User Story:** Como casal, quero remover um convidado da lista.

**Acceptance Criteria:**

1. WHEN casal clica em remover convidado THEN sistema SHALL exibir diálogo de confirmação
2. WHEN casal confirma remoção THEN sistema SHALL chamar `DELETE /v1/guests/:guestID` e remover da lista
3. WHEN casal cancela THEN sistema SHALL fechar diálogo sem alteração

---

### P1: Resumo por status ⭐ MVP

**User Story:** Como casal, quero ver rapidamente quantos convidados estão em cada status.

**Acceptance Criteria:**

1. WHEN casal acessa `/guests` THEN sistema SHALL chamar `GET /v1/guests/summary` e exibir contadores (pendente, confirmado, recusou)
2. WHEN casal filtra a lista THEN sistema SHALL manter o resumo com totais gerais (não do filtro)

---

## Requirement Traceability

| Requirement ID | Story                   | Status  |
|----------------|-------------------------|---------|
| GUEST-FE-01    | P1: Listar convidados   | Pending |
| GUEST-FE-02    | P1: Adicionar convidado | Pending |
| GUEST-FE-03    | P1: Editar convidado    | Pending |
| GUEST-FE-04    | P1: Remover convidado   | Pending |
| GUEST-FE-05    | P1: Resumo por status   | Pending |
