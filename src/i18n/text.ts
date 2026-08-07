import type { Locale } from "./config";

export type LocalizedText = { tw: string; en: string };

export function text(value: LocalizedText, locale: Locale) {
  return value[locale];
}

export function pickLocale<T>(locale: Locale, values: { tw: T; en: T }): T {
  return values[locale];
}
