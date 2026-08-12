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

export function getRelativePathWithoutLang(url: URL) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathname = url.pathname.replace(base, "");
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length > 0 && parts[0] in ui) {
    return '/' + parts.slice(1).join('/');
  }
  return pathname || '/';
}

export function getLocalizedPath(lang: keyof typeof ui, path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const localizedPrefix = lang === defaultLang ? "" : `/${lang}`;
  const [pathname, hash] = path.split("#", 2);
  const cleanPath = pathname === "/"
    ? "/"
    : `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
  const suffix = hash ? `#${hash}` : "";

  return `${base}${localizedPrefix}${cleanPath}${suffix}`;
}
