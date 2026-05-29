import {
  CATALOG_COUNT,
  generateFeaturedProfessions,
  generateFromCache,
  getSimulationDisclaimer,
} from "./professions-cache";

export { CATALOG_COUNT };
import type { SimulationResult, WizardInput } from "./schemas";

export const DEMO_INPUT: WizardInput = {
  locale: "ru",
  age: 17,
  educationStage: "school_11",
  interests: ["code", "games"],
  interestsText: "люблю игры и визуал",
  avoid: ["routine"],
  skills: ["python"],
  countryCode: "RU",
  regionId: "ru-moscow",
  salaryMin: 80000,
  salaryMax: 180000,
  lifestyle: ["remote", "creativity"],
};

/** Избранные профессии для лендинга и демо (не весь каталог) */
export const DEMO_FEATURED_PROFESSIONS = generateFeaturedProfessions(DEMO_INPUT);

/** Hardcoded demo for landing — «17 лет, любит код» */
export const DEMO_RESULT: SimulationResult = {
  generated_at: new Date().toISOString(),
  disclaimer: getSimulationDisclaimer("ru"),
  professions: generateFromCache(DEMO_INPUT),
};
