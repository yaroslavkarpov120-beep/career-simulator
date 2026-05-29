import type { ProfessionCatalogEntry } from "./profession-catalog";

/** Template catalog rows start with «Проверка задач и почты» in day_timeline. */
export function isEnrichedProfession(entry: ProfessionCatalogEntry | null): boolean {
  if (!entry?.locales?.ru?.day_timeline?.[0]?.activity) return false;
  return !entry.locales.ru.day_timeline[0].activity.includes("Проверка задач");
}
