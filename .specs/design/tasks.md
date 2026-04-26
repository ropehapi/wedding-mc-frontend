# Tasks — wedding-mc-frontend

**Design:** `.specs/design/architecture.md`
**Status:** Draft

---

## Execution Plan

```
Phase 1 — Fundação (Sequential)
  T01 → T02 → T03 → T04 → T05 → T06 → T07 → T08

Phase 2 — Auth (Sequential após T08)
  T09 → T10 → T11 → T12 → T13

Phase 3 — Admin: Wedding (após T13)
  T14 → T15 → T16 → T17

Phase 4 — Admin: Guests & Gifts (Parallel após T13)
       ┌→ T18 → T19 → T20 → T21 ─┐
T13 ───┤                          ├─→ T28
       └→ T22 → T23 → T24 → T25 ─┘
              → T26 → T27 ───────┘

Phase 5 — Dashboard (após T13, T18, T22)
  T28 → T29

Phase 6 — Página Pública (Parallel após T08)
  T30 → T31 → T32 → T33 → T34

Phase 7 — Qualidade (após todas)
  T35 → T36 → T37
```

---

## Phase 1: Fundação

### T01: Criar projeto Vite + React + TypeScript

**What:** Inicializar projeto com `npm create vite@latest wedding-mc-frontend -- --template react-ts`
**Where:** `/` (raiz do repositório)
**Depends on:** Nenhuma
**Requirement:** -

**Done when:**
- [ ] `npm run dev` sobe servidor em `localhost:5173`
- [ ] `npm run build` compila sem erros
- [ ] TypeScript strict mode habilitado em `tsconfig.json`

---

### T02: Configurar Tailwind CSS

**What:** Instalar e configurar Tailwind CSS com PostCSS
**Where:** `tailwind.config.ts`, `src/styles/globals.css`
**Depends on:** T01
**Requirement:** -

**Done when:**
- [ ] Classes Tailwind funcionam nos componentes
- [ ] Design tokens do projeto definidos em `tailwind.config.ts` (cores admin + público)
- [ ] Fontes Google (Playfair Display, Cormorant Garamond, Inter, Lato) configuradas via `@import`

---

### T03: Instalar e configurar Shadcn/ui

**What:** Inicializar shadcn/ui e adicionar componentes base necessários
**Where:** `components.json`, `src/components/ui/`
**Depends on:** T02
**Requirement:** -

**Componentes a instalar:** button, input, label, form, card, badge, dialog, toast (sonner), table, select, skeleton, separator, dropdown-menu, avatar

**Done when:**
- [ ] `npx shadcn@latest init` executado com sucesso
- [ ] Todos os componentes listados instalados em `src/components/ui/`
- [ ] Componente `<Button>` renderiza corretamente com variantes

---

### T04: Configurar React Router

**What:** Instalar react-router-dom e criar estrutura de rotas
**Where:** `src/routes/index.tsx`, `src/main.tsx`
**Depends on:** T01
**Requirement:** AUTH-FE-03

**Done when:**
- [ ] `react-router-dom` instalado
- [ ] `BrowserRouter` configurado em `main.tsx`
- [ ] Rotas definidas: `/login`, `/register`, `/dashboard`, `/wedding`, `/guests`, `/gifts`, `/:slug`, `*`
- [ ] Cada rota aponta para placeholder page (pode ser componente vazio)

---

### T05: Criar cliente HTTP Axios com interceptors JWT

**What:** Configurar instância Axios com interceptor de request (injeta token) e interceptor de response (trata 401 + refresh)
**Where:** `src/api/client.ts`
**Depends on:** T01
**Requirement:** AUTH-FE-03, AUTH-FE-04

**Done when:**
- [ ] Instância Axios criada com `baseURL` de `VITE_API_URL`
- [ ] Request interceptor injeta `Authorization: Bearer <token>` quando token existe
- [ ] Response interceptor detecta 401, tenta refresh, faz retry do request original
- [ ] Quando refresh falha, limpa localStorage e redireciona para `/login`
- [ ] Fila de requests pendentes durante refresh (evita múltiplos refreshes simultâneos)

---

### T06: Criar AuthContext e hook useAuth

