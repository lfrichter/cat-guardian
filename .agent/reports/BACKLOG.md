# CAT GUARDIAN DEVELOPMENT BACKLOG

## EPIC-001: FOUNDATION

### TASK-001: Initialize Vite React TypeScript scaffolding & styling system
- **Description**: Setup React + Vite + TypeScript project layout, UI foundations, and base stylesheet.
- **Epic**: EPIC-001
- **Risk**: LOW
- **Agent**: Mistral 7B
- **Approval**: Auto (after Jidoka PASS)
- **Status**: DONE (Jidoka Gate PASS)

### TASK-002: Setup ESLint, TypeScript config & Jidoka scripts
- **Description**: Configure linting, typechecking, test setup, and npm scripts (`lint`, `typecheck`, `test`, `build`).
- **Epic**: EPIC-001
- **Risk**: LOW
- **Agent**: Mistral 7B
- **Approval**: Auto (after Jidoka PASS)
- **Status**: DONE (Jidoka Gate PASS)

### TASK-003: Setup Supabase client & environment configuration
- **Description**: Initialize Supabase client factory, environment configuration, and connection error handling.
- **Epic**: EPIC-001
- **Risk**: MEDIUM
- **Agent**: Opencoder 8B
- **Approval**: Gemini Review
- **Status**: DONE (Jidoka Gate PASS)

### TASK-004: Create initial Supabase database migrations
- **Description**: Create forward-only migrations for `cats`, `health_records`, and `client_errors` tables.
- **Epic**: EPIC-001
- **Risk**: HIGH
- **Agent**: Gemini
- **Approval**: Human
- **Status**: DONE (Jidoka Gate PASS)

### TASK-005: Implement Centralized Error Logging (`logClientError`)
- **Description**: Build `@/utils/log-error.ts` to log UI and runtime errors to Supabase `client_errors` table.
- **Epic**: EPIC-001
- **Risk**: MEDIUM
- **Agent**: Opencoder 8B
- **Approval**: Gemini Review
- **Status**: DONE (Jidoka Gate PASS)

---

## EPIC-002: CATS

### TASK-006: Define Cat and Health Record domain TypeScript models
- **Description**: Create interfaces for Cat, HealthRecord, MedicalHistory, LostModeState, and VisualTraits.
- **Epic**: EPIC-002
- **Risk**: LOW
- **Agent**: Mistral 7B
- **Approval**: Auto (after Jidoka PASS)
- **Status**: DONE (Jidoka Gate PASS)

### TASK-007: Build Cat Data Repository & Service layer
- **Description**: Implement CRUD operations in `cat-service.ts` with local storage fallback for offline support.
- **Epic**: EPIC-002
- **Risk**: MEDIUM
- **Agent**: Opencoder 8B
- **Approval**: Gemini Review
- **Status**: DONE (Jidoka Gate PASS)

### TASK-008: Create Seed Data Fixture for 7 Cats
- **Description**: Create seed data for Kiara, Golia, Meias (Socks), Vaquinha, Tigrinha, Peluda, and Gamora.
- **Epic**: EPIC-002
- **Risk**: LOW
- **Agent**: Mistral 7B
- **Approval**: Auto (after Jidoka PASS)
- **Status**: DONE (Jidoka Gate PASS)

### TASK-009: Implement Cat List View & Profile Cards UI
- **Description**: Build responsive grid layout displaying cat cards with status badges and quick actions.
- **Epic**: EPIC-002
- **Risk**: MEDIUM
- **Agent**: Opencoder 8B
- **Approval**: Gemini Review
- **Status**: DONE (Jidoka Gate PASS)

### TASK-010: Implement Cat Profile Detail & Health Passport UI
- **Description**: Build full profile view featuring medical history, vaccines, allergies, and physical traits.
- **Epic**: EPIC-002
- **Risk**: MEDIUM
- **Agent**: Opencoder 8B
- **Approval**: Gemini Review
- **Status**: DONE (Jidoka Gate PASS)

### TASK-011: Build Cat Registration & Edit Form with Validation
- **Description**: Form for adding/updating cat profiles with input validation and image upload/selection.
- **Epic**: EPIC-002
- **Risk**: MEDIUM
- **Agent**: Opencoder 8B
- **Approval**: Gemini Review
- **Status**: DONE (Jidoka Gate PASS)

---

## EPIC-003: AI

