# Architecture Design — wedding-mc-frontend

**Status:** Approved

---

## Architecture Overview

SPA React + Vite com duas "zonas" visuais e funcionais distintas:

```
┌─────────────────────────────────────────────────────┐
│                   React SPA (Vite)                  │
│                                                     │
│  ┌─────────────────────┐  ┌──────────────────────┐  │
│  │   Admin Panel Zone  │  │   Public Page Zone   │  │
│  │   /login            │  │   /:slug             │  │
│  │   /register         │  │                      │  │
│  │   /dashboard        │  │  - Wedding info      │  │
│  │   /wedding          │  │  - RSVP flow         │  │
│  │   /guests           │  │  - Gift list         │  │
│  │   /gifts            │  │  - Reserve gift      │  │
│  └────────┬────────────┘  └──────────┬───────────┘  │
│           │                          │               │
│    ┌──────▼──────────────────────────▼──────┐       │
│    │         API Client (Axios)              │       │
│    │  - interceptors JWT                     │       │
│    │  - auto refresh token                   │       │
│    └──────────────────┬──────────────────────┘       │
└─────────────────────────────────────────────────────┘
                        │
             ┌──────────▼──────────┐
             │  wedding-mc-backend │
             │  localhost:8080     │
             └─────────────────────┘
```

---

## Folder Structure

```
src/
├── api/                    # Axios client + API functions
│   ├── client.ts           # Axios instance + interceptors
│   ├── auth.ts             # Auth API calls
│   ├── wedding.ts          # Wedding API calls
│   ├── guests.ts           # Guests API calls
│   ├── gifts.ts            # Gifts API calls
│   └── public.ts           # Public endpoints
│
├── components/
│   ├── ui/                 # Shadcn/ui components (gerados)
│   ├── layout/
│   │   ├── AdminLayout.tsx  # Sidebar + header do painel
│   │   └── PublicLayout.tsx # Layout da página pública
│   └── shared/             # Componentes reutilizáveis
│       ├── ConfirmDialog.tsx
│       ├── EmptyState.tsx
│       └── LoadingSkeleton.tsx
│
├── contexts/
│   └── AuthContext.tsx      # Estado de auth global
│
├── hooks/                  # Custom hooks (React Query)
│   ├── useAuth.ts
│   ├── useWedding.ts
│   ├── useGuests.ts
│   └── useGifts.ts
│
├── pages/
│   ├── admin/              # Painel do casal
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── WeddingPage.tsx
│   │   ├── GuestsPage.tsx
│   │   └── GiftsPage.tsx
│   └── public/             # Página pública
│       ├── PublicWeddingPage.tsx
│       └── NotFoundPage.tsx
│
├── routes/
│   ├── index.tsx           # Configuração do React Router
│   ├── ProtectedRoute.tsx  # HOC de proteção
│   └── PublicOnlyRoute.tsx # Redireciona se autenticado
│
├── types/                  # TypeScript interfaces
│   ├── api.ts              # Tipos dos responses da API
│   └── auth.ts             # Tipos de auth
│
├── lib/
│   └── utils.ts            # cn(), formatCurrency(), formatDate()
│
└── styles/
    ├── globals.css         # Tailwind base + variáveis CSS
    └── public-theme.css    # Variáveis do tema público (cores románticas)
```

---

## Routing

```
/                       → redirect → /dashboard (se auth) | /login
/login                  → LoginPage (PublicOnlyRoute)
/register               → RegisterPage (PublicOnlyRoute)
/dashboard              → DashboardPage (ProtectedRoute)
/wedding                → WeddingPage (ProtectedRoute)
/guests                 → GuestsPage (ProtectedRoute)
/gifts                  → GiftsPage (ProtectedRoute)
/:slug                  → PublicWeddingPage (sem proteção)
*                       → 404 NotFoundPage
```

---

## Auth Flow

```
App boot
  ↓
Lê access_token do localStorage
  ↓
[Existe?] → Configura Axios header → Renderiza app
[Não existe?] → Rota protegida → redirect /login

Request com token expirado (401)
  ↓
Interceptor Axios detecta 401
  ↓
Tenta POST /v1/auth/refresh com refresh_token
  ↓
[Sucesso] → Atualiza access_token → Retry request original
[Falha] → Limpa tokens → redirect /login
```

