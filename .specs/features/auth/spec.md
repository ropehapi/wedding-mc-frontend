# Auth — Especificação (Frontend)

## Problem Statement

O casal precisa se registrar e autenticar na plataforma para acessar o painel administrativo. O frontend deve gerenciar tokens JWT, refresh automático e proteção de rotas.

## Goals

- [ ] Casal consegue se registrar em menos de 2 minutos
- [ ] Login persiste entre sessões (refresh token armazenado)
- [ ] Rotas protegidas redirecionam para login se não autenticado
- [ ] Refresh de token transparente — usuário nunca vê tela de login desnecessária

## Out of Scope

| Feature                        | Razão               |
|--------------------------------|---------------------|
| Login social (Google, Facebook) | Fora do escopo v1  |
| Recuperação de senha            | Fora do escopo v1  |
| 2FA                             | Fora do escopo v1  |

---

## User Stories

### P1: Registro do casal ⭐ MVP

**User Story:** Como casal, quero me registrar com nome, email e senha para criar minha conta na plataforma.

**Acceptance Criteria:**

1. WHEN casal acessa `/register` THEN sistema SHALL exibir formulário com campos: nome, email, senha
2. WHEN casal submete formulário válido THEN sistema SHALL chamar `POST /v1/auth/register` e redirecionar para `/login`
3. WHEN email já cadastrado THEN sistema SHALL exibir mensagem "E-mail já cadastrado"
4. WHEN senha tem menos de 8 caracteres THEN sistema SHALL exibir erro de validação inline
5. WHEN já autenticado THEN sistema SHALL redirecionar para `/dashboard`

**Independent Test:** Acessar `/register` → preencher dados válidos → submeter → ser redirecionado para `/login`.

---

### P1: Login do casal ⭐ MVP

**User Story:** Como casal, quero fazer login com email e senha para acessar o painel.

**Acceptance Criteria:**

1. WHEN casal acessa `/login` THEN sistema SHALL exibir formulário com campos: email, senha
2. WHEN casal submete credenciais válidas THEN sistema SHALL armazenar `access_token` e `refresh_token`, redirecionar para `/dashboard`
3. WHEN credenciais inválidas THEN sistema SHALL exibir "Email ou senha incorretos"
4. WHEN já autenticado THEN sistema SHALL redirecionar para `/dashboard`
5. WHEN casal clica em "Sair" THEN sistema SHALL chamar `POST /v1/auth/logout`, limpar tokens e redirecionar para `/login`

**Independent Test:** Acessar `/login` → credenciais válidas → redireciona para `/dashboard`.

---

### P1: Proteção de rotas ⭐ MVP

**User Story:** Como sistema, quero proteger todas as rotas do painel para que apenas usuários autenticados as acessem.

**Acceptance Criteria:**

1. WHEN usuário não autenticado acessa qualquer rota do painel THEN sistema SHALL redirecionar para `/login`
2. WHEN usuário autenticado acessa `/login` ou `/register` THEN sistema SHALL redirecionar para `/dashboard`
3. WHEN access_token expira THEN sistema SHALL automaticamente chamar `POST /v1/auth/refresh` com refresh_token
4. WHEN refresh_token também expirou THEN sistema SHALL redirecionar para `/login`

**Independent Test:** Acessar `/dashboard` sem autenticação → redireciona para `/login`.

---

### P1: Persistência de sessão ⭐ MVP

**User Story:** Como casal, quero que minha sessão seja mantida ao fechar e reabrir o browser.

**Acceptance Criteria:**

1. WHEN casal faz login com sucesso THEN sistema SHALL armazenar tokens no `localStorage`
2. WHEN casal reabre o browser THEN sistema SHALL verificar token armazenado e restaurar sessão
3. WHEN token armazenado é inválido THEN sistema SHALL limpar storage e redirecionar para `/login`

---

## Requirement Traceability

| Requirement ID | Story                      | Status  |
|----------------|----------------------------|---------|
| AUTH-FE-01     | P1: Registro               | Pending |
| AUTH-FE-02     | P1: Login                  | Pending |
| AUTH-FE-03     | P1: Proteção de rotas      | Pending |
| AUTH-FE-04     | P1: Persistência de sessão | Pending |
