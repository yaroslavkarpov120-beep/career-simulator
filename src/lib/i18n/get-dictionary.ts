import type { Dictionary, Locale } from "./types";
import { DEFAULT_LOCALE, LOCALES } from "./types";
import ru from "./locales/ru.json";
import en from "./locales/en.json";
import kk from "./locales/kk.json";
import uz from "./locales/uz.json";

const dictionaries: Record<Locale, Dictionary> = {
  ru: ru as Dictionary,
  en: en as Dictionary,
  kk: kk as Dictionary,
  uz: uz as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function resolveLocale(value?: string | null): Locale {
  if (value && isValidLocale(value)) return value;
  return DEFAULT_LOCALE;
}

/** Get nested key: "wizard.step1Title" */
export function t(dict: Dictionary, key: string): string {
  const parts = key.split(".");
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return key;
    }
  }
  return typeof cur === "string" ? cur : key;
}

export function tReplace(dict: Dictionary, key: string, vars: Record<string, string | number>): string {
  let s = t(dict, key);
  for (const [k, v] of Object.entries(vars)) {
    s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
  }
  return s;
}
