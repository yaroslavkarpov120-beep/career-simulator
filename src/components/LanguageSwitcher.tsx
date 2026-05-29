"use client";

import { LOCALES, type Locale } from "@/lib/i18n/types";
import { useLocale } from "./LocaleProvider";

const LABELS: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  kk: "KZ",
  uz: "UZ",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex gap-1 rounded-lg bg-white/5 p-0.5">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition ${
            locale === l
              ? "bg-brand-600 text-white"
              : "text-[var(--muted)] hover:text-white"
          }`}
          aria-label={l}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
