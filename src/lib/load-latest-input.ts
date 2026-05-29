import { normalizeWizardInput, type WizardInput } from "./schemas";
import { getLocalSimulations } from "./storage";

const INPUT_KEY = "career-simulator-latest-input";

export function loadLatestWizardInput(): WizardInput | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(INPUT_KEY);
    if (raw) return normalizeWizardInput(JSON.parse(raw));
  } catch {
    /* ignore */
  }
  const saved = getLocalSimulations()[0];
  if (saved?.input) {
    try {
      return normalizeWizardInput(saved.input);
    } catch {
      return null;
    }
  }
  return null;
}
