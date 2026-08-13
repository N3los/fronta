# FRONTA website agent guide

This file defines how agents work in this repository. Read `README.md` first for
the project structure and commands. Before editing, inspect `git status` and the
relevant implementation so existing user work is not overwritten.

For every visual, responsive, accessibility, Astro component, Tailwind, CSS,
theme, typography, spacing, radius, or motion task, read `design.md` and use the
repository skill at `.agents/skills/fronta-maintain-design-system/SKILL.md`.

## Documentation ownership

- `README.md` is the human-facing project and operations guide.
- `AGENTS.md` owns agent behavior, product context, and release safety.
- `design.md` owns visual and UI implementation decisions.
- The repository skill owns the repeatable workflow for design-system work.

Do not duplicate the same rules across documents. Create another permanent
Markdown file only when it has a distinct audience and long-term owner. A task
plan is temporary working material, not a second source of truth.

## Product and content

- This is the FRONTA company website, not a personal portfolio.
- FRONTA may be described as a focused studio. Do not frame the company through
  limitations, dependence on partners, or headcount.
- Core work is websites and webshops, web applications, and B2B delivery.
  Hosting and maintenance are supporting context, not the main offer.
- Keep the homepage methodology section substantive. Keep B2B concise on its
  dedicated page instead of duplicating a large B2B block on the homepage.
- English and Croatian are equal product surfaces. When changing visible copy,
  update both languages and keep shared UI copy in `src/i18n/ui.ts` where the
  existing architecture expects it.
- Copy should be direct, natural, concise, and specific. Avoid hype, generic AI
  language, and claims that cannot be verified.
- Keep the main CTA meaning aligned with "Start your project" / "Započnite
  projekt" unless the user explicitly changes the conversion strategy.
- Never invent dates, client results, metrics, testimonials, capabilities, or
  project status. Omit unknown facts or ask the user.

## Architecture and implementation

- Preserve the English root routes and matching `/hr/` routes.
- Keep project and case-study content data-driven through `src/data/projects.ts`
  and `src/data/caseStudies.ts`; do not fork equivalent page markup per item.
- Preserve shared layout, SEO, locale, navigation, and footer behavior unless a
  task explicitly changes their contract.
- Treat the project form as a conversion path: keep labels, validation, focus,
  keyboard use, submission state, and both languages working.
- Prefer the smallest coherent change. Reuse an existing token, component, or
  pattern before adding another one.
- Repeated structure or behavior belongs in an Astro component. Do not solve
  repeated UI with a growing collection of near-identical CSS classes.
- Do not broaden a visual task into dependency removal, architecture migration,
  or unrelated cleanup without explicit scope.
- Preserve unrelated modifications in a dirty worktree.

## Verification

Match verification effort to risk:

1. Review `git diff` and `git status` for accidental scope.
2. Run the relevant checks from `README.md`; run `npm run build` for changes that
   can affect routes, rendering, styles, content data, or production output.
3. Browser-check changed user flows rather than relying on a successful build.
4. For visual work, check mobile and desktop, light and dark themes, focus and
   hover states, overflow, and reduced motion as applicable.
5. If release is requested, verify the real public URL after deployment.

Do not claim that a task, build, or release passed unless it was actually
verified. Report anything that could not be checked.

## Git, deployment, and secrets

- Do not commit, push, deploy, or change external services unless the user has
  explicitly authorized that action in the current task.
- Before any authorized commit or release, inspect the exact changed/staged
  files and keep unrelated work out.
- Prefer dry runs for deployment tooling when available.
- Never print or commit credentials, tokens, private keys, or environment-file
  contents.
