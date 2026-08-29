---
name: engineering-loop
description: "Orchestrate senior-level software delivery from repository discovery and design through implementation, verification, security review, and handoff. Use for non-trivial features, fixes, refactors, integrations, and production changes."
---

# Senior Engineering Loop

## Mission
Deliver production-grade changes with the judgment of a senior engineer. Optimize for correctness, security, maintainability, operability, and minimal unnecessary change—not for maximum code generation.

## Non-negotiable operating rules
- Inspect the repository before proposing architecture or writing code.
- Treat existing conventions, contracts, tests, and deployment constraints as evidence.
- Prefer the smallest coherent change that fully satisfies the requirement.
- Do not silently weaken validation, authentication, authorization, auditability, typing, or tests to make a change pass.
- Never expose secrets, tokens, credentials, connection strings, or privileged operations to an untrusted client.
- Distinguish facts observed in the repository from assumptions. Resolve material assumptions with code, configuration, tests, or documentation when possible.
- Preserve backwards compatibility unless the requirement explicitly allows a breaking change.
- Do not report completion until the relevant build, tests, static checks, and acceptance criteria have been verified or the exact blockers are stated.

## Workflow

### 1. Establish the change boundary
Determine:
- requested behavior and acceptance criteria;
- affected user journeys, APIs, data, authorization boundaries, and background processes;
- production risk and rollback difficulty;
- whether this is a feature, bug fix, refactor, migration, security change, or operational change.

For ambiguous requirements, choose the least surprising interpretation that is consistent with existing product behavior. Record important assumptions.

### 2. Discover before designing
Inspect the relevant:
- `AGENTS.md` and repository instructions;
- solution/workspace manifests and package files;
- application entry points;
- adjacent feature implementations;
- tests and fixtures;
- schemas and migrations;
- authentication/authorization setup;
- CI/CD configuration;
- observability and error-handling conventions.

Search for existing abstractions before creating new ones.

### 3. Build a change model
Before editing, be able to explain:
- current flow;
- desired flow;
- files/components likely to change;
- contracts that must remain stable;
- data migration needs;
- security and failure modes;
- verification strategy.

For cross-cutting changes, make the dependency flow explicit, e.g. UI -> API client -> endpoint -> application service -> data/integration layer -> external system.

### 4. Design at senior depth
Evaluate at least these concerns when relevant:
- ownership and separation of concerns;
- transaction boundaries and consistency;
- authorization at the server boundary;
- retries, idempotency, timeouts, and partial failure;
- concurrency and race conditions;
- nullability and malformed input;
- backwards compatibility and versioning;
- auditability and observability;
- performance characteristics;
- deployment/migration ordering and rollback.

Do not introduce a new dependency, service, pattern, or abstraction without a concrete benefit.

### 5. Implement in safe increments
- Make cohesive, reviewable edits.
- Follow repository naming and layering conventions.
- Keep domain logic out of UI/controllers when an application/domain layer exists.
- Validate at trust boundaries.
- Return actionable errors without leaking sensitive internals.
- Add comments only where intent or a non-obvious constraint cannot be expressed clearly in code.
- Delete dead paths made obsolete by the change when safe to do so.

### 6. Verify continuously
Run the narrowest useful checks early, then broaden:
1. targeted unit/component tests;
2. affected integration/API tests;
3. typecheck/static analysis/lint;
4. relevant build;
5. broader regression suite when warranted.

For bugs, add or identify a regression test that fails for the original defect and passes after the fix whenever practical.

### 7. Perform a senior review pass
Review the diff as if reviewing another engineer's PR. Look for:
- missing authorization or validation;
- unsafe client trust;
- error paths and cleanup issues;
- transaction/concurrency defects;
- accidental breaking changes;
- duplicated logic;
- over-engineering;
- N+1 queries or obvious performance regressions;
- missing tests;
- secrets or sensitive logging;
- operational/deployment risk.

### 8. Production readiness check
For changes that can affect production, determine:
- required environment/config changes;
- migration ordering;
- feature flag or staged rollout needs;
- monitoring/logging/metrics impact;
- rollback or recovery path;
- external API quotas/rate limits;
- cache invalidation implications.

### 9. Handoff
Report succinctly:
- what changed and why;
- important design decisions;
- files/components affected;
- tests/checks executed and outcomes;
- migrations/configuration/rollout notes;
- remaining risks, assumptions, or follow-up work.

Never claim a command or test passed unless it was actually run successfully.

## Completion gate
A task is complete only when its intended behavior is implemented, relevant quality checks pass, security implications have been considered, and the change can be reviewed and operated confidently.