---

## Data Types (TypeScript)

```typescript
// Auth
interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_at: string
}

// Wedding
interface Wedding {
  id: string
  slug: string
  bride_name: string
  groom_name: string
  date: string         // "2026-11-15"
  time?: string        // "17:00"
  location: string
  city?: string
  state?: string
  description?: string
  photos: Photo[]
  links: Link[]
  created_at: string
  updated_at: string
}

interface Photo { id: string; url: string; created_at: string }
interface Link  { id: string; label: string; url: string; position: number }

// Guests
interface Guest {
  id: string
  wedding_id: string
  name: string
  status: 'pending' | 'confirmed' | 'declined'
  rsvp_at?: string
  created_at: string
  updated_at: string
}

interface GuestSummary { pending: number; confirmed: number; declined: number }

// Gifts
interface Gift {
  id: string
  wedding_id: string
  name: string
  description?: string
  price?: number
  image_url?: string
  store_url?: string
  status: 'available' | 'reserved'
  reserved_by_name?: string
  reserved_at?: string
  created_at: string
  updated_at: string
}

interface GiftSummary { available: number; reserved: number }

// Public
interface PublicWedding {
  id: string; slug: string; bride_name: string; groom_name: string
  date: string; time?: string; location: string; city?: string; state?: string
  description?: string; photos: Photo[]; links: Link[]
}

interface PublicGuest { id: string; name: string; status: string; rsvp_at?: string }
interface PublicGift  { id: string; name: string; description?: string; image_url?: string; store_url?: string; price?: number; reserved: boolean }
```

---

## State Management

| State Type    | Tool                | Where                    |
|---------------|---------------------|--------------------------|
| Auth state    | React Context       | `AuthContext.tsx`        |
| Server data   | TanStack Query      | custom hooks em `hooks/` |
| Form state    | react-hook-form     | dentro de cada formulário|
| UI state      | useState local      | dentro de cada componente|

**Regra:** Sem Redux ou Zustand. Auth context + React Query cobrem todos os casos de uso do v1.

---

## Error Handling

| Cenário                    | Tratamento                                      |
|----------------------------|-------------------------------------------------|
| 401 (token expirado)       | Interceptor tenta refresh → retry              |
| 401 (refresh inválido)     | Redirect `/login`                               |
| 422 (validação)            | Exibir erros por campo no formulário           |
| 409 (conflito)             | Toast com mensagem específica                  |
| 404                        | Tela de "não encontrado" ou empty state         |
| Network error              | Toast genérico de "Erro de conexão"             |

---

## Design Tokens

### Painel Administrativo
```css
--admin-bg: #FFFFFF;
--admin-sidebar: #FAFAF9;
--admin-border: #E5E7EB;
--admin-text: #111827;
--admin-text-muted: #6B7280;
--admin-accent: #C9956C;     /* rose gold para destaques */
```

### Página Pública
```css
--public-bg: #FDF8F0;        /* areia claro */
--public-primary: #C9956C;   /* rose gold */
--public-secondary: #8A9E7E; /* verde sage */
--public-text: #3D2B1F;      /* marrom quente */
--public-border: #E8D5B7;    /* areia médio */
```

### Tipografia
- **Admin títulos:** Playfair Display (serif)
- **Admin corpo:** Inter (sans-serif)
- **Público títulos:** Cormorant Garamond (serif, elegante)
- **Público corpo:** Lato (sans-serif)

---

## Tech Decisions

| Decision                       | Choice                   | Rationale                                          |
|--------------------------------|--------------------------|----------------------------------------------------|
| State management               | Context + React Query    | Simples o suficiente para v1; sem overhead de Redux|
| Form library                   | react-hook-form + zod    | Performance, validação tipada, boa DX              |
| Component library              | shadcn/ui                | Componentes copiados, sem dependência "caixa preta"|
| HTTP client                    | Axios                    | Interceptors para JWT refresh são mais limpos      |
| CSS approach                   | Tailwind utility-first   | Velocidade + consistência; sem CSS modules overhead|
| Fonts                          | Google Fonts (self-host) | Fontes específicas não disponíveis no sistema      |
| Env config                     | `.env` Vite              | `VITE_API_URL` para apontar para o backend         |
