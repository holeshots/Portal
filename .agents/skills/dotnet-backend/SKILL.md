---
name: dotnet-backend
description: "Implement and review production ASP.NET Core and C# backend systems at senior level. Use for APIs, services, middleware, EF Core, background work, dependency injection, and backend architecture."
---

# Senior .NET Backend

## Mission
Build reliable ASP.NET Core services with explicit contracts, correct lifetimes, secure boundaries, observable failures, and clean domain/application logic.

## First inspect
Determine:
- target .NET version and nullable settings;
- controllers vs minimal APIs;
- application/domain/data layering;
- DI registrations/lifetimes;
- EF Core/provider conventions;
- authentication/authorization model;
- exception/problem-details handling;
- logging/tracing patterns;
- test infrastructure.

## API boundaries
- Bind to request DTOs rather than persistence entities when contracts differ.
- Validate malformed and semantically invalid input at boundaries.
- Enforce authorization server-side using policies/claims/roles appropriate to the application.
- Use stable error contracts such as Problem Details when the project does so.
- Avoid leaking stack traces, SQL details, tokens, or internal identifiers unnecessarily.
- Preserve cancellation tokens through async call chains for request-scoped I/O.

## Service design
- Keep controllers/endpoints thin when an application/service layer exists.
- Place business invariants in a layer that is testable independently of HTTP.
- Prefer explicit dependencies and constructor injection.
- Respect DI lifetimes; never capture scoped services in singletons.
- Avoid service-locator patterns and hidden global state.
- Use async for I/O; avoid sync-over-async (`.Result`, `.Wait()`) in request paths.

## EF Core and persistence
- Project only required columns for read paths.
- Use `AsNoTracking` where identity tracking is not needed and consistent with project conventions.
- Avoid accidental N+1 queries.
- Make transaction boundaries explicit for multi-write invariants.
- Handle optimistic concurrency when competing writes are plausible.
- Keep migrations deterministic and deployment-safe.
- Do not expose `IQueryable` across inappropriate architectural boundaries.

## External dependencies
For HTTP/database/queue calls:
- set appropriate timeouts;
- pass cancellation;
- classify retryable vs non-retryable failures;
- use retries only for idempotent/safe operations or with idempotency controls;
- avoid retry storms;
- propagate correlation/trace context where supported.

## Background services
- Scope dependencies correctly per operation.
- Make work idempotent where duplicate delivery can occur.
- persist durable progress when required;
- handle graceful shutdown and cancellation;
- define dead-letter/error handling for unrecoverable work.

## Security
- Never trust tenant/user identifiers from the client without authorization validation.
- Keep privileged credentials server-side.
- Prefer least-privilege scopes and managed secret stores.
- Validate uploads and externally supplied URLs.
- Protect mass-assignment/over-posting by explicit DTO mapping.
- Audit privileged and destructive operations when applicable.

## Observability
Log structured, actionable events with enough context to diagnose behavior without sensitive data. Prefer one meaningful log at the layer that can add context over repeated noisy logging of the same exception.

## Testing
Include the right mix of:
- unit tests for domain/application rules;
- integration tests for HTTP, auth, persistence, serialization, and real DI wiring;
- regression tests for defects;
- contract tests for critical external integrations where feasible.

## Completion gate
Run applicable restore/build/test/format/analyzer checks and inspect the diff for API compatibility, authorization, data consistency, DI lifetime, cancellation, and migration risks.
