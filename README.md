# wedding-mc — Frontend

Painel administrativo e página pública para o SaaS de gestão de casamentos **wedding-mc**.

## Visão geral

O frontend tem dois modos distintos:

| Modo | Público-alvo | Rota |
|------|-------------|------|
| Painel administrativo | Casal (autenticado) | `/login`, `/dashboard`, `/wedding`, `/guests`, `/gifts` |
| Página pública | Convidados (sem auth) | `/:slug` |

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** + **Shadcn/ui**
- **React Router v7**
- **TanStack Query v5**
- **Axios** — cliente HTTP com interceptors JWT (refresh automático)
- **react-hook-form** + **Zod** — formulários e validação
- **Sonner** — notificações toast

## Pré-requisitos

- Node.js >= 20
- npm >= 10
- Backend **wedding-mc** rodando em `http://localhost:8080`

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

O arquivo `.env.example` contém:

```env
VITE_API_URL=http://localhost:8080
```

Ajuste `VITE_API_URL` se o backend estiver em outra porta ou host.

### 3. Rodar em modo de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

## Fluxo de uso

### Primeiro acesso

1. Acesse `/register` e crie uma conta (nome, e-mail e senha)
2. Faça login em `/login`
3. Você será redirecionado para `/dashboard`

### Painel administrativo

| Página | Rota | O que fazer |
|--------|------|-------------|
| Dashboard | `/dashboard` | Resumo de convidados e presentes |
| Casamento | `/wedding` | Criar/editar dados do evento, fotos e links |
| Convidados | `/guests` | Gerenciar lista de convidados |
| Presentes | `/gifts` | Gerenciar lista de presentes |

### Página pública dos convidados

Após configurar o casamento em `/wedding`, um **slug** único é gerado. Compartilhe o link:

```
http://localhost:5173/<slug>
```

Nessa página os convidados podem:
- Ver informações do evento, galeria de fotos e links externos
- Confirmar ou recusar presença (RSVP)
- Reservar presentes da lista

## Comandos disponíveis

```bash
npm run dev        # Servidor de desenvolvimento com HMR
npm run build      # Build de produção (type-check + bundle)
npm run preview    # Servir o build de produção localmente
npm run lint       # Lint com ESLint
```

## Estrutura do projeto

```
src/
├── api/            # Funções de chamada à API (auth, wedding, guests, gifts, public)
├── components/
│   ├── layout/     # AdminLayout, PublicLayout
│   ├── shared/     # Componentes reutilizáveis (ex: ConfirmDialog)
│   └── ui/         # Componentes Shadcn/ui
├── contexts/       # AuthContext
├── hooks/          # Hooks React Query (useAuth, useWedding, useGuests, useGifts, useDashboard)
├── lib/            # queryClient, utils (cn, formatCurrency, formatDate)
├── pages/
│   ├── admin/      # LoginPage, RegisterPage, DashboardPage, WeddingPage, GuestsPage, GiftsPage
│   └── public/     # PublicWeddingPage
├── routes/         # AppRoutes, ProtectedRoute, PublicOnlyRoute
├── styles/         # globals.css
└── types/          # Tipos TypeScript compartilhados (api.ts)
```

## Autenticação

O cliente Axios injeta automaticamente o token JWT em cada request autenticado. Quando o token expira, o interceptor tenta o refresh sem interromper o fluxo. Se o refresh também falhar, o usuário é redirecionado para `/login`.

Os tokens ficam em `localStorage` sob as chaves `access_token` e `refresh_token`.

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL base da API REST do backend | `http://localhost:8080` |
