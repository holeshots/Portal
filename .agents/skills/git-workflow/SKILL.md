---
name: git-workflow
description: "Use Git safely at senior level for branches, commits, rebases, conflict resolution, diffs, and pull-request hygiene. Use when preparing or reviewing source-control changes."
---

# Senior Git Workflow

## Safety principles
- Preserve other engineers' work.
- Never discard uncommitted changes without explicit authorization.
- Never rewrite shared history unless explicitly requested and the consequences are understood.
- Never commit secrets, generated credentials, or environment-specific sensitive files.
- Keep commits and diffs reviewable and scoped to the requested change.

## Before editing
Inspect `git status`, current branch, and relevant diff/history when repository state matters. Distinguish pre-existing user changes from your own.

## Branch and commit discipline
- Follow repository branch conventions.
- Prefer cohesive commits that represent one understandable change.
- Avoid mixing formatting/reorganization with behavior changes unless necessary.
- Write commit messages that explain the outcome/intent, not a transcript of edits.
- Do not commit build artifacts or dependency churn unrelated to the task.

## Diff review
Before handoff inspect the diff for:
- unintended files;
- accidental deletions;
- generated/lockfile changes;
- debug code;
- secrets;
- commented-out code;
- permission/line-ending churn;
- unrelated refactors.

## Conflict resolution
Resolve conflicts semantically, not by blindly choosing ours/theirs. Understand both sides, preserve compatible intent, then build/test the resolved result.

## Rebase/cherry-pick
Use only when appropriate to the requested workflow. After conflict resolution, verify the final diff against the intended change because mechanically successful history operations can still create semantic defects.

## Destructive commands
Treat reset, clean, checkout/restore over modified files, force push, and history rewriting as high risk. Use the least destructive alternative and require explicit user intent where work could be lost.

## Pull-request readiness
A PR-ready branch should have:
- focused diff;
- passing relevant checks;
- no secrets/debug leftovers;
- migration/config notes where needed;
- clear description of behavior, risk, and verification.

## Handoff
Report changed files/commits only when useful, and never claim a push, merge, or remote action occurred unless it actually did.
