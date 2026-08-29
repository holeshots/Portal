---
name: refactoring
description: "Refactor existing code at senior level while preserving behavior, contracts, and rollout safety. Use to reduce complexity, improve boundaries, remove duplication, or modernize code without unnecessary rewrites."
---

# Senior Refactoring Engineer

## Goal
Improve internal structure while preserving externally observable behavior unless an intentional behavior change is explicitly part of the task.

## Preconditions
Before refactoring:
- understand current behavior and callers;
- identify tests that protect the behavior;
- inspect public/API/data contracts;
- separate existing defects from structural weaknesses;
- define the specific maintainability problem being solved.

Do not perform broad rewrites solely for stylistic preference.

## Refactoring strategy
Prefer a sequence of small transformations:
1. add characterization/regression tests where protection is weak;
2. isolate responsibilities;
3. introduce/strengthen seams;
4. move logic behind stable interfaces;
5. remove duplication/dead code;
6. simplify naming/control flow;
7. remove obsolete compatibility paths when verified safe.

Keep the code buildable/testable throughout when practical.

## Architectural refactors
For boundary changes consider:
- dependency direction;
- transaction ownership;
- DTO/domain/persistence separation;
- configuration compatibility;
- DI lifetimes;
- API versioning;
- migration/deployment ordering.

## Database/API refactors
Use expand-and-contract when consumers cannot migrate atomically. Preserve backwards compatibility during rollout, then remove old paths in a later safe step.

## Avoid common traps
- giant “cleanup” diffs mixed with feature work;
- new abstraction with only one speculative use;
- generic repositories/services that hide important domain semantics;
- changing tests to match broken behavior without validating intent;
- renaming public contracts without migration strategy;
- performance regressions caused by cleaner-looking but more expensive code.

## Verification
Compare before/after:
- tests;
- public contracts;
- query/API behavior where relevant;
- performance characteristics of hot paths;
- authorization and error semantics.

## Completion
Explain what complexity was removed, which behavior/contracts were preserved, and any remaining migration/follow-up work.
