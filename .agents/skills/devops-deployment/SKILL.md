---
name: devops-deployment
description: "Design and operate senior-level build, CI/CD, containers, configuration, deployment, migration, rollback, and production-readiness workflows. Use for releases, hosting, pipelines, Docker, and environment setup."
---

# Senior DevOps & Deployment

## Principle
A deployment is part of the feature. Design changes so they can be configured, rolled out, observed, and recovered safely.

## Environment discipline
- Separate code from environment-specific configuration.
- Keep secrets in approved secret stores/CI secret mechanisms.
- Validate required configuration on startup when failure should be immediate.
- Avoid configuration drift between development, staging, and production.
- Never bake real secrets into images or frontend bundles.

## CI pipeline
Prefer deterministic stages such as:
1. dependency restore/install;
2. formatting/static analysis/typecheck;
3. unit tests;
4. integration tests as feasible;
5. build/package;
6. security/dependency checks where established;
7. artifact/image publication;
8. deployment with environment protections.

Fail early on meaningful errors. Cache for speed without masking dependency correctness.

## Containers
- Use minimal supported base images.
- Pin important versions appropriately.
- Run as non-root when practical.
- Use multi-stage builds to reduce production image size.
- Do not copy unnecessary source/secrets into final image.
- Define health behavior based on actual service readiness.

## Database deployments
Coordinate application and schema rollout.
- Prefer backwards-compatible migrations first.
- Ensure old and new app versions can coexist during rolling deployment when needed.
- Separate large backfills/destructive cleanup.
- Define failure recovery before irreversible operations.

## Release strategy
Choose based on risk:
- rolling deployment;
- blue/green;
- canary;
- feature flags;
- staged tenant/user rollout.

High-risk changes should have an explicit rollback or forward-fix plan and observable success criteria.

## Observability
Ensure production can answer:
- is the service healthy?
- are requests/errors/latency changing?
- did the new feature increase failures?
- are external dependencies failing/throttling?
- did background work stop progressing?

Use structured logs and metrics/traces appropriate to the stack. Avoid sensitive data in telemetry.

## Operational resilience
Consider:
- graceful shutdown;
- connection exhaustion;
- dependency timeouts;
- retry amplification;
- queue backlogs;
- disk/memory limits;
- autoscaling behavior;
- backup/restore and disaster recovery.

## Deployment completion gate
Document:
- required config/secrets;
- migration sequence;
- deployment order;
- smoke/health verification;
- monitoring signals;
- rollback/recovery plan;
- manual steps and ownership.
