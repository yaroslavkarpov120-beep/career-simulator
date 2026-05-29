import {
  buildProfession,
  cacheKey,
  generateAllProfessions,
  generateFeaturedProfessions,
  getSimulationDisclaimer,
  pickProfessions,
  pickProfessionHints,
  buildMatchReason,
  ALL_PROFESSION_IDS,
  CATALOG_COUNT,
  getFeaturedIds,
  getCatalogIndex,
} from "./professions-loader";
import type { Profession, WizardInput } from "./schemas";

export {
  buildMatchReason,
  cacheKey,
  generateAllProfessions,
  generateFeaturedProfessions,
  getSimulationDisclaimer,
  pickProfessions,
  pickProfessionHints,
  ALL_PROFESSION_IDS,
  CATALOG_COUNT,
  getFeaturedIds,
  getCatalogIndex,
};

export function generateFromCache(input: WizardInput): Profession[] {
  const ids = pickProfessions(input);
  return ids
    .map((id) => buildProfession(id, input))
    .filter((p): p is Profession => p !== null);
}