### TASK-012: Implement Gemini API Client Service (`/services/ai-service.ts`)
- **Description**: Setup Gemini SDK integration following unidirectional flow (UI → Service → Provider).
- **Epic**: EPIC-003
- **Risk**: HIGH
- **Agent**: Gemini
- **Approval**: Human
- **Status**: DONE (Jidoka Gate PASS)

### TASK-013: Build AI Cat Profile Generator
- **Description**: Feature to synthesize raw owner notes into descriptive, non-biometric identification passports.
- **Epic**: EPIC-003
- **Risk**: MEDIUM
- **Agent**: Opencoder 8B
- **Approval**: Gemini Review
- **Status**: DONE (Jidoka Gate PASS)

### TASK-014: Implement AI Health Assistant
- **Description**: AI care assistant providing non-diagnostic health tips, care guidance, and diet advice.
- **Epic**: EPIC-003
- **Risk**: MEDIUM
- **Agent**: Opencoder 8B
- **Approval**: Gemini Review
- **Status**: DONE (Jidoka Gate PASS)

### TASK-015: Create AI Safety Guardrails & System Prompts
- **Description**: Enforce medical non-diagnosis disclaimer and safety rules in system prompts.
- **Epic**: EPIC-003
- **Risk**: HIGH
- **Agent**: Gemini
- **Approval**: Human
- **Status**: DONE (Jidoka Gate PASS)

### TASK-130: Lost Incident data model
- **Description**: Lost incident and sighting models for managing missing cat reports.
- **Epic**: WAVE-3
- **Risk**: HIGH
- **Agent**: Gemini
- **Approval**: Human
- **Status**: DONE (Jidoka Gate PASS)

### TASK-131: Lost Workflow
- **Description**: One-click lost mode workflow with last seen location and emergency broadcast.
- **Epic**: WAVE-3
- **Risk**: MEDIUM
- **Agent**: Opencoder 8B
- **Approval**: Gemini Review
- **Status**: DONE (Jidoka Gate PASS)

### TASK-140: Public QR Page
- **Description**: Public QR safety passport separating public rescue data from private owner details.
- **Epic**: WAVE-3
- **Risk**: HIGH
- **Agent**: Gemini
- **Approval**: Human
- **Status**: DONE (Jidoka Gate PASS)

### TASK-141: Found Report flow
- **Description**: Sighting report form enabling finders to submit GPS location and contact info to owners.
- **Epic**: WAVE-3
- **Risk**: HIGH
- **Agent**: Gemini
- **Approval**: Human
- **Status**: DONE (Jidoka Gate PASS)

### TASK-142: Contact Relay
- **Description**: Privacy-preserving contact relay intermediating finder and owner.
- **Epic**: WAVE-3
- **Risk**: HIGH
- **Agent**: Gemini
- **Approval**: Human
- **Status**: DONE (Jidoka Gate PASS)

---

## EPIC-004: SAFETY

### TASK-016: Build QR Code Generator component & Printable Tag
- **Description**: Generate dynamic QR code encoding direct link to public cat profile for collar tags.
- **Epic**: EPIC-004
- **Risk**: LOW
- **Agent**: Mistral 7B
- **Approval**: Auto (after Jidoka PASS)
- **Status**: DONE (Jidoka Gate PASS)

### TASK-017: Implement Lost Mode Toggle & State Manager
- **Description**: One-click Lost Mode trigger that updates public passport status and broadcasts missing alert.
- **Epic**: EPIC-004
- **Risk**: MEDIUM
- **Agent**: Opencoder 8B
- **Approval**: Gemini Review
- **Status**: DONE (Jidoka Gate PASS)

### TASK-018: Build Public Missing Cat Passport Page
- **Description**: Publicly accessible, mobile-optimized page showing missing cat info, owner contact, and emergency actions.
- **Epic**: EPIC-004
- **Risk**: MEDIUM
- **Agent**: Opencoder 8B
- **Approval**: Gemini Review
- **Status**: DONE (Jidoka Gate PASS)

### TASK-019: Implement Emergency Contact & Location Share module
- **Description**: Form allowing finders to report cat location and send instant notification to cat owner.
- **Epic**: EPIC-004
- **Risk**: MEDIUM
- **Agent**: Opencoder 8B
- **Approval**: Gemini Review
- **Status**: DONE (Jidoka Gate PASS)

### TASK-020: Full Jidoka Audit, Performance & UX Verification
- **Description**: Final pipeline run (`lint`, `typecheck`, `test`, `build`), accessibility and deployment checks.
- **Epic**: EPIC-004
- **Risk**: HIGH
- **Agent**: Gemini
- **Approval**: Human
- **Status**: DONE (Jidoka Gate PASS)
