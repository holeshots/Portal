---
name: frontend-react
description: "Implement and review senior-level React/Vite frontends with robust state boundaries, accessibility, security, performance, and maintainable component design. Use for React UI features and frontend architecture."
---

# Senior React Frontend

## Principles
Build accessible, predictable interfaces with explicit data flow and minimal hidden coupling. The browser is an untrusted client: frontend checks improve UX but never replace server-side authorization or validation.

## Repository-first workflow
Before editing:
- inspect framework/version and TypeScript settings;
- identify routing, state, API client, design system, testing, and error-handling conventions;
- reuse existing components/hooks before creating duplicates;
- understand SSR/CSR assumptions if applicable.

## Component design
- Keep components focused on one coherent responsibility.
- Prefer composition over boolean-prop explosion.
- Separate server state from local UI state.
- Avoid duplicating derived state; compute it from source state when cheap and deterministic.
- Use effects for synchronization with external systems, not as a default data-flow mechanism.
- Keep business rules in appropriate domain/application utilities rather than JSX event handlers.
- Make state ownership intentional; do not lift state globally without a real cross-cutting requirement.

## Data access
Use a centralized, typed API layer where the project supports it.
- Model request/response contracts explicitly.
- Handle cancellation/stale responses for interactive queries.
- Represent loading, success, empty, and error states.
- Avoid leaking backend implementation details into components.
- Do not place secrets or privileged credentials in frontend environment variables or bundles.
- Handle 401/403 distinctly from general failures when user experience differs.

## Forms and mutations
- Use schema/typed validation consistent with the codebase.
- Validate client-side for usability and server-side for trust.
- Prevent duplicate destructive submissions.
- Consider optimistic updates only when rollback/reconciliation is safe.
- Preserve user input on recoverable failures.
- Make destructive actions explicit and appropriately confirmed.

## Accessibility
For interactive UI:
- semantic HTML first;
- keyboard operability;
- visible focus;
- programmatic labels;
- correct button/link semantics;
- logical heading structure;
- useful error announcements where applicable;
- do not rely on color alone to convey meaning.

## Performance
Optimize based on evidence. Check for:
- unnecessary network waterfalls;
- oversized payloads/bundles;
- expensive renders;
- unstable props causing child rerenders;
- unbounded lists;
- duplicate fetching;
- poor image/resource loading.

Do not sprinkle memoization everywhere. Use memoization when it solves a demonstrated or structurally obvious cost.

## Security
- Never render unsanitized untrusted HTML.
- Avoid storing long-lived high-value secrets in browser storage.
- Treat route guards as UX only; authorization belongs on the server.
- Be careful with redirect URLs, file uploads, and user-controlled links.
- Do not log tokens or sensitive PII.

## Testing
Prefer tests that validate user-observable behavior and contract integration:
- critical component states;
- validation and mutation behavior;
- authorization-sensitive UX states;
- regression scenarios;
- high-value user journeys with integration/E2E tests.

Avoid tests that merely mirror implementation details.

## Completion checklist
Confirm relevant:
- typecheck/build/lint/tests pass;
- desktop and responsive behavior remain sound;
- keyboard/accessibility behavior is acceptable;
- loading/error/empty states exist;
- no secrets or privileged logic moved client-side;
- no obvious rendering/network regression was introduced.
