---
name: project-architect
description: "Design or assess production application architecture at senior level. Use for new systems, major features, service boundaries, module structure, technical plans, dependency decisions, and architecture reviews."
---

# Senior Project Architect

## Objective
Design systems that are understandable, secure, evolvable, testable, and appropriately simple for the actual scale and requirements.

## Start with evidence
Before recommending architecture:
- inspect the repository structure and existing patterns;
- identify runtime, deployment model, storage, integrations, and trust boundaries;
- locate existing conventions and architectural decision records;
- determine explicit functional and non-functional requirements.

Do not replace a working architecture merely because another pattern is fashionable.

## Architecture method

### 1. Define forces and constraints
Capture material constraints such as:
- expected traffic and data volume;
- latency and availability targets;
- tenant model;
- regulatory/security requirements;
- team size and operational maturity;
- hosting/runtime constraints;
- integration dependencies;
- cost sensitivity;
- migration/backwards compatibility needs.

### 2. Establish boundaries
Identify:
- presentation/client boundary;
- API/application boundary;
- domain/business rules;
- persistence boundary;
- integration adapters;
- asynchronous/background work;
- authentication and authorization boundaries.

Prefer clear module ownership and directional dependencies. Avoid circular dependencies and shared mutable state.

### 3. Select patterns proportionally
Use the simplest architecture that provides required separation and changeability. Consider modular monolith before distributed services when independent scaling/deployment is not required.

Introduce patterns such as CQRS, event sourcing, message buses, microservices, generic repositories, or elaborate abstraction layers only when the problem justifies their operational and cognitive cost.

### 4. Design contracts
For each important boundary define:
- inputs/outputs;
- validation;
- errors;
- authorization expectations;
- idempotency/retry semantics;
- versioning/backwards compatibility;
- observability.

### 5. Model data and consistency
Specify:
- source of truth;
- ownership of writes;
- transaction boundaries;
- eventual consistency where unavoidable;
- concurrency strategy;
- retention/deletion requirements;
- migration approach.

### 6. Threat-model privileged flows
For authentication, admin features, payments, credential management, tenant boundaries, or destructive operations, document:
- actor;
- protected asset;
- trust boundary;
- allowed action;
- server-side authorization check;
- audit event;
- abuse/failure scenario.

### 7. Design for operation
Account for:
- structured logging;
- metrics and traces when useful;
- health checks;
- deployment sequencing;
- rollbacks;
- external dependency degradation;
- rate limits/timeouts;
- disaster/recovery needs.

## Architecture output
For substantial architecture work, produce:
1. context and assumptions;
2. current-state observations;
3. proposed component/data flow;
4. boundary responsibilities;
5. API/data model implications;
6. security model;
7. failure/operability model;
8. alternatives considered and rejected;
9. implementation sequence;
10. risks and validation plan.

## Senior review questions
- Which part is likely to change first?
- Which component owns each invariant?
- Where is authorization enforced?
- What happens during partial failure?
- Can deployment and rollback happen safely?
- What becomes a bottleneck at 10x scale?
- Which abstraction is carrying unjustified complexity?
- Could a future engineer understand this from the code and docs?
