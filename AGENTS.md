# AGENTS.md — Acrovis Portal Repository Instructions

## Engineering Standard

Treat this repository as production software.

Optimize for:

* correctness
* security
* maintainability
* operability
* minimal unnecessary change

Before making changes:

* Inspect the existing architecture, conventions, and implementation patterns.
* Reuse existing abstractions when they are sound.
* Avoid introducing new architectural patterns unless there is a clear benefit.
* Keep changes scoped to the requested outcome.

Never:

* Weaken authentication, authorization, validation, tenant isolation, tests, or security controls to make implementation easier.
* Expose secrets, privileged credentials, database service keys, Microsoft Graph credentials, or other sensitive configuration to frontend code.
* Commit `.env` files, access tokens, passwords, API keys, certificates, or other secrets.
* Claim that work is complete until relevant verification has succeeded or exact blockers have been clearly stated.

---

## Repository Architecture

### Frontend

* React
* TypeScript
* Vite
* Microsoft Authentication Library (MSAL)
* Vitest
* React Testing Library

### Backend

* ASP.NET Core
* C#
* REST APIs
* xUnit

### Database

* PostgreSQL
* Supabase

### Authentication

* Microsoft Entra ID
* Microsoft identity platform
* MSAL

Authentication and authorization must be treated as separate concerns.

Successful authentication does not automatically grant access to privileged application functionality.

Authorization-sensitive operations must be enforced server-side.

### Integrations

Primary external integrations may include:

* Microsoft Graph
* Microsoft Entra ID
* Vendor APIs
* Remote management/service APIs

External API credentials and privileged integration operations must remain on the backend unless the architecture explicitly requires otherwise and doing so is secure.

---

## Frontend / Backend Boundaries

The frontend may:

* Authenticate users through supported client authentication flows.
* Display application data.
* Submit user actions to backend APIs.
* Maintain UI-specific state.

The frontend must not:

* Contain privileged database credentials.
* Contain Microsoft Graph application secrets.
* Directly perform privileged administrative operations.
* Be trusted as the final authority for authorization.
* Make security-sensitive decisions that should be enforced by the backend.

The backend is responsible for:

* Authorization.
* Business rules.
* Validation of privileged operations.
* Database access requiring elevated permissions.
* External API integrations requiring secrets or application credentials.
* Auditing and security-sensitive operations.

---

## Change Discipline

Keep changes scoped to the requested outcome.

Prefer:

1. Existing patterns.
2. Existing dependencies.
3. Small, understandable changes.
4. Explicit code over unnecessary abstraction.
5. Solutions that are easy to test and maintain.

Avoid:

* Opportunistic unrelated refactoring.
* Large architectural rewrites during small feature work.
* Adding libraries that duplicate existing functionality.
* Premature abstraction.
* Silent changes to public API contracts.
* Silent database schema changes.

Add a dependency only when its benefit clearly outweighs the additional maintenance and security cost.

Preserve public API and data compatibility unless a breaking change has explicitly been accepted.

Treat the following as high-risk changes:

* Database migrations.
* Authentication changes.
* Authorization changes.
* Microsoft Graph permission changes.
* Tenant isolation changes.
* Privileged/admin functionality.
* Secret or credential handling.
* Destructive data operations.
* Deployment/infrastructure changes.

---

## Database Rules

Database changes must consider:

* Existing data.
* Backward compatibility.
* Migration safety.
* Constraints.
* Indexes.
* Referential integrity.
* Authorization and row-level security where applicable.
* Rollback/recovery implications.

Do not rely solely on frontend validation for database integrity.

Use database constraints where the rule represents an actual data invariant.

Avoid destructive migrations unless explicitly required.

---

## API Rules

APIs should:

* Validate incoming data.
* Enforce authorization server-side.
* Return appropriate HTTP status codes.
* Avoid exposing internal implementation details.
* Avoid leaking secrets or sensitive exception information.
* Preserve consistent response contracts.
* Handle external service failures deliberately.

Controllers/endpoints should remain thin when practical.

Business logic should live in appropriate service/domain layers rather than being embedded directly into HTTP endpoints.

Use DTOs/contracts rather than exposing persistence entities directly when separation is appropriate.

Use async I/O for database, filesystem, network, and external API operations.

---

## Microsoft Graph and External APIs

When working with Microsoft Graph or another external API:

