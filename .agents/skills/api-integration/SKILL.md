---
name: api-integration
description: "Build and review robust third-party API integrations at senior level, including Microsoft Graph, REST, GraphQL, OAuth-protected services, webhooks, retries, idempotency, and rate limits."
---

# Senior API Integration Engineer

## Principle
Treat every external API as an unreliable, independently changing system. Encapsulate it behind an internal contract and design for authentication failures, rate limits, timeouts, schema drift, partial failure, and observability.

## Before implementation
Establish from authoritative documentation or the repository:
- exact endpoint and API version;
- authentication flow and least-privilege scopes;
- tenant/user context;
- request/response schema;
- pagination;
- rate limits/throttling behavior;
- idempotency semantics;
- documented errors;
- webhook verification requirements;
- sandbox/test strategy.

Do not guess permission scopes or privileged endpoint behavior.

## Adapter boundary
Centralize integration logic in a dedicated client/adapter/service.
- Convert external DTOs to internal models at the boundary.
- Avoid leaking vendor response shapes across the application.
- Centralize auth headers, serialization, base URL, correlation, and error translation.
- Keep endpoint-specific behavior explicit; avoid an over-generic HTTP wrapper that obscures semantics.

## Resilience
For each operation classify:
- safe to retry automatically;
- retry only with idempotency key;
- never retry automatically;
- retry-after handling;
- timeout budget;
- fallback behavior.

Use bounded retries with jitter/backoff where appropriate. Respect `Retry-After`. Never turn a transient outage into a retry storm.

## Authentication and credentials
- Keep client secrets/certificates/service credentials server-side.
- Use least privilege and the correct delegated vs application permission model.
- Cache tokens safely according to the auth library/provider model.
- Never log tokens or authorization headers.
- Treat token refresh and consent failures as explicit operational states.

## Microsoft Graph-specific discipline
When working with Microsoft Graph:
- verify endpoint version (`v1.0` vs beta) and avoid beta for production unless explicitly accepted;
- verify the exact delegated/application permission for the operation;
- consider tenant admin consent requirements;
- follow Graph throttling guidance;
- use SDK or raw HTTP consistently with repository conventions;
- treat password reset, account disable, role changes, mailbox actions, and session revocation as privileged operations requiring server-side authorization and audit logging.

## Webhooks
- Verify signatures/tokens according to provider documentation.
- Account for duplicate and out-of-order delivery.
- Return acknowledgement quickly and process durable work asynchronously when appropriate.
- Persist event identifiers for deduplication if required.
- Never trust webhook payload identity without verification.

## Error translation
Map vendor errors into a small internal taxonomy such as:
- authentication/consent;
- authorization/permission;
- validation;
- throttled/transient;
- not found/conflict;
- provider unavailable;
- unexpected provider contract.

Preserve diagnostic IDs/correlation IDs in server logs without leaking sensitive details to end users.

## Testing
Test:
- success mapping;
- auth/permission failures;
- throttling/retry behavior;
- timeouts;
- malformed or missing fields;
- pagination;
- duplicate webhook delivery;
- provider 5xx;
- idempotency of privileged mutations.

## Completion gate
Document required scopes, credentials/config, consent/setup, external dependencies, operational failure behavior, and any provider-specific rollout steps.
