export const locales = ["en", "uk"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isValidLocale(
  locale: string | undefined
): locale is Locale {
  return locales.includes(locale as Locale);
}