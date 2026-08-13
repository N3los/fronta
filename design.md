# FRONTA website design system

This is the canonical visual and UI implementation contract for the FRONTA
website. `AGENTS.md` owns product and working rules; direct user instructions
override both documents for the task in which they are given.

## 1. Design character

FRONTA should feel precise, bold, technical, calm, and editorial:

- strong display typography with compact line-height;
- generous negative space and a clear section rhythm;
- off-white or near-black canvases with subtle grid or dot texture;
- red used deliberately for emphasis and interaction;
- thin borders and mostly flat surfaces;
- restrained motion that clarifies hierarchy and state.

Avoid generic dashboard styling, decorative shadows, gratuitous gradients,
excessive pills, and one-off visual recipes. New work should look like part of
the same studio, not like another template added to the site.

## 2. Foundations

### 2.1 Color roles

Components consume semantic roles instead of copying hex values.

| Role | Light | Dark | Current token |
| --- | --- | --- | --- |
| Canvas | `#fcfcfc` | `#0a0a0a` | `--fronta-bg` |
| Primary text | `#121212` | `#ffffff` | `--fronta-text` |
| Surface | `#ffffff` | `#141414` | `--fronta-card` |
| Muted text | `#52525b` | `#a1a1aa` | `--fronta-muted` |
| Subtle border | transparent black | transparent white | `--fronta-border` |
| Brand accent | `#ff2b2b` | `#ff2b2b` | `--fronta-red` |
| Signal yellow | `#ffcc00` | `#ffcc00` | `--fronta-orange` |

Red and yellow are accents, not extra text colors or alternate themes. Brand red
does not provide sufficient contrast for small normal text on the light canvas,
and white text on brand red is also unsuitable for small normal copy. Until
dedicated accessible action tokens are approved:

- use red for large display accents, icons, markers, borders, and decoration;
- use primary text on light surfaces for small interactive labels;
- verify any red button or small red text before shipping;
- never use pure black as a shortcut for `--fronta-text`.

The dotted/grid texture is a signature element. Reuse `.bg-dotted`, `.bg-grid`,
or `.section-studio`; do not make slightly different page-specific copies.

Keep immutable brand values and theme-adaptive system values as normal CSS
custom properties. Expose values that should generate Tailwind utilities as
purpose-based aliases in `@theme inline`, for example `--color-canvas`,
`--color-surface`, `--color-content`, `--color-content-muted`,
`--color-border-subtle`, and the approved action roles. This should produce
utilities such as `bg-canvas` and `text-content`, not implementation-oriented
names such as `bg-fronta-dark`.

### 2.2 Typography

| Role | Family | Use |
| --- | --- | --- |
| Body/UI | Inter | paragraphs, labels, navigation, buttons, forms |
| Display | Space Grotesk | page titles, section titles, statements |
| Mono | JetBrains Mono | compact metadata, kickers, technical labels |

Inter and Space Grotesk are loaded by the shared layout. JetBrains Mono is a
reserved token but is not currently loaded; load it before relying on its exact
appearance.

Use role-based, fluid sizing rather than creating a style for every observed
size:

| Role | Intended behavior |
| --- | --- |
| Display/Hero | fluid, visually dominant, very tight leading |
| Page title | shared `.page-title` contract |
| Section title | shared `.section-title` contract |
| Card title | clearly below its surrounding section title |
| Body/lead | readable measure and relaxed leading |
| Label/meta | compact, optionally mono and uppercase |

Heading sizes should descend clearly within a page. Semantic HTML hierarchy and
visual size are separate concerns, but neither may confuse the content
structure. Avoid arbitrary `text-[...]` values when an existing role fits.

### 2.3 Spacing and layout

Use a 4px base grid, with 8px as the normal component and layout rhythm. Values
such as 12px and 20px are valid half-steps.

