---
name: fronta-maintain-design-system
description: Preserve and consolidate the FRONTA Astro website design system. Use for any FRONTA visual, responsive, accessibility, Astro component, Tailwind, CSS, theme, typography, spacing, radius, or motion change.
---

# Maintain the FRONTA design system

Use this workflow whenever a task can change the visual language or a shared UI
contract.

## Establish context

1. Read `AGENTS.md` and `design.md` completely.
2. For an actual consolidation phase, also read
   `plans/design-system-consolidation.md`.
3. Inspect `git status` and preserve unrelated changes.
4. Read the affected templates, components, styles, data, and translations.
5. Search for an existing token, selector, or component before creating one.

`design.md` is the visual source of truth. Current code is implementation
evidence, not automatic permission to repeat an inconsistency.

## Classify the change

- **Local composition:** unique layout or breakpoint adjustment on one surface.
- **Shared pattern:** repeated appearance or behavior on multiple surfaces.
- **Foundation:** token, typography, theme, spacing, radius, motion, or global
  accessibility behavior.

Choose the narrowest correct ownership layer. For a migration, follow the active
phase in the consolidation plan and remove superseded APIs in the same change.

## Choose the implementation form

1. Reuse an existing token, component, or semantic class.
2. Use/refine an Astro component for repeated markup, behavior, variants, or
   accessible structure.
3. Use Tailwind utilities for local composition and responsive adjustments.
4. Use semantic CSS for a repeated visual contract, complex selector,
   pseudo-element, keyframe, signature treatment, or shared state.
5. Add a token only for a deliberate value with system-level reuse.

`@apply` is appropriate inside stable shared contracts. Do not create a class
merely to hide one local utility string, and do not copy a large utility recipe
between templates.

If a shared/foundation decision changes, update `design.md` in the same task.
Do not document both a legacy rule and its replacement as equally valid.

## Protect and verify

- Keep EN/HR surfaces and data-driven projects/case studies aligned.
- Preserve keyboard, focus, validation, disabled, and submission states.
- Check light/dark themes, mobile/desktop behavior, overflow, and reduced motion.
- Run relevant checks and `npm.cmd run build` when rendering, routes, styles, or
  production output can change.
- Inspect the final diff for duplicate selectors, abandoned classes, arbitrary
  values, and accidental scope.
- Report what was verified and any remaining exception.

Do not commit, push, deploy, or mutate external services without current user
authorization.