* Request the minimum permissions required.
* Distinguish delegated permissions from application permissions.
* Never expose client secrets to the frontend.
* Handle expired or invalid authentication correctly.
* Handle throttling and transient failures.
* Avoid unnecessary API requests.
* Consider pagination when endpoints may return large datasets.
* Preserve external identifiers when they are required for synchronization or deduplication.
* Make synchronization operations idempotent where practical.

For email-to-ticket processing, avoid duplicate ticket creation by maintaining stable external message identifiers and appropriate database constraints or idempotency mechanisms.

---

## Testing and Verification

Tests should protect behavior, not implementation details.

Bug fixes should include regression tests whenever practical.

Security-sensitive functionality should include negative/denial-path tests where appropriate.

### Backend Tests

Run:

```bash
dotnet test AcrovisPortal.sln
```

### Backend Build

Run:

```bash
dotnet build AcrovisPortal.sln
```

### Frontend Tests

From `frontend/`:

```bash
npm test
```

### Frontend Build

From `frontend/`:

```bash
npm run build
```

### Frontend Lint

From `frontend/`:

```bash
npm run lint
```

If a dedicated TypeScript type-check command is added later, include it in required verification.

Do not claim successful verification if a command was not actually executed.

If verification cannot be executed, state exactly what was not verified and why.

---

## Local Development

### Backend

```bash
dotnet run --project backend/AcrovisPortal.Api
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Do not unnecessarily reinstall dependencies when they are already installed and unchanged.

---

## Git and Repository Safety

Before completing substantial work:

* Review the final diff.
* Check for unintended file changes.
* Check for secrets or credentials.
* Remove temporary debugging code.
* Remove commented-out implementation code that is no longer required.
* Verify generated files are intentional.
* Verify database migrations are intentional.
* Verify authorization-sensitive changes.
* Verify configuration changes.

Do not perform destructive Git operations unless explicitly required.

Preserve unrelated uncommitted user changes.

Do not rewrite shared Git history without explicit instruction.

---

## Skill Usage

Superpowers provides the primary software-development process and workflow.

Use Superpowers process skills when applicable for activities such as:

* brainstorming
* planning
* systematic debugging
* test-driven development
* implementation workflows
* parallel/subagent development
* code review
* verification
* Git worktrees
* branch completion

Do not duplicate Superpowers workflow behavior using repository-specific skills.

Specialist skills under `.agents/skills/` provide domain-specific engineering guidance.

Use relevant specialist skills when their domain applies to the task.

Available specialist areas may include:

* API integration
* authentication and security
* database engineering
* DevOps and deployment
* documentation
* ASP.NET Core / C#
* React / TypeScript
* Git workflows
* performance optimization
* architecture
* refactoring
* testing and QA
* UI/UX

Multiple specialist skills may be used together when a task spans multiple domains.

For example:

* React + API integration for frontend API work.
* ASP.NET Core + database engineering for backend persistence work.
* Authentication/security + Microsoft Graph integration for identity-related features.
* Database engineering + testing/QA for migrations.
* Architecture + frontend + backend + database skills for cross-cutting features.

### Instruction Priority

When instructions overlap, use this priority:

1. Direct user instructions.
2. This `AGENTS.md`.
3. Repository/project-specific constraints.
4. Relevant specialist skills from `.agents/skills/`.
5. Superpowers workflow guidance.
6. General/default engineering behavior.

Project-specific requirements take precedence over generic skill recommendations.

If a skill conflicts with an explicit repository constraint, follow the repository constraint.

---

## Definition of Done

A task is not complete merely because code has been written.

Before reporting completion, confirm as applicable:

* Requested behavior is implemented.
* Relevant tests pass.
* Relevant builds pass.
* Lint/type checks pass where applicable.
* Authorization has not been weakened.
* Secrets have not been exposed.
* Database changes are safe.
* External API failure paths have been considered.
* Regression coverage has been added where appropriate.
* Final diff contains no unintended changes.
* Temporary debugging code has been removed.
* Documentation/configuration has been updated when necessary.

If any required verification cannot be completed, clearly state the remaining blocker instead of claiming the task is finished.

---

## Deployment

Deployment platform and production deployment procedures should be documented here once finalized.

Until then:

* Do not assume a deployment provider.
* Do not make infrastructure-specific changes unless explicitly requested.
* Treat production configuration and credentials as environment-specific secrets.
