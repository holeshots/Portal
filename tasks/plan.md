# Implementation Plan: Microsoft Entra Authentication and Authorization

## Overview

Integrate Microsoft Entra ID with the React SPA and ASP.NET Core API so workforce users sign in with Microsoft, portal routes require an authenticated identity, and every protected API endpoint enforces delegated scopes and application roles server-side. The first rollout should be a single-tenant workforce pilot unless the product owner explicitly chooses multitenant customer access.

This plan covers authentication and portal authorization foundations only. Microsoft Graph, background/daemon access, customer tenant onboarding, production ticket persistence, and privileged Entra administration are separate features.

## Current State

- React routes are public and the login/sign-out behavior is a UI-only demo.
- The frontend calls `/api/navigation` without an access token.
- The ASP.NET Core pipeline has CORS but no authentication or authorization middleware.
- Ticket data and mutations are browser-memory demo state and do not cross the API boundary.
- Frontend verification uses Vitest/React Testing Library; backend verification uses xUnit.

## Decisions Required Before Implementation

1. **Tenant model:** Recommended for the pilot: accounts in the Acrivos organization only (single tenant). Choose multitenant only if technicians or customers must sign in with identities from other organizations. Multitenant mode requires tenant onboarding and a server-side allowed-tenant policy; accepting any `tid` is not sufficient.
2. **Initial roles:** Recommended values: `Portal.Admin`, `Portal.Technician`, and `Portal.Viewer`. Confirm who receives each role and whether unassigned authenticated users see an access-denied page or may enter as Viewer.
3. **Environment URLs:** Confirm local, test/staging, and production frontend origins and callback/logout URLs.
4. **Entra ownership:** Identify the tenant administrator who can create app registrations, grant consent, assign users/groups, and own the enterprise applications.
5. **Access policy:** Decide whether assignment is required for the enterprise application. Recommended for a controlled pilot: require assignment and use Entra groups for role assignment where licensing and tenant policy permit.

## Requirements

### Organizational and Entra prerequisites

- Access to a Microsoft Entra workforce tenant.
- A tenant administrator with sufficient rights to create/configure app registrations and grant required consent (Microsoft documents Cloud Application Administrator as a suitable role for API registration work).
- At least four non-production test identities: Admin, Technician, Viewer, and authenticated-but-unassigned/denied.
- Separate local and production redirect/logout URIs; add staging URIs if a staging environment exists.
- Named owners for both app registrations and a documented emergency recovery owner.

### App registrations

Create two registrations, following Microsoft's client/API separation:

1. **Acrivos Portal SPA**
   - Platform type: Single-page application.
   - Authorization code flow with PKCE through MSAL; do not enable or implement implicit flow.
   - Local redirect URI such as `http://localhost:5173/` and exact deployed redirect/logout URIs.
   - Delegated permission to the Acrivos Portal API scope.
   - No client secret: a browser SPA cannot securely hold one.

2. **Acrivos Portal API**
   - Application ID URI, normally `api://<api-client-id>`.
   - Delegated scope such as `Portal.Access` for user-on-behalf-of API calls.
   - User/group app roles: `Portal.Admin`, `Portal.Technician`, `Portal.Viewer` after product-owner approval.
   - No interactive redirect URI required for the API registration.

Do not request Microsoft Graph permissions in this phase. The identity token/account information is sufficient for the basic portal identity display. Add Graph later only for an explicit feature such as profile photos or directory search, using least privilege.

### Frontend requirements

- Add supported MSAL packages for React/browser and initialize them once at the application root.
- Load tenant ID, SPA client ID, API scope, and redirect URI from typed environment configuration. These identifiers are configuration, not secrets, but must differ by environment.
- Replace the email/password demo with a Microsoft sign-in action and honest loading/error states.
- Add an authentication boundary around the portal layout. Direct navigation to `/` or `/tickets` while unauthenticated must begin sign-in or route to `/login` without briefly exposing protected content.
- Acquire an API access token silently before protected API calls and handle `interaction_required` through an intentional interactive path.
- Centralize authenticated API calls so bearer-token attachment and `401`/`403` handling are not duplicated across pages.
- Render the signed-in user's real display identity and approved application role; do not infer authorization from hidden menu items.
- Replace demo sign-out with MSAL logout and return to an allowed post-logout URI.
- Avoid custom token parsing for security decisions and avoid long-lived credentials in browser-controlled storage.