**What:** Context React com estado de autenticação global e funções login/logout
**Where:** `src/contexts/AuthContext.tsx`, `src/hooks/useAuth.ts`
**Depends on:** T05
**Requirement:** AUTH-FE-02, AUTH-FE-04

**Done when:**
- [ ] `AuthContext` provê: `user`, `isAuthenticated`, `isLoading`, `login()`, `logout()`
- [ ] `login()` chama API, armazena tokens em localStorage, atualiza estado
- [ ] `logout()` chama `POST /v1/auth/logout`, limpa localStorage, redireciona `/login`
- [ ] Na inicialização, verifica token existente no localStorage
- [ ] `useAuth()` hook exporta valores do context com type safety

---

### T07: Criar ProtectedRoute e PublicOnlyRoute

**What:** Componentes de rota que controlam acesso baseado em autenticação
**Where:** `src/routes/ProtectedRoute.tsx`, `src/routes/PublicOnlyRoute.tsx`
**Depends on:** T06
**Requirement:** AUTH-FE-03

**Done when:**
- [ ] `ProtectedRoute` redireciona para `/login` se não autenticado
- [ ] `PublicOnlyRoute` redireciona para `/dashboard` se autenticado
- [ ] Durante loading de auth inicial, exibe spinner (não redireciona prematuramente)
- [ ] Rotas do painel envolvidas em `ProtectedRoute` no router

---

### T08: Criar layouts base (Admin e Público)

**What:** Componentes de layout que envolvem as páginas de cada zona
**Where:** `src/components/layout/AdminLayout.tsx`, `src/components/layout/PublicLayout.tsx`
**Depends on:** T03, T06
**Requirement:** -

**Done when:**
- [ ] `AdminLayout`: sidebar com navegação (Dashboard, Casamento, Convidados, Presentes), header com nome do usuário e botão logout, área de conteúdo
- [ ] `PublicLayout`: wrapper minimalista sem sidebar, apenas área de conteúdo full-width
- [ ] Sidebar do admin responsiva (colapsável em mobile)
- [ ] Design tokens do tema admin aplicados

---

## Phase 2: Auth

### T09: Criar API functions de auth

**What:** Funções para chamar os endpoints de auth
**Where:** `src/api/auth.ts`
**Depends on:** T05
**Requirement:** AUTH-FE-01, AUTH-FE-02

**Done when:**
- [ ] `register(name, email, password)` → `POST /v1/auth/register`
- [ ] `login(email, password)` → `POST /v1/auth/login`
- [ ] `logout()` → `POST /v1/auth/logout`
- [ ] `refresh(refreshToken)` → `POST /v1/auth/refresh`
- [ ] Todos tipados com interfaces TypeScript

---

### T10: Criar página de Login

**What:** Tela de login com formulário validado
**Where:** `src/pages/admin/LoginPage.tsx`
**Depends on:** T03, T06, T09
**Requirement:** AUTH-FE-02

**Done when:**
- [ ] Formulário com campos email e senha
- [ ] Validação com zod: email válido, senha obrigatória
- [ ] Submit chama `useAuth().login()`
- [ ] Loading state no botão durante requisição
- [ ] Erro de credenciais exibido abaixo do formulário
- [ ] Link para `/register`
- [ ] Estética minimalista moderna (centralizado, card limpo)

---

### T11: Criar página de Registro

**What:** Tela de cadastro do casal
**Where:** `src/pages/admin/RegisterPage.tsx`
**Depends on:** T03, T09
**Requirement:** AUTH-FE-01

**Done when:**
- [ ] Formulário com campos: nome, email, senha
- [ ] Validação: nome obrigatório, email válido, senha mínimo 8 caracteres
- [ ] Submit chama `POST /v1/auth/register` e redireciona para `/login`
- [ ] Erro 409 (email duplicado) exibido no formulário
- [ ] Link para `/login`

---

### T12: Configurar TanStack Query

**What:** Instalar e configurar QueryClient como provider global
**Where:** `src/main.tsx`, `src/lib/queryClient.ts`
**Depends on:** T01
**Requirement:** -

