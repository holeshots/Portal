---
name: documentation
description: "Create and maintain senior-level engineering documentation for architecture, APIs, setup, operations, decisions, and changes. Use for README, ADR, runbook, integration, and implementation documentation."
---

# Senior Engineering Documentation

## Principle
Documentation should help an engineer make a correct decision or perform a task. Prefer precise, current, repository-specific information over generic prose.

## Before writing
Inspect the code/config/tests that establish truth. Do not document intended behavior as implemented behavior unless verified.

## Choose the right artifact
- **README**: purpose, prerequisites, local setup, common commands.
- **Architecture overview**: boundaries, responsibilities, important flows and constraints.
- **ADR**: decision, context, alternatives, tradeoffs, consequences.
- **API/integration docs**: auth, endpoint/contract, permissions, errors, retries, setup.
- **Runbook**: detection, diagnosis, mitigation, rollback/recovery, escalation.
- **Migration/release note**: compatibility, sequencing, config/schema steps.

## Content standards
Include only relevant details, but make critical constraints explicit:
- source of truth;
- ownership/boundaries;
- security assumptions;
- required permissions/scopes;
- environment variables without secret values;
- failure behavior;
- migration/deployment order;
- verification commands;
- known limitations.

Use examples that are safe to copy. Never include real secrets, live tokens, or sensitive customer data.

## Architecture documentation
Describe why boundaries exist, not just folder names. Include key request/data flow and where authentication, authorization, validation, transactions, integrations, and observability occur.

## Integration documentation
State:
- provider/API version;
- auth flow;
- least-privilege permissions;
- setup/consent;
- rate limits and retry behavior;
- webhook verification if applicable;
- error mapping;
- local/testing setup.

## Runbooks
A production runbook should answer:
- how do we know it is failing?
- what dashboards/logs/correlation IDs matter?
- what are safe first checks?
- how can impact be reduced?
- how do we rollback/recover?
- what actions are dangerous?

## Keep docs maintainable
Prefer links to authoritative code/config over duplicating volatile values. Update nearby docs in the same change when behavior or setup changes.

## Verification
Check commands, paths, names, environment variables, endpoint examples, and architectural claims against the repository before finishing.
