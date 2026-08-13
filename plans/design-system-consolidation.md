# FRONTA design-system consolidation

Status: active roadmap; implementation not started

Updated: 2026-08-13

## Purpose

Consolidate the existing FRONTA UI without redesigning it. The result should
have fewer ways to create the same interface, clear ownership between tokens,
Astro components, Tailwind utilities, and semantic CSS, plus repeatable visual
verification.

`design.md` defines the desired system. This file tracks only migration order,
open decisions, and completion. It does not authorize a commit, push, FTP
deployment, or production change.

## Progress

| Phase | Status |
| --- | --- |
| 0. Decisions and baselines | Not started |
| 1. Tokens and base styles | Not started |
| 2. Shared UI components | Not started |
| 3. Editorial subpages | Not started |
| 4. Work and signature sections | Not started |
| 5. Dead code and dependencies | Not started |
| 6. Regression guardrails | Not started |

Update this table when a phase is verified. Do not mark a phase complete from
code changes alone.

## Problems this migration must resolve

- inaccessible uses of brand red and light-theme-only failures;
- declared typography roles that are not actually loaded;
- duplicate selector ownership and repeated `@apply` recipes;
- page-prefixed classes that rename one-off utility bundles;
- repeated button, marker, arrow-link, and editorial-layout markup;
- stale selectors, legacy animation branches, and unused dependencies;
- lack of a small automated check against new design-system drift.

Verify individual occurrences before changing or deleting them. Dynamic classes
can look unused to static search.

## Migration rules

- Work phase by phase in small, reviewable changes.
- Preserve the current visual identity and user behavior unless a decision below
  explicitly changes them.
- Remove a superseded selector or API in the same change that removes its last
  call site.
- Do not build a generic abstraction for a signature composition.
- Keep EN/HR, light/dark, mobile/desktop, keyboard, and reduced-motion behavior
  in scope for every affected surface.
- Record permanent visual decisions in `design.md`, not in this roadmap.

## Implementation contract

The migration follows one consistent split:

1. **Semantic Tailwind tokens:** immutable brand values and theme-adaptive CSS
   variables are exposed through purpose-based `@theme inline` aliases. Prefer
   utilities such as `bg-canvas`, `text-content`, `border-border-subtle`, and
   `rounded-control` over raw values or implementation-oriented names.
2. **Astro component APIs:** repeated markup, behavior, accessibility, and
   variants are expressed through props such as `variant="primary"`; callers do
   not reconstruct component variants from class recipes.
3. **Semantic CSS:** `@apply` is limited to stable repeated visual contracts.
   Native CSS owns complex selectors, pseudo-elements, keyframes, calculated
   geometry, and signature compositions.
4. **Tailwind utilities in templates:** local layout and responsive adjustments
   remain visible at the call site, for example `w-full sm:w-auto` or a unique
   responsive grid.
5. **Explicit exceptions:** a semantic class used once is valid only when it
   owns complex behavior or signature art direction. Record the reason in code
   or the design audit allowlist.

## Recommended execution profiles

Use these profiles when starting a separate implementation session. `sol` is
preferred for system design, ambiguous ownership, and visually risky work;
`terra` is appropriate for bounded migrations with an already-approved pattern.

| Phase | Model | Thinking | Why |
| --- | --- | --- | --- |
| 0. Decisions and baselines | `gpt-5.6-sol` | `high` | Reconciles product decisions, accessibility, themes, and visual evidence; unresolved choices still require user approval. |
| 1. Tokens and base styles | `gpt-5.6-sol` | `xhigh` | Highest cross-site regression risk; requires careful CSS cascade, Tailwind 4, theme, and contrast reasoning. |
| 2. Shared UI components | `gpt-5.6-sol` | `high` | Defines APIs and accessibility contracts that later phases depend on. |
| 3. Editorial subpages | `gpt-5.6-terra` | `high` | Mostly bounded, repeatable migration after the component contracts are approved. Use `sol` with `high` for the final cross-page review. |
| 4. Work and signature sections | `gpt-5.6-sol` | `xhigh` | Signature layouts, sticky behavior, media variants, and motion need stronger visual and interaction reasoning. |
| 5. Dead code and dependencies | `gpt-5.6-terra` | `high` | Efficient for inventory and mechanical cleanup; switch to `sol` with `high` if ownership or runtime usage is ambiguous. |
| 6. Regression guardrails | `gpt-5.6-sol` | `xhigh` | The audit must catch drift without producing noisy false positives or blocking valid signature CSS. |
| Final completion gate | `gpt-5.6-sol` | `high` | Independent system-level review across code, routes, themes, widths, accessibility, and release checks. |

Do not use Low thinking for a consolidation phase. Medium is acceptable only
for a small follow-up with exact files, an established pattern, and no token,
component API, accessibility, or dependency decision.

## Phase 0: decisions and baselines

Decide before changing foundation code:

1. Approve an accessible action-color strategy while keeping brand red
   unchanged.
