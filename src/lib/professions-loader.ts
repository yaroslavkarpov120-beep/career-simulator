import catalogData from "@/data/professions.json";
import indexData from "@/data/professions-index.json";
import {
  FEATURED_PROFESSION_IDS,
  professionCatalogSchema,
  professionIndexSchema,
  type ProfessionCatalogEntry,
  type ProfessionIndexEntry,
  type ProfessionLocaleContent,
} from "./profession-catalog";
import { getDictionary, tReplace } from "./i18n/get-dictionary";
import { getRegion } from "./regions";
import type { Locale, Profession, WizardInput } from "./schemas";

const parsedCatalog = professionCatalogSchema.parse(catalogData);
const parsedIndex = professionIndexSchema.parse(indexData);

const byId = new Map<string, ProfessionCatalogEntry>(
  parsedCatalog.professions.map((p) => [p.id, p])
);

export const CATALOG_COUNT = parsedCatalog.count;
export const ALL_PROFESSION_IDS = parsedCatalog.professions.map((p) => p.id);

export function getCatalog(): ProfessionCatalogEntry[] {
  return parsedCatalog.professions;
}

export function getCatalogIndex(): ProfessionIndexEntry[] {
  return parsedIndex.professions;
}

export function getProfessionEntry(id: string): ProfessionCatalogEntry | null {
  return byId.get(id) ?? null;
}

export function getFeaturedIds(): string[] {
  const featured = parsedIndex.professions
    .filter((p) => p.featured)
    .map((p) => p.id);
  if (featured.length >= 8) return featured.slice(0, 10);
  return [...FEATURED_PROFESSION_IDS];
}

function pickLocalized<T extends Record<string, string>>(
  obj: T,
  locale: Locale
): string {
  return obj[locale] ?? obj.en ?? obj.ru;
}

function getLocaleContent(
  entry: ProfessionCatalogEntry,
  locale: Locale
): ProfessionLocaleContent {
  const loc = entry.locales;
  return (
    (loc[locale as "ru" | "en"] as ProfessionLocaleContent | undefined) ??
    loc.en ??
    loc.ru
  );
}

function adjustSalary(
  entry: ProfessionCatalogEntry,
  input: WizardInput
): { salary_min: number; salary_max: number; currency: string } {
  const region = getRegion(input.regionId);
  const multiplier = region?.costMultiplier ?? 1;
  const currency = region?.currency ?? "RUB";
  const userMid = (input.salaryMin + input.salaryMax) / 2;
  const regionDefaultMid = region
    ? (region.salaryDefaults.min + region.salaryDefaults.max) / 2
    : 100000;
  const scale =
    userMid > 0 && regionDefaultMid > 0
      ? Math.min(1.4, Math.max(0.7, userMid / regionDefaultMid))
      : 1;

  return {
    salary_min: Math.round(entry.salaryBase.min * multiplier * scale),
    salary_max: Math.round(entry.salaryBase.max * multiplier * scale),
    currency,
  };
}

export function buildMatchReason(title: string, input: WizardInput): string {
  const dict = getDictionary(input.locale);
  const region = getRegion(input.regionId);
  const cityKey = region?.cityLabelKey.replace("city.", "") ?? "ru_moscow";
  const regionLabel =
    dict.city[cityKey as keyof typeof dict.city] ?? cityKey;
  const interests = input.interests
    .slice(0, 3)
    .map((k) => dict.interests[k as keyof typeof dict.interests] ?? k)
    .join(", ");
  const lifestyle = input.lifestyle
    .slice(0, 2)
    .map((k) => dict.lifestyle[k as keyof typeof dict.lifestyle] ?? k)
    .join(", ");

  return tReplace(dict, "matchReason", {
    interests,
    lifestyle,
    title,
    region: regionLabel,
  });
}

export function buildProfession(id: string, input: WizardInput): Profession | null {
  const entry = byId.get(id);
  if (!entry) return null;
  const salary = adjustSalary(entry, input);
  const content = getLocaleContent(entry, input.locale);
  const title = pickLocalized(entry.title, input.locale);

  return {
    id: entry.id,
    title,
    ...salary,
    ai_risk_percent: entry.ai_risk_percent,
    ai_risk_explanation: content.ai_risk_explanation,
    day_timeline: content.day_timeline,
    roadmap: content.roadmap,
    match_reason: buildMatchReason(title, input),
  };
}

export function generateAllProfessions(input: WizardInput): Profession[] {
  return ALL_PROFESSION_IDS.map((id) => buildProfession(id, input)).filter(
    (p): p is Profession => p !== null
  );
}

export function generateFeaturedProfessions(input: WizardInput): Profession[] {
  return getFeaturedIds()
    .map((id) => buildProfession(id, input))
    .filter((p): p is Profession => p !== null);
}