**Done when:**
- [ ] `@tanstack/react-query` instalado
- [ ] `QueryClient` configurado com staleTime e retry razoáveis
- [ ] `QueryClientProvider` envolvendo o app em `main.tsx`
- [ ] React Query Devtools instalado (dev only)

---

### T13: Criar utilitários compartilhados

**What:** Funções utilitárias usadas em todo o projeto
**Where:** `src/lib/utils.ts`
**Depends on:** T01
**Requirement:** -

**Done when:**
- [ ] `cn()` — merge de classes Tailwind (clsx + tailwind-merge)
- [ ] `formatCurrency(value)` — formata em BRL (R$ 1.200,00)
- [ ] `formatDate(dateStr)` — formata "2026-11-15" → "15 de novembro de 2026"
- [ ] `formatTime(timeStr)` — formata "17:00" → "17h00"
- [ ] Tipos TypeScript exportados de `src/types/api.ts`

---

## Phase 3: Admin — Wedding

### T14: Criar API functions de wedding

**What:** Funções para chamar os endpoints de casamento
**Where:** `src/api/wedding.ts`
**Depends on:** T05
**Requirement:** WED-FE-01, WED-FE-02, WED-FE-03, WED-FE-04

**Done when:**
- [ ] `getWedding()` → `GET /v1/wedding`
- [ ] `createWedding(data)` → `POST /v1/wedding`
- [ ] `updateWedding(data)` → `PATCH /v1/wedding`
- [ ] `uploadPhoto(file)` → `POST /v1/wedding/photos` (multipart/form-data)
- [ ] `deletePhoto(photoID)` → `DELETE /v1/wedding/photos/:photoID`
- [ ] Todos tipados

---

### T15: Criar hook useWedding

**What:** Hook React Query para dados do casamento
**Where:** `src/hooks/useWedding.ts`
**Depends on:** T12, T14
**Requirement:** WED-FE-01, WED-FE-02

**Done when:**
- [ ] `useWedding()` retorna `{ wedding, isLoading, error }`
- [ ] `useCreateWedding()` mutation com invalidação de cache
- [ ] `useUpdateWedding()` mutation com invalidação de cache
- [ ] `useUploadPhoto()` mutation
- [ ] `useDeletePhoto()` mutation
- [ ] Cache invalidado corretamente após mutações

---

### T16: Criar formulário de casamento (dados + links)

**What:** Formulário para criar/editar casamento com todos os campos e gerenciamento dinâmico de links
**Where:** `src/pages/admin/WeddingPage.tsx`
**Depends on:** T08, T15, T13
**Requirement:** WED-FE-01, WED-FE-02, WED-FE-04, WED-FE-05

**Done when:**
- [ ] Formulário pré-preenchido quando casamento já existe (`PATCH`)
- [ ] Formulário vazio quando não existe (`POST`)
- [ ] Todos os campos: bride_name, groom_name, date (date picker), time, location, city, state (select UFs), description
- [ ] Seção de links: adicionar (label + URL), listar, remover
- [ ] Submit com loading state e toast de sucesso/erro
- [ ] Validação inline por campo
- [ ] Seção de preview do slug com botão "Copiar link"

---

### T17: Criar galeria de fotos com upload

**What:** Seção de gerenciamento de fotos dentro da WeddingPage
**Where:** `src/pages/admin/WeddingPage.tsx` (seção de fotos)
**Depends on:** T15
**Requirement:** WED-FE-03

**Done when:**
- [ ] Grid de fotos existentes com botão de remover em cada uma
- [ ] Botão de upload que abre seletor de arquivo (JPEG/PNG/WebP)
- [ ] Validação client-side: tipo e tamanho (max 10MB) antes do upload
- [ ] Progress indicator durante upload
- [ ] Nova foto aparece na galeria após upload bem-sucedido
- [ ] Confirmação antes de remover foto

---

## Phase 4: Admin — Guests

### T18: Criar API functions de guests

**What:** Funções para chamar os endpoints de convidados
**Where:** `src/api/guests.ts`
**Depends on:** T05
**Requirement:** GUEST-FE-01..05

**Done when:**
- [ ] `getGuests(status?)` → `GET /v1/guests?status=`
- [ ] `getGuestsSummary()` → `GET /v1/guests/summary`
- [ ] `createGuest(name)` → `POST /v1/guests`
- [ ] `updateGuest(id, name)` → `PATCH /v1/guests/:guestID`
- [ ] `deleteGuest(id)` → `DELETE /v1/guests/:guestID`