2. Decide whether the site follows OS theme only or adds a user theme control.
3. Confirm that JetBrains Mono should be loaded, or choose the real mono family.
4. Capture local visual baselines for Home, Services, Work, one case study,
   Project, Privacy, and Impressum at representative mobile, tablet, and desktop
   widths in both themes. Include EN/HR where copy length changes layout.

Done when the decisions are recorded in `design.md` and the baselines cover
hover, focus, mobile menu, form, and reduced-motion states.

## Phase 1: tokens and base styles

Target structure:

- add `src/styles/tokens.css`;
- add `src/styles/base.css`;
- keep `src/styles/global.css` as the Tailwind entrypoint and import owner;
- update `src/layouts/Layout.astro` only if font loading changes.

Actions:

1. Separate immutable brand primitives from theme-adaptive semantic roles.
2. Move color, type, radius, motion, pattern, header, and content-width values
   into tokens without visual drift.
3. Expose reusable roles through purpose-based `@theme inline` aliases, yielding
   utilities such as `bg-canvas`, `text-content`, and `rounded-control`.
4. Inventory generic palette and arbitrary-value utilities; migrate UI meaning
   to semantic utilities without disabling Tailwind's defaults in one risky
   global change.
5. Add approved accessible action/on-action/hover tokens separately from
   immutable brand colors.
6. Fix the light-theme kicker/logo treatment and load the approved mono family.
7. Remove global element styling that incorrectly forces every instance into
   one responsive role.

Done when both themes match the approved baseline, interactive contrast passes,
repeated foundation literals are removed, and build/SEO checks pass.

## Phase 2: shared UI components

Add only as proven by repeated call sites:

- `src/components/ui/ButtonLink.astro`;
- `src/components/ui/Button.astro`;
- `src/components/ui/SectionMarker.astro`;
- `src/components/ui/ArrowLink.astro`;
- `src/components/layout/EditorialSection.astro`.

Keep button and link semantics separate while sharing visual roles. Express
visual variants through component props and owned semantic selectors. Preserve
caller-provided classes for legitimate local responsive composition, but do not
use that escape hatch to override component color, typography, radius, or
internal spacing.

Done when repeated markup/behavior is component-owned, variants are explicit,
and keyboard focus, disabled state, touch size, and reduced motion are verified.

## Phase 3: editorial subpages

Migration order:

1. About
2. Services
3. Process
4. B2B
5. Privacy and Impressum

Use existing/shared heading, section, marker, and action contracts. Convert
single-use page aliases to readable utilities or owner-scoped styles. Promote a
pattern only after genuine reuse is proven. Keep unique responsive grids and
spacing utilities directly in the template instead of renaming them with a
page-prefixed semantic class.

Done when marketing pages no longer copy the same grid, heading, body, and
section-spacing recipes; legal pages share one semantic content layout; and
EN/HR wrapping passes at narrow, middle, and wide widths.

## Phase 4: work and signature sections

Scope:

- `src/components/sections/*` and `src/styles/sections/*`;
- `src/components/work/*`;
- `src/styles/pages/work.css` and `case-study.css`.

Keep Hero, Portfolio, Methodology, marquee, project flow, and case-study layouts
signature-specific. Reuse surrounding action, marker, typography, and spacing
roles. Share media framing only when the website/app/case-study variants form a
stable API. Single-use semantic selectors remain allowed here when they own
complex state, geometry, motion, or recognizable art direction.

Done when signature behavior remains intact, project/case-study media and sticky
behavior are browser-tested, and shared CSS needs no page-specific exception
matrix.

## Phase 5: dead code and dependencies

1. Manually confirm and remove unused selectors and the obsolete reveal branch.
2. Establish one owner for every shared selector, including `.nav-link`.
3. Normalize style imports and documentation claims against runtime imports.
4. Remove GSAP, Barba, and Three only after source/build verification proves
   they are unused and the user explicitly approves dependency cleanup.

Done when the manually triaged dead-code set is removed and all routes, the
project form, and case studies pass build and browser smoke tests.

## Phase 6: regression guardrails

Add a small dependency-free `src/scripts/design-audit.js` and `audit:design`
script. It should report or fail, with a reasoned allowlist, for:

- raw colors outside approved token/media files;
- duplicate external selector ownership;
- new arbitrary type, tracking, radius, or duration values;
- apparently unused external selectors, with dynamic variants accounted for;
- page-level copies of protected shared patterns;
- missing light/dark token pairs.
- new one-use external semantic classes, reported as warnings with signature
  exceptions allowed;
- repeated long utility recipes across templates that should become components.

Add it to `release:check` only when current debt is removed or explicitly
allowlisted, so the check starts green.

Done when a new duplicate selector or raw UI color is caught locally, every
exception has a reason/owner, and `release:check` passes.

## Completion gate

The consolidation is finished only when:

- repeated values have named roles and repeated structure is component-owned;
- Tailwind remains the tool for clear local/responsive composition;
- every semantic selector has one owner and a reusable or complex purpose;
- no known interactive contrast or theme failure remains;
- build, SEO audit, design audit, and the affected browser matrix pass;
- the result still reads immediately as the current FRONTA website.

After the completion gate is verified, delete this roadmap and keep only the
permanent rules in `design.md`, `AGENTS.md`, and `README.md`.
