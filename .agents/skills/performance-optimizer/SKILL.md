---
name: performance-optimizer
description: "Diagnose and optimize application performance using measurement-driven senior engineering. Use for slow APIs, database queries, frontend rendering, startup, memory, throughput, or scalability issues."
---

# Senior Performance Optimizer

## Rule
Measure before optimizing. Establish a baseline, identify the dominant bottleneck, change one meaningful factor, and verify the result.

## Define the objective
Specify the metric and workload:
- p50/p95/p99 latency;
- throughput;
- CPU/memory;
- query time;
- render/input responsiveness;
- bundle/load time;
- startup time;
- external API latency;
- cost per operation.

A performance claim without a workload and measurement is weak evidence.

## Diagnostic sequence
1. Reproduce under representative load/data.
2. Measure end-to-end.
3. Split time across client, network, API, database, external services, serialization, and rendering.
4. Profile the slowest layer.
5. Form and test a bottleneck hypothesis.
6. Optimize.
7. Re-measure and regression-test correctness.

## Database
Investigate:
- N+1 queries;
- missing/ineffective indexes;
- full scans;
- poor joins/cardinality;
- oversized projections;
- unbounded result sets;
- lock contention;
- repeated round trips;
- ORM-generated SQL.

Use execution plans for material query tuning.

## Backend
Investigate:
- blocking sync-over-async;
- redundant remote calls;
- serialization size;
- excessive allocations;
- contention/locks;
- inefficient algorithms on hot paths;
- connection pool exhaustion;
- unbounded concurrency;
- retry amplification.

## Frontend
Investigate:
- network waterfalls;
- duplicate requests;
- large bundles/resources;
- expensive component trees;
- unnecessary rerenders;
- unbounded DOM/list rendering;
- main-thread blocking;
- layout shift.

Do not apply memoization or caching blindly.

## Caching
Before adding cache define:
- cache key;
- ownership/source of truth;
- TTL;
- invalidation trigger;
- stale-data tolerance;
- tenant/security boundary;
- stampede protection;
- failure behavior.

Never let performance caching create authorization/data-leak defects.

## Output
Report baseline, bottleneck evidence, change, after-measurement, correctness checks, and tradeoffs. Reject changes whose complexity outweighs demonstrated gains.
