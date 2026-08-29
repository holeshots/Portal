---
name: debugger
description: "Diagnose and fix software defects using evidence-driven senior debugging. Use for crashes, incorrect behavior, flaky tests, integration failures, performance anomalies, and production regressions."
---

# Senior Debugger

## Rule zero
Do not make speculative edits until there is a defensible failure hypothesis. Debugging is evidence gathering and hypothesis elimination, not random code mutation.

## Workflow

### 1. Define the observed failure
Record:
- expected behavior;
- actual behavior;
- reproducibility;
- environment/version;
- earliest known bad state if available;
- error/stack trace/log/correlation data;
- affected and unaffected cases.

### 2. Reproduce minimally
Prefer the smallest deterministic reproduction. If reproduction is not possible, identify the strongest available evidence and explicitly label uncertainty.

### 3. Trace the execution path
Follow data/control flow through the relevant boundaries. Inspect:
- recent changes/diff;
- configuration/environment differences;
- serialization and type conversions;
- async ordering and cancellation;
- auth/permissions;
- database state and query behavior;
- external API responses;
- caches and stale client state.

### 4. Form ranked hypotheses
Write the most likely causes and the evidence that would confirm/refute each. Test cheap/high-signal hypotheses first.

### 5. Identify root cause
Distinguish root cause from symptom. Examples:
- null dereference is a symptom; missing invariant or invalid mapping may be root cause;
- timeout is a symptom; unbounded query or retry storm may be root cause;
- 403 is a symptom; wrong token audience/scope or authorization policy may be root cause.

### 6. Implement the smallest robust fix
- Restore the violated invariant or incorrect contract.
- Avoid broad exception swallowing, arbitrary delays, disabled validation, permissive CORS, or authorization bypasses.
- Do not rewrite unrelated code during a bug fix unless the root cause requires it.

### 7. Add regression protection
Where practical add a test that captures the original failure. Ensure it would fail without the fix.

### 8. Verify beyond the happy path
Retest:
- original reproduction;
- adjacent edge cases;
- negative authorization/validation paths when relevant;
- full affected test suite/build.

## Specialized debugging lenses

### Concurrency/flakiness
Check races, shared mutable state, timing assumptions, non-awaited tasks, test isolation, clock/random dependencies, and database uniqueness/locking.

### API/integration
Inspect exact request/response, status, headers, auth claims/scopes, throttling, timeouts, serialization, environment endpoints, and vendor correlation IDs.

### Database
Check actual stored data, migration state, generated SQL, transaction boundary, isolation/concurrency, nullability, unique/FK constraints, and execution plan.

### Frontend
Check stale closure/state, effect dependencies, request races, cache keys, browser console/network, controlled inputs, route params, and server error contracts.

## Reporting
Summarize:
- root cause;
- evidence;
- fix;
- regression test/verification;
- residual risk.

Never describe a hypothesis as confirmed root cause without supporting evidence.
