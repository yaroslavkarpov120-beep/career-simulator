import { generateFromCache, getSimulationDisclaimer } from "./professions-cache";
import type { SimulationResult, WizardInput } from "./schemas";

/** Runs fully in the browser when API is unavailable */
export function simulateOnClient(input: WizardInput): SimulationResult {
  return {
    professions: generateFromCache(input),
    generated_at: new Date().toISOString(),
    disclaimer: getSimulationDisclaimer(input.locale),
  };
}
