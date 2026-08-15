# JIDOKA GATE POLICY

## Principle
Quality is built-in. No task classified as `MEDIUM` or `HIGH` risk can be marked as `READY_FOR_REVIEW` without passing the automated Jidoka verification pipeline.

## Required Pipeline
1. `npm run lint` - Code quality and formatting compliance.
2. `npm run typecheck` - TypeScript static type safety check.
3. `npm run test` - Unit and integration test suite suite verification.
4. `npm run build` - Production bundle build verification.

## Andon Cord Protocol
If any step in the pipeline fails:
1. **STOP**: Immediately halt task execution.
2. **REPORT**: Log exact failure trace to `.agent/reports/ANDON_CORD.md` and alert Gemini (Chief of Staff).
3. **RESET**: Roll back non-viable changes or dispatch fix to implementation worker.
