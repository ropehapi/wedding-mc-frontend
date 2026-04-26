# Roadmap — wedding-mc-frontend

## v1 — MVP (escopo atual)

**Objetivo:** Frontend completo cobrindo todos os módulos da API. Painel do casal funcional + página pública para convidados.

### Milestone 1: Fundação

- [ ] Setup do projeto (Vite + React + TypeScript)
- [ ] Configuração do Tailwind CSS + Shadcn/ui
- [ ] Configuração do React Router (rotas protegidas e públicas)
- [ ] Cliente HTTP (Axios) com interceptors JWT
- [ ] TanStack Query setup
- [ ] Context de autenticação (AuthContext)
- [ ] Layout base do painel administrativo
- [ ] Layout base da página pública

### Milestone 2: Auth

- [ ] Tela de login do casal
- [ ] Tela de registro do casal
- [ ] Proteção de rotas (redireciona não-autenticados)
- [ ] Refresh token automático
- [ ] Logout

### Milestone 3: Painel — Wedding & Dashboard

- [ ] Dashboard com cards de resumo
- [ ] Tela de configuração do casamento (dados)
- [ ] Upload de fotos do casamento
- [ ] Gerenciamento de links externos

### Milestone 4: Painel — Guests & Gifts

- [ ] Tela de gerenciamento de convidados (lista, adicionar, editar, remover)
- [ ] Filtro de convidados por status (pending/confirmed/declined)
- [ ] Tela de gerenciamento de presentes (lista, adicionar, editar, remover)
- [ ] Filtro de presentes por status (available/reserved)
- [ ] Cancelar reserva de presente

### Milestone 5: Página Pública

- [ ] Página pública do casamento (/:slug)
- [ ] Seção de informações do casamento (data, local, descrição, fotos)
- [ ] Seção de links externos
- [ ] Fluxo de RSVP (selecionar nome na lista → confirmar/recusar presença)
- [ ] Lista pública de presentes com status
- [ ] Fluxo de reserva de presente (informar nome → reservar)

### Milestone 6: Qualidade

- [ ] Tratamento de erros e loading states em todas as telas
- [ ] Feedback visual de ações (toasts de sucesso/erro)
- [ ] Responsividade básica (mobile-friendly)
- [ ] Validação de formulários com mensagens de erro

---

## v2 — Evolução (planejado, sem data)

- Personalização de tema da página pública (cores, fontes)
- Dashboard de analytics (gráficos de confirmação ao longo do tempo)
- Notificações em tempo real (polling ou WebSocket)
- Pagamento integrado para presentes (Pix)
- PWA básico para a página pública

---

## v3 — Expansão (ideia, sem compromisso)

- Multi-evento por conta
- Editor visual da landing page (drag-and-drop)
- Módulo de fornecedores
- Cronograma do evento
