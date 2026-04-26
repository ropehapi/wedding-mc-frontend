# Wedding — Especificação (Frontend)

## Problem Statement

O casal precisa configurar o perfil do seu casamento: dados do evento, fotos e links externos. Esses dados alimentam tanto o painel administrativo quanto a página pública acessada pelos convidados.

## Goals

- [ ] Casal configura todos os dados do casamento em uma única tela
- [ ] Upload de múltiplas fotos com preview
- [ ] Links externos gerenciados (adicionar, reordenar visualmente, remover)

## Out of Scope

| Feature                          | Razão             |
|----------------------------------|-------------------|
| Editor visual de layout          | Planejado para v2 |
| Temas/cores personalizados       | Planejado para v2 |
| Múltiplos casamentos             | Fora do escopo    |

---

## User Stories

### P1: Criar casamento ⭐ MVP

**User Story:** Como casal, quero criar meu casamento informando os dados do evento para gerar minha página pública.

**Acceptance Criteria:**

1. WHEN casal acessa `/wedding` sem casamento criado THEN sistema SHALL exibir formulário de criação
2. WHEN casal submete formulário com campos obrigatórios (nomes, data, local) THEN sistema SHALL chamar `POST /v1/wedding` e exibir dados salvos
3. WHEN formulário tem erros de validação THEN sistema SHALL exibir erros inline por campo
4. WHEN casamento é criado com sucesso THEN sistema SHALL exibir o slug gerado com link para a página pública

---

### P1: Editar casamento ⭐ MVP

**User Story:** Como casal, quero editar os dados do meu casamento a qualquer momento.

**Acceptance Criteria:**

1. WHEN casal acessa `/wedding` com casamento existente THEN sistema SHALL exibir formulário pré-preenchido com dados atuais
2. WHEN casal altera campos e salva THEN sistema SHALL chamar `PATCH /v1/wedding` e exibir toast de sucesso
3. WHEN casal cancela edição THEN sistema SHALL restaurar valores originais

**Campos do formulário:**
- Nome da noiva (`bride_name`) — obrigatório
- Nome do noivo (`groom_name`) — obrigatório
- Data (`date`) — obrigatório, date picker
- Horário (`time`) — opcional, time picker
- Local (`location`) — obrigatório
- Cidade (`city`) — opcional
- Estado (`state`) — opcional, select com UFs brasileiras
- Descrição (`description`) — opcional, textarea

---

### P1: Upload de fotos ⭐ MVP

**User Story:** Como casal, quero fazer upload de fotos para exibição na página pública.

**Acceptance Criteria:**

1. WHEN casal seleciona um arquivo de imagem (JPEG/PNG/WebP, max 10MB) THEN sistema SHALL chamar `POST /v1/wedding/photos` e exibir preview da foto
2. WHEN upload conclui com sucesso THEN sistema SHALL adicionar foto à galeria
3. WHEN casal clica em remover foto THEN sistema SHALL chamar `DELETE /v1/wedding/photos/:photoID` e remover da galeria
4. WHEN arquivo excede 10MB ou não é imagem THEN sistema SHALL exibir erro antes de fazer upload
5. WHEN upload está em progresso THEN sistema SHALL exibir indicador de loading

---

### P1: Links externos ⭐ MVP

**User Story:** Como casal, quero adicionar links externos (site do buffet, mapa, lista de presentes externa) à página do casamento.

**Acceptance Criteria:**

1. WHEN casal adiciona link com label e URL THEN sistema SHALL incluir no array `links` do `PATCH /v1/wedding`
2. WHEN casal remove link THEN sistema SHALL enviar array atualizado (sem o link removido) para `PATCH /v1/wedding`
3. WHEN links é array vazio THEN sistema SHALL enviar `links: []` explicitamente para limpar todos os links
4. WHEN URL é inválida THEN sistema SHALL exibir erro de validação inline

---

### P2: Preview do slug

**User Story:** Como casal, quero ver o link da minha página pública facilmente para compartilhar.

**Acceptance Criteria:**

1. WHEN casamento existe THEN sistema SHALL exibir URL completa da página pública com botão "Copiar link"
2. WHEN casal clica em "Copiar link" THEN sistema SHALL copiar URL para clipboard e exibir feedback visual

---

## Requirement Traceability

| Requirement ID | Story                   | Status  |
|----------------|-------------------------|---------|
| WED-FE-01      | P1: Criar casamento     | Pending |
| WED-FE-02      | P1: Editar casamento    | Pending |
| WED-FE-03      | P1: Upload de fotos     | Pending |
| WED-FE-04      | P1: Links externos      | Pending |
| WED-FE-05      | P2: Preview do slug     | Pending |
