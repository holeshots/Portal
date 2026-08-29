---
name: ui-ux
description: "Design and review production UI/UX at senior engineering level with accessibility, responsive behavior, states, interaction safety, consistency, and implementation feasibility. Use for application interface work."
---

# Senior UI/UX Engineering

## Goal
Create interfaces that are clear, accessible, resilient to real data, and consistent with the product's existing design language.

## Context first
Inspect existing design system/components, spacing/type conventions, responsiveness, accessibility patterns, and comparable product flows before inventing new UI.

## Interaction design
For each action define:
- default state;
- hover/focus/pressed behavior where applicable;
- loading/progress;
- success/confirmation;
- empty state;
- recoverable error;
- validation error;
- disabled/unavailable state;
- permission-denied state when relevant.

Avoid ambiguous controls. Buttons perform actions; links navigate.

## Forms
- Group related fields.
- Use persistent labels rather than placeholder-only labels.
- Provide actionable validation messages near the relevant field.
- Preserve user-entered data after recoverable errors.
- Do not disable submit without explaining an unobservable requirement.
- For destructive/privileged actions, make target and consequence unambiguous.

## Accessibility
Require:
- semantic structure;
- keyboard support;
- logical focus order and visible focus;
- sufficient target sizes;
- programmatic labels/descriptions;
- non-color-only status communication;
- sensible screen-reader announcements for important dynamic changes.

## Responsive behavior
Design for content reflow, not merely scaled-down desktop. Test realistic long labels, validation messages, dense data, empty data, and narrow screens.

## Data-heavy/admin UI
For tables and dashboards consider:
- search/filter semantics;
- sorting clarity;
- pagination/virtualization for large sets;
- sticky context only when useful;
- bulk selection safety;
- confirmation and audit visibility for destructive changes;
- timezone/date formatting consistency.

## Perceived performance
Use skeletons/spinners only when they clarify progress. Avoid layout shift. Give immediate feedback for mutations. Preserve context when refreshing data.

## Error UX
Do not expose raw stack traces/provider messages. Give users the action they can take next, while server logs retain diagnostic detail.

## Design review gate
Confirm the UI remains usable with:
- slow network;
- empty data;
- long/unexpected content;
- error states;
- keyboard only;
- mobile/narrow view;
- insufficient permissions;
- repeated/double-click actions.
