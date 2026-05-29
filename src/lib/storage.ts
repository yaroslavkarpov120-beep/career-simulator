import type { SavedSimulation, SimulationResult, WizardInput } from "./schemas";
import { getSupabaseClient } from "./supabase";

const STORAGE_KEY = "career-simulator-simulations";
const RATE_KEY = "career-simulator-last-run";
const CHECKLIST_PREFIX = "career-simulator-checklist-";

export function getLocalSimulations(): SavedSimulation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedSimulation[];
  } catch {
    return [];
  }
}

export function saveLocalSimulation(
  input: WizardInput,
  result: SimulationResult,
  selectedProfessionId?: string
): SavedSimulation {
  const entry: SavedSimulation = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `sim-${Date.now()}`,
    input,
    result,
    selectedProfessionId,
    createdAt: new Date().toISOString(),
  };
  const all = getLocalSimulations();
  all.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, 20)));
  return entry;
}

export function canRunSimulationFree(): boolean {
  if (typeof window === "undefined") return true;
  const last = localStorage.getItem(RATE_KEY);
  if (!last) return true;
  const lastDate = new Date(last);
  const now = new Date();
  return (
    lastDate.getFullYear() !== now.getFullYear() ||
    lastDate.getMonth() !== now.getMonth() ||
    lastDate.getDate() !== now.getDate()
  );
}

export function markSimulationRun(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(RATE_KEY, new Date().toISOString());
}

/** Сброс дневного лимита (тест / если симуляция «застряла») */
export function resetDailyLimit(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RATE_KEY);
}

export function isPremiumUser(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("career-simulator-premium") === "true";
}

export function setPremiumUser(value: boolean): void {
  if (typeof window === "undefined") return;
  if (value) localStorage.setItem("career-simulator-premium", "true");
  else localStorage.removeItem("career-simulator-premium");
}

export function getChecklist(professionId: string): Record<number, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(`${CHECKLIST_PREFIX}${professionId}`);
    return raw ? (JSON.parse(raw) as Record<number, boolean>) : {};
  } catch {
    return {};
  }
}

export function toggleChecklistItem(
  professionId: string,
  index: number,
  done: boolean
): void {
  if (typeof window === "undefined") return;
  const current = getChecklist(professionId);
  current[index] = done;
  localStorage.setItem(
    `${CHECKLIST_PREFIX}${professionId}`,
    JSON.stringify(current)
  );
}

export async function saveToSupabase(
  input: WizardInput,
  result: SimulationResult,
  userId?: string
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return;

  await supabase.from("simulations").insert({
    user_id: userId,
    input_json: input,
    result_json: result,
  });
}