### Backend requirements

- Add `Microsoft.Identity.Web` and configure JWT bearer authentication for the Entra tenant, API client ID/audience, issuer, signature, and token lifetime validation.
- Add authentication before authorization in the ASP.NET Core middleware pipeline.
- Require authentication by default for application APIs, explicitly documenting any anonymous health or metadata endpoints.
- Verify the delegated API scope in addition to `[Authorize]`; token validity alone does not prove the caller has permission for this API operation.
- Define named authorization policies for the approved portal roles. Enforce policies on controllers/endpoints, not in repositories or frontend routing.
- Return `401` for absent/invalid authentication and `403` for an authenticated caller lacking scope/role.
- Use the Entra object ID (`oid`) as the stable external user identifier where application data later needs ownership/audit references; do not use display name or email as an immutable key.
- Never log authorization headers, access tokens, ID tokens, or sensitive claims. Add structured authentication/authorization failure events without token contents.
- Restrict production CORS to exact deployed frontend origins; do not use permissive origins to solve local-development issues.

### Authorization and tenant boundary

- Authentication answers who the user is; app roles and resource policies determine what they can do.
- For single tenant, validate the configured tenant issuer. For multitenant, validate `tid` against an explicit onboarded-tenant allowlist and apply tenant isolation to every data query once persistence is introduced.
- Default-deny users with missing or unknown roles.
- UI visibility is convenience only. The API remains the authorization decision point for every protected operation.

### Configuration and secrets

- Commit safe configuration templates containing placeholders only.
- Store environment-specific values in deployment configuration/user secrets; never commit secrets or production values that grant privilege.
- The initial SPA-to-API delegated flow needs client IDs/tenant IDs/scopes but no browser client secret and normally no API client secret for token validation.
- If a later backend feature calls Microsoft Graph on behalf of users or as a daemon, plan that separately and prefer a managed identity or certificate over a long-lived client secret where supported.

## Proposed Flow

```text
Browser -> React/MSAL -> Microsoft Entra sign-in
   |                         |
   |<----- ID/account -------|
   |<----- API token --------|
   |
   +-- Authorization: Bearer <access token> --> ASP.NET Core API
                                                   |
                                      validate issuer/audience/signature/lifetime
                                                   |
                                      verify Portal.Access + required app role
                                                   |
                                      controller/service/repository response
```

## Implementation Sequence and Ownership

### Phase 0: Product and security decisions — Product Owner + Project Manager

- Confirm tenant model, role matrix, environment URLs, assigned-user policy, and Entra administrator.
- Record the final decision in the plan before engineers implement authentication.

### Phase 1: Entra foundation — Backend Engineer + Tenant Administrator

- Create the API and SPA registrations, expose `Portal.Access`, define approved roles, configure redirect URIs, grant consent, and assign test identities.
- Produce a sanitized configuration handoff containing tenant ID, both client IDs, API scope, and redirect URIs—never credentials.

### Phase 2: Backend protection — Backend Engineer

- Add Microsoft Identity Web, authentication/authorization middleware, scope verification, role policies, and negative-path integration tests.
- Protect navigation first as the smallest complete API slice.

### Phase 3: Frontend sign-in slice — Frontend Engineer

- Add MSAL initialization, Microsoft login/logout, route protection, real user identity, and authentication state/error UI.
- Keep current pages intact; authentication wraps the existing portal rather than rewriting it.

### Phase 4: Authenticated API slice — Both Engineers after the contract is fixed

- Frontend attaches an access token through one API client boundary.
- Backend validates the token, `Portal.Access`, and the minimum role required by `/api/navigation`.
- Verify success, `401`, and `403` end to end before protecting additional endpoints.

### Phase 5: Role-aware portal and hardening — Both Engineers

- Apply the agreed role matrix, add access-denied/session-expired experiences, enforce exact CORS origins, add audit-safe logs, and test wrong-tenant/wrong-audience/missing-scope scenarios.

### Phase 6: Deployment and pilot — Project Manager + DevOps/Tenant Administrator

- Configure staging/production app settings and redirect URIs, deploy API before enforcing authenticated frontend calls, run smoke tests with each role, and pilot with assigned users.
- Retain a rollback path to the last known-good deployment; do not create an authentication bypass flag for production.