function overlap(a: string[], b: string[]): number {
  const set = new Set(b);
  return a.filter((x) => set.has(x)).length;
}

function scoreProfession(
  entry: ProfessionCatalogEntry,
  input: WizardInput
): number {
  let score = 0;
  const text = `${input.interests.join(" ")} ${input.interestsText ?? ""}`.toLowerCase();

  score += overlap(input.interests, entry.tags.interests) * 3;

  for (const interest of entry.tags.interests) {
    if (text.includes(interest)) score += 1.5;
  }

  for (const skill of input.skills ?? []) {
    if (entry.tags.skills?.includes(skill)) score += 2;
  }

  for (const avoid of input.avoid) {
    const penalty = entry.tags.avoidPenalties?.[avoid];
    if (penalty) score += penalty;
  }

  if (entry.tags.stages?.includes(input.educationStage)) {
    score += 2;
  }

  for (const ls of input.lifestyle) {
    if (entry.tags.lifestyle?.includes(ls)) score += 1.5;
  }

  if (input.lifestyle.includes("creativity")) {
    if (entry.category === "creative" || entry.category === "media") score += 1;
  }
  if (input.lifestyle.includes("low_stress")) {
    if (entry.category === "medicine" && entry.id === "nurse") score -= 2;
    if (entry.category === "it" && entry.id === "data-analyst") score += 1;
  }
  if (input.lifestyle.includes("remote")) {
    if (entry.category === "it") score += 1.5;
  }
  if (input.lifestyle.includes("travel")) {
    if (entry.category === "hospitality" || entry.category === "media") score += 1;
  }

  if (input.age < 18) {
    if (entry.id === "nurse" || entry.id === "product-manager") score -= 1;
    if (entry.category === "trades" || entry.category === "creative") score += 0.5;
  }

  if (input.motivationFocus === "income" || input.motivationFocus === "prestige") {
    if (entry.category === "business" || entry.category === "it") score += 0.5;
  }
  if (input.motivationFocus === "impact") {
    if (entry.category === "public" || entry.category === "education") score += 1;
  }
  if (input.orgType === "startup") {
    if (entry.category === "it" || entry.category === "creative") score += 0.5;
  }
  if (input.orgType === "public_sector") {
    if (entry.category === "public" || entry.category === "education") score += 1;
  }
  if (input.teamPreference === "solo") {
    if (entry.category === "creative" || entry.category === "trades") score += 0.5;
  }

  return score;
}

export function pickProfessions(input: WizardInput): string[] {
  const scored = parsedCatalog.professions
    .map((entry) => ({ id: entry.id, score: scoreProfession(entry, input) }))
    .sort((a, b) => b.score - a.score);

  const picked = scored
    .filter((s) => s.score > -2)
    .slice(0, 5)
    .map((s) => s.id);

  const defaults = getFeaturedIds().slice(0, 5);
  while (picked.length < 5) {
    const next = defaults.find((d) => !picked.includes(d));
    if (!next) {
      const fallback = ALL_PROFESSION_IDS.find((id) => !picked.includes(id));
      if (!fallback) break;
      picked.push(fallback);
    } else {
      picked.push(next);
    }
  }

  return picked.slice(0, 5);
}

export function pickProfessionHints(input: WizardInput, limit = 30): string[] {
  return parsedCatalog.professions
    .map((entry) => ({ id: entry.id, score: scoreProfession(entry, input) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.id);
}

export function getProfessionSummary(
  professionId: string,
  locale: Locale
): string | null {
  const entry = byId.get(professionId);
  if (!entry) return null;
  return getLocaleContent(entry, locale).summary;
}

export function getProfessionTiming(
  professionId: string,
  age: number,
  educationStage: string,
  locale: Locale,
  dict: ReturnType<typeof getDictionary>
): string | null {
  const entry = byId.get(professionId);
  if (!entry) return null;
  const template = getLocaleContent(entry, locale).timing;
  const stageKey = educationStage as keyof typeof dict.educationStage;
  const stageLabel = dict.educationStage[stageKey] ?? String(educationStage);
  return template
    .replace(/\{age\}/g, String(age))
    .replace(/\{stageLabel\}/g, stageLabel);
}

export function cacheKey(input: WizardInput): string {
  return JSON.stringify({
    locale: input.locale,
    age: input.age,
    stage: input.educationStage,
    i: [...input.interests].sort(),
    t: input.interestsText,
    a: [...input.avoid].sort(),
    sk: [...(input.skills ?? [])].sort(),
    cc: input.countryCode,
    r: input.regionId,
    s: [input.salaryMin, input.salaryMax],
    l: [...input.lifestyle].sort(),
  })
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function getSimulationDisclaimer(locale: Locale): string {
  return getDictionary(locale).simulationDisclaimer;
}
