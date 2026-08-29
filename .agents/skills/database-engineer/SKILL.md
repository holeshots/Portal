---
name: database-engineer
description: "Design, migrate, query, and review relational databases at senior level, especially PostgreSQL and Supabase. Use for schemas, migrations, indexing, RLS, data integrity, and query performance."
---

# Senior Database Engineer

## Core rule
The database is a consistency boundary, not merely storage. Encode durable invariants using appropriate constraints and transactions rather than relying exclusively on application conventions.

## Discovery
Before schema changes inspect:
- current schema and migration history;
- ORM mappings and query patterns;
- production-scale assumptions;
- RLS/tenant model;
- unique/index constraints;
- retention/soft-delete conventions;
- existing data that may violate a new constraint.

## Schema design
- Choose stable primary keys appropriate to the system.
- Use foreign keys for real referential relationships unless an explicit distributed constraint prevents them.
- Specify nullability intentionally.
- Use unique/check constraints for enforceable invariants.
- Avoid storing derivable data unless justified by performance or historical requirements.
- Normalize by default; denormalize deliberately with a synchronization strategy.
- Model money, timestamps, time zones, and precision explicitly.

## Migrations
Treat migrations as production code.
- Account for existing rows.
- Prefer backwards-compatible expand/migrate/contract sequences for zero/low-downtime systems.
- Avoid long blocking table rewrites on large tables when safer alternatives exist.
- Backfill in controlled batches when appropriate.
- Create indexes with production locking behavior in mind.
- Separate destructive cleanup from initial rollout when rollback may be needed.
- Never assume a migration can simply be reverted if data loss would occur.

## Queries and indexes
- Inspect generated SQL for important ORM paths.
- Avoid N+1 access patterns.
- Index based on actual predicates, joins, ordering, and selectivity.
- Consider composite index column order.
- Do not create speculative indexes indiscriminately; indexes increase write/storage cost.
- Use query plans/EXPLAIN when diagnosing performance.
- Paginate unbounded result sets; prefer keyset pagination for large/changing datasets where appropriate.

## Transactions and concurrency
- Define which invariants require atomicity.
- Keep transactions as short as practical.
- Select locking/isolation intentionally for contested writes.
- Use optimistic concurrency/versioning when suitable.
- Design idempotency for retried writes.

## PostgreSQL/Supabase security
- Treat Row Level Security as a real authorization layer when used.
- Enable policies deliberately; test positive and negative access cases.
- Never expose service-role credentials to clients.
- Separate privileged server operations from end-user sessions.
- Avoid SECURITY DEFINER functions unless ownership, search path, and permissions are carefully controlled.

## Data lifecycle
Consider:
- deletion vs archival;
- legal/audit retention;
- tenant deletion;
- backups and point-in-time recovery;
- PII minimization;
- encryption requirements;
- referential cleanup.

## Verification
For material changes verify:
- migration applies on a representative database;
- application remains compatible during rollout order;
- constraints hold for existing and new data;
- critical queries use acceptable plans;
- RLS/permissions deny unauthorized access;
- rollback/recovery strategy is realistic.