---

### T19: Criar hook useGuests

**What:** Hooks React Query para convidados
**Where:** `src/hooks/useGuests.ts`
**Depends on:** T12, T18
**Requirement:** GUEST-FE-01..05

**Done when:**
- [ ] `useGuests(status?)` com query
- [ ] `useGuestsSummary()` com query
- [ ] `useCreateGuest()` mutation + invalidação
- [ ] `useUpdateGuest()` mutation + invalidação
- [ ] `useDeleteGuest()` mutation + invalidação

---

### T20: Criar tabela de convidados

**What:** Componente de tabela com lista de convidados, filtros e ações
**Where:** `src/pages/admin/GuestsPage.tsx`
**Depends on:** T08, T19, T13
**Requirement:** GUEST-FE-01, GUEST-FE-05

**Done when:**
- [ ] Tabela com colunas: nome, status (badge colorido), data RSVP, ações
- [ ] Badges: pendente (cinza), confirmado (verde), recusou (vermelho)
- [ ] Filtros por status (All / Pendente / Confirmado / Recusou)
- [ ] Cards de resumo (totais por status) acima da tabela
- [ ] Empty state quando lista vazia
- [ ] Skeleton loader durante loading

---

### T21: Criar modais de adicionar/editar/remover convidado

**What:** Modais para as ações CRUD de convidados
**Where:** `src/pages/admin/GuestsPage.tsx` (modais inline)
**Depends on:** T19, T03
**Requirement:** GUEST-FE-02, GUEST-FE-03, GUEST-FE-04

**Done when:**
- [ ] Modal "Adicionar convidado": campo nome, submit, loading, toast
- [ ] Modal "Editar convidado": pré-preenchido, submit, loading, toast
- [ ] Dialog de confirmação para remoção
- [ ] Todos os modais fecham após sucesso e atualizam a lista

---

## Phase 4: Admin — Gifts

### T22: Criar API functions de gifts

**What:** Funções para chamar os endpoints de presentes
**Where:** `src/api/gifts.ts`
**Depends on:** T05
**Requirement:** GIFT-FE-01..06

**Done when:**
- [ ] `getGifts(status?)` → `GET /v1/gifts?status=`
- [ ] `getGiftsSummary()` → `GET /v1/gifts/summary`
- [ ] `createGift(data)` → `POST /v1/gifts`
- [ ] `updateGift(id, data)` → `PATCH /v1/gifts/:giftID`
- [ ] `deleteGift(id)` → `DELETE /v1/gifts/:giftID`
- [ ] `cancelReservation(id)` → `DELETE /v1/gifts/:giftID/reserve`

---

### T23: Criar hook useGifts

**What:** Hooks React Query para presentes
**Where:** `src/hooks/useGifts.ts`
**Depends on:** T12, T22
**Requirement:** GIFT-FE-01..06

**Done when:**
- [ ] `useGifts(status?)` com query
- [ ] `useGiftsSummary()` com query
- [ ] `useCreateGift()`, `useUpdateGift()`, `useDeleteGift()`, `useCancelReservation()` mutations + invalidação

---

### T24: Criar tabela de presentes

**What:** Componente de tabela com lista de presentes, filtros e ações
**Where:** `src/pages/admin/GiftsPage.tsx`
**Depends on:** T08, T23, T13
**Requirement:** GIFT-FE-01, GIFT-FE-06

**Done when:**
- [ ] Tabela com colunas: imagem (thumbnail), nome, preço (BRL), status, reservado por, ações
- [ ] Badges: disponível (verde), reservado (azul/rose)
- [ ] Filtros por status
- [ ] Cards de resumo acima da tabela
- [ ] Empty state e skeleton loader

---

### T25: Criar modais de adicionar/editar/remover presente

**What:** Modais para as ações CRUD de presentes
**Where:** `src/pages/admin/GiftsPage.tsx`
**Depends on:** T23, T03
**Requirement:** GIFT-FE-02, GIFT-FE-03, GIFT-FE-04

