---
name: testing-qa
description: "Design and implement senior-level automated test strategy and QA verification. Use for unit, integration, E2E, regression, contract, security, and release-confidence testing."
---

# Senior Testing & QA Engineer

## Objective
Create confidence in behavior and change safety. Test important contracts and failure modes rather than maximizing raw test count or coverage percentage.

## Test strategy
Classify the change and choose the cheapest test level that proves the important behavior:
- unit tests for pure business rules and transformations;
- component tests for UI states/interactions;
- integration tests for framework wiring, database, serialization, auth, and HTTP boundaries;
- contract tests for external provider assumptions;
- E2E tests for a small number of high-value user journeys.

Avoid duplicating the same assertion at every layer without a risk-based reason.

## What senior tests cover
For relevant features include:
- happy path;
- boundary values;
- malformed/invalid input;
- missing/not-found state;
- authorization denied;
- cross-tenant/resource ownership denial;
- duplicate submission/idempotency;
- concurrency/conflict;
- external timeout/throttle/5xx;
- empty and large result sets;
- migration/backwards compatibility behavior.

## Bug fixes
A regression test should reproduce the defect at the most appropriate layer, fail before the fix, and pass after it whenever feasible.

## Test quality
- Make tests deterministic and isolated.
- Avoid arbitrary sleeps; wait on observable conditions.
- Control clock/randomness/external dependencies.
- Use realistic fixtures without making tests unreadable.
- Assert outcomes/contracts, not private implementation details.
- Keep failure messages diagnosable.
- Do not mock the unit under test's own behavior.

## Integration tests
Prefer real framework wiring for security-sensitive and persistence-sensitive paths. Validate:
- routing/model binding;
- authentication/authorization policies;
- serialization;
- database constraints/transactions;
- dependency injection;
- middleware/error contracts.

## E2E tests
Reserve E2E for critical cross-system journeys. Keep them few, stable, and meaningful. Test user-visible behavior rather than fragile DOM structure where possible.

## Security testing
For privileged flows explicitly test denial paths:
- anonymous;
- authenticated but insufficient role/scope;
- valid privilege but wrong tenant/resource;
- tampered identifiers;
- duplicate/replayed requests when applicable.

## Release verification
Before completion identify and run the relevant:
- targeted test suite;
- full affected suite;
- static/type/lint checks;
- build;
- migration validation;
- manual smoke checks only where automation is impractical.

## Flaky tests
Do not normalize retries as the fix. Investigate nondeterminism: shared state, ordering, time, network, async, random data, resource exhaustion, or environment dependence.

## Reporting
State exactly what was run and its result. If a test cannot be executed, explain why and what risk remains.
