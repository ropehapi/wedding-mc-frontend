# wedding-mc-frontend

**Vision:** Frontend SaaS para gestão de casamentos — painel administrativo para o casal e página pública para os convidados, consumindo a API REST do wedding-mc-backend.

**For:** Dois públicos distintos — casais que gerenciam seu evento (autenticados) e convidados que acessam a página pública (sem autenticação).

**Solves:** Oferecer ao casal uma interface visual para gerenciar convidados, presentes e o perfil do casamento; e aos convidados uma landing page elegante para confirmar presença e reservar presentes sem nenhum cadastro.

---

## Goals

- Casal consegue configurar o casamento completo (dados, fotos, convidados, presentes) em menos de 30 minutos
- Convidados acessam a página pública pelo slug e realizam todas as ações (RSVP, reserva de presente) sem criar conta
- Interface do painel administrativo: minimalista moderno (fundo branco, tipografia serif, muito espaço em branco)
- Interface da página pública: romântico com cor (tons de areia, rose gold, verde sage, fontes cursivas)

---

## Tech Stack

**Core:**
- Framework: React 18 + Vite
- Linguagem: TypeScript
- Estilização: Tailwind CSS + Shadcn/ui
- Roteamento: React Router v6
- Server state: TanStack Query (React Query)
- HTTP client: Axios

**Key dependencies:**
- `@tanstack/react-query` — cache e sincronização de dados do servidor
- `shadcn/ui` — componentes de UI (botões, tabelas, modais, formulários)
- `react-router-dom` — roteamento SPA
- `axios` — cliente HTTP com interceptors para JWT
- `react-hook-form` + `zod` — formulários com validação

---

## Actors

| Ator      | Interface                  | Autenticação |
|-----------|----------------------------|--------------|
| Casal     | Painel administrativo      | Sim (JWT)    |
| Convidado | Página pública (`/:slug`)  | Não          |

---

## Módulos

| Módulo          | Descrição                                              | MVP |
|-----------------|--------------------------------------------------------|-----|
| Auth            | Login e registro do casal                             | P1  |
| Dashboard       | Overview com resumo de convidados e presentes         | P1  |
| Wedding         | Editar perfil do casamento (dados, fotos, links)      | P1  |
| Guests          | Gerenciar lista de convidados                         | P1  |
| Gifts           | Gerenciar lista de presentes                          | P1  |
| Public Page     | Página pública do casamento para convidados           | P1  |

---

## Scope

**v1 inclui:**
- Telas de login e registro do casal
- Dashboard com cards de resumo (convidados por status, presentes por status)
- Gerenciamento do perfil do casamento (dados, upload de fotos, links externos)
- Gerenciamento de convidados (CRUD + filtro por status)
- Gerenciamento de presentes (CRUD + filtro por status + cancelar reserva)
- Página pública do casamento (informações, fotos, galeria, links)
- Fluxo de RSVP na página pública (convidado seleciona nome, confirma/recusa)
- Fluxo de reserva de presente na página pública (convidado informa nome, reserva)
- Refresh automático de token JWT

**Explicitamente fora do escopo (v1):**

| Feature                          | Razão                                   |
|----------------------------------|-----------------------------------------|
| Personalização de temas/cores    | Planejado para v2                       |
| Pagamento / vaquinha de presentes | Planejado para v2                      |
| Notificações (email/WhatsApp)    | Planejado para v2                       |
| Dashboard de analytics           | Planejado para v2                       |
| PWA / app mobile                 | Fora do escopo inicial                  |
| Internacionalização (i18n)       | Apenas português no v1                  |

---

## Design System

**Painel Administrativo (casal):**
- Paleta: brancos, cinzas, preto. Acentos sutis em nude/bege.
- Tipografia: serif elegante nos títulos (ex: Playfair Display), sans-serif limpa no corpo (ex: Inter)
- Estética: muito espaço em branco, cards limpos, tabelas minimalistas

**Página Pública (convidados):**
- Paleta: areia (#F5ECD7), rose gold (#C9956C), verde sage (#8A9E7E), branco
- Tipografia: cursiva/script nos títulos de destaque (ex: Cormorant Garamond ou Playfair Display Italic), serif no corpo
- Estética: soft, acolhedor, floral sutil, muito whitespace

---

## API Backend

- Base URL: `http://localhost:8080`
- Todos os endpoints autenticados requerem `Authorization: Bearer <access_token>`
- Endpoints públicos: `/v1/public/:slug/*` — sem autenticação
- Documentação: `/swagger/index.html` (backend local)

---

## Constraints

- SPA puro (React + Vite) — sem SSR
- Sem SEO necessário (acesso por link direto)
- Foco em desktop first, responsivo como segunda prioridade
- Um casal = um casamento (sem multi-tenancy complexo)
