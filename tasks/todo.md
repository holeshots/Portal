# Microsoft Entra Integration Tasks

Do not begin implementation until Task 1 is approved by the product owner. Detailed context and risks are in `tasks/plan.md`.

## Task 1: Approve identity and access decisions

**Description:** Record the tenant model, initial role matrix, assignment policy, environment URLs, and responsible Entra administrator.

**Acceptance criteria:**
- [ ] Single-tenant or multitenant mode is explicitly approved.
- [ ] `Portal.Admin`, `Portal.Technician`, and `Portal.Viewer` are approved or replaced with a documented role matrix.
- [ ] Local, staging (if used), and production redirect/logout URLs and the Entra administrator are identified.

**Verification:**
- [ ] Product owner reviews and approves `tasks/plan.md` decisions.

**Dependencies:** None

**Files likely touched:** `tasks/plan.md`, architecture/operations documentation

**Estimated scope:** Small

## Task 2: Create Entra SPA and API registrations

**Description:** Create two owned registrations, expose the delegated API scope, define approved user/group roles, configure exact redirect URIs, grant consent, and assign non-production test users.

**Acceptance criteria:**
- [ ] SPA registration uses the SPA platform and authorization code with PKCE; no browser client secret exists.
- [ ] API registration exposes the approved scope and roles, with owners assigned to both registrations.
- [ ] Admin, Technician, Viewer, and denied test identities can be used in the non-production tenant.

**Verification:**
- [ ] Sanitized tenant ID, client IDs, scope, roles, and redirect URI inventory are reviewed against the Entra portal.

**Dependencies:** Task 1

**Files likely touched:** deployment configuration documentation only

**Estimated scope:** Medium

## Task 3: Define typed authentication configuration and API contract

**Description:** Establish environment-specific frontend/backend configuration keys and the shared scope/role/HTTP error contract before parallel implementation begins.

**Acceptance criteria:**
- [ ] Safe configuration templates contain placeholders and fail fast when required values are absent.
- [ ] `Portal.Access`, role values, `401`, and `403` semantics are documented consistently for both engineers.
- [ ] No secret or privileged credential is committed or exposed to React.

**Verification:**
- [ ] Configuration and contract review passes; secret scan/final diff contains no credentials.

**Dependencies:** Task 2

**Files likely touched:** frontend environment typings/templates, backend appsettings templates, README/architecture documentation

**Estimated scope:** Medium

## Task 4: Protect the ASP.NET Core API foundation

**Description:** Add Microsoft Identity Web, JWT bearer authentication, default authorization, delegated-scope validation, and named role policies.

**Acceptance criteria:**
- [ ] The API validates issuer, audience, signature, lifetime, tenant, and `Portal.Access`.
- [ ] `/api/navigation` requires the documented minimum role and returns correct `401`/`403` results.
- [ ] Logs contain useful failure context without tokens or sensitive claims.

**Verification:**
- [ ] Focused backend authentication/authorization tests pass.
- [ ] `dotnet test AcrovisPortal.sln` passes.
- [ ] Manual calls verify success, missing token, missing scope, wrong audience, wrong tenant, and insufficient role.

**Dependencies:** Task 3

**Files likely touched:** API project file, `Program.cs`, configuration, authorization policies, controller/integration tests

**Estimated scope:** Medium (split into middleware and policy/test subtasks if more than five files)

## Task 5: Add React MSAL authentication foundation

**Description:** Initialize MSAL, replace demo credential fields with Microsoft sign-in, add auth states, and protect the portal layout.

**Acceptance criteria:**
- [ ] Login uses Microsoft redirect/popup through MSAL and never collects a Microsoft password.
- [ ] Unauthenticated direct routes cannot expose portal content, and loading/error/interaction-required states do not redirect-loop.
- [ ] The header displays the authenticated identity while authorization remains server-enforced.

**Verification:**
- [ ] Focused frontend auth and routing tests pass.
- [ ] `npm.cmd test`, `npm.cmd run lint`, and `npm.cmd run build` pass.
- [ ] Browser check covers login, refresh, direct navigation, cancellation, and sign-in failure on desktop/mobile.

**Dependencies:** Task 3

**Files likely touched:** frontend dependencies, root bootstrap, auth module/provider, routes/layout, login/header tests

**Estimated scope:** Medium (split provider/config and route/UI work into separate PRs if needed)

## Checkpoint A: Authentication foundations

- [ ] Tasks 1–5 are reviewed.
- [ ] Both projects build and all existing tests pass.
- [ ] No secrets, implicit flow, permissive production CORS, or auth bypass exists.
- [ ] Project manager approves the client/API contract before integration.

