export const locales = ["tw", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tw";

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function localeToHtmlLang(locale: Locale) {
  return locale === "en" ? "en" : "zh-Hant-TW";
}

export function localeToIntl(locale: Locale) {
  return locale === "en" ? "en-US" : "zh-TW";
}

export function localizeHref(href: string, locale: Locale) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (href === "/") return `/${locale}`;
  if (href === "/tw" || href.startsWith("/tw/") || href === "/en" || href.startsWith("/en/")) {
    return href;
  }
  return `/${locale}${href}`;
}

export function switchLocaleHref(pathname: string, locale: Locale) {
  const path = pathname.replace(/^\/(tw|en)(?=\/|$)/, "") || "/";
  return localizeHref(path, locale);
}
