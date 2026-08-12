// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import * as dotenv from 'dotenv';

// Load .env
dotenv.config();

// BASE_PATH can be set via env variable (e.g. in build-staging.js or shell)
const base = process.env.BASE_PATH || '/';
const basePath = base === '/' ? '' : base.replace(/\/$/, '');

// https://astro.build/config
export default defineConfig({
  site: 'https://fronta.hr',
  base: base,
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'hr'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.slice(basePath.length);
        return !/^\/(?:hr\/)?contact\/$/.test(pathname);
      },
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          hr: 'hr'
        }
      }
    })
  ]
});