## Task 6: Create the authenticated frontend API client

**Description:** Centralize silent token acquisition, bearer attachment, and consistent `401`/`403`/interaction-required handling, then migrate navigation to it.

**Acceptance criteria:**
- [ ] `/api/navigation` receives an API access token with the approved scope.
- [ ] Token acquisition and error handling are centralized rather than duplicated in pages.
- [ ] Failed authentication produces a bounded recovery path and non-sensitive user feedback.

**Verification:**
- [ ] API-client unit tests cover success, interaction required, `401`, and `403`.
- [ ] Frontend tests/lint/build pass.
- [ ] End-to-end navigation call succeeds for an assigned test user.

**Dependencies:** Tasks 4 and 5

**Files likely touched:** frontend API/auth client, `PortalLayout`, related tests

**Estimated scope:** Medium

## Task 7: Implement real Entra sign-out and session behavior

**Description:** Replace demo sign-out with MSAL logout, define post-logout behavior, and handle expiry/account changes without leaving stale protected UI.

**Acceptance criteria:**
- [ ] Sign out invokes Microsoft logout and returns only to an allowlisted URI.
- [ ] After sign-out, protected routes and API calls are inaccessible.
- [ ] Expired sessions and account changes resolve without redirect loops or stale identity display.

**Verification:**
- [ ] Frontend session/logout tests and browser smoke tests pass.
- [ ] Direct navigation after logout requires authentication.

**Dependencies:** Tasks 5 and 6

**Files likely touched:** user menu, auth/session module, route tests

**Estimated scope:** Medium

## Task 8: Apply and test the role matrix

**Description:** Enforce approved roles in backend policies and provide role-appropriate frontend navigation/access-denied UX without treating UI hiding as authorization.

**Acceptance criteria:**
- [ ] Admin, Technician, and Viewer receive only their documented API permissions.
- [ ] Missing/unknown roles are denied by default.
- [ ] Every protected endpoint has an explicit minimum authorization policy.

**Verification:**
- [ ] Backend negative authorization tests cover all role boundaries.
- [ ] Browser smoke tests pass for Admin, Technician, Viewer, and denied identities.

**Dependencies:** Tasks 4 and 6

**Files likely touched:** backend policies/controllers/tests, frontend navigation/access-denied components/tests

**Estimated scope:** Medium (implement one vertical endpoint slice per task/PR)

## Checkpoint B: End-to-end authorization

- [ ] Signed-in navigation works through React -> token acquisition -> protected API.
- [ ] Expected `401` and `403` paths are verified end to end.
- [ ] Wrong-tenant, wrong-audience, missing-scope, and missing-role tests pass.
- [ ] Frontend and backend regression suites are green.

## Task 9: Harden configuration, logging, and CORS

**Description:** Finalize environment separation, exact origins/redirects, audit-safe authentication logging, and operational diagnostics.

**Acceptance criteria:**
- [ ] Local, staging, and production configuration is separated and validated at startup.
- [ ] Production CORS and redirect/logout URIs are exact allowlists with no localhost entries.
- [ ] Logs support diagnosing sign-in/authorization failures without tokens or sensitive claims.

**Verification:**
- [ ] Configuration review, secret scan, production build, and negative-origin tests pass.

**Dependencies:** Checkpoint B

**Files likely touched:** deployment settings/templates, API logging/CORS configuration, operations documentation

**Estimated scope:** Medium

## Task 10: Deploy and run the assigned-user pilot

**Description:** Deploy in safe order, test all roles against non-production and production configuration, then release to a small assigned group with monitoring and rollback readiness.

**Acceptance criteria:**
- [ ] API and Entra configuration are ready before the authenticated frontend is released.
- [ ] Role-based smoke tests pass in the deployed environment.
- [ ] Rollback steps, support owner, and failure-monitoring signals are documented.

**Verification:**
- [ ] Full frontend/backend checks pass on the release candidate.
- [ ] Pilot users complete sign-in, authorized navigation, denied access, and sign-out scenarios.
- [ ] `401`/`403` and sign-in-failure telemetry is reviewed after rollout.

**Dependencies:** Task 9

**Files likely touched:** deployment configuration and runbook

**Estimated scope:** Medium

## Checkpoint C: Production readiness

- [ ] Definition of Done in `tasks/plan.md` is satisfied.
- [ ] Security review finds no authorization bypass, tenant-isolation gap, token leakage, or insecure configuration.
- [ ] Product owner accepts the pilot behavior and remaining production follow-ups.

