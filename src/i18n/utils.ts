import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, ""); // Remove trailing slash
  const pathname = url.pathname.replace(base, ""); // Remove base from path
  const [, lang] = pathname.split('/');
  
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}
