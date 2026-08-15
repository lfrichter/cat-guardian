# Cat Guardian 🐾

> Digital Safety Passport for Cats — Hackathon DEV Weekend MVP

Cat Guardian é um passaporte de segurança felino leve, elegante e potencializado por Inteligência Artificial (Gemini API), projetado para tutores e situações de alerta de emergência.

---

## 🎨 Design System: Midnight Guardian

A interface do **Cat Guardian** opera estritamente sob a especificação do **Midnight Guardian** ([`docs/Design-System.md`](file:///Users/master/projects/hackaton/cat-guardian/docs/Design-System.md)):

| Token / Variável CSS | Hex | Função / Aplicação |
| :--- | :--- | :--- |
| `--color-bg` | `#0B1020` | Fundo principal da aplicação (Midnight) |
| `--color-surface` | `#11182B` | Superfície de cards e modais (Deep Navy) |
| `--color-surface-glass` | `#18233A` | Camada translúcida Glassmorphism |
| `--color-text` | `#F4F7FB` | Texto principal & títulos (Cloud) |
| `--color-text-muted` | `#A8B3C7` | Texto secundário (Mist) |
| `--color-primary` | `#A78BFA` | Botões, interações e acentos ativos (Lavender) |
| `--color-primary-light` | `#C4B5FD` | Highlights e hover states (Soft Violet) |
| `--color-success` | `#34D399` | Gato protegido, vacinas em dia (Emerald) |
| `--color-danger` | `#FB7185` | **MODO PERDIDO**, alertas críticos (Coral) |
| `--color-warning` | `#FBBF24` | Lembretes e reforços de vacina (Amber) |
| `--color-info` | `#38BDF8` | Tags informativas e tooltips (Sky) |

### Tipografia
- **Títulos, Números e Badges**: `Space Grotesk`
- **Corpo, UI e Formulários**: `Plus Jakarta Sans`

---

## 🚀 Tech Stack & Arquitetura

- **Frontend**: React + Vite + TypeScript
- **Estilização**: Modern Vanilla CSS + Glassmorphism (Midnight Guardian System)
- **Backend / Database**: Supabase (PostgreSQL + RLS + Migrations Forward-Only)
- **AI Integration**: Gemini API (`@google/generative-ai`)
- **Governança**: Framework IA 2.0 (`Gemini → Local Worker → Jidoka Gate → Humano`)

---

## 📋 Status do Projeto & Backlog

### ✅ EPIC-001: FOUNDATION (100% Concluído)
- [x] Scaffolding React Vite TS + Vitest + ESLint
- [x] Jidoka Gate Pipeline Setup (`lint`, `typecheck`, `test`, `build`)
- [x] Cliente Supabase Single Instance & Fallback
- [x] Log Centralizado de Erros (`logClientError`)
- [x] Migrations Iniciais (`cats`, `health_records`, `client_errors`)

### ✅ EPIC-002: CATS (100% Concluído)
- [x] Modelos de Domínio TypeScript (`Cat`, `HealthRecord`)
- [x] Serviço de Dados Híbrido Supabase + LocalStorage Fallback (`cat-service.ts`)
- [x] Seed Data dos 7 gatos (Kiara, Golia, Meias/Socks, Vaquinha, Tigrinha, Peluda, Gamora)
- [x] UI Cat Cards & Cat List com Busca Dinâmica e Filtro de Perdidos
- [x] Passaporte de Saúde & Histórico de Vacinas
- [x] Cadastro de Novos Felinos com Anotações de IA

### ⏳ EPIC-003: AI (A Seguir)
- [ ] Gemini Service Client & Unidirectional Architecture
- [ ] Gerador de Passaporte de Identificação IA
- [ ] Assistente IA de Saúde Preventiva (Com Guardrails de Não-Diagnóstico)
- [ ] System Prompts de Segurança Felina

### ⏳ EPIC-004: SAFETY
- [ ] Dynamic QR Code Tag Impressa
- [ ] State Manager & Broadcast do Modo Perdido
- [ ] Página Pública do Gato Desaparecido
- [ ] Auditoria Jidoka Final & Pre-deploy

---

## 🛠️ Executando o Projeto

```bash
# Instalar dependências
npm install

# Executar ambiente de desenvolvimento
npm run dev

# Pipeline Jidoka de Validação
npm run lint
npm run typecheck
npm run test
npm run build
```
