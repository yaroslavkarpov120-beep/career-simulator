import indexData from "@/data/professions-index.json";
import { professionIndexSchema, type ProfessionIndexEntry } from "./profession-catalog";
import type { Locale } from "./schemas";

const parsed = professionIndexSchema.parse(indexData);

export function getCatalogIndexEntries(): ProfessionIndexEntry[] {
  return parsed.professions;
}

export function filterCatalogIndex(
  entries: ProfessionIndexEntry[],
  opts: {
    search: string;
    category: string;
    locale: Locale;
  }
): ProfessionIndexEntry[] {
  const q = opts.search.trim().toLowerCase();
  return entries.filter((e) => {
    if (opts.category !== "all" && e.category !== opts.category) return false;
    if (!q) return true;
    const title =
      opts.locale === "en" ? e.title.en : e.title.ru;
    return (
      e.id.includes(q) ||
      title.toLowerCase().includes(q) ||
      e.title.ru.toLowerCase().includes(q) ||
      e.title.en.toLowerCase().includes(q)
    );
  });
}

export function pickTitle(entry: ProfessionIndexEntry, locale: Locale): string {
  if (locale === "en") return entry.title.en;
  if (locale === "kk" || locale === "uz") return entry.title.ru;
  return entry.title.ru;
}