## Parallelization

- Phase 0 and app-registration contracts must finish first.
- After sanitized identifiers and the scope/role contract are fixed, frontend MSAL work and backend middleware/policy work can proceed in parallel.
- The authenticated navigation slice, cross-role tests, and deployment verification require coordination and should be treated as shared checkpoints.

## Verification Matrix

| Scenario | Expected result |
|---|---|
| Unauthenticated user opens `/tickets` | Microsoft sign-in begins or login page is shown; ticket UI is not exposed |
| Valid assigned user signs in | Portal loads and authenticated navigation API succeeds |
| Valid token missing `Portal.Access` | API returns `403` |
| Missing, expired, malformed, wrong-audience, or wrong-issuer token | API returns `401` |
| Authenticated user with unknown/missing role | Access denied by default |
| Wrong tenant in single-tenant mode | Sign-in/API access denied |
| User signs out | Microsoft session logout is invoked and portal routes become inaccessible |
| API unavailable/token acquisition fails | Actionable non-sensitive error; no infinite redirect loop |
| Desktop/mobile direct navigation and refresh | Auth state resolves without flashing protected content |

Required checks at each checkpoint:

```powershell
dotnet test AcrovisPortal.sln
cd frontend
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

Also run browser end-to-end smoke tests against a non-production Entra registration for Admin, Technician, Viewer, and denied identities. Automated tests must cover negative authorization paths; mocked frontend auth tests alone are insufficient.

## Rollout and Rollback

- Use separate Entra registrations or at minimum separate redirect URIs/configuration per environment; production must never depend on localhost callbacks.
- Configure the API and validate tokens before deploying a frontend that assumes protected endpoints.
- Pilot with a small assigned group and review sign-in failures, `401`/`403` rates, and authorization logs.
- Roll back application deployments together if the client/API contract changes. Fix Entra configuration forward where possible; never relax issuer, audience, scope, tenant, or role validation as an emergency workaround.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Choosing multitenant too early | High complexity and tenant-isolation risk | Start single tenant; design explicit onboarding before enabling other tenants |
| Treating frontend role checks as security | Privilege escalation | Enforce every permission in ASP.NET Core policies |
| Valid token but wrong audience/scope | Unauthorized API access | Validate audience and require the delegated scope per endpoint |
| Redirect URI mismatch across environments | Sign-in outage | Maintain an environment URI inventory and verify before deployment |
| Redirect loop during token failure | Portal unusable | Model loading, interaction-required, denied, and terminal error states explicitly |
| Over-requesting Microsoft Graph permissions | Excessive privilege/consent friction | Request no Graph permissions until a concrete feature requires them |
| Secrets or tokens logged/committed | Credential exposure | Placeholder configs, secret scanning, redacted structured logs, final diff review |
| Role/group changes not reflected immediately | Stale authorization until token refresh | Define expected token/session refresh behavior and test revocation/role-change scenarios |

## Definition of Done

- The approved tenant and role model is documented.
- Both app registrations are owned, configured, and reproducible from an operations checklist.
- Login and logout use Microsoft Entra; no portal password is collected.
- Portal routes resolve authentication safely without protected-content flashes or redirect loops.
- Protected APIs validate token integrity, issuer, audience, lifetime, delegated scope, role, and tenant as applicable.
- Negative authorization tests pass, including missing scope/role and wrong tenant/audience.
- Frontend tests/lint/build and backend tests/build pass.
- Browser smoke tests pass for every initial role and denied access.
- No token, secret, permissive CORS rule, debug bypass, or production localhost callback is present.
- Deployment, monitoring, support, and rollback notes are current.

## Authoritative References

- [Microsoft: Configure an application to expose a web API](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-configure-app-expose-web-apis)
- [Microsoft: Configure client access to a protected web API](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-configure-app-access-web-apis)
- [Microsoft: Verify scopes and app roles in a protected API](https://learn.microsoft.com/en-us/entra/identity-platform/scenario-protected-web-api-verification-scope-app-roles)
- [Microsoft: Authorization code flow and SPA redirect URIs](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)
- [Microsoft: Single- and multitenant account types](https://learn.microsoft.com/en-us/security/zero-trust/develop/identity-supported-account-types)

