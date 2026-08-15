# Cat Guardian 🐾

<p align="center">
  <img src="https://img.shields.io/badge/Status-Hackathon_MVP-A78BFA?style=for-the-badge" alt="Status: Hackathon MVP" />
  <img src="https://img.shields.io/badge/Version-1.0.0-34D399?style=for-the-badge" alt="Version 1.0.0" />
  <img src="https://img.shields.io/badge/Pipeline-Jidoka_Gate-FBBF24?style=for-the-badge&logo=githubactions&logoColor=white" alt="Jidoka Gate Pipeline" />
</p>

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

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Gemini_API-4285F4?style=flat-square&logo=googlegemini&logoColor=white" alt="Gemini API" />
  <img src="https://img.shields.io/badge/Vitest-3-6E9F81?style=flat-square&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/ESLint-9-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/Lucide_React-Icons-F56565?style=flat-square&logo=lucide&logoColor=white" alt="Lucide" />
</p>

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

## 🎯 Jidoka Gate Pipeline Status

### 📝 Workflow Summary

| Stage | Command | Status | Artifacts |
| :--- | :--- | :--- | :--- |
| 1️⃣ **Lint** | `npm run lint` | ✅ **PASS** | `.eslint-results.json` |
| 2️⃣ **Typecheck** | `npm run typecheck` | ✅ **PASS** | `.tsc-results.json` |
| 3️⃣ **Tests** | `npm run test` | ✅ **PASS** | `.vitest-results.json`, `.coverage/` |
| 4️⃣ **Build** | `npm run build` | ✅ **PASS** | `dist/` |

### 📋 Pipeline Test Results

![Lint Passing](https://img.shields.io/badge/Lint-ESLint_9-4B32C3?logo=eslint)
![Typecheck Passing](https://img.shields.io/badge/Typecheck-TSC_5.7-3178C6?logo=typescript)
![Tests Passing](https://img.shields.io/badge/Tests-Vitest_3-6E9F81?logo=vitest)
![Build Passing](https://img.shields.io/badge/Build-Vite_6-646CFF?logo=vite)
