# AGENTS.md — Senior Full-Stack Repository Instructions

## Engineering standard
- Treat this repository as production software. Optimize for correctness, security, maintainability, operability, and minimal unnecessary change.
- Inspect existing architecture and conventions before creating new patterns.
- Never weaken authentication, authorization, validation, tenant isolation, tests, or security controls to make a task easier.
- Never expose secrets or privileged external API credentials to frontend code.
- Do not claim completion until relevant verification has run successfully or exact blockers are stated.

## Repository facts to customize
Replace this section with project truth:
- Frontend: React + Vite + TypeScript
- Backend: ASP.NET Core / C#
- Database: PostgreSQL / Supabase
- Integrations: Microsoft Graph and other vendor APIs
- Test commands: [ADD]
- Build commands: [ADD]
- Lint/typecheck commands: [ADD]
- Local development commands: [ADD]
- Deployment platform: [ADD]

## Change discipline
- Keep changes scoped to the requested outcome.
- Reuse existing abstractions where they are sound.
- Add dependencies only when justified.
- Preserve public API/data compatibility unless breaking change is explicitly accepted.
- Treat migrations and privileged/admin operations as high risk.
- Add regression tests for bug fixes whenever practical.
- Review the final diff for unintended files, secrets, debug code, missing authorization, and migration/deployment risk.

## Skill usage
For non-trivial work, follow `.agents/skills/engineering-loop/SKILL.md` and apply relevant specialist skills from `.agents/skills/`.