Preferred spacing set:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 192px`

- Use `.section-container` for the shared `max-w-7xl` width and gutters.
- Keep major sections spacious; dense controls may use smaller steps.
- Preserve readable text measures instead of stretching copy full-width.
- Use `gap` for sibling rhythm and padding for component interior space.
- Use fluid values only for intentional responsive interpolation.
- Do not add an arbitrary value when a nearby scale value works.

### 2.4 Radius and depth

| Role | Radius |
| --- | --- |
| Small detail/control | `4px` |
| Default control/card | `12px` |
| Large media/panel | `16px` or `24px` |
| Pill | `rounded-full` |

Twelve pixels is the default. Pills are reserved for compact tags, badges, and
the navigation CTA. Zero radius is allowed when square geometry is deliberate.

Keep elevation mostly flat. Prefer surface contrast, borders, spacing, and
overlap. Use a shadow only to communicate interaction or layer separation; do
not create decorative shadow families.

### 2.5 Motion

Common feedback should finish in roughly 150-300ms. Longer motion is reserved
for page transitions, marquee behavior, deliberate reveals, or ambient effects.

Current ownership is:

- Lenis for smooth scrolling;
- Astro `ClientRouter` for page transitions;
- the shared `[data-animate]` system for reveal motion;
- component code/CSS for local state.

Use existing motion mechanisms before adding another. An installed dependency
is not active architecture without runtime imports. Every non-essential
animation must respect `prefers-reduced-motion`; content and controls must remain
visible and usable without motion.

## 3. Shared UI contracts

### Layout and navigation

- `src/layouts/Layout.astro` owns document metadata, locale alternates, fonts,
  view transitions, and global scripts.
- `Navbar.astro` and `Footer.astro` own site-wide navigation surfaces.
- Navigation must remain keyboard-usable and work on narrow screens without
  depending on hover.

### Headings and sections

- `PageHeading.astro` plus `.page-hero`, `.page-kicker`, `.page-title`, and
  `.page-lead` define shared subpage headings.
- The homepage hero is a signature composition and may remain specialized.
- `.section-container` is the default horizontal layout primitive.
- Reuse `.section-title`, `.section-subtitle`, and `.list-red-dash` instead of
  creating local copies.

### Actions and forms

- Use `.btn-primary`, `.btn-secondary`, `.btn-glass`, and `.btn-pill`.
- A new button class needs a different semantic role, not a minor spacing or
  breakpoint adjustment.
- Buttons and links need suitable focus, hover, disabled, and submission states.
- Inputs need labels, clear errors, keyboard access, and stable state changes.

### Cards, projects, and case studies

- Reuse shared card styles and data-driven project components before adding a
  page-specific card recipe.
- `ProjectEntry.astro` and `CaseStudy.astro` own repeated work-list structures.
- Images should preserve their aspect ratio and avoid layout shift. Important
  information cannot exist only on hover.

## 4. Tailwind, semantic CSS, and components

The project deliberately uses all three, with separate responsibilities:

1. **Astro components** own reusable markup, behavior, variants, and accessible
   structure.
2. **Semantic CSS classes** own repeated visual contracts and complex or
   signature styling.
3. **Tailwind utilities** own local composition and small responsive changes.

Use `@apply` inside a stable shared contract such as a button, page heading, or
list pattern. Do not wrap every utility string in a semantic class; that adds
indirection without reuse and recreates class sprawl.

Component variants belong to an Astro component API (`variant="primary"`) and
its owned semantic selectors, not to caller-assembled class recipes. A caller
may pass utilities for legitimate local composition such as `w-full sm:w-auto`,
but should not normally override the component's color, typography, radius, or
internal spacing contract.

Decision rule:

- repeated markup, behavior, or accessibility -> Astro component;
- repeated visual contract across components -> one semantic class;
- one-off layout or responsive adjustment -> utilities in the template;
- complex selectors, pseudo-elements, keyframes, or state -> scoped/shared CSS;
- a new visual value used repeatedly -> token first.

Selector ownership (target after consolidation):

- `src/styles/tokens.css`: canonical design and theme tokens;
- `src/styles/base.css`: document defaults and global accessibility behavior;
- `src/styles/global.css`: Tailwind entrypoint, imports, and only the few truly
  global layout/motion primitives;
- `src/styles/components/`: reusable cross-page UI contracts;
- `src/styles/sections/`: homepage signature sections;
- `src/styles/pages/`: styles genuinely owned by one route family;
- component-scoped styles: behavior or geometry private to one component.

Until the token/base split in the active consolidation plan is implemented,
`global.css` temporarily owns those first two layers.

Before creating a class, search for an equivalent. Avoid names that only
restate appearance (`.red-text-2`, `.big-card-new`) or one breakpoint. Prefer
role/ownership names such as `.page-kicker` or `.project-card__meta`.

## 5. Responsive and accessibility contract

Use mobile-first rules and add a breakpoint only when content or geometry needs
it. Check changed surfaces near 360px, 768px, 1024px, and a wide desktop size,
plus any width where the layout naturally breaks.

Required behavior:

- no accidental horizontal scroll or clipped content;
- practical mobile touch targets;
- logical content and focus order when columns collapse;
- visible focus and keyboard-operable interactions;
- color is not the only carrier of meaning;
- appropriate text/control contrast;
- intentional light and dark themes;
- reduced motion never hides content or blocks interaction.

## 6. Change protocol

1. Inspect the rendered context and search for existing tokens, components, and
   selectors.
2. Classify the change as local, shared pattern, or foundation change.
3. Make the smallest coherent change at the correct ownership layer.
4. Update this file when a foundation or shared contract changes.
5. Build and browser-check affected pages, states, languages, themes, and widths
   in proportion to risk.
6. Report an exception instead of silently creating a parallel rule.

Matching one screenshot is not enough. A successful change preserves the system
across routes, breakpoints, themes, states, and future reuse.
