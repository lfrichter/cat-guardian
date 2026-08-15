# Cat Guardian - Project Rules & Source of Truth

## Core Principles
1. Product comes first; framework serves the product. Prefer simplest implementation that satisfies requirements.
2. Architecture: React + Vite + TypeScript + Supabase + Gemini API.
3. Architecture flow: UI → Feature → Service → External Provider. UI never calls external APIs directly.
4. Quality: Jidoka Gate - No task is complete without passing lint, typecheck, test, and build validation.
5. Forward-only Supabase migrations: No -- create above / drop below -- syntax. Always include header documentation.
6. Clean workspace: Use `git clean -fd` for cleaning untracked files when needed.
7. Centralized logging: Use `logClientError` from `@/utils/log-error.ts`.