**Done when:**
- [ ] Modal "Adicionar presente": campos name, description, price, image_url, store_url
- [ ] Modal "Editar presente": pré-preenchido
- [ ] Dialog de confirmação para remoção (com aviso extra se reservado)
- [ ] Todos os modais com loading e toast

---

### T26: Criar fluxo de cancelar reserva

**What:** Botão e confirmação para cancelar reserva de presente
**Where:** `src/pages/admin/GiftsPage.tsx` (ação na tabela)
**Depends on:** T23
**Requirement:** GIFT-FE-05

**Done when:**
- [ ] Botão "Cancelar reserva" visível apenas em presentes reservados
- [ ] Dialog de confirmação antes de cancelar
- [ ] Após cancelamento, badge muda para "disponível"

---

### T27: Criar ConfirmDialog componente compartilhado

**What:** Componente de dialog de confirmação reutilizável
**Where:** `src/components/shared/ConfirmDialog.tsx`
**Depends on:** T03
**Requirement:** -

**Done when:**
- [ ] Props: `title`, `description`, `onConfirm`, `onCancel`, `isLoading`, `variant` (destructive|default)
- [ ] Usado em remover convidado, remover presente, cancelar reserva

---

## Phase 5: Dashboard

### T28: Criar API functions para dashboard

**What:** Já coberto por `getGuestsSummary()` e `getGiftsSummary()` — apenas hooks específicos
**Where:** `src/hooks/useDashboard.ts`
**Depends on:** T19, T23
**Requirement:** DASH-FE-01

**Done when:**
- [ ] `useDashboard()` agrega dados de guests summary + gifts summary + wedding
- [ ] Single loading state combinado

---

### T29: Criar página de Dashboard

**What:** Página inicial do painel com cards de resumo e quick actions
**Where:** `src/pages/admin/DashboardPage.tsx`
**Depends on:** T08, T28
**Requirement:** DASH-FE-01, DASH-FE-02

**Done when:**
- [ ] Card de convidados: total, confirmados (verde), pendentes (amarelo), recusaram (vermelho)
- [ ] Card de presentes: total, disponíveis, reservados
- [ ] CTA "Configure seu casamento" quando casamento não existe
- [ ] Quick links: adicionar convidado, adicionar presente, editar casamento
- [ ] Skeleton loader durante loading

---

## Phase 6: Página Pública

### T30: Criar API functions públicas

**What:** Funções para os endpoints públicos (sem auth)
**Where:** `src/api/public.ts`
**Depends on:** T05
**Requirement:** PUB-FE-01..04

**Done when:**
- [ ] `getPublicWedding(slug)` → `GET /v1/public/:slug`
- [ ] `getPublicGuests(slug)` → `GET /v1/public/:slug/guests`
- [ ] `submitRsvp(slug, guestID, status)` → `POST /v1/public/:slug/guests/:guestID/rsvp`
- [ ] `getPublicGifts(slug)` → `GET /v1/public/:slug/gifts`
- [ ] `reserveGift(slug, giftID, guestName)` → `POST /v1/public/:slug/gifts/:giftID/reserve`
- [ ] **Importante:** Estas funções NÃO usam o interceptor de auth — usar instância Axios separada ou sem header de auth

---

### T31: Criar página pública — hero e informações

**What:** Seção hero (foto, nomes, data) e seção de detalhes do evento
**Where:** `src/pages/public/PublicWeddingPage.tsx`
**Depends on:** T04, T30, T02
**Requirement:** PUB-FE-01

**Done when:**
- [ ] Hero: foto de fundo (primeira foto), overlay gradiente, nomes do casal em tipografia cursiva, data e local
- [ ] Seção de detalhes: data formatada, horário, endereço completo
- [ ] Seção de descrição (quando presente)
- [ ] Galeria de fotos em grid (quando presente)
- [ ] Seção de links externos como botões/cards
- [ ] Tela "Casamento não encontrado" quando slug inválido
- [ ] Skeleton loader durante loading
- [ ] Tema visual romântico aplicado (variáveis CSS públicas)

---

### T32: Criar seção de RSVP na página pública

