# Dashboard — Especificação (Frontend)

## Problem Statement

Após o login, o casal precisa de uma visão geral rápida do estado do seu casamento — quantos convidados confirmaram, quantos presentes foram reservados — sem precisar navegar por múltiplas telas.

## Goals

- [ ] Casal visualiza resumo de convidados (pending/confirmed/declined) em um único card
- [ ] Casal visualiza resumo de presentes (available/reserved) em um único card
- [ ] Dashboard serve como ponto de entrada e orientação para próximas ações

## Out of Scope

| Feature                           | Razão             |
|-----------------------------------|-------------------|
| Gráficos e charts                 | Planejado para v2 |
| Feed de atividades recentes       | Planejado para v2 |
| Notificações de novas confirmações | Planejado para v2 |

---

## User Stories

### P1: Cards de resumo ⭐ MVP

**User Story:** Como casal, quero ver um resumo rápido de convidados e presentes assim que entro no painel.

**Acceptance Criteria:**

1. WHEN casal acessa `/dashboard` THEN sistema SHALL exibir card com contagem de convidados por status (pending, confirmed, declined)
2. WHEN casal acessa `/dashboard` THEN sistema SHALL exibir card com contagem de presentes por status (available, reserved)
3. WHEN casamento ainda não foi criado THEN sistema SHALL exibir card de "configure seu casamento" com CTA para `/wedding`
4. WHEN dados carregam THEN sistema SHALL exibir skeleton loader durante loading

---

### P2: Quick actions

**User Story:** Como casal, quero acessar ações frequentes diretamente do dashboard.

**Acceptance Criteria:**

1. WHEN casal visualiza dashboard THEN sistema SHALL exibir links rápidos para: adicionar convidado, adicionar presente, editar casamento
2. WHEN casal clica em link rápido THEN sistema SHALL navegar para a tela correspondente

---

## Requirement Traceability

| Requirement ID | Story                  | Status  |
|----------------|------------------------|---------|
| DASH-FE-01     | P1: Cards de resumo    | Pending |
| DASH-FE-02     | P2: Quick actions      | Pending |
