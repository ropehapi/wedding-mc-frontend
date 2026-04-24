# Public Page — Especificação (Frontend)

## Problem Statement

Os convidados precisam de uma página pública, acessível por link direto sem autenticação, que consolide informações do casamento, permita confirmar presença e reservar presentes — tudo em uma única URL amigável.

## Goals

- [ ] Convidado acessa a página pelo slug e encontra todas as informações do casamento
- [ ] Convidado confirma/recusa presença sem criar conta (seleciona nome na lista)
- [ ] Convidado reserva presente sem criar conta (informa apenas o próprio nome)
- [ ] Visual romântico, elegante e acolhedor

## Out of Scope

| Feature                           | Razão             |
|-----------------------------------|-------------------|
| Customização de tema pelo casal   | Planejado para v2 |
| Mural de mensagens dos convidados | Fora do escopo v1 |
| Compartilhamento via botões sociais | Fora do escopo v1 |
| SEO / meta tags dinâmicas         | Sem necessidade   |

---

## User Stories

### P1: Página de informações do casamento ⭐ MVP

**User Story:** Como convidado, quero acessar a página do casamento e encontrar todas as informações do evento.

**Acceptance Criteria:**

1. WHEN convidado acessa `/:slug` THEN sistema SHALL chamar `GET /v1/public/:slug` e exibir dados do casamento
2. WHEN slug não existe THEN sistema SHALL exibir tela de "Casamento não encontrado"
3. WHEN dados carregam THEN sistema SHALL exibir: nomes do casal, data, horário, local, cidade, estado, descrição
4. WHEN casamento tem fotos THEN sistema SHALL exibir galeria de fotos
5. WHEN casamento tem links externos THEN sistema SHALL exibir seção de links clicáveis
6. WHEN dados carregam THEN sistema SHALL exibir skeleton loader

**Layout esperado:**
- Hero section: foto principal (primeira do array), nomes do casal em tipografia cursiva, data e local
- Seção de detalhes: horário, local completo, cidade/estado
- Seção de descrição (quando existir)
- Galeria de fotos (grid, quando existir)
- Seção de links externos (quando existir)

---

### P1: Fluxo de RSVP ⭐ MVP

**User Story:** Como convidado, quero confirmar ou recusar minha presença no casamento sem precisar criar conta.

**Acceptance Criteria:**

1. WHEN convidado acessa página pública THEN sistema SHALL exibir seção de RSVP
2. WHEN convidado clica em "Confirmar presença" THEN sistema SHALL chamar `GET /v1/public/:slug/guests` e exibir select com lista de nomes
3. WHEN convidado seleciona nome e confirma THEN sistema SHALL chamar `POST /v1/public/:slug/guests/:guestID/rsvp` com `status: "confirmed"`
4. WHEN convidado seleciona nome e recusa THEN sistema SHALL chamar com `status: "declined"`
5. WHEN RSVP é bem-sucedido THEN sistema SHALL exibir mensagem de confirmação personalizada
6. WHEN convidado já havia respondido (status != pending) THEN sistema SHALL exibir status atual
7. WHEN lista de convidados está vazia THEN sistema SHALL exibir mensagem informativa

**UX Flow:**
```
[Seção RSVP] → [Botão "Confirmar Presença"]
  → [Select: "Procure seu nome na lista"]
  → [Botão Confirmar / Botão Não poderei ir]
  → [Mensagem de sucesso]
```

---

### P1: Lista pública de presentes ⭐ MVP

**User Story:** Como convidado, quero ver a lista de presentes e escolher um para reservar.

**Acceptance Criteria:**

1. WHEN convidado acessa seção de presentes THEN sistema SHALL chamar `GET /v1/public/:slug/gifts` e exibir lista
2. WHEN presente está disponível THEN sistema SHALL exibir botão "Dar este presente"
3. WHEN presente está reservado THEN sistema SHALL exibir badge "Já reservado" sem botão de ação
4. WHEN lista de presentes está vazia THEN sistema SHALL ocultar a seção (ou exibir mensagem neutra)

**Layout esperado:**
- Grid de cards de presentes
- Card: imagem (quando disponível), nome, preço (quando disponível), link para loja, status, botão de ação

---

### P1: Fluxo de reserva de presente ⭐ MVP

**User Story:** Como convidado, quero reservar um presente informando apenas meu nome.

**Acceptance Criteria:**

1. WHEN convidado clica em "Dar este presente" THEN sistema SHALL abrir modal/drawer com campo de nome
2. WHEN convidado informa nome e confirma THEN sistema SHALL chamar `POST /v1/public/:slug/gifts/:giftID/reserve`
3. WHEN reserva é bem-sucedida THEN sistema SHALL fechar modal, atualizar card para "reservado" e exibir mensagem de sucesso
4. WHEN presente já foi reservado por outro (409 Conflict) THEN sistema SHALL exibir "Este presente já foi reservado por outra pessoa"
5. WHEN nome está vazio THEN sistema SHALL exibir erro de validação antes de submeter

---

## Design Notes

**Paleta:**
- Fundo: `#FDF8F0` (areia claro) ou branco puro
- Primária: `#C9956C` (rose gold / terracota suave)
- Secundária: `#8A9E7E` (verde sage)
- Texto: `#3D2B1F` (marrom escuro quente)
- Destaque: `#E8D5B7` (areia médio)

**Tipografia:**
- Títulos de destaque: Cormorant Garamond (serif cursiva, elegante)
- Corpo e UI: Lato ou Inter (sans-serif limpa)
- Datas e números: Playfair Display

**Componentes sugeridos:**
- Hero section com foto de fundo e overlay suave
- Seção de contagem regressiva até o casamento (nice-to-have v1)
- Cards de presentes em grid 2-3 colunas
- Modal com backdrop blur para fluxos de ação

---

## Requirement Traceability

| Requirement ID | Story                              | Status  |
|----------------|------------------------------------|---------|
| PUB-FE-01      | P1: Página de informações          | Pending |
| PUB-FE-02      | P1: Fluxo de RSVP                  | Pending |
| PUB-FE-03      | P1: Lista pública de presentes     | Pending |
| PUB-FE-04      | P1: Fluxo de reserva de presente   | Pending |
