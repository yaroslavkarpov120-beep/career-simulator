import type { Dictionary } from "./i18n/types";
import type { Locale } from "./i18n/types";
import type { EducationStage } from "./schemas";
import {
  getProfessionSummary as getSummaryFromCatalog,
  getProfessionTiming as getTimingFromCatalog,
} from "./professions-loader";

export function getEducationStageLabel(
  stage: EducationStage | string,
  dict: Dictionary
): string {
  const key = stage as keyof typeof dict.educationStage;
  return dict.educationStage[key] ?? String(stage);
}

export function getProfessionSummary(
  professionId: string,
  locale: Locale
): string | null {
  return getSummaryFromCatalog(professionId, locale);
}

export function getProfessionTiming(
  professionId: string,
  age: number,
  educationStage: EducationStage | string,
  locale: Locale,
  dict: Dictionary
): string | null {
  return getTimingFromCatalog(
    professionId,
    age,
    educationStage,
    locale,
    dict
  );
}
