# Design System: Midnight Guardian

## 1. Core Concept
**Keywords:** 🌙 Calm · 🛡️ Safe · 🐈 Personal · 🤖 Intelligent · ✨ Premium

O tema "Midnight Guardian" foi desenhado para transmitir segurança, tecnologia e cuidado premium. Ele evita clichês infantis e foca em uma interface noturna sofisticada baseada em Glassmorphism, com cores semânticas estritas que comunicam imediatamente o status do felino (Protegido vs. Perdido).

## 2. Color Palette & Tokens

Nenhum componente deve utilizar valores hexadecimais soltos. Todas as cores devem referenciar os tokens oficiais abaixo.

| Role | Token / CSS Variable | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `--color-bg` | `#0B1020` | Fundo principal da aplicação (Midnight). |
| **Surface** | `--color-surface` | `#11182B` | Fundos opacos de cards e modais (Deep Navy). |
| **Glass** | `--color-surface-glass` | `#18233A` | Superfícies translúcidas (com opacity/backdrop-blur). |
| **Text Main** | `--color-text` | `#F4F7FB` | Texto principal, títulos (Cloud). |
| **Text Muted** | `--color-text-muted`| `#A8B3C7` | Texto secundário, descrições (Mist). |
| **Primary** | `--color-primary` | `#A78BFA` | Botões, links, ícones, elementos ativos (Lavender). |
| **Primary Light**| `--color-primary-light`| `#C4B5FD` | Highlights suaves e hover states (Soft Violet). |
| **Safe (Status)**| `--color-success` | `#34D399` | Gato protegido, vacinas em dia (Emerald). |
| **Lost (Danger)**| `--color-danger` | `#FB7185` | MODO PERDIDO, alertas críticos (Coral). |
| **Attention** | `--color-warning` | `#FBBF24` | Faltam informações, vacinas pendentes (Amber). |
| **Information** | `--color-info` | `#38BDF8` | Dicas, tooltips, tags gerais (Sky). |

**Glassmorphism Border:** `--glass-border: rgba(255, 255, 255, 0.08);`

## 3. Typography

*   **Headings, Numbers & Data:** `Space Grotesk` (Títulos, números de identificação, porcentagens de saúde).
*   **Body, UI & Forms:** `Plus Jakarta Sans` (Leitura geral, parágrafos, botões, labels).

## 4. Component Semantics & States

### 🐈 Cat Cards
Devem focar na foto do gato, nome e o status visual imediato.
*   **Normal State:** Background Glass, borda sutil, badge Emerald para `Protected`.
*   **Accent Usage:** Lavender apenas para interações (ex: "View Passport").

### 🤖 Guardian AI (AI Elements)
Componentes gerados por IA (como o "AI Cat Profile") devem ter um isolamento visual sutil.
*   **Visual Cue:** Uso do ícone ✨ e highlights suaves utilizando a transição do `--color-primary` para `--color-info` (#A78BFA → #38BDF8) *apenas* em loadings ou borders de destaque. Sem exageros.

### 🩺 Health Passport
Layout com atmosfera de "medical dashboard".
*   Utilize `--color-success` para dados em dia.
*   Utilize `--color-warning` para revisões.
*   Utilize `--color-danger` apenas para situações críticas vencidas.

### 🚨 Lost Mode
Uma inversão atmosférica. Quando um gato está perdido, a interface de perfil dele muda o accent primário.
*   O Lavender é substituído pelo Coral (`--color-danger`).
*   Banners e CTAs de destaque utilizam o Coral para urgência imediata ("alguma coisa está errada").
