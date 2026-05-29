import type { ProfessionLocaleContent } from "./profession-catalog";
import type { Locale } from "./schemas";
import { getProfessionEntry } from "./professions-loader";

type ProfessionContent = {
  ai_risk_explanation: string;
  day_timeline: { time: string; activity: string }[];
  roadmap: { skill: string; months: number; first_step: string }[];
};

/** @deprecated Use catalog via professions-loader; kept for compatibility */
export function getLocalizedProfessionContent(
  professionId: string,
  locale: Locale,
  fallback: ProfessionContent
): ProfessionContent {
  const entry = getProfessionEntry(professionId);
  if (!entry) return fallback;
  const content: ProfessionLocaleContent | undefined =
    entry.locales[locale as "ru" | "en"] ?? entry.locales.en ?? entry.locales.ru;
  if (!content) return fallback;
  return {
    ai_risk_explanation: content.ai_risk_explanation,
    day_timeline: content.day_timeline,
    roadmap: content.roadmap,
  };
}

export type { ProfessionContent };
