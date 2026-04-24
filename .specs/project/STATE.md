# STATE — wedding-mc-frontend

*Memória persistente do projeto. Atualizar a cada sessão.*

---

## Decisions

| ID  | Decision                              | Rationale                                                        | Date       |
|-----|---------------------------------------|------------------------------------------------------------------|------------|
| D01 | React + Vite (SPA)                    | Sem necessidade de SEO; mais simples que Next.js para este caso  | 2026-04-24 |
| D02 | Tailwind CSS + Shadcn/ui              | Componentes prontos aceleram painel do casal                     | 2026-04-24 |
| D03 | TanStack Query para server state      | Cache automático, refetch, loading/error states                  | 2026-04-24 |
| D04 | Axios com interceptors JWT            | Refresh automático de token sem boilerplate manual               | 2026-04-24 |
| D05 | react-hook-form + zod                 | Validação tipada com boa DX                                      | 2026-04-24 |
| D06 | Painel: minimalista moderno           | Estética de marcas premium de casamento (tipo Zola)              | 2026-04-24 |
| D07 | Página pública: romântico com cor     | Tons de areia, rose gold, verde sage; tipografia cursiva         | 2026-04-24 |
| D08 | Desktop first                         | Casal gerencia via desktop; convidados acessam via mobile também | 2026-04-24 |

---

## Preferences

- Model tip already shown: false

---

## Blockers

*Nenhum no momento.*

---

## Deferred Ideas

- Animações de entrada na página pública (framer-motion)
- Dark mode no painel administrativo
- Drag-and-drop para reordenar fotos
- Preview da página pública dentro do painel do casal

---

## Lessons Learned

*Ainda não temos.*

---

## Current Focus

Milestone 1: Fundação — setup do projeto e infraestrutura base.