**What:** Seção interativa para confirmação de presença
**Where:** `src/pages/public/PublicWeddingPage.tsx` (seção RSVP)
**Depends on:** T30, T31
**Requirement:** PUB-FE-02

**Done when:**
- [ ] Seção visível na página pública
- [ ] Botão "Confirmar Presença" carrega lista de convidados (`GET /guests`)
- [ ] Select estilizado com nomes dos convidados
- [ ] Botões: "Vou comparecer 🎉" e "Não poderei ir"
- [ ] Após submit: mensagem de sucesso personalizada
- [ ] Convidado que já respondeu vê status atual
- [ ] Loading states em todas as etapas

---

### T33: Criar seção de presentes na página pública

**What:** Grid de presentes com status de disponibilidade
**Where:** `src/pages/public/PublicWeddingPage.tsx` (seção presentes)
**Depends on:** T30, T31
**Requirement:** PUB-FE-03

**Done when:**
- [ ] Grid de cards de presentes (2-3 colunas)
- [ ] Card: imagem (com fallback), nome, preço (BRL), badge de status
- [ ] Presente disponível: botão "Dar este presente"
- [ ] Presente reservado: badge "Já reservado" (sem botão)
- [ ] Link para loja externa (quando `store_url` existe)
- [ ] Seção oculta quando lista vazia

---

### T34: Criar fluxo de reserva de presente na página pública

**What:** Modal para convidado reservar um presente informando apenas o nome
**Where:** `src/pages/public/PublicWeddingPage.tsx` (modal)
**Depends on:** T33
**Requirement:** PUB-FE-04

**Done when:**
- [ ] Modal abre ao clicar em "Dar este presente"
- [ ] Campo: "Seu nome" (obrigatório)
- [ ] Submit chama `POST /v1/public/:slug/gifts/:giftID/reserve`
- [ ] Sucesso: modal fecha, card atualiza para "reservado", toast de sucesso
- [ ] 409 Conflict: mensagem "Este presente já foi reservado por outra pessoa"
- [ ] Validação: nome não pode ser vazio
- [ ] Estilo do modal segue tema romântico

---

## Phase 7: Qualidade

### T35: Configurar variáveis de ambiente

**What:** Arquivo `.env.example` e configuração de ambiente
**Where:** `.env.example`, `.env`
**Depends on:** T01
**Requirement:** -

**Done when:**
- [ ] `.env.example` com `VITE_API_URL=http://localhost:8080`
- [ ] `src/api/client.ts` usa `import.meta.env.VITE_API_URL`
- [ ] `.env` local criado (não commitado no git)

---

### T36: Adicionar toasts de feedback

**What:** Sistema de notificação para feedback de ações (sucesso/erro)
**Where:** `src/main.tsx` (Toaster), uso em todas as mutations
**Depends on:** T03
**Requirement:** -

**Done when:**
- [ ] Sonner Toaster configurado no root
- [ ] Toast de sucesso em: criar/editar casamento, adicionar/remover convidado, adicionar/remover presente, cancelar reserva
- [ ] Toast de erro genérico em falhas de rede
- [ ] Toast de erro específico em conflitos (409) e validações (422)

---

### T37: Criar CLAUDE.md do frontend

**What:** Arquivo de orientação para o Claude Code no repositório
**Where:** `CLAUDE.md`
**Depends on:** T01
**Requirement:** -

**Done when:**
- [ ] Documentado: stack, estrutura de pastas, comandos de dev/build/test
- [ ] Documentado: padrões de componentes, convenções de nomenclatura
- [ ] Documentado: como adicionar novas páginas, hooks, API functions

---

## Task Summary

| Phase         | Tasks     | Can Parallel? |
|---------------|-----------|---------------|
| 1. Fundação   | T01–T08   | Sequential    |
| 2. Auth       | T09–T13   | Sequential    |
| 3. Wedding    | T14–T17   | Sequential    |
| 4. Guests     | T18–T21   | Parallel com Gifts |
| 4. Gifts      | T22–T27   | Parallel com Guests |
| 5. Dashboard  | T28–T29   | Após Guests+Gifts |
| 6. Público    | T30–T34   | Parallel com fase 3 |
| 7. Qualidade  | T35–T37   | Após tudo     |

**Total:** 37 tarefas atômicas
