# FRONTA website

Source code for [fronta.hr](https://fronta.hr), the bilingual (English and Croatian) website of FRONTA, a design and development studio.

Built with Astro as a static site. Production is deployed by FTP to `/public_html`; the deploy process is incremental and deliberately preserves unrelated folders already on the server.

## Stack

- Astro 6 with static output
- TypeScript and Astro components
- Tailwind CSS 4 with semantic CSS organised by component, section, and page
- Lenis, Astro view transitions and a small declarative reveal system
- Formspree for the project enquiry form
- Astro Sitemap and the project SEO audit script

Requires Node.js 22.12 or newer.

## Local development

```sh
npm install
npm run dev
```

The development site runs at `http://localhost:4321`.

On Windows, use the `npm.cmd` form if `npm` is not available in the current shell:

```powershell
npm.cmd run dev
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Generate a production build in `dist/`. |
| `npm run preview` | Preview the last local build. |
| `npm run audit:seo` | Audit the generated production build for sitemap, canonical, hreflang, metadata, structured data and icon issues. Run after a build. |
| `npm run release:check` | Build production and run the SEO audit. Use before every production release. |
| `npm run build:staging` | Build the former `/2026` staging version. Kept for maintenance only. |
| `npm run deploy:staging:dry` | Show a staging deployment plan without changing the server. |
| `npm run deploy:production:dry` | Show a production deployment plan without changing the server. |
| `npm run deploy:production` | Build and deploy to `https://fronta.hr/`. Requires FTP settings locally. |

## Content and routes

Routes are generated through `src/pages/[...lang]/`. English is the default language and Croatian is prefixed with `/hr/`.

| Page | English | Croatian |
| --- | --- | --- |
| Homepage | `/` | `/hr/` |
| About | `/about/` | `/hr/about/` |
| Services | `/services/` | `/hr/services/` |
| Process | `/process/` | `/hr/process/` |
| Work | `/work/` | `/hr/work/` |
| Project enquiry | `/project/` | `/hr/project/` |
| Impressum | `/impressum/` | `/hr/impressum/` |

### Editing text

All visible English and Croatian strings are centralised in `src/i18n/ui.ts`. Add or amend the key in both language objects, then use `t('your.key')` in the relevant component or page. Do not introduce hard-coded copy in page components unless it is truly non-localised technical content.

### Adding a portfolio project

1. Add the project preview image under `src/assets/projects/`.
2. Add its project definition in `src/data/projects.ts`.
3. Add English and Croatian project text in `src/i18n/ui.ts`.
4. Set `featured: true` when it should appear on the homepage.
5. Add a case study only when there is enough material to tell a useful story. The project can otherwise link directly to its live website.

### Adding a case study

1. Add the visual assets under `src/assets/projects/<project-slug>/`.
2. Define the case study in `src/data/caseStudies.ts` and connect it to the project ID.
3. Add all referenced translation keys in both languages in `src/i18n/ui.ts`.
4. The dynamic route at `src/pages/[...lang]/work/[slug].astro` creates the EN and HR detail pages automatically.

## Form

The multi-step project form is in `src/pages/[...lang]/project.astro`; client-side submission and feedback states are handled by `src/scripts/onboarding.js`.

The Formspree form ID is intentionally public because it is used as a browser form endpoint. It is not an FTP credential. If the Formspree endpoint changes, update both `action` and `data-formspree-endpoint` together in `project.astro`.

## SEO and public files

- `astro.config.mjs` defines the canonical origin (`https://fronta.hr`), trailing slashes, i18n and sitemap generation.
- `src/layouts/Layout.astro` owns page metadata, canonical URLs, hreflang, Open Graph, JSON-LD and the Google Search Console verification tag.
- `public/robots.txt` advertises `https://fronta.hr/sitemap-index.xml`.
- `public/.htaccess` enforces HTTPS and the non-`www` canonical host, redirects direct `index` / `index.html` variants to clean URLs, and preserves legacy redirects.
- `public/og-default.png` is the fallback social image.
- `public/favicon-32.png`, `public/icon-192.png`, `public/icon-512.png`, and `public/apple-touch-icon.png` are the current FRONTA icons.

When changing routes, SEO metadata, icons, or public URLs, always run:

```sh
npm run release:check
```

## Deployment

### Credentials

Deployment credentials live only in the local `.env` file, which is ignored by Git. Never commit it, paste it into issues, or add credentials to `README.md`.

The local environment requires these variables:

```text
FTP_HOST=
FTP_USER=
FTP_PASSWORD=
FTP_REMOTE_PATH=
FTP_PRODUCTION_PATH=
```

`FTP_REMOTE_PATH` is used for the legacy staging path. `FTP_PRODUCTION_PATH` must point to the intended production directory. The script will infer the production parent directory when the staging path ends in `/2026`.

### Safe release flow

1. Run `npm run release:check`.
2. Run `npm run deploy:production:dry` and inspect the target and upload count.
3. Run `npm run deploy:production` only after confirming the target is `/public_html`.
4. Smoke-test the live homepage, Croatian homepage, project form, sitemap and redirects.

Production deploys do not delete remotely existing files or directories. The deployment script writes a local rollback snapshot to `.deploy-backups/` before replacing changed files; this directory is ignored by Git.

Do not manually delete unknown items from `/public_html`: it also contains unrelated client-work folders and server files.

## Git workflow

The remote is GitHub: `https://github.com/N3los/fronta.git` on the `main` branch.

Before committing:

```sh
git status
npm run release:check
```

Keep `.env`, `.deploy-backups/`, `dist/`, `node_modules/`, and temporary visual-check screenshots out of commits. A production FTP deploy and a Git push are separate actions; do both intentionally.

## Maintenance checklist

- Read `AGENTS.md` before changing the project. For visual or responsive work,
  also read `design.md`.
- Keep EN and HR copy in sync.
- Use clean trailing-slash links internally, for example `/work/`, never `/work` or `/work/index.html`.
- Verify the enquiry form after changes to its steps or Formspree settings.
- Run the production build and SEO audit before a release.
- After SEO routing changes, submit the sitemap in Google Search Console and use **Validate fix** where appropriate; crawl reports update only after Google revisits the affected URLs.
